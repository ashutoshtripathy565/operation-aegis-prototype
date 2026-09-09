const fs = require('fs');
const path = require('path');

const contextPath = 'src/context/AegisContext.jsx';
let context = fs.readFileSync(contextPath, 'utf8');

// 1. Rename deploymentStatus to assignmentStatus
context = context.replace(/deploymentStatus/g, 'assignmentStatus');
// Replace specific values
context = context.replace(/"Deployed"/g, '"Active Assignment"');
context = context.replace(/"Base Ops"/g, '"Administrative Assignment"');
context = context.replace(/"Standby"/g, '"Training Assignment"');
context = context.replace(/"Leave"/g, '"Leave"'); // keep

// 2. Remove equipmentStatus, lastPatrol, lastMission
context = context.replace(/\s*equipmentStatus:\s*['"].*?['"],/g, '');
context = context.replace(/\s*lastPatrol:\s*['"].*?['"],/g, '');
context = context.replace(/\s*lastMission:\s*['"].*?['"],/g, '');
context = context.replace(/\s*lastDuty:\s*['"].*?['"],/g, '');
context = context.replace(/\s*weapon:\s*['"].*?['"],/g, '');

// 3. Remove activeMissions state and related functions
context = context.replace(/\s*const \[activeMissions, setActiveMissions\] = useState\(\[[\s\S]*?\]\);/g, '');
context = context.replace(/\s*activeMissions,/g, '');

// 4. Remove getMRSScore entirely
const mrsScoreRegex = /\s*const getMRSScore = \([\s\S]*?\} \/\/\s*Max deduction 40\s*return Math\.max\(0, baseScore\);\s*\};/g;
context = context.replace(mrsScoreRegex, '');
context = context.replace(/\s*getMRSScore,/g, '');

// 5. Remove getSentinelAdvice entirely
const sentinelRegex = /\s*const getSentinelAdvice = \([\s\S]*?return 'Monitor fatigue levels closely.*?';\s*\};/g;
context = context.replace(sentinelRegex, '');
context = context.replace(/\s*getSentinelAdvice,/g, '');

// 6. Rename calculateCRI -> calculatePRS
context = context.replace(/calculateCRI/g, 'calculatePRS');
context = context.replace(/cri:/g, 'prs:');
context = context.replace(/\.cri/g, '.prs');
// also rename 'avgCRI' to 'avgPRS'
context = context.replace(/avgCRI/g, 'avgPRS');
context = context.replace(/CRI /g, 'PRS ');
context = context.replace(/>CRI</g, '>PRS<');
context = context.replace(/Composite Readiness Index/g, 'Personnel Resilience Score');
context = context.replace(/Combat Readiness/g, 'Personnel Resilience');
context = context.replace(/Mission Readiness/g, 'Workforce Readiness');
context = context.replace(/Readiness Band/g, 'Resilience Band');
context = context.replace(/Readiness Score/g, 'Resilience Score');

// 7. Deprecate DCI
// We'll leave the math (dci: 96, etc.) but just remove references to Daily Cognitive Index in strings if any
context = context.replace(/Daily Cognitive Index/g, 'Legacy Cognitive Metric');

fs.writeFileSync(contextPath, context, 'utf8');
