const fs = require('fs');

let content = fs.readFileSync('src/pages/PersonnelDashboard.jsx', 'utf-8');

// 1. Remove gamified states
content = content.replace(/  \/\/ Cognitive Games States[\s\S]*?const \[cognitiveBreakdown, setCognitiveBreakdown\] = useState\(null\);/g, '');

// 2. Remove timeout hook
content = content.replace(/  \/\/ cleanup timeouts on unmount[\s\S]*?\}, \[g1Timeout\]\);/g, '');

// 3. Remove game logic blocks
content = content.replace(/  \/\/ ==================== GAME 1: SIMPLE REACTION ====================[\s\S]*?setAssessmentStep\(4\);\n  \};\n/g, '');

// 4. Remove handleRunCRAE
content = content.replace(/  \/\/ ==================== CRAE CALCULATOR WIZARD STEP ====================[\s\S]*?\}, 2000\);\n  \};\n/g, `
  const [checkinStress, setCheckinStress] = useState(5);
  const [checkinFatigue, setCheckinFatigue] = useState(5);
  const [checkinSleep, setCheckinSleep] = useState(5);
  const [checkinMood, setCheckinMood] = useState('Neutral');
  const [checkinComment, setCheckinComment] = useState('');
  const [checkinSubmitted, setCheckinSubmitted] = useState(false);

  // Add submitWellnessCheckin to context destructuring if not there, wait, I can just use Aegis context.
  const { submitWellnessCheckin } = useAegis();

  const handleWellnessSubmit = (e) => {
    e.preventDefault();
    submitWellnessCheckin(currentSoldier.id, {
      stress: checkinStress,
      fatigue: checkinFatigue,
      sleep: checkinSleep,
      mood: checkinMood,
      comment: checkinComment
    });
    setCheckinSubmitted(true);
  };
`);

// 5. Replace `submitAssessment` in destructuring if we didn't get `submitWellnessCheckin`
content = content.replace(/submitAssessment, getSentinelAdvice, pairWearableDevice,/g, 'submitAssessment, submitWellnessCheckin, getSentinelAdvice, pairWearableDevice,');

// 6. Rewrite the rendering for the assessment block
const newAssessmentBlock = `
      {activeSubTab === 'assessment' && (
        <div className="glass-panel" style={{ padding: '30px', maxWidth: '600px', margin: '0 auto', background: 'var(--bg-secondary)' }}>
          <h2 className="text-mono" style={{ fontSize: '18px', marginBottom: 20, textAlign: 'center', color: 'var(--accent-cyan)' }}>
            VOLUNTARY WELLNESS CHECK-IN
          </h2>
          {checkinSubmitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(22, 163, 74, 0.1)', border: '2px solid var(--status-ready)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle2 size={30} color="var(--status-ready)" />
              </div>
              <h3 style={{ marginBottom: 12 }}>Check-in Logged Successfully</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: 24 }}>
                Thank you for logging your current wellbeing. This information helps us support personnel welfare.
              </p>
              <button onClick={() => { setCheckinSubmitted(false); setActiveSubTab('hub'); }} className="btn-cyber">Return to Hub</button>
            </div>
          ) : (
            <form onSubmit={handleWellnessSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: 8, color: 'var(--text-secondary)' }}>How would you rate your current stress level? (0 = Low, 10 = High)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '12px', width: 20 }}>{checkinStress}</span>
                  <input type="range" min="0" max="10" value={checkinStress} onChange={(e) => setCheckinStress(parseInt(e.target.value))} style={{ flex: 1 }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: 8, color: 'var(--text-secondary)' }}>How physically or mentally fatigued do you currently feel? (0 = Rested, 10 = Exhausted)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '12px', width: 20 }}>{checkinFatigue}</span>
                  <input type="range" min="0" max="10" value={checkinFatigue} onChange={(e) => setCheckinFatigue(parseInt(e.target.value))} style={{ flex: 1 }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: 8, color: 'var(--text-secondary)' }}>How would you describe your current mood?</label>
                <select className="input-cyber" value={checkinMood} onChange={(e) => setCheckinMood(e.target.value)} required>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Poor">Poor</option>
                  <option value="Very Poor">Very Poor</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: 8, color: 'var(--text-secondary)' }}>How would you rate your recent sleep quality? (0 = Poor, 10 = Excellent)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '12px', width: 20 }}>{checkinSleep}</span>
                  <input type="range" min="0" max="10" value={checkinSleep} onChange={(e) => setCheckinSleep(parseInt(e.target.value))} style={{ flex: 1 }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: 8, color: 'var(--text-secondary)' }}>Is there anything affecting your wellbeing that you would like to note? (Optional)</label>
                <textarea 
                  className="input-cyber" 
                  rows="3" 
                  value={checkinComment} 
                  onChange={(e) => setCheckinComment(e.target.value)}
                  placeholder="Optional notes..."
                ></textarea>
              </div>

              <div style={{ marginTop: 10 }}>
                <button type="submit" className="btn-cyber-primary" style={{ width: '100%' }}>Submit Wellness Check-in</button>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: 12 }}>
                  Your check-in data is private and only visible to authorized welfare officers to provide support. It is not used for disciplinary action.
                </p>
              </div>
            </form>
          )}
        </div>
      )}
`;

content = content.replace(/      \{activeSubTab === 'assessment' && \([\s\S]*?      \)\}\n\n      \{\/\* Device Link Screen \*\/\}/g, newAssessmentBlock + '\n      {/* Device Link Screen */}');

// 7. Remove "Readiness Assessment" from Sub tabs and replace with "Wellness Check-in"
content = content.replace(/Readiness Assessment/g, 'Wellness Check-in');

// 8. Remove unused checkin forms if they still exist (input parameters)
content = content.replace(/  \/\/ Input parameters \(default blanks matching FRS\)[\s\S]*?const \[selectedMission, setSelectedMission\] = useState\(''\);/g, '');

fs.writeFileSync('src/pages/PersonnelDashboard.jsx', content, 'utf-8');
