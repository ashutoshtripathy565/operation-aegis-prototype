const fs = require('fs');
let md = fs.readFileSync('src/pages/MedicalDashboard.jsx', 'utf8');

// The place to inject: right before {/* Left */} ends or inside the right panel
// Let's look for "Right: Clinical Actions"
const injectionPoint = /\{selectedSoldierId \? \(\(\) => \{[\s\S]*?const patient = soldiers\.find\(s => s\.id === selectedSoldierId\);[\s\S]*?return \([\s\S]*?<div className="glass-panel-glow" style=\{\{ padding: '20px' \}\}>/m;

const historyCode = `
                  <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                      <Activity size={16} style={{ color: 'var(--accent-cyan)' }} />
                      <h4 className="text-mono" style={{ margin: 0, color: 'var(--text-primary)' }}>SOLDIER-PROVIDED WELLBEING HISTORY</h4>
                    </div>
                    {(() => {
                      const patientHistory = history.filter(h => h.soldierId === selectedSoldierId);
                      if (patientHistory.length === 0) return <div style={{color: 'var(--text-muted)'}}>No self-reported wellbeing records found.</div>;
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '300px', overflowY: 'auto' }}>
                          {patientHistory.map(h => (
                            <div key={h.id} style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '4px', borderLeft: h.source === 'SOLDIER' ? '3px solid var(--accent-cyan)' : '3px solid var(--text-muted)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{new Date(h.timestamp).toLocaleString()}</span>
                                <span style={{ fontSize: '10px', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-muted)' }}>SOURCE: {h.source}</span>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '13px' }}>
                                <div>Stress: {h.values?.stressScore || h.stressScore || 'N/A'}</div>
                                <div>Fatigue: {h.values?.fatigueScore || h.fatigueScore || 'N/A'}</div>
                                <div>Sleep: {h.values?.sleepQualityScore || h.sleepQualityScore || 'N/A'}</div>
                                <div>Mood: {h.values?.moodScore || 'N/A'}</div>
                              </div>
                              {(h.values?.comment) && (
                                <div style={{ marginTop: '8px', fontSize: '12px', fontStyle: 'italic', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                                  "{h.values.comment}"
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  <div className="glass-panel-glow" style={{ padding: '20px' }}>`;

md = md.replace(injectionPoint, (match) => {
  return match.replace(/<div className="glass-panel-glow" style=\{\{ padding: '20px' \}\}>/, historyCode);
});

fs.writeFileSync('src/pages/MedicalDashboard.jsx', md, 'utf8');
