const express = require('express');
const router = express.Router();
const orderController = require('./order.controller');
const { isAuth, isAdmin } = require('../../middleware/auth.middleware');

// User Routes
router.post('/checkout', isAuth, orderController.createOrder);

// Admin Routes
router.get('/admin-telemetry', isAdmin, orderController.getAdminOrders);

module.exports = router;