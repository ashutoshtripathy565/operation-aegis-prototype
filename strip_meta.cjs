const fs = require('fs');
let txt = fs.readFileSync('src/context/AegisContext.jsx', 'utf8');
txt = txt.replace(/import\.meta\.env\.DEV/g, 'true');
txt = txt.replace(/import\.meta\.env\.VITE_AEGIS_DEMO_MODE/g, '"false"');
fs.writeFileSync('AegisContext_test.jsx', txt);
