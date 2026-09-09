const fs = require('fs');

let content = fs.readFileSync('src/pages/MedicalDashboard.jsx', 'utf-8');

// Replace soldiers destructuring
content = content.replace(/    soldiers, updateMedicalCategory,/g, '    getMedicalData, updateMedicalCategory,');

// Insert call to getMedicalData
content = content.replace(/  const \[activeTab, setActiveTab\] = useState\('register'\); \/\/ 'register' \| 'complaints'/g, `  const soldiers = getMedicalData();\n  const [activeTab, setActiveTab] = useState('register'); // 'register' | 'complaints'`);

fs.writeFileSync('src/pages/MedicalDashboard.jsx', content, 'utf-8');
