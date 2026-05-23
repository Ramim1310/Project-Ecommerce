const orderRepository = require('./order.repository');

class OrderService {
  async processNewOrder(orderData) {
    return await orderRepository.createOrderWithStockUpdate(
      orderData.userId,
      orderData.items,
      orderData.totalAmount,
      orderData.shippingAddress
    );
  }

  async getOrderTelemetry({ page = 0 } = {}) {
    return await orderRepository.findAllForAdmin({ page });
  }

  async updateOrderStatus(orderId, status) {
    return await orderRepository.updateStatus(orderId, status);
  }

  async confirmPayment(orderId) {
    return await orderRepository.updateOrderStatus(orderId, 'PROCESSING', 'PAID');
  }

  async failPayment(orderId) {
    return await orderRepository.updateOrderStatus(orderId, 'CANCELLED', 'FAILED');
  }
  async getUserOrders(userId) {
    return await orderRepository.findOrdersByUser(userId);
  }

  async getOrderById(id) {
    return await orderRepository.findById(id);
  }

}

module.exports = new OrderService();