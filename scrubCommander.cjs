const fs = require('fs');
let cd = fs.readFileSync('src/pages/CommanderDashboard.jsx', 'utf8');

// Replace raw stress score displays with band labels
cd = cd.replace(/<td style=\{\{ padding: '8px 0', textAlign: 'center', fontWeight: 'bold' \}\} className="text-mono">\{\(h\.values \? h\.values\.stressScore \* 10 : h\.stressScore \* 10\)\}<\/td>/g, '');
// Remove the DCI cell from history table too
cd = cd.replace(/<td style=\{\{ padding: '8px 0', textAlign: 'center', color: 'var\(--accent-cyan\)' \}\} className="text-mono">\{h\.dci\}%<\/td>/g, '');
// Remove PRS SCORE heading
cd = cd.replace(/<span className="text-mono" style=\{\{ fontSize: '9px', color: 'var\(--text-muted\)' \}\}>PRS SCORE<\/span>/g, '<span className="text-mono" style={{ fontSize: \'9px\', color: \'var(--text-muted)\' }}>WELFARE STATUS</span>');
// Remove CRAE CALCULATOR heading
cd = cd.replace(/<span className="text-mono" style=\{\{ fontSize: '11px', color: 'var\(--text-muted\)' \}\}>CRAE CALCULATOR<\/span>/g, '<span className="text-mono" style={{ fontSize: \'11px\', color: \'var(--text-muted)\' }}>WELFARE STATUS</span>');

// Replace {soldier.wellness?.stressScore} with {sBand.label}
cd = cd.replace(/\{soldier\.wellness\?\.stressScore\}/g, '');
// Replace {quickViewSoldier.wellness?.stressScore} with label
cd = cd.replace(/\{quickViewSoldier\.wellness\?\.stressScore\}/g, '');

// The tables headers might need updating
cd = cd.replace(/<th style=\{\{ padding: '12px 0', textAlign: 'center' \}\}>SCORE<\/th>/g, '');
cd = cd.replace(/<th style=\{\{ padding: '12px 0', textAlign: 'center' \}\}>DCI<\/th>/g, '');

fs.writeFileSync('src/pages/CommanderDashboard.jsx', cd, 'utf8');
