const express = require('express');
const router = express.Router();
const {
    getAllCourses,
    getCourseBySlug,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController');
// Import protect middleware
const { protect } = require('../middleware/auth');

// Public Routes
router.get('/', getAllCourses);
router.get('/:slug', getCourseBySlug);

// Protected Routes (Admin)
router.post('/', protect, createCourse);
router.put('/:id', protect, updateCourse);
router.delete('/:id', protect, deleteCourse);

module.exports = router;
