const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CareerApplication = sequelize.define('CareerApplication', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    careerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'careers',
            key: 'id'
        }
    },
    careerTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Full name is required'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Please provide a valid email'
            }
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    coverLetter: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    cvUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'CV is required'
            }
        }
    },
    status: {
        type: DataTypes.ENUM('pending', 'reviewed', 'shortlisted', 'rejected'),
        defaultValue: 'pending'
    }
}, {
    tableName: 'career_applications',
    timestamps: true
});

module.exports = CareerApplication;
