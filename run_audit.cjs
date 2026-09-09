const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const allFiles = walkSync('src');
let hits = 0;
const report = {};

const regex = /(Combat|Mission|Battlefield|Tactical|Weapon|Equipment|Gear|Deployment|CRI|DCI|HUD|Regiment|Battalion|Army|Patrol)/gi;

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (regex.test(line)) {
      if (!report[file]) report[file] = [];
      report[file].push({ line: idx + 1, text: line.trim() });
      hits++;
    }
  });
});

fs.writeFileSync('audit_report_clean.json', JSON.stringify(report, null, 2), 'utf-8');
console.log('Total hits:', hits);
