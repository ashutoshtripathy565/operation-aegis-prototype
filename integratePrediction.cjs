const fs = require('fs');

const contextPath = 'src/context/AegisContext.jsx';
let context = fs.readFileSync(contextPath, 'utf8');

// Add import
if (!context.includes('generatePredictiveWellnessIntelligence')) {
  context = context.replace(
    /import React, \{ createContext, useState, useContext \} from 'react';/,
    `import React, { createContext, useState, useContext } from 'react';\nimport { generatePredictiveWellnessIntelligence } from '../services/predictiveEngine.js';`
  );
}

// In map for initialSoldiers
// ExpandedSoldier.wellness = calculateWellnessRisk(...)
context = context.replace(
  /expandedSoldier\.wellness = calculateWellnessRisk\(expandedSoldier\);\n\s*return expandedSoldier;/g,
  `expandedSoldier.wellness = calculateWellnessRisk(expandedSoldier);\n  expandedSoldier.wellness.prediction = generatePredictiveWellnessIntelligence(expandedSoldier);\n  return expandedSoldier;`
);

// In submitWellnessCheckin
context = context.replace(
  /updated\.wellness = calculateWellnessRisk\(updated\);\n\s*const newHistoryPoint = \{/g,
  `updated.wellness = calculateWellnessRisk(updated);\n        \n        const newHistoryPoint = {`
);

context = context.replace(
  /updated\.wellnessTrend = calculateWellnessTrend\(updated\.wellnessHistory\);/g,
  `updated.wellnessTrend = calculateWellnessTrend(updated.wellnessHistory);\n        updated.wellness.prediction = generatePredictiveWellnessIntelligence(updated);`
);

fs.writeFileSync(contextPath, context, 'utf8');
