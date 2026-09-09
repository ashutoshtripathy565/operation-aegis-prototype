const fs = require('fs');

let content = fs.readFileSync('src/pages/MedicalDashboard.jsx', 'utf-8');

// 1. Remove CRI from Flagged Soldiers list
content = content.replace(/<div style=\{\{ textAlign: 'right' \}\}>[\s\S]*?<\/div>\s*<span className="text-mono" style/g, '<span className="text-mono" style');

// 2. Remove Cognitive Metrics block
content = content.replace(/                    \{\/\* Cognitive Diagnostics — from CRAE domain scores \*\/\}[\s\S]*?\{\/\* Active alerts \*\/\}/g, '{/* Active alerts */}');

// 3. Replace Clinical Intervention buttons and restrict logic
content = content.replace(/  const handleClearSoldier = \([\s\S]*?setRestrictionNote\(''\);\n  \};\n/g, `
  const handleAddMedicalNote = (soldierId) => {
    if (!restrictionNote) {
      alert('Please enter medical observation notes.');
      return;
    }
    // Update category string just to reflect a note was added, without changing tactical status
    updateMedicalCategory(soldierId, patient.medicalCategory, 'Observation Added', restrictionNote);
    alert('Medical observation note recorded.');
    setRestrictionNote('');
  };
`);

// 4. Update the Intervention block UI
content = content.replace(/                    <div style=\{\{ display: 'flex', flexDirection: 'column', gap: 10 \}\}>[\s\S]*?<\/div>\n                  <\/div>\n                <\/div>/g, `
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <button onClick={() => handleAddMedicalNote(patient.id)} className="btn-cyber-primary" style={{ width: '100%' }}>
                        Save Medical Observation
                      </button>
                    </div>
                  </div>
                </div>`);

// 5. Change "RESTRICTION / EXCEPTION NOTES" to "CLINICAL OBSERVATION NOTES"
content = content.replace(/RESTRICTION \/ EXCEPTION NOTES/g, 'CLINICAL OBSERVATION NOTES');
content = content.replace(/Enter musculoskeletal constraints, recovery instructions, etc\./g, 'Enter medical observations, recovery notes, etc.');

// 6. Fix `handleAddMedicalNote` undefined `patient` error
content = content.replace(/const handleAddMedicalNote = \(soldierId\) => \{/g, `const handleAddMedicalNote = (soldierId) => {
    const patient = soldiers.find(s => s.id === soldierId);`);

// 7. Remove "COMSEC CLINICAL DATA POLICY" reference to "level 4 medical records" and replace with standard privacy text
content = content.replace(/Telemetry metrics displayed in this environment are classified level 4 medical records and subject to\n              restricted RBAC clearance policies\. De-identification is mandatory\./g, 'Medical telemetry and wellness records are strictly confidential and subject to privacy and role-based access controls.');

// 8. Update Flagged logic: Just use CRI < 75 as a fallback but remove 'medicalCategory' references if needed (we'll keep medicalCategory for now since we just update it).
content = content.replace(/Service ID: \{s\.serviceNumber\} \/\/ Category: \{s\.medicalCategory\}/g, 'Service ID: {s.serviceNumber}');

fs.writeFileSync('src/pages/MedicalDashboard.jsx', content, 'utf-8');
