import React, { useState } from 'react';
import { AegisProvider, useAegis } from './context/AegisContext';
import Home from './pages/Home';
import Login from './pages/Login';
import AppShell from './components/AppShell';
import PersonnelDashboard from './pages/PersonnelDashboard';
import CommanderDashboard from './pages/CommanderDashboard';
import MedicalDashboard from './pages/MedicalDashboard';
import AdminDashboard from './pages/AdminDashboard';
import WellnessDashboard from './pages/WellnessDashboard';

function AppContent() {
  const { userRole } = useAegis();
  const [currentView, setCurrentView] = useState('home'); // home, login

  // Determine active view based on user role and navigation state
  const activeView = userRole === 'guest' ? (currentView === 'login' ? 'login' : 'home') : 'dashboard';

  return (
    <div style={{ position: 'relative', minHeight: '100vh', zIndex: 1 }}>
      <div className="tech-grid-overlay"></div>
      
      {activeView === 'home' && (
        <Home onNavigateToHome={() => setCurrentView('home')} onNavigateToLogin={() => setCurrentView('login')} />
      )}
      
      {activeView === 'login' && (
        <Login 
          onNavigateToHome={() => setCurrentView('home')} 
          onLoginSuccess={() => setCurrentView('dashboard')} 
        />
      )}
      
      {activeView === 'dashboard' && (
        <AppShell onNavigateToHome={() => setCurrentView('home')}>
          {userRole === 'commander' && <CommanderDashboard />}
          {userRole === 'soldier' && <PersonnelDashboard />}
          {userRole === 'medical' && <MedicalDashboard />}
          {userRole === 'admin' && <AdminDashboard />}
          {userRole === 'welfare' && <WellnessDashboard />}
        </AppShell>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AegisProvider>
      <AppContent />
    </AegisProvider>
  );
}
