const jwt = require('jsonwebtoken');

// Hardcoded admin credentials (should be in .env in production)
const ADMIN_CREDENTIALS = {
    email: process.env.ADMIN_EMAIL || 'admin.ndh@gmail.com',
    password: process.env.ADMIN_PASSWORD || 'Manigram@ndh@123#'
};

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production';

/**
 * @desc    Login admin
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Login attempt logging
        console.log('🔐 === LOGIN ATTEMPT ===');
        console.log('📧 Received email:', email);
        console.log('✅ Expected email:', ADMIN_CREDENTIALS.email);
        console.log('🔍 Email match:', email === ADMIN_CREDENTIALS.email);
        console.log('🔑 Password match:', password === ADMIN_CREDENTIALS.password);
        console.log('⚙️  Email from env:', process.env.ADMIN_EMAIL);
        console.log('===================');

        // Check credentials
        if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Create token
        const token = jwt.sign(
            { id: 'admin', role: 'admin', email: ADMIN_CREDENTIALS.email },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        console.log('✅ Login successful for:', email);
        console.log('🎟️  Token generated successfully');
        
        res.status(200).json({
            success: true,
            token,
            user: {
                email: ADMIN_CREDENTIALS.email,
                role: 'admin'
            }
        });
    } catch (error) {
        console.error('❌ Login error:', error.message);
        console.error('Stack:', error.stack);
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
        console.log('🔍 Token verification requested');
        console.log('✅ Token verified for user:', req.user.email || ADMIN_CREDENTIALS.email);
        
        // req.user is populated by the 'protect' middleware after verification
        res.status(200).json({
            success: true,
            user: {
                email: req.user.email || ADMIN_CREDENTIALS.email,
                role: req.user.role || 'admin'
            }
        });
    } catch (error) {
        console.error('❌ Token verification failed:', error.message);
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};
