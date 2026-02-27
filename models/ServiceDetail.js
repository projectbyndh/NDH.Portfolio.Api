const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * ServiceDetail Model
 * Stores the detailed information for a specific service.
 * Each record is linked to a parent Service via the `serviceId` foreign key.
 *
 * Fields:
 *  - id          : Primary key (auto-increment)
 *  - serviceId   : Foreign key → services.id  (required, FK integrity enforced)
 *  - details     : Long-form rich text / HTML description of the service
 *  - expertise   : Array of expertise/skill tags (e.g. ["React", "Node.js"])
 *  - features    : Array of feature bullet-points for the service
 *  - tools       : Array of tool/technology names used in this service
 *  - portfolioLink: Optional URL linking to portfolio samples for this service
 */
const ServiceDetail = sequelize.define('ServiceDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  // Foreign key to the parent Service — NOT NULL enforces FK integrity at model level
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'services',
      key: 'id'
    },
    onDelete: 'CASCADE',
    validate: {
      notNull: {
        msg: 'serviceId is required'
      },
      isInt: {
        msg: 'serviceId must be a valid integer'
      }
    }
  },

  // Detailed description / rich text for the service
  details: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Details are required'
      }
    }
  },

  // Array of expertise areas (e.g. ["UI/UX Design", "API Integration"])
  expertise: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    allowNull: false
  },

  // Array of feature highlights (e.g. ["Custom dashboards", "Real-time analytics"])
  features: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    allowNull: false
  },

  // Array of tools/technologies used (e.g. ["React", "PostgreSQL", "Docker"])
  tools: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    allowNull: false
  },

  // Optional URL linking to a portfolio or case study for this service
  portfolioLink: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'portfolioLink must be a valid URL'
      }
    }
  }

}, {
  tableName: 'service_details',
  timestamps: true
});

module.exports = ServiceDetail;
