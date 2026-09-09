const fs = require('fs');
let content = fs.readFileSync('src/pages/CommanderDashboard.jsx', 'utf8');

// 1. Remove the entire SIMULATION LOGIC block safely using RegExp
content = content.replace(/\/\/ ==================== SIMULATION LOGIC ====================[\s\S]*?const handleSaveMission = \(\) => \{[\s\S]*?setMissionStep\(8\);\s*\};/g, '');

// 2. Remove the MISSION PLANNING SIMULATOR JSX
content = content.replace(/\{\/\* MISSION PLANNING SIMULATOR \*\/\}[\s\S]*?\{\/\* FULL PROFILE MODAL \*\/\}/g, '{/* FULL PROFILE MODAL */}');

// 3. Remove selectedPersonnel usage in the table (checkbox and highlighting)
content = content.replace(/background: selectedPersonnel\.includes[\s\S]*?\? 'var\(--accent-cyan-glow\)' : 'var\(--bg-secondary\)',/g, "background: 'var(--bg-secondary)',");
content = content.replace(/borderColor: selectedPersonnel\.includes[\s\S]*?\? 'var\(--accent-cyan\)' : 'var\(--border-color\)'/g, "borderColor: 'var(--border-color)'");

// Remove the td with checkbox
content = content.replace(/<td style=\{\{ padding: '15px' \}\}>\s*<div style=\{\{ display: 'flex', alignItems: 'center', gap: 12 \}\}>\s*<input[\s\S]*?\/>\s*<div>/g, "<td style={{ padding: '15px' }}>\n<div>");

// Remove the button for "Mission Simulator" from navigation tabs
content = content.replace(/<button[^>]*onClick=\{\(\) => setActiveSubTab\('mission'\)\}[^>]*>[\s\S]*?<\/button>/, '');

fs.writeFileSync('src/pages/CommanderDashboard.jsx', content, 'utf8');
console.log('Cleaned CommanderDashboard.jsx thoroughly');
