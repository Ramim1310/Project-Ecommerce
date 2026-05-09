
const productRepository = require('./product.repository');

class ProductService {

    async getCatalog() {
        const products = await productRepository.findAll();
        const formattedProducts = products.map(product => {
            const primaryImage = product.variants[0]?.images[0] || 'https://placehold.co/400x300';
            // Find the lowest price among variants
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

        return formattedProducts;
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
}

module.exports = new ProductService();