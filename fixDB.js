const { sequelize } = require('./config/database');

async function fixDB() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        // Convert ENUM to VARCHAR
        await sequelize.query(`ALTER TABLE "careers" ALTER COLUMN "category" TYPE VARCHAR(255) USING "category"::varchar;`);
        console.log('Successfully altered columns!');
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        process.exit(0);
    }
}

fixDB();
