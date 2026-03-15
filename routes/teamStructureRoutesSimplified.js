const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const teamController = require('../controllers/teamStructureControllerSimplified');

// =====================
// PUBLIC ROUTES
// =====================
/**
 * @swagger
 * /api/team-structure/structure/public:
 *   get:
 *     summary: Get public team structure
 *     tags: [Team Structure]
 *     responses:
 *       200:
 *         description: Team structure data
 */
router.get('/structure/public', teamController.getPublicTeamStructure);

/**
 * @swagger
 * /api/team-structure/categories:
 *   get:
 *     summary: Get all team layers/categories (Admin)
 *     tags: [Team Structure]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of layers
 */
router.get('/categories', protect, teamController.getAllLayers);

/**
 * @swagger
 * /api/team-structure/categories:
 *   post:
 *     summary: Create a new team layer (Admin)
 *     tags: [Team Structure]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Layer created
 */
router.post('/categories', protect, upload.single('image'), teamController.createLayer);

/**
 * @swagger
 * /api/team-structure/categories/{id}:
 *   put:
 *     summary: Update a team layer (Admin)
 *     tags: [Team Structure]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Layer updated
 */
router.put('/categories/:id', protect, upload.single('image'), teamController.updateLayer);

/**
 * @swagger
 * /api/team-structure/categories/{id}:
 *   delete:
 *     summary: Delete a team layer (Admin)
 *     tags: [Team Structure]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Layer deleted
 */
router.delete('/categories/:id', protect, teamController.deleteLayer);

/**
 * @swagger
 * /api/team-structure/members:
 *   get:
 *     summary: Get all team members (Admin)
 *     tags: [Team Structure]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of members
 */
router.get('/members', protect, teamController.getAllMembers);

/**
 * @swagger
 * /api/team-structure/members:
 *   post:
 *     summary: Create a new team member (Admin)
 *     tags: [Team Structure]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Member created
 */
router.post('/members', protect, upload.single('image'), teamController.createMember);

/**
 * @swagger
 * /api/team-structure/members/{id}:
 *   put:
 *     summary: Update a team member (Admin)
 *     tags: [Team Structure]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Member updated
 */
router.put('/members/:id', protect, upload.single('image'), teamController.updateMember);

/**
 * @swagger
 * /api/team-structure/members/{id}:
 *   delete:
 *     summary: Delete a team member (Admin)
 *     tags: [Team Structure]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Member deleted
 */
router.delete('/members/:id', protect, teamController.deleteMember);

module.exports = router;
