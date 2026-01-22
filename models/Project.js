const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
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
    required: false
  },
  links: {
    type: [String],
    default: []
  },
  techStack: {
    type: [String],
    required: [true, 'Tech stack is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
