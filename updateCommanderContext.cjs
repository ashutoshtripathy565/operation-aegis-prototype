const fs = require('fs');
const path = 'src/context/AegisContext.jsx';
let content = fs.readFileSync(path, 'utf8');

// Update getAggregateCommandData
content = content.replace(
  /const welfareHighCount = soldiers\.filter\(s => s\.wellness\?\.welfareRisk === 'HIGH RISK'\)\.length;/g,
  `const welfareHighCount = soldiers.filter(s => s.wellness?.prediction?.riskBand === 'HIGH' || s.wellness?.welfareRisk === 'HIGH RISK').length;`
);

content = content.replace(
  /const welfareCriticalCount = soldiers\.filter\(s => s\.wellness\?\.welfareRisk === 'CRITICAL WELFARE RISK'\)\.length;/g,
  `const welfareCriticalCount = soldiers.filter(s => s.wellness?.prediction?.riskBand === 'CRITICAL' || s.wellness?.welfareRisk === 'CRITICAL WELFARE RISK').length;`
);

content = content.replace(
  /const personnelRoster = soldiers\.map\(s => \{[\s\S]*?return \{[\s\S]*?\}\;\n    \}\)\;/g,
  `const personnelRoster = soldiers.map(s => {
      const pred = s.wellness?.prediction || {};
      if (pred.direction === 'DETERIORATING') deterioratingCount++;
      else if (pred.direction === 'IMPROVING') improvingCount++;
      else if (pred.direction === 'STABLE') stableCount++;
      
      return {
        id: s.id,
        name: s.name,
        rank: s.rank,
        role: s.role,
        availability: s.availability,
        prs: s.prs,
        medicalCategory: s.medicalCategory,
        wellnessTrendDirection: pred.direction || 'UNKNOWN'
      };
    });`
);

fs.writeFileSync(path, content, 'utf8');
