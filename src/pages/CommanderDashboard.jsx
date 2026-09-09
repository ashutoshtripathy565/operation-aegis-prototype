import React, { useState } from 'react';
import { useAegis } from '../context/AegisContext';
import { 
  Users, Activity, Shield, AlertTriangle, TrendingUp, Search, 
  Map, Sliders, CheckCircle2, X, Zap, Download, RefreshCw, HeartPulse
} from 'lucide-react';

export default function CommanderDashboard() {
  const { 
    getAggregateCommandData, history, updateMedicalCategory,
  } = useAegis();

  // Navigation state inside Commander views
  const [activeSubTab, setActiveSubTab] = useState('summary'); // summary, personnel, mission, profile
  const [selectedSoldierId, setSelectedSoldierId] = useState(null); // for profile view
  const [quickViewSoldier, setQuickViewSoldier] = useState(null); // for quick-view modal
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Trend line chart filter

  const [chartFocus, setChartFocus] = useState('average'); 

  // Fetch role-restricted aggregate intelligence
  const aggregateData = getAggregateCommandData();
  const soldiers = aggregateData.personnelRoster;




  
  const {
    totalPersonnel: totalSoldiers,
    welfareHigh,
    welfareCritical,
    welfareReviewCount,
    deterioratingCount,
    improvingCount,
    stableCount,
    followUpActive,
    followUpMonitored,
    followUpResolved
  } = aggregateData;

  // Derive operational status from welfare data
  const sectionStatus = welfareCritical > 0 ? 'WELFARE ALERT' : welfareHigh > 0 ? 'MONITOR' : 'STABLE';
  const sectionStatusColor = welfareCritical > 0 ? 'var(--status-critical)' : welfareReviewCount > 0 ? 'var(--status-monitor)' : 'var(--status-ready)';

  // We need an array for activeSoldiers for the personnel table mapped in the view
  // Let's filter the roster (which now includes .role and .availability from AegisContext)
  const activeSoldiers = soldiers.filter(s => s.role === 'soldier');

  // ==================== TREND LINE DATA GENERATION ====================
  const getWellbeingHistoryPoints = () => {
    if (chartFocus === 'average') {
      return [74, 76, 75, 78, 77, 79, 80];
    } else {
      const sh = history.filter(h => h.soldierId === chartFocus).slice(0, 7).reverse();
      if (sh.length < 3) {
        return [73, 75, 74, 76, 78, 77, 79];
      }
      return sh.map(h => (h.values ? h.values.stressScore * 10 : h.stressScore * 10));
    }
  };

  const trendPoints = getWellbeingHistoryPoints();
  const svgWidth = 500;
  const svgHeight = 150;
  const maxVal = 100;
  const minVal = 50;

  const generatePath = () => {
    const pointsCount = trendPoints.length;
    const xStep = svgWidth / (pointsCount - 1);
    
    return trendPoints.map((val, idx) => {
      const x = idx * xStep;
      const y = svgHeight - ((val - minVal) / (maxVal - minVal)) * svgHeight;
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // ==================== QUICK VIEW AND PROFILE ACTIONS ====================
  const handleOpenQuickView = (soldier) => {
    setQuickViewSoldier(soldier);
  };

  const handleOpenFullProfile = (soldierId) => {
    setSelectedSoldierId(soldierId);
    setQuickViewSoldier(null);
    setActiveSubTab('profile');
  };

  const handleMedicalOverride = (soldierId, category, status, notes) => {
    updateMedicalCategory(soldierId, category, status, notes);
    if (quickViewSoldier && quickViewSoldier.id === soldierId) {
      setQuickViewSoldier(prev => ({
        ...prev,
        medicalCategory: category,
        operationalStatus: status,
        availability: status === 'Available' || status === 'Active'
      }));
    }
  };

  

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Privacy Notification */}
      <div style={{ padding: '10px 16px', background: 'rgba(22, 163, 74, 0.08)', border: '1px solid var(--status-ready)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Shield size={18} style={{ color: 'var(--status-ready)' }} />
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Privacy Protected</strong> — Aggregate information only. Individual medical and cognitive details remain protected.
        </span>
      </div>

      {/* Sub tabs */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button 
          onClick={() => setActiveSubTab('summary')} 
          className={activeSubTab === 'summary' ? 'btn-cyber-primary' : 'btn-cyber'}
        >
          Commander Dashboard
        </button>
        <button 
          onClick={() => setActiveSubTab('personnel')} 
          className={activeSubTab === 'personnel' ? 'btn-cyber-primary' : 'btn-cyber'}
        >
          Section Personnel
        </button>
        
      </div>

      {/* DASHBOARD SUMMARY tab */}
      {activeSubTab === 'summary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Top KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Section Strength</span>
                <Users size={16} color="var(--accent-cyan)" />
              </div>
              <h2 className="text-mono" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {soldiers.filter(s => s.availability).length} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/ {totalSoldiers}</span>
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Available Personnel</span>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Assessed Today</span>
                <Activity size={16} color="var(--accent-cyan)" />
              </div>
              <h2 className="text-mono" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {history.filter(h => new Date(h.timestamp).toDateString() === new Date().toDateString()).length} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/ {totalSoldiers}</span>
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Check-ins today</span>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Medical Follow-Ups</span>
                <TrendingUp size={16} color="var(--accent-cyan)" />
              </div>
              <h2 className="text-mono" style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                {followUpActive} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/ {followUpMonitored}</span>
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active / Monitored</span>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Welfare Review</span>
                <Shield size={16} color={sectionStatusColor} />
              </div>
              <h2 className="text-mono" style={{ fontSize: '24px', fontWeight: 'bold', color: sectionStatusColor }}>
                {welfareReviewCount > 0 ? "REVIEW REQ" : "CLEAR"}
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Required reviews</span>
            </div>
          </div>

{/* Commander Welfare Summary */}
          <div className="glass-panel" style={{ padding: '20px', borderLeft: '3.5px solid var(--status-teal)', background: 'rgba(2, 132, 199, 0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <HeartPulse size={16} style={{ color: 'var(--status-teal)' }} />
              <h3 className="text-mono" style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--status-teal)' }}>Personnel Welfare Intelligence Summary</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Section Welfare Trend</span>
                <span style={{ fontSize: '14px', color: welfareHigh + welfareCritical > 2 ? 'var(--status-monitor)' : 'var(--status-ready)', fontWeight: 'bold' }}>
                  {welfareHigh + welfareCritical > 2 ? 'ELEVATED STRAIN' : 'STABLE'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>High Risk Count</span>
                <span className="text-mono" style={{ fontSize: '16px', color: welfareHigh > 0 ? 'var(--status-recovery)' : 'var(--text-primary)' }}>{welfareHigh} personnel</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Critical Welfare Risk</span>
                <span className="text-mono" style={{ fontSize: '16px', color: welfareCritical > 0 ? 'var(--status-critical)' : 'var(--text-primary)' }}>{welfareCritical} personnel</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Pending Reviews</span>
                <span className="text-mono" style={{ fontSize: '16px', color: welfareReviewCount > 0 ? 'var(--status-monitor)' : 'var(--text-primary)' }}>{welfareReviewCount} required</span>
              </div>
            </div>
          </div>

          {/* Section Intelligence (Sentinel AI Warnings) */}
          <div className="glass-panel" style={{ padding: '20px', borderLeft: '3.5px solid var(--accent-cyan)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Zap size={16} style={{ color: 'var(--accent-cyan)' }} />
              <h3 className="text-mono" style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>Section Intelligence & Alerts</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <span className="text-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Section Risk Summary
                </span>
                <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                  "Section operational logs indicate stable fatigue profiles. Monitor Lance Naik Deepak Yadav for fatigue during night drills."
                </p>
              </div>

              <div>
                <span className="text-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Sentinel AI Recovery Recommendation
                </span>
                <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                  "Recommend light duty restrictions clearance for Sepoy Vikas Thakur (SHAPE-2 classification) due to knee stiffness recovery."
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SECTION PERSONNEL tab */}
      {activeSubTab === 'personnel' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 className="text-mono" style={{ fontSize: '14px' }}>SECTION PERSONNEL ROSTER</h3>
            
            {/* Search and Filters */}
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="input-cyber" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Service ID / Name..."
                  style={{ paddingLeft: 32, fontSize: '13px', padding: '6px 12px' }}
                />
              </div>

              <select 
                className="input-cyber" 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{ fontSize: '13px', padding: '6px' }}
              >
                <option value="all">All Roles</option>
                <option value="Rifleman">Rifleman</option>
                <option value="Medic">Medic</option>
                <option value="Leader">Leader</option>
                <option value="Signaller">Signaller</option>
              </select>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ textAlign: 'left', paddingBottom: 12 }}>SERVICE NO.</th>
                <th style={{ textAlign: 'left', paddingBottom: 12 }}>SOLDIER NAME</th>
                <th style={{ textAlign: 'left', paddingBottom: 12 }}>ROLE / SPECIALIZATION</th>
                
                <th style={{ textAlign: 'center', paddingBottom: 12 }}>MEDICAL CLAS.</th>
                <th style={{ textAlign: 'center', paddingBottom: 12 }}>OPERATIONAL STATUS</th>
                <th style={{ textAlign: 'right', paddingBottom: 12 }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {soldiers
                .filter(s => {
                  const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                      s.serviceNumber.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchRole = roleFilter === 'all' || s.role.toLowerCase().includes(roleFilter.toLowerCase()) || s.currentAssignment.toLowerCase().includes(roleFilter.toLowerCase());
                  return matchSearch && matchRole;
                })
                .map(s => {
                  const band = { label: s.wellness?.welfareRisk || 'UNKNOWN', color: s.wellness?.welfareRisk === 'CRITICAL WELFARE RISK' ? '#dc2626' : s.wellness?.welfareRisk === 'HIGH RISK' ? '#ea580c' : s.wellness?.welfareRisk === 'MONITOR' ? '#d97706' : '#16a34a' };
                  return (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 0', color: 'var(--text-secondary)' }} className="text-mono">{s.serviceNumber}</td>
                      <td style={{ padding: '12px 0', fontWeight: 'bold' }}>{s.rank} {s.name}</td>
                      <td style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>{s.currentAssignment}</td>
                      
                      <td style={{ padding: '12px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>{s.medicalCategory}</td>
                      <td style={{ padding: '12px 0', textAlign: 'center' }}>
                        <span className="text-mono" style={{ 
                          fontSize: '11px', 
                          padding: '3px 8px', 
                          borderRadius: '4px',
                          background: s.operationalStatus === 'Available' || s.operationalStatus === 'Active' ? 'rgba(22, 163, 74, 0.06)' : 'rgba(217, 119, 6, 0.06)',
                          color: s.operationalStatus === 'Available' || s.operationalStatus === 'Active' ? 'var(--status-ready)' : 'var(--status-monitor)',
                          border: `1px solid ${s.operationalStatus === 'Available' || s.operationalStatus === 'Active' ? 'var(--status-ready)' : 'var(--status-monitor)'}`
                        }}>
                          {s.operationalStatus}
                        </span>
                      </td>
                      <td style={{ padding: '12px 0', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleOpenFullProfile(s.id)}
                          className="btn-cyber" 
                          style={{ fontSize: '11px', padding: '4px 10px' }}
                        >
                          Full Profile
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {/* FULL SOLDIER PROFILE VIEW */}
      {activeSubTab === 'profile' && selectedSoldierId && (() => {
        const soldier = soldiers.find(s => s.id === selectedSoldierId);
        if (!soldier) return null;
        const sBand = { label: soldier.wellness?.welfareRisk || 'UNKNOWN', color: soldier.wellness?.welfareRisk === 'CRITICAL WELFARE RISK' ? '#dc2626' : soldier.wellness?.welfareRisk === 'HIGH RISK' ? '#ea580c' : soldier.wellness?.welfareRisk === 'MONITOR' ? '#d97706' : '#16a34a' };
        const sHistory = history.filter(h => h.soldierId === soldier.id);

        return (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid var(--border-color)', paddingBottom: 12 }}>
              <div>
                <h2 style={{ fontSize: '20px' }}>
                  {soldier.rank} {soldier.name}
                </h2>
                <span className="text-mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Service ID: {soldier.serviceNumber} // Unit: {soldier.unit} // Posting: {soldier.currentPosting}
                </span>
              </div>
              <button 
                onClick={() => setActiveSubTab('personnel')} 
                className="btn-cyber"
              >
                Back to List
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
              
              {/* Profile Left */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                
                {/* Section 1: Demographics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div className="glass-panel" style={{ padding: '16px', background: 'var(--bg-primary)' }}>
                    <h4 className="text-mono" style={{ fontSize: '12px', color: 'var(--accent-cyan)', marginBottom: 10 }}>1. Personal & Physical</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '13px' }}>
                      <div>Age: <strong>{soldier.age} Yrs</strong></div>
                      <div>DOB: <strong>{soldier.dob}</strong></div>
                      <div>Height: <strong>{soldier.height || soldier.heightCm} cm</strong></div>
                      <div>Weight: <strong>{soldier.weight || soldier.weightKg} kg</strong></div>
                      <div>Blood Group: <strong style={{ color: 'var(--accent-cyan)' }}>{soldier.bloodGroup}</strong></div>
                    </div>
                  </div>

                  {/* Section 2: Service Record */}
                  <div className="glass-panel" style={{ padding: '16px', background: 'var(--bg-primary)' }}>
                    <h4 className="text-mono" style={{ fontSize: '12px', color: 'var(--accent-cyan)', marginBottom: 10 }}>2. Personnel Service Roster</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '13px' }}>
                      <div>Enrolment Date: <strong>{soldier.dateOfEnrolment}</strong></div>
                      <div>Service Span: <strong>{soldier.yearsOfService} Years</strong></div>
                      <div>Roster Assignment: <strong>{soldier.currentAssignment}</strong></div>
                      <div>Clearance Category: <strong>{soldier.medicalCategory}</strong></div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Wellbeing Trend — AUTHORIZED VIEW ONLY */}
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <h4 className="text-mono" style={{ fontSize: '12px', color: 'var(--accent-cyan)', marginBottom: 12 }}>3. Welfare Trend Indicators (Authorized View)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="glass-panel" style={{ padding: '14px', background: 'var(--bg-primary)' }}>
                      <div className="text-mono" style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: 4 }}>WELFARE STATUS</div>
                      <div style={{ fontWeight: 'bold', color: sBand.color, fontSize: '14px' }}>{sBand.label}</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '14px', background: 'var(--bg-primary)' }}>
                      <div className="text-mono" style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: 4 }}>CHECK-IN RECORDS</div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{sHistory.length} total</div>
                    </div>
                  </div>
                </div>

                {/* Section 4: History Log — timestamps and source only, no private content */}
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <h4 className="text-mono" style={{ fontSize: '12px', marginBottom: 10 }}>4. Welfare Check-in Log (Authorized Summary)</h4>
                  {sHistory.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>No check-in records on file.</div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                          <th style={{ textAlign: 'left', paddingBottom: 6 }}>TIMESTAMP</th>
                          <th style={{ textAlign: 'center', paddingBottom: 6 }}>SOURCE</th>
                          <th style={{ textAlign: 'right', paddingBottom: 6 }}>WELFARE STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sHistory.map(h => {
                          const riskBand = h.riskBand || 'LOGGED';
                          const bandColor = riskBand === 'CRITICAL WELFARE RISK' ? '#dc2626'
                            : riskBand === 'HIGH RISK' ? '#ea580c'
                            : riskBand === 'MONITOR' ? '#d97706' : '#16a34a';
                          return (
                            <tr key={h.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }} className="text-mono">{new Date(h.timestamp).toLocaleString()}</td>
                              <td style={{ padding: '8px 0', textAlign: 'center' }}>
                                <span className="text-mono" style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '3px', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                                  {h.source || 'UNIT'}
                                </span>
                              </td>
                              <td style={{ padding: '8px 0', textAlign: 'right', color: bandColor, fontWeight: 'bold' }} className="text-mono">
                                {riskBand}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>

              </div>

              {/* Profile Right */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                
                {/* Score Summary */}
                <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                  <span className="text-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>WELFARE STATUS</span>
                  <h2 style={{ fontSize: '40px', fontWeight: '900', color: sBand.color }} className="text-mono">
                    
                  </h2>
                  <span className="text-mono" style={{ color: sBand.color, fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}>
                    {sBand.label}
                  </span>
                </div>

                {/* Sentinel AI Insights */}
                <div className="glass-panel-glow" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <Zap size={14} style={{ color: 'var(--accent-cyan)' }} />
                    <h4 className="text-mono" style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>Sentinel AI Advice</h4>
                  </div>
                  <p style={{ fontSize: '12px', lineHeight: 1.45, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    "Welfare monitoring active. Review aggregate metrics."
                  </p>
                </div>

                {/* Device Diagnostics Info */}
                <div className="glass-panel" style={{ padding: '16px' }}>
                  <h4 className="text-mono" style={{ fontSize: '11px', textTransform: 'uppercase', marginBottom: 10 }}>Wearable Diagnostics</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '13px' }}>
                    <div>Sync Status: <strong style={{ color: soldier.deviceConnected ? 'var(--status-ready)' : 'var(--text-muted)' }}>
                      {soldier.deviceConnected ? 'Connected' : 'Offline'}
                    </strong></div>
                    <div>Battery Level: <strong className="text-mono">{soldier.deviceBattery}%</strong></div>
                    <div>Last Sync Window: <strong className="text-mono" style={{ fontSize: '11px' }}>{soldier.deviceSyncTime}</strong></div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        );
      })()}

      {/* QUICK VIEW POPUP MODAL */}
      {quickViewSoldier && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 200,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '500px',
            background: 'var(--bg-secondary)',
            padding: '24px',
            position: 'relative'
          }}>
            <button 
              onClick={() => setQuickViewSoldier(null)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            <div style={{ marginBottom: 16 }}>
              <span className="text-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PERSONNEL QUICK VIEW</span>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: 2 }}>
                {quickViewSoldier.rank} {quickViewSoldier.name}
              </h3>
              <span className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Service ID: {quickViewSoldier.serviceNumber}
              </span>
            </div>

            {/* PRS Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16, marginBottom: 20 }}>
              <div className="glass-panel" style={{ padding: '14px', background: 'var(--bg-primary)' }}>
                <h4 className="text-mono" style={{ fontSize: '11px', color: 'var(--accent-cyan)', marginBottom: 8 }}>WELFARE SUMMARY</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <div>Status: <strong>{quickViewSoldier.wellnessStatus || '—'}</strong></div>
                  <div>Trend: <strong>{quickViewSoldier.wellnessTrendDirection || '—'}</strong></div>
                  <div>Medical Category: <strong>{quickViewSoldier.medicalCategory || '—'}</strong></div>
                  <div>Welfare Review: <strong>{quickViewSoldier.welfareReviewNeeded ? 'Yes' : 'No'}</strong></div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-primary)', borderRadius: '4px', border: '1px solid var(--border-color)', padding: '14px' }}>
                {(() => {
                  const qRisk = quickViewSoldier.wellness?.welfareRisk || 'UNKNOWN';
                  const qColor = qRisk === 'CRITICAL WELFARE RISK' ? '#dc2626' : qRisk === 'HIGH RISK' ? '#ea580c' : qRisk === 'MONITOR' ? '#d97706' : '#16a34a';
                  return (
                    <>
                      <span className="text-mono" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>WELFARE STATUS</span>
                      <div className="text-mono" style={{ fontSize: '16px', fontWeight: '900', color: qColor, marginTop: 4, textAlign: 'center' }}>
                        {qRisk}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Privacy boundary note in quick view */}
            <div style={{ marginBottom: 20, padding: '10px', background: 'rgba(22, 163, 74, 0.08)', borderRadius: '4px', border: '1px solid var(--status-ready)' }}>
              <span className="text-mono" style={{ fontSize: '10px', color: 'var(--status-ready)', display: 'block', marginBottom: 4 }}>
                <Shield size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
                MEDICAL PRIVACY
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4, display: 'block' }}>
                Detailed medical notes, psychological reasoning, and cognitive scores are restricted to Medical/Welfare Officers.
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                onClick={() => handleOpenFullProfile(quickViewSoldier.id)}
                className="btn-cyber-primary" 
                style={{ flex: 1, padding: '8px 0' }}
              >
                View Full Profile
              </button>
              <button 
                onClick={() => setQuickViewSoldier(null)}
                className="btn-cyber" 
                style={{ flex: 1, padding: '8px 0' }}
              >
                Dismiss Modal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
