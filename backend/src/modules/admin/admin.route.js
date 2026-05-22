const router = require('express').Router();
const { getStats } = require('./admin.controller');
const orderController = require('../order/order.controller');
const requireAdmin = require('../../middleware/requireAdmin');

// Stats (admin-module owned)
router.get('/stats', requireAdmin, getStats);

// Order management — delegates to order module controller
router.get('/orders', requireAdmin, orderController.getAdminOrders);
router.patch('/orders/:id/status', requireAdmin, orderController.updateOrderStatus);

module.exports = router;