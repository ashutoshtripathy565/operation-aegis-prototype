const fs = require('fs');
let content = fs.readFileSync('src/pages/MedicalDashboard.jsx', 'utf-8');

// The original file had:
// </div> // ends flex col
// </div> // ends glass-panel
// </div> // ends grid
// {/* Active alerts */}

content = content.replace(/<\/div>\n                  <\/div>\n\n                  \{\/\* Active alerts \*\/\}/g, '</div>\n\n                  {/* Active alerts */}');

fs.writeFileSync('src/pages/MedicalDashboard.jsx', content, 'utf-8');
