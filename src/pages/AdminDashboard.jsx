import React, { useState } from 'react';
import { useAegis } from '../context/AegisContext';
import { Database, UserCheck, ShieldAlert, Cpu, Trash2, Key, RefreshCw, Wifi, WifiOff, Server } from 'lucide-react';

export default function AdminDashboard() {
  const {
    getAdminData, registerDevice, removeSoldier,
    hcWebhookConfig, updateHcWebhookConfig, resetDemoData,
    history  // global history state for source classification audit
  } = useAegis();

  const adminData = getAdminData() || {};
  const auditLogs = adminData.auditLogs || [];
  const soldiers = adminData.personnelRoster || [];

  const [activeTab, setActiveTab] = useState('audit'); // audit, records, device, accounts, hcwebhook

  // States for device assignment
  const [selectedSoldierId, setSelectedSoldierId] = useState('');
  const [deviceName, setDeviceName] = useState('AEGIS-BAND-301X');
  const [googleClientId, setGoogleClientId] = useState(hcWebhookConfig.googleClientId || '');
  const [saveStatus, setSaveStatus] = useState('');

  const handlePairDevice = (e) => {
    e.preventDefault();
    if (!selectedSoldierId) {
      alert('Please select a soldier record first.');
      return;
    }
    registerDevice(selectedSoldierId, deviceName);
    alert('Device successfully linked to soldier record.');
    setSelectedSoldierId('');
  };

  const handleArchiveRecord = (soldierId) => {
    if (confirm('Are you sure you want to archive this soldier personnel profile? This action is tracked in audit records.')) {
      removeSoldier(soldierId);
      alert('Record archived.');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24 }}>

      {/* Admin Sidebar Navigation */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { id: 'audit', label: 'System Audit Logs' },
          { id: 'records', label: 'Wellbeing Records' },
          { id: 'device', label: 'Device Link Manager' },
          { id: 'accounts', label: 'Personnel Accounts' },
          { id: 'hcwebhook', label: 'Wearable Cloud Sync' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={activeTab === item.id ? 'btn-cyber-primary' : 'btn-cyber'}
            style={{ width: '100%', textAlign: 'left', fontSize: '12px' }}
          >
            {item.label}
          </button>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: 20 }}>
          <button
            onClick={() => {
              if (confirm('WARNING: Are you sure you want to completely reset all synthetic demonstration data? This clears follow-ups and restores the initial deterministic demo state.')) {
                resetDemoData();
              }
            }}
            className="btn-cyber"
            style={{ width: '100%', textAlign: 'center', fontSize: '11px', color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}
          >
            RESET SYNTHETIC DEMO DATA
          </button>
        </div>
      </div>

      {/* Main Admin Section */}
      <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>

        {/* Tab 1: System Audit Logs */}
        {activeTab === 'audit' && (
          <div>
            <h3 className="text-mono" style={{ fontSize: '15px', marginBottom: 16, color: 'var(--accent-cyan)' }}>
              SYSTEM ENCRYPTED AUDIT TRAIL LOG
            </h3>
            <div className="glass-panel" style={{ maxHeight: '450px', overflowY: 'auto', background: 'var(--bg-primary)', padding: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {auditLogs.length === 0 && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No audit events recorded yet.</div>
                )}
                {auditLogs.map((log, index) => (
                  <div key={index} className="text-mono" style={{ fontSize: '12px', padding: '8px', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                      <span>UTC: {new Date(log.timestamp).toLocaleString()}</span>
                      <span style={{ color: 'var(--accent-cyan)' }}>USER: {log.user}</span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      ⚡ {log.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Wellbeing Records — Source Classification Audit */}
        {activeTab === 'records' && (
          <div>
            <h3 className="text-mono" style={{ fontSize: '15px', marginBottom: 4, color: 'var(--accent-cyan)' }}>
              WELLBEING RECORDS — SOURCE CLASSIFICATION AUDIT
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.5 }}>
              Verifying that records exist and that source classification is correct.
              SOURCE: SOLDIER = self-submitted check-in. SOURCE: UNIT = admin/command data.
              Sensitive content (raw answers, comments) is NOT displayed here.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '12px', color: 'var(--text-secondary)' }}>
              <span>Total records in system: <strong style={{ color: 'var(--text-primary)' }}>{history.length}</strong></span>
              <span>
                SOLDIER-sourced: <strong style={{ color: 'var(--accent-cyan)' }}>{history.filter(h => h.source === 'SOLDIER').length}</strong>
                {' | '}
                UNIT-sourced: <strong style={{ color: '#64748b' }}>{history.filter(h => h.source === 'UNIT').length}</strong>
              </span>
            </div>

            <div className="glass-panel" style={{ maxHeight: '450px', overflowY: 'auto', background: 'var(--bg-primary)', padding: '12px' }}>
              {history.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No wellbeing records in system yet.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                      <th style={{ textAlign: 'left', paddingBottom: 8 }}>RECORD ID</th>
                      <th style={{ textAlign: 'left', paddingBottom: 8 }}>SOLDIER ID</th>
                      <th style={{ textAlign: 'center', paddingBottom: 8 }}>TIMESTAMP</th>
                      <th style={{ textAlign: 'center', paddingBottom: 8 }}>SOURCE</th>
                      <th style={{ textAlign: 'right', paddingBottom: 8 }}>CATEGORY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(h => {
                      const sourceColor = h.source === 'SOLDIER' ? 'var(--accent-cyan)' : '#64748b';
                      return (
                        <tr key={h.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td className="text-mono" style={{ padding: '8px 0', fontSize: '10px', color: 'var(--text-muted)' }}>
                            {h.id?.slice(0, 16)}…
                          </td>
                          <td className="text-mono" style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>
                            {h.soldierId}
                          </td>
                          <td className="text-mono" style={{ padding: '8px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px' }}>
                            {new Date(h.timestamp).toLocaleString()}
                          </td>
                          <td style={{ padding: '8px 0', textAlign: 'center' }}>
                            <span className="text-mono" style={{
                              fontSize: '10px', padding: '2px 8px', borderRadius: '3px',
                              border: `1px solid ${sourceColor}`, color: sourceColor
                            }}>
                              {h.source || 'UNKNOWN'}
                            </span>
                          </td>
                          <td className="text-mono" style={{ padding: '8px 0', textAlign: 'right', fontSize: '10px', color: 'var(--text-muted)' }}>
                            {h.category || '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Device Manager Pairing */}
        {activeTab === 'device' && (
          <div>
            <h3 className="text-mono" style={{ fontSize: '15px', marginBottom: 20, color: 'var(--accent-cyan)' }}>
              AEGIS SECURE BAND PROFILES
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24 }}>
              {/* Linked list table */}
              <div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                      <th style={{ textAlign: 'left', paddingBottom: 8 }}>SOLDIER NAME</th>
                      <th style={{ textAlign: 'center', paddingBottom: 8 }}>BAND LINKAGE</th>
                      <th style={{ textAlign: 'right', paddingBottom: 8 }}>BATTERY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {soldiers.map(s => (
                      <tr key={s.serviceNumber} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '10px 0', fontWeight: 'bold' }}>{s.name}</td>
                        <td style={{ padding: '10px 0', textAlign: 'center', color: s.deviceConnected ? 'var(--status-ready)' : 'var(--text-muted)' }} className="text-mono">
                          {s.deviceConnected ? 'Pair Active' : 'Unlinked'}
                        </td>
                        <td style={{ padding: '10px 0', textAlign: 'right' }} className="text-mono">
                          {s.deviceConnected ? `${s.deviceBattery}%` : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pairing Action Form */}
              <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Cpu size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <h4 className="text-mono" style={{ fontSize: '13px', color: 'var(--accent-cyan)' }}>Link Secure Device</h4>
                </div>

                <form onSubmit={handlePairDevice} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>SELECT SOLDIER</label>
                    <select
                      className="input-cyber"
                      value={selectedSoldierId}
                      onChange={(e) => setSelectedSoldierId(e.target.value)}
                    >
                      <option value="">-- Choose Profile --</option>
                      {soldiers.map(s => (
                        <option key={s.serviceNumber} value={s.serviceNumber}>{s.name} ({s.serviceNumber})</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>BAND DEVICE SIGNATURE</label>
                    <input
                      type="text"
                      className="input-cyber"
                      value={deviceName}
                      onChange={(e) => setDeviceName(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn-cyber-primary" style={{ width: '100%', fontSize: '12px' }}>
                    Pair Band
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Personnel Accounts */}
        {activeTab === 'accounts' && (
          <div>
            <h3 className="text-mono" style={{ fontSize: '15px', marginBottom: 16, color: 'var(--accent-cyan)' }}>
              COMSYS USER ACCOUNTS REGISTRY
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ textAlign: 'left', paddingBottom: 10 }}>USER ID</th>
                  <th style={{ textAlign: 'left', paddingBottom: 10 }}>FULL NAME</th>
                  <th style={{ textAlign: 'center', paddingBottom: 10 }}>ROLE LEVEL</th>
                  <th style={{ textAlign: 'right', paddingBottom: 10 }}>SYSTEM ACTION</th>
                </tr>
              </thead>
              <tbody>
                {soldiers.map(s => (
                  <tr key={s.serviceNumber} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 0', color: 'var(--text-secondary)' }} className="text-mono">{s.serviceNumber}</td>
                    <td style={{ padding: '10px 0', fontWeight: 'bold' }}>{s.name}</td>
                    <td style={{ padding: '10px 0', textAlign: 'center' }}>
                      <span className="text-mono" style={{ fontSize: '11px', padding: '2px 6px', background: 'var(--bg-primary)', borderRadius: '4px' }}>
                        Soldier Profile
                      </span>
                    </td>
                    <td style={{ padding: '10px 0', textAlign: 'right' }}>
                      <button
                        onClick={() => handleArchiveRecord(s.serviceNumber)}
                        className="btn-cyber"
                        style={{ borderColor: 'var(--status-critical)', color: 'var(--status-critical)', padding: '3px 8px', fontSize: '11px' }}
                      >
                        <Trash2 size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                        Archive
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 5: Wearable Cloud Sync Config */}
        {activeTab === 'hcwebhook' && (
          <div>
            <h3 className="text-mono" style={{ fontSize: '15px', marginBottom: 8, color: 'var(--accent-cyan)' }}>
              WEARABLE HEALTH CLOUD INTEGRATION
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5 }}>
              Save the public Google OAuth client ID used by this demo to request consent and fetch permitted Google Fitness readings. Access tokens are not stored.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Config Panel */}
              <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Server size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <h4 className="text-mono" style={{ fontSize: '13px', color: 'var(--accent-cyan)' }}>Credentials Configuration</h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>GOOGLE OAUTH CLIENT ID</label>
                    <input
                      id="admin-google-client-id"
                      type="text"
                      className="input-cyber"
                      placeholder="1234567890-abc.apps.googleusercontent.com"
                      value={googleClientId}
                      onChange={event => setGoogleClientId(event.target.value)}
                    />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Client IDs are public identifiers. Do not enter an OAuth client secret here.</span>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button
                      id="admin-hc-save-btn"
                      className="btn-cyber-primary"
                      style={{ flex: 1, fontSize: '12px', padding: '10px' }}
                      onClick={() => {
                        updateHcWebhookConfig(googleClientId);
                        setSaveStatus('Google OAuth client ID saved locally.');
                        setTimeout(() => setSaveStatus(''), 3000);
                      }}
                    >
                      Save Configuration
                    </button>
                  </div>

                  {saveStatus && (
                    <div className="text-mono" style={{ fontSize: '12px', padding: '8px 12px', borderRadius: '4px', background: 'rgba(22,163,74,0.08)', color: 'var(--status-ready)', lineHeight: 1.4, textAlign: 'center' }}>
                      {saveStatus}
                    </div>
                  )}
                </div>
              </div>

              {/* Saved Config + Setup Guide */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="glass-panel" style={{ padding: '16px' }}>
                  <h4 className="text-mono" style={{ fontSize: '12px', marginBottom: 12, color: 'var(--text-secondary)' }}>CURRENT WEARABLE CLOUD CONFIG</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                      <strong style={{ color: 'var(--status-ready)' }}>
                        {hcWebhookConfig.googleClientId ? 'Configured' : 'Not configured'}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>OAuth Client ID:</span>
                      <code className="text-mono" style={{ fontSize: '11px', color: 'var(--accent-cyan)', wordBreak: 'break-all' }}>
                        {hcWebhookConfig.googleClientId || 'Not configured'}
                      </code>
                    </div>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '16px', background: 'var(--bg-primary)' }}>
                  <h4 className="text-mono" style={{ fontSize: '12px', marginBottom: 10, color: 'var(--text-secondary)' }}>GOOGLE FITNESS SETUP</h4>
                  <ol style={{ paddingLeft: 18, margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    <li>Create a Google OAuth web client and add <code>http://127.0.0.1:5173</code> as an authorized JavaScript origin.</li>
                    <li>Enable the Fitness API and configure the OAuth consent screen.</li>
                    <li>Paste only the client ID here; never expose a client secret in a browser app.</li>
                    <li>Use an Android companion app for direct Health Connect data; the browser reads Google Fitness API data only.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
