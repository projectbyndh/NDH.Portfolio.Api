const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  requirements: {
    type: [String],
    required: [true, 'Requirements are required']
  },
  responsibilities: {
    type: [String],
    required: [true, 'Responsibilities are required']
  },
  applyLink: {
    type: String,
    required: [true, 'Apply link is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Career', careerSchema);
