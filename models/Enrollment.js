const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Enrollment = sequelize.define('Enrollment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Foreign Keys: courseId and batchId will be handled via associations
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    qualification: {
        type: DataTypes.STRING, // e.g. "Bachelor's Degree", "Student", "Working Professional"
        allowNull: true
    },
    profession: {
        type: DataTypes.STRING, // e.g. "Software Engineer", "Student"
        allowNull: true
    },
    source: {
        type: DataTypes.STRING, // e.g. "Google", "LinkedIn", "Referral"
        allowNull: true
    },
    message: { // "Any questions?"
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING, // ENUM: new, contacted, enrolled, rejected
        defaultValue: 'new'
    },
    contactedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    enrolledAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    notes: { // Admin notes
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'enrollments',
    timestamps: true
});

module.exports = Enrollment;
