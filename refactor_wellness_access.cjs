const fs = require('fs');

let content = fs.readFileSync('src/pages/WellnessDashboard.jsx', 'utf-8');

// Replace soldiers destructuring
content = content.replace(/  const \{ soldiers, updateWelfareReviewStatus \} = useAegis\(\);/g, `  const { getWelfareReviewData, updateWelfareReviewStatus } = useAegis();\n  const soldiers = getWelfareReviewData();`);

fs.writeFileSync('src/pages/WellnessDashboard.jsx', content, 'utf-8');
