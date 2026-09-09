const fs = require('fs');
let content = fs.readFileSync('src/pages/MedicalDashboard.jsx', 'utf-8');

// I accidentally deleted two closing divs.
// The easiest way is to find `{/* Active alerts */}` and replace it with `</div></div>{/* Active alerts */}`
content = content.replace(/\{\/\* Active alerts \*\/\}/g, '</div>\n                  </div>\n\n                  {/* Active alerts */}');

fs.writeFileSync('src/pages/MedicalDashboard.jsx', content, 'utf-8');
