const fs = require('fs');

let content = fs.readFileSync('src/pages/CommanderDashboard.jsx', 'utf-8');

// 1. Remove Mission Planner Inputs
content = content.replace(/  \/\/ Mission Planner Inputs[\s\S]*?const \[missionStep, setMissionStep\] = useState\(1\);/, '');

// 2. Remove SIMULATION LOGIC
content = content.replace(/  \/\/ ==================== SIMULATION LOGIC ====================[\s\S]*?const handleSaveMission = \(\) => \{[\s\S]*?\};\n/, '');

// 3. Remove Mission Simulator button
content = content.replace(/<button \s*onClick=\{\(\) => \{ setActiveSubTab\('mission'\); setMissionStep\(1\); setSimulationActive\(false\); \}\} \s*className=\{activeSubTab === 'mission' \? 'btn-cyber-primary' : 'btn-cyber'\}\s*>\s*Mission Simulator\s*<\/button>/g, '');

// 4. Remove activeSubTab === 'mission' block
content = content.replace(/      \{\/\* MISSION PLANNING SIMULATOR \*\/\}.*?\{activeSubTab === 'mission' && \([\s\S]*?      \)\}/g, '');

// 5. Remove Squad Readiness Rankings & Latest Assessments
// Looking for: {/* Table: Latest Assessments */} ... to the end of that block.
content = content.replace(/          \{\/\* Table: Latest Assessments \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*\)\}/g, '        </div>\n      )}');

// 6. In Section Personnel table, remove CRI column header and data.
content = content.replace(/<th style=\{\{ textAlign: 'center', paddingBottom: 12 \}\}>CRI<\/th>/g, '');
content = content.replace(/<td style=\{\{ padding: '12px 0', textAlign: 'center', color: band\.color, fontWeight: 'bold' \}\} className="text-mono">\{s\.cri\}<\/td>/g, '');

// 7. In Full Profile view, remove CRI domain scores
content = content.replace(/                \{\/\* Section 3: CRI Pillar Breakdown \*\/\}[\s\S]*?\{\/\* Section 4: Operational History \*\/\}/g, '{/* Section 4: Operational History */}');

// 8. Fix the KPIs. Average CRI -> High Risk Count, Section Status -> Reviews Required
content = content.replace(/Average CRI/g, 'Welfare Alerts');
content = content.replace(/\{avgCRI\} <span style=\{\{ fontSize: '14px', color: 'var\(--text-muted\)' \}\}>\/ 100<\/span>/g, '{welfareHigh + welfareCritical}');
content = content.replace(/Section Average/g, 'High & Critical Risk');

content = content.replace(/Section Status/g, 'Welfare Review');
content = content.replace(/\{sectionStatus\}/g, '{welfareReviewCount > 0 ? "REVIEW REQ" : "CLEAR"}');
content = content.replace(/Section clearances/g, 'Required reviews');
content = content.replace(/const sectionStatusColor = sectionStatus === 'READY' \? 'var\(--status-ready\)' : sectionStatus === 'DEGRADED' \? 'var\(--status-monitor\)' : 'var\(--status-critical\)';/g, 'const sectionStatusColor = welfareReviewCount === 0 ? \'var(--status-ready)\' : \'var(--status-monitor)\';');

// 9. Remove 7-Day CRI Trend
content = content.replace(/          \{\/\* SVG Trend and Distribution \*\/\}[\s\S]*?\{\/\* Commander Welfare Summary \*\/\}/g, '{/* Commander Welfare Summary */}');

fs.writeFileSync('src/pages/CommanderDashboard.jsx', content, 'utf-8');
