const fs = require('fs');

let content = fs.readFileSync('src/pages/CommanderDashboard.jsx', 'utf-8');

// Replace everything from "// Statistics summaries" up to "  // ==================== TREND LINE DATA GENERATION ===================="
content = content.replace(/\/\/ Statistics summaries[\s\S]*?\/\/ ==================== TREND LINE DATA GENERATION ====================/g, `
  const {
    totalPersonnel: totalSoldiers,
    welfareHigh,
    welfareCritical,
    welfareReviewCount,
    avgCRI,
    criticalCount,
    activeSoldiersCount,
    assessedTodayCount: assessedToday,
    personnelRoster: soldiers
  } = aggregateData;

  const sectionStatus = criticalCount > 0 ? 'RESTRICTED' : avgCRI >= 75 ? 'READY' : 'DEGRADED';
  const sectionStatusColor = welfareReviewCount === 0 ? 'var(--status-ready)' : 'var(--status-monitor)';

  // We need an array for activeSoldiers for the personnel table mapped in the view
  // Let's filter the roster (which now includes .role and .availability from AegisContext)
  const activeSoldiers = soldiers.filter(s => s.role === 'soldier');

  // ==================== TREND LINE DATA GENERATION ====================`);

fs.writeFileSync('src/pages/CommanderDashboard.jsx', content, 'utf-8');
