const fs = require('fs');

const getRiskColor = (band) => {
  if (band === 'CRITICAL WELFARE RISK') return '#dc2626';
  if (band === 'HIGH RISK') return '#ea580c';
  if (band === 'MONITOR') return '#d97706';
  return '#16a34a';
};

let cd = fs.readFileSync('src/pages/CommanderDashboard.jsx', 'utf8');
cd = cd.replace(/getReadinessBand\(s\.prs\)/g, "{ label: s.wellness?.welfareRisk || 'UNKNOWN', color: s.wellness?.welfareRisk === 'CRITICAL WELFARE RISK' ? '#dc2626' : s.wellness?.welfareRisk === 'HIGH RISK' ? '#ea580c' : s.wellness?.welfareRisk === 'MONITOR' ? '#d97706' : '#16a34a' }");

cd = cd.replace(/getReadinessBand\(soldier\.prs\)/g, "{ label: soldier.wellness?.welfareRisk || 'UNKNOWN', color: soldier.wellness?.welfareRisk === 'CRITICAL WELFARE RISK' ? '#dc2626' : soldier.wellness?.welfareRisk === 'HIGH RISK' ? '#ea580c' : soldier.wellness?.welfareRisk === 'MONITOR' ? '#d97706' : '#16a34a' }");

cd = cd.replace(/getReadinessBand\(quickViewSoldier\.prs\)/g, "{ label: quickViewSoldier.wellness?.welfareRisk || 'UNKNOWN', color: quickViewSoldier.wellness?.welfareRisk === 'CRITICAL WELFARE RISK' ? '#dc2626' : quickViewSoldier.wellness?.welfareRisk === 'HIGH RISK' ? '#ea580c' : quickViewSoldier.wellness?.welfareRisk === 'MONITOR' ? '#d97706' : '#16a34a' }");

cd = cd.replace(/getReadinessBand\(h\.prs\)/g, "{ label: h.riskBand || 'UNKNOWN', color: h.riskBand === 'CRITICAL WELFARE RISK' ? '#dc2626' : h.riskBand === 'HIGH RISK' ? '#ea580c' : h.riskBand === 'MONITOR' ? '#d97706' : '#16a34a' }");

cd = cd.replace(/soldier\.prs/g, "soldier.wellness?.stressScore");
cd = cd.replace(/quickViewSoldier\.prs/g, "quickViewSoldier.wellness?.stressScore");
cd = cd.replace(/h\.prs/g, "(h.values ? h.values.stressScore * 10 : h.stressScore * 10)");
cd = cd.replace(/getReadinessBand,\s*/g, '');

fs.writeFileSync('src/pages/CommanderDashboard.jsx', cd, 'utf8');

let pd = fs.readFileSync('src/pages/PersonnelDashboard.jsx', 'utf8');
pd = pd.replace(/const currentBand = getReadinessBand\(currentSoldier\.prs\);/g, "const currentBand = { label: currentSoldier.wellness?.welfareRisk || 'UNKNOWN', color: currentSoldier.wellness?.welfareRisk === 'CRITICAL WELFARE RISK' ? '#dc2626' : currentSoldier.wellness?.welfareRisk === 'HIGH RISK' ? '#ea580c' : currentSoldier.wellness?.welfareRisk === 'MONITOR' ? '#d97706' : '#16a34a' };");

pd = pd.replace(/const band = getReadinessBand\(hist\.prs\);/g, "const band = { label: hist.riskBand || 'UNKNOWN', color: hist.riskBand === 'CRITICAL WELFARE RISK' ? '#dc2626' : hist.riskBand === 'HIGH RISK' ? '#ea580c' : hist.riskBand === 'MONITOR' ? '#d97706' : '#16a34a' };");

pd = pd.replace(/getReadinessBand,\s*/g, '');
pd = pd.replace(/currentSoldier\.prs/g, "currentSoldier.wellness?.stressScore");
pd = pd.replace(/hist\.prs/g, "(hist.values ? hist.values.stressScore * 10 : hist.stressScore * 10)");

fs.writeFileSync('src/pages/PersonnelDashboard.jsx', pd, 'utf8');

let ctx = fs.readFileSync('src/context/AegisContext.jsx', 'utf8');
ctx = ctx.replace(/const getReadinessBand = \([\s\S]*?return \{ label: 'Critical'[\s\S]*?\};\n  \};\n/g, '');
fs.writeFileSync('src/context/AegisContext.jsx', ctx, 'utf8');

console.log('Replaced PRS references in Dashboards');
