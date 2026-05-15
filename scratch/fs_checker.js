const fs = require('fs');
const path = require('path');

const dir = 'public/images/images/product';
const files = fs.readdirSync(dir);
const silverFiles = files.filter(f => f.toLowerCase().includes('silver'));
console.log('Silver Files:', silverFiles);

const whiteGoldFiles = files.filter(f => f.toLowerCase().includes('white-gold'));
console.log('White Gold Files Count:', whiteGoldFiles.length);

const platinumFiles = files.filter(f => f.toLowerCase().includes('platinum'));
console.log('Platinum Files Count:', platinumFiles.length);

process.exit(0);
