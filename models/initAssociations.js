const LeadershipLayer = require('./LeadershipLayer');
// const Role = require('./Role'); // Removed - using simplified team structure
const Team = require('./Team');
const Career = require('./Career');
const CareerApplication = require('./CareerApplication');
const Course = require('./Course');
const Batch = require('./Batch');
const Enrollment = require('./Enrollment');

const initAssociations = () => {
    // LeadershipLayer <-> Role (REMOVED - using simplified structure without roles)
    // LeadershipLayer.hasMany(Role, {
    //     foreignKey: 'layerId',
    //     as: 'roles',
    //     onDelete: 'CASCADE'
    // });
    // Role.belongsTo(LeadershipLayer, {
    //     foreignKey: 'layerId',
    //     as: 'layer'
    // });

    // LeadershipLayer <-> Team (Member) - Direct relationship (simplified)
    LeadershipLayer.hasMany(Team, {
        foreignKey: 'layerId',
        as: 'members',
        onDelete: 'CASCADE'
    });
    Team.belongsTo(LeadershipLayer, {
        foreignKey: 'layerId',
        as: 'layer'
    });

    // Career <-> CareerApplication
    Career.hasMany(CareerApplication, {
        foreignKey: 'careerId',
        as: 'applications',
        onDelete: 'CASCADE' // Cascade delete
    });
    CareerApplication.belongsTo(Career, {
        foreignKey: 'careerId',
    });

    // Course <-> Batch
    Course.hasMany(Batch, {
        foreignKey: 'courseId',
        as: 'batches',
        onDelete: 'CASCADE'
    });
    Batch.belongsTo(Course, {
        foreignKey: 'courseId',
        as: 'course'
    });

    // Course <-> Enrollment
    Course.hasMany(Enrollment, {
        foreignKey: 'courseId',
        as: 'enrollments',
        onDelete: 'CASCADE'
    });
    Enrollment.belongsTo(Course, {
        foreignKey: 'courseId',
        as: 'course'
    });

    // Batch <-> Enrollment
    Batch.hasMany(Enrollment, {
        foreignKey: 'batchId',
        as: 'enrollments',
        onDelete: 'SET NULL' // Keep enrollment record even if batch is deleted
    });
    Enrollment.belongsTo(Batch, {
        foreignKey: 'batchId',
        as: 'batch'
    });
};

module.exports = initAssociations;
