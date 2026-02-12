const Team = require('../models/Team');

// Get all team members
exports.getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await Team.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      success: true,
      count: teamMembers.length,
      data: teamMembers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single team member
exports.getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await Team.findByPk(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create team member
exports.createTeamMember = async (req, res) => {
  try {
    console.log('📥 createTeamMember called');
    console.log('📁 req.file:', req.file);
    console.log('📄 req.body:', req.body);

    // Handle image upload
    if (req.file) {
      req.body.image = req.file.path;
    }

    const teamMember = await Team.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      data: teamMember
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create team member',
      error: error.message
    });
  }
};

// Update team member
exports.updateTeamMember = async (req, res) => {
  try {
    // Handle image upload
    if (req.file) {
      req.body.image = req.file.path;
    }

    const teamMember = await Team.findByPk(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    await teamMember.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Team member updated successfully',
      data: teamMember
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update team member',
      error: error.message
    });
  }
};

// Delete team member
exports.deleteTeamMember = async (req, res) => {
  try {
    console.log('🗑️ deleteTeamMember called for ID:', req.params.id);

    const teamMember = await Team.findByPk(req.params.id);

    if (!teamMember) {
      console.log('❌ Team member not found');
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    await teamMember.destroy();
    console.log('✅ Team member deleted successfully');

    res.status(200).json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
