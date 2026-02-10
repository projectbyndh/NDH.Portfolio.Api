const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Project name is required'
      }
    }
  },
  client: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Description is required'
      }
    }
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  techStack: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categories: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  services: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: []
  }
}, {
  tableName: 'projects',
  timestamps: true
});

module.exports = Project;
