import React, { useState } from 'react';
import { useAegis } from '../context/AegisContext';
import { 
  Shield, Bell, LogOut, User, 
  Activity, Users, Map, Clock, Settings, Heart, Database, Play
} from 'lucide-react';

export default function AppShell({ children, onNavigateToHome }) {
  const { userRole, logout, currentSoldier, notifications, setNotifications } = useAegis();
  const [bellOpen, setBellOpen] = useState(false);


  // Active user details
  const getUserDisplayName = () => {
    if (userRole === 'soldier' && currentSoldier) {
      return `${currentSoldier.rank} ${currentSoldier.name}`;
    }
    if (userRole === 'commander' && currentSoldier) {
      return `${currentSoldier.rank} ${currentSoldier.name}`;
    }
    if (userRole === 'commander') return 'Unit Commander';
    if (userRole === 'medical') return 'Dr. Arthur Pendelton (MO)';
    if (userRole === 'welfare') return 'Officer S. Kapoor (WO)';
    if (userRole === 'admin') return 'System Administrator';
    return 'Guest';
  };

  const getUserSubtext = () => {
    if (userRole === 'soldier' && currentSoldier) {
      return `ID: ${currentSoldier.serviceNumber}`;
    }
    if (userRole === 'commander') return 'Unit A Commander';
    if (userRole === 'medical') return 'Medical Officer - Region A';
    if (userRole === 'welfare') return 'Welfare Officer - Region A';
    if (userRole === 'admin') return 'Super User - Level 5';
    return 'Anonymous';
  };

  const handleLogout = () => {
    logout();
    onNavigateToHome();
  };



  return (
    <div className="dashboard-grid" style={{ position: 'relative', zIndex: 5, background: 'var(--bg-primary)' }}>
      {/* Sidebar Navigation - Desktop */}
      <aside className="glass-panel" style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        borderRadius: 0,
        borderRight: '1px solid var(--border-color)',
        borderLeft: 'none',
        borderTop: 'none',
        borderBottom: 'none',
        padding: '24px 16px',
        justifyContent: 'space-between',
        background: 'var(--bg-secondary)',
        zIndex: 50
      }}>
        <div>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, paddingLeft: 8 }}>
            <div style={{
              background: 'rgba(74, 93, 46, 0.08)',
              border: '1.5px solid var(--accent-cyan)',
              borderRadius: '4px',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={20} style={{ color: 'var(--accent-cyan)' }} />
            </div>
            <div>
              <h2 className="text-mono" style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)', letterSpacing: '0.02em' }}>OPERATION AEGIS</h2>
              <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', letterSpacing: '0.02em' }}>
                Unit A · Region A
              </span>
            </div>
          </div>

          {/* User Profile Info */}
          <div className="glass-panel" style={{
            padding: '12px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'var(--bg-tertiary)',
            borderColor: 'var(--border-color)'
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={16} style={{ color: 'var(--accent-cyan)' }} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {getUserDisplayName()}
              </div>
              <div className="text-mono" style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                {getUserSubtext()}
              </div>
            </div>
          </div>


        </div>

        {/* Sidebar Footer */}
        <div>

          
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              background: 'rgba(220, 38, 38, 0.05)',
              border: '1px solid var(--status-critical)',
              color: 'var(--status-critical)',
              padding: '10px 16px',
              fontFamily: 'Share Tech Mono',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontSize: '12px',
              fontWeight: '600',
              borderRadius: '4px',
              transition: 'all 0.2s'
            }}
          >
            <LogOut size={14} />
            <span>Secure Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh', overflowY: 'auto', background: 'var(--bg-primary)' }}>
        {/* Top Header Navbar */}
        <header className="glass-panel" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderRadius: 0,
          borderBottom: '1px solid var(--border-color)',
          borderLeft: 'none',
          borderRight: 'none',
          borderTop: 'none',
          background: 'var(--bg-secondary)',
          zIndex: 40,
          position: 'sticky',
          top: 0
        }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {userRole === 'commander' && 'COMMAND CENTER — UNIT A'}
              {userRole === 'soldier' && 'PERSONAL READINESS HUB'}
              {userRole === 'medical' && 'CLINICAL READINESS MONITOR'}
              {userRole === 'admin' && 'SYSTEM ADMINISTRATOR CONSOLE'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setBellOpen(!bellOpen)}
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <Bell size={18} style={{ color: notifications.length > 0 ? 'var(--accent-cyan)' : 'var(--text-secondary)' }} />
                {notifications.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    background: 'var(--status-critical)',
                    width: 7,
                    height: 7,
                    borderRadius: '50%'
                  }}></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {bellOpen && (
                <div className="glass-panel-glow" style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 8,
                  width: 320,
                  maxHeight: 400,
                  overflowY: 'auto',
                  padding: '12px',
                  background: 'var(--bg-secondary)',
                  zIndex: 100,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }} className="text-mono">Alert Feed</span>
                    <button 
                      onClick={() => setNotifications([])}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontSize: '10px' }}
                      className="text-mono"
                    >
                      CLEAR ALL
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                      No active system feeds.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {notifications.map(notif => (
                        <div key={notif.id} className="glass-panel" style={{
                          padding: '10px',
                          fontSize: '12px',
                          borderLeft: notif.type === 'warning' ? '3px solid var(--status-recovery)' : '3px solid var(--accent-cyan)',
                          background: 'var(--bg-primary)'
                        }}>
                          <div style={{ color: 'var(--text-primary)', marginBottom: 4 }}>{notif.text}</div>
                          <div className="text-mono" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{notif.time}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="text-mono" style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              UTC: {new Date().toISOString().substring(11, 19)}
            </div>
          </div>
        </header>

        {/* Dashboard Pages Renders Here */}
        {/* Global Demo Banner */}
        <div style={{
          background: 'rgba(234, 179, 8, 0.1)',
          borderBottom: '1px solid var(--status-recovery)',
          color: 'var(--status-recovery)',
          padding: '8px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          fontSize: '11px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }} className="text-mono">
          <Shield size={14} />
          <span>SYNTHETIC DEMO ENVIRONMENT — NOT FOR CLINICAL USE — DATA IS SIMULATED</span>
          <Shield size={14} />
        </div>
        <div style={{ flex: 1, padding: '24px', zIndex: 2, background: 'var(--bg-primary)' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
