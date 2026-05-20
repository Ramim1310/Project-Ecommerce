
const express = require('express');
const router = express.Router();
const productController = require('./product.controller');
const requireAdmin = require('../../middleware/requireAdmin');


router.get('/admin-inventory', requireAdmin, productController.getAdminProducts);
router.get('/categories', productController.getCategories);
router.post('/categories', requireAdmin, productController.createCategory);

// GET /api/products/catalog
router.get('/catalog', productController.getCatalog);

router.post('/create', productController.createProduct);
router.get('/:id', productController.getProductDetails);

router.delete('/:id', requireAdmin, productController.deleteProduct);

module.exports = router;