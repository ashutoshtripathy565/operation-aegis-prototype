const fs = require('fs');

let contextContent = fs.readFileSync('src/context/AegisContext.jsx', 'utf-8');

contextContent = contextContent.replace(/  const getAdminData = \(\) => \{[\s\S]*?    \};\n  \};/g, `  const getAdminData = () => {
    if (userRole !== 'admin') throw new Error("Unauthorized: Admin clearance required.");
    return {
      totalUsers: soldiers.length,
      auditLogs,
      systemStatus: 'Online',
      personnelRoster: soldiers.map(s => ({
        id: s.id,
        name: s.name,
        rank: s.rank,
        serviceNumber: s.serviceNumber,
        deviceConnected: s.deviceConnected,
        deviceBattery: s.deviceBattery
      }))
    };
  };`);

fs.writeFileSync('src/context/AegisContext.jsx', contextContent, 'utf-8');

let adminContent = fs.readFileSync('src/pages/AdminDashboard.jsx', 'utf-8');

adminContent = adminContent.replace(/  const \{ soldiers, auditLogs, registerDevice, removeSoldier, hcWebhookConfig, updateHcWebhookConfig \} = useAegis\(\);/g, `  const { getAdminData, registerDevice, removeSoldier, hcWebhookConfig, updateHcWebhookConfig } = useAegis();\n  const { auditLogs, personnelRoster: soldiers } = getAdminData();`);

fs.writeFileSync('src/pages/AdminDashboard.jsx', adminContent, 'utf-8');
