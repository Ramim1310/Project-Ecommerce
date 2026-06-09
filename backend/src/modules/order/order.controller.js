const orderService = require('./order.service');
const paymentService = require('./payment.service');
const asyncHandler = require('../../middleware/asyncHandler');

class OrderController {
  createOrder = asyncHandler(async (req, res) => {
    const { items, totalAmount, shippingAddress } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart payload is empty." });
    }

    try {
      const order = await orderService.processNewOrder({
        userId,
        items,
        totalAmount,
        shippingAddress
      });

      const gatewayUrl = await paymentService.initiatePayment(order, req.user);

      return res.status(201).json({
        success: true,
        message: "Payment Gateway initiated successfully.",
        data: gatewayUrl
      });
    } catch (error) {
      // Keep domain-specific error handling logic for stock/variants
      if (error.message.includes('INSUFFICIENT_STOCK')) {
        return res.status(409).json({
          success: false,
          message: "One or more items have insufficient stock."
        });
      }
      if (error.message.includes('VARIANT_NOT_FOUND')) {
        return res.status(400).json({
          success: false,
          message: "One or more cart items reference an invalid product variant."
        });
      }
      throw error; // Let global handler catch generic errors
    }
  });

  getAdminOrders = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const result = await orderService.getOrderTelemetry({ page });
    return res.status(200).json({ success: true, data: result });
  });

  updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }
    const order = await orderService.updateOrderStatus(id, status);
    return res.status(200).json({ success: true, data: order });
  });

  // Redirect endpoints keep try/catch to redirect properly on failure
  async paymentSuccess(req, res) {
    try {
      const { id } = req.params;
      await orderService.confirmPayment(id);
      res.redirect(`http://localhost:5173/orders?payment=success`);
    } catch (error) {
      res.redirect(`http://localhost:5173/orders?payment=fail`);
    }
  }

  async paymentFail(req, res) {
    try {
      const { id } = req.params;
      await orderService.failPayment(id);
    } catch (error) {}
    res.redirect(`http://localhost:5173/orders?payment=fail`);
  }

  async paymentCancel(req, res) {
    const { id } = req.params;
    try { await orderService.failPayment(id); } catch (_) {}
    res.redirect(`http://localhost:5173/orders?payment=cancelled`);
  }

  getMyOrders = asyncHandler(async (req, res) => {
    const userId = req.user.id; 
    const orders = await orderService.getUserOrders(userId);

    return res.status(200).json({
      success: true,
      data: orders
    });
  });

  reinitiatePayment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    if (order.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }
    if (order.paymentStatus === 'PAID') {
      return res.status(400).json({ success: false, message: 'This order is already paid.' });
    }

    const gatewayUrl = await paymentService.initiatePayment(order, req.user);
    return res.status(200).json({ success: true, data: gatewayUrl });
  });
}

module.exports = new OrderController();
