const fs = require('fs');
let ctx = fs.readFileSync('src/context/AegisContext.jsx', 'utf8');

// Remove calculatePRS
ctx = ctx.replace(/const calculatePRS = [\s\S]*?return Math\.min\(100, Math\.max\(0, Math\.round\(cri\)\)\);\n  \};\n/g, '');

// Remove getReadinessBand
ctx = ctx.replace(/\/\/ Get band classifications based on score\s*const getReadinessBand = [\s\S]*?return \{ label: 'Critical'[\s\S]*?\};\n  \};\n/g, '');

// Fix submitAssessment
const oldSubmit = `const newPRS = calculatePRS(scores);
    const newDCI = Math.min(100, Math.round(85 + Math.random() * 15));

    // 1. Add historical record (immutable)
    const newHistoryItem = {
      id: \`hist_\${Date.now()}\`,
      soldierId,
      soldierName: soldiers.find(s => s.id === soldierId)?.name || 'Unknown',
      timestamp,
      prs: newPRS,
      dci: newDCI,
      scores: { ...scores }
    };`;

const newSubmit = `// 1. Add historical record (immutable)
    const newHistoryItem = {
      id: \`hist_\${Date.now()}\`,
      soldierId,
      timestamp,
      source: 'SOLDIER',
      category: 'assessment',
      values: { 
        mentalWellbeing: null,
        cognitiveWellbeing: null,
        sleepAndRecovery: null,
        stress: null,
        socialConnection: null,
        physicalWellbeing: null,
        ...scores 
      }
    };`;

ctx = ctx.replace(oldSubmit, newSubmit);

// Also remove `prs` and `dci` from exports
ctx = ctx.replace(/calculatePRS,\s*/g, '');
ctx = ctx.replace(/getReadinessBand,\s*/g, '');

// Also remove prs and dci from baseInitialSoldiers mock data
ctx = ctx.replace(/\s*prs:\s*\d+,/g, '');
ctx = ctx.replace(/\s*dci:\s*\d+,/g, '');
ctx = ctx.replace(/\s*prs: newPRS/g, '');
ctx = ctx.replace(/\s*PRS: \$\{newPRS\}/g, '');

fs.writeFileSync('src/context/AegisContext.jsx', ctx, 'utf8');
console.log('Removed PRS/CRI logic from AegisContext');
