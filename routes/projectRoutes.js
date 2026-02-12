const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - techStack
 *         - category
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the project
 *         name:
 *           type: string
 *           description: The name of the project
 *         client:
 *           type: string
 *           description: The client name (optional)
 *         description:
 *           type: string
 *           description: The description of the project
 *         image:
 *           type: string
 *           description: The image URL/path of the project
 *         techStack:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of technologies used
 *         category:
 *           type: string
 *           description: Primary category for UI badge
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *           description: Multiple categories for filtering
 *         services:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of services provided
 *       example:
 *         id: 1
 *         name: Numazu Halal Food
 *         client: Numazu Japan
 *         description: A cross-platform shopping ecosystem
 *         image: /uploads/project-1.jpg
 *         techStack: [".NET", "React", "Flutter"]
 *         category: Web Applications
 *         categories: ["Web Applications", "Mobile Applications"]
 *         services: ["E-commerce", "Mobile App"]
 */

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of all projects
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
 *                   example: 4
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *       500:
 *         description: Server error
 */
router.route('/')
  .get(getAllProjects)

  /**
   * @swagger
   * /api/projects:
   *   post:
   *     summary: Create a new project (supports JSON + image upload)
   *     tags: [Projects]
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - description
   *               - techStack
   *               - category
   *             properties:
   *               title:
   *                 type: string
   *                 example: Mobile Banking App
   *               description:
   *                 type: string
   *                 example: A secure mobile banking application
   *               image:
   *                 type: string
   *                 format: binary
   *                 description: Upload image file (optional if providing image URL)
   *               techStack:
   *                 type: string
   *                 example: '["React Native", "Firebase", "Stripe"]'
   *                 description: JSON string array of technologies
   *               category:
   *                 type: string
   *                 example: Mobile Development
   *               links:
   *                 type: string
   *                 example: '["https://github.com/user/banking-app"]'
   *                 description: JSON string array of links (optional)
   *     responses:
   *       201:
   *         description: Project created successfully
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
   *                   example: Project created successfully
   *                 data:
   *                   $ref: '#/components/schemas/Project'
   *       400:
   *         description: Bad request
   */
  .post(upload.single('image'), createProject);



/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.route('/:id')
  .get(getProjectById)

  /**
   * @swagger
   * /api/projects/{id}:
   *   put:
   *     summary: Update a project by ID (supports JSON + image upload)
   *     tags: [Projects]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The project ID
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               image:
   *                 type: string
   *                 format: binary
   *                 description: Upload new image file (optional)
   *               techStack:
   *                 type: string
   *                 example: '["React", "Node.js"]'
   *                 description: JSON string array of technologies
   *               category:
   *                 type: string
   *               links:
   *                 type: string
   *                 example: '["https://demo.com"]'
   *                 description: JSON string array of links
   *     responses:
   *       200:
   *         description: Project updated successfully
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
   *                   example: Project updated successfully
   *                 data:
   *                   $ref: '#/components/schemas/Project'
   *       404:
   *         description: Project not found
   *       400:
   *         description: Bad request
   */
  .put(upload.single('image'), updateProject)

  /**
   * @swagger
   * /api/projects/{id}:
   *   delete:
   *     summary: Delete a project by ID
   *     tags: [Projects]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The project ID
   *     responses:
   *       200:
   *         description: Project deleted successfully
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
   *                   example: Project deleted successfully
   *       404:
   *         description: Project not found
   *       500:
   *         description: Server error
   */
  .delete(deleteProject);

module.exports = router;
