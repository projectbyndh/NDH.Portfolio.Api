const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Title is required' }
        }
    },
    slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    tagline: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.TEXT,
        defaultValue: '/uploads/course-placeholder.jpg'
    },
    // Instructor Details (Stored as JSON or separate columns - using columns for simplicity in Admin UI)
    instructorName: {
        type: DataTypes.STRING,
        defaultValue: 'NDH Instructor'
    },
    instructorBio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    instructorImage: {
        type: DataTypes.TEXT,
        defaultValue: '/uploads/instructor-placeholder.jpg'
    },
    instructorLinks: {
        type: DataTypes.JSON, // { linkedin: '', twitter: '', website: '' }
        defaultValue: {}
    },
    // Course Structure & Content
    whatYouWillLearn: {
        type: DataTypes.JSON, // Array of strings
        defaultValue: []
    },
    syllabus: {
        type: DataTypes.JSON, // Array of objects: [{ title: 'Module 1', lessons: ['Lesson 1', 'Lesson 2'] }]
        defaultValue: []
    },
    outcomes: {
        type: DataTypes.JSON, // Array of strings
        defaultValue: []
    },
    prerequisites: {
        type: DataTypes.JSON, // Array of strings
        defaultValue: []
    },
    targetAudience: {
        type: DataTypes.JSON, // Array of strings or String
        defaultValue: []
    },
    faqs: {
        type: DataTypes.JSON, // Array of objects: [{ question: '', answer: '' }]
        defaultValue: []
    },
    // Meta
    isPopular: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    duration: {
        type: DataTypes.STRING, // e.g., "12 Weeks"
        allowNull: true
    },
    level: {
        type: DataTypes.STRING, // Beginner, Intermediate, Advanced
        defaultValue: 'Beginner'
    },
    certificateProvided: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'courses',
    timestamps: true
});

module.exports = Course;
