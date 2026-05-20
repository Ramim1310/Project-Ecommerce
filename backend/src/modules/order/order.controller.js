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
      if (error.message.includes('INSUFFICIENT_STOCK')) {
        return res.status(409).json({ 
          success: false, 
          message: "Transaction aborted: One or more items have insufficient stock." 
        });
      }

      return res.status(500).json({ 
        success: false, 
        message: "System  error during checkout." 
      });
    }
  }
}

module.exports = new OrderController();