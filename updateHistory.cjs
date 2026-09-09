const fs = require('fs');
let ctx = fs.readFileSync('src/context/AegisContext.jsx', 'utf8');

const replacement = `const initialHistory = [
  // Rajesh Kumar - Deteriorating
  { id: 'h1', soldierId: 'JC-472118K', timestamp: '2026-05-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 } },
  { id: 'h2', soldierId: 'JC-472118K', timestamp: '2026-06-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 2, fatigueScore: 2, sleepQualityScore: 4 } },
  { id: 'h3', soldierId: 'JC-472118K', timestamp: '2026-07-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 4, fatigueScore: 4, sleepQualityScore: 2 } },
  { id: 'h4', soldierId: 'JC-472118K', timestamp: '2026-08-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 5, fatigueScore: 5, sleepQualityScore: 1 } },
  // A. Sharma - Stable
  { id: 'h5', soldierId: 'IC-57556H', timestamp: '2026-06-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 } },
  { id: 'h6', soldierId: 'IC-57556H', timestamp: '2026-07-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 } },
  { id: 'h7', soldierId: 'IC-57556H', timestamp: '2026-08-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 } },
  // Vikram Singh - Insufficient Data (only 1 record)
  { id: 'h8', soldierId: 'IC-68322M', timestamp: '2026-08-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 } },
  // Amit Verma - Improving
  { id: 'h9', soldierId: 'JC-581992L', timestamp: '2026-05-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 5, fatigueScore: 5, sleepQualityScore: 1 } },
  { id: 'h10', soldierId: 'JC-581992L', timestamp: '2026-06-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 4, fatigueScore: 4, sleepQualityScore: 2 } },
  { id: 'h11', soldierId: 'JC-581992L', timestamp: '2026-07-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 2, fatigueScore: 2, sleepQualityScore: 4 } },
  { id: 'h12', soldierId: 'JC-581992L', timestamp: '2026-08-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 } },
  // Neha Gupta - Critical
  { id: 'h13', soldierId: 'IC-71004P', timestamp: '2026-05-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 3, fatigueScore: 3, sleepQualityScore: 3 } },
  { id: 'h14', soldierId: 'IC-71004P', timestamp: '2026-06-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 4, fatigueScore: 4, sleepQualityScore: 2 } },
  { id: 'h15', soldierId: 'IC-71004P', timestamp: '2026-07-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 5, fatigueScore: 5, sleepQualityScore: 1 } },
  { id: 'h16', soldierId: 'IC-71004P', timestamp: '2026-08-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 5, fatigueScore: 5, sleepQualityScore: 1 } }
];`;

ctx = ctx.replace(/const initialHistory = \[[\s\S]*?\];/m, replacement);

fs.writeFileSync('src/context/AegisContext.jsx', ctx, 'utf8');
