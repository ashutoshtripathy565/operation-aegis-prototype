const fs = require('fs');
let ctx = fs.readFileSync('src/context/AegisContext.jsx', 'utf8');
if (!ctx.includes('source: "UNIT"')) {
  ctx = ctx.replace(/const expandedSoldier = \{/g, 'const expandedSoldier = {\n      source: "UNIT",');
  fs.writeFileSync('src/context/AegisContext.jsx', ctx, 'utf8');
  console.log('Added source: "UNIT"');
} else {
  console.log('Already there');
}
