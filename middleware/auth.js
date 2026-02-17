const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production';

exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        console.warn('⚠️  Auth failed: No token provided');
        console.log('📍 Path:', req.path);
        return res.status(401).json({
            success: false,
            message: 'No authentication token provided'
        });
    }

    try {
        console.log('🔐 Verifying JWT token...');
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        console.log('✅ Token verified for user:', decoded.email || decoded.id);
        next();
    } catch (err) {
        console.error('❌ JWT Verification Error:', err.message);
        console.log('📍 Path:', req.path);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};


exports.optionalProtect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        // If token invalid, proceed as guest
        next();
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};
