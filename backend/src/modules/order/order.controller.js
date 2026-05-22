const orderService = require('./order.service');


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

      return res.status(201).json({
        success: true,
        message: "Transaction successful. Logistics initiated.",
        data: order
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
}

module.exports = new OrderController();