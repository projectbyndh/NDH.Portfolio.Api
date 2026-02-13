const Contact = require('../models/Contact');
const { sendContactNotification } = require('../services/emailService');

// Get all contact submissions
exports.getAllContacts = async (req, res) => {
  try {
    console.log('📧 Fetching all contact submissions...');
    const contacts = await Contact.findAll({
      order: [['createdAt', 'DESC']]
    });
    console.log(`✅ Retrieved ${contacts.length} contact submissions`);
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('❌ Error fetching contacts:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single contact submission
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create contact submission
exports.createContact = async (req, res) => {
  try {
    console.log('📨 New contact submission received');
    console.log('👤 From:', req.body.name, '-', req.body.email);
    
    const contact = await Contact.create(req.body);
    console.log('✅ Contact submission saved with ID:', contact.id);

    // Send email notification asynchronously (don't await to keep response fast)
    console.log('📧 Sending email notification...');
    sendContactNotification(contact)
      .then(() => console.log('✅ Email notification sent successfully'))
      .catch(err => console.error('❌ Email notification failed:', err.message));

    res.status(201).json({
      success: true,
      message: 'Contact submission received successfully',
      data: contact
    });
  } catch (error) {
    console.error('❌ Error creating contact submission:', error.message);
    res.status(400).json({
      success: false,
      message: 'Failed to submit contact form',
      error: error.message
    });
  }
};

// Update contact submission
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    await contact.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Contact submission updated successfully',
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update contact submission',
      error: error.message
    });
  }
};

// Delete contact submission
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    await contact.destroy();

    res.status(200).json({
      success: true,
      message: 'Contact submission deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
