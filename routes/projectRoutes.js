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
 *         - category
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the project
 *         name:
 *           type: string
 *         client:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: string
 *           description: URL/path to the project image
 *         techStack:
 *           type: array
 *           items:
 *             type: string
 *         category:
 *           type: string
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *         services:
 *           type: array
 *           items:
 *             type: string
 *       example:
 *         id: 1
 *         name: Numazu Halal Food
 *         client: Numazu Japan
 *         description: A cross-platform shopping ecosystem
 *         image: https://res.cloudinary.com/example/image/upload/v1/project.jpg
 *         techStack: [".NET", "React", "Flutter"]
 *         category: Web Applications
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
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 */
router.route('/')
  .get(getAllProjects);

/**
 * @swagger
 * /api/projects/create:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               client:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               techStack:
 *                 type: string
 *                 description: JSON array or comma-separated list
 *               categories:
 *                 type: string
 *                 description: JSON array or comma-separated list
 *               services:
 *                 type: string
 *                 description: JSON array or comma-separated list
 *     responses:
 *       201:
 *         description: Project created
 */
router.post('/create', upload.single('image'), createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project found
 *       404:
 *         description: Project not found
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               client:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               techStack:
 *                 type: string
 *               categories:
 *                 type: string
 *               services:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project deleted
 */
router.route('/:id')
  .get(getProjectById)
  .put(upload.single('image'), updateProject)
  .delete(deleteProject);

module.exports = router;
