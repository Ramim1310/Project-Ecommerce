
const productRepository = require('./product.repository');

class ProductService {

    async getCatalog(query) {
        const filters = {
            brand: query.brand,
            category: query.category,
            minPrice: query.minPrice,
            maxPrice: query.maxPrice,
        searchTerm: query.search
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


        // Sort so the default variant appears first.
        return {
            ...product,
            variants: product.variants.sort((a, b) => (b.isDefault - a.isDefault))
        };
    }

    async createNewProduct(data) {
    const { variants, ...productData } = data;

    if (!variants || variants.length === 0) {
      throw new Error("A product must have at least one variant (SKU).");
    }

    const newProduct = await productRepository.createProduct(productData, variants);

    return newProduct;
  }

  async getAdminInventory() {
    const products = await productRepository.findAllForAdmin();

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
    try {
      return await productRepository.deleteProduct(id);
    } catch (error) {
      throw new Error("Product not found.");
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