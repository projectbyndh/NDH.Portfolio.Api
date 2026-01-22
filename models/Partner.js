const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Partner name is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Partner image URL is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Partner', partnerSchema);
