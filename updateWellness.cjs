const fs = require('fs');
const path = 'src/pages/WellnessDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// Update Table Rows
content = content.replace(
  /const w = soldier\.wellness \|\| \{\};\n\s*const rStatus = soldier\.welfareReviewStatus/g,
  `const w = soldier.wellness || {};\n                const pred = w.prediction || {};\n                const rStatus = soldier.welfareReviewStatus`
);

content = content.replace(
  /const keyFactor = \(w\.contributingFactors && w\.contributingFactors\.length > 0\) \? w\.contributingFactors\[0\]\.factor : 'None detected';/g,
  `const keyFactor = (pred.contributingFactors && pred.contributingFactors.length > 0) ? pred.contributingFactors[0].factor : 'None detected';`
);

content = content.replace(
  /\{w\.welfareRisk \|\| 'UNKNOWN'\}/g,
  `{pred.riskBand || w.welfareRisk || 'UNKNOWN'}`
);

// We need to change the Risk column to display the new riskScore
content = content.replace(
  /\{w\.stressScore\}\/100<\/span>\s*<span className="text-mono" style=\{\{ color: 'var\(--text-muted\)', marginLeft: 8, fontSize: '11px' \}\}>\(\{w\.confidence\}% conf\)<\/span>/g,
  `{pred.riskScore || w.stressScore}/100</span>\n                      <span className="text-mono" style={{ color: 'var(--text-muted)', marginLeft: 8, fontSize: '11px' }}>({pred.confidence || w.confidence}% conf)</span>\n                      <span className="text-mono" style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '11px', marginTop: 4 }}>Trend: {pred.direction || 'UNKNOWN'}</span>`
);

// We need to change the Flag button logic to check riskBand
content = content.replace(
  /\(w\.welfareRisk === 'HIGH RISK' \|\| w\.welfareRisk === 'CRITICAL WELFARE RISK'\)/g,
  `(pred.riskBand === 'HIGH' || pred.riskBand === 'CRITICAL' || w.welfareRisk === 'HIGH RISK' || w.welfareRisk === 'CRITICAL WELFARE RISK')`
);

// Update Modal View (around line 265)
// Find the "Longitudinal Trend Analysis" section and add the full explainability
const searchStr = `<h4 className="text-mono" style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: 16 }}>LONGITUDINAL TREND ANALYSIS</h4>`;
const replacementStr = `<h4 className="text-mono" style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: 16 }}>AI PREDICTIVE ANALYSIS & EXPLANATION</h4>
                  {selectedSoldier.wellness?.prediction ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                        <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                          <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Predicted Risk</span>
                          <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{selectedSoldier.wellness.prediction.riskBand}</span>
                        </div>
                        <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                          <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Direction</span>
                          <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{selectedSoldier.wellness.prediction.direction}</span>
                        </div>
                        <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                          <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Confidence</span>
                          <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{selectedSoldier.wellness.prediction.confidence}%</span>
                        </div>
                        <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                          <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Model Version</span>
                          <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)' }} className="text-mono">{selectedSoldier.wellness.prediction.modelVersion}</span>
                        </div>
                      </div>

                      {selectedSoldier.wellness.prediction.riskBand === 'INSUFFICIENT_DATA' ? (
                        <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-color)', color: 'var(--status-monitor)' }}>
                          Insufficient longitudinal data to generate a reliable personal prediction.
                        </div>
                      ) : (
                        <>
                          <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                            <h5 style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase' }}>Contributing Factors</h5>
                            {selectedSoldier.wellness.prediction.contributingFactors?.length === 0 ? (
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No significant negative contributing factors detected.</div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {selectedSoldier.wellness.prediction.contributingFactors?.map((f, i) => (
                                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                    <AlertTriangle size={14} color={f.severity === 'High' ? 'var(--status-critical)' : 'var(--status-monitor)'} style={{ marginTop: 2, flexShrink: 0 }} />
                                    <div>
                                      <div style={{ fontSize: '13px', fontWeight: '600' }}>{f.category}: {f.factor}</div>
                                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Evidence: {f.evidence} (Severity: {f.severity})</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                            <h5 style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase' }}>Protective Factors</h5>
                            {selectedSoldier.wellness.prediction.protectiveFactors?.length === 0 ? (
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No significant protective factors detected.</div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {selectedSoldier.wellness.prediction.protectiveFactors?.map((f, i) => (
                                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                    <CheckCircle size={14} color="var(--status-ready)" style={{ marginTop: 2, flexShrink: 0 }} />
                                    <div>
                                      <div style={{ fontSize: '13px', fontWeight: '600' }}>{f.category}: {f.factor}</div>
                                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Evidence: {f.evidence}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                            <h5 style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase' }}>Supportive Recommendations</h5>
                            <ul style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.6', margin: 0 }}>
                              {selectedSoldier.wellness.prediction.recommendations?.map((r, i) => (
                                <li key={i}>{r}</li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Predictive analysis unavailable.</div>
                  )}`;

// replace the old block with the new block. The old block is:
/*
<h4 className="text-mono" style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: 16 }}>LONGITUDINAL TREND ANALYSIS</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  ...
                  </div>
*/

// Let's just do a regex replace
const trendRegex = /<h4 className="text-mono" style=\{\{ fontSize: '12px', color: 'var\(--text-primary\)', marginBottom: 16 \}\}>LONGITUDINAL TREND ANALYSIS<\/h4>[\s\S]*?(?=<h4 className="text-mono" style=\{\{ fontSize: '12px', color: 'var\(--text-primary\)', marginBottom: 16 \}\}>CONTRIBUTING VULNERABILITY FACTORS<\/h4>)/;
content = content.replace(trendRegex, replacementStr + '\n\n                  ');

// Since we replaced the old 'CONTRIBUTING VULNERABILITY FACTORS', let's also remove the legacy contributing factors and protective factors blocks because they are now covered by AI.
const legacyFactorsRegex = /<h4 className="text-mono" style=\{\{ fontSize: '12px', color: 'var\(--text-primary\)', marginBottom: 16 \}\}>CONTRIBUTING VULNERABILITY FACTORS<\/h4>[\s\S]*?(?=<h4 className="text-mono" style=\{\{ fontSize: '12px', color: 'var\(--text-primary\)', marginBottom: 16 \}\}>SUPPORTING OPERATIONAL INDICATORS<\/h4>)/;
content = content.replace(legacyFactorsRegex, '');

fs.writeFileSync(path, content, 'utf8');

// We need to import CheckCircle if it isn't imported
let importMatch = content.match(/import \{([^}]+)\} from 'lucide-react'/);
if (importMatch && !importMatch[1].includes('CheckCircle')) {
  let newImports = importMatch[1] + ', CheckCircle';
  content = content.replace(importMatch[0], `import {${newImports}} from 'lucide-react'`);
  fs.writeFileSync(path, content, 'utf8');
}
