const fs = require('fs');
let content = fs.readFileSync('src/context/AegisContext.jsx', 'utf-8');

const calculateTrendLogic = `
// ============================================================================
// LONGITUDINAL TREND ENGINE (STEP 9)
// ============================================================================
const calculateWellnessTrend = (history) => {
  if (!history || history.length < 3) {
    return {
      direction: 'insufficient_data',
      change: 0,
      persistence: 'none',
      recentScore: history?.[0]?.wellnessRiskScore || null,
      previousScore: null,
      baselineScore: null,
      trendStrength: 0,
      anomaly: false,
      interpretation: 'Insufficient historical data to establish a meaningful personal baseline.',
      dataSufficiency: 'Low'
    };
  }

  // Sort chronological (oldest to newest)
  const sorted = [...history].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  // Calculate personal baseline from oldest observations (first half)
  const baselineSet = sorted.slice(0, Math.max(1, Math.floor(sorted.length / 2)));
  const baselineScore = Math.round(baselineSet.reduce((acc, h) => acc + h.wellnessRiskScore, 0) / baselineSet.length);

  const recent = sorted[sorted.length - 1].wellnessRiskScore;
  const previous = sorted[sorted.length - 2].wellnessRiskScore;
  const changeFromBaseline = recent - baselineScore;

  let direction = 'stable';
  let persistence = 'none';
  let anomaly = false;
  let interpretation = 'Wellness risk remains stable near personal baseline.';
  
  // Anomaly: Sudden large jump (e.g. > 15 points in one step)
  if (Math.abs(recent - previous) >= 15) {
    anomaly = true;
    if (recent > previous) {
      interpretation = 'Significant negative deviation from recent personal baseline.';
    } else {
      interpretation = 'Significant rapid improvement from previous state.';
    }
  }

  // Determine Direction
  if (changeFromBaseline >= 10 || recent >= 60) {
    // Determine if it's persistent (last 3 points strictly increasing or staying high)
    const last3 = sorted.slice(-3);
    const isIncreasing = last3[2].wellnessRiskScore > last3[1].wellnessRiskScore && last3[1].wellnessRiskScore >= last3[0].wellnessRiskScore;
    
    if (isIncreasing && recent >= 40) {
      direction = 'deteriorating';
      persistence = 'persistent';
      interpretation = anomaly ? interpretation : 'Observed persistent deterioration in wellness metrics.';
    } else if (recent >= 60) {
      // High risk but bouncing around
      direction = 'deteriorating';
      persistence = 'emerging';
      interpretation = anomaly ? interpretation : 'Elevated risk levels detected compared to historical baseline.';
    } else {
      direction = 'deteriorating';
      persistence = 'emerging';
      interpretation = anomaly ? interpretation : 'Recent negative trend from personal baseline.';
    }
  } else if (changeFromBaseline <= -10) {
    // Determine if recovering from high
    if (baselineScore >= 60 && recent <= 50) {
      direction = 'improving';
      persistence = 'persistent';
      interpretation = 'Observed recovery pattern following historically elevated risk.';
    } else {
      direction = 'improving';
      persistence = 'none';
      interpretation = 'Improvement from historical baseline.';
    }
  } else {
    // within +/- 10 points
    direction = 'stable';
    if (recent >= 60) {
      interpretation = 'Risk remains persistently elevated.';
      persistence = 'persistent';
    }
  }

  return {
    direction,
    change: changeFromBaseline,
    persistence,
    recentScore: recent,
    previousScore: previous,
    baselineScore,
    trendStrength: Math.abs(changeFromBaseline),
    anomaly,
    interpretation,
    dataSufficiency: sorted.length >= 5 ? 'High' : 'Medium'
  };
};

const initialSoldiers = baseInitialSoldiers.map`;

content = content.replace(/const initialSoldiers = baseInitialSoldiers.map/g, calculateTrendLogic);

fs.writeFileSync('src/context/AegisContext.jsx', content, 'utf-8');
