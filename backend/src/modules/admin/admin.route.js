const router = require('express').Router();
const adminController = require('./admin.controller');
const orderController = require('../order/order.controller');
const requireAdmin = require('../../middleware/requireAdmin');


router.get('/telemetry', requireAdmin, adminController.getDashboardTelemetry);

// Order management
router.get('/orders', requireAdmin, orderController.getAdminOrders);
router.patch('/orders/:id/status', requireAdmin, orderController.updateOrderStatus);

module.exports = router;