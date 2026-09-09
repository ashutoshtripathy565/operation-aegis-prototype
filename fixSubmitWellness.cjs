const fs = require('fs');
let ctx = fs.readFileSync('src/context/AegisContext.jsx', 'utf8');

const regex = /const submitWellnessCheckin = \(soldierId, checkinData\) => \{[\s\S]*?addAuditLog\(soldierId, 'Completed voluntary personnel wellness check-in\.'\);\n  \};/m;

const replacement = `const submitWellnessCheckin = (soldierId, checkinData) => {
    // 1. Validate the input
    if (!checkinData.stress || !checkinData.fatigue || !checkinData.sleep || !checkinData.mood) {
      throw new Error("Missing required wellbeing inputs.");
    }

    const timestamp = new Date().toISOString();
    const syncTimeStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    // 2. Create new immutable historical record
    const newHistoryRecord = {
      id: \`chk_\${Date.now()}\`,
      soldierId,
      timestamp,
      source: 'SOLDIER',
      category: 'wellbeing_checkin',
      values: {
        stressScore: checkinData.stress,
        fatigueScore: checkinData.fatigue,
        sleepQualityScore: checkinData.sleep,
        moodScore: checkinData.mood,
        comment: checkinData.comment
      }
    };

    // 6. Update central state (history)
    setHistory(prev => [newHistoryRecord, ...prev]);

    // Update central state (soldier)
    let updatedSoldierData = null;
    
    setSoldiers(prev => prev.map(soldier => {
      if (soldier.id === soldierId) {
        const newWellness = {
          enabled: true,
          stressScore: checkinData.stress * 10,
          fatigueScore: checkinData.fatigue * 10,
          sleepQualityScore: checkinData.sleep * 10,
          mood: checkinData.mood,
          comment: checkinData.comment,
          submittedAt: syncTimeStr
        };

        const updated = {
          ...soldier,
          wellnessAssessment: newWellness
        };
        
        updated.wellness = calculateWellnessRisk(updated);
        
        // Use global history to recalculate trends, plus this new point
        const currentGlobalHistory = history.filter(h => h.soldierId === soldierId);
        updated.wellnessHistory = [...currentGlobalHistory, newHistoryRecord];
        
        updated.wellnessTrend = calculateWellnessTrend(updated.wellnessHistory);
        updated.wellness.prediction = generatePredictiveWellnessIntelligence(updated);

        updatedSoldierData = updated;
        return updated;
      }
      return soldier;
    }));

    if (currentSoldier && currentSoldier.id === soldierId && updatedSoldierData) {
      setCurrentSoldier(updatedSoldierData);
    }
    
    addAuditLog(soldierId, 'Completed voluntary personnel wellness check-in.');
  };`;

ctx = ctx.replace(regex, replacement);
fs.writeFileSync('src/context/AegisContext.jsx', ctx, 'utf8');
