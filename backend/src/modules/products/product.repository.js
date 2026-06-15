const prisma = require("../../../config/db");


class ProductRepository {
  
    //Fetches all products with their variants, supporting optional filters.
  
  async findAll(filters = {}, skip = 0, take = 9) {
    const { category, brand, minPrice, maxPrice, searchTerm } = filters;

    const where = {
        OR: searchTerm ? [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { brand: { contains: searchTerm, mode: 'insensitive' } },
        ] : undefined,
        brand: brand ? { equals: brand, mode: 'insensitive' } : undefined,
        category: category ? { name: { equals: category, mode: 'insensitive' } } : undefined,

        // Only show products where at least one variant is within the price range.
        variants: {
          some: {
            price: {
              gte: minPrice ? parseFloat(minPrice) : 0,
              lte: maxPrice ? parseFloat(maxPrice) : 999999,
            },
          },
        },
      };

    const [total, products] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take,
        include: {
          variants: true,
          category: true,
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return { total, products };
  }

  /**
   * Finds a single product by ID, used by the product detail page.
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
        variants: true,
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async createProduct(productData, variantsData) {
    return await prisma.product.create({
      data: {
        name: productData.name,
        brand: productData.brand,
        description: productData.description,
        categoryId: productData.categoryId,
        specifications: productData.specifications,
        variants: {
          create: variantsData
        }
      },
      include: {
        variants: true,
        category: true,
      },
    })
  }

  async deleteProduct(id) {
    return await prisma.product.delete({
      where: { id }
    });
  }

  async findAllCategories() {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async createCategory(name) {
    return await prisma.category.create({
      data: { name }
    });
  }
}

module.exports = new ProductRepository();