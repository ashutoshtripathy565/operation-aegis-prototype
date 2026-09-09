const fs = require('fs');
let ctx = fs.readFileSync('src/context/AegisContext.jsx', 'utf8');

const regex = /const newDCI = [\s\S]*?scores: \{ \.\.\.scores \}\n\s*\};/m;

const replacement = `const newHistoryItem = {
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

ctx = ctx.replace(regex, replacement);
ctx = ctx.replace(/timestamp,,/g, ''); // just in case

fs.writeFileSync('src/context/AegisContext.jsx', ctx, 'utf8');
