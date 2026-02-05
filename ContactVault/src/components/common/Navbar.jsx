import React from 'react';
import '../../styles/components.css';

const Navbar = ({ currentView, onViewChange }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        ContactVault
      </div>
      <div className="nav-links">
        <button 
          className={currentView === 'home' ? 'active' : ''} 
          onClick={() => onViewChange('home')}
        >
          Form
        </button>
        <button 
          className={currentView === 'admin' ? 'active' : ''} 
          onClick={() => onViewChange('admin')}
        >
          Admin
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
