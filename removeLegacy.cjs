const fs = require('fs');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/"\{getSentinelAdvice\(currentSoldier\)\}"/g, '"Welfare monitoring active. Review individual metrics below."');
  content = content.replace(/"\{getSentinelAdvice\(soldier\)\}"/g, '"Welfare monitoring active. Review aggregate metrics."');
  fs.writeFileSync(filePath, content, 'utf8');
}

replaceInFile('src/pages/PersonnelDashboard.jsx');
replaceInFile('src/pages/CommanderDashboard.jsx');
console.log('Done replacing getSentinelAdvice.');
