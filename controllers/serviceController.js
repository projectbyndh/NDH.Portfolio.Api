const Service = require('../models/Service');

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single service
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create service
exports.createService = async (req, res) => {
  try {
    // Handle logo upload
    if (req.file) {
      req.body.logo = req.file.path; // Cloudinary URL
    }

    // Parse capabilities if it's a string
    if (typeof req.body.capabilities === 'string') {
      try {
        req.body.capabilities = JSON.parse(req.body.capabilities);
      } catch (e) {
        req.body.capabilities = req.body.capabilities.split(',').map(s => s.trim());
      }
    }

    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create service',
      error: error.message
    });
  }
};

// Update service
exports.updateService = async (req, res) => {
  try {
    // Handle logo upload
    if (req.file) {
      req.body.logo = req.file.path; // Cloudinary URL
    }

    // Parse capabilities if it's a string
    if (typeof req.body.capabilities === 'string') {
      try {
        req.body.capabilities = JSON.parse(req.body.capabilities);
      } catch (e) {
        req.body.capabilities = req.body.capabilities.split(',').map(s => s.trim());
      }
    }

    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    await service.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update service',
      error: error.message
    });
  }
};

// Delete service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    await service.destroy();

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
