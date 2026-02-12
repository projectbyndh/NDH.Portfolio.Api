const { sequelize } = require('./config/database');
const Team = require('./models/Team');
const Role = require('./models/Role');
const LeadershipLayer = require('./models/LeadershipLayer');

async function check() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        const layers = await LeadershipLayer.findAll();
        console.log('\n--- Layers ---');
        layers.forEach(l => console.log(`ID: ${l.id}, Title: ${l.title}, Image: ${l.image}`));

        const roles = await Role.findAll();
        console.log('\n--- Roles ---');
        roles.forEach(r => console.log(`ID: ${r.id}, Title: ${r.title}`));

        const members = await Team.findAll();
        console.log('\n--- Members ---');
        members.forEach(m => console.log(`ID: ${m.id}, Name: ${m.name}, Image: ${m.image}`));

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

check();
