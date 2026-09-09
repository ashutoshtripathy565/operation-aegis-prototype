const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.build.directories.output = 'C:/Users/ashut/Downloads/Aegis_Release';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf8');
