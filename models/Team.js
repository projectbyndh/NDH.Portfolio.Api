const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Team = sequelize.define('Team', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Name is required' }
    }
  },
  layerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'leadership_layers',
      key: 'id'
    },
    comment: 'Which category/team this member belongs to'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Job title/designation (e.g., CEO, Senior Developer, Marketing Manager)'
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Legacy field - use bio instead'
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  socialLinks: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'team_members',
  timestamps: true
});

module.exports = Team;
