const fs = require('fs');

let lines = fs.readFileSync('src/context/AegisContext.jsx', 'utf8').split('\n');

// 1. We replace initialHistory completely.
const historyStartIndex = lines.findIndex(l => l.includes('const initialHistory = ['));
if (historyStartIndex !== -1) {
  const historyEndIndex = lines.findIndex((l, i) => i > historyStartIndex && l.trim() === '];');
  if (historyEndIndex !== -1) {
    const newHistory = `const initialHistory = [
  // Rajesh Kumar - Deteriorating
  { id: 'h1', soldierId: 'JC-472118K', timestamp: '2026-05-01T10:00:00Z', stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 },
  { id: 'h2', soldierId: 'JC-472118K', timestamp: '2026-06-01T10:00:00Z', stressScore: 2, fatigueScore: 2, sleepQualityScore: 4 },
  { id: 'h3', soldierId: 'JC-472118K', timestamp: '2026-07-01T10:00:00Z', stressScore: 4, fatigueScore: 4, sleepQualityScore: 2 },
  { id: 'h4', soldierId: 'JC-472118K', timestamp: '2026-08-01T10:00:00Z', stressScore: 5, fatigueScore: 5, sleepQualityScore: 1 },
  // A. Sharma - Stable
  { id: 'h5', soldierId: 'IC-57556H', timestamp: '2026-06-01T10:00:00Z', stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 },
  { id: 'h6', soldierId: 'IC-57556H', timestamp: '2026-07-01T10:00:00Z', stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 },
  { id: 'h7', soldierId: 'IC-57556H', timestamp: '2026-08-01T10:00:00Z', stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 },
  // Vikram Singh - Insufficient Data (only 1 record)
  { id: 'h8', soldierId: 'IC-68322M', timestamp: '2026-08-01T10:00:00Z', stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 },
  // Amit Verma - Improving
  { id: 'h9', soldierId: 'JC-581992L', timestamp: '2026-05-01T10:00:00Z', stressScore: 5, fatigueScore: 5, sleepQualityScore: 1 },
  { id: 'h10', soldierId: 'JC-581992L', timestamp: '2026-06-01T10:00:00Z', stressScore: 4, fatigueScore: 4, sleepQualityScore: 2 },
  { id: 'h11', soldierId: 'JC-581992L', timestamp: '2026-07-01T10:00:00Z', stressScore: 2, fatigueScore: 2, sleepQualityScore: 4 },
  { id: 'h12', soldierId: 'JC-581992L', timestamp: '2026-08-01T10:00:00Z', stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 },
  // Neha Gupta - Critical
  { id: 'h13', soldierId: 'IC-71004P', timestamp: '2026-05-01T10:00:00Z', stressScore: 3, fatigueScore: 3, sleepQualityScore: 3 },
  { id: 'h14', soldierId: 'IC-71004P', timestamp: '2026-06-01T10:00:00Z', stressScore: 4, fatigueScore: 4, sleepQualityScore: 2 },
  { id: 'h15', soldierId: 'IC-71004P', timestamp: '2026-07-01T10:00:00Z', stressScore: 5, fatigueScore: 5, sleepQualityScore: 1 },
  { id: 'h16', soldierId: 'IC-71004P', timestamp: '2026-08-01T10:00:00Z', stressScore: 5, fatigueScore: 5, sleepQualityScore: 1 }
];`;
    lines.splice(historyStartIndex, historyEndIndex - historyStartIndex + 1, newHistory);
  }
}

// 2. We need to replace the workload/leaveHistory dynamic injection in initialSoldiers with something that uses our predefined profiles
const initSoldierStart = lines.findIndex(l => l.includes('const initialSoldiers = baseInitialSoldiers.map'));
if (initSoldierStart !== -1) {
  const initSoldierEnd = lines.findIndex((l, i) => i > initSoldierStart && l.includes('expandedSoldier.wellness = calculateWellnessRisk(expandedSoldier);'));
  
  if (initSoldierEnd !== -1) {
    const newMapLogic = `const initialSoldiers = baseInitialSoldiers.map((soldier, index) => {
  const seed = index + 1;
  const expandedSoldier = {
    ...soldier,
    leaveHistory: {
      totalLeavesLast12Months: (seed % 3) + 1,
      averageLeaveDuration: (seed % 10) + 7,
      daysSinceLastLeave: (seed * 15) % 120 + 10,
      cancelledOrDeferredLeaves: seed % 2 === 0 ? 1 : 0
    },
    deploymentHistory: {
      totalDeployments: (seed % 4) + 1,
      daysDeployedLast12Months: (seed * 40) % 200 + 30,
      currentDeploymentDays: soldier.assignmentStatus === 'Deployed' ? (seed * 12) % 60 + 5 : 0,
      consecutiveOperationalDays: (seed * 3) % 14 + 1
    },
    workload: {
      averageDutyHoursPerDay: (seed % 3) + 8,
      averageWeeklyDutyHours: (seed % 15) + 50,
      consecutiveDutyDays: (seed % 8) + 1,
      nightDutiesLast30Days: (seed * 2) % 10,
      overtimeHoursLast30Days: (seed * 5) % 20
    },
    transferHistory: {
      transfersLast5Years: seed % 3,
      monthsSinceLastTransfer: (seed * 7) % 36 + 2,
      recentTransfer: seed % 4 === 0
    },
    training: {
      trainingDaysLast90Days: (seed * 4) % 20 + 5,
      upcomingTrainingDays: (seed * 2) % 10,
      highIntensityTrainingDays: seed % 5
    },
    wellnessAssessment: {
      enabled: true,
      stressScore: (seed % 5) + 1,
      fatigueScore: ((seed + 1) % 5) + 1,
      moodScore: ((seed + 2) % 5) + 1,
      sleepQualityScore: ((seed + 3) % 5) + 1,
      submittedAt: "08 Jul 2026"
    }
  };

  // Explicit Demo Data Overrides based on ID
  if (soldier.id === 'IC-57556H') { // A. Sharma (LOW)
    expandedSoldier.workload = { weeklyDutyHours: 40, consecutiveDutyDays: 5, nightDuties: 0 };
    expandedSoldier.leaveHistory = { daysSinceLastLeave: 30, deferredLeaves: 0 };
  } else if (soldier.id === 'JC-472118K') { // Rajesh Kumar (DETERIORATING/HIGH)
    expandedSoldier.workload = { weeklyDutyHours: 65, consecutiveDutyDays: 16, nightDuties: 4 };
    expandedSoldier.leaveHistory = { daysSinceLastLeave: 200, deferredLeaves: 1 };
  } else if (soldier.id === 'IC-68322M') { // Vikram Singh (INSUFFICIENT)
    expandedSoldier.workload = { weeklyDutyHours: 40, consecutiveDutyDays: 5, nightDuties: 0 };
    expandedSoldier.leaveHistory = { daysSinceLastLeave: 30, deferredLeaves: 0 };
  } else if (soldier.id === 'JC-581992L') { // Amit Verma (IMPROVING)
    expandedSoldier.assignmentStatus = "Medical Rest";
    expandedSoldier.workload = { weeklyDutyHours: 10, consecutiveDutyDays: 2, nightDuties: 0 };
    expandedSoldier.leaveHistory = { daysSinceLastLeave: 5, deferredLeaves: 0 };
  } else if (soldier.id === 'IC-71004P') { // Neha Gupta (CRITICAL)
    expandedSoldier.workload = { weeklyDutyHours: 75, consecutiveDutyDays: 21, nightDuties: 6 };
    expandedSoldier.leaveHistory = { daysSinceLastLeave: 250, deferredLeaves: 2 };
  }
  
  expandedSoldier.wellnessHistory = initialHistory.filter(h => h.soldierId === soldier.id);
  `;
    lines.splice(initSoldierStart, initSoldierEnd - initSoldierStart, newMapLogic);
  }
}

fs.writeFileSync('src/context/AegisContext.jsx', lines.join('\n'), 'utf8');
console.log("Mock data overrides injected.");
