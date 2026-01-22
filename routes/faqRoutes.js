const express = require('express');
const router = express.Router();
const {
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ
} = require('../controllers/faqController');

/**
 * @swagger
 * components:
 *   schemas:
 *     FAQ:
 *       type: object
 *       required:
 *         - question
 *         - answer
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the FAQ
 *         question:
 *           type: string
 *           description: The FAQ question
 *         answer:
 *           type: string
 *           description: The FAQ answer
 *       example:
 *         id: 60d5ecb74b24c72b8c8b4567
 *         question: What services do you offer?
 *         answer: We offer web development, mobile app development, and digital marketing services.
 */

/**
 * @swagger
 * /api/faqs:
 *   get:
 *     summary: Get all FAQs
 *     tags: [FAQs]
 *     responses:
 *       200:
 *         description: List of all FAQs
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
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FAQ'
 *       500:
 *         description: Server error
 */
router.route('/')
  .get(getAllFAQs)

/**
 * @swagger
 * /api/faqs:
 *   post:
 *     summary: Create a new FAQ
 *     tags: [FAQs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FAQ'
 *           example:
 *             question: How long does a project take?
 *             answer: Project timelines vary depending on complexity, but typically range from 2-12 weeks.
 *     responses:
 *       201:
 *         description: FAQ created successfully
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
 *                   example: FAQ created successfully
 *                 data:
 *                   $ref: '#/components/schemas/FAQ'
 *       400:
 *         description: Bad request
 */
  .post(createFAQ);

/**
 * @swagger
 * /api/faqs/{id}:
 *   get:
 *     summary: Get an FAQ by ID
 *     tags: [FAQs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The FAQ ID
 *     responses:
 *       200:
 *         description: FAQ retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/FAQ'
 *       404:
 *         description: FAQ not found
 *       500:
 *         description: Server error
 */
router.route('/:id')
  .get(getFAQById)

/**
 * @swagger
 * /api/faqs/{id}:
 *   put:
 *     summary: Update an FAQ by ID
 *     tags: [FAQs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The FAQ ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FAQ'
 *     responses:
 *       200:
 *         description: FAQ updated successfully
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
 *                   example: FAQ updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/FAQ'
 *       404:
 *         description: FAQ not found
 *       400:
 *         description: Bad request
 */
  .put(updateFAQ)

/**
 * @swagger
 * /api/faqs/{id}:
 *   delete:
 *     summary: Delete an FAQ by ID
 *     tags: [FAQs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The FAQ ID
 *     responses:
 *       200:
 *         description: FAQ deleted successfully
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
 *                   example: FAQ deleted successfully
 *       404:
 *         description: FAQ not found
 *       500:
 *         description: Server error
 */
  .delete(deleteFAQ);

module.exports = router;
