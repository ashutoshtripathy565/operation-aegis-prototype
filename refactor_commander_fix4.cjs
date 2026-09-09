const fs = require('fs');

let content = fs.readFileSync('src/pages/CommanderDashboard.jsx', 'utf-8');

content = content.replace(/    personnelRoster: soldiers\n  \} = aggregateData;/g, `  } = aggregateData;`);

fs.writeFileSync('src/pages/CommanderDashboard.jsx', content, 'utf-8');
