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

/**
 * @swagger
 * components:
 *   schemas:
 *     CareerApplication:
 *       type: object
 *       required:
 *         - careerId
 *         - careerTitle
 *         - fullName
 *         - email
 *         - phone
 *         - cvUrl
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated id
 *         careerId:
 *           type: integer
 *           description: ID of the career position
 *         careerTitle:
 *           type: string
 *           description: Title of the career position
 *         fullName:
 *           type: string
 *           description: Full name of applicant
 *         email:
 *           type: string
 *           description: Email of applicant
 *         phone:
 *           type: string
 *           description: Phone number of applicant
 *         coverLetter:
 *           type: string
 *           description: Cover letter text
 *         cvUrl:
 *           type: string
 *           description: URL/Path to the uploaded CV
 *         status:
 *           type: string
 *           enum: [pending, reviewed, shortlisted, rejected]
 *           default: pending
 */

/**
 * @swagger
 * /api/career-applications:
 *   post:
 *     summary: Submit a new career application
 *     tags: [Career Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               careerId:
 *                 type: integer
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               coverLetter:
 *                 type: string
 *               cv:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Application submitted successfully
 */
router.post('/', cvUpload.single('cv'), createApplication);
router.post('/create', cvUpload.single('cv'), createApplication);

/**
 * @swagger
 * /api/career-applications:
 *   get:
 *     summary: Get all applications (Admin)
 *     tags: [Career Applications]
 *     responses:
 *       200:
 *         description: List of applications
 */
router.get('/', getAllApplications);

/**
 * @swagger
 * /api/career-applications/export/excel:
 *   get:
 *     summary: Export applications to Excel (Admin)
 *     tags: [Career Applications]
 *     responses:
 *       200:
 *         description: Excel file
 */
router.get('/export/excel', exportToExcel);

/**
 * @swagger
 * /api/career-applications/{id}:
 *   get:
 *     summary: Get application by ID (Admin)
 *     tags: [Career Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Application details
 */
router.get('/:id', getApplicationById);

/**
 * @swagger
 * /api/career-applications/{id}:
 *   put:
 *     summary: Update application status (Admin)
 *     tags: [Career Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, reviewed, shortlisted, rejected]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put('/:id', updateApplicationStatus);

/**
 * @swagger
 * /api/career-applications/{id}:
 *   delete:
 *     summary: Delete an application (Admin)
 *     tags: [Career Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Application deleted
 */
router.delete('/:id', deleteApplication);

module.exports = router;
