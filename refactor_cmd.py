import re

with open('src/pages/CommanderDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove Mission Planner Inputs
content = re.sub(r'  // Mission Planner Inputs.*?const \[missionStep, setMissionStep\] = useState\(1\);', '', content, flags=re.DOTALL)

# 2. Remove SIMULATION LOGIC
content = re.sub(r'  // ==================== SIMULATION LOGIC ====================.*?const handleSaveMission = \(\) => \{.*?\};', '', content, flags=re.DOTALL)

# 3. Remove Mission Simulator button
content = re.sub(r'        <button \s*onClick=\{\(\) => \{ setActiveSubTab\(\'mission\'\); setMissionStep\(1\); setSimulationActive\(false\); \}\} \s*className=\{activeSubTab === \'mission\' \? \'btn-cyber-primary\' : \'btn-cyber\'\}\s*>\s*Mission Simulator\s*</button>', '', content, flags=re.DOTALL)

# 4. Remove activeSubTab === 'mission' block
content = re.sub(r'      \{\/\* MISSION PLANNING SIMULATOR \*\/\}.*?\{activeSubTab === \'mission\' && \(.*?      \)\}', '', content, flags=re.DOTALL)

# 5. Remove Squad Readiness Rankings & Latest Assessments
content = re.sub(r'          \{\/\* Table: Latest Assessments \*\/\}\s*<div style=\{\{ display: \'grid\', gridTemplateColumns: \'1\.2fr 0\.8fr\', gap: 24 \}\}>.*?</div>\s*</div>\s*</div>\s*\)\}', '        </div>\n      )}', content, flags=re.DOTALL)

# 6. In Section Personnel table, remove CRI column header and data.
content = re.sub(r'<th style=\{\{ textAlign: \'center\', paddingBottom: 12 \}\}>CRI</th>', '', content)
content = re.sub(r'<td style=\{\{ padding: \'12px 0\', textAlign: \'center\', color: band\.color, fontWeight: \'bold\' \}\} className="text-mono">\{s\.cri\}</td>', '', content)

# 7. In Full Profile view, remove CRI domain scores
content = re.sub(r'                \{\/\* Section 3: CRI Pillar Breakdown \*\/\}.*?\{\/\* Section 4: Operational History \*\/\}', '{/* Section 4: Operational History */}', content, flags=re.DOTALL)

# 8. Let's fix the KPIs. Average CRI -> High Risk Count, Section Status -> Reviews Required
content = re.sub(r'Average CRI', 'Welfare Alerts', content)
content = re.sub(r'\{avgCRI\} <span style=\{\{ fontSize: \'14px\', color: \'var\(--text-muted\)\' \}\}>/ 100</span>', '{welfareHigh + welfareCritical}', content)
content = re.sub(r'Section Average', 'High & Critical Risk', content)

content = re.sub(r'Section Status', 'Welfare Review', content)
content = re.sub(r'\{sectionStatus\}', '{welfareReviewCount > 0 ? "REVIEW REQ" : "CLEAR"}', content)
content = re.sub(r'Section clearances', 'Required reviews', content)
content = re.sub(r'const sectionStatusColor = sectionStatus === \'READY\' \? \'var\(--status-ready\)\' : sectionStatus === \'DEGRADED\' \? \'var\(--status-monitor\)\' : \'var\(--status-critical\)\';', 'const sectionStatusColor = welfareReviewCount === 0 ? \'var(--status-ready)\' : \'var(--status-monitor)\';', content)

with open('src/pages/CommanderDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
