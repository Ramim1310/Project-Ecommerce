
const productService = require('./product.service');

class ProductController {
 
   
  async getCatalog(req, res) {
  try {
    const catalog = await productService.getCatalog(req.query);
    return res.status(200).json({ success: true, data: catalog });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
  async getProductDetails(req, res) {
    try {
      const { id } = req.params;
      const product = await productService.getProductDetails(id);
      
      return res.status(200).json({ success: true, data: product });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Error fetching product" });
    }
  }

 async createProduct(req, res) {
    try {
      const productInput = req.body;
      const createdProduct = await productService.createNewProduct(productInput);

      return res.status(201).json({
        success: true,
        message: "Product created successfully.",
        data: createdProduct
      });
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

 async getAdminProducts(req, res) {
    try {
      const inventory = await productService.getAdminInventory();
      
      return res.status(200).json({
        success: true,
        count: inventory.length,
        data: inventory
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: "Failed to fetch products." 
      });
    }
  }
  async deleteProduct(req, res) {
    try {
      const { id } = req.params; 

      await productService.removeHardware(id);

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully."
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async getCategories(req, res) {
    try {
      const categories = await productService.getCategories();
      res.status(200).json({
        success: true,
        data: categories
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch categories." 
      });
    }
  }

  async createCategory(req, res) {
    try {
      const { name } = req.body;
      const category = await productService.createCategory(name);
      return res.status(201).json({
        success: true,
        message: `Category "${category.name}" created successfully.`,
        data: category
      });
    } catch (error) {
      // Prisma unique constraint violation
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          message: "A category with that name already exists."
        });
      }
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ProductController();