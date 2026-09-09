const fs = require('fs');
let content = fs.readFileSync('src/pages/CommanderDashboard.jsx', 'utf-8');

// Update destructuring
content = content.replace(/    criticalCount,/g, `    criticalCount,
    deterioratingCount,
    improvingCount,
    stableCount,`);

// We want to add a widget or update an existing widget to show the aggregate trend.
// Let's find the Readiness Overview KPIs and add the trend summary.
// Currently it renders:
/*
      {/* Key Metrics Grid *\/}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
*/

const trendMetrics = `      {/* Key Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
        
        {/* New STEP 9: Longitudinal Wellness Overview */}
        <div className="glass-panel" style={{ padding: '20px', gridColumn: 'span 4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div>
            <h3 className="text-mono" style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: 8 }}>FORCE LONGITUDINAL WELLNESS TREND</h3>
            <div style={{ display: 'flex', gap: 32 }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--status-monitor)' }}>{deterioratingCount}</div>
                <div className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Deteriorating</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--status-ready)' }}>{improvingCount}</div>
                <div className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Improving</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stableCount}</div>
                <div className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Stable</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--status-critical)' }}>{welfareReviewCount}</div>
                <div className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Requires Review</div>
              </div>
            </div>
          </div>
          <Activity size={32} color="var(--accent-cyan)" style={{ opacity: 0.5 }} />
        </div>
`;

content = content.replace(/      \{\/\* Key Metrics Grid \*\/\}\n      <div style=\{\{ display: 'grid', gridTemplateColumns: 'repeat\(4, 1fr\)', gap: 20, marginBottom: 24 \}\}>/g, trendMetrics);

fs.writeFileSync('src/pages/CommanderDashboard.jsx', content, 'utf-8');
