const fs = require('fs');
let content = fs.readFileSync('src/context/AegisContext.jsx', 'utf8');

const s001 = `
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
`;

const s002 = `
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
`;

const h_s001 = `
  // S001 Deteriorating
  { id: 'h_s1_1', soldierId: 'S001', timestamp: new Date(Date.now() - 4*86400000).toISOString(), source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 3, fatigueScore: 3, sleepQualityScore: 8, moodScore: 4 } },
  { id: 'h_s1_2', soldierId: 'S001', timestamp: new Date(Date.now() - 3*86400000).toISOString(), source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 5, fatigueScore: 5, sleepQualityScore: 6, moodScore: 3 } },
  { id: 'h_s1_3', soldierId: 'S001', timestamp: new Date(Date.now() - 2*86400000).toISOString(), source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 7, fatigueScore: 7, sleepQualityScore: 5, moodScore: 2 } },
  { id: 'h_s1_4', soldierId: 'S001', timestamp: new Date(Date.now() - 1*86400000).toISOString(), source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 8, fatigueScore: 8, sleepQualityScore: 4, moodScore: 2 } },
  { id: 'h_s1_c1', soldierId: 'S001', timestamp: new Date(Date.now() - 4*86400000).toISOString(), source: 'SOLDIER', category: 'cognitive_assessment', results: { reactionTime: {score: 95}, attention: {score: 90} } },
  { id: 'h_s1_c2', soldierId: 'S001', timestamp: new Date(Date.now() - 1*86400000).toISOString(), source: 'SOLDIER', category: 'cognitive_assessment', results: { reactionTime: {score: 60}, attention: {score: 55} } },
`;

const h_s002 = `
  // S002 Stable
  { id: 'h_s2_1', soldierId: 'S002', timestamp: new Date(Date.now() - 4*86400000).toISOString(), source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 3, fatigueScore: 3, sleepQualityScore: 8, moodScore: 4 } },
  { id: 'h_s2_2', soldierId: 'S002', timestamp: new Date(Date.now() - 3*86400000).toISOString(), source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 3, fatigueScore: 4, sleepQualityScore: 8, moodScore: 4 } },
  { id: 'h_s2_3', soldierId: 'S002', timestamp: new Date(Date.now() - 2*86400000).toISOString(), source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 4, fatigueScore: 3, sleepQualityScore: 7, moodScore: 4 } },
  { id: 'h_s2_4', soldierId: 'S002', timestamp: new Date(Date.now() - 1*86400000).toISOString(), source: 'SOLDIER', category: 'wellbeing_checkin', values: { stressScore: 3, fatigueScore: 3, sleepQualityScore: 8, moodScore: 4 } },
  { id: 'h_s2_c1', soldierId: 'S002', timestamp: new Date(Date.now() - 4*86400000).toISOString(), source: 'SOLDIER', category: 'cognitive_assessment', results: { reactionTime: {score: 90}, attention: {score: 90} } },
  { id: 'h_s2_c2', soldierId: 'S002', timestamp: new Date(Date.now() - 1*86400000).toISOString(), source: 'SOLDIER', category: 'cognitive_assessment', results: { reactionTime: {score: 92}, attention: {score: 89} } },
`;

content = content.replace('const baseInitialSoldiers = [', 'const baseInitialSoldiers = [' + s001 + s002);
content = content.replace('const initialHistory = [', 'const initialHistory = [' + h_s001 + h_s002);

fs.writeFileSync('src/context/AegisContext.jsx', content);
console.log('S001 and S002 injected successfully.');
