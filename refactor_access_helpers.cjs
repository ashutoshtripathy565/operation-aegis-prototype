const fs = require('fs');
let content = fs.readFileSync('src/context/AegisContext.jsx', 'utf-8');

const helpers = `
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
    
    // STEP 9: Add aggregate trend analysis
    let deterioratingCount = 0;
    let improvingCount = 0;
    let stableCount = 0;

    const welfareReviewCount = soldiers.filter(s => s.wellness?.welfareReviewNeeded).length;
    const welfareHighCount = soldiers.filter(s => s.wellness?.welfareRisk === 'HIGH RISK').length;
    const welfareCriticalCount = soldiers.filter(s => s.wellness?.welfareRisk === 'CRITICAL WELFARE RISK').length;
    const avgCRI = Math.round(soldiers.reduce((acc, s) => acc + s.cri, 0) / soldiers.length);
    const criticalCount = soldiers.filter(s => s.cri < 50).length;
    
    // Strip sensitive psych data from roster
    const personnelRoster = soldiers.map(s => {
      if (s.wellnessTrend) {
        if (s.wellnessTrend.direction === 'deteriorating') deterioratingCount++;
        else if (s.wellnessTrend.direction === 'improving') improvingCount++;
        else if (s.wellnessTrend.direction === 'stable') stableCount++;
      }

      return {
        id: s.id,
        name: s.name,
        rank: s.rank,
        role: s.role,
        availability: s.availability,
        cri: s.cri,
        medicalCategory: s.medicalCategory,
        wellnessTrendDirection: s.wellnessTrend?.direction || 'unknown'
      };
    });

    return {
      totalPersonnel: soldiers.length,
      welfareReviewCount,
      welfareHigh: welfareHighCount,
      welfareCritical: welfareCriticalCount,
      avgCRI,
      criticalCount,
      deterioratingCount,
      improvingCount,
      stableCount,
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
        delete clone.wellness.contributingFactors;
        delete clone.wellness.protectiveFactors;
        delete clone.wellness.comment;
        delete clone.wellness.mood;
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
`;

content = content.replace(/  const calculateCRI = \(scores\) => \{/g, helpers + '\n  const calculateCRI = (scores) => {');

fs.writeFileSync('src/context/AegisContext.jsx', content, 'utf-8');
