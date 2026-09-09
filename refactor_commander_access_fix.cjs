const fs = require('fs');

// 1. Update AegisContext.jsx to include activeSoldiersCount and assessedTodayCount
let contextContent = fs.readFileSync('src/context/AegisContext.jsx', 'utf-8');
contextContent = contextContent.replace(/const criticalCount = soldiers\.filter\(s => s\.cri < 40\)\.length;/g, `const criticalCount = soldiers.filter(s => s.cri < 40).length;
    const activeSoldiersCount = soldiers.filter(s => s.role === 'soldier').length;
    const assessedTodayCount = soldiers.filter(s => s.lastAssessment !== '—').length;`);

contextContent = contextContent.replace(/      criticalCount,/g, `      criticalCount,
      activeSoldiersCount,
      assessedTodayCount,`);
fs.writeFileSync('src/context/AegisContext.jsx', contextContent, 'utf-8');

// 2. Update CommanderDashboard.jsx to destruct them as activeSoldiers and assessedToday
let cmdContent = fs.readFileSync('src/pages/CommanderDashboard.jsx', 'utf-8');
cmdContent = cmdContent.replace(/    criticalCount\n  \} = aggregateData;/g, `    criticalCount,
    activeSoldiersCount: activeSoldiers,
    assessedTodayCount: assessedToday
  } = aggregateData;`);
fs.writeFileSync('src/pages/CommanderDashboard.jsx', cmdContent, 'utf-8');
