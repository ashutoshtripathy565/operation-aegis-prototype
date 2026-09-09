import React from 'react';
import { Shield, ChevronRight, Activity } from 'lucide-react';

export default function Home({ onNavigateToLogin }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <header className="glass-panel" style={{
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'rgba(5, 5, 5, 0.75)',
        backdropFilter: 'blur(16px)',
        borderRadius: 0,
        borderWidth: '0 0 1px 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid',
            borderColor: 'var(--accent-cyan)',
            padding: '8px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Shield size={22} style={{ color: 'var(--accent-cyan)' }} />
          </div>
          <div>
            <h1 className="text-mono" style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>OPERATION AEGIS</h1>
            <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', letterSpacing: '0.02em' }}>
              Early-Warning Wellbeing Intelligence
            </span>
          </div>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', textTransform: 'uppercase', fontWeight: 600 }} className="text-mono">How It Works</a>
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', textTransform: 'uppercase', fontWeight: 600 }} className="text-mono">Features</a>
          <button onClick={onNavigateToLogin} className="btn-cyber" style={{ padding: '8px 20px' }}>
            ACCESS AEGIS
          </button>
        </nav>
      </header>

      {/* Main Body */}
      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 40, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '20px', marginBottom: 20 }}>
              <Activity size={14} style={{ color: 'var(--accent-cyan)' }} />
              <span className="text-mono" style={{ fontSize: '11px', color: 'var(--accent-cyan)', letterSpacing: '0.02em', textTransform: 'uppercase', fontWeight: 600 }}>PERSONNEL WELLBEING SYSTEM</span>
            </div>
            
            <h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: 1.15, marginBottom: 20, color: 'var(--text-primary)' }}>
              Detect Meaningful Changes Early.<br />
              <span style={{ color: 'var(--accent-cyan)' }}>Support The Person.</span>
            </h1>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: 30 }}>
              Important changes in wellbeing or cognition can be difficult to notice in isolation. Operation Aegis connects personal baseline tracking, longitudinal patterns, human medical review, and privacy-aware command aggregation into one secure early-warning system.
            </p>
            
            <div style={{ display: 'flex', gap: 16 }}>
              <button onClick={onNavigateToLogin} className="btn-cyber-primary" style={{ padding: '12px 24px', fontSize: '13px' }}>
                Access Platform
              </button>
              <a href="#how-it-works" className="btn-cyber" style={{ padding: '12px 24px', fontSize: '13px', textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>
                How Aegis Works
              </a>
            </div>
          </div>

          {/* Hero Visual Schematic */}
          <div className="glass-panel" style={{
            padding: '30px',
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-mono" style={{ color: 'var(--text-muted)', fontSize: '11px' }}>SYSTEM WORKFLOW</span>
              <span className="text-mono" style={{ color: 'var(--accent-cyan)', fontSize: '11px' }}>AEGIS-V2.1</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginTop: 10 }}>
              <div className="glass-panel" style={{ width: '100%', padding: '10px 20px', background: 'var(--bg-primary)', textAlign: 'center', fontSize: '12px', color: 'var(--text-primary)', borderStyle: 'dashed' }}>
                <strong>1. Personal Baseline</strong>
              </div>
              <div style={{ height: 12, width: 1, borderLeft: '1.5px solid var(--border-color)' }}></div>
              
              <div className="glass-panel" style={{ width: '100%', padding: '10px 20px', background: 'var(--bg-primary)', textAlign: 'center', fontSize: '12px', color: 'var(--text-primary)', borderStyle: 'dashed' }}>
                <strong>2. Longitudinal Change Detected</strong>
              </div>
              <div style={{ height: 12, width: 1, borderLeft: '1.5px solid var(--border-color)' }}></div>
              
              <div className="glass-panel" style={{ width: '100%', padding: '10px 20px', background: 'var(--bg-primary)', textAlign: 'center', fontSize: '12px', color: 'var(--text-primary)', borderStyle: 'dashed' }}>
                <strong>3. Aegis Intelligence Signal</strong>
              </div>
              <div style={{ height: 12, width: 1, borderLeft: '1.5px solid var(--border-color)' }}></div>
              
              <div className="glass-panel" style={{ width: '100%', padding: '10px 20px', background: 'rgba(234, 88, 12, 0.06)', borderColor: 'var(--status-monitoring)', color: 'var(--status-monitoring)', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                <strong>4. Human Medical Review</strong>
              </div>
              <div style={{ height: 12, width: 1, borderLeft: '1.5px dashed var(--status-monitoring)' }}></div>
              
              <div className="glass-panel" style={{ width: '100%', padding: '10px 20px', background: 'rgba(22, 163, 74, 0.06)', borderColor: 'var(--status-ready)', color: 'var(--status-ready)', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                <strong>5. Support & Safe Command Aggregate</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Key Capabilities */}
        <section id="features" style={{ padding: '50px 40px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 className="text-mono" style={{ fontSize: '20px', marginBottom: 30, textAlign: 'center', color: 'var(--text-primary)' }}>CORE PHILOSOPHIES</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h3 className="text-mono" style={{ fontSize: '14px', marginBottom: 10, color: 'var(--accent-cyan)' }}>Personal Baseline</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Aegis compares a soldier with their own historical pattern—not with other soldiers. No leaderboards.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '20px' }}>
                <h3 className="text-mono" style={{ fontSize: '14px', marginBottom: 10, color: 'var(--accent-cyan)' }}>Early Warning</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Identifies meaningful changes in wellbeing and cognition before problems become critical.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '20px' }}>
                <h3 className="text-mono" style={{ fontSize: '14px', marginBottom: 10, color: 'var(--accent-cyan)' }}>Human In The Loop</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Aegis does not diagnose. Aegis recommends. A human Medical Officer decides the appropriate action.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '20px' }}>
                <h3 className="text-mono" style={{ fontSize: '14px', marginBottom: 10, color: 'var(--accent-cyan)' }}>Privacy First</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Commanders receive safe aggregate metrics. Protected medical details and internal risk intelligence remain siloed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How AEGIS Works */}
        <section id="how-it-works" style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="text-mono" style={{ fontSize: '20px', marginBottom: 36, textAlign: 'center', color: 'var(--text-primary)' }}>HOW AEGIS WORKS</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            {[
              { num: '01', title: 'Check-In', desc: 'Soldier securely provides wellbeing and cognitive telemetry.' },
              { num: '02', title: 'Learn', desc: 'Aegis learns the soldier\'s unique historical baseline.' },
              { num: '03', title: 'Detect', desc: 'Meaningful longitudinal deviations are identified early.' },
              { num: '04', title: 'Review', desc: 'Medical Officer reviews the signal and decides the action.' },
              { num: '05', title: 'Follow-Up', desc: 'Soldier receives human support when appropriate.' }
            ].map((step, index) => (
              <React.Fragment key={step.num}>
                <div className="glass-panel" style={{ padding: '16px', flex: 1, textAlign: 'center', minHeight: 160 }}>
                  <div className="text-mono" style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: 8, color: 'var(--accent-cyan)' }}>{step.num}</div>
                  <h4 style={{ fontSize: '13px', marginBottom: 6, textTransform: 'uppercase', color: 'var(--text-primary)' }} className="text-mono">{step.title}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.35 }}>{step.desc}</p>
                </div>
                {index < 4 && <ChevronRight size={16} color="var(--border-color)" />}
              </React.Fragment>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="glass-panel" style={{
        borderRadius: 0,
        borderWidth: '1px 0 0 0',
        padding: '24px 40px',
        background: 'var(--bg-secondary)',
        zIndex: 5
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 className="text-mono" style={{ fontSize: '13px', color: 'var(--text-primary)' }}>OPERATION AEGIS V2.1</h4>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Longitudinal Wellbeing Intelligence.</span>
          </div>
          
          <div style={{ display: 'flex', gap: 20, fontSize: '12px' }}>
            <span style={{ color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }} onClick={onNavigateToLogin}>Login Access</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
