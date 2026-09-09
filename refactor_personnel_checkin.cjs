const fs = require('fs');
const lines = fs.readFileSync('src/pages/PersonnelDashboard.jsx', 'utf-8').split('\n');

const assIdx = lines.findIndex(l => l.includes("{activeSubTab === 'assessment' && ("));
const devIdx = lines.findIndex(l => l.includes("{activeSubTab === 'device' && ("));

// New Wellness Check-in block
const newAssessmentBlock = \`      {activeSubTab === 'assessment' && (
        <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          <h3 className="text-mono" style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: 20 }}>
            VOLUNTARY WELLNESS CHECK-IN
          </h3>
          
          {remainingAssessments <= 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle2 size={48} style={{ color: 'var(--status-ready)', marginBottom: 16 }} />
              <h4 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: 8 }}>Check-in Limit Reached</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                You have reached the daily limit. Thank you for logging your wellness.
              </p>
            </div>
          ) : (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const stress = parseInt(formData.get('stress'), 10);
              const fatigue = parseInt(formData.get('fatigue'), 10);
              const sleep = parseInt(formData.get('sleep'), 10);
              const mood = parseInt(formData.get('mood'), 10);
              const comment = formData.get('comment');
              
              submitWellnessCheckin(currentSoldier.id, { stress, fatigue, sleep, mood, comment });
              setActiveSubTab('hub');
            }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              <div>
                <label className="text-mono" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Stress Level (1-10)</label>
                <input type="range" name="stress" min="1" max="10" defaultValue="3" style={{ width: '100%', marginTop: 8 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: 4 }}>
                  <span>Low</span><span>High</span>
                </div>
              </div>

              <div>
                <label className="text-mono" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Physical Fatigue (1-10)</label>
                <input type="range" name="fatigue" min="1" max="10" defaultValue="3" style={{ width: '100%', marginTop: 8 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: 4 }}>
                  <span>Rested</span><span>Exhausted</span>
                </div>
              </div>

              <div>
                <label className="text-mono" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Sleep Quality (1-10)</label>
                <input type="range" name="sleep" min="1" max="10" defaultValue="7" style={{ width: '100%', marginTop: 8 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: 4 }}>
                  <span>Poor</span><span>Excellent</span>
                </div>
              </div>

              <div>
                <label className="text-mono" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Current Mood</label>
                <select name="mood" className="input-cyber" style={{ marginTop: 8, width: '100%' }}>
                  <option value="5">Positive / Motivated</option>
                  <option value="4">Calm / Neutral</option>
                  <option value="3">Anxious / Stressed</option>
                  <option value="2">Frustrated / Irritable</option>
                  <option value="1">Depressed / Withdrawn</option>
                </select>
              </div>

              <div>
                <label className="text-mono" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Optional Comment / Concern</label>
                <textarea name="comment" className="input-cyber" rows="3" placeholder="Anything you want to log confidentially..." style={{ marginTop: 8, width: '100%' }}></textarea>
              </div>

              <button type="submit" className="btn-cyber-primary" style={{ marginTop: 10, padding: '12px' }}>
                Submit Securely
              </button>
            </form>
          )}
        </div>
      )}\n`;

// Slice the array to replace the block
const before = lines.slice(0, assIdx);
const after = lines.slice(devIdx);
const newLines = [...before, newAssessmentBlock, ...after];

fs.writeFileSync('src/pages/PersonnelDashboard.jsx', newLines.join('\n'), 'utf-8');
