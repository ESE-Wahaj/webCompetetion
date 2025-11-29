const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const dbName = process.env.DB_NAME || 'shoppingmart';

async function setup() {
  try {
    console.log('\n================================================');
    console.log('🚀 ShoppingMart Complete Database Setup');
    console.log('================================================\n');

    // Step 1: Create database
    console.log('Step 1: Creating database...');
    const checkDb = await pool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (checkDb.rows.length === 0) {
      await pool.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database '${dbName}' created!`);
    } else {
      console.log(`✅ Database '${dbName}' already exists.`);
    }

    await pool.end();

    // Step 2: Run migrations
    console.log('\nStep 2: Running migrations...');
    const dbPool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: dbName,
      password: process.env.DB_PASSWORD || 'postgres',
      port: process.env.DB_PORT || 5432,
    });

    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      console.log(`   - ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      await dbPool.query(sql);
    }
    console.log('✅ Migrations completed!');

    // Step 3: Seed data
    console.log('\nStep 3: Seeding data...');
    const seedsDir = path.join(__dirname, 'seeds');
    const seedFiles = fs.readdirSync(seedsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of seedFiles) {
      console.log(`   - ${file}`);
      const filePath = path.join(seedsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      await dbPool.query(sql);
    }
    console.log('✅ Data seeded!');

    // Step 4: Verify
    console.log('\nStep 4: Verifying setup...');
    const tables = await dbPool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('\n📊 Tables created:');
    tables.rows.forEach(row => console.log(`   - ${row.table_name}`));

    const users = await dbPool.query('SELECT COUNT(*) FROM Users');
    const categories = await dbPool.query('SELECT COUNT(*) FROM Categories');
    const products = await dbPool.query('SELECT COUNT(*) FROM Products');

    console.log('\n📊 Data Summary:');
    console.log(`   - Users: ${users.rows[0].count}`);
    console.log(`   - Categories: ${categories.rows[0].count}`);
    console.log(`   - Products: ${products.rows[0].count}`);

    await dbPool.end();

    console.log('\n================================================');
    console.log('🎉 Setup Complete!');
    console.log('================================================\n');
    console.log('Next steps:');
    console.log('  1. Open pgAdmin4 and refresh databases');
    console.log('  2. Find "shoppingmart" database');
    console.log('  3. View tables under Schemas > public > Tables');
    console.log('\nTest accounts:');
    console.log('  Admin: admin@shoppingmart.com / Admin1234');
    console.log('  Customer: customer@shoppingmart.com / Customer1234\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setup();
