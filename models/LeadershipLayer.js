const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LeadershipLayer = sequelize.define('LeadershipLayer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isLowercase: true,
            notEmpty: true
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Optional subtitle or description for this team category'
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    visibleOn: {
        type: DataTypes.JSON,
        defaultValue: ['about', 'team'],
        comment: 'Pages where this layer should be visible'
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'leadership_layers',
    timestamps: true
});

module.exports = LeadershipLayer;
