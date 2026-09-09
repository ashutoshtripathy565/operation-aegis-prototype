const fs = require('fs');

const path = 'src/pages/PersonnelDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

const replacement = `
            {/* Main Score KPI */}
            <div className="glass-panel" style={{
              padding: '30px',
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 className="text-mono" style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Personnel Wellness Overview
                </h3>
                <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: 8 }}>
                  Personal Resilience Score (PRS)
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: currentBand.color
                  }}></span>
                  <span className="text-mono" style={{ color: currentBand.color, fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase' }}>
                    {currentBand.label}
                  </span>
                </div>
              </div>

              {/* Radial PRS Gauge */}
              <div style={{ position: 'relative', width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="90" height="90" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg-primary)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke={currentBand.color} strokeWidth="8" strokeDasharray="264" strokeDashoffset={264 - (264 * currentSoldier.prs) / 100} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
                </svg>
                <div style={{ position: 'absolute', fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }} className="text-mono">
                  {currentSoldier.prs}
                </div>
              </div>
            </div>

            {/* AI PREDICTIVE INTELLIGENCE */}
            {currentSoldier.wellness?.prediction && (
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Activity size={18} color="var(--accent-cyan)" />
                      Predictive Wellness & Resilience Analysis
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 4 }}>
                      Powered by {currentSoldier.wellness.prediction.modelVersion || 'AI Wellness Engine'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Data Confidence</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: currentSoldier.wellness.prediction.confidence > 70 ? 'var(--status-ready)' : 'var(--status-monitor)' }}>
                      {currentSoldier.wellness.prediction.confidence}%
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Predicted Risk Level</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: 4 }}>
                      {currentSoldier.wellness.prediction.riskBand}
                    </div>
                  </div>
                  <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Longitudinal Trend</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: 4 }}>
                      {currentSoldier.wellness.prediction.direction}
                    </div>
                  </div>
                </div>

                {/* Risk Explanation */}
                <div>
                  <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase' }}>Why This Risk? (Explanation)</h4>
                  {currentSoldier.wellness.prediction.riskBand === 'INSUFFICIENT_DATA' ? (
                    <div style={{ fontSize: '13px', color: 'var(--status-monitor)', padding: '12px', background: 'var(--status-monitor-glow)', borderRadius: '6px' }}>
                      Insufficient data available to generate a reliable personal prediction. Please complete regular wellness check-ins.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {currentSoldier.wellness.prediction.contributingFactors?.length === 0 && (
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No significant negative contributing factors detected.</div>
                      )}
                      {currentSoldier.wellness.prediction.contributingFactors?.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
                          <AlertTriangle size={16} color={f.severity === 'High' ? 'var(--status-critical)' : 'var(--status-monitor)'} style={{ flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{f.category} — {f.factor}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>Current: {f.evidence} (Contribution: {f.severity})</div>
                          </div>
                        </div>
                      ))}
                      
                      {currentSoldier.wellness.prediction.protectiveFactors?.map((f, i) => (
                        <div key={i + 100} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
                          <ShieldAlert size={16} color="var(--status-ready)" style={{ flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{f.category} — {f.factor}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>Evidence: {f.evidence}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Supportive Recommendations */}
                {currentSoldier.wellness.prediction.recommendations?.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase' }}>Supportive Recommendations</h4>
                    <ul style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                      {currentSoldier.wellness.prediction.recommendations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
`;

const startIndex = content.indexOf('{/* Main Score KPI */}');
const endIndex = content.indexOf('{/* Assessment History Table */}');

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + replacement + '\n            ' + content.substring(endIndex);
  fs.writeFileSync(path, content, 'utf8');
} else {
  console.log('Could not find injection points in PersonnelDashboard.jsx');
}
