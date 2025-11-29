const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'shoppingmart',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function runSeeds() {
  try {
    const seedsDir = path.join(__dirname, 'seeds');
    const seedFiles = fs.readdirSync(seedsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log('\n🌱 Seeding database...\n');

    for (const file of seedFiles) {
      console.log(`   Running: ${file}...`);
      const filePath = path.join(seedsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      await pool.query(sql);
      console.log(`   ✅ ${file} completed`);
    }

    console.log('\n✅ All seeds completed successfully!\n');

    // Verify data
    console.log('📊 Data Summary:');

    const users = await pool.query('SELECT COUNT(*) FROM Users');
    console.log(`   - Users: ${users.rows[0].count}`);

    const categories = await pool.query('SELECT COUNT(*) FROM Categories');
    console.log(`   - Categories: ${categories.rows[0].count}`);

    const products = await pool.query('SELECT COUNT(*) FROM Products');
    console.log(`   - Products: ${products.rows[0].count}`);

    console.log('\n================================================');
    console.log('🎉 Database seeded successfully!');
    console.log('================================================\n');
    console.log('Test accounts:');
    console.log('  Admin: admin@shoppingmart.com / Admin1234');
    console.log('  Customer: customer@shoppingmart.com / Customer1234\n');

  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

runSeeds();
