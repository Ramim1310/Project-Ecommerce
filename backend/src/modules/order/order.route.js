const express = require('express');
const router = express.Router();
const orderController = require('./order.controller');
const { isAuth, isAdmin } = require('../../middlewares/auth.middleware');

// User Routes
router.post('/checkout', isAuth, orderController.createOrder);

// Admin Routes (For later telemetry)
// router.get('/admin-telemetry', isAdmin, orderController.getAdminOrders);

module.exports = router;