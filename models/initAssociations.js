const LeadershipLayer = require('./LeadershipLayer');
const Role = require('./Role');
const Team = require('./Team');
const Career = require('./Career');
const CareerApplication = require('./CareerApplication');

const initAssociations = () => {
    // LeadershipLayer <-> Role
    LeadershipLayer.hasMany(Role, {
        foreignKey: 'layerId',
        as: 'roles',
        onDelete: 'CASCADE'
    });
    Role.belongsTo(LeadershipLayer, {
        foreignKey: 'layerId',
        as: 'layer'
    });

    // Role <-> Team (Member)
    Role.hasMany(Team, {
        foreignKey: 'roleId',
        as: 'members',
        onDelete: 'SET NULL'
    });
    Team.belongsTo(Role, {
        foreignKey: 'roleId',
        as: 'role'
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
