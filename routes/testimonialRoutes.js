const express = require('express');
const router = express.Router();
const {
    getAllTestimonials,
    getTestimonialById,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleFeatured
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
    .post(upload.single('image'), createTestimonial);

router.route('/:id')
    .get(getTestimonialById)
    .put(upload.single('image'), updateTestimonial)
    .delete(deleteTestimonial);

router.route('/:id/toggle-featured')
    .patch(toggleFeatured);

module.exports = router;
