const crypto = require('crypto');

const password = process.argv[2];
if (!password) {
  console.log('Usage: node generateHash.js <password>');
  process.exit(1);
}

const hash = crypto.createHash('sha256').update(password).digest('hex');
console.log('--- ADMIN_PASSWORD_HASH ---');
console.log(hash);
console.log('---------------------------');
