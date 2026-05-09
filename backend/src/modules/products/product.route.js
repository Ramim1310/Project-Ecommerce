
const express = require('express');
const router = express.Router();
const productController = require('./product.controller');

// GET /api/products/catalog
router.get('/catalog', productController.getCatalog);
router.get('/:id', productController.getProductDetails);

module.exports = router;