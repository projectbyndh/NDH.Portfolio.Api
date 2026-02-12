const ContactInfo = require('../models/ContactInfo');

// Get all contact info
exports.getAllContactInfo = async (req, res) => {
  try {
    const contactInfo = await ContactInfo.findAll();
    res.status(200).json({
      success: true,
      count: contactInfo.length,
      data: contactInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single contact info
exports.getContactInfoById = async (req, res) => {
  try {
    const contactInfo = await ContactInfo.findByPk(req.params.id);

    if (!contactInfo) {
      return res.status(404).json({
        success: false,
        message: 'Contact info not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contactInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create contact info
exports.createContactInfo = async (req, res) => {
  try {
    const contactInfo = await ContactInfo.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Contact info created successfully',
      data: contactInfo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create contact info',
      error: error.message
    });
  }
};

// Update contact info
exports.updateContactInfo = async (req, res) => {
  try {
    const contactInfo = await ContactInfo.findByPk(req.params.id);

    if (!contactInfo) {
      return res.status(404).json({
        success: false,
        message: 'Contact info not found'
      });
    }

    await contactInfo.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Contact info updated successfully',
      data: contactInfo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update contact info',
      error: error.message
    });
  }
};

// Delete contact info
exports.deleteContactInfo = async (req, res) => {
  try {
    const contactInfo = await ContactInfo.findByPk(req.params.id);

    if (!contactInfo) {
      return res.status(404).json({
        success: false,
        message: 'Contact info not found'
      });
    }

    await contactInfo.destroy();

    res.status(200).json({
      success: true,
      message: 'Contact info deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
