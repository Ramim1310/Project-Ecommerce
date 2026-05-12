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
    const { category, brand, minPrice, maxPrice, searchTerm } = filters;

    return await prisma.product.findMany({
      where: {
        //search query for product name and brand
        OR: searchTerm ? [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { brand: { contains: searchTerm, mode: 'insensitive' } },
        ] : undefined,
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

  async findAllForAdmin() {
    return await prisma.product.findMany({
      include: {
        variants: true,   // We need to see every SKU
        category: true    // We need to see the category name
      },
      orderBy: {
        createdAt: 'desc' // Newest products at the top
      }
    });
  }

  // create product from admin

  async createProduct(productData, variantsData) {
    return await prisma.product.create({
      data: {
        name: productData.name,
        brand: productData.brand,
        description: productData.description,
        categoryId: productData.categoryId,
        specifications: productData.specifications,
        variants: {
          create: variantsData // Array of variant objects
        }
      },
      include: {
        variants: true, // Return the created variants along with the product
        category: true,   // Return the associated category
      },
    })
  }

  async deleteProduct(id) {
    return await prisma.product.delete({
      where: { id }
    });
  }



}

module.exports = new ProductRepository();