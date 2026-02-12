const { LeadershipLayer, Team } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

// =====================
// PUBLIC ENDPOINT
// =====================

// Get public team structure (simplified - just categories and members)
exports.getPublicTeamStructure = async (req, res) => {
  try {
    const { page } = req.query;

    const whereClause = { isActive: true };
    if (page && page !== 'all') {
      whereClause.visibleOn = {
        [Op.contains]: [page]
      };
    }

    const layers = await LeadershipLayer.findAll({
      where: whereClause,
      include: [{
        model: Team,
        as: 'members',
        where: { isPublic: true },
        required: false,
        attributes: ['id', 'name', 'title', 'bio', 'image', 'socialLinks', 'order']
      }],
      order: [
        ['order', 'ASC'],
        [{ model: Team, as: 'members' }, 'order', 'ASC']
      ]
    });

    // Filter out layers with no public members
    const filteredLayers = layers
      .filter(layer => layer.members && layer.members.length > 0)
      .map(layer => ({
        id: layer.id,
        title: layer.title,
        description: layer.description,
        image: layer.image,
        order: layer.order,
        members: layer.members
      }));

    res.json({
      success: true,
      data: filteredLayers
    });
  } catch (error) {
    console.error('Error fetching public team structure:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching team structure',
      error: error.message
    });
  }
};

// =====================
// CATEGORY/LAYER MANAGEMENT
// =====================

// Get all categories
exports.getAllLayers = async (req, res) => {
  try {
    const layers = await LeadershipLayer.findAll({
      include: [{
        model: Team,
        as: 'members',
        attributes: ['id']
      }],
      order: [['order', 'ASC']]
    });

    const layersWithCounts = layers.map(layer => ({
      ...layer.toJSON(),
      memberCount: layer.members ? layer.members.length : 0
    }));

    res.json({
      success: true,
      data: layersWithCounts
    });
  } catch (error) {
    console.error('Error fetching layers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// Create category
exports.createLayer = async (req, res) => {
  try {
    const { title, key, description, order, isActive, visibleOn } = req.body;

    if (!title || !key) {
      return res.status(400).json({
        success: false,
        message: 'Title and key are required'
      });
    }

    // Check for duplicate key
    const existing = await LeadershipLayer.findOne({ where: { key } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A category with this key already exists'
      });
    }

    const layerData = {
      title,
      key,
      description: description || null,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      visibleOn: visibleOn ? JSON.parse(visibleOn) : ['about', 'team']
    };

    if (req.file) {
      layerData.image = req.file.path;
    }

    const layer = await LeadershipLayer.create(layerData);

    res.status(201).json({
      success: true,
      data: layer
    });
  } catch (error) {
    console.error('Error creating layer:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
};

// Update category
exports.updateLayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, key, description, order, isActive, visibleOn } = req.body;

    const layer = await LeadershipLayer.findByPk(id);
    if (!layer) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check for duplicate key (excluding current record)
    if (key && key !== layer.key) {
      const existing = await LeadershipLayer.findOne({
        where: {
          key,
          id: { [Op.ne]: id }
        }
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'A category with this key already exists'
        });
      }
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (key) updateData.key = key;
    if (description !== undefined) updateData.description = description;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (visibleOn) updateData.visibleOn = JSON.parse(visibleOn);
    if (req.file) updateData.image = req.file.path;

    await layer.update(updateData);

    res.json({
      success: true,
      data: layer
    });
  } catch (error) {
    console.error('Error updating layer:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
};

// Delete category
exports.deleteLayer = async (req, res) => {
  try {
    const { id } = req.params;

    const layer = await LeadershipLayer.findByPk(id);
    if (!layer) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    await layer.destroy();

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting layer:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
};

// =====================
// MEMBER MANAGEMENT
// =====================

// Get all members
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Team.findAll({
      include: [{
        model: LeadershipLayer,
        as: 'layer',
        attributes: ['id', 'title', 'key']
      }],
      order: [['layerId', 'ASC'], ['order', 'ASC']]
    });

    res.json({
      success: true,
      data: members
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching team members',
      error: error.message
    });
  }
};

// Create member
exports.createMember = async (req, res) => {
  try {
    const { name, layerId, title, bio, isPublic, order, socialLinks } = req.body;

    if (!name || !layerId || !title) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, and job title are required'
      });
    }

    // Verify category exists
    const layer = await LeadershipLayer.findByPk(layerId);
    if (!layer) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }

    const memberData = {
      name,
      layerId: parseInt(layerId),
      title,
      bio: bio || null,
      isPublic: isPublic !== undefined ? (isPublic === 'true' || isPublic === true) : true,
      order: order || 0,
      socialLinks: socialLinks ? JSON.parse(socialLinks) : {}
    };

    if (req.file) {
      memberData.image = req.file.path;
    }

    const member = await Team.create(memberData);

    // Fetch with associations
    const memberWithLayer = await Team.findByPk(member.id, {
      include: [{
        model: LeadershipLayer,
        as: 'layer',
        attributes: ['id', 'title', 'key']
      }]
    });

    res.status(201).json({
      success: true,
      data: memberWithLayer
    });
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating team member',
      error: error.message
    });
  }
};

// Update member
exports.updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, layerId, title, bio, isPublic, order, socialLinks } = req.body;

    const member = await Team.findByPk(id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Verify category if provided
    if (layerId) {
      const layer = await LeadershipLayer.findByPk(layerId);
      if (!layer) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (layerId) updateData.layerId = parseInt(layerId);
    if (title) updateData.title = title;
    if (bio !== undefined) updateData.bio = bio;
    if (isPublic !== undefined) updateData.isPublic = isPublic === 'true' || isPublic === true;
    if (order !== undefined) updateData.order = parseInt(order);
    if (socialLinks) updateData.socialLinks = JSON.parse(socialLinks);
    if (req.file) updateData.image = req.file.path;

    await member.update(updateData);

    // Fetch with associations
    const memberWithLayer = await Team.findByPk(id, {
      include: [{
        model: LeadershipLayer,
        as: 'layer',
        attributes: ['id', 'title', 'key']
      }]
    });

    res.json({
      success: true,
      data: memberWithLayer
    });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating team member',
      error: error.message
    });
  }
};

// Delete member
exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Team.findByPk(id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Clean up image file if exists
    if (member.image) {
      const imagePath = path.join(__dirname, '..', member.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await member.destroy();

    res.json({
      success: true,
      message: 'Member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status (500).json({
      success: false,
      message: 'Error deleting team member',
      error: error.message
    });
  }
};
