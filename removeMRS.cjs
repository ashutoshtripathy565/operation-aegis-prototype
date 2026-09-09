const fs = require('fs');

let ctx = fs.readFileSync('src/context/AegisContext.jsx', 'utf8');

// Remove mrs: xx, from mock data
ctx = ctx.replace(/\s*mrs:\s*\d+,/g, '');

// Remove getMRSScore function
ctx = ctx.replace(/\/\/ Suitability Score MRS Calculation[\s\S]*?const getMRSScore = [\s\S]*?return Math\.max\(0, Math\.min\(100, score\)\);\n  \};\n/g, '');

fs.writeFileSync('src/context/AegisContext.jsx', ctx, 'utf8');

let home = fs.readFileSync('src/pages/Home.jsx', 'utf8');
home = home.replace(/CRI, MRS and DCI indices computed automatically/g, 'Wellbeing indicators computed automatically');
fs.writeFileSync('src/pages/Home.jsx', home, 'utf8');
