const fs = require('fs');
let ctx = fs.readFileSync('src/context/AegisContext.jsx', 'utf8');
ctx = ctx.replace(/return \{, dci: newDCI \};/g, 'return { success: true };');
fs.writeFileSync('src/context/AegisContext.jsx', ctx, 'utf8');
