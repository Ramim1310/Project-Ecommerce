const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Verifies the JWT and attaches user details to `req.user`.
 */
const isAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired. Please log in again.' });
        }
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

/**
 * Admin Authorization Middleware
 * Assumes isAuth has run and populated `req.user`.
 */
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Admin access only.' });
    }
    next();
};

module.exports = {
    isAuth,
    isAdmin
};
