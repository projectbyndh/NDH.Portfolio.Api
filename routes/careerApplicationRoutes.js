const express = require('express');
const router = express.Router();
const {
    getAllApplications,
    getApplicationById,
    createApplication,
    updateApplicationStatus,
    deleteApplication,
    exportToExcel
} = require('../controllers/careerApplicationController');
const cvUpload = require('../middleware/cvUpload');

// Public route - Submit application with CV
router.post('/', cvUpload.single('cv'), createApplication);
router.post('/create', cvUpload.single('cv'), createApplication); // Keep /create for backward compatibility if needed

// Admin routes - Get all applications
router.get('/', getAllApplications);

// Admin route - Export to Excel
router.get('/export/excel', exportToExcel);

// Admin routes - Get, update, delete specific application
router.route('/:id')
    .get(getApplicationById)
    .put(updateApplicationStatus)
    .delete(deleteApplication);

module.exports = router;
