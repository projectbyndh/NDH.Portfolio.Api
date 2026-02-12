const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Career = sequelize.define('Career', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Title is required'
      }
    }
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
  requirements: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Requirements are required'
      }
    }
  },
  responsibilities: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Responsibilities are required'
      }
    }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Location is required'
      }
    }
  },
  category: {
    type: DataTypes.ENUM('CTO', 'CEO', 'CFO', 'Senior Developer', 'Developer', 'Intern'),
    allowNull: false,
    defaultValue: 'Developer',
    validate: {
      isIn: {
        args: [['CTO', 'CEO', 'CFO', 'Senior Developer', 'Developer', 'Intern']],
        msg: "Category must be one of: CTO, CEO, CFO, Senior Developer, Developer, Intern"
      }
    }
  }
}, {
  tableName: 'careers',
  timestamps: true
});

module.exports = Career;
