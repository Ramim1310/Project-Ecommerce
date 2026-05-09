
const productService = require('./product.service');

class ProductController {
 
   
  async getCatalog(req, res) {
    try {
      // 1. Call the service to get processed logic
      const catalog = await productService.getCatalog();

      
      return res.status(200).json({
        success: true,
        message: "Catalog retrieved successfully",
        data: catalog
      });
    } catch (error) {
     
      console.error("Controller Error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error - Latency or DB connection issue."
      });
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

}

module.exports = new ProductController();