const orderService = require('./order.service');
const paymentService = require('./payment.service');


class OrderController {
  async createOrder(req, res) {
    try {
      // 1. Extract data from the request body
      const { items, totalAmount, shippingAddress } = req.body;

      // 2. Extract the user ID from the verified JWT token (attached by middleware)
      const userId = req.user.id;

      // 3. Basic Validation
      if (!items || items.length === 0) {
        return res.status(400).json({ success: false, message: "Cart payload is empty." });
      }

      // 4. Pass to the Service Layer for the Transaction
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
      // Catch specific transaction errors (e.g., our INSUFFICIENT_STOCK error)
      console.error('[OrderController] Checkout error:', error.message);
      if (error.message.includes('INSUFFICIENT_STOCK')) {
        return res.status(409).json({
          success: false,
          message: "Transaction aborted: One or more items have insufficient stock."
        });
      }
      if (error.message.includes('VARIANT_NOT_FOUND')) {
        return res.status(400).json({
          success: false,
          message: "One or more cart items reference an invalid product variant."
        });
      }

      return res.status(500).json({
        success: false,
        message: "System error during checkout."
      });
    }
  }
  async getAdminOrders(req, res) {
    try {
      const page = parseInt(req.query.page) || 0;
      const result = await orderService.getOrderTelemetry({ page });
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error('[OrderController] getAdminOrders error:', error.message);
      return res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value.' });
      }
      const order = await orderService.updateOrderStatus(id, status);
      return res.status(200).json({ success: true, data: order });
    } catch (error) {
      console.error('[OrderController] updateOrderStatus error:', error.message);
      return res.status(500).json({ success: false, message: 'Failed to update order status.' });
    }
  }

  async paymentSuccess(req, res) {
    try {
      const { id } = req.params;
      console.log(`✅ [PaymentSuccess] Order ID: ${id}`);
      await orderService.confirmPayment(id);
      console.log(`✅ [PaymentSuccess] DB updated to PAID`);
      // Redirect straight to orders page — it will show PAID status
      res.redirect(`http://localhost:5173/orders?payment=success`);
    } catch (error) {
      console.error('❌ [PaymentSuccess] ERROR:', error.message);
      res.redirect(`http://localhost:5173/orders?payment=fail`);
    }
  }

  async paymentFail(req, res) {
    try {
      const { id } = req.params;
      console.log(`❌ [PaymentFail] Order ID: ${id}`);
      await orderService.failPayment(id);
    } catch (error) {
      console.error('❌ [PaymentFail] ERROR:', error.message);
    }
    res.redirect(`http://localhost:5173/orders?payment=fail`);
  }

  async paymentCancel(req, res) {
    const { id } = req.params;
    console.log(`⚠️ [PaymentCancel] Order ID: ${id}`);
    try { await orderService.failPayment(id); } catch (_) {}
    res.redirect(`http://localhost:5173/orders?payment=cancelled`);
  }

  async getMyOrders(req, res) {
    try {
      const userId = req.user.id; 
      const orders = await orderService.getUserOrders(userId);

      return res.status(200).json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error("Order Fetch Error:", error);
      return res.status(500).json({ success: false, message: "Failed to retrieve logistics data." });
    }
  }

  async reinitiatePayment(req, res) {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderById(id);

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found.' });
      }
      // Only allow for the order's own user
      if (order.userId !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Forbidden.' });
      }
      if (order.paymentStatus === 'PAID') {
        return res.status(400).json({ success: false, message: 'This order is already paid.' });
      }

      const gatewayUrl = await paymentService.initiatePayment(order, req.user);
      return res.status(200).json({ success: true, data: gatewayUrl });
    } catch (error) {
      console.error('[OrderController] reinitiatePayment error:', error.message);
      return res.status(500).json({ success: false, message: 'Failed to reinitiate payment.' });
    }
  }

}

module.exports = new OrderController();
