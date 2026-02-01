const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true
    },
    position: {
        type: String,
        required: [true, 'Position/Company is required'],
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: '/uploads/default-avatar.png'
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: 1,
        max: 5,
        default: 5
    },
    text: {
        type: String,
        required: [true, 'Testimonial text is required'],
        trim: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
