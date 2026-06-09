const productService = require('./product.service');
const asyncHandler = require('../../middleware/asyncHandler');

class ProductController {
  getCatalog = asyncHandler(async (req, res) => {
    const catalog = await productService.getCatalog(req.query);
    return res.status(200).json({ success: true, ...catalog });
  });

  getProductDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await productService.getProductDetails(id);
    return res.status(200).json({ success: true, data: product });
  });

  createProduct = asyncHandler(async (req, res) => {
    const productInput = req.body;
    const createdProduct = await productService.createNewProduct(productInput);

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: createdProduct
    });
  });

  getAdminProducts = asyncHandler(async (req, res) => {
    const inventory = await productService.getAdminInventory();
    return res.status(200).json({
      success: true,
      count: inventory.length,
      data: inventory
    });
  });

  deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await productService.removeHardware(id);
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully."
    });
  });

  getCategories = asyncHandler(async (req, res) => {
    const categories = await productService.getCategories();
    res.status(200).json({
      success: true,
      data: categories
    });
  });

  createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const category = await productService.createCategory(name);
    return res.status(201).json({
      success: true,
      message: `Category "${category.name}" created successfully.`,
      data: category
    });
  });
}

module.exports = new ProductController();