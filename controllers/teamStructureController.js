const LeadershipLayer = require('../models/LeadershipLayer');
const Role = require('../models/Role');
const Team = require('../models/Team');
const { Op } = require('sequelize');

// ============================================================
// PUBLIC API
// ============================================================

/**
 * GET /api/team-structure/structure/public
 * Returns the full nested team structure for public display.
 * Only active layers, active roles, and public members are included.
 * Properly sorted by order at every level.
 */
exports.getPublicTeamStructure = async (req, res) => {
    try {
        const { page: pageFilter } = req.query; // optional: ?page=team or ?page=about

        const layers = await LeadershipLayer.findAll({
            where: { isActive: true },
            order: [
                ['order', 'ASC'],
                [{ model: Role, as: 'roles' }, 'order', 'ASC'],
                [{ model: Role, as: 'roles' }, { model: Team, as: 'members' }, 'order', 'ASC']
            ],
            include: [
                {
                    model: Role,
                    as: 'roles',
                    where: { isActive: true },
                    required: false,
                    include: [
                        {
                            model: Team,
                            as: 'members',
                            where: { isPublic: true },
                            required: false,
                            attributes: ['id', 'name', 'designation', 'bio', 'image', 'socialLinks', 'order']
                        }
                    ]
                }
            ]
        });

        // Filter by visibleOn page if specified
        let filteredLayers = layers;
        if (pageFilter) {
            filteredLayers = layers.filter(layer => {
                const visibleOn = layer.visibleOn || ['about', 'team'];
                return Array.isArray(visibleOn) && visibleOn.includes(pageFilter);
            });
        }

        // Transform: flatten roles into a clean response with members under each layer
        const result = filteredLayers.map(layer => {
            const layerData = layer.toJSON();
            // Collect all members across roles in this layer, attaching role info
            const allMembers = [];
            (layerData.roles || []).forEach(role => {
                (role.members || []).forEach(member => {
                    allMembers.push({
                        ...member,
                        roleTitle: member.designation || role.title,
                        roleKey: role.key
                    });
                });
            });
            // Sort members by order
            allMembers.sort((a, b) => (a.order || 0) - (b.order || 0));

            return {
                id: layerData.id,
                key: layerData.key,
                title: layerData.title,
                description: layerData.description,
                image: layerData.image,
                order: layerData.order,
                members: allMembers
            };
        }).filter(layer => layer.members.length > 0); // Only return layers with visible members

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error fetching public team structure:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch team structure',
            error: error.message
        });
    }
};


// ============================================================
// ADMIN - LEADERSHIP LAYERS
// ============================================================

/** GET /api/team-structure/layers */
exports.getAllLayers = async (req, res) => {
    try {
        const layers = await LeadershipLayer.findAll({
            order: [['order', 'ASC']],
            include: [{
                model: Role,
                as: 'roles',
                attributes: ['id'],
                required: false
            }]
        });

        // Add role counts
        const result = layers.map(layer => {
            const layerJSON = layer.toJSON();
            layerJSON.roleCount = (layerJSON.roles || []).length;
            delete layerJSON.roles;
            return layerJSON;
        });

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Error fetching layers:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch layers', error: error.message });
    }
};

/** POST /api/team-structure/layers */
exports.createLayer = async (req, res) => {
    try {
        const { title, key, order, description, isActive, visibleOn } = req.body;

        if (!title || !key) {
            return res.status(400).json({ success: false, message: 'Title and key are required' });
        }

        // Check uniqueness of key
        const existing = await LeadershipLayer.findOne({ where: { key } });
        if (existing) {
            return res.status(400).json({ success: false, message: `Layer with key "${key}" already exists` });
        }

        const layerData = {
            title,
            key: key.toLowerCase(),
            order: order || 0,
            description: description || null,
            isActive: isActive !== undefined ? isActive : true,
            visibleOn: visibleOn ? (typeof visibleOn === 'string' ? JSON.parse(visibleOn) : visibleOn) : ['about', 'team']
        };

        if (req.file) {
            layerData.image = req.file.path;
        }

        const layer = await LeadershipLayer.create(layerData);
        res.status(201).json({ success: true, data: layer });
    } catch (error) {
        console.error('Error creating layer:', error);
        res.status(400).json({ success: false, message: 'Failed to create layer', error: error.message });
    }
};

/** PUT /api/team-structure/layers/:id */
exports.updateLayer = async (req, res) => {
    try {
        const layer = await LeadershipLayer.findByPk(req.params.id);
        if (!layer) {
            return res.status(404).json({ success: false, message: 'Layer not found' });
        }

        const updateData = { ...req.body };

        // Parse visibleOn if string
        if (typeof updateData.visibleOn === 'string') {
            try { updateData.visibleOn = JSON.parse(updateData.visibleOn); } catch (e) { /* keep as-is */ }
        }

        if (req.file) {
            updateData.image = req.file.path;
        }

        // Ensure key uniqueness if changing key
        if (updateData.key && updateData.key !== layer.key) {
            const existing = await LeadershipLayer.findOne({ where: { key: updateData.key, id: { [Op.ne]: layer.id } } });
            if (existing) {
                return res.status(400).json({ success: false, message: `Layer with key "${updateData.key}" already exists` });
            }
        }

        await layer.update(updateData);
        res.status(200).json({ success: true, data: layer });
    } catch (error) {
        console.error('Error updating layer:', error);
        res.status(400).json({ success: false, message: 'Failed to update layer', error: error.message });
    }
};

/** DELETE /api/team-structure/layers/:id */
exports.deleteLayer = async (req, res) => {
    try {
        const layer = await LeadershipLayer.findByPk(req.params.id, {
            include: [{ model: Role, as: 'roles', attributes: ['id'] }]
        });
        if (!layer) {
            return res.status(404).json({ success: false, message: 'Layer not found' });
        }

        const roleCount = (layer.roles || []).length;
        await layer.destroy();

        res.status(200).json({
            success: true,
            message: `Layer deleted${roleCount > 0 ? ` (${roleCount} role(s) also removed)` : ''}`
        });
    } catch (error) {
        console.error('Error deleting layer:', error);
        res.status(500).json({ success: false, message: 'Failed to delete layer', error: error.message });
    }
};


// ============================================================
// ADMIN - ROLES
// ============================================================

/** GET /api/team-structure/roles */
exports.getAllRoles = async (req, res) => {
    try {
        const where = {};
        if (req.query.layerId) {
            where.layerId = req.query.layerId;
        }

        const roles = await Role.findAll({
            where,
            include: [
                { model: LeadershipLayer, as: 'layer', attributes: ['id', 'title'] },
                { model: Team, as: 'members', attributes: ['id'], required: false }
            ],
            order: [['order', 'ASC']]
        });

        const result = roles.map(role => {
            const roleJSON = role.toJSON();
            roleJSON.memberCount = (roleJSON.members || []).length;
            delete roleJSON.members;
            return roleJSON;
        });

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch roles', error: error.message });
    }
};

/** POST /api/team-structure/roles */
exports.createRole = async (req, res) => {
    try {
        const { title, key, layerId, order, abbreviation, seoSlug, isActive } = req.body;

        if (!title || !layerId) {
            return res.status(400).json({ success: false, message: 'Title and layerId are required' });
        }

        // Verify layer exists
        const layer = await LeadershipLayer.findByPk(layerId);
        if (!layer) {
            return res.status(400).json({ success: false, message: 'Specified layer does not exist' });
        }

        const roleKey = key || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        // Check key uniqueness
        const existing = await Role.findOne({ where: { key: roleKey } });
        if (existing) {
            return res.status(400).json({ success: false, message: `Role with key "${roleKey}" already exists` });
        }

        const role = await Role.create({
            title,
            key: roleKey,
            layerId,
            order: order || 0,
            abbreviation: abbreviation || null,
            seoSlug: seoSlug || roleKey,
            isActive: isActive !== undefined ? isActive : true
        });

        // Re-fetch with layer info
        const fullRole = await Role.findByPk(role.id, {
            include: [{ model: LeadershipLayer, as: 'layer', attributes: ['id', 'title'] }]
        });

        res.status(201).json({ success: true, data: fullRole });
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(400).json({ success: false, message: 'Failed to create role', error: error.message });
    }
};

/** PUT /api/team-structure/roles/:id */
exports.updateRole = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }

        // If changing layerId, verify the new layer exists
        if (req.body.layerId && req.body.layerId !== role.layerId) {
            const layer = await LeadershipLayer.findByPk(req.body.layerId);
            if (!layer) {
                return res.status(400).json({ success: false, message: 'Specified layer does not exist' });
            }
        }

        // If changing key, check uniqueness
        if (req.body.key && req.body.key !== role.key) {
            const existing = await Role.findOne({ where: { key: req.body.key, id: { [Op.ne]: role.id } } });
            if (existing) {
                return res.status(400).json({ success: false, message: `Role with key "${req.body.key}" already exists` });
            }
        }

        await role.update(req.body);

        const fullRole = await Role.findByPk(role.id, {
            include: [{ model: LeadershipLayer, as: 'layer', attributes: ['id', 'title'] }]
        });

        res.status(200).json({ success: true, data: fullRole });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(400).json({ success: false, message: 'Failed to update role', error: error.message });
    }
};

/** DELETE /api/team-structure/roles/:id */
exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id, {
            include: [{ model: Team, as: 'members', attributes: ['id'] }]
        });
        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }

        const memberCount = (role.members || []).length;
        await role.destroy();

        res.status(200).json({
            success: true,
            message: `Role deleted${memberCount > 0 ? ` (${memberCount} member(s) now unassigned)` : ''}`
        });
    } catch (error) {
        console.error('Error deleting role:', error);
        res.status(500).json({ success: false, message: 'Failed to delete role', error: error.message });
    }
};


// ============================================================
// ADMIN - TEAM MEMBERS
// ============================================================

/** GET /api/team-structure/members */
exports.getAllMembers = async (req, res) => {
    try {
        const members = await Team.findAll({
            include: [{
                model: Role,
                as: 'role',
                attributes: ['id', 'title', 'key', 'layerId'],
                include: [{ model: LeadershipLayer, as: 'layer', attributes: ['id', 'title'] }]
            }],
            order: [['order', 'ASC'], ['name', 'ASC']]
        });
        res.status(200).json({ success: true, data: members });
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch members', error: error.message });
    }
};

/** POST /api/team-structure/members */
exports.createMember = async (req, res) => {
    try {
        if (req.file) {
            req.body.image = req.file.path;
        }

        if (!req.body.image) {
            return res.status(400).json({ success: false, message: 'Profile image is required' });
        }

        if (!req.body.name || !req.body.name.trim()) {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }

        // Parse socialLinks if string
        if (typeof req.body.socialLinks === 'string') {
            try {
                req.body.socialLinks = JSON.parse(req.body.socialLinks);
            } catch (e) {
                req.body.socialLinks = {};
            }
        }

        // Validate roleId if provided
        if (req.body.roleId) {
            const role = await Role.findByPk(req.body.roleId);
            if (!role) {
                return res.status(400).json({ success: false, message: 'Specified role does not exist' });
            }
        }

        // Copy bio to description for backward compat
        if (req.body.bio && !req.body.description) {
            req.body.description = req.body.bio;
        }

        const member = await Team.create(req.body);

        // Re-fetch with associations
        const fullMember = await Team.findByPk(member.id, {
            include: [{
                model: Role,
                as: 'role',
                attributes: ['id', 'title', 'key', 'layerId'],
                include: [{ model: LeadershipLayer, as: 'layer', attributes: ['id', 'title'] }]
            }]
        });

        res.status(201).json({ success: true, data: fullMember });
    } catch (error) {
        console.error('Error creating member:', error);
        res.status(400).json({ success: false, message: 'Failed to create member', error: error.message });
    }
};

/** PUT /api/team-structure/members/:id */
exports.updateMember = async (req, res) => {
    try {
        const member = await Team.findByPk(req.params.id);
        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        if (req.file) {
            req.body.image = req.file.path;
        }

        // Parse socialLinks if string
        if (typeof req.body.socialLinks === 'string') {
            try {
                req.body.socialLinks = JSON.parse(req.body.socialLinks);
            } catch (e) {
                // keep existing
            }
        }

        // Validate roleId if changing
        if (req.body.roleId && String(req.body.roleId) !== String(member.roleId)) {
            const role = await Role.findByPk(req.body.roleId);
            if (!role) {
                return res.status(400).json({ success: false, message: 'Specified role does not exist' });
            }
        }

        // Sync bio/description
        if (req.body.bio && !req.body.description) {
            req.body.description = req.body.bio;
        }

        await member.update(req.body);

        // Re-fetch with associations
        const fullMember = await Team.findByPk(member.id, {
            include: [{
                model: Role,
                as: 'role',
                attributes: ['id', 'title', 'key', 'layerId'],
                include: [{ model: LeadershipLayer, as: 'layer', attributes: ['id', 'title'] }]
            }]
        });

        res.status(200).json({ success: true, data: fullMember });
    } catch (error) {
        console.error('Error updating member:', error);
        res.status(400).json({ success: false, message: 'Failed to update member', error: error.message });
    }
};

/** DELETE /api/team-structure/members/:id */
exports.deleteMember = async (req, res) => {
    try {
        const member = await Team.findByPk(req.params.id);
        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        await member.destroy();
        res.status(200).json({ success: true, message: 'Member deleted successfully' });
    } catch (error) {
        console.error('Error deleting member:', error);
        res.status(500).json({ success: false, message: 'Failed to delete member', error: error.message });
    }
};
