const express = require('express');
const router = express.Router();
const {
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} = require('../controllers/teamController');
const upload = require('../middleware/upload');

/**
 * @swagger
 * components:
 *   schemas:
 *     Team:
 *       type: object
 *       required:
 *         - name
 *         - position
 *         - description
 *         - image
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the team member
 *         name:
 *           type: string
 *           description: The name of the team member
 *         position:
 *           type: string
 *           description: The position/role of the team member
 *         description:
 *           type: string
 *           description: The description/bio of the team member
 *         image:
 *           type: string
 *           description: The image URL of the team member
 *       example:
 *         id: 60d5ecb74b24c72b8c8b4567
 *         name: John Smith
 *         position: Senior Developer
 *         description: Experienced full-stack developer with 5+ years in web technologies.
 *         image: https://example.com/john-smith.jpg
 */

/**
 * @swagger
 * /api/team:
 *   get:
 *     summary: Get all team members
 *     tags: [Team]
 *     responses:
 *       200:
 *         description: List of all team members
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
 *                     $ref: '#/components/schemas/Team'
 *       500:
 *         description: Server error
 */
router.route('/')
  .get(getAllTeamMembers)

/**
 * @swagger
 * /api/team:
 *   post:
 *     summary: Create a new team member
 *     tags: [Team]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - position
 *               - description
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the team member
 *               position:
 *                 type: string
 *                 description: The position of the team member
 *               description:
 *                 type: string
 *                 description: The description of the team member
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the team member (jpeg, jpg, png, gif, webp)
 *           example:
 *             name: Sarah Johnson
 *             position: UI/UX Designer
 *             description: Creative designer with expertise in user experience and interface design.
 *             image: (binary file)
 *     responses:
 *       201:
 *         description: Team member created successfully
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
 *                   example: Team member created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 *       400:
 *         description: Bad request
 */
  .post(upload.single('image'), createTeamMember);

/**
 * @swagger
 * /api/team/{id}:
 *   get:
 *     summary: Get a team member by ID
 *     tags: [Team]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The team member ID
 *     responses:
 *       200:
 *         description: Team member retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 *       404:
 *         description: Team member not found
 *       500:
 *         description: Server error
 */
router.route('/:id')
  .get(getTeamMemberById)

/**
 * @swagger
 * /api/team/{id}:
 *   put:
 *     summary: Update a team member by ID
 *     tags: [Team]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The team member ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the team member
 *               position:
 *                 type: string
 *                 description: The position of the team member
 *               description:
 *                 type: string
 *                 description: The description of the team member
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the team member (jpeg, jpg, png, gif, webp)
 *     responses:
 *       200:
 *         description: Team member updated successfully
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
 *                   example: Team member updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 *       404:
 *         description: Team member not found
 *       400:
 *         description: Bad request
 */
  .put(upload.single('image'), updateTeamMember)

/**
 * @swagger
 * /api/team/{id}:
 *   delete:
 *     summary: Delete a team member by ID
 *     tags: [Team]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The team member ID
 *     responses:
 *       200:
 *         description: Team member deleted successfully
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
 *                   example: Team member deleted successfully
 *       404:
 *         description: Team member not found
 *       500:
 *         description: Server error
 */
  .delete(deleteTeamMember);

module.exports = router;
