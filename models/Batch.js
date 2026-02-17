const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Batch = sequelize.define('Batch', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Foreign Key: courseId will be handled via associations
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATE, // Storing as DATE (timestamp) but using as Date
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    timings: {
        type: DataTypes.STRING, // e.g. "Sat-Sun 6-8 PM IST"
        defaultValue: 'TBD'
    },
    mode: {
        type: DataTypes.STRING, // Live, Recorded, Hybrid
        defaultValue: 'Live Online'
    },
    totalSeats: {
        type: DataTypes.INTEGER,
        defaultValue: 20
    },
    bookedSeats: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    earlyBirdFee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    earlyBirdDeadline: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING, // ENUM: upcoming, filling fast, ongoing, completed
        defaultValue: 'upcoming'
    },
    enrollmentLink: {
        type: DataTypes.STRING, // Use if external link is provided, otherwise internal form
        allowNull: true
    }
}, {
    tableName: 'batches',
    timestamps: true
});

module.exports = Batch;
