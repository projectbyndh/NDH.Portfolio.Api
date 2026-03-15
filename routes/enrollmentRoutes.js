const express = require('express');
const router = express.Router();
const {
    createEnrollment,
    getAllEnrollments,
    updateEnrollmentStatus
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /api/enrollments/create:
 *   post:
 *     summary: Create a new enrollment inquiry
 *     tags: [Enrollments]
 *     responses:
 *       201:
 *         description: Enrollment created
 */
router.post('/create', createEnrollment);

/**
 * @swagger
 * /api/enrollments:
 *   get:
 *     summary: Get all enrollments (Admin)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enrollments
 */
router.get('/', protect, getAllEnrollments);

/**
 * @swagger
 * /api/enrollments/{id}:
 *   put:
 *     summary: Update enrollment status (Admin)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put('/:id', protect, updateEnrollmentStatus);

module.exports = router;
