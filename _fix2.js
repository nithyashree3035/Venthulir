const fs = require('fs');
let c = fs.readFileSync('client/src/pages/AdminPage.jsx', 'utf8').split('\n');
c.splice(419, 195);
fs.writeFileSync('client/src/pages/AdminPage.jsx', c.join('\n'));
console.log('Successfully Splice Healed');
