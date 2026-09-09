const fs = require('fs');

let content = fs.readFileSync('src/pages/Login.jsx', 'utf8');
content = content.replace(/handleQuickLogin\('IC-57556H', '070799'\)/, "handleQuickLogin('IC-57556H', 'admin123')");
fs.writeFileSync('src/pages/Login.jsx', content, 'utf8');

console.log('Fixed Login.jsx password');
