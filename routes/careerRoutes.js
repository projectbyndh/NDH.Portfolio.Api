const express = require('express');
const router = express.Router();
const {
  getAllCareers,
  getCareerById,
  createCareer,
  updateCareer,
  deleteCareer
} = require('../controllers/careerController');
const upload = require('../middleware/upload');

/**
 * @swagger
 * components:
 *   schemas:
 *     Career:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - image
 *         - requirements
 *         - responsibilities
 *         - applyLink
 *         - location
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the career
 *         title:
 *           type: string
 *           description: The title of the career position
 *         description:
 *           type: string
 *           description: The description of the career position
 *         image:
 *           type: string
 *           description: The image URL for the career position
 *         requirements:
 *           type: array
 *           items:
 *             type: string
 *           description: List of requirements for the position
 *         responsibilities:
 *           type: array
 *           items:
 *             type: string
 *           description: List of responsibilities for the position
 *         applyLink:
 *           type: string
 *           description: The link to apply for the position
 *         location:
 *           type: string
 *           description: The location of the job
 *       example:
 *         id: 60d5ecb74b24c72b8c8b4567
 *         title: Software Developer
 *         description: We are looking for a skilled software developer
 *         image: https://example.com/career-image.jpg
 *         requirements: ["Bachelor's degree in Computer Science", "3+ years experience"]
 *         responsibilities: ["Develop software applications", "Collaborate with team"]
 *         applyLink: https://example.com/apply
 *         location: Kathmandu, Nepal
 */

/**
 * @swagger
 * /api/careers:
 *   get:
 *     summary: Get all careers
 *     tags: [Careers]
 *     responses:
 *       200:
 *         description: List of all careers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Career'
 *       500:
 *         description: Server error
 */
router.route('/')
  .get(getAllCareers)

/**
 * @swagger
 * /api/careers:
 *   post:
 *     summary: Create a new career
 *     tags: [Careers]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - image
 *               - requirements
 *               - responsibilities
 *               - applyLink
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the career position
 *               description:
 *                 type: string
 *                 description: The description of the career position
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the career position (jpeg, jpg, png, gif, webp)
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of requirements for the position
 *               responsibilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of responsibilities for the position
 *               applyLink:
 *                 type: string
 *                 description: The link to apply for the position
 *               location:
 *                 type: string
 *                 description: The location of the job
 *           example:
 *             title: Senior Developer
 *             description: Senior software developer position
 *             image: (binary file)
 *             requirements: ["Master's degree", "5+ years experience"]
 *             responsibilities: ["Lead development team", "Code reviews"]
 *             applyLink: https://example.com/apply-senior
 *             location: Kathmandu, Nepal
 *     responses:
 *       201:
 *         description: Career created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Career created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Career'
 *       400:
 *         description: Bad request
 */
  .post(upload.single('image'), createCareer);

/**
 * @swagger
 * /api/careers/{id}:
 *   get:
 *     summary: Get a career by ID
 *     tags: [Careers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The career ID
 *     responses:
 *       200:
 *         description: Career retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Career'
 *       404:
 *         description: Career not found
 *       500:
 *         description: Server error
 */
router.route('/:id')
  .get(getCareerById)

/**
 * @swagger
 * /api/careers/{id}:
 *   put:
 *     summary: Update a career by ID
 *     tags: [Careers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The career ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the career position
 *               description:
 *                 type: string
 *                 description: The description of the career position
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the career position (jpeg, jpg, png, gif, webp)
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of requirements for the position
 *               responsibilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of responsibilities for the position
 *               applyLink:
 *                 type: string
 *                 description: The link to apply for the position
 *               location:
 *                 type: string
 *                 description: The location of the job
 *     responses:
 *       200:
 *         description: Career updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Career updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Career'
 *       404:
 *         description: Career not found
 *       400:
 *         description: Bad request
 */
  .put(upload.single('image'), updateCareer)

/**
 * @swagger
 * /api/careers/{id}:
 *   delete:
 *     summary: Delete a career by ID
 *     tags: [Careers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The career ID
 *     responses:
 *       200:
 *         description: Career deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Career deleted successfully
 *       404:
 *         description: Career not found
 *       500:
 *         description: Server error
 */
  .delete(deleteCareer);

module.exports = router;
