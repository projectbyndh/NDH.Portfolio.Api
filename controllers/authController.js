const jwt = require('jsonwebtoken');

// Hardcoded admin credentials (should be in .env in production)
const ADMIN_CREDENTIALS = {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'manigram#2025@ndhadmin'
};

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production';

/**
 * @desc    Login admin
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate email & password
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username and password'
            });
        }

        // Check credentials
        if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Create token
        const token = jwt.sign(
            { id: 'admin', role: 'admin' },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                username: 'admin',
                role: 'admin'
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

/**
 * @desc    Verify token
 * @route   POST /api/auth/verify
 * @access  Private (Protected by Client)
 */
exports.verifyToken = async (req, res) => {
    try {
        // req.user is populated by the 'protect' middleware after verification
        res.status(200).json({
            success: true,
            user: {
                username: req.user.username || 'admin',
                role: req.user.role || 'admin'
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};
