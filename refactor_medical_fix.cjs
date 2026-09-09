const fs = require('fs');
let content = fs.readFileSync('src/pages/MedicalDashboard.jsx', 'utf-8');

// The replacement for handleClearSoldier and handleRestrictSoldier failed. Let's fix that.
const oldFuncs = `  const handleClearSoldier = (soldierId) => {
    updateMedicalCategory(soldierId, 'FE (Forward Area Eligible)', 'Available',
      'Medical officer cleared for full duties');
    alert('Soldier cleared for active forward operations.');
  };

  const handleRestrictSoldier = (soldierId, category, status) => {
    if (!restrictionNote) {
      alert('Please enter restriction notes in the field below.');
      return;
    }
    updateMedicalCategory(soldierId, category, status, restrictionNote);
    alert(\`Soldier placed on restriction: \${category}\`);
    setRestrictionNote('');
  };`;

const newFuncs = `  const handleAddMedicalNote = (soldierId) => {
    const patient = soldiers.find(s => s.id === soldierId);
    if (!restrictionNote) {
      alert('Please enter medical observation notes.');
      return;
    }
    updateMedicalCategory(soldierId, patient.medicalCategory, 'Observation Added', restrictionNote);
    alert('Medical observation note recorded.');
    setRestrictionNote('');
  };`;

content = content.replace(oldFuncs, newFuncs);

// Replacement for UI part
const oldUI = `                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <button onClick={() => handleClearSoldier(patient.id)} className="btn-cyber-primary" style={{ width: '100%' }}>
                        Clear for Duty (FE Status)
                      </button>
                      <button
                        onClick={() => handleRestrictSoldier(patient.id, 'LE (Light Duty Eligible)', 'Under Observation')}
                        className="btn-cyber"
                        style={{ width: '100%', borderColor: 'var(--status-monitor)', color: 'var(--status-monitor)' }}
                      >
                        Restrict to Light Duty (LE)
                      </button>
                      <button
                        onClick={() => handleRestrictSoldier(patient.id, 'MO (Medical Observation)', 'Medical Review')}
                        className="btn-cyber"
                        style={{ width: '100%', borderColor: 'var(--status-critical)', color: 'var(--status-critical)' }}
                      >
                        Restrict to Base (MO Status)
                      </button>
                    </div>`;

const newUI = `                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <button onClick={() => handleAddMedicalNote(patient.id)} className="btn-cyber-primary" style={{ width: '100%' }}>
                        Save Medical Observation
                      </button>
                    </div>`;

content = content.replace(oldUI, newUI);

fs.writeFileSync('src/pages/MedicalDashboard.jsx', content, 'utf-8');
