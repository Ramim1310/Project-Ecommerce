const express = require('express');
const router = express.Router();
const orderController = require('./order.controller');
const { isAuth, isAdmin } = require('../../middleware/auth.middleware');

// User Routes
router.post('/checkout', isAuth, orderController.createOrder);

// Admin Routes
router.get('/admin-telemetry', isAdmin, orderController.getAdminOrders);
// SSLCommerz sends POST to success/fail, but browser also hits these via redirect
router.post('/payment/success/:id', orderController.paymentSuccess);
router.get('/payment/success/:id', orderController.paymentSuccess);
router.post('/payment/fail/:id', orderController.paymentFail);
router.get('/payment/fail/:id', orderController.paymentFail);
router.get('/payment/cancel/:id', orderController.paymentCancel);
// Re-initiate payment for an existing UNPAID order
router.post('/reinitiate/:id', isAuth, orderController.reinitiatePayment);
// Route for users to see their own history
router.get('/my-orders', isAuth, orderController.getMyOrders);
module.exports = router;