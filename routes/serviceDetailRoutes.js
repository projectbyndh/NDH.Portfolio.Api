const express = require('express');
const router = express.Router();
const {
    getAllServiceDetails,
    getServiceDetailById,
    createServiceDetail,
    updateServiceDetail,
    deleteServiceDetail
} = require('../controllers/serviceDetailController');

/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceDetail:
 *       type: object
 *       required:
 *         - serviceId
 *         - details
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated primary key
 *         serviceId:
 *           type: integer
 *           description: Foreign key referencing the parent Service (services.id)
 *         details:
 *           type: string
 *           description: Long rich-text description of the service
 *         expertise:
 *           type: array
 *           items:
 *             type: string
 *           description: List of expertise areas (e.g. ["UI Design", "Node.js"])
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           description: List of feature highlights for the service
 *         tools:
 *           type: array
 *           items:
 *             type: string
 *           description: List of tools/technologies used
 *         portfolioLink:
 *           type: string
 *           format: uri
 *           description: Optional URL to a portfolio/case study page
 *       example:
 *         id: 1
 *         serviceId: 3
 *         details: "We deliver enterprise-grade web solutions using React and Node.js..."
 *         expertise: ["Full-stack Development", "API Design"]
 *         features: ["Responsive UI", "Real-time updates", "CI/CD ready"]
 *         tools: ["React", "Node.js", "PostgreSQL", "Docker"]
 *         portfolioLink: "https://example.com/portfolio/web-dev"
 */

/**
 * @swagger
 * /api/service-details:
 *   get:
 *     summary: Get all service detail records
 *     tags: [ServiceDetails]
 *     description: Returns all service detail records including a lightweight parent service object.
 *     responses:
 *       200:
 *         description: List of all service details
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
 *                     $ref: '#/components/schemas/ServiceDetail'
 *       500:
 *         description: Server error
 */
router.route('/')
    .get(getAllServiceDetails)

/**
 * @swagger
 * /api/service-details/create:
 *   post:
 *     summary: Create a new service detail record
 *     tags: [ServiceDetails]
 *     description: |
 *       Creates a ServiceDetail linked to an existing Service via `serviceId`.
 *       - `serviceId` must reference a valid Service; otherwise a 404 is returned.
 *       - Only one ServiceDetail is allowed per Service (409 if duplicate).
 *       - `expertise`, `features`, and `tools` accept a JSON array, comma-separated string, or JS array.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceDetail'
 *     responses:
 *       201:
 *         description: ServiceDetail created successfully
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
 *                   example: Service detail created successfully
 *                 data:
 *                   $ref: '#/components/schemas/ServiceDetail'
 *       400:
 *         description: Validation error (missing required fields)
 *       404:
 *         description: Referenced Service not found
 *       409:
 *         description: A ServiceDetail already exists for this serviceId
 */
router.post('/create', createServiceDetail);

/**
 * @swagger
 * /api/service-details/{id}:
 *   get:
 *     summary: Get a service detail by its own ID
 *     tags: [ServiceDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ServiceDetail primary key
 *     responses:
 *       200:
 *         description: Service detail found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ServiceDetail'
 *       404:
 *         description: Service detail not found
 *       500:
 *         description: Server error
 */
router.route('/:id')
    .get(getServiceDetailById)

    /**
     * @swagger
     * /api/service-details/{id}:
     *   put:
     *     summary: Update a service detail by ID
     *     tags: [ServiceDetails]
     *     description: |
     *       Partial updates are supported — only send fields you want to change.
     *       If changing `serviceId`, the new value must reference an existing Service.
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ServiceDetail primary key
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ServiceDetail'
     *     responses:
     *       200:
     *         description: Service detail updated successfully
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
     *                   example: Service detail updated successfully
     *                 data:
     *                   $ref: '#/components/schemas/ServiceDetail'
     *       400:
     *         description: Validation error
     *       404:
     *         description: ServiceDetail or new referenced Service not found
     */
    .put(updateServiceDetail)

    /**
     * @swagger
     * /api/service-details/{id}:
     *   delete:
     *     summary: Delete a service detail by ID
     *     tags: [ServiceDetails]
     *     description: Deletes only the ServiceDetail record. The parent Service is unaffected.
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ServiceDetail primary key
     *     responses:
     *       200:
     *         description: Service detail deleted
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
     *                   example: Service detail deleted successfully
     *       404:
     *         description: Service detail not found
     *       500:
     *         description: Server error
     */
    .delete(deleteServiceDetail);

module.exports = router;
