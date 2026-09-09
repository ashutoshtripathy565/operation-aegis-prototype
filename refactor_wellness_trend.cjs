const fs = require('fs');
const lines = fs.readFileSync('src/pages/WellnessDashboard.jsx', 'utf-8').split('\n');

const factorsIdx = lines.findIndex(l => l.includes("{/* Factors */}"));

const trendBlock = `              {/* Longitudinal Trend (STEP 9) */}
              {selectedSoldier.wellnessTrend && (
                <div className="glass-panel" style={{ padding: '16px' }}>
                  <h4 className="text-mono" style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: 16 }}>LONGITUDINAL TREND ANALYSIS</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 12 }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>Trend Direction</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                        {selectedSoldier.wellnessTrend.direction.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>Personal Baseline</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                        {selectedSoldier.wellnessTrend.baselineScore ?? '--'}
                      </span>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>Deviation</span>
                      <span style={{ fontSize: '13px', color: selectedSoldier.wellnessTrend.change > 10 ? 'var(--status-monitor)' : selectedSoldier.wellnessTrend.change < -10 ? 'var(--status-ready)' : 'var(--text-primary)' }}>
                        {selectedSoldier.wellnessTrend.change > 0 ? '+' : ''}{selectedSoldier.wellnessTrend.change} pts
                      </span>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>Persistence</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                        {selectedSoldier.wellnessTrend.persistence}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '10px', background: 'var(--bg-tertiary)', borderRadius: '4px', borderLeft: '2px solid var(--accent-cyan)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {selectedSoldier.wellnessTrend.interpretation}
                    </span>
                  </div>
                </div>
              )}
`;

const before = lines.slice(0, factorsIdx);
const after = lines.slice(factorsIdx);
const newLines = [...before, trendBlock, ...after];

fs.writeFileSync('src/pages/WellnessDashboard.jsx', newLines.join('\n'), 'utf-8');
