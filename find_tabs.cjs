const fs = require('fs');
const lines = fs.readFileSync('src/pages/PersonnelDashboard.jsx', 'utf-8').split('\n');

const assIdx = lines.findIndex(l => l.includes("{activeSubTab === 'assessment' && ("));
const devIdx = lines.findIndex(l => l.includes("{activeSubTab === 'device' && ("));

console.log('Assessment Tab Starts at:', assIdx);
console.log('Device Tab Starts at:', devIdx);
