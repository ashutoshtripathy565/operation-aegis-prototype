import React, { useState, useMemo } from 'react';
import { useAegis } from '../context/AegisContext';
import { 
  Users, AlertTriangle, ShieldAlert, HeartPulse, CheckCircle2, 
  Search, Sliders, Activity, Info, AlertOctagon, X, UserX
, CheckCircle} from 'lucide-react';

export default function WellnessDashboard() {
  const { getWelfareReviewData, updateWelfareReviewStatus } = useAegis();
  const soldiers = getWelfareReviewData();
  const [selectedSoldier, setSelectedSoldier] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Aggregate wellness stats
  const stats = useMemo(() => {
    let low = 0, moderate = 0, elevated = 0, high = 0, critical = 0;
    
    soldiers.forEach(s => {
      if (!s.wellness) return;
      const band = s.wellness.welfareRisk;
      if (band === 'LOW RISK') low++;
      else if (band === 'MODERATE RISK') moderate++;
      else if (band === 'ELEVATED RISK') elevated++;
      else if (band === 'HIGH RISK') high++;
      else if (band === 'CRITICAL WELFARE RISK') critical++;
    });
    
    return { total: soldiers.length, low, moderate, elevated, high, critical };
  }, [soldiers]);
  
  // Filtered personnel
  const filteredSoldiers = useMemo(() => {
    return soldiers.filter(s => {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.serviceNumber.toLowerCase().includes(q);
    });
  }, [soldiers, searchQuery]);

  // Visual Risk Color Mapping
  const getRiskColor = (band) => {
    switch (band) {
      case 'CRITICAL WELFARE RISK': return 'var(--status-critical)';
      case 'HIGH RISK': return 'var(--status-recovery)'; // Orange-ish
      case 'ELEVATED RISK': return 'var(--status-monitor)'; // Yellow-ish
      case 'MODERATE RISK': return 'var(--status-teal)'; // Teal/Blue-ish
      case 'LOW RISK': return 'var(--status-ready)';
      default: return 'var(--text-muted)';
    }
  };

  const getRiskBg = (band) => {
    switch (band) {
      case 'CRITICAL WELFARE RISK': return 'rgba(220, 38, 38, 0.1)';
      case 'HIGH RISK': return 'rgba(234, 88, 12, 0.1)';
      case 'ELEVATED RISK': return 'rgba(217, 119, 6, 0.1)';
      case 'MODERATE RISK': return 'rgba(2, 132, 199, 0.1)';
      case 'LOW RISK': return 'rgba(22, 163, 74, 0.1)';
      default: return 'var(--bg-tertiary)';
    }
  };

  const handleFlagReview = (e, soldierId, currentStatus) => {
    e.stopPropagation();
    const newStatus = currentStatus === 'Review Recommended' ? 'Under Review' : 
                      currentStatus === 'Under Review' ? 'Not Reviewed' : 'Review Recommended';
    updateWelfareReviewStatus(soldierId, newStatus);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Privacy Header Notice */}
      <div className="glass-panel" style={{ 
        padding: '12px 20px', 
        background: 'rgba(2, 132, 199, 0.05)', 
        borderColor: 'var(--status-teal)',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <Info size={18} color="var(--status-teal)" />
        <span style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
          <strong>WELFARE SUPPORT SYSTEM:</strong> Welfare risk indicators are intended to support early assistance and preventive welfare action. They are not medical or psychological diagnoses.
        </span>
      </div>

      {/* Top Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Total Monitored</span>
            <Users size={16} color="var(--accent-cyan)" />
          </div>
          <h2 className="text-mono" style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total}</h2>
        </div>
        
        <div className="glass-panel" style={{ padding: '20px', borderColor: getRiskColor('LOW RISK') }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Low Risk</span>
            <CheckCircle2 size={16} color={getRiskColor('LOW RISK')} />
          </div>
          <h2 className="text-mono" style={{ fontSize: '24px', fontWeight: 'bold', color: getRiskColor('LOW RISK') }}>{stats.low}</h2>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderColor: getRiskColor('MODERATE RISK') }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Moderate Risk</span>
            <Activity size={16} color={getRiskColor('MODERATE RISK')} />
          </div>
          <h2 className="text-mono" style={{ fontSize: '24px', fontWeight: 'bold', color: getRiskColor('MODERATE RISK') }}>{stats.moderate}</h2>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderColor: getRiskColor('HIGH RISK') }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>High Risk</span>
            <AlertTriangle size={16} color={getRiskColor('HIGH RISK')} />
          </div>
          <h2 className="text-mono" style={{ fontSize: '24px', fontWeight: 'bold', color: getRiskColor('HIGH RISK') }}>{stats.high}</h2>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderColor: getRiskColor('CRITICAL WELFARE RISK'), background: getRiskBg('CRITICAL WELFARE RISK') }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Critical Concern</span>
            <AlertOctagon size={16} color={getRiskColor('CRITICAL WELFARE RISK')} />
          </div>
          <h2 className="text-mono" style={{ fontSize: '24px', fontWeight: 'bold', color: getRiskColor('CRITICAL WELFARE RISK') }}>{stats.prstical}</h2>
        </div>
      </div>

      {/* Risk Distribution Bar */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 className="text-mono" style={{ fontSize: '14px', marginBottom: 16, color: 'var(--text-primary)' }}>WELFARE RISK DISTRIBUTION</h3>
        <div style={{ display: 'flex', height: '24px', width: '100%', borderRadius: '4px', overflow: 'hidden', gap: '2px', background: 'var(--bg-tertiary)' }}>
          {stats.total > 0 && (
            <>
              {stats.low > 0 && <div style={{ width: `${(stats.low/stats.total)*100}%`, background: getRiskColor('LOW RISK') }} title={`Low Risk: ${stats.low}`}></div>}
              {stats.moderate > 0 && <div style={{ width: `${(stats.moderate/stats.total)*100}%`, background: getRiskColor('MODERATE RISK') }} title={`Moderate Risk: ${stats.moderate}`}></div>}
              {stats.elevated > 0 && <div style={{ width: `${(stats.elevated/stats.total)*100}%`, background: getRiskColor('ELEVATED RISK') }} title={`Elevated Risk: ${stats.elevated}`}></div>}
              {stats.high > 0 && <div style={{ width: `${(stats.high/stats.total)*100}%`, background: getRiskColor('HIGH RISK') }} title={`High Risk: ${stats.high}`}></div>}
              {stats.prstical > 0 && <div style={{ width: `${(stats.prstical/stats.total)*100}%`, background: getRiskColor('CRITICAL WELFARE RISK') }} title={`Critical Welfare Risk: ${stats.prstical}`}></div>}
            </>
          )}
        </div>
      </div>

      {/* Personnel Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 className="text-mono" style={{ fontSize: '14px', color: 'var(--text-primary)' }}>PERSONNEL WELFARE REGISTER</h3>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '6px 12px', width: '300px' }}>
            <Search size={14} style={{ color: 'var(--text-muted)', marginRight: 8 }} />
            <input 
              type="text" 
              placeholder="Search personnel..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', width: '100%', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 16px', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }} className="text-mono">Service No.</th>
                <th style={{ padding: '12px 16px', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }} className="text-mono">Rank & Name</th>
                <th style={{ padding: '12px 16px', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }} className="text-mono">Welfare Risk</th>
                <th style={{ padding: '12px 16px', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }} className="text-mono">Score / Confidence</th>
                <th style={{ padding: '12px 16px', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }} className="text-mono">Key Factor</th>
                <th style={{ padding: '12px 16px', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }} className="text-mono">Review Status</th>
                <th style={{ padding: '12px 16px', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }} className="text-mono">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSoldiers.map(soldier => {
                const w = soldier.wellness || {};
                const rStatus = soldier.welfareReviewStatus || 'Not Reviewed';
                const keyFactor = (pred.contributingFactors && pred.contributingFactors.length > 0) ? pred.contributingFactors[0].factor : 'None detected';
                
                return (
                  <tr 
                    key={soldier.id} 
                    style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background 0.2s' }}
                    className="hover-row"
                    onClick={() => setSelectedSoldier(soldier)}
                  >
                    <td style={{ padding: '12px 16px', fontSize: '13px' }} className="text-mono">{soldier.serviceNumber}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}><strong>{soldier.rank}</strong> {soldier.name}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ 
                        display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold',
                        background: getRiskBg(w.welfareRisk), color: getRiskColor(w.welfareRisk) 
                      }} className="text-mono">
                        {pred.riskBand || w.welfareRisk || 'UNKNOWN'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                      <span className="text-mono" style={{ color: getRiskColor(w.welfareRisk) }}>{pred.riskScore || w.stressScore}/100</span>
                      <span className="text-mono" style={{ color: 'var(--text-muted)', marginLeft: 8, fontSize: '11px' }}>({pred.confidence || w.confidence}% conf)</span>
                      <span className="text-mono" style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '11px', marginTop: 4 }}>Trend: {pred.direction || 'UNKNOWN'}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{keyFactor}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                      <span style={{ color: rStatus === 'Not Reviewed' ? 'var(--text-muted)' : rStatus === 'Under Review' ? 'var(--status-teal)' : 'var(--status-monitor)' }}>
                        {rStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {(pred.riskBand === 'HIGH' || pred.riskBand === 'CRITICAL' || w.welfareRisk === 'HIGH RISK' || w.welfareRisk === 'CRITICAL WELFARE RISK') && (
                        <button 
                          className="btn-cyber" 
                          style={{ fontSize: '11px', padding: '4px 10px', borderColor: 'var(--status-monitor)', color: 'var(--status-monitor)' }}
                          onClick={(e) => handleFlagReview(e, soldier.id, rStatus)}
                        >
                          {rStatus === 'Not Reviewed' ? 'Flag for Review' : 'Update Status'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredSoldiers.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No personnel found matching the search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail View Modal */}
      {selectedSoldier && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div className="glass-panel" style={{
            width: '800px',
            maxHeight: '90vh',
            background: 'var(--bg-primary)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
              <div>
                <h2 className="text-mono" style={{ fontSize: '18px', color: 'var(--text-primary)' }}>WELFARE PROFILE: {selectedSoldier.rank} {selectedSoldier.name}</h2>
                <span className="text-mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: {selectedSoldier.serviceNumber} | Assignment: {selectedSoldier.currentAssignment}</span>
              </div>
              <button onClick={() => setSelectedSoldier(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Risk Summary */}
              <div className="glass-panel" style={{ padding: '20px', borderColor: getRiskColor(selectedSoldier.wellness?.welfareRisk), background: getRiskBg(selectedSoldier.wellness?.welfareRisk) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 className="text-mono" style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 8 }}>OVERALL WELFARE RISK</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                      <span className="text-mono" style={{ fontSize: '28px', fontWeight: 'bold', color: getRiskColor(selectedSoldier.wellness?.welfareRisk) }}>
                        {selectedSoldier.wellness?.welfareRisk || 'UNKNOWN'}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="text-mono" style={{ fontSize: '20px', color: getRiskColor(selectedSoldier.wellness?.welfareRisk) }}>{selectedSoldier.wellness?.stressScore} / 100</div>
                    <div className="text-mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Confidence: {selectedSoldier.wellness?.confidence}%</div>
                  </div>
                </div>
              </div>

              {/* Longitudinal Trend (STEP 9) */}
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

              {/* Factors */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Contributing Factors */}
                <div className="glass-panel" style={{ padding: '16px' }}>
                  <h4 className="text-mono" style={{ fontSize: '12px', color: 'var(--status-monitor)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertTriangle size={14} /> CONTRIBUTING RISK FACTORS
                  </h4>
                  {selectedSoldier.wellness?.contributingFactors?.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {selectedSoldier.wellness.contributingFactors.map((f, i) => (
                        <li key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          <strong style={{ color: 'var(--text-primary)' }}>{f.factor}:</strong> {f.description}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No significant contributing risk factors detected.</span>
                  )}
                </div>

                {/* Protective Factors */}
                <div className="glass-panel" style={{ padding: '16px' }}>
                  <h4 className="text-mono" style={{ fontSize: '12px', color: 'var(--status-ready)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShieldAlert size={14} /> PROTECTIVE INDICATORS
                  </h4>
                  {selectedSoldier.wellness?.protectiveFactors?.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {selectedSoldier.wellness.protectiveFactors.map((f, i) => (
                        <li key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          <strong style={{ color: 'var(--text-primary)' }}>{f.factor}:</strong> {f.description}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No protective indicators detected based on available data.</span>
                  )}
                </div>
              </div>

              {/* Supporting Indicators Overview */}
              <div className="glass-panel" style={{ padding: '16px' }}>
                <h4 className="text-mono" style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: 16 }}>SUPPORTING OPERATIONAL INDICATORS</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>Duty Workload (Avg)</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{selectedSoldier.workload?.averageWeeklyDutyHours || '--'} hrs/week</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>Consecutive Duty Days</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{selectedSoldier.workload?.consecutiveDutyDays || '--'} days</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>Days Since Last Leave</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{selectedSoldier.leaveHistory?.daysSinceLastLeave || '--'} days</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>Recent Operational Exposure</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{selectedSoldier.deploymentHistory?.daysDeployedLast12Months || '--'} days (last 12mo)</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>Night Duties (Last 30 days)</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{selectedSoldier.workload?.nightDutiesLast30Days || '--'} shifts</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>Composite Readiness (Proxy)</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{selectedSoldier.prs || '--'} / 100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
