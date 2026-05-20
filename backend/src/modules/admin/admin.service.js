const prisma = require('../../../config/db');

class AdminService {
  async getDashboardStats() {
    const [totalProducts, totalUsers, totalVariants, totalOrders, revenueAgg] = await Promise.all([
      prisma.product.count(),
      prisma.user.count(),
      prisma.productVariant.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true }
      })
    ]);

    // Sum up all variant stock for total inventory units
    const stockAgg = await prisma.productVariant.aggregate({
      _sum: { stock: true },
    });

    return {
      totalProducts,
      totalUsers,
      totalOrders,
      revenue: revenueAgg._sum.totalAmount || 0,
      totalVariants,
      totalStock: stockAgg._sum.stock || 0,
    };
  }
}

module.exports = new AdminService();