const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres', // Connect to default database first
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const dbName = process.env.DB_NAME || 'shoppingmart';

async function createDatabase() {
  try {
    // Check if database exists
    const checkDb = await pool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (checkDb.rows.length === 0) {
      console.log(`📦 Creating database: ${dbName}...`);
      await pool.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database '${dbName}' created successfully!`);
    } else {
      console.log(`✅ Database '${dbName}' already exists.`);
    }
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    throw error;
  }
}

async function runMigrations() {
  // Connect to the shoppingmart database
  const dbPool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: dbName,
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
  });

  try {
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log('\n🚀 Running migrations...\n');

    for (const file of migrationFiles) {
      console.log(`   Running: ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      await dbPool.query(sql);
      console.log(`   ✅ ${file} completed`);
    }

    console.log('\n✅ All migrations completed successfully!\n');

    // Verify tables
    const tables = await dbPool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('📊 Tables created:');
    tables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

  } catch (error) {
    console.error('❌ Migration error:', error.message);
    throw error;
  } finally {
    await dbPool.end();
  }
}

async function dropDatabase() {
  try {
    console.log(`🗑️  Dropping database: ${dbName}...`);

    // Terminate existing connections
    await pool.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = $1
      AND pid <> pg_backend_pid()
    `, [dbName]);

    await pool.query(`DROP DATABASE IF EXISTS ${dbName}`);
    console.log(`✅ Database '${dbName}' dropped successfully!`);
  } catch (error) {
    console.error('❌ Error dropping database:', error.message);
    throw error;
  }
}

async function main() {
  const command = process.argv[2];

  try {
    if (command === 'up') {
      console.log('\n================================================');
      console.log('🔧 ShoppingMart Database Migration');
      console.log('================================================\n');

      await createDatabase();
      await runMigrations();

      console.log('================================================');
      console.log('🎉 Migration completed successfully!');
      console.log('================================================\n');
      console.log('Next steps:');
      console.log('  1. Run: npm run seed (to add sample data)');
      console.log('  2. Open pgAdmin4 and refresh databases');
      console.log('  3. Find "shoppingmart" database\n');

    } else if (command === 'down') {
      console.log('\n⚠️  WARNING: This will delete the entire database!');
      await dropDatabase();

    } else {
      console.log('Usage:');
      console.log('  npm run migrate:up   - Create database and run migrations');
      console.log('  npm run migrate:down - Drop database');
    }
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
