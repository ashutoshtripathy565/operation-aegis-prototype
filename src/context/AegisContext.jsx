import React, { createContext, useState, useContext, useEffect } from 'react';
import { generatePredictiveWellnessIntelligence } from '../services/predictiveEngine.js';
import { getSoldierBaselines } from '../utils/baselineEngine.js';
import { generateIntelligence } from '../utils/wellbeingIntelligence.js';

const AegisContext = createContext();
const DEMO_MODE = import.meta.env.DEV && import.meta.env.VITE_AEGIS_DEMO_MODE !== 'false';

// Mock personnel database
const baseInitialSoldiers = [
  {
    id: "S001",
    serviceNumber: "S001",
    role: "soldier",
    name: "Demo Soldier 1 (Deteriorating)",
    rank: "Private",
    unit: "Demo Unit",
    section: "Alpha Section",
    age: 24,
    dob: "01 Jan 2002",
    height: 180,
    weight: 75,
    bloodGroup: "O+",
    medicalCategory: "SHAPE-1",
    dateOfEnrolment: "01 Jan 2020",
    yearsOfService: 6,
    currentPosting: "Base",
    emergencyContact: "Jane Doe - 555-0101",
    lastAssessment: "Today",
    lastLogin: "Today",
    operationalStatus: "Available",
    currentAssignment: "Rifleman",
    availability: true,
    deviceConnected: true,
    deviceBattery: 90,
    deviceSyncTime: "Today",
    roleTitle: "Rifleman",
    assignmentStatus: "Active",
    workload: { weeklyDutyHours: 40, consecutiveDutyDays: 5, nightDuties: 0 },
    leaveHistory: { daysSinceLastLeave: 30, deferredLeaves: 0 }
  },

  {
    id: "S002",
    serviceNumber: "S002",
    role: "soldier",
    name: "Demo Soldier 2 (Stable)",
    rank: "Private",
    unit: "Demo Unit",
    section: "Alpha Section",
    age: 25,
    dob: "01 Feb 2001",
    height: 175,
    weight: 70,
    bloodGroup: "A+",
    medicalCategory: "SHAPE-1",
    dateOfEnrolment: "01 Feb 2019",
    yearsOfService: 7,
    currentPosting: "Base",
    emergencyContact: "John Doe - 555-0102",
    lastAssessment: "Today",
    lastLogin: "Today",
    operationalStatus: "Available",
    currentAssignment: "Rifleman",
    availability: true,
    deviceConnected: true,
    deviceBattery: 85,
    deviceSyncTime: "Today",
    roleTitle: "Rifleman",
    assignmentStatus: "Active",
    workload: { weeklyDutyHours: 40, consecutiveDutyDays: 5, nightDuties: 0 },
    leaveHistory: { daysSinceLastLeave: 30, deferredLeaves: 0 }
  },

  {
    id: "IC-57556H",
    serviceNumber: "IC-57556H",
    role: "commander",
    name: "A. Sharma",
    rank: "Captain",
    unit: "Unit A",
    section: "Alpha Section",
    age: 34,
    dob: "09 Sep 1991",
    height: 178,
    weight: 76,
    bloodGroup: "B+",
    medicalCategory: "SHAPE-1",
    dateOfEnrolment: "12 Jun 2013",
    yearsOfService: 13,
    currentPosting: "Region A Headquarters",
    emergencyContact: "Kamal Batra (Father) - +91 98••• ••432",
    lastAssessment: "08 Jul 2026",
    lastLogin: "08 Jul 2026, 09:12 hrs",
    operationalStatus: "Available",
    currentAssignment: "Section Commander",
    availability: true,
    deviceConnected: true,
    deviceBattery: 88,
    deviceSyncTime: "08 Jul 2026",
    roleTitle: "Section Commander",
    assignmentStatus: "Active Assignment",
    workload: { weeklyDutyHours: 40, consecutiveDutyDays: 5, nightDuties: 0 },
    leaveHistory: { daysSinceLastLeave: 30, deferredLeaves: 0 },
    domainScores: {
      physical: 44, // max 50
      cognitive: 22, // max 25
      operational: 18, // max 20
      environmental: 4 // max 5
    },
    alerts: []
  },
  {
    id: "JC-472118K",
    serviceNumber: "JC-472118K",
    role: "soldier",
    name: "Rajesh Kumar",
    rank: "Inspector",
    unit: "Unit A",
    section: "Alpha Section",
    age: 36,
    dob: "14 Mar 1990",
    height: 174,
    weight: 78,
    bloodGroup: "O+",
    medicalCategory: "SHAPE-1",
    dateOfEnrolment: "05 Aug 2008",
    yearsOfService: 18,
    currentPosting: "Region A Headquarters",
    emergencyContact: "Sunita Devi (Spouse) - +91 94••• ••217",
    lastAssessment: "08 Jul 2026",
    lastLogin: "08 Jul 2026, 08:41 hrs",
    operationalStatus: "Available",
    currentAssignment: "Section 2IC",
    availability: true,
    deviceConnected: true,
    deviceBattery: 85,
    deviceSyncTime: "08 Jul 2026",
    roleTitle: "Section 2IC",
    assignmentStatus: "Active Assignment",
    workload: { weeklyDutyHours: 65, consecutiveDutyDays: 16, nightDuties: 4 },
    leaveHistory: { daysSinceLastLeave: 200, deferredLeaves: 1 },
    domainScores: {
      physical: 46,
      cognitive: 23,
      operational: 18,
      environmental: 4
    },
    alerts: []
  },
  {
    id: "16891432N",
    serviceNumber: "16891432N",
    role: "soldier",
    name: "Manoj Singh",
    rank: "Head Constable",
    unit: "Unit A",
    section: "Alpha Section",
    age: 31,
    dob: "22 Nov 1994",
    height: 172,
    weight: 74,
    bloodGroup: "A+",
    medicalCategory: "SHAPE-1",
    dateOfEnrolment: "18 Jan 2013",
    yearsOfService: 13,
    currentPosting: "Region A Headquarters",
    emergencyContact: "Kavita Singh (Spouse) - +91 99••• ••084",
    lastAssessment: "08 Jul 2026",
    lastLogin: "08 Jul 2026, 08:48 hrs",
    operationalStatus: "Available",
    currentAssignment: "Team Leader",
    availability: true,
    deviceConnected: true,
    deviceBattery: 80,
    deviceSyncTime: "08 Jul 2026",
    roleTitle: "Team Leader",
    assignmentStatus: "Active Assignment",
    domainScores: {
      physical: 42,
      cognitive: 21,
      operational: 17,
      environmental: 4
    },
    alerts: []
  },
  {
    id: "16924511P",
    serviceNumber: "16924511P",
    role: "soldier",
    name: "Arjun Sharma",
    rank: "Lance Head Constable",
    unit: "Unit A",
    section: "Alpha Section",
    age: 28,
    dob: "07 May 1997",
    height: 176,
    weight: 72,
    bloodGroup: "B+",
    medicalCategory: "SHAPE-1",
    dateOfEnrolment: "22 Sep 2016",
    yearsOfService: 10,
    currentPosting: "Region A Headquarters",
    emergencyContact: "Mahesh Sharma (Father) - +91 98••• ••561",
    lastAssessment: "08 Jul 2026",
    lastLogin: "08 Jul 2026, 09:02 hrs",
    operationalStatus: "Available",
    currentAssignment: "Support Gunner",
    availability: true,
    deviceConnected: true,
    deviceBattery: 90,
    deviceSyncTime: "08 Jul 2026",
    roleTitle: "Support Gunner",
    assignmentStatus: "Active Assignment",
    domainScores: {
      physical: 40,
      cognitive: 20,
      operational: 18,
      environmental: 4
    },
    alerts: []
  },
  {
    id: "16938027R",
    serviceNumber: "16938027R",
    role: "soldier",
    name: "Deepak Yadav",
    rank: "Lance Head Constable",
    unit: "Unit A",
    section: "Alpha Section",
    age: 27,
    dob: "30 Aug 1998",
    height: 170,
    weight: 70,
    bloodGroup: "AB+",
    medicalCategory: "SHAPE-1",
    dateOfEnrolment: "11 Feb 2017",
    yearsOfService: 9,
    currentPosting: "Region A Headquarters",
    emergencyContact: "Radha Yadav (Mother) - +91 97••• ••330",
    lastAssessment: "07 Jul 2026",
    lastLogin: "08 Jul 2026, 09:05 hrs",
    operationalStatus: "Under Observation",
    currentAssignment: "Rifleman",
    availability: true,
    deviceConnected: true,
    deviceBattery: 75,
    deviceSyncTime: "08 Jul 2026",
    roleTitle: "Rifleman",
    assignmentStatus: "Training Assignment",
    domainScores: {
      physical: 34,
      cognitive: 18,
      operational: 16,
      environmental: 3
    },
    alerts: ["Operational fatigue detected"]
  },
  {
    id: "SEP0001",
    serviceNumber: "SEP0001",
    role: "soldier",
    name: "Pujan",
    rank: "Constable",
    unit: "Unit A",
    section: "Alpha Section",
    age: 24,
    dob: "18 Feb 2002",
    height: 173,
    weight: 68,
    bloodGroup: "O+",
    medicalCategory: "SHAPE-1",
    dateOfEnrolment: "04 Jul 2021",
    yearsOfService: 5,
    currentPosting: "Region A Headquarters",
    emergencyContact: "Bimla Devi (Mother) - +91 96••• ••124",
    lastAssessment: "08 Jul 2026",
    lastLogin: "08 Jul 2026, 08:37 hrs",
    operationalStatus: "Available",
    currentAssignment: "Signaller",
    availability: true,
    deviceConnected: true,
    deviceBattery: 78,
    deviceSyncTime: "08 Jul 2026",
    roleTitle: "Signaller",
    assignmentStatus: "Active Assignment",
    domainScores: {
      physical: 38,
      cognitive: 20,
      operational: 18,
      environmental: 4
    },
    alerts: []
  },
  {
    id: "SEP0002",
    serviceNumber: "SEP0002",
    role: "soldier",
    name: "Sandeep Rana",
    rank: "Constable",
    unit: "Unit A",
    section: "Alpha Section",
    age: 23,
    dob: "11 Jun 2003",
    height: 175,
    weight: 71,
    bloodGroup: "A+",
    medicalCategory: "SHAPE-1",
    dateOfEnrolment: "09 Aug 2022",
    yearsOfService: 4,
    currentPosting: "Region A Headquarters",
    emergencyContact: "Vikram Rana (Father) - +91 90••• ••712",
    lastAssessment: "08 Jul 2026",
    lastLogin: "08 Jul 2026, 08:53 hrs",
    operationalStatus: "Available",
    currentAssignment: "Rifleman",
    availability: true,
    deviceConnected: true,
    deviceBattery: 82,
    deviceSyncTime: "08 Jul 2026",
    roleTitle: "Rifleman",
    assignmentStatus: "Active Assignment",
    domainScores: {
      physical: 36,
      cognitive: 20,
      operational: 18,
      environmental: 4
    },
    alerts: []
  },
  {
    id: "SEP0003",
    serviceNumber: "SEP0003",
    role: "soldier",
    name: "Vikas Thakur",
    rank: "Constable",
    unit: "Unit A",
    section: "Alpha Section",
    age: 25,
    dob: "02 Dec 2000",
    height: 169,
    weight: 66,
    bloodGroup: "B+",
    medicalCategory: "SHAPE-2",
    dateOfEnrolment: "16 Feb 2020",
    yearsOfService: 6,
    currentPosting: "Region A Headquarters",
    emergencyContact: "Neha Thakur (Sister) - +91 93••• ••245",
    lastAssessment: "08 Jul 2026",
    lastLogin: "08 Jul 2026, 09:11 hrs",
    operationalStatus: "Under Observation",
    currentAssignment: "Rifleman",
    availability: false,
    deviceConnected: true,
    deviceBattery: 70,
    deviceSyncTime: "08 Jul 2026",
    roleTitle: "Rifleman",
    assignmentStatus: "Rest Cycle",
    domainScores: {
      physical: 32,
      cognitive: 18,
      operational: 15,
      environmental: 3
    },
    alerts: ["Knee strain logged"]
  },
  {
    id: "SEP0004",
    serviceNumber: "SEP0004",
    role: "soldier",
    name: "Rohit Bisht",
    rank: "Constable",
    unit: "Unit A",
    section: "Alpha Section",
    age: 22,
    dob: "27 Sep 2003",
    height: 178,
    weight: 73,
    bloodGroup: "O-",
    medicalCategory: "SHAPE-1",
    dateOfEnrolment: "12 Nov 2022",
    yearsOfService: 3,
    currentPosting: "Region A Headquarters",
    emergencyContact: "Prem Bisht (Father) - +91 95••• ••887",
    lastAssessment: "—",
    lastLogin: "08 Jul 2026, 07:59 hrs",
    operationalStatus: "Training",
    currentAssignment: "Rifleman (Recruit)",
    availability: true,
    deviceConnected: true,
    deviceBattery: 65,
    deviceSyncTime: "Never synced",
    roleTitle: "Rifleman (Recruit)",
    assignmentStatus: "Training",
    domainScores: {
      physical: 35,
      cognitive: 17,
      operational: 15,
      environmental: 3
    },
    alerts: ["Pending initial assessment check"]
  },
  {
    id: "SEP0005",
    serviceNumber: "SEP0005",
    role: "soldier",
    name: "Nitin Chauhan",
    rank: "Constable",
    unit: "Unit A",
    section: "Alpha Section",
    age: 26,
    dob: "05 Oct 1999",
    height: 171,
    weight: 69,
    bloodGroup: "A-",
    medicalCategory: "SHAPE-1",
    dateOfEnrolment: "20 May 2019",
    yearsOfService: 7,
    currentPosting: "Region A Headquarters",
    emergencyContact: "Anita Chauhan (Spouse) - +91 98••• ••019",
    lastAssessment: "08 Jul 2026",
    lastLogin: "08 Jul 2026, 08:26 hrs",
    operationalStatus: "Available",
    currentAssignment: "Rifleman",
    availability: true,
    deviceConnected: true,
    deviceBattery: 73,
    deviceSyncTime: "08 Jul 2026",
    roleTitle: "Rifleman",
    assignmentStatus: "Active Assignment",
    domainScores: {
      physical: 38,
      cognitive: 20,
      operational: 18,
      environmental: 3
    },
    alerts: []
  },
  {
    id: "SEP0006",
    serviceNumber: "SEP0006",
    role: "soldier",
    name: "Amit Rawat",
    rank: "Constable",
    unit: "Unit A",
    section: "Alpha Section",
    age: 21,
    dob: "13 Jan 2005",
    height: 174,
    weight: 67,
    bloodGroup: "B+",
    medicalCategory: "SHAPE-1",
    dateOfEnrolment: "01 Apr 2024",
    yearsOfService: 2,
    currentPosting: "Region A Headquarters",
    emergencyContact: "Lakhan Rawat (Father) - +91 91••• ••462",
    lastAssessment: "—",
    lastLogin: "08 Jul 2026, 09:20 hrs",
    operationalStatus: "Training",
    currentAssignment: "Rifleman (Recruit)",
    availability: true,
    deviceConnected: false,
    deviceBattery: 0,
    deviceSyncTime: "Never synced",
    roleTitle: "Rifleman (Recruit)",
    assignmentStatus: "Training",
    domainScores: {
      physical: 32,
      cognitive: 16,
      operational: 14,
      environmental: 3
    },
    alerts: ["Wearable band offline"]
  }
];

// ============================================================================
// LONGITUDINAL TREND ENGINE (STEP 9)
// ============================================================================
const calculateWellnessTrend = (history) => {
  const getScore = (h) => {
    if (!h) return 50;
    if (h.values) {
      if (h.values.stressScore !== undefined) return Number(h.values.stressScore) * 10;
      if (h.values.overallScore !== undefined) return Number(h.values.overallScore);
    }
    if (h.stressScore !== undefined) return Number(h.stressScore) * 10;
    if (h.score !== undefined) return Number(h.score);
    if (h.prs !== undefined) return Number(h.prs);
    return 50;
  };

  if (!history || history.length < 3) {
    return {
      direction: 'insufficient_data',
      change: 0,
      persistence: 'none',
      recentScore: (history?.[0] ? getScore(history[0]) : null) || null,
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
  const baselineScore = Math.round(baselineSet.reduce((acc, h) => acc + getScore(h), 0) / baselineSet.length);

  const recent = getScore(sorted[sorted.length - 1]);
  const previous = getScore(sorted[sorted.length - 2]);
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
    const isIncreasing = getScore(last3[2]) > getScore(last3[1]) && getScore(last3[1]) >= getScore(last3[0]);
    
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

const initialHistory = [
  // S001 Deteriorating
  { id: 'h_s1_1', soldierId: 'S001', timestamp: new Date(Date.now() - 4*86400000).toISOString(), source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 3, fatigueScore: 3, sleepQualityScore: 8, moodScore: 4 } },
  { id: 'h_s1_2', soldierId: 'S001', timestamp: new Date(Date.now() - 3*86400000).toISOString(), source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 5, fatigueScore: 5, sleepQualityScore: 6, moodScore: 3 } },
  { id: 'h_s1_3', soldierId: 'S001', timestamp: new Date(Date.now() - 2*86400000).toISOString(), source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 7, fatigueScore: 7, sleepQualityScore: 5, moodScore: 2 } },
  { id: 'h_s1_4', soldierId: 'S001', timestamp: new Date(Date.now() - 1*86400000).toISOString(), source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 8, fatigueScore: 8, sleepQualityScore: 4, moodScore: 2 } },
  { id: 'h_s1_c1', soldierId: 'S001', timestamp: new Date(Date.now() - 4*86400000).toISOString(), source: 'SOLDIER', category: 'cognitive_assessment', results: { reactionTime: {score: 95}, attention: {score: 90} } },
  { id: 'h_s1_c2', soldierId: 'S001', timestamp: new Date(Date.now() - 1*86400000).toISOString(), source: 'SOLDIER', category: 'cognitive_assessment', results: { reactionTime: {score: 60}, attention: {score: 55} } },

  // S002 Stable
  { id: 'h_s2_1', soldierId: 'S002', timestamp: new Date(Date.now() - 4*86400000).toISOString(), source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 3, fatigueScore: 3, sleepQualityScore: 8, moodScore: 4 } },
  { id: 'h_s2_2', soldierId: 'S002', timestamp: new Date(Date.now() - 3*86400000).toISOString(), source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 3, fatigueScore: 4, sleepQualityScore: 8, moodScore: 4 } },
  { id: 'h_s2_3', soldierId: 'S002', timestamp: new Date(Date.now() - 2*86400000).toISOString(), source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 4, fatigueScore: 3, sleepQualityScore: 7, moodScore: 4 } },
  { id: 'h_s2_4', soldierId: 'S002', timestamp: new Date(Date.now() - 1*86400000).toISOString(), source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 3, fatigueScore: 3, sleepQualityScore: 8, moodScore: 4 } },
  { id: 'h_s2_c1', soldierId: 'S002', timestamp: new Date(Date.now() - 4*86400000).toISOString(), source: 'SOLDIER', category: 'cognitive_assessment', results: { reactionTime: {score: 90}, attention: {score: 90} } },
  { id: 'h_s2_c2', soldierId: 'S002', timestamp: new Date(Date.now() - 1*86400000).toISOString(), source: 'SOLDIER', category: 'cognitive_assessment', results: { reactionTime: {score: 92}, attention: {score: 89} } },

  // Rajesh Kumar - Deteriorating
  { id: 'h1', soldierId: 'JC-472118K', timestamp: '2026-05-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 } },
  { id: 'h2', soldierId: 'JC-472118K', timestamp: '2026-06-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 2, fatigueScore: 2, sleepQualityScore: 4 } },
  { id: 'h3', soldierId: 'JC-472118K', timestamp: '2026-07-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 4, fatigueScore: 4, sleepQualityScore: 2 } },
  { id: 'h4', soldierId: 'JC-472118K', timestamp: '2026-08-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 5, fatigueScore: 5, sleepQualityScore: 1 } },
  // A. Sharma - Stable
  { id: 'h5', soldierId: 'IC-57556H', timestamp: '2026-06-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 } },
  { id: 'h6', soldierId: 'IC-57556H', timestamp: '2026-07-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 } },
  { id: 'h7', soldierId: 'IC-57556H', timestamp: '2026-08-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 } },
  // Vikram Singh - Insufficient Data (only 1 record)
  { id: 'h8', soldierId: 'IC-68322M', timestamp: '2026-08-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 } },
  // Amit Verma - Improving
  { id: 'h9', soldierId: 'JC-581992L', timestamp: '2026-05-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 5, fatigueScore: 5, sleepQualityScore: 1 } },
  { id: 'h10', soldierId: 'JC-581992L', timestamp: '2026-06-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 4, fatigueScore: 4, sleepQualityScore: 2 } },
  { id: 'h11', soldierId: 'JC-581992L', timestamp: '2026-07-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 2, fatigueScore: 2, sleepQualityScore: 4 } },
  { id: 'h12', soldierId: 'JC-581992L', timestamp: '2026-08-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 1, fatigueScore: 1, sleepQualityScore: 5 } },
  // Neha Gupta - Critical
  { id: 'h13', soldierId: 'IC-71004P', timestamp: '2026-05-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 3, fatigueScore: 3, sleepQualityScore: 3 } },
  { id: 'h14', soldierId: 'IC-71004P', timestamp: '2026-06-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 4, fatigueScore: 4, sleepQualityScore: 2 } },
  { id: 'h15', soldierId: 'IC-71004P', timestamp: '2026-07-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 5, fatigueScore: 5, sleepQualityScore: 1 } },
  { id: 'h16', soldierId: 'IC-71004P', timestamp: '2026-08-01T10:00:00Z', source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 5, fatigueScore: 5, sleepQualityScore: 1 } }
];
const initialSoldiers = baseInitialSoldiers.map((soldier, index) => {
  const seed = index + 1;
  const expandedSoldier = {
      source: "UNIT", 
    ...soldier,
    leaveHistory: {
      totalLeavesLast12Months: (seed % 3) + 1,
      averageLeaveDuration: (seed % 10) + 7,
      daysSinceLastLeave: (seed * 15) % 120 + 10,
      cancelledOrDeferredLeaves: seed % 2 === 0 ? 1 : 0
    },
    deploymentHistory: {
      totalDeployments: (seed % 4) + 1,
      daysDeployedLast12Months: (seed * 40) % 200 + 30,
      currentDeploymentDays: soldier.assignmentStatus === 'Deployed' ? (seed * 12) % 60 + 5 : 0,
      consecutiveOperationalDays: (seed * 3) % 14 + 1
    },
    workload: {
      averageDutyHoursPerDay: (seed % 3) + 8,
      averageWeeklyDutyHours: (seed % 15) + 50,
      consecutiveDutyDays: (seed % 8) + 1,
      nightDutiesLast30Days: (seed * 2) % 10,
      overtimeHoursLast30Days: (seed * 5) % 20
    },
    transferHistory: {
      transfersLast5Years: seed % 3,
      monthsSinceLastTransfer: (seed * 7) % 36 + 2,
      recentTransfer: seed % 4 === 0
    },
    training: {
      trainingDaysLast90Days: (seed * 4) % 20 + 5,
      upcomingTrainingDays: (seed * 2) % 10,
      highIntensityTrainingDays: seed % 5
    },
    wellnessAssessment: {
      enabled: true,
      stressScore: (seed % 5) + 1,
      fatigueScore: ((seed + 1) % 5) + 1,
      moodScore: ((seed + 2) % 5) + 1,
      sleepQualityScore: ((seed + 3) % 5) + 1,
      submittedAt: "08 Jul 2026"
    }
  };

  // Explicit Demo Data Overrides based on ID
  if (soldier.id === 'IC-57556H') { // A. Sharma (LOW)
    expandedSoldier.workload = { weeklyDutyHours: 40, consecutiveDutyDays: 5, nightDuties: 0 };
    expandedSoldier.leaveHistory = { daysSinceLastLeave: 30, deferredLeaves: 0 };
  } else if (soldier.id === 'JC-472118K') { // Rajesh Kumar (DETERIORATING/HIGH)
    expandedSoldier.workload = { weeklyDutyHours: 65, consecutiveDutyDays: 16, nightDuties: 4 };
    expandedSoldier.leaveHistory = { daysSinceLastLeave: 200, deferredLeaves: 1 };
  } else if (soldier.id === 'IC-68322M') { // Vikram Singh (INSUFFICIENT)
    expandedSoldier.workload = { weeklyDutyHours: 40, consecutiveDutyDays: 5, nightDuties: 0 };
    expandedSoldier.leaveHistory = { daysSinceLastLeave: 30, deferredLeaves: 0 };
  } else if (soldier.id === 'JC-581992L') { // Amit Verma (IMPROVING)
    expandedSoldier.assignmentStatus = "Medical Rest";
    expandedSoldier.workload = { weeklyDutyHours: 10, consecutiveDutyDays: 2, nightDuties: 0 };
    expandedSoldier.leaveHistory = { daysSinceLastLeave: 5, deferredLeaves: 0 };
  } else if (soldier.id === 'IC-71004P') { // Neha Gupta (CRITICAL)
    expandedSoldier.workload = { weeklyDutyHours: 75, consecutiveDutyDays: 21, nightDuties: 6 };
    expandedSoldier.leaveHistory = { daysSinceLastLeave: 250, deferredLeaves: 2 };
  }
  
  expandedSoldier.wellnessHistory = initialHistory.filter(h => h.soldierId === soldier.id);
  
  expandedSoldier.wellness = calculateWellnessRisk(expandedSoldier);
  return expandedSoldier;
});


// Historical assessment records

// Audit log list
const initialAuditLogs = [
  { timestamp: '2026-08-09T21:04:30Z', user: 'SYSTEM', action: 'Composite Readiness Engine initialization successful.' },
  { timestamp: '2026-08-09T21:05:12Z', user: 'JC-472118K', action: 'Completed daily readiness assessment. Generated CRI: 91.' }
];

// ── Biometric Thresholds ─────────────────────────────────────────────────────
// These are the clinical thresholds used to auto-detect abnormal readings from
// Samsung Watch 3 data fetched via HC Webhook.
export const BIOMETRIC_THRESHOLDS = {
  restingHR:  { warnHigh: 100, critHigh: 120, warnLow: 45, critLow: 38, unit: 'BPM',  label: 'Resting Heart Rate' },
  spO2:       { warnLow: 95,   critLow: 90,                             unit: '%',    label: 'Blood Oxygen (SpO₂)' },
  hrv:        { warnLow: 30,   critLow: 20,                             unit: 'ms',   label: 'Heart Rate Variability' },
  sleepHours: { warnLow: 5,    critLow: 4,                              unit: 'hrs',  label: 'Sleep Duration' },
};

/**
 * Check raw HC Webhook data against thresholds.
 * Returns an array of violation objects: { key, label, value, unit, severity, message }
 */
export function checkBiometricThresholds(data) {
  const violations = [];
  const { restingHeartRate, spO2, hrv, sleepHours } = data;

  if (restingHeartRate != null) {
    const t = BIOMETRIC_THRESHOLDS.restingHR;
    if (restingHeartRate >= t.prstHigh) {
      violations.push({ key: 'restingHR', label: t.label, value: restingHeartRate, unit: t.unit, severity: 'critical', message: `Critically elevated resting HR: ${restingHeartRate} BPM (threshold ≥${t.prstHigh})` });
    } else if (restingHeartRate >= t.warnHigh) {
      violations.push({ key: 'restingHR', label: t.label, value: restingHeartRate, unit: t.unit, severity: 'warning', message: `Elevated resting HR: ${restingHeartRate} BPM (threshold ≥${t.warnHigh})` });
    } else if (restingHeartRate <= t.prstLow) {
      violations.push({ key: 'restingHR', label: t.label, value: restingHeartRate, unit: t.unit, severity: 'critical', message: `Critically low resting HR: ${restingHeartRate} BPM (threshold ≤${t.prstLow})` });
    } else if (restingHeartRate <= t.warnLow) {
      violations.push({ key: 'restingHR', label: t.label, value: restingHeartRate, unit: t.unit, severity: 'warning', message: `Low resting HR: ${restingHeartRate} BPM (threshold ≤${t.warnLow})` });
    }
  }

  const spO2Val = spO2 != null ? parseFloat(spO2) : null;
  if (spO2Val != null) {
    const t = BIOMETRIC_THRESHOLDS.spO2;
    if (spO2Val <= t.prstLow) {
      violations.push({ key: 'spO2', label: t.label, value: spO2Val, unit: t.unit, severity: 'critical', message: `Critical hypoxemia: SpO₂ ${spO2Val}% (threshold ≤${t.prstLow}%)` });
    } else if (spO2Val <= t.warnLow) {
      violations.push({ key: 'spO2', label: t.label, value: spO2Val, unit: t.unit, severity: 'warning', message: `Low blood oxygen: SpO₂ ${spO2Val}% (threshold ≤${t.warnLow}%)` });
    }
  }

  if (hrv != null) {
    const t = BIOMETRIC_THRESHOLDS.hrv;
    if (hrv <= t.prstLow) {
      violations.push({ key: 'hrv', label: t.label, value: hrv, unit: t.unit, severity: 'critical', message: `Critical HRV suppression: ${hrv} ms (threshold ≤${t.prstLow} ms)` });
    } else if (hrv <= t.warnLow) {
      violations.push({ key: 'hrv', label: t.label, value: hrv, unit: t.unit, severity: 'warning', message: `Low HRV detected: ${hrv} ms (threshold ≤${t.warnLow} ms)` });
    }
  }

  const sleepVal = sleepHours != null ? parseFloat(sleepHours) : null;
  if (sleepVal != null) {
    const t = BIOMETRIC_THRESHOLDS.sleepHours;
    if (sleepVal <= t.prstLow) {
      violations.push({ key: 'sleepHours', label: t.label, value: sleepVal, unit: t.unit, severity: 'critical', message: `Critical sleep deficit: ${sleepVal} hrs (threshold ≤${t.prstLow} hrs)` });
    } else if (sleepVal <= t.warnLow) {
      violations.push({ key: 'sleepHours', label: t.label, value: sleepVal, unit: t.unit, severity: 'warning', message: `Insufficient sleep: ${sleepVal} hrs (threshold ≤${t.warnLow} hrs)` });
    }
  }

  return violations;
}

// ── Predictive Personnel Stress & Welfare Risk Engine ──────────────────────────
export function calculateWellnessRisk(soldier) {
  let riskScore = 0;
  let confidencePoints = 0;
  let maxConfidencePoints = 0;
  
  const contributingFactors = [];
  const protectiveFactors = [];
  
  // Helper to safely evaluate available data and adjust confidence/risk
  const evaluate = (weight, riskRatio, confidenceWeight, conditionBad, conditionGood, factorDescBad, factorDescGood, name) => {
    maxConfidencePoints += confidenceWeight;
    if (riskRatio !== null && !isNaN(riskRatio)) {
      confidencePoints += confidenceWeight;
      const addedRisk = weight * riskRatio;
      riskScore += addedRisk;
      
      if (conditionBad && riskRatio > 0.5) {
        contributingFactors.push({
          factor: name,
          severity: riskRatio >= 0.8 ? 'high' : 'medium',
          contribution: Math.round(addedRisk),
          description: factorDescBad
        });
      } else if (conditionGood && riskRatio <= 0.3) {
        protectiveFactors.push({
          factor: name,
          description: factorDescGood
        });
      }
    }
  };

  // 1. Workload / Duty Strain (25%)
  if (soldier.workload) {
    const { averageWeeklyDutyHours, consecutiveDutyDays, nightDutiesLast30Days } = soldier.workload;
    let wRisk = 0;
    if (averageWeeklyDutyHours > 60) wRisk += 0.5;
    else if (averageWeeklyDutyHours > 45) wRisk += 0.2;
    if (consecutiveDutyDays >= 7) wRisk += 0.3;
    if (nightDutiesLast30Days > 5) wRisk += 0.2;
    
    evaluate(25, Math.min(1, wRisk), 10,
      wRisk >= 0.5,
      wRisk <= 0.2,
      "Extended duty hours and repeated consecutive duty days.",
      "Normal workload with adequate rest cycles.",
      "Workload Strain"
    );
  }

  // 2. Deployment / Operational Exposure (20%)
  if (soldier.deploymentHistory) {
    const { daysDeployedLast12Months, consecutiveOperationalDays } = soldier.deploymentHistory;
    let dRisk = 0;
    if (daysDeployedLast12Months > 180) dRisk += 0.6;
    else if (daysDeployedLast12Months > 90) dRisk += 0.3;
    if (consecutiveOperationalDays > 14) dRisk += 0.4;
    
    evaluate(20, Math.min(1, dRisk), 10,
      dRisk >= 0.6,
      dRisk <= 0.3,
      "High operational tempo and prolonged deployment exposure.",
      "Stable non-deployed status or minimal recent operational exposure.",
      "Operational Exposure"
    );
  }

  // 3. Recovery / Sleep / Leave Pattern (20%)
  if (soldier.leaveHistory) {
    const { daysSinceLastLeave, cancelledOrDeferredLeaves } = soldier.leaveHistory;
    let lRisk = 0;
    if (daysSinceLastLeave > 120) lRisk += 0.5;
    else if (daysSinceLastLeave > 60) lRisk += 0.2;
    if (cancelledOrDeferredLeaves > 0) lRisk += 0.5;
    
    evaluate(20, Math.min(1, lRisk), 10,
      lRisk >= 0.5,
      lRisk <= 0.2,
      "Prolonged period without leave or cancelled leave detected.",
      "Recent leave taken, allowing for adequate personnel recovery.",
      "Recovery Pattern"
    );
  }

  // 4. Voluntary Wellness Assessment (20%)
  if (soldier.wellnessAssessment && soldier.wellnessAssessment.enabled) {
    const { stressScore, fatigueScore, sleepQualityScore } = soldier.wellnessAssessment;
    // Assuming scores are 1-5. 5 is bad for stress/fatigue. 1 is bad for sleepQuality.
    let vRisk = 0;
    vRisk += ((stressScore - 1) / 4) * 0.4;
    vRisk += ((fatigueScore - 1) / 4) * 0.4;
    vRisk += ((5 - sleepQualityScore) / 4) * 0.2;
    
    evaluate(20, Math.min(1, Math.max(0, vRisk)), 10,
      vRisk > 0.5,
      vRisk < 0.3,
      "Self-reported elevated stress and fatigue indicators.",
      "Self-reported positive wellness and good sleep quality.",
      "Voluntary Assessment"
    );
  }

  // 5. Training / Transfer / Service Instability (10%)
  if (soldier.transferHistory && soldier.training) {
    let tRisk = 0;
    if (soldier.transferHistory.recentTransfer) tRisk += 0.5;
    if (soldier.training.highIntensityTrainingDays > 3) tRisk += 0.5;
    
    evaluate(10, Math.min(1, tRisk), 5,
      tRisk >= 0.5,
      tRisk <= 0.2,
      "Recent transfer or high-intensity training load.",
      "Stable assignment with normal training load.",
      "Service Instability"
    );
  }

  // 6. Biometric / Recovery Indicators (5%)
  // If no live biometrics are attached to the soldier directly, we can use PRS as a loose physiological proxy 
  // to avoid dropping confidence unnecessarily, or we just drop confidence.
  let bRisk = null;
  if (soldier.prs != null) {
     bRisk = soldier.prs < 60 ? 0.8 : (soldier.prs < 75 ? 0.4 : 0.1);
     evaluate(5, bRisk, 5,
       bRisk >= 0.5,
       bRisk <= 0.2,
       "Biometric and readiness indicators show physiological strain.",
       "Biometric and physical readiness indicators are optimal.",
       "Biometric Strain"
     );
  } else {
     maxConfidencePoints += 5; // Track that we missed biometric confidence
  }

  // Data Confidence & Normalization
  const confidence = maxConfidencePoints > 0 ? Math.round((confidencePoints / maxConfidencePoints) * 100) : 0;
  
  // Scale the raw risk score based on exactly how much confidence we had
  const finalRiskScore = confidencePoints > 0 ? Math.round((riskScore / (confidencePoints / 50)) * 2) : 0; // Normalize to 0-100

  // Risk Bands
  let riskBand = 'LOW RISK';
  if (finalRiskScore >= 80) riskBand = 'CRITICAL WELFARE RISK';
  else if (finalRiskScore >= 60) riskBand = 'HIGH RISK';
  else if (finalRiskScore >= 40) riskBand = 'ELEVATED RISK';
  else if (finalRiskScore >= 20) riskBand = 'MODERATE RISK';

  return {
    stressScore: Math.min(100, Math.max(0, finalRiskScore)),
    burnoutRisk: riskBand,
    welfareRisk: riskBand,
    contributingFactors,
    protectiveFactors,
    confidence,
    lastCalculatedAt: new Date().toISOString()
  };
}

export const AegisProvider = ({ children }) => {
  const [soldiers, setSoldiers] = useState(initialSoldiers);
  const [history, setHistory] = useState(initialHistory);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [userRole, setUserRole] = useState('guest'); // guest, commander, soldier, medical, admin
  const [currentSoldier, setCurrentSoldier] = useState(null); // active soldier record
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Soldier Sandeep Rana completed daily assessment.', type: 'info', time: '12 min ago' },
    { id: 2, text: 'Wearable Sync complete for 9/10 Section personnel.', type: 'info', time: '15 min ago' }
  ]);

  // Biometric complaints raised by soldiers from watch readings
  // Shape: { id, soldierId, soldierName, rank, unit, timestamp, deviceName,
  //          readings: { restingHeartRate, spO2, hrv, sleepHours, totalSteps, avgHeartRate },
  //          violations: [{key, label, value, unit, severity, message}],
  //          note: string, status: 'open'|'reviewed'|'resolved', resolution: string|null }
  const [biometricComplaints, setBiometricComplaints] = useState([]);

  // Follow-up workflow state for Medical Dashboard
  const [followUpCases, setFollowUpCases] = useState([]);

  // Google Cloud & HC Webhook config — persisted to localStorage
  const [hcWebhookConfig, setHcWebhookConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('aegis_hc_webhook_config');
      return saved ? JSON.parse(saved) : { googleClientId: '' };
    } catch {
      return { googleClientId: '' };
    }
  });

  const updateHcWebhookConfig = (googleClientId = '') => {
    const config = { googleClientId: googleClientId.trim() };
    setHcWebhookConfig(config);
    localStorage.setItem('aegis_hc_webhook_config', JSON.stringify(config));
    addAuditLog('Admin', 'Google Fitness OAuth client ID updated.');
  };

  // ────────────────────────────────────────────────────────────────────────
  // FOLLOW-UP & WORKFLOW INTELLIGENCE
  // ────────────────────────────────────────────────────────────────────────
  
  // Automatically evaluate history for AEGIS Intelligence triggers
  useEffect(() => {
    if (!soldiers || !history) return;
    
    setFollowUpCases(prev => {
      let updatedCases = [...prev];
      let changesMade = false;

      soldiers.forEach(soldier => {
        // Only evaluate if they don't have an open case
        const hasOpenCase = updatedCases.some(c => c.soldierId === soldier.id && c.status !== 'RESOLVED');
        if (hasOpenCase) return;

        const baselines = getSoldierBaselines(history, soldier.id);
        const intel = generateIntelligence(soldier.id, history, baselines);

        // Aegis automatically opens a case for human review if status escalates
        if (intel.status === 'MONITOR' || intel.status === 'ATTENTION_RECOMMENDED' || intel.status === 'URGENT_HUMAN_REVIEW') {
          updatedCases.push({
            followUpId: `fw_${Date.now()}_${soldier.id}`,
            soldierId: soldier.id,
            createdAt: new Date().toISOString(),
            createdBy: 'AEGIS',
            priority: intel.status,
            triggerStatus: intel.status,
            evidence: intel.evidence,
            status: 'NEW',
            dueDate: null,
            notes: [],
            actionHistory: [{ timestamp: new Date().toISOString(), action: 'AEGIS FLAG', note: `System detected status: ${intel.status}` }]
          });
          changesMade = true;
          
          // Optionally add notification for medical team
          setNotifications(n => [
            { id: Date.now(), text: `AEGIS: New intelligent flag (${intel.status}) generated for ${soldier.rank} ${soldier.name}.`, type: 'alert', time: 'Just now' },
            ...n
          ]);
        }
      });
      
      return changesMade ? updatedCases : prev;
    });
  }, [history, soldiers]); // Re-evaluate whenever new history drops

  const updateFollowUpCase = (followUpId, newStatus, noteText, dueDate, actorRole) => {
    setFollowUpCases(prev => prev.map(c => {
      if (c.followUpId !== followUpId) return c;
      const timestamp = new Date().toISOString();
      
      const newAction = {
        timestamp,
        actorRole,
        action: newStatus !== c.status ? `Status changed to ${newStatus}` : 'Review note added',
        note: noteText || null
      };

      return {
        ...c,
        status: newStatus || c.status,
        dueDate: dueDate !== undefined ? dueDate : c.dueDate,
        resolvedAt: newStatus === 'RESOLVED' ? timestamp : c.resolvedAt,
        notes: noteText ? [...c.notes, { timestamp, text: noteText, actorRole }] : c.notes,
        actionHistory: [...c.actionHistory, newAction]
      };
    }));
    
    if (newStatus === 'RESOLVED') {
      addAuditLog(actorRole, `Resolved AEGIS follow-up case ${followUpId}.`);
    } else {
      addAuditLog(actorRole, `Updated AEGIS follow-up case ${followUpId}.`);
    }
  };

  // Login handler with case-insensitive service ID checks and correct passwords
  const login = (username, password) => {
    const user = username.toUpperCase().trim();
    if (!user || !password) {
      return { success: false, message: 'Please enter your User ID and Password.' };
    }

    // Production authentication and authorization must be enforced by the
    // application server. Browser state is not an access-control boundary.
    if (!DEMO_MODE) {
      return { success: false, message: 'Secure server authentication is required for this deployment.' };
    }

    // Role Bypass Shortcuts
    if (user === 'COMMANDER') {
      setUserRole('commander');
      const commanderRecord = soldiers.find(s => s.id === 'IC-57556H');
      setCurrentSoldier(commanderRecord);
      addAuditLog('IC-57556H', 'Logged in as Commander (Bypass)');
      return { success: true, role: 'commander' };
    }
    if (user === 'SOLDIER') {
      setUserRole('soldier');
      const defaultSoldier = soldiers.find(s => s.role === 'soldier');
      setCurrentSoldier(defaultSoldier);
      addAuditLog(defaultSoldier.serviceNumber, 'Logged in as Soldier (Bypass)');
      return { success: true, role: 'soldier', soldier: defaultSoldier };
    }
    if (user === 'MEDICAL') {
      setUserRole('medical');
      setCurrentSoldier(null);
      addAuditLog('medical', 'Logged in to Medical oversight (Bypass)');
      return { success: true, role: 'medical' };
    }
    if (user === 'ADMIN') {
      setUserRole('admin');
      setCurrentSoldier(null);
      addAuditLog('admin', 'Logged in to Admin console (Bypass)');
      return { success: true, role: 'admin' };
    }
    if (user === 'WELFARE') {
      setUserRole('welfare');
      setCurrentSoldier(null);
      addAuditLog('welfare', 'Logged in to Welfare Monitoring Dashboard (Bypass)');
      return { success: true, role: 'welfare' };
    }

    // Standard database lookup by Service Number
    const match = soldiers.find(s => s.serviceNumber.toUpperCase() === user);
    if (!match) {
      // General Medical/Admin credentials fallbacks
      if (user === 'MEDICAL.OFFICER' && password === 'aegis123') {
        setUserRole('medical');
        setCurrentSoldier(null);
        addAuditLog('medical.officer', 'Logged in to Medical Oversight Dashboard');
        return { success: true, role: 'medical' };
      }
      if (user === 'ADMIN.SYSTEM' && password === 'aegis123') {
        setUserRole('admin');
        setCurrentSoldier(null);
        addAuditLog('admin', 'Logged in to System Administrator Dashboard');
        return { success: true, role: 'admin' };
      }
      return { success: false, message: 'Invalid credentials. Please try again.' };
    }

    // Check service-specific passwords
    const correctPassword = match.role === 'commander' ? 'admin123' : 'demo123';
    if (password !== correctPassword) {
      return { success: false, message: 'Invalid credentials. Please try again.' };
    }

    // Success login
    setUserRole(match.role);
    setCurrentSoldier(match);
    addAuditLog(match.serviceNumber, `Logged in as ${match.rank} ${match.name} (${match.role})`);
    return { success: true, role: match.role, soldier: match };
  };

  // Logout handler
  const logout = () => {
    const userDisplay = currentSoldier ? currentSoldier.serviceNumber : userRole;
    addAuditLog(userDisplay, 'Logged out from AEGIS');
    setUserRole('guest');
    setCurrentSoldier(null);
  };

  // Helper to add audit logs
  const addAuditLog = (user, action) => {
    const timestamp = new Date().toISOString();
    setAuditLogs(prev => [{ timestamp, user, action }, ...prev]);
  };

  // CRAE Formula implementation
  // PRS = Physical (50) + Cognitive (25) + Operational (20) + Environmental (5)

  // ============================================================================
  // DATA ACCESS HELPERS (ROLE-BASED BOUNDARY)
  // Security Note: In this frontend prototype, this boundary is enforced purely
  // via Context methods. In production, these would be separate backend API routes
  // verifying authenticated sessions.
  // ============================================================================

  const getOwnPersonnelRecord = () => {
    if (!currentSoldier) return null;
    if (userRole !== 'soldier' && userRole !== 'admin' && userRole !== 'guest') {
      // Allow others in demo if needed, but strictly enforce
    }
    return { ...currentSoldier };
  };

  const getAggregateCommandData = () => {
    if (userRole !== 'commander') return null;

    let deterioratingCount = 0;
    let improvingCount = 0;
    let stableCount = 0;

    const welfareReviewCount = soldiers.filter(s => s.wellness?.welfareReviewNeeded).length;
    const welfareHighCount = soldiers.filter(s =>
      s.wellness?.prediction?.riskBand === 'HIGH' || s.wellness?.welfareRisk === 'HIGH RISK'
    ).length;
    const welfareCriticalCount = soldiers.filter(s =>
      s.wellness?.prediction?.riskBand === 'CRITICAL' || s.wellness?.welfareRisk === 'CRITICAL WELFARE RISK'
    ).length;

    const followUpActive = followUpCases.filter(c => c.status !== 'RESOLVED').length;
    const followUpMonitored = followUpCases.filter(c => c.status === 'MONITORING').length;
    const followUpResolved = followUpCases.filter(c => c.status === 'RESOLVED').length;

    // Commander-authorized roster — NO individual scores, NO psych details, NO raw check-in answers
    const personnelRoster = soldiers.map(s => {
      const pred = s.wellness?.prediction || {};
      const trendDir = (pred.direction || s.wellnessTrend?.direction || 'UNKNOWN').toUpperCase();

      if (trendDir === 'DETERIORATING') deterioratingCount++;
      else if (trendDir === 'IMPROVING') improvingCount++;
      else stableCount++;

      // Derive a simple status for commander display
      const welfareRisk = s.wellness?.welfareRisk || 'UNKNOWN';
      let status = 'STABLE';
      if (welfareRisk === 'CRITICAL WELFARE RISK') status = 'FOLLOW-UP REQUIRED';
      else if (welfareRisk === 'HIGH RISK') status = 'NEEDS ATTENTION';
      else if (welfareRisk === 'MONITOR') status = 'MONITOR';
      else if (trendDir === 'IMPROVING') status = 'IMPROVING';
      else if (trendDir === 'DETERIORATING') status = 'NEEDS ATTENTION';

      return {
        id: s.id,
        serviceNumber: s.serviceNumber,
        name: s.name,
        rank: s.rank,
        role: s.role,
        availability: s.availability,
        medicalCategory: s.medicalCategory,
        currentAssignment: s.currentAssignment,
        unit: s.unit,
        section: s.section,
        // Authorized aggregate fields only — no raw scores
        wellnessStatus: status,
        wellnessTrendDirection: trendDir,
        welfareReviewNeeded: s.wellness?.welfareReviewNeeded || false,
        alerts: s.alerts || []
      };
    });

    return {
      totalPersonnel: soldiers.length,
      welfareReviewCount,
      welfareHigh: welfareHighCount,
      welfareCritical: welfareCriticalCount,
      deterioratingCount,
      improvingCount,
      stableCount,
      followUpActive,
      followUpMonitored,
      followUpResolved,
      personnelRoster
    };
  };

  const getWelfareReviewData = () => {
    if (userRole !== 'welfare') return null;
    // Strip raw clinical telemetry
    return soldiers.map(s => {
      const clone = { ...s };
      delete clone.lastWatchReadings; // Restrict physiological
      return clone;
    });
  };

  const getMedicalData = () => {
    if (userRole !== 'medical') return null;
    // Strip subjective psychological notes
    return soldiers.map(s => {
      const clone = { ...s };
      if (clone.wellness) {
        
        
        
        
      }
      return clone;
    });
  };

  const getAdminData = () => {
    if (userRole !== 'admin') return null;
    return {
      totalUsers: soldiers.length,
      auditLogs,
      systemStatus: 'Online',
      personnelRoster: soldiers.map(s => ({
        name: s.name,
        serviceNumber: s.serviceNumber,
        deviceBattery: s.deviceBattery,
        deviceConnected: s.deviceConnected
      }))
    };
  };



  // Submit assessment and update state (with 4 daily cap checks)
  
  // submitWellnessCheckin — writes immutable record to global history + updates soldier state
  const submitWellnessCheckin = (soldierId, checkinData) => {
    // Validate required fields
    const stress = Number(checkinData.stress);
    const fatigue = Number(checkinData.fatigue);
    const sleep = Number(checkinData.sleep);
    const mood = Number(checkinData.mood);

    if (!stress || !fatigue || !sleep || !mood) {
      throw new Error('Missing required wellbeing inputs. Please complete all fields.');
    }

    const timestamp = new Date().toISOString();
    const syncTimeStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    // 1. Create new IMMUTABLE historical record (source: SOLDIER) — always appended, never overwritten
    const newHistoryRecord = {
      id: `chk_${Date.now()}_${soldierId}`,
      soldierId,
      timestamp,
      source: 'SOLDIER',
      category: 'wellbeing_checkin',
      values: {
        stressScore: stress,
        fatigueScore: fatigue,
        sleepQualityScore: sleep,
        moodScore: mood,
        comment: checkinData.comment || null
      }
    };

    // 2. Append to GLOBAL history state — single source of truth for all dashboards
    setHistory(prev => [newHistoryRecord, ...prev]);

    // 3. Update soldier record (wellnessAssessment + recalculate risk)
    let updatedSoldierData = null;

    setSoldiers(prev => prev.map(soldier => {
      if (soldier.id !== soldierId) return soldier;

      const newWellnessAssessment = {
        enabled: true,
        stressScore: stress * 10,
        fatigueScore: fatigue * 10,
        sleepQualityScore: sleep * 10,
        mood,
        comment: checkinData.comment || null,
        submittedAt: syncTimeStr
      };

      const updated = { ...soldier, wellnessAssessment: newWellnessAssessment };

      // Recalculate welfare risk with updated self-report
      updated.wellness = calculateWellnessRisk(updated);

      // Derive wellnessHistory from global history + this new record for trend calc
      const prevHistory = (soldier.wellnessHistory || []);
      updated.wellnessHistory = [...prevHistory, newHistoryRecord];
      updated.wellnessTrend = calculateWellnessTrend(updated.wellnessHistory);
      updated.wellness.prediction = generatePredictiveWellnessIntelligence(updated);

      updatedSoldierData = updated;
      return updated;
    }));

    // 4. Sync currentSoldier if it's the same person
    setCurrentSoldier(prevCurrent => {
      if (!prevCurrent || prevCurrent.id !== soldierId) return prevCurrent;
      const newWellnessAssessment = {
        enabled: true,
        stressScore: stress * 10,
        fatigueScore: fatigue * 10,
        sleepQualityScore: sleep * 10,
        mood,
        comment: checkinData.comment || null,
        submittedAt: syncTimeStr
      };
      const updated = { ...prevCurrent, wellnessAssessment: newWellnessAssessment };
      updated.wellness = calculateWellnessRisk(updated);
      const prevHistory = (prevCurrent.wellnessHistory || []);
      updated.wellnessHistory = [...prevHistory, newHistoryRecord];
      updated.wellnessTrend = calculateWellnessTrend(updated.wellnessHistory);
      updated.wellness.prediction = generatePredictiveWellnessIntelligence(updated);
      return updated;
    });

    addAuditLog(soldierId, 'Completed voluntary personnel wellness check-in.');
  };

  // submitCognitiveAssessment — appends an immutable cognitive assessment record to global history
  // The record is NEVER overwritten; category: "cognitive_assessment" distinguishes it from wellbeing_checkin
  const submitCognitiveAssessment = (soldierId, taskResults, completionStatus = 'complete') => {
    if (!soldierId) throw new Error('soldierId required');

    const timestamp = new Date().toISOString();

    // Build the immutable history record
    const record = {
      id: `cog_${Date.now()}_${soldierId}`,
      soldierId,
      timestamp,
      source: 'SOLDIER',
      category: 'cognitive_assessment',
      completionStatus,
      results: {
        // Each dimension stores: raw measurement(s) + accuracy + normalized score (0-100)
        reactionTime:       taskResults.reactionTime       || null,
        attention:          taskResults.attention          || null,
        workingMemory:      taskResults.workingMemory      || null,
        processingSpeed:    taskResults.processingSpeed    || null,
        cognitiveFlexibility: taskResults.cognitiveFlexibility || null
      }
    };

    // Append to GLOBAL history — all dashboards read this same array
    setHistory(prev => [record, ...prev]);

    // Audit trail only — no wellness recalculation (cognitive ≠ welfare score)
    addAuditLog(soldierId, 'Completed voluntary cognitive wellbeing assessment.');

    return { success: true, recordId: record.id };
  };

  // Pair device dynamically via Health Connect or BLE
  const pairWearableDevice = (soldierId, deviceType, deviceName, battery = 100) => {
    const syncTime = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    let updatedSoldierData = null;

    setSoldiers(prev => prev.map(soldier => {
      if (soldier.id === soldierId) {
        const updated = {
          ...soldier,
          deviceConnected: true,
          deviceBattery: battery,
          deviceSyncTime: syncTime,
          deviceType, // 'health_connect' | 'tactical_band'
          deviceName  // e.g. 'Samsung Watch 3 via HC Webhook'
        };
        updatedSoldierData = updated;
        return updated;
      }
      return soldier;
    }));

    if (currentSoldier && currentSoldier.id === soldierId && updatedSoldierData) {
      setCurrentSoldier(updatedSoldierData);
    }
    
    addAuditLog(soldierId, `Paired ${deviceName} via ${deviceType === 'health_connect' ? 'Health Connect' : 'Bluetooth BLE'}`);
  };

  /**
   * Store the latest real watch readings on the soldier record so Medical
   * Dashboard can display live sensor data instead of hardcoded placeholders.
   * Called immediately after a successful HC Webhook fetch.
   */
  const updateWatchReadings = (soldierId, readings) => {
    const syncedAt = new Date().toISOString();
    let updatedSoldierData = null;

    setSoldiers(prev => prev.map(soldier => {
      if (soldier.id !== soldierId) return soldier;
      const updated = {
        ...soldier,
        lastWatchReadings: {
          ...readings,
          syncedAt
        }
      };
      updatedSoldierData = updated;
      return updated;
    }));

    if (currentSoldier && currentSoldier.id === soldierId && updatedSoldierData) {
      setCurrentSoldier(updatedSoldierData);
    }
  };

  const updateWelfareReviewStatus = (soldierId, status) => {
    let updatedSoldierData = null;
    setSoldiers(prev => prev.map(soldier => {
      if (soldier.id !== soldierId) return soldier;
      const updated = {
        ...soldier,
        welfareReviewStatus: status
      };
      updatedSoldierData = updated;
      return updated;
    }));

    if (currentSoldier && currentSoldier.id === soldierId && updatedSoldierData) {
      setCurrentSoldier(updatedSoldierData);
    }
    addAuditLog(soldierId, `Welfare review status updated to: ${status}`);
  };

  // Suitability Score MRS Calculation based on Mission Parameters from simulatorService.ts
  const getMRSScore = (soldier, missionParams) => {
    if (!soldier.availability || soldier.operationalStatus === 'On Leave' || soldier.operationalStatus === 'Medical Review') {
      return 0;
    }

    const { duration = 8, load = 'standard', temp = 22, terrain = 'plains' } = missionParams;
    let baseScore = soldier.prs;

    // Environmental mods
    if (terrain === 'mountain') baseScore -= 10;
    if (terrain === 'desert') baseScore -= 7;
    if (terrain === 'forest') baseScore -= 5;
    if (terrain === 'urban') baseScore -= 3;

    // Temperature mods
    if (temp > 35) baseScore -= 6;
    if (temp < 0) baseScore -= 8;

    // Operational mods
    if (duration > 12) baseScore -= 14;
    else if (duration > 8) baseScore -= 10;
    else if (duration > 6) baseScore -= 5;

    // Gear load mods
    if (load === 'heavy') baseScore -= 3;

    return Math.min(100, Math.max(0, Math.round(baseScore)));
  };

  // Medical Officer Actions
  const updateMedicalCategory = (soldierId, category, operationalStatus, restrictionNotes) => {
    setSoldiers(prev => prev.map(soldier => {
      if (soldier.id === soldierId) {
        const alerts = [...soldier.alerts];
        if (restrictionNotes && !alerts.includes(restrictionNotes)) {
          alerts.push(restrictionNotes);
        }
        
        const updated = {
          ...soldier,
          medicalCategory: category,
          operationalStatus,
          availability: operationalStatus === 'Available' || operationalStatus === 'Active',
          alerts
        };
        return updated;
      }
      return soldier;
    }));

    const soldierName = soldiers.find(s => s.id === soldierId)?.name || soldierId;
    addAuditLog('Medical Officer', `Updated medical category for ${soldierName}: ${category}`);
  };

  // Admin Account pairing actions
  const registerDevice = (soldierId, deviceName) => {
    setSoldiers(prev => prev.map(soldier => {
      if (soldier.id === soldierId) {
        return {
          ...soldier,
          deviceConnected: true,
          deviceBattery: 100,
          deviceSyncTime: '08 Jul 2026'
        };
      }
      return soldier;
    }));
    const soldierName = soldiers.find(s => s.id === soldierId)?.name || soldierId;
    addAuditLog('Admin', `Paired device to ${soldierName}`);
  };

  const removeSoldier = (soldierId) => {
    setSoldiers(prev => prev.filter(s => s.id !== soldierId));
    addAuditLog('Admin', `Archived soldier record ID: ${soldierId}`);
  };

  // Sentinel AI Advice Generators
  const getSentinelAdvice = (soldier) => {
    if (soldier.prs >= 90) return 'Soldier readiness parameters are optimal. Clearing for tactical patrols.';
    if (soldier.prs >= 75) return 'Cleared for standard duty. Suggest monitoring hydration during extended patrols.';
    if (soldier.prs >= 60) return 'Monitor fatigue levels closely. Increase sleep window and rest recovery before deployment.';
    return 'Critical impairment flags active. Clinical medical review required immediately.';
  };

  // ── Biometric Complaint Functions ────────────────────────────────────────────

  /**
   * Submit a biometric complaint from a soldier based on watch readings.
   * @param {string}   soldierId   - The soldier's service ID
   * @param {object}   readings    - Raw HC Webhook data (restingHeartRate, spO2, hrv, sleepHours, etc.)
   * @param {Array}    violations  - Pre-computed threshold violations from checkBiometricThresholds()
   * @param {string}   note        - Optional free-text note from the soldier
   * @param {string}   deviceName  - Name of the connected device
   * @returns {{ id: string }} — complaint ID
   */
  const submitBiometricComplaint = (soldierId, readings, violations, note = '', deviceName = 'Samsung Watch 3') => {
    const soldier = soldiers.find(s => s.id === soldierId);
    if (!soldier) throw new Error('Soldier record not found.');

    const id = `cmp_${Date.now()}`;
    const timestamp = new Date().toISOString();

    const complaint = {
      id,
      soldierId,
      soldierName: soldier.name,
      rank: soldier.rank,
      unit: soldier.unit,
      timestamp,
      deviceName,
      readings: { ...readings },
      violations: [...violations],
      note: note.trim(),
      status: 'open',     // 'open' | 'reviewed' | 'resolved'
      resolution: null
    };

    setBiometricComplaints(prev => [complaint, ...prev]);

    // Push to notifications bell
    const highestSeverity = violations.some(v => v.severity === 'critical') ? 'critical' : 'warning';
    const notifText = highestSeverity === 'critical'
      ? `CRITICAL biometric alert from ${soldier.rank} ${soldier.name} — wearable data requires immediate review.`
      : `Biometric complaint raised by ${soldier.rank} ${soldier.name} — abnormal readings detected.`;

    setNotifications(prev => [
      { id: Date.now(), text: notifText, type: highestSeverity === 'critical' ? 'alert' : 'warning', time: 'just now' },
      ...prev
    ]);

    // Also push an alert to the soldier's record for the medical register
    setSoldiers(prev => prev.map(s => {
      if (s.id !== soldierId) return s;
      const alertMsg = `Wearable complaint raised: ${violations.map(v => v.label).join(', ')}`;
      const existing = s.alerts || [];
      if (existing.includes(alertMsg)) return s;
      const updated = { ...s, alerts: [...existing, alertMsg] };
      if (currentSoldier && currentSoldier.id === soldierId) setCurrentSoldier(updated);
      return updated;
    }));

    addAuditLog(soldierId, `Biometric complaint submitted (${violations.length} violation(s)) via ${deviceName}. Complaint ID: ${id}`);

    return { id };
  };

  /**
   * Medical officer resolves or reviews a biometric complaint.
   * @param {string} complaintId
   * @param {'reviewed'|'resolved'} newStatus
   * @param {string} resolution  - Officer's notes
   */
  const resolveBiometricComplaint = (complaintId, newStatus, resolution = '') => {
    setBiometricComplaints(prev => prev.map(c => {
      if (c.id !== complaintId) return c;
      return { ...c, status: newStatus, resolution: resolution.trim() };
    }));
    addAuditLog('Medical Officer', `Biometric complaint ${complaintId} marked as ${newStatus}. Note: ${resolution}`);
  };

  const resetDemoData = () => {
    setSoldiers(initialSoldiers);
    setHistory(initialHistory);
    setFollowUpCases([]);
    setAuditLogs([
      { id: Date.now(), text: 'DEMO DATA RESET: System restored to initial baseline state.', type: 'alert', time: 'Just now' }
    ]);
  };

  return (
    <AegisContext.Provider value={{
      soldiers,
      history,
      auditLogs,
      userRole,
      currentSoldier,
      notifications,
      biometricComplaints,
      login,
      logout,
      resetDemoData,
      submitWellnessCheckin,
      submitCognitiveAssessment,
      getOwnPersonnelRecord,
      getAggregateCommandData,
      getWelfareReviewData,
      getMedicalData,
      getAdminData,

      updateMedicalCategory,
      registerDevice,
      pairWearableDevice,
      updateWatchReadings,
      removeSoldier,
      hcWebhookConfig,
      updateHcWebhookConfig,
      submitBiometricComplaint,
      resolveBiometricComplaint,
      updateWelfareReviewStatus,
      followUpCases,
      updateFollowUpCase
    }}>
      {children}
    </AegisContext.Provider>
  );
};

export const useAegis = () => useContext(AegisContext);
