const fs = require('fs');
let content = fs.readFileSync('src/context/AegisContext.jsx', 'utf-8');

const historicalDataLogic = `
  const baseWellness = calculateWellnessRisk(expandedSoldier);
  expandedSoldier.wellness = baseWellness;

  // STEP 9: Generate deterministic wellness history based on the index (seed)
  // Person A (index 0): Stable low risk
  // Person B (index 1): Gradually increasing strain
  // Person C (index 2): High workload followed by deterioration
  // Person D (index 3): High risk followed by recovery
  // Person E (index 4): Stable moderate risk
  // Others: fallback stable history
  
  const now = new Date('2026-07-09T10:00:00Z');
  const generateHistoryPoint = (daysAgo, stress, fatigue, mood, sleep, riskScore, band) => {
    const ts = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000)).toISOString();
    return {
      timestamp: ts,
      source: 'system_assessment',
      stressScore: stress,
      fatigueScore: fatigue,
      moodScore: mood,
      sleepQualityScore: sleep,
      wellnessRiskScore: riskScore,
      riskBand: band,
      confidence: 85
    };
  };

  expandedSoldier.wellnessHistory = [];
  
  if (index === 0) { // Person A: Stable low risk (approx 15-20)
    expandedSoldier.wellnessHistory = [
      generateHistoryPoint(28, 2, 2, 4, 4, 18, 'LOW RISK'),
      generateHistoryPoint(21, 2, 2, 4, 4, 17, 'LOW RISK'),
      generateHistoryPoint(14, 1, 2, 4, 5, 16, 'LOW RISK'),
      generateHistoryPoint(7, 2, 2, 4, 4, 18, 'LOW RISK'),
      generateHistoryPoint(1, 2, 1, 4, 5, 15, 'LOW RISK')
    ];
  } else if (index === 1) { // Person B: Gradually increasing strain (25 -> 65)
    expandedSoldier.wellnessHistory = [
      generateHistoryPoint(28, 2, 2, 3, 4, 25, 'MODERATE RISK'),
      generateHistoryPoint(21, 3, 2, 3, 3, 35, 'MODERATE RISK'),
      generateHistoryPoint(14, 3, 3, 3, 3, 45, 'ELEVATED RISK'),
      generateHistoryPoint(7, 4, 4, 2, 2, 55, 'ELEVATED RISK'),
      generateHistoryPoint(1, 4, 5, 2, 2, 65, 'HIGH RISK')
    ];
  } else if (index === 2) { // Person C: High workload followed by deterioration (sudden change: 30 -> 32 -> 31 -> 62)
    expandedSoldier.wellnessHistory = [
      generateHistoryPoint(28, 2, 3, 3, 4, 30, 'MODERATE RISK'),
      generateHistoryPoint(21, 3, 3, 3, 4, 32, 'MODERATE RISK'),
      generateHistoryPoint(14, 2, 3, 3, 3, 31, 'MODERATE RISK'),
      generateHistoryPoint(7, 4, 5, 2, 2, 62, 'HIGH RISK'),
      generateHistoryPoint(1, 5, 5, 1, 1, 75, 'HIGH RISK')
    ];
  } else if (index === 3) { // Person D: High risk followed by recovery (82 -> 78 -> 70 -> 61 -> 48)
    expandedSoldier.wellnessHistory = [
      generateHistoryPoint(28, 5, 5, 2, 1, 82, 'CRITICAL WELFARE RISK'),
      generateHistoryPoint(21, 5, 4, 2, 2, 78, 'HIGH RISK'),
      generateHistoryPoint(14, 4, 4, 3, 2, 70, 'HIGH RISK'),
      generateHistoryPoint(7, 4, 3, 3, 3, 61, 'HIGH RISK'),
      generateHistoryPoint(1, 3, 3, 3, 4, 48, 'ELEVATED RISK')
    ];
  } else if (index === 4) { // Person E: Stable moderate risk (approx 35-40)
    expandedSoldier.wellnessHistory = [
      generateHistoryPoint(28, 3, 3, 3, 3, 38, 'MODERATE RISK'),
      generateHistoryPoint(21, 3, 2, 3, 3, 36, 'MODERATE RISK'),
      generateHistoryPoint(14, 3, 3, 3, 3, 39, 'MODERATE RISK'),
      generateHistoryPoint(7, 3, 3, 3, 3, 38, 'MODERATE RISK'),
      generateHistoryPoint(1, 3, 3, 3, 3, 40, 'ELEVATED RISK') // barely elevated
    ];
  } else {
    // Basic fallback for remaining
    const stableScore = expandedSoldier.wellness.stressScore;
    const band = expandedSoldier.wellness.welfareRisk;
    expandedSoldier.wellnessHistory = [
      generateHistoryPoint(28, 2, 2, 3, 3, Math.max(0, stableScore - 5), band),
      generateHistoryPoint(21, 2, 2, 3, 3, Math.max(0, stableScore - 2), band),
      generateHistoryPoint(14, 2, 2, 3, 3, Math.max(0, stableScore + 1), band),
      generateHistoryPoint(7, 2, 2, 3, 3, Math.max(0, stableScore - 3), band),
      generateHistoryPoint(1, 2, 2, 3, 3, stableScore, band)
    ];
  }
  
  // Calculate trend
  expandedSoldier.wellnessTrend = calculateWellnessTrend(expandedSoldier.wellnessHistory);
  
  return expandedSoldier;
});
`;

content = content.replace(/  expandedSoldier\.wellness = calculateWellnessRisk\(expandedSoldier\);\n  return expandedSoldier;\n\}\);/g, historicalDataLogic);

fs.writeFileSync('src/context/AegisContext.jsx', content, 'utf-8');
