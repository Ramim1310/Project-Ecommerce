const adminRepository = require('./admin.repository');

class AdminService {
  async getDashboardTelemetry() {
    return adminRepository.getDashboardTelemetry();
  }
}

module.exports = new AdminService();