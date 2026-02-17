const express = require('express');
const router = express.Router();
const {
    createEnrollment,
    getAllEnrollments,
    updateEnrollmentStatus
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/auth');

// Public
router.post('/', createEnrollment);

// Admin
router.get('/', protect, getAllEnrollments);
router.put('/:id', protect, updateEnrollmentStatus);

module.exports = router;
