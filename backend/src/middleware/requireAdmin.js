const jwt = require('jsonwebtoken');

/**
 * requireAdmin middleware
 * Verifies the JWT and ensures the caller has role === 'ADMIN'.
 * Attach to any admin-only API routes.
 *
 * Usage: router.get('/admin/stats', requireAdmin, handler)
 */
module.exports = function requireAdmin(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Admin access only.' });
        }

        req.admin = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired. Please log in again.' });
        }
        return res.status(401).json({ message: 'Invalid token.' });
    }
};
