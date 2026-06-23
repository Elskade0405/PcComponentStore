const fs = require('fs');

const file = 'seed_cloud.js';
let content = fs.readFileSync(file, 'utf8');

// Replace `, thumbnailUrl: '...'` with empty string
content = content.replace(/, thumbnailUrl: '[^']+'/g, '');

fs.writeFileSync(file, content);
console.log('Done replacing thumbnailUrl');
