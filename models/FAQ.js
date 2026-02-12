const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FAQ = sequelize.define('FAQ', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Question is required'
      }
    }
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Answer is required'
      }
    }
  }
}, {
  tableName: 'faqs',
  timestamps: true
});

module.exports = FAQ;
