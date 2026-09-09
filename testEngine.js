import { generatePredictiveWellnessIntelligence } from './src/services/predictiveEngine.js';

const scenarios = [
  {
    name: "1. Stable low-risk pattern",
    data: {
      workload: { weeklyDutyHours: 40, consecutiveDutyDays: 5, nightDuties: 0 },
      leaveHistory: { daysSinceLastLeave: 30, deferredLeaves: 0 },
      wellnessHistory: [
        { timestamp: "2026-06-01T00:00:00Z", stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 },
        { timestamp: "2026-07-01T00:00:00Z", stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 },
        { timestamp: "2026-08-01T00:00:00Z", stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 }
      ],
      deviceConnected: true,
      lastWatchReadings: { heartRate: 60, sleepDuration: 8.0 }
    }
  },
  {
    name: "2. Increasing workload",
    data: {
      workload: { weeklyDutyHours: 65, consecutiveDutyDays: 16, nightDuties: 4 },
      leaveHistory: { daysSinceLastLeave: 30, deferredLeaves: 0 },
      wellnessHistory: [
        { timestamp: "2026-06-01T00:00:00Z", stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 },
        { timestamp: "2026-07-01T00:00:00Z", stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 },
        { timestamp: "2026-08-01T00:00:00Z", stressScore: 2, fatigueScore: 2, sleepQualityScore: 4 }
      ],
      deviceConnected: true,
      lastWatchReadings: { heartRate: 65, sleepDuration: 7.0 }
    }
  },
  {
    name: "3. Poor recovery",
    data: {
      workload: { weeklyDutyHours: 40, consecutiveDutyDays: 5, nightDuties: 0 },
      leaveHistory: { daysSinceLastLeave: 200, deferredLeaves: 1 },
      wellnessHistory: [
        { timestamp: "2026-06-01T00:00:00Z", stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 },
        { timestamp: "2026-07-01T00:00:00Z", stressScore: 2, fatigueScore: 2, sleepQualityScore: 4 },
        { timestamp: "2026-08-01T00:00:00Z", stressScore: 3, fatigueScore: 2, sleepQualityScore: 4 }
      ],
      deviceConnected: true,
      lastWatchReadings: { heartRate: 70, sleepDuration: 7.0 }
    }
  },
  {
    name: "4. Increasing stress/fatigue",
    data: {
      workload: { weeklyDutyHours: 40, consecutiveDutyDays: 5, nightDuties: 0 },
      leaveHistory: { daysSinceLastLeave: 30, deferredLeaves: 0 },
      wellnessHistory: [
        { timestamp: "2026-06-01T00:00:00Z", stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 },
        { timestamp: "2026-07-01T00:00:00Z", stressScore: 3, fatigueScore: 2, sleepQualityScore: 4 },
        { timestamp: "2026-08-01T00:00:00Z", stressScore: 4, fatigueScore: 4, sleepQualityScore: 3 }
      ],
      deviceConnected: true,
      lastWatchReadings: { heartRate: 75, sleepDuration: 7.0 }
    }
  },
  {
    name: "5. Declining sleep",
    data: {
      workload: { weeklyDutyHours: 40, consecutiveDutyDays: 5, nightDuties: 0 },
      leaveHistory: { daysSinceLastLeave: 30, deferredLeaves: 0 },
      wellnessHistory: [
        { timestamp: "2026-06-01T00:00:00Z", stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 },
        { timestamp: "2026-07-01T00:00:00Z", stressScore: 1, fatigueScore: 2, sleepQualityScore: 3 },
        { timestamp: "2026-08-01T00:00:00Z", stressScore: 2, fatigueScore: 3, sleepQualityScore: 1 }
      ],
      deviceConnected: true,
      lastWatchReadings: { heartRate: 70, sleepDuration: 4.5 }
    }
  },
  {
    name: "6. Multiple simultaneous warning signals",
    data: {
      workload: { weeklyDutyHours: 65, consecutiveDutyDays: 16, nightDuties: 4 },
      leaveHistory: { daysSinceLastLeave: 200, deferredLeaves: 1 },
      wellnessHistory: [
        { timestamp: "2026-06-01T00:00:00Z", stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 },
        { timestamp: "2026-07-01T00:00:00Z", stressScore: 3, fatigueScore: 3, sleepQualityScore: 3 },
        { timestamp: "2026-08-01T00:00:00Z", stressScore: 5, fatigueScore: 5, sleepQualityScore: 1 }
      ],
      deviceConnected: true,
      lastWatchReadings: { heartRate: 95, sleepDuration: 4.0 }
    }
  },
  {
    name: "7. Insufficient historical data",
    data: {
      workload: { weeklyDutyHours: 40, consecutiveDutyDays: 5, nightDuties: 0 },
      leaveHistory: { daysSinceLastLeave: 30, deferredLeaves: 0 },
      wellnessHistory: [
        { timestamp: "2026-08-01T00:00:00Z", stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 }
      ],
      deviceConnected: true,
      lastWatchReadings: { heartRate: 60, sleepDuration: 8.0 }
    }
  },
  {
    name: "8. Missing biometric data",
    data: {
      workload: { weeklyDutyHours: 40, consecutiveDutyDays: 5, nightDuties: 0 },
      leaveHistory: { daysSinceLastLeave: 30, deferredLeaves: 0 },
      wellnessHistory: [
        { timestamp: "2026-06-01T00:00:00Z", stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 },
        { timestamp: "2026-07-01T00:00:00Z", stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 },
        { timestamp: "2026-08-01T00:00:00Z", stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 }
      ],
      deviceConnected: false
    }
  },
  {
    name: "9. Improving trend",
    data: {
      workload: { weeklyDutyHours: 40, consecutiveDutyDays: 5, nightDuties: 0 },
      leaveHistory: { daysSinceLastLeave: 10, deferredLeaves: 0 },
      wellnessHistory: [
        { timestamp: "2026-05-01T00:00:00Z", stressScore: 4, fatigueScore: 4, sleepQualityScore: 2 },
        { timestamp: "2026-06-01T00:00:00Z", stressScore: 4, fatigueScore: 4, sleepQualityScore: 2 },
        { timestamp: "2026-07-01T00:00:00Z", stressScore: 2, fatigueScore: 2, sleepQualityScore: 4 },
        { timestamp: "2026-08-01T00:00:00Z", stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 }
      ],
      deviceConnected: true,
      lastWatchReadings: { heartRate: 60, sleepDuration: 8.0 }
    }
  },
  {
    name: "10. High risk but low confidence",
    data: {
      // Workload missing
      // Recovery missing
      wellnessHistory: [
        { timestamp: "2026-06-01T00:00:00Z", stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 },
        { timestamp: "2026-07-01T00:00:00Z", stressScore: 4, fatigueScore: 4, sleepQualityScore: 2 },
        { timestamp: "2026-08-01T00:00:00Z", stressScore: 5, fatigueScore: 5, sleepQualityScore: 1 }
      ],
      deviceConnected: false
    }
  }
];

scenarios.forEach(s => {
  const result = generatePredictiveWellnessIntelligence(s.data);
  console.log(`\n--- ${s.name} ---`);
  console.log(`Risk Band: ${result.riskBand}`);
  console.log(`Direction: ${result.direction}`);
  console.log(`Confidence: ${result.confidence}%`);
  console.log(`Contributing Factors: ${result.contributingFactors.map(f => f.factor).join(', ') || 'None'}`);
  console.log(`Recommendations: ${result.recommendations.join(' | ') || 'None'}`);
});
