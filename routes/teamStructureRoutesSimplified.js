const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const teamController = require('../controllers/teamStructureControllerSimplified');

// =====================
// PUBLIC ROUTES
// =====================
router.get('/structure/public', teamController.getPublicTeamStructure);

// =====================
// ADMIN - CATEGORIES
// =====================
router.get('/categories', protect, teamController.getAllLayers);
router.post('/categories', protect, upload.single('image'), teamController.createLayer);
router.put('/categories/:id', protect, upload.single('image'), teamController.updateLayer);
router.delete('/categories/:id', protect, teamController.deleteLayer);

// =====================
// ADMIN - MEMBERS
// =====================
router.get('/members', protect, teamController.getAllMembers);
router.post('/members', protect, upload.single('image'), teamController.createMember);
router.put('/members/:id', protect, upload.single('image'), teamController.updateMember);
router.delete('/members/:id', protect, teamController.deleteMember);

module.exports = router;
