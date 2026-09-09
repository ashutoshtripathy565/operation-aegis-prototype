import React, { useState, useEffect, useRef } from 'react';
import { Brain, Play, CheckCircle, XCircle, ArrowRight, Clock, ShieldAlert } from 'lucide-react';

export default function CognitiveAssessment({ onComplete, onCancel }) {
  const [phase, setPhase] = useState('intro'); // intro, reaction_inst, reaction_run, attention_inst, attention_run, memory_inst, memory_run, speed_inst, speed_run, flex_inst, flex_run, results
  const [results, setResults] = useState({});
  const timeoutRef = useRef(null);

  // --- Reaction Time State ---
  const [rtState, setRtState] = useState('waiting'); // waiting, ready, done, early
  const [rtStart, setRtStart] = useState(0);
  const [rtMs, setRtMs] = useState(0);

  // --- Attention State ---
  const [attRound, setAttRound] = useState(0);
  const [attTarget] = useState('X');
  const [attCurrent, setAttCurrent] = useState('');
  const [attScore, setAttScore] = useState(0);
  const attLetters = ['A', 'X', 'B', 'X', 'C']; // fixed sequence for demo

  // --- Working Memory State ---
  const [memSequence] = useState('7 2 9 4');
  const [memShow, setMemShow] = useState(true);
  const [memInput, setMemInput] = useState('');

  // --- Processing Speed State ---
  const [speedRound, setSpeedRound] = useState(0);
  const [speedNum, setSpeedNum] = useState(0);
  const [speedScore, setSpeedScore] = useState(0);
  const [speedStart, setSpeedStart] = useState(0);
  const [speedTime, setSpeedTime] = useState(0);
  const speedTrials = [45, 82, 12, 99, 34]; // Evens vs Odds

  // --- Cognitive Flexibility State ---
  const [flexRound, setFlexRound] = useState(0);
  const [flexScore, setFlexScore] = useState(0);
  const flexTrials = [
    { word: 'RED', color: 'blue', rule: 'COLOR', answer: 'blue' },
    { word: 'GREEN', color: 'green', rule: 'WORD', answer: 'green' },
    { word: 'BLUE', color: 'red', rule: 'COLOR', answer: 'red' },
    { word: 'RED', color: 'red', rule: 'WORD', answer: 'red' }
  ];

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // Helpers
  const advance = (nextPhase) => setPhase(nextPhase);

  // --- Reaction Logic ---
  const startReaction = () => {
    setPhase('reaction_run');
    setRtState('waiting');
    const delay = 1000 + Math.random() * 2000;
    timeoutRef.current = setTimeout(() => {
      setRtState('ready');
      setRtStart(Date.now());
    }, delay);
  };
  const handleReactionClick = () => {
    if (rtState === 'waiting') {
      clearTimeout(timeoutRef.current);
      setRtState('early');
      setTimeout(startReaction, 1500);
    } else if (rtState === 'ready') {
      const time = Date.now() - rtStart;
      setRtMs(time);
      setRtState('done');
      const score = Math.max(0, 100 - (time > 200 ? (time - 200) / 10 : 0));
      setResults(r => ({ ...r, reactionTime: { rawMs: time, score: Math.round(score) } }));
      setTimeout(() => advance('attention_inst'), 1500);
    }
  };

  // --- Attention Logic ---
  const startAttention = () => {
    setPhase('attention_run');
    setAttRound(0);
    setAttScore(0);
    runAttentionRound(0, 0);
  };
  const runAttentionRound = (roundIndex, currentScore) => {
    if (roundIndex >= attLetters.length) {
      const score = Math.round((currentScore / attLetters.length) * 100);
      setResults(r => ({ ...r, attention: { correct: currentScore, total: attLetters.length, score } }));
      advance('memory_inst');
      return;
    }
    setAttRound(roundIndex);
    setAttCurrent(attLetters[roundIndex]);
    
    // Auto advance if they don't click
    timeoutRef.current = setTimeout(() => {
      const isTarget = attLetters[roundIndex] === attTarget;
      // If it wasn't a target and they didn't click, they are correct (withheld response)
      runAttentionRound(roundIndex + 1, currentScore + (isTarget ? 0 : 1));
    }, 1200);
  };
  const handleAttentionClick = () => {
    clearTimeout(timeoutRef.current);
    const isTarget = attLetters[attRound] === attTarget;
    runAttentionRound(attRound + 1, attScore + (isTarget ? 1 : 0));
    setAttScore(s => s + (isTarget ? 1 : 0));
  };

  // --- Working Memory Logic ---
  const startMemory = () => {
    setPhase('memory_run');
    setMemShow(true);
    setMemInput('');
    timeoutRef.current = setTimeout(() => {
      setMemShow(false);
    }, 3000);
  };
  const submitMemory = () => {
    const cleanInput = memInput.replace(/\s+/g, '');
    const cleanTarget = memSequence.replace(/\s+/g, '');
    let correct = 0;
    for (let i = 0; i < cleanTarget.length; i++) {
      if (cleanInput[i] === cleanTarget[i]) correct++;
    }
    const score = Math.round((correct / cleanTarget.length) * 100);
    setResults(r => ({ ...r, workingMemory: { correct, total: cleanTarget.length, score } }));
    advance('speed_inst');
  };

  // --- Processing Speed Logic ---
  const startSpeed = () => {
    setPhase('speed_run');
    setSpeedRound(0);
    setSpeedScore(0);
    setSpeedNum(speedTrials[0]);
    setSpeedStart(Date.now());
  };
  const handleSpeedClick = (isEven) => {
    const actualEven = speedNum % 2 === 0;
    const newScore = speedScore + (isEven === actualEven ? 1 : 0);
    setSpeedScore(newScore);

    if (speedRound + 1 >= speedTrials.length) {
      const timeMs = Date.now() - speedStart;
      const accuracy = newScore / speedTrials.length;
      const score = Math.round(accuracy * 100 - (timeMs > 5000 ? (timeMs - 5000) / 100 : 0));
      setResults(r => ({ ...r, processingSpeed: { timeMs, correct: newScore, score: Math.max(0, score) } }));
      advance('flex_inst');
    } else {
      setSpeedRound(speedRound + 1);
      setSpeedNum(speedTrials[speedRound + 1]);
    }
  };

  // --- Flexibility Logic ---
  const startFlex = () => {
    setPhase('flex_run');
    setFlexRound(0);
    setFlexScore(0);
  };
  const handleFlexClick = (colorChoice) => {
    const trial = flexTrials[flexRound];
    const newScore = flexScore + (colorChoice === trial.answer ? 1 : 0);
    setFlexScore(newScore);

    if (flexRound + 1 >= flexTrials.length) {
      const score = Math.round((newScore / flexTrials.length) * 100);
      setResults(r => ({ ...r, cognitiveFlexibility: { correct: newScore, total: flexTrials.length, score } }));
      advance('results');
    } else {
      setFlexRound(flexRound + 1);
    }
  };

  const submitAssessment = () => {
    onComplete(results);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-secondary)', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 className="text-mono" style={{ fontSize: '16px', color: 'var(--accent-cyan)' }}>
          <Brain size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
          COGNITIVE WELLBEING ASSESSMENT
        </h3>
        <button onClick={onCancel} className="btn-cyber" style={{ padding: '4px 8px', fontSize: '11px' }}>Cancel</button>
      </div>

      {/* --- INTRO --- */}
      {phase === 'intro' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            This short interactive assessment measures baseline cognitive dimensions: Reaction Time, Attention, Working Memory, Processing Speed, and Flexibility.
          </p>
          <div style={{ padding: '12px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid var(--accent-cyan)', borderRadius: 4 }}>
            <p style={{ fontSize: '12px', color: 'var(--accent-cyan)', margin: 0 }}>
              <strong>Note:</strong> This is a wellbeing tool, not a clinical diagnostic test. Results are stored in your private history.
            </p>
          </div>
          <button onClick={() => advance('reaction_inst')} className="btn-cyber-primary" style={{ marginTop: 10 }}>
            Start Assessment
          </button>
        </div>
      )}

      {/* --- REACTION TIME --- */}
      {phase === 'reaction_inst' && (
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: 10 }}>Task 1: Reaction Time</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: 20 }}>Click the button as soon as it turns GREEN.</p>
          <button onClick={startReaction} className="btn-cyber">Ready</button>
        </div>
      )}
      {phase === 'reaction_run' && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          {rtState === 'early' ? (
            <div style={{ color: 'var(--status-critical)' }}>Too early! Wait for green...</div>
          ) : rtState === 'done' ? (
            <div style={{ color: 'var(--status-ready)', fontSize: '20px' }}>{rtMs} ms</div>
          ) : (
            <button 
              onMouseDown={handleReactionClick}
              style={{
                width: 150, height: 150, borderRadius: '50%',
                background: rtState === 'ready' ? 'var(--status-ready)' : 'var(--bg-primary)',
                border: rtState === 'ready' ? 'none' : '2px solid var(--border-color)',
                color: rtState === 'ready' ? '#000' : 'var(--text-muted)',
                fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
                transition: 'background 0.1s'
              }}
            >
              {rtState === 'waiting' ? 'WAIT' : 'CLICK!'}
            </button>
          )}
        </div>
      )}

      {/* --- ATTENTION --- */}
      {phase === 'attention_inst' && (
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: 10 }}>Task 2: Sustained Attention</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: 20 }}>Letters will appear one by one. Click the "TARGET" button ONLY when you see the letter <strong>{attTarget}</strong>.</p>
          <button onClick={startAttention} className="btn-cyber">Start</button>
        </div>
      )}
      {phase === 'attention_run' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 30, height: 60 }}>
            {attCurrent}
          </div>
          <button onMouseDown={handleAttentionClick} className="btn-cyber-primary" style={{ padding: '15px 40px', fontSize: '16px' }}>
            TARGET (X)
          </button>
        </div>
      )}

      {/* --- WORKING MEMORY --- */}
      {phase === 'memory_inst' && (
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: 10 }}>Task 3: Working Memory</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: 20 }}>Memorize the sequence of numbers. They will disappear after 3 seconds.</p>
          <button onClick={startMemory} className="btn-cyber">Show Sequence</button>
        </div>
      )}
      {phase === 'memory_run' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          {memShow ? (
            <div style={{ fontSize: '36px', letterSpacing: '8px', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
              {memSequence}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <input 
                type="text" 
                value={memInput}
                onChange={e => setMemInput(e.target.value)}
                className="input-cyber" 
                placeholder="Enter numbers..."
                style={{ fontSize: '20px', textAlign: 'center', width: '200px', letterSpacing: '4px' }}
                autoFocus
              />
              <button onClick={submitMemory} className="btn-cyber-primary">Submit</button>
            </div>
          )}
        </div>
      )}

      {/* --- PROCESSING SPEED --- */}
      {phase === 'speed_inst' && (
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: 10 }}>Task 4: Processing Speed</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: 20 }}>Categorize the number as EVEN or ODD as fast as possible.</p>
          <button onClick={startSpeed} className="btn-cyber">Start</button>
        </div>
      )}
      {phase === 'speed_run' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 30 }}>
            {speedNum}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <button onClick={() => handleSpeedClick(true)} className="btn-cyber" style={{ padding: '15px 30px', fontSize: '16px' }}>EVEN</button>
            <button onClick={() => handleSpeedClick(false)} className="btn-cyber" style={{ padding: '15px 30px', fontSize: '16px' }}>ODD</button>
          </div>
        </div>
      )}

      {/* --- COGNITIVE FLEXIBILITY --- */}
      {phase === 'flex_inst' && (
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: 10 }}>Task 5: Cognitive Flexibility</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: 20 }}>Follow the changing rule. Sometimes you match the WORD, sometimes the INK COLOR.</p>
          <button onClick={startFlex} className="btn-cyber">Start</button>
        </div>
      )}
      {phase === 'flex_run' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Current Rule: </span>
            <strong style={{ fontSize: '18px', color: 'var(--accent-cyan)' }}>MATCH {flexTrials[flexRound].rule}</strong>
          </div>
          <div style={{ fontSize: '42px', fontWeight: 'bold', color: flexTrials[flexRound].color, marginBottom: 30 }}>
            {flexTrials[flexRound].word}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <button onClick={() => handleFlexClick('red')} className="btn-cyber" style={{ color: 'red', borderColor: 'red' }}>RED</button>
            <button onClick={() => handleFlexClick('blue')} className="btn-cyber" style={{ color: 'blue', borderColor: 'blue' }}>BLUE</button>
            <button onClick={() => handleFlexClick('green')} className="btn-cyber" style={{ color: 'green', borderColor: 'green' }}>GREEN</button>
          </div>
        </div>
      )}

      {/* --- RESULTS --- */}
      {phase === 'results' && (
        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: 16, textAlign: 'center' }}>Assessment Complete</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            <div className="glass-panel" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Reaction Time:</span>
              <span className="text-mono" style={{ color: 'var(--accent-cyan)' }}>{results.reactionTime?.rawMs} ms (Score: {results.reactionTime?.score})</span>
            </div>
            <div className="glass-panel" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Attention Accuracy:</span>
              <span className="text-mono" style={{ color: 'var(--accent-cyan)' }}>{results.attention?.score}%</span>
            </div>
            <div className="glass-panel" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Working Memory:</span>
              <span className="text-mono" style={{ color: 'var(--accent-cyan)' }}>{results.workingMemory?.score}%</span>
            </div>
            <div className="glass-panel" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Processing Speed:</span>
              <span className="text-mono" style={{ color: 'var(--accent-cyan)' }}>{results.processingSpeed?.score} (Time: {results.processingSpeed?.timeMs}ms)</span>
            </div>
            <div className="glass-panel" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Flexibility:</span>
              <span className="text-mono" style={{ color: 'var(--accent-cyan)' }}>{results.cognitiveFlexibility?.score}%</span>
            </div>
          </div>
          <button onClick={submitAssessment} className="btn-cyber-primary" style={{ width: '100%', padding: '12px' }}>
            Save Assessment to History
          </button>
        </div>
      )}
    </div>
  );
}
