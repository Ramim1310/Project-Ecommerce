const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

class ProductRepository {
  /**
   * Fetches all products including their Atomic SKU variants.
   * This is our "Single Source of Truth" for product data retrieval.
   */
  async findAll(filters = {}) {
    const { category, brand, minPrice, maxPrice } = filters;

    return await prisma.product.findMany({
      where: {
        // Standard filters
        brand: brand ? { equals: brand, mode: 'insensitive' } : undefined,
        category: category ? { name: { equals: category, mode: 'insensitive' } } : undefined,

        // Atomic SKU filtering: Only show products where at least one variant matches the price range
        variants: {
          some: {
            price: {
              gte: minPrice ? parseFloat(minPrice) : 0,
              lte: maxPrice ? parseFloat(maxPrice) : 999999,
            },
          },
        },
      },
      include: {
        variants: true,
        category: true,
      },
    });
  }

  /**
   * Finds a specific product by its ID.
   * Useful for the Product Detail Page (PDP) later. 
   */
  async findById(id) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
        category: true
      }
    });
  }



}

module.exports = new ProductRepository();