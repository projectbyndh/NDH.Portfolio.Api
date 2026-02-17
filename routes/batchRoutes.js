const express = require('express');
const router = express.Router();
const {
    getBatchesByCourse,
    createBatch,
    updateBatch,
    deleteBatch
} = require('../controllers/batchController');
const { protect, optionalProtect } = require('../middleware/auth');

// Public
router.get('/', optionalProtect, getBatchesByCourse); // Allows viewing all batches if admin token present

// Admin
router.post('/', protect, createBatch);
router.put('/:id', protect, updateBatch);
router.delete('/:id', protect, deleteBatch);

module.exports = router;
