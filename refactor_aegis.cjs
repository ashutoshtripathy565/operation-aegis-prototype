const fs = require('fs');

let content = fs.readFileSync('src/context/AegisContext.jsx', 'utf-8');

const submitWellnessCode = `
  const submitWellnessCheckin = (soldierId, checkinData) => {
    const timestamp = new Date().toISOString();
    const syncTimeStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    let updatedSoldierData = null;
    
    setSoldiers(prev => prev.map(soldier => {
      if (soldier.id === soldierId) {
        // Prepare wellness risk recalculation based on checkin
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
        
        // Recalculate welfare risk
        updated.wellness = calculateWellnessRisk(updated);
        
        updatedSoldierData = updated;
        return updated;
      }
      return soldier;
    }));

    if (currentSoldier && currentSoldier.id === soldierId && updatedSoldierData) {
      setCurrentSoldier(updatedSoldierData);
    }
    
    addAuditLog(soldierId, 'Completed voluntary personnel wellness check-in.');
  };
`;

content = content.replace('const submitAssessment = (soldierId, scores) => {', submitWellnessCode + '\n  const submitAssessment = (soldierId, scores) => {');
content = content.replace('submitAssessment,', 'submitAssessment,\n      submitWellnessCheckin,');

fs.writeFileSync('src/context/AegisContext.jsx', content, 'utf-8');
