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
  async findAll() {
    return await prisma.product.findMany({
      include: {
        variants: true,   
        category: true   
      }
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