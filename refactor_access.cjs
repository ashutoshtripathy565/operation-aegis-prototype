const fs = require('fs');
let content = fs.readFileSync('src/context/AegisContext.jsx', 'utf-8');

// I will insert the data-access helpers right before the return block of AegisProvider.
const accessHelpers = `
  // ============================================================================
  // DATA ACCESS HELPERS (ROLE-BASED BOUNDARY)
  // Security Note: In this frontend prototype, this boundary is enforced purely
  // via Context methods. In production, these would be separate backend API routes
  // verifying authenticated sessions.
  // ============================================================================

  const getOwnPersonnelRecord = () => {
    if (userRole !== 'soldier') throw new Error("Unauthorized: Active user is not personnel.");
    if (!currentSoldier) return null;
    return {
      ...currentSoldier,
      // explicitly authorized personal fields
    };
  };

  const getAggregateCommandData = () => {
    if (userRole !== 'commander' && userRole !== 'admin') throw new Error("Unauthorized: Insufficient command clearance.");
    
    const totalPersonnel = soldiers.length;
    const welfareHigh = soldiers.filter(s => s.wellness?.welfareRisk === 'HIGH RISK').length;
    const welfareCritical = soldiers.filter(s => s.wellness?.welfareRisk === 'CRITICAL WELFARE RISK').length;
    const welfareReviewCount = soldiers.filter(s => s.welfareReviewStatus === 'Review Recommended').length;
    const avgCRI = Math.round(soldiers.reduce((acc, s) => acc + s.cri, 0) / (totalPersonnel || 1));
    const criticalCount = soldiers.filter(s => s.cri < 40).length;

    // Build the aggregate workforce intelligence object
    return {
      totalPersonnel,
      welfareHigh,
      welfareCritical,
      welfareReviewCount,
      avgCRI,
      criticalCount,
      // Remove deep psychological data, only keep aggregate arrays or subsets if needed
      personnelRoster: soldiers.map(s => ({
        id: s.id,
        name: s.name,
        rank: s.rank,
        serviceNumber: s.serviceNumber,
        currentAssignment: s.currentAssignment,
        cri: s.cri,
        medicalCategory: s.medicalCategory,
        // specifically NOT including deep wellness/biometric objects here
      }))
    };
  };

  const getWelfareReviewData = () => {
    if (userRole !== 'welfare' && userRole !== 'admin') throw new Error("Unauthorized: Welfare access required.");
    
    // Welfare gets wellness data but stripped of raw clinical medical data (like exact SpO2, heart rate, etc.)
    return soldiers.map(s => {
      const cloned = { ...s };
      delete cloned.lastWatchReadings; // restrict medical clinical data
      return cloned;
    });
  };

  const getMedicalData = () => {
    if (userRole !== 'medical' && userRole !== 'admin') throw new Error("Unauthorized: Medical clearance required.");
    
    // Medical gets physiological data but stripped of subjective welfare check-ins / mood / psychological factors
    return soldiers.map(s => {
      const cloned = { ...s };
      if (cloned.wellness) {
        delete cloned.wellness.contributingFactors;
        delete cloned.wellness.protectiveFactors;
        delete cloned.wellness.mood;
        delete cloned.wellness.comment;
      }
      if (cloned.wellnessAssessment) {
        delete cloned.wellnessAssessment.mood;
        delete cloned.wellnessAssessment.comment;
      }
      return cloned;
    });
  };

  const getAdminData = () => {
    if (userRole !== 'admin') throw new Error("Unauthorized: Admin clearance required.");
    return {
      totalUsers: soldiers.length,
      auditLogs,
      systemStatus: 'Online'
    };
  };
`;

content = content.replace('  return (\n    <AegisContext.Provider', accessHelpers + '\n  return (\n    <AegisContext.Provider');

// Now inject them into the Context Provider value object
const contextValueUpdates = `
      getOwnPersonnelRecord,
      getAggregateCommandData,
      getWelfareReviewData,
      getMedicalData,
      getAdminData,
`;
content = content.replace('      submitWellnessCheckin,', '      submitWellnessCheckin,\n' + contextValueUpdates);

fs.writeFileSync('src/context/AegisContext.jsx', content, 'utf-8');
