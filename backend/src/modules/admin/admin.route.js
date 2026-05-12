const router = require('express').Router();
const { getStats } = require('./admin.controller');
const requireAdmin = require('../../middleware/requireAdmin');

router.get('/stats', requireAdmin, getStats);

module.exports = router;