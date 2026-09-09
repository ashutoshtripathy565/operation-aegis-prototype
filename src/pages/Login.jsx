import React, { useState } from 'react';
import { useAegis } from '../context/AegisContext';
import { Shield, Key, User, Info, ArrowLeft } from 'lucide-react';

export default function Login({ onNavigateToHome, onLoginSuccess }) {
  const { login } = useAegis();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const res = login(username, password);
    if (res.success) {
      onLoginSuccess();
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleQuickLogin = (userVal, passVal) => {
    setUsername(userVal);
    setPassword(passVal);
    
    setTimeout(() => {
      const res = login(userVal, passVal);
      if (res.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(res.message);
      }
    }, 100);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      background: 'var(--bg-primary)'
    }}>
      
      {/* Back to Home Button */}
      <button 
        onClick={onNavigateToHome}
        style={{
          position: 'absolute',
          top: 30,
          left: 40,
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: '13px'
        }}
        className="text-mono hover:text-black"
      >
        <ArrowLeft size={16} />
        <span>Return to Home</span>
      </button>

      <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Logo and Terminal Info */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="glass-panel" style={{
            background: 'rgba(74, 93, 46, 0.08)',
            borderColor: 'var(--accent-cyan)',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: 12,
            display: 'inline-flex'
          }}>
            <Shield size={32} style={{ color: 'var(--accent-cyan)' }} />
          </div>
          <h2 className="text-mono" style={{ letterSpacing: '0.05em', fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            SECURE ACCESS INTERFACE
          </h2>
          <span className="text-mono" style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 4 }}>
            Secure Personnel Welfare System · Unit A
          </span>
        </div>

        {/* Login Form */}
        <div className="glass-panel" style={{
          padding: '30px',
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}>
          
          {errorMsg && (
            <div style={{
              background: 'rgba(220, 38, 38, 0.05)',
              border: '1px solid var(--status-critical)',
              borderRadius: '4px',
              padding: '10px 14px',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'start',
              gap: 10,
              color: 'var(--status-critical)',
              fontSize: '13px'
            }}>
              <Info size={16} style={{ marginTop: 2, flexShrink: 0 }} />
              <div>{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* User ID Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Service / User ID
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="input-cyber" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. JC-472118K"
                  style={{ width: '100%', paddingLeft: 40 }}
                />
                <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Access Password
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  className="input-cyber" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', paddingLeft: 40 }}
                />
                <Key size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            {/* Extra Options */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="checkbox-cyber">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkmark"></span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Remember device</span>
              </label>

              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'underline', cursor: 'pointer' }}>
                Forgot Password?
              </span>
            </div>

            {/* Login Button */}
            <button type="submit" className="btn-cyber-primary" style={{ width: '100%', padding: '10px', marginTop: 6 }}>
              AUTHENTICATE CREDENTIALS
            </button>
          </form>
        </div>

        {/* Demo Bypass Panel */}
        {import.meta.env.DEV && import.meta.env.VITE_AEGIS_DEMO_MODE !== 'false' && <div className="glass-panel" style={{
          padding: '16px',
          borderColor: 'var(--border-color)',
          background: 'var(--bg-secondary)'
        }}>
          <h4 className="text-mono" style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10, textAlign: 'center' }}>
            🔐 Sandbox Credentials Bypass
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button 
              onClick={() => handleQuickLogin('IC-57556H', 'admin123')} 
              className="btn-cyber" 
              style={{ fontSize: '10px', padding: '5px 0', textTransform: 'uppercase' }}
            >
              Commander Batra
            </button>
            <button 
              onClick={() => handleQuickLogin('JC-472118K', 'demo123')} 
              className="btn-cyber" 
              style={{ fontSize: '10px', padding: '5px 0', textTransform: 'uppercase' }}
            >
              Havildar Rajesh
            </button>
            <button 
              onClick={() => handleQuickLogin('medical.officer', 'aegis123')} 
              className="btn-cyber" 
              style={{ fontSize: '10px', padding: '5px 0', textTransform: 'uppercase' }}
            >
              Medical Officer
            </button>
            <button 
              onClick={() => handleQuickLogin('admin.system', 'aegis123')} 
              className="btn-cyber" 
              style={{ fontSize: '10px', padding: '5px 0', textTransform: 'uppercase' }}
            >
              System Admin
            </button>
          </div>
        </div>}

      </div>
    </div>
  );
}
