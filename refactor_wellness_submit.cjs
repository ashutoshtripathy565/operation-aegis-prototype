const fs = require('fs');

let content = fs.readFileSync('src/context/AegisContext.jsx', 'utf-8');

// Replace the return block in submitWellnessCheckin
content = content.replace(/        \/\/ Recalculate welfare risk\n        updated\.wellness = calculateWellnessRisk\(updated\);\n        \n        updatedSoldierData = updated;\n        return updated;/g, `        // Recalculate welfare risk
        updated.wellness = calculateWellnessRisk(updated);
        
        // STEP 9: Create and append the historical observation
        const newHistoryPoint = {
          timestamp: new Date().toISOString(),
          source: 'self_report',
          stressScore: updated.wellnessAssessment.stressScore / 10, // Assuming 1-10 mapping if they passed sliders
          fatigueScore: updated.wellnessAssessment.fatigueScore / 10,
          sleepQualityScore: updated.wellnessAssessment.sleepQualityScore / 10,
          moodScore: updated.wellnessAssessment.mood,
          wellnessRiskScore: updated.wellness.stressScore,
          riskBand: updated.wellness.welfareRisk,
          confidence: updated.wellness.confidence
        };

        const existingHistory = updated.wellnessHistory || [];
        updated.wellnessHistory = [...existingHistory, newHistoryPoint];
        
        // Recalculate the trend engine using the updated history
        updated.wellnessTrend = calculateWellnessTrend(updated.wellnessHistory);

        updatedSoldierData = updated;
        return updated;`);

fs.writeFileSync('src/context/AegisContext.jsx', content, 'utf-8');
