const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: process.env.DB_DIALECT || 'postgres',
        logging: console.log, // Set to console.log to see SQL queries
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: false,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
);

// Test database connection
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL Database connected successfully');

        // Sync all models with database
        // Use { force: true } to drop and recreate tables (WARNING: This will delete all data)
        // Use { alter: true } to update tables to match models (safer option)
        await sequelize.sync({ alter: true });
        console.log('✅ Database models synchronized');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
