const fs = require('fs');
const path = 'src/context/AegisContext.jsx';
let content = fs.readFileSync(path, 'utf8');

// Injecting varied workloads, leaveHistory, and wellnessHistory directly into baseInitialSoldiers

// 1. Soldier A. Sharma (Commander) -> Stable, LOW
content = content.replace(
  /name: "A\. Sharma",[\s\S]*?domainScores: \{/g,
  (match) => {
    return match.replace(
      /assignmentStatus: "Active Assignment",/,
      `assignmentStatus: "Active Assignment",
    workload: { weeklyDutyHours: 40, consecutiveDutyDays: 5, nightDuties: 0 },
    leaveHistory: { daysSinceLastLeave: 30, deferredLeaves: 0 },`
    );
  }
);

// 2. Soldier Rajesh Kumar -> High Risk, Deteriorating
content = content.replace(
  /name: "Rajesh Kumar",[\s\S]*?domainScores: \{/g,
  (match) => {
    return match.replace(
      /assignmentStatus: "Active Assignment",/,
      `assignmentStatus: "Active Assignment",
    workload: { weeklyDutyHours: 65, consecutiveDutyDays: 16, nightDuties: 4 },
    leaveHistory: { daysSinceLastLeave: 200, deferredLeaves: 1 },`
    );
  }
);

// 3. Soldier Vikram Singh -> Insufficient Data
content = content.replace(
  /name: "Vikram Singh",[\s\S]*?domainScores: \{/g,
  (match) => {
    return match.replace(
      /assignmentStatus: "Active Assignment",/,
      `assignmentStatus: "Active Assignment",
    workload: { weeklyDutyHours: 40, consecutiveDutyDays: 5, nightDuties: 0 },
    leaveHistory: { daysSinceLastLeave: 30, deferredLeaves: 0 },`
    );
  }
);

// 4. Amit Verma -> Improving
content = content.replace(
  /name: "Amit Verma",[\s\S]*?domainScores: \{/g,
  (match) => {
    return match.replace(
      /assignmentStatus: "Medical Rest",/,
      `assignmentStatus: "Medical Rest",
    workload: { weeklyDutyHours: 10, consecutiveDutyDays: 2, nightDuties: 0 },
    leaveHistory: { daysSinceLastLeave: 5, deferredLeaves: 0 },`
    );
  }
);

// 5. Neha Gupta -> Critical
content = content.replace(
  /name: "Neha Gupta",[\s\S]*?domainScores: \{/g,
  (match) => {
    return match.replace(
      /assignmentStatus: "Active Assignment",/,
      `assignmentStatus: "Active Assignment",
    workload: { weeklyDutyHours: 75, consecutiveDutyDays: 21, nightDuties: 6 },
    leaveHistory: { daysSinceLastLeave: 250, deferredLeaves: 2 },`
    );
  }
);

// Now for history: we need to replace the initialHistory array completely to ensure determinism and variation.
const historyReplacement = `// Historical assessment records
const initialHistory = [
  // Rajesh Kumar - Deteriorating (needs 3+ records)
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

content = content.replace(/\/\/ Historical assessment records[\s\S]*?const initialSoldiers/g, historyReplacement + '\n\nconst initialSoldiers');

fs.writeFileSync(path, content, 'utf8');
