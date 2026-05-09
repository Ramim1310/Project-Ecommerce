
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

}

module.exports = new ProductController();