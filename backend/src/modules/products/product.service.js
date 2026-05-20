
const productRepository = require('./product.repository');

class ProductService {

    async getCatalog(query) {
        const filters = {
            brand: query.brand,
            category: query.category,
            minPrice: query.minPrice,
            maxPrice: query.maxPrice,
            searchTerm: query.search  // pass search term from query string
        };

        const products = await productRepository.findAll(filters);

        return products.map(product => {
            const primaryImage = product.variants[0]?.images[0] || 'https://placehold.co/400x300';
            const prices = product.variants.map(v => Number(v.price));
            const minPrice = Math.min(...prices);

            return {
                id: product.id,
                name: product.name,
                thumbnail: primaryImage,
                brand: product.brand,
                startingPrice: minPrice,
                category: product.category.name,
                specs: product.specifications,
                variantCount: product.variants.length,
                isInStock: product.variants.some(v => v.stock > 0)
            };
        });
    }


    async getProductDetails(id) {
        const product = await productRepository.findById(id);
        if (!product) throw new Error("Product not found");


        //  'default' one appears first.
        return {
            ...product,
            variants: product.variants.sort((a, b) => (b.isDefault - a.isDefault))
        };
    }

    // create product 

    async createNewProduct(data) {
    //  Extract the variants array from the rest of the product data
    const { variants, ...productData } = data;

    //  Ensure there is at least one variant
    if (!variants || variants.length === 0) {
      throw new Error("A product must have at least one variant (SKU).");
    }

    // 3. Pass separated data to the repository
    const newProduct = await productRepository.createProduct(productData, variants);

    return newProduct;
  }

  async getAdminInventory() {
    const products = await productRepository.findAllForAdmin();

    // Map through products to add helpful admin-only metadata
    return products.map(product => {
      const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
      
      return {
        ...product,
        totalStock,
        variantCount: product.variants.length
      };
    });
  }

  async removeHardware(id) {
    //  we will add a check here to prevent 
    // deleting products that are currently in a "Live Deal"
    try {
      return await productRepository.deleteProduct(id);
    } catch (error) {
      // Prisma throws a specific error if the record to delete isn't found
      throw new Error("Target hardware not found in inventory.");
    }
  }

  async getCategories() {
    return await productRepository.findAllCategories();
  }

  async createCategory(name) {
    if (!name || !name.trim()) {
      throw new Error("Category name is required.");
    }
    return await productRepository.createCategory(name.trim());
  }
}

module.exports = new ProductService();