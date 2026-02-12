const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
    getPublicTeamStructure,

    // Leadership Layers
    getAllLayers,
    createLayer,
    updateLayer,
    deleteLayer,

    // Roles
    getAllRoles,
    createRole,
    updateRole,
    deleteRole,

    // Members
    getAllMembers,
    createMember,
    updateMember,
    deleteMember

} = require('../controllers/teamStructureController');

// --- PUBLIC ---
router.get('/structure/public', getPublicTeamStructure);

// --- ADMIN LAYERS ---
router.route('/layers')
    .get(protect, getAllLayers)
    .post(protect, upload.single('image'), createLayer);

router.route('/layers/:id')
    .put(protect, upload.single('image'), updateLayer)
    .delete(protect, deleteLayer);

// --- ADMIN ROLES ---
router.route('/roles')
    .get(protect, getAllRoles)
    .post(protect, createRole);

router.route('/roles/:id')
    .put(protect, updateRole)
    .delete(protect, deleteRole);

// --- ADMIN MEMBERS ---
router.route('/members')
    .get(protect, getAllMembers)
    .post(protect, upload.single('image'), createMember);

router.route('/members/:id')
    .put(protect, upload.single('image'), updateMember)
    .delete(protect, deleteMember);

module.exports = router;
