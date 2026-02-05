const Career = require('../models/Career');

// Get all careers
exports.getAllCareers = async (req, res) => {
  try {
    const careers = await Career.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      success: true,
      count: careers.length,
      data: careers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single career
exports.getCareerById = async (req, res) => {
  try {
    const career = await Career.findByPk(req.params.id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }

    res.status(200).json({
      success: true,
      data: career
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create career
exports.createCareer = async (req, res) => {
  try {
    // Handle image upload
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    const career = await Career.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Career created successfully',
      data: career
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create career',
      error: error.message
    });
  }
};

// Update career
exports.updateCareer = async (req, res) => {
  try {
    // Handle image upload
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    const career = await Career.findByPk(req.params.id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }

    await career.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Career updated successfully',
      data: career
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update career',
      error: error.message
    });
  }
};

// Delete career
exports.deleteCareer = async (req, res) => {
  try {
    const career = await Career.findByPk(req.params.id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }

    await career.destroy();

    res.status(200).json({
      success: true,
      message: 'Career deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
