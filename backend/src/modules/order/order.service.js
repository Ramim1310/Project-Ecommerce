
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

  async getOrderTelemetry() {
    const orders = await orderRepository.findAllForAdmin();
    return orders;
  }
}

module.exports = new OrderService();