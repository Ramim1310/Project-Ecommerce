const adminService = require('./admin.service');
const asyncHandler = require('../../middleware/asyncHandler');

class AdminController {
  getDashboardTelemetry = asyncHandler(async (req, res) => {
    const data = await adminService.getDashboardTelemetry();
    return res.status(200).json({ success: true, data });
  });
}

module.exports = new AdminController();
