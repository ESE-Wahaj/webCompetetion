const bcrypt = require('bcrypt');

async function generateHashes() {
  const passwords = {
    'Admin1234': null,
    'Customer1234': null
  };

  console.log('\n🔐 Generating bcrypt hashes...\n');

  for (const password of Object.keys(passwords)) {
    const hash = await bcrypt.hash(password, 12);
    passwords[password] = hash;
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}\n`);
  }

  console.log('✅ Copy these hashes to seed_users.sql\n');
}

generateHashes();
