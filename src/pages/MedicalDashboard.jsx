import React, { useState } from 'react';
import { useAegis } from '../context/AegisContext';
import { getSoldierBaselines } from '../utils/baselineEngine';
import { generateIntelligence } from '../utils/wellbeingIntelligence';
import {
  Heart, Activity, AlertTriangle, ShieldAlert, Check, RefreshCw,
  UserCheck, FileWarning, Clock, CheckCircle2, Eye, Clipboard, TrendingUp, TrendingDown, Minus
} from 'lucide-react';

function MedicalTrendRow({ label, data }) {
  if (data.status === 'INSUFFICIENT_DATA') {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)', fontSize: '12px' }}>
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span className="text-mono" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>INSUFFICIENT DATA ({data.count} obs)</span>
      </div>
    );
  }

  let dirIcon = <Minus size={12} style={{ color: 'var(--text-muted)' }} />;
  let dirColor = 'var(--text-muted)';
  if (data.direction === 'IMPROVING') { dirIcon = <TrendingUp size={12} />; dirColor = 'var(--status-ready)'; }
  else if (data.direction === 'DECLINING') { dirIcon = <TrendingDown size={12} />; dirColor = 'var(--status-monitor)'; }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 'bold' }}>{label}</span>
        <div className="text-mono" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '10px', color: dirColor }}>
          {dirIcon} {data.direction}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', fontSize: '11px', color: 'var(--text-secondary)' }}>
        <div>Base: <strong className="text-mono" style={{ color: 'var(--text-primary)' }}>{data.baseline}</strong></div>
        <div>Latest: <strong className="text-mono" style={{ color: 'var(--text-primary)' }}>{data.latest}</strong></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Change: <strong className="text-mono" style={{ color: dirColor }}>{data.changeAbs > 0 ? '+' : ''}{data.changeAbs} ({data.changeAbs > 0 ? '+' : ''}{data.changePct}%)</strong></span>
          {data.persistence !== 'none' && (
            <span className="text-mono" style={{ fontSize: '9px', background: 'var(--bg-secondary)', padding: '2px 4px', borderRadius: 3 }}>
              {data.persistence}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Severity helpers ──────────────────────────────────────────────────────────
const sevColor = (sev) =>
  sev === 'critical' ? 'var(--status-critical)' : 'var(--status-monitor)';

const sevBg = (sev) =>
  sev === 'critical' ? 'rgba(220,38,38,0.05)' : 'rgba(217,119,6,0.05)';

// Render a single sensor row, coloured if value is real vs placeholder
function SensorRow({ label, value, unit, flagColor }) {
  const isReal = value !== null && value !== undefined;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <strong
        className="text-mono"
        style={{ color: flagColor || (isReal ? 'var(--text-primary)' : 'var(--text-muted)') }}
      >
        {isReal ? `${value} ${unit}` : '— (no sync)'}
      </strong>
    </div>
  );
}

export default function MedicalDashboard() {
  // history is the SINGLE source of truth — same array Soldier writes to
  const {
    history,
    getMedicalData, updateMedicalCategory,
    biometricComplaints, resolveBiometricComplaint,
    followUpCases, updateFollowUpCase
  } = useAegis();

  const soldiers = getMedicalData() || [];
  const [activeTab, setActiveTab] = useState('register'); // 'register' | 'complaints' | 'queue'
  const [selectedSoldierId, setSelectedSoldierId] = useState(null);
  const [restrictionNote, setRestrictionNote] = useState('');
  const [selectedFollowUpId, setSelectedFollowUpId] = useState(null);
  const [followUpNote, setFollowUpNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');

  // Soldiers with elevated welfare risk or active alerts
  const flaggedSoldiers = soldiers.filter(s =>
    s.wellness?.welfareRisk === 'CRITICAL WELFARE RISK' ||
    s.wellness?.welfareRisk === 'HIGH RISK' ||
    (s.alerts && s.alerts.length > 0)
  );

  // Open complaints count for badge
  const openComplaints = biometricComplaints.filter(c => c.status === 'open');

  const handleClearSoldier = (soldierId) => {
    updateMedicalCategory(soldierId, 'FE (Forward Area Eligible)', 'Available',
      'Medical officer cleared for full duties');
    alert('Soldier cleared for active forward operations.');
  };

  const handleRestrictSoldier = (soldierId, category, status) => {
    if (!restrictionNote) {
      alert('Please enter restriction notes in the field below.');
      return;
    }
    updateMedicalCategory(soldierId, category, status, restrictionNote);
    alert(`Soldier placed on restriction: ${category}`);
    setRestrictionNote('');
  };

  const handleResolveComplaint = (id, newStatus) => {
    if (!resolutionNote.trim()) {
      alert('Please enter a resolution / clinical note before updating.');
      return;
    }
    resolveBiometricComplaint(id, newStatus, resolutionNote);
    setResolutionNote('');
    setSelectedComplaintId(null);
  };

  // Get selected patient record
  const selectedPatient = selectedSoldierId ? soldiers.find(s => s.id === selectedSoldierId) : null;

  // Get this patient's wellbeing history from the global history state (same source Soldier writes to)
  const patientHistory = selectedSoldierId
    ? history.filter(h => h.soldierId === selectedSoldierId)
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Tab bar */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={() => setActiveTab('register')}
          className={activeTab === 'register' ? 'btn-cyber-primary' : 'btn-cyber'}
        >
          Medical Review Register
        </button>
        <button
          onClick={() => setActiveTab('complaints')}
          className={activeTab === 'complaints' ? 'btn-cyber-primary' : 'btn-cyber'}
          style={{ position: 'relative' }}
        >
          Wearable Complaints
          {openComplaints.length > 0 && (
            <span style={{
              marginLeft: 8,
              background: 'var(--status-critical)',
              color: '#fff',
              borderRadius: '10px',
              padding: '1px 7px',
              fontSize: '10px',
              fontWeight: 'bold'
            }}>
              {openComplaints.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('queue')}
          className={activeTab === 'queue' ? 'btn-cyber-primary' : 'btn-cyber'}
          style={{ position: 'relative' }}
        >
          Aegis Follow-Up Queue
          {followUpCases.filter(c => c.status !== 'RESOLVED').length > 0 && (
            <span style={{
              marginLeft: 8,
              background: 'var(--status-critical)',
              color: '#fff',
              borderRadius: '10px',
              padding: '1px 7px',
              fontSize: '10px',
              fontWeight: 'bold'
            }}>
              {followUpCases.filter(c => c.status !== 'RESOLVED').length}
            </span>
          )}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          TAB 1 — MEDICAL REVIEW REGISTER
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'register' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>

          {/* LEFT — soldier selector + wellbeing history + sensor telemetry */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ALL PERSONNEL selector */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 className="text-mono" style={{ fontSize: '13px', marginBottom: 14, textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
                SELECT PERSONNEL — VIEW WELLBEING HISTORY
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {soldiers.map(s => {
                  const welfareRisk = s.wellness?.welfareRisk || 'UNKNOWN';
                  const riskColor =
                    welfareRisk === 'CRITICAL WELFARE RISK' ? 'var(--status-critical)' :
                    welfareRisk === 'HIGH RISK' ? 'var(--status-monitor)' :
                    welfareRisk === 'MONITOR' ? '#d97706' : 'var(--status-ready)';
                  const selected = selectedSoldierId === s.id;
                  const checkinCount = history.filter(h => h.soldierId === s.id).length;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedSoldierId(s.id)}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '10px 14px', borderRadius: '4px', cursor: 'pointer',
                        background: selected ? 'var(--accent-cyan-glow)' : 'var(--bg-primary)',
                        border: `1px solid ${selected ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                        transition: 'background 0.15s, border-color 0.15s'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{s.rank} {s.name}</span>
                        <span className="text-mono" style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: 8 }}>{s.serviceNumber}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span className="text-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          {checkinCount} check-in{checkinCount !== 1 ? 's' : ''}
                        </span>
                        <span className="text-mono" style={{
                          fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                          border: `1px solid ${riskColor}`, color: riskColor
                        }}>
                          {welfareRisk}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* WELLBEING HISTORY — from global history state, filtered by soldierId */}
            {selectedPatient && (
              <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Activity size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <h4 className="text-mono" style={{ margin: 0, color: 'var(--accent-cyan)', textTransform: 'uppercase', fontSize: '13px' }}>
                    Wellbeing History — {selectedPatient.rank} {selectedPatient.name}
                  </h4>
                  <span className="text-mono" style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                    SOURCE: SOLDIER-PROVIDED
                  </span>
                </div>

                {patientHistory.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '12px 0', textAlign: 'center' }}>
                    No self-reported wellbeing records found for this soldier.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: '320px', overflowY: 'auto' }}>
                    {patientHistory.map(h => {
                      const isCog = h.category === 'cognitive_assessment';
                      
                      return (
                        <div key={h.id} style={{
                          padding: '12px', background: 'var(--bg-primary)', borderRadius: '4px',
                          borderLeft: h.source === 'SOLDIER' ? '3px solid var(--accent-cyan)' : '3px solid var(--text-muted)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              {new Date(h.timestamp).toLocaleString()}
                            </span>
                            <span className="text-mono" style={{
                              fontSize: '9px', padding: '2px 6px', borderRadius: '4px',
                              background: 'var(--bg-secondary)', color: 'var(--text-muted)'
                            }}>
                              SOURCE: {h.source} · {isCog ? 'COGNITIVE ASSESSMENT' : 'WELLBEING CHECK-IN'}
                            </span>
                          </div>
                          
                          {isCog ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, fontSize: '12px' }}>
                              <div><span style={{ color: 'var(--text-muted)' }}>Reaction:</span> <strong>{h.results?.reactionTime?.score ?? 'N/A'}</strong></div>
                              <div><span style={{ color: 'var(--text-muted)' }}>Attention:</span> <strong>{h.results?.attention?.score ?? 'N/A'}%</strong></div>
                              <div><span style={{ color: 'var(--text-muted)' }}>Memory:</span> <strong>{h.results?.workingMemory?.score ?? 'N/A'}%</strong></div>
                              <div><span style={{ color: 'var(--text-muted)' }}>Speed:</span> <strong>{h.results?.processingSpeed?.score ?? 'N/A'}</strong></div>
                              <div><span style={{ color: 'var(--text-muted)' }}>Flexibility:</span> <strong>{h.results?.cognitiveFlexibility?.score ?? 'N/A'}%</strong></div>
                            </div>
                          ) : (
                            <>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, fontSize: '12px' }}>
                                <div><span style={{ color: 'var(--text-muted)' }}>Stress:</span> <strong>{h.values?.stressScore ?? h.stressScore ?? 'N/A'}</strong></div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Fatigue:</span> <strong>{h.values?.fatigueScore ?? h.fatigueScore ?? 'N/A'}</strong></div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Sleep:</span> <strong>{h.values?.sleepQualityScore ?? h.sleepQualityScore ?? 'N/A'}</strong></div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Mood:</span> <strong>{h.values?.moodScore ?? 'N/A'}</strong></div>
                              </div>
                              {h.values?.comment && (
                                <div style={{ marginTop: 8, fontSize: '11px', fontStyle: 'italic', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: 6 }}>
                                  "{h.values.comment}"
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* AEGIS WELLBEING ASSESSMENT (INTELLIGENCE LAYER) */}
            {selectedPatient && (() => {
              const baselines = getSoldierBaselines(history, selectedPatient.id);
              const intel = generateIntelligence(selectedPatient.id, history, baselines);
              
              let statusColor = 'var(--text-muted)';
              if (intel.status === 'URGENT_HUMAN_REVIEW') statusColor = 'var(--status-critical)';
              else if (intel.status === 'ATTENTION_RECOMMENDED') statusColor = 'var(--status-monitor)';
              else if (intel.status === 'MONITOR') statusColor = 'var(--status-monitor)';
              else if (intel.status === 'STABLE') statusColor = 'var(--status-ready)';
              
              return (
                <div className="glass-panel" style={{ padding: '20px', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <ShieldAlert size={16} style={{ color: statusColor }} />
                    <h4 className="text-mono" style={{ margin: 0, color: statusColor, textTransform: 'uppercase', fontSize: '13px' }}>
                      AEGIS INTELLIGENCE FINDING
                    </h4>
                    <span className="text-mono" style={{ marginLeft: 'auto', fontSize: '10px', padding: '2px 8px', borderRadius: 4, background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                      CONFIDENCE: {intel.confidence}
                    </span>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: 4 }} className="text-mono">RECOMMENDED ACTION (HUMAN REVIEW REQUIRED)</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: statusColor }}>{intel.status.replace(/_/g, ' ')}</div>
                    {intel.multiDomainConvergence && (
                      <div className="text-mono" style={{ fontSize: '10px', color: 'var(--status-critical)', marginTop: 4 }}>* MULTI-DOMAIN CONVERGENCE DETECTED</div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div>
                      <h5 className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: 8 }}>EVIDENCE & KEY CHANGES</h5>
                      {intel.evidence.length === 0 ? (
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No significant changes detected.</div>
                      ) : (
                        <ul style={{ margin: 0, paddingLeft: 16, fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                          {intel.evidence.map((ev, i) => <li key={i}>{ev}</li>)}
                        </ul>
                      )}
                    </div>
                    <div>
                      <h5 className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: 8 }}>PROTECTIVE FACTORS</h5>
                      {intel.protectiveFactors.length === 0 ? (
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No notable protective factors observed.</div>
                      ) : (
                        <ul style={{ margin: 0, paddingLeft: 16, fontSize: '12px', color: 'var(--status-ready)', lineHeight: 1.5 }}>
                          {intel.protectiveFactors.map((pf, i) => <li key={i}>{pf}</li>)}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-color)', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Data Completeness: {intel.completeness.wellbeing} Wellbeing Obs / {intel.completeness.cognitive} Cognitive Obs
                  </div>
                </div>
              );
            })()}

            {/* LONGITUDINAL TRENDS */}
            {selectedPatient && (() => {
              const baselines = getSoldierBaselines(history, selectedPatient.id);
              return (
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <Activity size={16} style={{ color: 'var(--accent-cyan)' }} />
                    <h4 className="text-mono" style={{ margin: 0, color: 'var(--accent-cyan)', textTransform: 'uppercase', fontSize: '13px' }}>
                      Longitudinal Trends &amp; Personal Baselines
                    </h4>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <div>
                      <h5 className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: 8 }}>WELLBEING</h5>
                      <MedicalTrendRow label="Reported Stress" data={baselines.wellbeing.stress} />
                      <MedicalTrendRow label="Physical Fatigue" data={baselines.wellbeing.fatigue} />
                      <MedicalTrendRow label="Sleep Quality" data={baselines.wellbeing.sleep} />
                      <MedicalTrendRow label="Mental Mood" data={baselines.wellbeing.mood} />
                    </div>
                    <div>
                      <h5 className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: 8 }}>COGNITIVE</h5>
                      <MedicalTrendRow label="Reaction Time" data={baselines.cognitive.reactionTime} />
                      <MedicalTrendRow label="Attention" data={baselines.cognitive.attention} />
                      <MedicalTrendRow label="Working Memory" data={baselines.cognitive.workingMemory} />
                      <MedicalTrendRow label="Processing Speed" data={baselines.cognitive.processingSpeed} />
                      <MedicalTrendRow label="Cognitive Flexibility" data={baselines.cognitive.cognitiveFlexibility} />
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Clinical Telemetry Panel — live watch data */}
            {selectedPatient && (() => {
              const wr = selectedPatient.lastWatchReadings || null;
              const hrFlag = wr?.restingHeartRate != null && (wr.restingHeartRate >= 100 || wr.restingHeartRate <= 45)
                ? 'var(--status-critical)'
                : wr?.restingHeartRate != null && wr.restingHeartRate >= 80 ? 'var(--status-monitor)' : null;
              const spo2Val = wr?.spO2 != null ? parseFloat(wr.spO2) : null;
              const spo2Flag = spo2Val != null && spo2Val <= 90 ? 'var(--status-critical)'
                : spo2Val != null && spo2Val <= 95 ? 'var(--status-monitor)' : null;
              const hrvFlag = wr?.hrv != null && wr.hrv <= 20 ? 'var(--status-critical)'
                : wr?.hrv != null && wr.hrv <= 30 ? 'var(--status-monitor)' : null;
              const sleepVal = wr?.sleepHours != null ? parseFloat(wr.sleepHours) : null;
              const sleepFlag = sleepVal != null && sleepVal <= 4 ? 'var(--status-critical)'
                : sleepVal != null && sleepVal <= 5 ? 'var(--status-monitor)' : null;

              return (
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 className="text-mono" style={{ fontSize: '13px', textTransform: 'uppercase' }}>
                      CLINICAL TELEMETRY: {selectedPatient.name}
                    </h3>
                    {wr ? (
                      <span className="text-mono" style={{ fontSize: '10px', padding: '2px 8px', border: '1px solid var(--status-ready)', color: 'var(--status-ready)', borderRadius: '4px' }}>
                        LIVE WATCH DATA · {new Date(wr.syncedAt).toLocaleTimeString()}
                      </span>
                    ) : (
                      <span className="text-mono" style={{ fontSize: '10px', padding: '2px 8px', border: '1px solid var(--text-muted)', color: 'var(--text-muted)', borderRadius: '4px' }}>
                        NO SYNC YET
                      </span>
                    )}
                  </div>

                  <div className="glass-panel" style={{ padding: '16px', background: 'var(--bg-primary)' }}>
                    <h4 className="text-mono" style={{ fontSize: '11px', color: 'var(--accent-cyan)', marginBottom: 12 }}>
                      SENSOR HEURISTICS {wr && <span style={{ color: 'var(--status-ready)' }}>● LIVE</span>}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <SensorRow label="Resting Heart Rate" value={wr?.restingHeartRate ?? null} unit="BPM" flagColor={hrFlag} />
                      <SensorRow label="Heart Rate Variability (HRV)" value={wr?.hrv ?? null} unit="ms" flagColor={hrvFlag} />
                      <SensorRow label="Blood Oxygen (SpO₂)" value={spo2Val} unit="%" flagColor={spo2Flag} />
                      <SensorRow label="Sleep Duration" value={sleepVal} unit="hrs" flagColor={sleepFlag} />
                      {wr?.totalSteps != null && (
                        <SensorRow label="Step Count" value={wr.totalSteps.toLocaleString()} unit="" flagColor={null} />
                      )}
                    </div>
                  </div>

                  {/* Active alerts */}
                  {selectedPatient.alerts && selectedPatient.alerts.length > 0 && (
                    <div style={{
                      marginTop: 16,
                      background: 'rgba(220,38,38,0.05)',
                      border: '1px solid var(--status-critical)',
                      borderRadius: '4px', padding: '12px 16px',
                      color: 'var(--status-critical)', fontSize: '13px',
                      display: 'flex', gap: 10, alignItems: 'start'
                    }}>
                      <ShieldAlert size={16} style={{ marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <strong>Active Medical Warnings:</strong>
                        <ul style={{ paddingLeft: 16, marginTop: 4 }}>
                          {selectedPatient.alerts.map((al, i) => <li key={i}>{al}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
          {/* /Left */}

          {/* RIGHT — Clinical Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Flagged list */}
            {flaggedSoldiers.length > 0 && (
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h4 className="text-mono" style={{ fontSize: '12px', marginBottom: 12, textTransform: 'uppercase', color: 'var(--status-critical)' }}>
                  ⚠️ REVIEW REQUIRED
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {flaggedSoldiers.map(s => (
                    <div
                      key={s.id}
                      onClick={() => setSelectedSoldierId(s.id)}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '8px 12px', borderRadius: '4px', cursor: 'pointer',
                        background: selectedSoldierId === s.id ? 'rgba(220,38,38,0.08)' : 'var(--bg-primary)',
                        border: '1px solid var(--status-critical)'
                      }}
                    >
                      <span style={{ fontSize: '13px' }}>{s.rank} {s.name}</span>
                      <span className="text-mono" style={{ fontSize: '10px', color: 'var(--status-critical)' }}>
                        {s.wellness?.welfareRisk || 'FLAGGED'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clinical Intervention panel */}
            {selectedPatient ? (
              <div className="glass-panel-glow" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <UserCheck size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <h4 className="text-mono" style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
                    Clinical Intervention
                  </h4>
                </div>
                <div style={{ marginBottom: 12, fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Patient: <strong style={{ color: 'var(--text-primary)' }}>{selectedPatient.rank} {selectedPatient.name}</strong><br/>
                  <span className="text-mono" style={{ fontSize: '10px' }}>{selectedPatient.serviceNumber} · {selectedPatient.medicalCategory}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                      CLINICAL OBSERVATION NOTES
                    </label>
                    <textarea
                      className="input-cyber"
                      value={restrictionNote}
                      onChange={e => setRestrictionNote(e.target.value)}
                      placeholder="Enter medical observations, recovery notes, etc."
                      style={{ width: '100%', height: '80px', fontFamily: 'inherit', fontSize: '13px', resize: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <button onClick={() => handleClearSoldier(selectedPatient.id)} className="btn-cyber-primary" style={{ width: '100%' }}>
                      Clear for Duty (FE Status)
                    </button>
                    <button
                      onClick={() => handleRestrictSoldier(selectedPatient.id, 'LE (Light Duty Eligible)', 'Under Observation')}
                      className="btn-cyber"
                      style={{ width: '100%', borderColor: 'var(--status-monitor)', color: 'var(--status-monitor)' }}
                    >
                      Restrict to Light Duty (LE)
                    </button>
                    <button
                      onClick={() => handleRestrictSoldier(selectedPatient.id, 'MO (Medical Observation)', 'Medical Review')}
                      className="btn-cyber"
                      style={{ width: '100%', borderColor: 'var(--status-critical)', color: 'var(--status-critical)' }}
                    >
                      Restrict to Base (MO Status)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                Select a soldier from the list on the left to initialize clinical intervention tasks.
              </div>
            )}

            {/* Security disclaimer */}
            <div className="glass-panel" style={{ padding: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <h5 className="text-mono" style={{ marginBottom: 6 }}>COMSEC CLINICAL DATA POLICY</h5>
              Telemetry metrics displayed in this environment are classified level 4 medical records and subject to
              restricted RBAC clearance policies. De-identification is mandatory.
            </div>
          </div>
          {/* /Right */}

        </div>
      )}
      {/* /TAB 1 */}

      {/* ══════════════════════════════════════════════════════════════════
          TAB 2 — WEARABLE COMPLAINTS
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'complaints' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>

          {/* Left: complaint list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 className="text-mono" style={{ fontSize: '14px', marginBottom: 16, textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
                BIOMETRIC COMPLAINT QUEUE
              </h3>

              {biometricComplaints.length === 0 ? (
                <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  <FileWarning size={32} style={{ marginBottom: 10, opacity: 0.4 }} />
                  <div>No biometric complaints have been raised yet.</div>
                  <div style={{ marginTop: 6, fontSize: '11px' }}>
                    Complaints appear here when soldiers raise them after a watch sync.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {biometricComplaints.map(c => {
                    const hasCritical = c.violations.some(v => v.severity === 'critical');
                    const isSelected = selectedComplaintId === c.id;
                    const statusColor = c.status === 'open'
                      ? 'var(--status-critical)'
                      : c.status === 'reviewed' ? 'var(--status-monitor)' : 'var(--status-ready)';
                    return (
                      <div
                        key={c.id}
                        onClick={() => { setSelectedComplaintId(c.id); setResolutionNote(''); }}
                        className="glass-panel"
                        style={{
                          padding: '14px 16px', cursor: 'pointer',
                          background: isSelected ? 'var(--accent-cyan-glow)' : 'var(--bg-secondary)',
                          borderColor: isSelected ? 'var(--accent-cyan)' : hasCritical ? 'var(--status-critical)' : 'var(--border-color)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: 3 }}>
                              {c.rank} {c.soldierName}
                              {hasCritical && (
                                <span style={{ marginLeft: 8, fontSize: '9px', padding: '2px 6px', background: 'rgba(220,38,38,0.08)', border: '1px solid var(--status-critical)', color: 'var(--status-critical)', borderRadius: '4px' }}>
                                  CRITICAL
                                </span>
                              )}
                            </div>
                            <div className="text-mono" style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: 6 }}>
                              {new Date(c.timestamp).toLocaleString()} · {c.deviceName}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {c.violations.map((v, i) => (
                                <span key={i} style={{ fontSize: '10px', padding: '1px 6px', background: sevBg(v.severity), color: sevColor(v.severity), border: `1px solid ${sevColor(v.severity)}`, borderRadius: '3px' }}>
                                  {v.label}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="text-mono" style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', whiteSpace: 'nowrap', border: `1px solid ${statusColor}`, color: statusColor }}>
                            {c.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          {/* /Left */}

          {/* Right: complaint detail + resolution */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {selectedComplaintId ? (() => {
              const c = biometricComplaints.find(x => x.id === selectedComplaintId);
              if (!c) return null;
              const r = c.readings;
              return (
                <>
                  <div className="glass-panel-glow" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                      <Clipboard size={15} style={{ color: 'var(--accent-cyan)' }} />
                      <h4 className="text-mono" style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
                        Complaint Detail
                      </h4>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '12px', marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Raised by:</span>
                        <strong>{c.rank} {c.soldierName}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Device:</span>
                        <strong className="text-mono" style={{ fontSize: '11px' }}>{c.deviceName}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Time:</span>
                        <strong className="text-mono" style={{ fontSize: '11px' }}>{new Date(c.timestamp).toLocaleString()}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Ref ID:</span>
                        <strong className="text-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{c.id}</strong>
                      </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '12px', background: 'var(--bg-primary)', marginBottom: 14 }}>
                      <div className="text-mono" style={{ fontSize: '10px', color: 'var(--accent-cyan)', marginBottom: 8 }}>
                        WATCH READINGS AT COMPLAINT TIME
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: '12px' }}>
                        {r.restingHeartRate != null && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Resting HR</span><strong className="text-mono">{r.restingHeartRate} BPM</strong></div>}
                        {r.spO2 != null && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>SpO₂</span><strong className="text-mono">{r.spO2}%</strong></div>}
                        {r.hrv != null && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>HRV</span><strong className="text-mono">{r.hrv} ms</strong></div>}
                        {r.sleepHours != null && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Sleep</span><strong className="text-mono">{r.sleepHours} hrs</strong></div>}
                        {r.totalSteps != null && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Steps</span><strong className="text-mono">{r.totalSteps.toLocaleString()}</strong></div>}
                      </div>
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <div className="text-mono" style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: 6 }}>THRESHOLD VIOLATIONS</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {c.violations.map((v, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '6px 10px', borderRadius: '4px', background: sevBg(v.severity), borderLeft: `3px solid ${sevColor(v.severity)}` }}>
                            <AlertTriangle size={11} style={{ marginTop: 2, flexShrink: 0, color: sevColor(v.severity) }} />
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{v.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {c.note && (
                      <div style={{ marginBottom: 14 }}>
                        <div className="text-mono" style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: 4 }}>SOLDIER'S NOTE</div>
                        <div style={{ padding: '8px 12px', background: 'var(--bg-primary)', borderRadius: '4px', fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>
                          "{c.note}"
                        </div>
                      </div>
                    )}

                    {c.resolution && (
                      <div style={{ marginBottom: 14 }}>
                        <div className="text-mono" style={{ fontSize: '10px', color: 'var(--status-ready)', marginBottom: 4 }}>MO RESOLUTION</div>
                        <div style={{ padding: '8px 12px', background: 'rgba(22,163,74,0.04)', border: '1px solid var(--status-ready)', borderRadius: '4px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {c.resolution}
                        </div>
                      </div>
                    )}

                    {c.status !== 'resolved' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div>
                          <label className="text-mono" style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                            CLINICAL RESOLUTION / NOTES
                          </label>
                          <textarea
                            className="input-cyber"
                            value={resolutionNote}
                            onChange={e => setResolutionNote(e.target.value)}
                            placeholder="Enter clinical assessment and action taken..."
                            style={{ width: '100%', height: '70px', fontFamily: 'inherit', fontSize: '12px', resize: 'none' }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => handleResolveComplaint(c.id, 'reviewed')} className="btn-cyber" style={{ flex: 1, fontSize: '11px', borderColor: 'var(--status-monitor)', color: 'var(--status-monitor)' }}>
                            <Eye size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                            Mark Reviewed
                          </button>
                          <button onClick={() => handleResolveComplaint(c.id, 'resolved')} className="btn-cyber-primary" style={{ flex: 1, fontSize: '11px' }}>
                            <CheckCircle2 size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                            Resolve &amp; Close
                          </button>
                        </div>
                      </div>
                    )}

                    {c.status === 'resolved' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(22,163,74,0.05)', border: '1px solid var(--status-ready)', borderRadius: '4px' }}>
                        <CheckCircle2 size={14} style={{ color: 'var(--status-ready)' }} />
                        <span className="text-mono" style={{ fontSize: '11px', color: 'var(--status-ready)' }}>Complaint resolved and closed.</span>
                      </div>
                    )}
                  </div>
                </>
              );
            })() : (
              <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                <FileWarning size={24} style={{ marginBottom: 8, opacity: 0.4 }} />
                <div>Select a complaint from the list to review details and take clinical action.</div>
              </div>
            )}
          </div>
          {/* /Right */}

        </div>
      )}
      {/* /TAB 2 */}

      {/* ══════════════════════════════════════════════════════════════════
          TAB 3 — AEGIS FOLLOW-UP QUEUE
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'queue' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
          
          {/* Left: Queue List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 className="text-mono" style={{ fontSize: '14px', marginBottom: 4, textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
                AEGIS INTELLIGENCE WORKFLOW QUEUE
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: 16 }}>
                Longitudinal patterns requiring human review. <strong style={{ color: 'var(--text-primary)' }}>Aegis recommends. A human decides.</strong>
              </p>
              {followUpCases.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>No active Aegis intelligence findings requiring follow-up.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {followUpCases.slice().reverse().map(c => {
                    const isSelected = selectedFollowUpId === c.followUpId;
                    const soldier = soldiers.find(s => s.id === c.soldierId) || {};
                    let priorityColor = 'var(--text-muted)';
                    if (c.priority === 'URGENT_HUMAN_REVIEW') priorityColor = 'var(--status-critical)';
                    else if (c.priority === 'ATTENTION_RECOMMENDED') priorityColor = 'var(--status-monitor)';
                    
                    return (
                      <div 
                        key={c.followUpId}
                        onClick={() => setSelectedFollowUpId(c.followUpId)}
                        style={{
                          padding: '16px',
                          borderRadius: '6px',
                          background: isSelected ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                          border: `1px solid ${isSelected ? priorityColor : 'var(--border-color)'}`,
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                          borderLeft: `4px solid ${priorityColor}`
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{soldier.rank} {soldier.name}</span>
                          <span className="text-mono" style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', color: priorityColor }}>
                            {c.priority.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Status: <strong style={{ color: 'var(--text-primary)' }}>{c.status}</strong>
                          {c.dueDate && ` | Due: ${new Date(c.dueDate).toLocaleString()}`}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Detected: {new Date(c.createdAt).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right: Review & Action Panel */}
          <div>
            {(() => {
              const activeCase = followUpCases.find(c => c.followUpId === selectedFollowUpId);
              if (!activeCase) return (
                <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                  <Clipboard size={24} style={{ marginBottom: 8, opacity: 0.4 }} />
                  <div>Select a case to begin human review and workflow.</div>
                </div>
              );

              const soldier = soldiers.find(s => s.id === activeCase.soldierId) || {};
              return (
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <h3 className="text-mono" style={{ fontSize: '14px', marginBottom: 16, color: 'var(--accent-cyan)' }}>
                    HUMAN REVIEW WORKFLOW
                  </h3>
                  
                  {/* Aegis Findings */}
                  <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '4px', marginBottom: 20 }}>
                    <h4 className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: 8 }}>AEGIS INTELLIGENCE FINDING</h4>
                    <div style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: 8 }}>
                      <strong>Patient:</strong> {soldier.rank} {soldier.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: 8 }}>
                      <strong style={{ color: 'var(--status-monitor)' }}>{activeCase.priority.replace(/_/g, ' ')}</strong>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: '11px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      {activeCase.evidence.map((ev, i) => <li key={i}>{ev}</li>)}
                    </ul>
                  </div>

                  {/* Actions */}
                  {activeCase.status !== 'RESOLVED' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                          REVIEW / CLINICAL NOTE
                        </label>
                        <textarea
                          className="input-cyber"
                          value={followUpNote}
                          onChange={e => setFollowUpNote(e.target.value)}
                          placeholder="Enter your human evaluation..."
                          style={{ width: '100%', height: '80px', fontFamily: 'inherit', fontSize: '12px', resize: 'none' }}
                        />
                      </div>
                      
                      {activeCase.status === 'NEW' && (
                        <button onClick={() => { updateFollowUpCase(activeCase.followUpId, 'ACKNOWLEDGED', followUpNote, undefined, 'Medical Officer'); setFollowUpNote(''); }} className="btn-cyber" style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
                          Acknowledge Case
                        </button>
                      )}
                      
                      <div>
                        <label className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                          SCHEDULE FOLLOW-UP
                        </label>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input type="datetime-local" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} className="input-cyber" style={{ flex: 1, fontSize: '12px' }} />
                          <button onClick={() => { updateFollowUpCase(activeCase.followUpId, 'FOLLOW_UP_SCHEDULED', followUpNote, followUpDate, 'Medical Officer'); setFollowUpNote(''); setFollowUpDate(''); }} className="btn-cyber-primary" style={{ padding: '8px 12px' }}>
                            Schedule
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button onClick={() => { updateFollowUpCase(activeCase.followUpId, 'MONITORING', followUpNote, undefined, 'Medical Officer'); setFollowUpNote(''); }} className="btn-cyber" style={{ flex: 1, fontSize: '11px' }}>
                          Continue Monitoring
                        </button>
                        <button onClick={() => { updateFollowUpCase(activeCase.followUpId, 'RESOLVED', followUpNote, undefined, 'Medical Officer'); setFollowUpNote(''); }} className="btn-cyber" style={{ flex: 1, fontSize: '11px', borderColor: 'var(--status-ready)', color: 'var(--status-ready)' }}>
                          Resolve
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '12px', background: 'rgba(22, 163, 74, 0.05)', border: '1px solid var(--status-ready)', borderRadius: '4px', textAlign: 'center' }}>
                      <CheckCircle2 size={24} style={{ color: 'var(--status-ready)', marginBottom: 8 }} />
                      <div className="text-mono" style={{ fontSize: '12px', color: 'var(--status-ready)' }}>CASE RESOLVED</div>
                    </div>
                  )}

                  {/* Audit Trail */}
                  <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
                    <h4 className="text-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: 12 }}>ACTION HISTORY</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {activeCase.actionHistory.slice().reverse().map((act, i) => (
                        <div key={i} style={{ fontSize: '11px', color: 'var(--text-primary)', borderLeft: '2px solid var(--border-color)', paddingLeft: 8 }}>
                          <div style={{ color: 'var(--text-secondary)', marginBottom: 2 }}>{new Date(act.timestamp).toLocaleString()} • {act.actorRole}</div>
                          <strong>{act.action}</strong>
                          {act.note && <div style={{ fontStyle: 'italic', marginTop: 2 }}>"{act.note}"</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

    </div>
  );
}
