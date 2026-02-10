const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function runMigration() {
  const client = await pool.connect();
  try {
    // Migration 1: Convert visibleOn to JSON
    console.log('🔄 Running migration 1: convert_visibleOn_to_json.sql');
    const migration1Path = path.join(__dirname, 'migrations', 'convert_visibleOn_to_json.sql');
    const sql1 = fs.readFileSync(migration1Path, 'utf8');
    await client.query(sql1);
    console.log('✅ Migration 1 completed!');
    
    // Migration 2: Add missing columns
    console.log('🔄 Running migration 2: add_missing_columns.sql');
    const migration2Path = path.join(__dirname, 'migrations', 'add_missing_columns.sql');
    const sql2 = fs.readFileSync(migration2Path, 'utf8');
    await client.query(sql2);
    console.log('✅ Migration 2 completed!');
    
    // Migration 3: Simplify team structure
    console.log('🔄 Running migration 3: simplify_team_structure.sql');
    const migration3Path = path.join(__dirname, 'migrations', 'simplify_team_structure.sql');
    const sql3 = fs.readFileSync(migration3Path, 'utf8');
    await client.query(sql3);
    console.log('✅ Migration 3 completed!');
    
    console.log('✅ All migrations completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
