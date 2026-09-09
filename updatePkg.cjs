const fs = require('fs');

let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

pkg.main = 'electron-main.cjs';
pkg.author = "Aegis Team";
pkg.description = "AI-Based Personnel Stress & Welfare Monitoring Platform for Uniformed Services";

pkg.build = {
  appId: "com.operation.aegis",
  productName: "Operation Aegis",
  directories: {
    output: "release"
  },
  win: {
    target: "nsis"
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true
  },
  files: [
    "dist/**/*",
    "electron-main.cjs"
  ]
};

pkg.scripts["build:electron"] = "npm run build && electron-builder --win";

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf8');
console.log('Updated package.json');
