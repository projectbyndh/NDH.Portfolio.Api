const express = require('express');
const router = express.Router();
const {
    getAllTestimonials,
    getTestimonialById,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
} = require('../controllers/testimonialController');
const upload = require('../middleware/upload');

/**
 * @swagger
 * components:
 *   schemas:
 *     Testimonial:
 *       type: object
 *       required:
 *         - name
 *         - position
 *         - text
 *         - rating
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the testimonial
 *         name:
 *           type: string
 *           description: Client name
 *         position:
 *           type: string
 *           description: Client position/title
 *         company:
 *           type: string
 *           description: Company name
 *         image:
 *           type: string
 *           description: Client photo URL/path
 *         rating:
 *           type: number
 *           format: float
 *           description: Rating (1-5 stars)
 *         text:
 *           type: string
 *           description: Testimonial content
 *         featured:
 *           type: boolean
 *         isActive:
 *           type: boolean
 *       example:
 *         id: 1
 *         name: John Doe
 *         position: CEO
 *         company: TechCorp Inc.
 *         image: https://res.cloudinary.com/example/image/upload/v1/client.jpg
 *         rating: 5
 *         text: Excellent service!
 *         featured: true
 *         isActive: true
 */

/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     summary: Get all testimonials
 *     tags: [Testimonials]
 *     parameters:
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured status
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of all testimonials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Testimonial'
 */
router.route('/')
    .get(getAllTestimonials);

/**
 * @swagger
 * /api/testimonials/create:
 *   post:
 *     summary: Create a new testimonial
 *     tags: [Testimonials]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - position
 *               - text
 *               - rating
 *             properties:
 *               name:
 *                 type: string
 *               position:
 *                 type: string
 *               company:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               rating:
 *                 type: number
 *               text:
 *                 type: string
 *               featured:
 *                 type: boolean
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Testimonial created successfully
 *       400:
 *         description: Bad request
 */
router.post('/create', upload.single('image'), createTestimonial);

/**
 * @swagger
 * /api/testimonials/{id}:
 *   get:
 *     summary: Get a testimonial by ID
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Testimonial found
 *       404:
 *         description: Testimonial not found
 *   put:
 *     summary: Update a testimonial
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Testimonial'
 *     responses:
 *       200:
 *         description: Testimonial updated
 *   delete:
 *     summary: Delete a testimonial
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Testimonial deleted
 */
router.route('/:id')
    .get(getTestimonialById)
    .put(upload.single('image'), updateTestimonial)
    .delete(deleteTestimonial);

module.exports = router;
