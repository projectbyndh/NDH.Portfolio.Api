const express = require('express');
const router = express.Router();
const {
  getAllContactInfo,
  getContactInfoById,
  createContactInfo,
  updateContactInfo,
  deleteContactInfo
} = require('../controllers/contactInfoController');

/**
 * @swagger
 * components:
 *   schemas:
 *     ContactInfo:
 *       type: object
 *       required:
 *         - location
 *         - email
 *         - phone
 *         - workingHours
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the contact info
 *         location:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *               description: The physical address
 *             latitude:
 *               type: number
 *               description: The latitude coordinate
 *             longitude:
 *               type: number
 *               description: The longitude coordinate
 *           required:
 *             - address
 *             - latitude
 *             - longitude
 *         email:
 *           type: string
 *           format: email
 *           description: The contact email address
 *         phone:
 *           type: string
 *           description: The contact phone number
 *         workingHours:
 *           type: string
 *           description: The working hours information
 *       example:
 *         id: 60d5ecb74b24c72b8c8b4567
 *         location:
 *           address: Kathmandu, Nepal
 *           latitude: 27.7172
 *           longitude: 85.3240
 *         email: info@example.com
 *         phone: +977-1234567890
 *         workingHours: Mon-Fri 9AM-6PM
 */

/**
 * @swagger
 * /api/contact-info:
 *   get:
 *     summary: Get all contact info
 *     tags: [Contact Info]
 *     responses:
 *       200:
 *         description: List of all contact info
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
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ContactInfo'
 *       500:
 *         description: Server error
 */
router.route('/')
  .get(getAllContactInfo)

/**
 * @swagger
 * /api/contact-info:
 *   post:
 *     summary: Create new contact info
 *     tags: [Contact Info]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInfo'
 *           example:
 *             location:
 *               address: Pokhara, Nepal
 *               latitude: 28.2096
 *               longitude: 83.9856
 *             email: contact@example.com
 *             phone: +977-9876543210
 *             workingHours: Mon-Sat 8AM-8PM
 *     responses:
 *       201:
 *         description: Contact info created successfully
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
 *                   example: Contact info created successfully
 *                 data:
 *                   $ref: '#/components/schemas/ContactInfo'
 *       400:
 *         description: Bad request
 */
  .post(createContactInfo);

/**
 * @swagger
 * /api/contact-info/{id}:
 *   get:
 *     summary: Get contact info by ID
 *     tags: [Contact Info]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contact info ID
 *     responses:
 *       200:
 *         description: Contact info retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ContactInfo'
 *       404:
 *         description: Contact info not found
 *       500:
 *         description: Server error
 */
router.route('/:id')
  .get(getContactInfoById)

/**
 * @swagger
 * /api/contact-info/{id}:
 *   put:
 *     summary: Update contact info by ID
 *     tags: [Contact Info]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contact info ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInfo'
 *     responses:
 *       200:
 *         description: Contact info updated successfully
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
 *                   example: Contact info updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/ContactInfo'
 *       404:
 *         description: Contact info not found
 *       400:
 *         description: Bad request
 */
  .put(updateContactInfo)

/**
 * @swagger
 * /api/contact-info/{id}:
 *   delete:
 *     summary: Delete contact info by ID
 *     tags: [Contact Info]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contact info ID
 *     responses:
 *       200:
 *         description: Contact info deleted successfully
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
 *                   example: Contact info deleted successfully
 *       404:
 *         description: Contact info not found
 *       500:
 *         description: Server error
 */
  .delete(deleteContactInfo);

module.exports = router;
