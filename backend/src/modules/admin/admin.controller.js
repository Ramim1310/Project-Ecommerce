const adminService = require('./admin.service');

async function getStats(req, res) {
  try {
    const stats = await adminService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getStats };
