const fs = require('fs');
let ctx = fs.readFileSync('src/context/AegisContext.jsx', 'utf8');

ctx = ctx.replace(/const newCRI = /g, 'const newPRS = ');
ctx = ctx.replace(/prs: newCRI,/g, 'prs: newPRS,');
ctx = ctx.replace(/CRI: \$\{newCRI\}/g, 'PRS: ${newPRS}');
ctx = ctx.replace(/prs: newCRI/g, 'prs: newPRS');

fs.writeFileSync('src/context/AegisContext.jsx', ctx, 'utf8');

// personnel dashboard
let pd = fs.readFileSync('src/pages/PersonnelDashboard.jsx', 'utf8');
pd = pd.replace(/const \[calculatedCRI, setCalculatedCRI\] = useState\(null\);/g, '');
pd = pd.replace(/setCalculatedCRI\(result\.prs\);/g, '');
fs.writeFileSync('src/pages/PersonnelDashboard.jsx', pd, 'utf8');

// commander dashboard
let cd = fs.readFileSync('src/pages/CommanderDashboard.jsx', 'utf8');
cd = cd.replace(/getCRIHistoryPoints/g, 'getWellbeingHistoryPoints');
fs.writeFileSync('src/pages/CommanderDashboard.jsx', cd, 'utf8');

console.log('Fixed CRI references');
