const fs = require('fs');

let content = fs.readFileSync('src/pages/PersonnelDashboard.jsx', 'utf-8');

// Replace `currentSoldier, history` with `getOwnPersonnelRecord, history`
content = content.replace(/const \{\s*currentSoldier,\s*history,/g, 'const {\n    getOwnPersonnelRecord, history,');

// Replace `if (!currentSoldier)` block with call to `getOwnPersonnelRecord()`
content = content.replace(/  \/\/ Safe React boundary check/g, `  const currentSoldier = getOwnPersonnelRecord();\n\n  // Safe React boundary check`);

fs.writeFileSync('src/pages/PersonnelDashboard.jsx', content, 'utf-8');
