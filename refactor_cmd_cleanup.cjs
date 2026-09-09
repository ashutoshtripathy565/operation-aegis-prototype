const fs = require('fs');
let content = fs.readFileSync('src/pages/CommanderDashboard.jsx', 'utf-8');

// The following are no longer used since we deleted their usage:
content = content.replace(/const \[simulationActive, setSimulationActive\] = useState\(false\);\n/g, '');
content = content.replace(/const \[missionStep, setMissionStep\] = useState\(1\);\n/g, '');
// Since we deleted the block, those variables are gone anyway.

// The trend variables getCRIHistoryPoints, etc. We deleted the chart, so let's delete them.
content = content.replace(/  \/\/ ==================== TREND LINE DATA GENERATION ====================[\s\S]*?generatePath = \(\) => \{[\s\S]*?    \}\)\.join\(' '\);\n  \};\n/g, '');
content = content.replace(/const \[chartFocus, setChartFocus\] = useState\('average'\);\n/g, '');

fs.writeFileSync('src/pages/CommanderDashboard.jsx', content, 'utf-8');
