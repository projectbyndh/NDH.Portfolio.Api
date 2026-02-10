const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Role = sequelize.define('Role', {
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
        allowNull: false
    },
    abbreviation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    seoSlug: {
        type: DataTypes.STRING,
        unique: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    // Foreign Key for LeadershipLayer
    layerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'leadership_layers',
            key: 'id'
        }
    }
}, {
    tableName: 'roles',
    timestamps: true
});

module.exports = Role;
