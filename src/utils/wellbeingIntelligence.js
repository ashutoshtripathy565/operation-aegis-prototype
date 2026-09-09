// Pure multi-domain early-warning intelligence engine
// Processes history, baselines, and context to generate human-readable insights

export function generateIntelligence(soldierId, history, baselines) {
  // 1. Data Completeness & Confidence
  const wbHistory = history.filter(h => h.soldierId === soldierId && (h.category === 'wellbeing_checkin' || !h.category));
  const cogHistory = history.filter(h => h.soldierId === soldierId && h.category === 'cognitive_assessment');
  
  const wbCount = wbHistory.length;
  const cogCount = cogHistory.length;
  const totalCount = wbCount + cogCount;

  let confidence = 'INSUFFICIENT';
  let status = 'INSUFFICIENT_DATA';
  
  if (totalCount >= 10 && wbCount >= 3 && cogCount >= 3) {
    confidence = 'HIGH';
  } else if (totalCount >= 5 && wbCount >= 2 && cogCount >= 1) {
    confidence = 'MODERATE';
  } else if (totalCount >= 3) {
    confidence = 'LOW';
  }

  // Evaluate if we have enough data to form any baseline
  if (totalCount < 3) {
    return {
      status,
      confidence,
      evidence: ['Insufficient historical observations to establish a reliable personal baseline.'],
      protectiveFactors: [],
      completeness: { wellbeing: wbCount, cognitive: cogCount, total: totalCount }
    };
  }

  // 2. Domain Parsing
  const declining = [];
  const improving = [];
  const stable = [];

  const checkDimension = (domain, key, label) => {
    const data = baselines[domain]?.[key];
    if (!data || data.status === 'INSUFFICIENT_DATA') return;

    const info = { domain, key, label, ...data };
    if (data.direction === 'DECLINING') declining.push(info);
    else if (data.direction === 'IMPROVING') improving.push(info);
    else if (data.direction === 'STABLE') stable.push(info);
  };

  // Wellbeing
  checkDimension('wellbeing', 'stress', 'Reported Stress');
  checkDimension('wellbeing', 'fatigue', 'Physical Fatigue');
  checkDimension('wellbeing', 'sleep', 'Sleep Quality');
  checkDimension('wellbeing', 'mood', 'Mental Mood');
  // Cognitive
  checkDimension('cognitive', 'reactionTime', 'Reaction Time');
  checkDimension('cognitive', 'attention', 'Sustained Attention');
  checkDimension('cognitive', 'workingMemory', 'Working Memory');
  checkDimension('cognitive', 'processingSpeed', 'Processing Speed');
  checkDimension('cognitive', 'cognitiveFlexibility', 'Cognitive Flexibility');

  // 3. Status Logic & Convergence Detection
  const persistentDeclines = declining.filter(d => d.persistence === 'persistent');
  const shortTermDeclines = declining.filter(d => d.persistence === 'short-term');
  const isolatedDeclines = declining.filter(d => d.persistence === 'isolated fluctuation');
  
  const hasWellbeingDecline = declining.some(d => d.domain === 'wellbeing');
  const hasCognitiveDecline = declining.some(d => d.domain === 'cognitive');
  const multiDomainConvergence = hasWellbeingDecline && hasCognitiveDecline;

  if (persistentDeclines.length >= 3 && multiDomainConvergence) {
    status = 'URGENT_HUMAN_REVIEW';
  } else if (persistentDeclines.length >= 2 || (persistentDeclines.length === 1 && shortTermDeclines.length >= 2)) {
    status = 'ATTENTION_RECOMMENDED';
  } else if (declining.length >= 1) {
    status = 'MONITOR';
  } else {
    status = 'STABLE';
  }

  // 4. Evidence Generation
  const evidence = [];
  if (multiDomainConvergence && status !== 'STABLE' && status !== 'MONITOR') {
    evidence.push('MULTI-DOMAIN CHANGE: Simultaneous deterioration observed across both subjective wellbeing and cognitive performance.');
  }

  declining.forEach(d => {
    let text = `${d.label} has declined by ${Math.abs(d.changePct)}% from personal baseline.`;
    if (d.persistence === 'persistent') {
      text += ' This pattern has persisted across recent consecutive assessments.';
    } else if (d.persistence === 'short-term') {
      text += ' This is an emerging short-term change.';
    } else {
      text += ' This appears to be an isolated recent fluctuation.';
    }
    evidence.push(text);
  });

  if (declining.length === 0 && stable.length > 0) {
    evidence.push('All measured domains remain stable relative to the personal baseline.');
  }

  // 5. Protective Factors
  const protectiveFactors = [];
  improving.forEach(i => {
    protectiveFactors.push(`${i.label} has improved by ${Math.abs(i.changePct)}% compared to baseline.`);
  });
  
  if (stable.length >= 4) {
    protectiveFactors.push(`Strong stability observed across ${stable.length} independent domains.`);
  }

  return {
    status,
    confidence,
    evidence,
    protectiveFactors,
    completeness: {
      wellbeing: wbCount,
      cognitive: cogCount,
      total: totalCount
    },
    multiDomainConvergence
  };
}

export function formatSoldierSummary(intelligence) {
  if (intelligence.status === 'INSUFFICIENT_DATA') {
    return {
      title: 'Insufficient Data',
      message: 'Keep logging your wellbeing and completing cognitive tasks. Aegis needs a few more observations to learn your personal baseline.',
      action: 'Log a check-in today.'
    };
  }
  
  if (intelligence.status === 'STABLE') {
    return {
      title: 'Baseline Stable',
      message: 'Your recent check-ins match your normal personal baseline. Protective factors and routines appear to be maintaining your wellbeing.',
      action: 'Maintain current routines.'
    };
  }
  
  if (intelligence.status === 'MONITOR') {
    return {
      title: 'Minor Fluctuations Detected',
      message: 'We noticed some slight changes in your recent logs compared to your usual baseline. This is normal, but worth keeping an eye on.',
      action: 'Focus on rest and recovery over the next 48 hours.'
    };
  }

  return {
    title: 'Pattern Shift Detected',
    message: 'Aegis has noticed consistent changes across your recent check-ins compared to your usual baseline. Early recognition helps maintain long-term readiness.',
    action: 'Consider scheduling a brief check-in with your unit medical team to discuss recovery strategies.'
  };
}
