const fs = require('fs');

let lines = fs.readFileSync('src/pages/CommanderDashboard.jsx', 'utf8').split('\n');

const startIdx = lines.findIndex(l => l.includes('{/* MISSION PLANNING SIMULATOR */}'));
const endIdx = lines.findIndex(l => l.includes('{/* QUICK VIEW POPUP MODAL */}'));

if (startIdx !== -1 && endIdx !== -1) {
  lines.splice(startIdx, endIdx - startIdx);
  fs.writeFileSync('src/pages/CommanderDashboard.jsx', lines.join('\n'), 'utf8');
  console.log(`Removed lines ${startIdx} to ${endIdx}`);
} else {
  console.log('Markers not found');
}
