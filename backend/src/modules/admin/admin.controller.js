const adminService = require('./admin.service');

class AdminController {
  async getDashboardTelemetry(req, res) {
    try {
      const data = await adminService.getDashboardTelemetry();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('[AdminController] getDashboardTelemetry error:', error.message);
      return res.status(500).json({ success: false, message: 'Failed to load dashboard data.' });
    }
  }
}

module.exports = new AdminController();
