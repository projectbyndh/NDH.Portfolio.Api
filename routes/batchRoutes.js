const express = require('express');
const router = express.Router();
const {
    getBatchesByCourse,
    createBatch,
    updateBatch,
    deleteBatch
} = require('../controllers/batchController');
const { protect, optionalProtect } = require('../middleware/auth');

/**
 * @swagger
 * /api/batches:
 *   get:
 *     summary: Get batches by course
 *     tags: [Batches]
 *     parameters:
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of batches
 */
router.get('/', optionalProtect, getBatchesByCourse);

/**
 * @swagger
 * /api/batches/create:
 *   post:
 *     summary: Create a new batch (Admin)
 *     tags: [Batches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Batch created
 */
router.post('/create', protect, createBatch);

/**
 * @swagger
 * /api/batches/{id}:
 *   put:
 *     summary: Update a batch (Admin)
 *     tags: [Batches]
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
 *         description: Batch updated
 */
router.put('/:id', protect, updateBatch);

/**
 * @swagger
 * /api/batches/{id}:
 *   delete:
 *     summary: Delete a batch (Admin)
 *     tags: [Batches]
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
 *         description: Batch deleted
 */
router.delete('/:id', protect, deleteBatch);

module.exports = router;
