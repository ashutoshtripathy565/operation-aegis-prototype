// Utility to calculate personal baselines and longitudinal trends
// Pure functions, no side effects, derived from immutable history state

/**
 * Validates whether a value is a valid numeric measurement
 */
const isValid = (val) => val !== null && val !== undefined && !isNaN(val);

/**
 * Determines trend direction and persistence for a specific metric
 * 
 * @param {Array<number>} series - Chronological array of measurements (oldest to newest)
 * @param {string} dimensionType - 'higher_is_better' or 'lower_is_better'
 * @returns {Object} Trend analysis
 */
function analyzeSeries(series, dimensionType) {
  if (!series || series.length < 3) {
    return {
      status: 'INSUFFICIENT_DATA',
      baseline: null,
      latest: series.length > 0 ? series[series.length - 1] : null,
      changeAbs: null,
      changePct: null,
      direction: 'UNKNOWN',
      persistence: 'none',
      count: series.length
    };
  }

  // Baseline is defined as the average of the earliest measurements
  // If we have many, use first 3. Otherwise, use all but the last 1.
  const baselineCount = series.length >= 4 ? 3 : 2;
  const baselineSet = series.slice(0, baselineCount);
  const baseline = baselineSet.reduce((a, b) => a + b, 0) / baselineCount;
  
  const latest = series[series.length - 1];
  const changeAbs = latest - baseline;
  const changePct = baseline !== 0 ? (changeAbs / baseline) * 100 : 0;

  // Threshold for "stable" (e.g., +/- 10% change or small absolute change)
  const isHigherBetter = dimensionType === 'higher_is_better';
  const isSignificantChange = Math.abs(changePct) > 10 || Math.abs(changeAbs) >= 1.5;

  let direction = 'STABLE';
  if (isSignificantChange) {
    if (changeAbs > 0) {
      direction = isHigherBetter ? 'IMPROVING' : 'DECLINING';
    } else {
      direction = isHigherBetter ? 'DECLINING' : 'IMPROVING';
    }
  }

  // Calculate Persistence
  // Look at the last 3 observations (or however many we have beyond baseline)
  let persistence = 'stable';
  if (direction !== 'STABLE') {
    const recent = series.slice(-3);
    const deviations = recent.filter(val => {
      const diff = val - baseline;
      const pct = baseline !== 0 ? (diff / baseline) * 100 : 0;
      if (Math.abs(pct) <= 10 && Math.abs(diff) < 1.5) return false;
      if (changeAbs > 0 && diff > 0) return true; // consistently higher
      if (changeAbs < 0 && diff < 0) return true; // consistently lower
      return false;
    });

    if (deviations.length >= 3) {
      persistence = 'persistent';
    } else if (deviations.length === 2) {
      persistence = 'short-term';
    } else {
      persistence = 'isolated fluctuation';
    }
  }

  return {
    status: 'VALID',
    baseline: Number(baseline.toFixed(1)),
    latest: Number(latest.toFixed(1)),
    changeAbs: Number(changeAbs.toFixed(1)),
    changePct: Number(changePct.toFixed(1)),
    direction,
    persistence,
    count: series.length,
    series // expose full series for charting
  };
}

export function getSoldierBaselines(history, soldierId) {
  // 1. Filter and sort history chronologically
  const soldierHistory = history
    .filter(h => h.soldierId === soldierId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  // 2. Extract series for Wellbeing
  const wbHistory = soldierHistory.filter(h => h.category === 'wellbeing_checkin' || !h.category);
  const stressSeries = wbHistory.map(h => h.values?.stressScore ?? h.stressScore).filter(isValid);
  const fatigueSeries = wbHistory.map(h => h.values?.fatigueScore ?? h.fatigueScore).filter(isValid);
  const sleepSeries = wbHistory.map(h => h.values?.sleepQualityScore ?? h.sleepQualityScore).filter(isValid);
  const moodSeries = wbHistory.map(h => h.values?.moodScore ?? h.moodScore).filter(isValid);

  // 3. Extract series for Cognitive (using normalized scores 0-100 where higher is always better)
  const cogHistory = soldierHistory.filter(h => h.category === 'cognitive_assessment');
  const rtSeries = cogHistory.map(h => h.results?.reactionTime?.score).filter(isValid);
  const attSeries = cogHistory.map(h => h.results?.attention?.score).filter(isValid);
  const wmSeries = cogHistory.map(h => h.results?.workingMemory?.score).filter(isValid);
  const psSeries = cogHistory.map(h => h.results?.processingSpeed?.score).filter(isValid);
  const flexSeries = cogHistory.map(h => h.results?.cognitiveFlexibility?.score).filter(isValid);

  // 4. Run analysis
  return {
    wellbeing: {
      stress: analyzeSeries(stressSeries, 'lower_is_better'),
      fatigue: analyzeSeries(fatigueSeries, 'lower_is_better'),
      sleep: analyzeSeries(sleepSeries, 'higher_is_better'),
      mood: analyzeSeries(moodSeries, 'higher_is_better')
    },
    cognitive: {
      reactionTime: analyzeSeries(rtSeries, 'higher_is_better'),
      attention: analyzeSeries(attSeries, 'higher_is_better'),
      workingMemory: analyzeSeries(wmSeries, 'higher_is_better'),
      processingSpeed: analyzeSeries(psSeries, 'higher_is_better'),
      cognitiveFlexibility: analyzeSeries(flexSeries, 'higher_is_better')
    },
    meta: {
      totalRecords: soldierHistory.length,
      lastUpdate: soldierHistory.length > 0 ? soldierHistory[soldierHistory.length - 1].timestamp : null
    }
  };
}
