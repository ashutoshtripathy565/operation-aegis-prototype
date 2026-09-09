import React, { useState } from 'react';
import { useAegis } from '../context/AegisContext';
import CognitiveAssessment from '../components/CognitiveAssessment';
import { 
  CheckCircle2, Clock, Calendar, User, ShieldAlert,
  ChevronRight, Brain, Activity, RefreshCw, AlertCircle
} from 'lucide-react';

export default function PersonnelDashboard() {
  const {
    getOwnPersonnelRecord, history, submitWellnessCheckin, followUpCases
  } = useAegis();

  const currentSoldier = getOwnPersonnelRecord();

  // Safe React boundary check
  if (!currentSoldier) {
    return (
      <div style={{ color: 'var(--text-primary)', padding: '24px', textAlign: 'center' }}>
        <RefreshCw size={24} className="spin" style={{ marginBottom: 12 }} />
        <div>Verifying Personnel Credentials...</div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('today'); // 'today', 'assessment', 'followup', 'profile'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cogTab, setCogTab] = useState(false);

  // Ensure arrays exist
  const safeHistory = Array.isArray(history) ? history : [];
  const safeFollowUps = Array.isArray(followUpCases) ? followUpCases : [];

  // Filter history for current soldier
  const soldierHistory = safeHistory.filter(h => h && h.soldierId === currentSoldier.id);

  // Calculate Daily Status safely
  const todayStr = new Date().toDateString();
  
  const todayAssessments = soldierHistory.filter(h => {
    if (!h || !h.timestamp) return false;
    try { return new Date(h.timestamp).toDateString() === todayStr && h.category === 'wellbeing_checkin'; } catch { return false; }
  });
  const isCompletedToday = todayAssessments.length > 0;

  const todayCogAssessments = soldierHistory.filter(h => {
    if (!h || !h.timestamp) return false;
    try { return new Date(h.timestamp).toDateString() === todayStr && h.category === 'cognitive_assessment'; } catch { return false; }
  });
  const isCogCompletedToday = todayCogAssessments.length > 0;

  // Follow-up status
  const scheduledFollowUps = safeFollowUps.filter(c => 
    c && c.soldierId === currentSoldier.id && c.status === 'FOLLOW_UP_SCHEDULED'
  );

  // Medical Notes
  const medicalNotes = safeFollowUps.filter(c => 
    c && c.soldierId === currentSoldier.id && c.clinicalNotes && c.clinicalNotes.length > 0
  );

  // Motivational Message Deterministic Logic
  const getDailyMessage = () => {
    const messages = [
      "Stay steady. One day at a time.",
      "Consistency builds strength.",
      "Take care of yourself and stay mission-ready.",
      "A strong routine starts with small actions.",
      "Stay focused, stay steady.",
      "Your wellbeing matters too."
    ];
    try {
      const start = new Date(new Date().getFullYear(), 0, 0);
      const diff = (new Date() - start) + ((start.getTimezoneOffset() - new Date().getTimezoneOffset()) * 60 * 1000);
      const oneDay = 1000 * 60 * 60 * 24;
      const day = Math.floor(diff / oneDay);
      return messages[day % messages.length] || messages[0];
    } catch {
      return messages[0];
    }
  };

  // Streak Algorithm
  const calculateStreak = () => {
    try {
      const dates = soldierHistory
        .filter(h => h && h.category === 'wellbeing_checkin' && h.timestamp)
        .map(h => new Date(h.timestamp).toDateString());
        
      if (dates.length === 0) return 0;

      const uniqueDates = [...new Set(dates)];
      uniqueDates.sort((a, b) => new Date(b) - new Date(a)); // Newest first

      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      // Check if they missed today, but did yesterday. If they missed > 1 day, streak is 0.
      const newestRecordDate = new Date(uniqueDates[0]);
      newestRecordDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate - newestRecordDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays > 1) {
        return 0; // Streak broken
      }

      let checkDate = newestRecordDate;

      for (let i = 0; i < uniqueDates.length; i++) {
        const recordDate = new Date(uniqueDates[i]);
        recordDate.setHours(0, 0, 0, 0);

        if (recordDate.getTime() === checkDate.getTime()) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      return streak;
    } catch {
      return 0; // Fallback gracefully
    }
  };

  const currentStreak = calculateStreak();

  const getStreakMessage = (streak) => {
    if (streak === 0) return "Complete your first assessment to begin your daily wellbeing record.";
    if (streak === 1) return "Good start. Showing up matters.";
    if (streak <= 3) return `${streak} days strong. Keep the routine going.`;
    if (streak <= 7) return `One week of consistency. That's a solid habit.`;
    return `Your consistency is building a strong daily routine. (${streak} day streak)`;
  };

  // Submission handler
  const handleWellnessSubmit = async (e) => {
    e.preventDefault();
    if (isCompletedToday || isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const stress = parseInt(formData.get('stress'), 10) || 5;
    const fatigue = parseInt(formData.get('fatigue'), 10) || 5;
    const sleep = parseInt(formData.get('sleep'), 10) || 5;
    const mood = parseInt(formData.get('mood'), 10) || 3;
    const comment = formData.get('comment') || '';
    
    setTimeout(() => {
      submitWellnessCheckin(currentSoldier.id, { stressScore: stress, fatigueScore: fatigue, sleepQualityScore: sleep, moodScore: mood, comment });
      setIsSubmitting(false);
      setActiveTab('today');
    }, 800);
  };

  // Get simple supportive recommendation based loosely on the state without exposing it
  const getRecommendation = () => {
    const risk = currentSoldier.wellness?.welfareRisk || 'MONITOR';
    if (risk === 'HIGH RISK' || risk === 'CRITICAL WELFARE RISK') {
      return "You may benefit from taking some time to rest and recover today. A brief check-in with your support team may be useful.";
    }
    return "Keep up your regular sleep routine and recovery time. Maintaining regular habits supports your daily performance.";
  };

  const renderTodayTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: '600px', margin: '0 auto' }}>
      
      {/* Motivational Line */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 4 }}>
          {getDailyMessage()}
        </h2>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          {getStreakMessage(currentStreak)}
        </div>
      </div>

      {/* Scheduled Follow-up Alert (if any) */}
      {scheduledFollowUps.length > 0 && (
        <div className="glass-panel" style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--accent-cyan)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <Clock size={20} style={{ color: 'var(--accent-cyan)', marginTop: 2 }} />
          <div>
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Medical Check-in Scheduled</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
              Your support team has scheduled a follow-up with you.
              {scheduledFollowUps[0].dueDate && (
                <div style={{ marginTop: 4, fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  Date: {new Date(scheduledFollowUps[0].dueDate).toLocaleString()}
                </div>
              )}
            </div>
            <button onClick={() => setActiveTab('followup')} className="btn-cyber" style={{ marginTop: 12, fontSize: '12px', padding: '6px 12px' }}>
              View Details
            </button>
          </div>
        </div>
      )}

      {/* Assessment Status */}
      {isCompletedToday ? (
        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', background: 'var(--bg-secondary)' }}>
          <CheckCircle2 size={48} style={{ color: 'var(--status-ready)', margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 12 }}>
            Assessment Complete
          </h3>
          <div style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto' }}>
            {getRecommendation()}
          </div>
          
          {!isCogCompletedToday && (
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: 12 }}>
                Optional: Complete your periodic cognitive check.
              </p>
              <button onClick={() => setActiveTab('assessment')} className="btn-cyber-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                Start Cognitive Assessment
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Activity size={24} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              Today's Check-in
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 24 }}>
            Take a moment to record your current wellbeing.
          </p>
          <button onClick={() => setActiveTab('assessment')} className="btn-cyber-primary" style={{ width: '100%', padding: '16px', fontSize: '15px', display: 'flex', justifyContent: 'center', gap: 8 }}>
            Begin Assessment <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );

  const renderAssessmentTab = () => (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button 
          onClick={() => setCogTab(false)} 
          className={!cogTab ? 'btn-cyber-primary' : 'btn-cyber'}
          style={{ flex: 1, padding: '12px' }}
        >
          Wellness Check-in
        </button>
        <button 
          onClick={() => setCogTab(true)} 
          className={cogTab ? 'btn-cyber-primary' : 'btn-cyber'}
          style={{ flex: 1, padding: '12px' }}
        >
          Cognitive Assessment
        </button>
      </div>

      {!cogTab ? (
        <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
          <h3 className="text-mono" style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: 12 }}>
            WELLNESS CHECK-IN
          </h3>
          
          <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', marginBottom: 24, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <ShieldAlert size={16} style={{ color: 'var(--text-secondary)', marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Your check-ins are used to support your wellbeing and help your medical team identify when a human follow-up may be useful. AEGIS does not diagnose you or make deployment decisions automatically.
            </p>
          </div>

          {isCompletedToday ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle2 size={48} style={{ color: 'var(--status-ready)', margin: '0 auto 16px auto' }} />
              <h4 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: 8 }}>Today's assessment is complete.</h4>
            </div>
          ) : (
            <form onSubmit={handleWellnessSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Stress Level</label>
                <input type="range" name="stress" min="1" max="10" defaultValue="3" style={{ width: '100%', marginTop: 12 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginTop: 8 }}>
                  <span>Low</span><span>High</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Physical Fatigue</label>
                <input type="range" name="fatigue" min="1" max="10" defaultValue="3" style={{ width: '100%', marginTop: 12 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginTop: 8 }}>
                  <span>Rested</span><span>Exhausted</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Sleep Quality</label>
                <input type="range" name="sleep" min="1" max="10" defaultValue="7" style={{ width: '100%', marginTop: 12 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginTop: 8 }}>
                  <span>Poor</span><span>Excellent</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Current Mood</label>
                <select name="mood" className="input-cyber" style={{ marginTop: 8, width: '100%', padding: '12px' }}>
                  <option value="5">Positive / Motivated</option>
                  <option value="4">Calm / Neutral</option>
                  <option value="3">Anxious / Stressed</option>
                  <option value="2">Frustrated / Irritable</option>
                  <option value="1">Depressed / Withdrawn</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Optional Comment</label>
                <textarea name="comment" className="input-cyber" rows="3" placeholder="Anything you want to log..." style={{ marginTop: 8, width: '100%', padding: '12px' }}></textarea>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-cyber-primary" style={{ marginTop: 10, padding: '16px', fontSize: '15px' }}>
                {isSubmitting ? 'Processing...' : 'Submit Securely'}
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
          {isCogCompletedToday ? (
             <div style={{ textAlign: 'center', padding: '40px 0' }}>
             <CheckCircle2 size={48} style={{ color: 'var(--status-ready)', margin: '0 auto 16px auto' }} />
             <h4 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: 8 }}>Cognitive assessment completed today.</h4>
           </div>
          ) : (
             <CognitiveAssessment 
               soldierId={currentSoldier.id} 
               onComplete={() => { setActiveTab('today'); }} 
             />
          )}
        </div>
      )}
    </div>
  );

  const renderFollowUpTab = () => (
    <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      <h3 className="text-mono" style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
        MEDICAL FOLLOW-UP
      </h3>

      {scheduledFollowUps.length === 0 && medicalNotes.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px 24px', textAlign: 'center' }}>
          <CheckCircle2 size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 16px auto' }} />
          <div style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>No medical follow-up notes at this time.</div>
        </div>
      ) : (
        <>
          {scheduledFollowUps.map((fup, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '20px', borderLeft: '3px solid var(--accent-cyan)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Calendar size={18} style={{ color: 'var(--accent-cyan)' }} />
                <h4 style={{ fontSize: '15px', fontWeight: 'bold' }}>Scheduled Check-in</h4>
              </div>
              {fup.dueDate && (
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 8 }}>
                  <strong>Date:</strong> {new Date(fup.dueDate).toLocaleString()}
                </div>
              )}
              {fup.clinicalNotes && (
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', background: 'var(--bg-primary)', padding: '12px', borderRadius: '4px', marginTop: 12 }}>
                  {fup.clinicalNotes}
                </div>
              )}
            </div>
          ))}

          {medicalNotes.length > 0 && scheduledFollowUps.length === 0 && (
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: 16 }}>Recent Medical Notes</h4>
              {medicalNotes.map((note, idx) => (
                <div key={idx} style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', marginBottom: 12, fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <div style={{ marginBottom: 4, fontSize: '11px', color: 'var(--text-muted)' }}>
                    {new Date(note.updatedAt || note.createdAt).toLocaleString()}
                  </div>
                  {note.clinicalNotes}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderProfileTab = () => (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
       <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--border-color)' }}>
              <User size={32} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                {currentSoldier.name || 'Not available'}
              </h2>
              <div className="text-mono" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {currentSoldier.rank || 'Not available'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Service Number</div>
              <div className="text-mono" style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{currentSoldier.serviceNumber || 'Not available'}</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Unit / Section</div>
              <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                {currentSoldier.unit || 'Not available'} — {currentSoldier.section || 'Not available'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Age</div>
              <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{currentSoldier.age ? `${currentSoldier.age} Yrs` : 'Not available'}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', paddingBottom: 16 }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Blood Group</div>
              <div className="text-mono" style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{currentSoldier.bloodGroup || 'Not available'}</div>
            </div>
          </div>
       </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Primary Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
        <button 
          onClick={() => setActiveTab('today')} 
          className={activeTab === 'today' ? 'btn-cyber-primary' : 'btn-cyber'}
          style={{ padding: '10px 20px' }}
        >
          TODAY
        </button>
        <button 
          onClick={() => setActiveTab('assessment')} 
          className={activeTab === 'assessment' ? 'btn-cyber-primary' : 'btn-cyber'}
          style={{ padding: '10px 20px' }}
        >
          ASSESSMENT
        </button>
        <button 
          onClick={() => setActiveTab('followup')} 
          className={activeTab === 'followup' ? 'btn-cyber-primary' : 'btn-cyber'}
          style={{ padding: '10px 20px' }}
        >
          FOLLOW-UP
        </button>
        <button 
          onClick={() => setActiveTab('profile')} 
          className={activeTab === 'profile' ? 'btn-cyber-primary' : 'btn-cyber'}
          style={{ padding: '10px 20px' }}
        >
          PROFILE
        </button>
      </div>

      {activeTab === 'today' && renderTodayTab()}
      {activeTab === 'assessment' && renderAssessmentTab()}
      {activeTab === 'followup' && renderFollowUpTab()}
      {activeTab === 'profile' && renderProfileTab()}

    </div>
  );
}
