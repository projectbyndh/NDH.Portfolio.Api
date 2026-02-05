/**
 * Database Initialization Script
 * 
 * This script creates all necessary tables in PostgreSQL database.
 * Run this script once after setting up your PostgreSQL database.
 * 
 * Usage: node config/initDatabase.js
 */

require('dotenv').config();
const { sequelize } = require('./database');

// Import all models to ensure they are registered with Sequelize
require('../models');

const initDatabase = async () => {
    try {
        console.log('🔄 Starting database initialization...');

        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully');

        // Sync all models with database
        // { force: true } will drop existing tables and recreate them (WARNING: This deletes all data!)
        // { alter: true } will update tables to match models (safer, but may not handle all changes)
        // {} will only create tables if they don't exist

        await sequelize.sync({ force: false, alter: true });
        console.log('✅ All models synchronized successfully');

        console.log('\n📋 Database tables created:');
        console.log('  - blogs');
        console.log('  - careers');
        console.log('  - contacts');
        console.log('  - contact_info');
        console.log('  - faqs');
        console.log('  - partners');
        console.log('  - projects');
        console.log('  - services');
        console.log('  - team_members');
        console.log('  - testimonials');

        console.log('\n✅ Database initialization completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
};

initDatabase();
