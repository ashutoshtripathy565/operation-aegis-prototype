const fs = require('fs');

let content = fs.readFileSync('src/context/AegisContext.jsx', 'utf-8');

content = content.replace(/        medicalCategory: s\.medicalCategory,/g, `        medicalCategory: s.medicalCategory,
        role: s.role,
        availability: s.availability,
        lastAssessment: s.lastAssessment,`);

fs.writeFileSync('src/context/AegisContext.jsx', content, 'utf-8');
