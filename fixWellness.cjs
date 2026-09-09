const fs = require('fs');

let content = fs.readFileSync('src/pages/WellnessDashboard.jsx', 'utf8');

// Inject CheckCircle import
let importMatch = content.match(/import \{([^}]+)\} from 'lucide-react'/);
if (importMatch && !importMatch[1].includes('CheckCircle,')) {
  let newImports = importMatch[1] + ', CheckCircle';
  content = content.replace(importMatch[0], `import {${newImports}} from 'lucide-react'`);
}

// Fix table rendering to show AI predictions
content = content.replace(
  /<td style=\{\{ padding: '16px', borderBottom: '1px solid var\(--border-color\)', fontWeight: 500, color: getRiskColor\(soldier\.wellness\.welfareRisk\) \}\}>\n\s*<div style=\{\{ display: 'flex', alignItems: 'center', gap: 6 \}\}>\n\s*\{soldier\.wellness\.welfareRisk === 'HIGH RISK' \|\| soldier\.wellness\.welfareRisk === 'CRITICAL WELFARE RISK' \? <AlertTriangle size=\{16\} \/> : <CheckCircle2 size=\{16\} \/>\}\n\s*\{soldier\.wellness\.welfareRisk\}\n\s*<\/div>\n\s*<\/td>\n\s*<td style=\{\{ padding: '16px', borderBottom: '1px solid var\(--border-color\)' \}\}>\n\s*<div style=\{\{ display: 'flex', flexDirection: 'column' \}\}>\n\s*<span className="text-mono" style=\{\{ color: getRiskColor\(soldier\.wellness\.welfareRisk\) \}\}>\{soldier\.wellness\.stressScore\}\/100<\/span>/,
  `<td style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: getRiskColor(soldier.wellness?.prediction?.riskBand || soldier.wellness?.welfareRisk) }}>
                      {soldier.wellness?.prediction?.riskBand === 'HIGH' || soldier.wellness?.prediction?.riskBand === 'CRITICAL' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                      {soldier.wellness?.prediction?.riskBand || soldier.wellness?.welfareRisk}
                    </div>
                  </td>
                  <td style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div>
                        <span className="text-mono" style={{ color: getRiskColor(soldier.wellness?.prediction?.riskBand || soldier.wellness?.welfareRisk) }}>
                          {soldier.wellness?.prediction?.riskScore || soldier.wellness?.stressScore}/100
                        </span>
                        {soldier.wellness?.prediction && (
                          <span className="text-mono" style={{ color: 'var(--text-muted)', marginLeft: 8, fontSize: '11px' }}>
                            ({soldier.wellness.prediction.confidence}% conf)
                          </span>
                        )}
                      </div>`
);

// We need to replace the LONGITUDINAL TREND ANALYSIS modal contents entirely.
const modalStart = content.indexOf('<h4 className="text-mono" style={{ fontSize: \'12px\', color: \'var(--text-primary)\', marginBottom: 16 }}>LONGITUDINAL TREND ANALYSIS</h4>');
if (modalStart !== -1) {
  const modalEnd = content.indexOf('{/* Intervention Form */}');
  
  if (modalEnd !== -1) {
    const newUI = `{/* AI PREDICTIVE ANALYSIS & EXPLANATION */}
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
                <h4 className="text-mono" style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: 16 }}>AI PREDICTIVE ANALYSIS & EXPLANATION</h4>
                
                {selectedSoldier.wellness?.prediction ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    
                    {/* Risk & Trend Summary */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                      <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }} className="text-mono">Current Trajectory</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: selectedSoldier.wellness.prediction.direction === 'DETERIORATING' ? 'var(--status-critical)' : selectedSoldier.wellness.prediction.direction === 'IMPROVING' ? 'var(--status-ready)' : 'var(--text-primary)' }}>
                          <Activity size={18} />
                          <span style={{ fontWeight: 600 }}>{selectedSoldier.wellness.prediction.direction}</span>
                        </div>
                      </div>
                      <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }} className="text-mono">AI Confidence Level</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-cyan)' }}>
                          <ShieldAlert size={18} />
                          <span style={{ fontWeight: 600 }}>{selectedSoldier.wellness.prediction.confidence}%</span>
                        </div>
                      </div>
                      <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }} className="text-mono">Model Output</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)' }}>
                          <span className="text-mono" style={{ fontWeight: 600 }}>v0.1 / BASELINE</span>
                        </div>
                      </div>
                    </div>

                    {/* Explanatory Factors */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 8 }}>
                      <div className="glass-panel" style={{ padding: '16px' }}>
                        <h5 className="text-mono" style={{ fontSize: '11px', color: 'var(--status-critical)', marginBottom: 12 }}>CONTRIBUTING VULNERABILITY FACTORS</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {selectedSoldier.wellness.prediction.contributingFactors?.length > 0 ? selectedSoldier.wellness.prediction.contributingFactors.map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: 'var(--bg-primary)', padding: 10, borderRadius: 6 }}>
                              <AlertTriangle size={14} color="var(--status-critical)" style={{ marginTop: 2, flexShrink: 0 }} />
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{f.category} — {f.factor}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>{f.evidence}</div>
                              </div>
                            </div>
                          )) : (
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No significant vulnerability factors identified.</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="glass-panel" style={{ padding: '16px' }}>
                        <h5 className="text-mono" style={{ fontSize: '11px', color: 'var(--status-ready)', marginBottom: 12 }}>PROTECTIVE RESILIENCE FACTORS</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {selectedSoldier.wellness.prediction.protectiveFactors?.length > 0 ? selectedSoldier.wellness.prediction.protectiveFactors.map((f, i) => (
                            <div key={i+100} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: 'var(--bg-primary)', padding: 10, borderRadius: 6 }}>
                              <CheckCircle size={14} color="var(--status-ready)" style={{ marginTop: 2, flexShrink: 0 }} />
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{f.category} — {f.factor}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>{f.evidence}</div>
                              </div>
                            </div>
                          )) : (
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No significant protective factors identified.</div>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Activity size={32} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
                    <div>Insufficient longitudinal data to generate AI Predictive Analysis.</div>
                    <div style={{ fontSize: '12px', marginTop: 4 }}>Minimum 3 consecutive assessments required.</div>
                  </div>
                )}
              </div>
              
              `;
    
    content = content.substring(0, modalStart) + newUI + content.substring(modalEnd);
  }
}

fs.writeFileSync('src/pages/WellnessDashboard.jsx', content, 'utf8');
console.log("Wellness UI injected successfully.");
