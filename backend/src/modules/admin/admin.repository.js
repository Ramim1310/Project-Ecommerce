const prisma = require('../../../config/db');

class AdminRepository {
  /**
   * All dashboard aggregates in a single parallel query batch.
   * Replaces the old getDashboardStats + getSystemTelemetry split.
   */
  async getDashboardTelemetry() {
    const [
      totalRevenue,
      activeOrders,
      totalOrders,
      totalProducts,
      totalUsers,
      totalVariants,
      totalStock,
      lowStockAlerts,
    ] = await Promise.all([
      // Revenue from non-cancelled orders
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: 'CANCELLED' } },
      }).then(r => r._sum.totalAmount || 0),

      // Orders currently in flight
      prisma.order.count({
        where: { status: { in: ['PENDING', 'PROCESSING'] } },
      }),

      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.productVariant.count(),

      // Total inventory units
      prisma.productVariant.aggregate({ _sum: { stock: true } })
        .then(r => r._sum.stock || 0),

      // Low stock alerts (< 10 units), worst first
      prisma.productVariant.findMany({
        where: { stock: { lt: 10 } },
        include: { product: true },
        take: 4,
        orderBy: { stock: 'asc' },
      }),
    ]);

    return {
      totalRevenue,
      activeOrders,
      totalOrders,
      totalProducts,
      totalUsers,
      totalVariants,
      totalStock,
      lowStockAlerts,
    };
  }
}

module.exports = new AdminRepository();