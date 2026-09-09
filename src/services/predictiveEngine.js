export const MODEL_VERSION = "wellness-prediction-v0.1";

/**
 * 1. Calculate Personal Baseline
 * Analyzes the first half (older) of a person's history to establish their normal baseline
 * for stress, fatigue, mood, sleep, etc.
 */
export function calculatePersonalBaseline(history) {
  if (!history || history.length < 3) {
    return { available: false };
  }

  // Sort chronological
  const sorted = [...history].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  // Use oldest half as baseline period
  const baselineCount = Math.max(2, Math.floor(sorted.length / 2));
  const baselinePeriod = sorted.slice(0, baselineCount);
  const recentPeriod = sorted.slice(baselineCount);

  const getMean = (arr, key) => arr.reduce((sum, h) => sum + ((h.values ? h.values[key] : h[key]) || 0), 0) / arr.length;

  return {
    available: true,
    baseline: {
      stressScore: getMean(baselinePeriod, 'stressScore'),
      fatigueScore: getMean(baselinePeriod, 'fatigueScore'),
      moodScore: getMean(baselinePeriod, 'moodScore'),
      sleepQualityScore: getMean(baselinePeriod, 'sleepQualityScore')
    },
    recent: {
      stressScore: getMean(recentPeriod, 'stressScore'),
      fatigueScore: getMean(recentPeriod, 'fatigueScore'),
      moodScore: getMean(recentPeriod, 'moodScore'),
      sleepQualityScore: getMean(recentPeriod, 'sleepQualityScore')
    }
  };
}

/**
 * 2. Feature Engineering Layer
 * Transforms raw personnel data into structured predictive features.
 */
export function buildWellnessFeatures(personnel) {
  const features = {
    workload: {},
    recovery: {},
    assignment: {},
    transfer: {},
    training: {},
    selfReport: {},
    physiological: {},
    trends: {},
    dataQuality: {
      workloadAvailable: !!personnel.workload,
      recoveryAvailable: !!personnel.leaveHistory,
      historyAvailable: personnel.wellnessHistory && personnel.wellnessHistory.length >= 3,
      physiologicalAvailable: personnel.deviceConnected && personnel.lastWatchReadings
    }
  };

  // Workload
  if (personnel.workload) {
    features.workload.weeklyDutyHours = personnel.workload.weeklyDutyHours || 0;
    features.workload.consecutiveDutyDays = personnel.workload.consecutiveDutyDays || 0;
    features.workload.nightDuties = personnel.workload.nightDuties || 0;
  }

  // Recovery
  if (personnel.leaveHistory) {
    features.recovery.daysSinceLastLeave = personnel.leaveHistory.daysSinceLastLeave || 0;
    features.recovery.deferredLeaves = personnel.leaveHistory.deferredLeaves || 0;
  }

  // Assignment / Transfer
  if (personnel.transferHistory) {
    features.transfer.monthsAtCurrent = personnel.transferHistory.monthsAtCurrentAssignment || 12;
    features.transfer.transfersLast3Years = personnel.transferHistory.transfersLast3Years || 0;
  }

  // Physiological
  if (features.dataQuality.physiologicalAvailable) {
    features.physiological.restingHeartRate = personnel.lastWatchReadings.heartRate || 75;
    features.physiological.sleepDuration = personnel.lastWatchReadings.sleepDuration || 7.0;
  }

  // Trends & Baselines
  const baselineData = calculatePersonalBaseline(personnel.wellnessHistory);
  if (baselineData.available) {
    const { baseline, recent } = baselineData;
    features.trends.stressTrend = recent.stressScore - baseline.stressScore;
    features.trends.fatigueTrend = recent.fatigueScore - baseline.fatigueScore;
    features.trends.sleepTrend = recent.sleepQualityScore - baseline.sleepQualityScore; // higher score means better sleep usually, wait, in this app 1 is worst, 5 is best
    features.selfReport.recentStress = recent.stressScore;
    features.selfReport.recentFatigue = recent.fatigueScore;
    features.selfReport.baselineStress = baseline.stressScore;
  }

  return features;
}

/**
 * 3. Prediction Engine
 * Analyzes features to generate a risk score and confidence metric.
 * This is isolated and can be replaced with an ML model in the future.
 */
export function predictWellnessRisk(features) {
  let score = 0;
  let confidence = 100;
  let riskBand = "LOW";
  let direction = "STABLE";

  // If we don't have enough history, we can't make a confident predictive baseline
  if (!features.dataQuality.historyAvailable) {
    return {
      riskScore: 0,
      riskBand: "INSUFFICIENT_DATA",
      predictionHorizon: "near-term",
      confidence: 10,
      direction: "INSUFFICIENT_DATA",
      rawScore: 0
    };
  }

  // Penalty for missing data groups
  if (!features.dataQuality.workloadAvailable) confidence -= 20;
  if (!features.dataQuality.physiologicalAvailable) confidence -= 20;

  // -- Simple Linear Risk Model (To be replaced by ML) --
  
  // 1. Workload burden
  if (features.workload.weeklyDutyHours > 60) score += 20;
  else if (features.workload.weeklyDutyHours > 50) score += 10;
  
  if (features.workload.consecutiveDutyDays > 14) score += 15;
  else if (features.workload.consecutiveDutyDays > 7) score += 5;
  
  if (features.workload.nightDuties > 3) score += 15;

  // 2. Recovery debt
  if (features.recovery.daysSinceLastLeave > 180) score += 20;
  else if (features.recovery.daysSinceLastLeave > 90) score += 10;
  if (features.recovery.deferredLeaves > 0) score += 10;

  // 3. Deterioration from Personal Baseline
  // If stress trend is positive (increasing stress), add risk
  if (features.trends.stressTrend > 1.5) {
    score += 25;
    direction = "DETERIORATING";
  } else if (features.trends.stressTrend > 0.5) {
    score += 15;
    direction = "DETERIORATING";
  } else if (features.trends.stressTrend < -0.5) {
    direction = "IMPROVING";
  }

  if (features.trends.fatigueTrend > 1) {
    score += 15;
    direction = "DETERIORATING";
  }
  
  // Sleep Quality (1-5, lower is worse). If trend is negative (sleep getting worse), add risk
  if (features.trends.sleepTrend < -1) {
    score += 15;
  }

  // 4. Physiological
  if (features.dataQuality.physiologicalAvailable) {
    if (features.physiological.sleepDuration < 5) score += 15;
    else if (features.physiological.sleepDuration < 6) score += 5;
  }

  // Normalize score
  score = Math.min(100, Math.max(0, score));

  // Determine Band
  if (score >= 80) riskBand = "CRITICAL";
  else if (score >= 60) riskBand = "HIGH";
  else if (score >= 40) riskBand = "ELEVATED";
  else if (score >= 20) riskBand = "MODERATE";
  else riskBand = "LOW";

  return {
    riskScore: score,
    riskBand,
    predictionHorizon: "near-term",
    confidence,
    direction,
    rawScore: score
  };
}

/**
 * 4. Explainability Layer
 * Generates structured explanations traceable to actual features.
 */
export function explainPrediction(prediction, features) {
  const contributingFactors = [];
  const protectiveFactors = [];

  if (prediction.riskBand === "INSUFFICIENT_DATA") {
    return { contributingFactors, protectiveFactors };
  }

  // Workload explanations
  if (features.workload.weeklyDutyHours > 60) {
    contributingFactors.push({ category: "Workload", factor: "Sustained high duty hours", direction: "Negative", severity: "High", evidence: `${features.workload.weeklyDutyHours} hrs/week` });
  } else if (features.workload.weeklyDutyHours <= 45 && features.dataQuality.workloadAvailable) {
    protectiveFactors.push({ category: "Workload", factor: "Stable duty hours", direction: "Positive", severity: "Low", evidence: `${features.workload.weeklyDutyHours} hrs/week` });
  }

  if (features.workload.consecutiveDutyDays > 14) {
    contributingFactors.push({ category: "Workload", factor: "Prolonged consecutive duty", direction: "Negative", severity: "High", evidence: `${features.workload.consecutiveDutyDays} days` });
  }

  // Recovery explanations
  if (features.recovery.daysSinceLastLeave > 180) {
    contributingFactors.push({ category: "Recovery", factor: "Extended interval without leave", direction: "Negative", severity: "High", evidence: `${features.recovery.daysSinceLastLeave} days` });
  } else if (features.recovery.daysSinceLastLeave < 45 && features.dataQuality.recoveryAvailable) {
    protectiveFactors.push({ category: "Recovery", factor: "Recent recovery period", direction: "Positive", severity: "Low", evidence: `${features.recovery.daysSinceLastLeave} days ago` });
  }

  // Trend explanations
  if (features.trends.stressTrend > 1) {
    contributingFactors.push({ category: "Wellness", factor: "Deterioration from personal baseline", direction: "Negative", severity: "High", evidence: `Stress increased by ${features.trends.stressTrend.toFixed(1)} vs baseline` });
  } else if (features.trends.stressTrend <= 0 && features.dataQuality.historyAvailable) {
    protectiveFactors.push({ category: "Wellness", factor: "Stable personal baseline", direction: "Positive", severity: "Low", evidence: "No recent stress increase" });
  }

  if (features.trends.sleepTrend < -1) {
    contributingFactors.push({ category: "Wellness", factor: "Declining sleep quality", direction: "Negative", severity: "Medium", evidence: `Sleep score dropped by ${Math.abs(features.trends.sleepTrend).toFixed(1)}` });
  }

  // Physiological
  if (features.dataQuality.physiologicalAvailable) {
    if (features.physiological.sleepDuration < 5) {
      contributingFactors.push({ category: "Physiological", factor: "Severely restricted sleep", direction: "Negative", severity: "High", evidence: `${features.physiological.sleepDuration} hrs` });
    } else if (features.physiological.sleepDuration >= 7) {
      protectiveFactors.push({ category: "Physiological", factor: "Adequate physiological rest", direction: "Positive", severity: "Low", evidence: `${features.physiological.sleepDuration} hrs` });
    }
  }

  return { contributingFactors, protectiveFactors };
}

/**
 * 5. Recommendation Logic
 * Supportive, non-disciplinary recommendations based on the explanation factors.
 */
export function generateRecommendations(prediction, contributingFactors) {
  if (prediction.riskBand === "INSUFFICIENT_DATA") {
    return ["Insufficient longitudinal data to generate recommendations. Encourage regular voluntary wellness check-ins."];
  }

  const recs = new Set();
  
  if (prediction.riskBand === "CRITICAL" || prediction.riskBand === "HIGH") {
    recs.add("Suggest human Welfare Officer review to assess need for individualized support.");
  }

  contributingFactors.forEach(factor => {
    if (factor.category === "Workload") {
      recs.add("Suggest workload review / supervisor discussion regarding duty pacing.");
    }
    if (factor.category === "Recovery") {
      recs.add("Suggest reviewing leave schedule for adequate recovery opportunities.");
    }
    if (factor.category === "Physiological" && factor.factor.includes("sleep")) {
      recs.add("Suggest rest prioritization and wellness follow-up.");
    }
    if (factor.category === "Wellness" && factor.factor.includes("baseline")) {
      recs.add("Suggest voluntary welfare check-in or peer-support conversation.");
    }
  });

  if (recs.size === 0 && prediction.riskBand === "LOW") {
    recs.add("Continue standard support and monitoring.");
  }

  return Array.from(recs);
}

/**
 * Master Wrapper
 * Builds features, predicts, explains, and structures the final output.
 */
export function generatePredictiveWellnessIntelligence(personnel) {
  const features = buildWellnessFeatures(personnel);
  const prediction = predictWellnessRisk(features);
  const { contributingFactors, protectiveFactors } = explainPrediction(prediction, features);
  const recommendations = generateRecommendations(prediction, contributingFactors);

  return {
    riskScore: prediction.riskScore,
    riskBand: prediction.riskBand,
    predictionHorizon: prediction.predictionHorizon,
    confidence: prediction.confidence,
    direction: prediction.direction,
    contributingFactors,
    protectiveFactors,
    recommendations,
    dataQuality: features.dataQuality,
    generatedAt: new Date().toISOString(),
    modelVersion: MODEL_VERSION
  };
}
