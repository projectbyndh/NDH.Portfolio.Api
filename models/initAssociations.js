const LeadershipLayer = require('./LeadershipLayer');
// const Role = require('./Role'); // Removed - using simplified team structure
const Team = require('./Team');
const Career = require('./Career');
const CareerApplication = require('./CareerApplication');

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
        as: 'career' // Alias
    });
};

module.exports = initAssociations;
