const fs = require('fs');
let ctx = fs.readFileSync('src/context/AegisContext.jsx', 'utf8');

ctx = ctx.replace(/source: " UNIT\\,/g, '');
fs.writeFileSync('src/context/AegisContext.jsx', ctx, 'utf8');
