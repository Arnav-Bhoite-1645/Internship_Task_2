import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import Toast from './components/common/Toast';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import { useAuth } from './hooks/useAuth';
import { useSubmissions } from './hooks/useSubmissions';
import { INITIAL_TOKEN, APP_ID } from './config/constants';
import './styles/variables.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/admin.css';

/**
 * ContactVault - Secure Lead Capture System
 * Refactored with modular components and clear separation of concerns
 */


const App = () => {
  const [view, setView] = useState('home'); 
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Custom Hooks
  const user = useAuth(INITIAL_TOKEN);
  const submissions = useSubmissions(APP_ID, user, isAdminAuthenticated);

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    setStatus({ type: '', message: '' });
  };

  const handleAdminError = (message) => {
    setStatus({ type: 'error', message });
  };

  const handleViewChange = (newView) => {
    setView(newView);
    setStatus({ type: '', message: '' });
  };


  return (
    <div>
      <Navbar currentView={view} onViewChange={handleViewChange} />

      <div className="container">
        <Toast message={status.message} type={status.type} />

        {view === 'home' ? (
          <HomePage user={user} onStatus={setStatus} />
        ) : (
          <AdminPage 
            isAuthenticated={isAdminAuthenticated}
            submissions={submissions}
            onLogin={handleAdminLogin}
            onError={handleAdminError}
          />
        )}
      </div>
    </div>
  );
};

export default App;