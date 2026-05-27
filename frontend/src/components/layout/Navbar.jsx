import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <div className="navbar-brand">
          <div className="navbar-logo">✦</div>
          <span className="navbar-name">TaskFlow</span>
        </div>

        <div className="navbar-actions">
          <button
            className="btn btn-ghost btn-icon"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <div className="navbar-user" onClick={() => setMenuOpen(o => !o)}>
            <div className="navbar-avatar">{initials}</div>
            <div className="navbar-user-info">
              <span className="navbar-user-name">{user?.name}</span>
              <span className="navbar-user-role">{user?.role}</span>
            </div>
            <span className="navbar-chevron">{menuOpen ? '▴' : '▾'}</span>
          </div>

          {menuOpen && (
            <div className="navbar-menu">
              <div className="navbar-menu-item">
                <span>👤</span> {user?.email}
              </div>
              <div className="navbar-menu-divider" />
              <button className="navbar-menu-item navbar-menu-btn" onClick={() => { logout(); setMenuOpen(false); }}>
                <span>🚪</span> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
