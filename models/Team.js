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
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'roles',
      key: 'id'
    }
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Custom designation override (e.g. "Lead Developer"). If null, the role title is used.'
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
