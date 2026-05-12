
const productService = require('./product.service');

class ProductController {
 
   
  async getCatalog(req, res) {
  try {
    // req.query contains everything after the '?' in the URL
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
      // 1. Grab all the data the admin sent in the request body
      const productInput = req.body;

      // 2. Pass it to the service layer
      const createdProduct = await productService.createNewProduct(productInput);

      // 3. Send success response
      return res.status(201).json({
        success: true,
        message: "Hardware successfully added to the Nexus catalog.",
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
        message: "Failed to fetch inventory log." 
      });
    }
  }
  async deleteProduct(req, res) {
    try {
      const { id } = req.params; 

      await productService.removeHardware(id);

      return res.status(200).json({
        success: true,
        message: "Product and associated SKUs purged into the void from the Nexus."
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ProductController();