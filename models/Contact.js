const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required']
  },
  companyName: {
    type: String,
    trim: true
  },
  serviceInterested: {
    type: String,
    required: [true, 'Service interested is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
