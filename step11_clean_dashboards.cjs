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
      if (file.endsWith('.jsx')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const files = walkSync('src/pages');
files.push('src/components/AppShell.jsx');
files.push('src/App.jsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // CRI -> PRS
  content = content.replace(/\.cri/g, '.prs');
  content = content.replace(/avgCRI/g, 'avgPRS');
  content = content.replace(/CRI /g, 'PRS ');
  content = content.replace(/>CRI</g, '>PRS<');
  content = content.replace(/CRI\)/g, 'PRS)');
  content = content.replace(/Composite Readiness Index/g, 'Personnel Resilience Score');
  content = content.replace(/Combat Readiness/g, 'Personnel Resilience');
  content = content.replace(/Mission Readiness/g, 'Personnel Readiness');
  content = content.replace(/Readiness Band/g, 'Resilience Band');
  
  // DCI
  content = content.replace(/Daily Cognitive Index/g, 'Legacy Cognitive Metric');
  
  // Deployment -> Assignment
  content = content.replace(/deploymentStatus/g, 'assignmentStatus');
  content = content.replace(/Deployment Status/g, 'Assignment Status');
  
  // getMRSScore and activeMissions
  content = content.replace(/getMRSScore,/g, '');
  content = content.replace(/activeMissions,/g, '');
  content = content.replace(/getSentinelAdvice,/g, '');
  
  // If there are any explicit uses of getMRSScore, remove that block.
  // In CommanderDashboard, there's a Mission Simulator that we might have missed in step 7 or we need to remove now.
  // Actually, I think it was already removed in step 7. Let's just make sure.
  
  // Tactical Band -> Biometric Device
  content = content.replace(/Tactical Band/g, 'Biometric Device');
  content = content.replace(/TACTICAL ENCRYPTED BAND PAIRING/g, 'SECURE BIOMETRIC DEVICE PAIRING');
  
  fs.writeFileSync(file, content, 'utf8');
});

