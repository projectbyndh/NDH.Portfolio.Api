const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getServiceById,
  getServiceDetails,
  createService,
  updateService,
  deleteService,
  getServicesLite
} = require('../controllers/serviceController');
const upload = require('../middleware/upload');

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated primary key
 *         title:
 *           type: string
 *           description: Service title
 *         shortDesc:
 *           type: string
 *           description: Short description of the service (aliased from `description` column)
 *         logo:
 *           type: string
 *           description: Cloudinary URL of the service logo
 *         tagline:
 *           type: string
 *           description: Optional tagline shown on cards
 *         capabilities:
 *           type: array
 *           items:
 *             type: string
 *           description: High-level capability labels
 *       example:
 *         id: 1
 *         title: Web Development
 *         shortDesc: We build modern, scalable web applications.
 *         logo: https://res.cloudinary.com/example/image/upload/v1/logo.png
 *         tagline: From idea to deployment
 *         capabilities: ["React", "Node.js", "PostgreSQL"]
 */

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     description: Returns all services ordered by creation date (newest first).
 *     responses:
 *       200:
 *         description: List of all services
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
 *                     $ref: '#/components/schemas/Service'
 *       500:
 *         description: Server error
 */
router.route('/')
  .get(getAllServices);

/**
 * @swagger
 * /api/services/lite:
 *   get:
 *     summary: Get a lightweight list of services (ID and Title only)
 *     tags: [Services]
 *     description: Returns only IDs and Titles. Perfect for populating dropdowns and selectors.
 *     responses:
 *       200:
 *         description: List of service identifiers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 */
router.get('/lite', getServicesLite);

/**
 * @swagger
 * /api/services/create:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Logo image file (jpeg/png/webp)
 *               description:
 *                 type: string
 *                 description: Short description (shortDesc)
 *               tagline:
 *                 type: string
 *               capabilities:
 *                 type: string
 *                 description: JSON array or comma-separated list of capabilities
 *               details:
 *                 type: string
 *                 description: (Detail) Long rich-text description
 *               expertise:
 *                 type: string
 *                 description: (Detail) JSON array or comma-separated list
 *               features:
 *                 type: string
 *                 description: (Detail) JSON array or comma-separated list
 *               tools:
 *                 type: string
 *                 description: (Detail) JSON array or comma-separated list
 *               portfolioLink:
 *                 type: string
 *                 description: (Detail) Optional URL
 *     responses:
 *       201:
 *         description: Service and details created successfully
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
 *                   $ref: '#/components/schemas/Service'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 */
router.post('/create', upload.single('logo'), createService);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Service primary key
 *     responses:
 *       200:
 *         description: Service found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Service'
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.route('/:id')
  .get(getServiceById)

  /**
   * @swagger
   * /api/services/{id}:
   *   put:
   *     summary: Update a service by ID
   *     tags: [Services]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: Service primary key
   *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *               description:
 *                 type: string
 *               tagline:
 *                 type: string
 *               capabilities:
 *                 type: string
 *               details:
 *                 type: string
 *               expertise:
 *                 type: string
 *               features:
 *                 type: string
 *               tools:
 *                 type: string
 *               portfolioLink:
 *                 type: string
 *     responses:
 *       200:
 *         description: Service and details updated successfully
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
 *                   $ref: '#/components/schemas/Service'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Service not found
 */
  .put(upload.single('logo'), updateService)

  /**
   * @swagger
   * /api/services/{id}:
   *   delete:
   *     summary: Delete a service by ID
   *     tags: [Services]
   *     description: |
   *       Deletes the service and **automatically cascades** to delete the associated
   *       ServiceDetail record (if one exists).
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: Service primary key
   *     responses:
   *       200:
   *         description: Service and its details deleted successfully
   *       404:
   *         description: Service not found
   *       500:
   *         description: Server error
   */
  .delete(deleteService);

/**
 * @swagger
 * /api/services/{id}/details:
 *   get:
 *     summary: Get full details for a service
 *     tags: [Services]
 *     description: |
 *       Fetches the service record merged with its ServiceDetail record.
 *       The `{id}` param accepts:
 *       - A **numeric ID** (e.g. `/api/services/3/details`)
 *       - A **title slug** (e.g. `/api/services/web-development/details`) —
 *         dashes are converted to spaces and matched case-insensitively.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Service numeric ID or slug-style title
 *     responses:
 *       200:
 *         description: Service with merged detail data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     shortDesc:
 *                       type: string
 *                     logo:
 *                       type: string
 *                     tagline:
 *                       type: string
 *                     capabilities:
 *                       type: array
 *                       items:
 *                         type: string
 *                     details:
 *                       type: string
 *                     expertise:
 *                       type: array
 *                       items:
 *                         type: string
 *                     features:
 *                       type: array
 *                       items:
 *                         type: string
 *                     tools:
 *                       type: array
 *                       items:
 *                         type: string
 *                     portfolioLink:
 *                       type: string
 *                     detailId:
 *                       type: integer
 *       404:
 *         description: Service or ServiceDetail not found
 *       500:
 *         description: Server error
 */
router.get('/:id/details', getServiceDetails);

module.exports = router;
