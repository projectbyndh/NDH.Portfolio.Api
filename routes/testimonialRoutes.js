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
 *           type: string
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
 *           description: Client photo URL
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Rating (1-5 stars)
 *         text:
 *           type: string
 *           description: Testimonial content
 *         featured:
 *           type: boolean
 *           description: Whether testimonial is featured
 *         isActive:
 *           type: boolean
 *           description: Whether testimonial is active
 *       example:
 *         id: 60d5ecb74b24c72b8c8b4567
 *         name: John Doe
 *         position: CEO
 *         company: TechCorp Inc.
 *         image: /uploads/testimonial-1.jpg
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
    .get(getAllTestimonials)

    /**
     * @swagger
     * /api/testimonials:
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
     *                 description: Client name
     *               position:
     *                 type: string
     *                 description: Client position
     *               company:
     *                 type: string
     *                 description: Company name
     *               image:
     *                 type: string
     *                 format: binary
     *                 description: Client photo (image file)
     *               rating:
     *                 type: number
     *                 minimum: 1
     *                 maximum: 5
     *                 description: Rating 1-5
     *               text:
     *                 type: string
     *                 description: Review text
     *     responses:
     *       201:
     *         description: Testimonial created successfully
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
     *                   example: Testimonial created successfully
     *                 data:
     *                   $ref: '#/components/schemas/Testimonial'
     *       400:
     *         description: Bad request
     */
    .post(upload.single('image'), createTestimonial);

/**
 * @swagger
 * /api/testimonials/{id}:
 *   get:
 *     summary: Get a testimonial by ID
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The testimonial ID
 *     responses:
 *       200:
 *         description: Testimonial retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Testimonial'
 *       404:
 *         description: Testimonial not found
 */
router.route('/:id')
    .get(getTestimonialById)

    /**
     * @swagger
     * /api/testimonials/{id}:
     *   put:
     *     summary: Update a testimonial by ID
     *     tags: [Testimonials]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: The testimonial ID
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
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
     *       200:
     *         description: Testimonial updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     *                 data:
     *                   $ref: '#/components/schemas/Testimonial'
     *       404:
     *         description: Testimonial not found
     */
    .put(upload.single('image'), updateTestimonial)

    /**
     * @swagger
     * /api/testimonials/{id}:
     *   delete:
     *     summary: Delete a testimonial by ID
     *     tags: [Testimonials]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: The testimonial ID
     *     responses:
     *       200:
     *         description: Testimonial deleted successfully
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
     *                   example: Testimonial deleted successfully
     *       404:
     *         description: Testimonial not found
     */
    .delete(deleteTestimonial);

// Route removed for CRUD compliance

module.exports = router;
