const fs = require('fs');

let content = fs.readFileSync('src/pages/CommanderDashboard.jsx', 'utf-8');

// Replace soldiers destructuring
content = content.replace(/    soldiers, history, getReadinessBand,/, '    getAggregateCommandData, history, getReadinessBand,');

// Get aggregate data inside the component
content = content.replace(/  const \[chartFocus, setChartFocus\] = useState\('average'\); /g, `
  const [chartFocus, setChartFocus] = useState('average'); 

  // Fetch role-restricted aggregate intelligence
  const aggregateData = getAggregateCommandData();
  const soldiers = aggregateData.personnelRoster;
`);

// Now replace references to soldiers where it was calculating totals manually
content = content.replace(/  const totalSoldiers = soldiers\.length;\n  const activeSoldiers = soldiers\.filter\(s => s\.role === 'soldier'\);\n  const assessedToday = soldiers\.filter\(s => s\.lastAssessment !== '—'\)\.length;\n  const avgCRI = Math\.round\(soldiers\.reduce\(\(acc, s\) => acc \+ s\.cri, 0\) \/ totalSoldiers \* 10\) \/ 10;\n  \n  \/\/ Welfare Review Rule\n  const criticalCount = soldiers\.filter\(s => s\.cri < 40\)\.length;\n  const sectionStatus = criticalCount > 0 \? 'RESTRICTED' : avgCRI >= 75 \? 'READY' : 'DEGRADED';\n  const sectionStatusColor = welfareReviewCount === 0 \? 'var\(--status-ready\)' : 'var\(--status-monitor\)';\n\n  \/\/ Welfare Stats\n  const welfareHigh = soldiers\.filter\(s => s\.wellness\?\.welfareRisk === 'HIGH RISK'\)\.length;\n  const welfareCritical = soldiers\.filter\(s => s\.wellness\?\.welfareRisk === 'CRITICAL WELFARE RISK'\)\.length;\n  const welfareReviewCount = soldiers\.filter\(s => s\.welfareReviewStatus === 'Review Recommended'\)\.length;/g, `
  const {
    totalPersonnel: totalSoldiers,
    welfareHigh,
    welfareCritical,
    welfareReviewCount,
    avgCRI,
    criticalCount
  } = aggregateData;

  const sectionStatusColor = welfareReviewCount === 0 ? 'var(--status-ready)' : 'var(--status-monitor)';
`);

fs.writeFileSync('src/pages/CommanderDashboard.jsx', content, 'utf-8');
