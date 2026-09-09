const fs = require('fs');
const lines = fs.readFileSync('src/pages/PersonnelDashboard.jsx', 'utf-8').split('\n');

// Find the end of the CRI Gauge div
const criGaugeEndIdx = lines.findIndex(l => l.includes("                </svg>\n              </div>\n            </div>"));
// Actually, it's safer to just inject it after the Main Score KPI
const kpiEndIdx = lines.findIndex(l => l.includes('            {/* Recent Assessments */}'));

const trendBlock = `            {/* Longitudinal Trend (STEP 9) */}
            {currentSoldier.wellnessTrend && (
              <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                <h3 className="text-mono" style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>
                  Personal Longitudinal Trend
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ 
                      width: 40, height: 40, borderRadius: '8px', 
                      background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                    }}>
                      {currentSoldier.wellnessTrend.direction === 'improving' ? (
                        <TrendingDown size={20} color="var(--status-ready)" />
                      ) : currentSoldier.wellnessTrend.direction === 'deteriorating' ? (
                        <TrendingUp size={20} color="var(--status-monitor)" />
                      ) : (
                        <Minus size={20} color="var(--status-teal)" />
                      )}
                    </div>
                    <div>
                      <div className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Trend Direction</div>
                      <div style={{ fontSize: '15px', fontWeight: 'bold', textTransform: 'capitalize' }}>
                        {currentSoldier.wellnessTrend.direction.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ 
                      width: 40, height: 40, borderRadius: '8px', 
                      background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                    }}>
                      <Activity size={20} color="var(--accent-cyan)" />
                    </div>
                    <div>
                      <div className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Deviation from Baseline</div>
                      <div style={{ fontSize: '15px', fontWeight: 'bold' }}>
                        {currentSoldier.wellnessTrend.change > 0 ? '+' : ''}{currentSoldier.wellnessTrend.change} pts
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 16, padding: '12px', background: 'var(--bg-primary)', borderRadius: '4px', borderLeft: '2px solid var(--accent-cyan)' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {currentSoldier.wellnessTrend.interpretation}
                  </span>
                </div>
              </div>
            )}
`;

const before = lines.slice(0, kpiEndIdx);
const after = lines.slice(kpiEndIdx);
const newLines = [...before, trendBlock, ...after];

fs.writeFileSync('src/pages/PersonnelDashboard.jsx', newLines.join('\n'), 'utf-8');
