const prisma = require('../../../config/db');

class AdminService {
  async getDashboardStats() {
    const [totalProducts, totalUsers, totalVariants] = await Promise.all([
      prisma.product.count(),
      prisma.user.count(),
      prisma.productVariant.count(),
    ]);

    // Sum up all variant stock for total inventory units
    const stockAgg = await prisma.productVariant.aggregate({
      _sum: { stock: true },
    });

    return {
      totalProducts,
      totalUsers,
      totalOrders: 0,          // Order model not yet implemented
      revenue: 0,               // Order model not yet implemented
      totalVariants,
      totalStock: stockAgg._sum.stock || 0,
    };
  }
}

module.exports = new AdminService();