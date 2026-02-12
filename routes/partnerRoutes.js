const express = require('express');
const router = express.Router();
const {
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner
} = require('../controllers/partnerController');
const upload = require('../middleware/upload');

/**
 * @swagger
 * components:
 *   schemas:
 *     Partner:
 *       type: object
 *       required:
 *         - name
 *         - image
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the partner
 *         name:
 *           type: string
 *           description: The name of the partner
 *         image:
 *           type: string
 *           description: The image URL of the partner logo
 *       example:
 *         id: 60d5ecb74b24c72b8c8b4567
 *         name: TechCorp Inc.
 *         image: https://example.com/partner-logo.jpg
 */

/**
 * @swagger
 * /api/partners:
 *   get:
 *     summary: Get all partners
 *     tags: [Partners]
 *     responses:
 *       200:
 *         description: List of all partners
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
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Partner'
 *       500:
 *         description: Server error
 */
router.route('/')
  .get(getAllPartners)

/**
 * @swagger
 * /api/partners:
 *   post:
 *     summary: Create a new partner
 *     tags: [Partners]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the partner
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the partner (jpeg, jpg, png, gif, webp)
 *           example:
 *             name: Innovate Solutions
 *             image: (binary file)
 *     responses:
 *       201:
 *         description: Partner created successfully
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
 *                   example: Partner created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Partner'
 *       400:
 *         description: Bad request
 */
  .post(upload.single('image'), createPartner);

/**
 * @swagger
 * /api/partners/{id}:
 *   get:
 *     summary: Get a partner by ID
 *     tags: [Partners]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The partner ID
 *     responses:
 *       200:
 *         description: Partner retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Partner'
 *       404:
 *         description: Partner not found
 *       500:
 *         description: Server error
 */
router.route('/:id')
  .get(getPartnerById)

/**
 * @swagger
 * /api/partners/{id}:
 *   put:
 *     summary: Update a partner by ID
 *     tags: [Partners]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The partner ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the partner
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the partner (jpeg, jpg, png, gif, webp)
 *     responses:
 *       200:
 *         description: Partner updated successfully
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
 *                   example: Partner updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Partner'
 *       404:
 *         description: Partner not found
 *       400:
 *         description: Bad request
 */
  .put(upload.single('image'), updatePartner)

/**
 * @swagger
 * /api/partners/{id}:
 *   delete:
 *     summary: Delete a partner by ID
 *     tags: [Partners]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The partner ID
 *     responses:
 *       200:
 *         description: Partner deleted successfully
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
 *                   example: Partner deleted successfully
 *       404:
 *         description: Partner not found
 *       500:
 *         description: Server error
 */
  .delete(deletePartner);

module.exports = router;
