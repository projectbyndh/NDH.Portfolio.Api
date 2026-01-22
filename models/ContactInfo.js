const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required']
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required']
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required']
  },
  workingHours: {
    type: String,
    required: [true, 'Working hours are required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
