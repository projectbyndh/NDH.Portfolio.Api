const Partner = require('../models/Partner');

// Get all partners
exports.getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: partners.length,
      data: partners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single partner
exports.getPartnerById = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: partner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create partner
exports.createPartner = async (req, res) => {
  try {
    // Handle image upload
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    const partner = await Partner.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Partner created successfully',
      data: partner
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create partner',
      error: error.message
    });
  }
};

// Update partner
exports.updatePartner = async (req, res) => {
  try {
    // Handle image upload
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    const partner = await Partner.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Partner updated successfully',
      data: partner
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update partner',
      error: error.message
    });
  }
};

// Delete partner
exports.deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Partner deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
