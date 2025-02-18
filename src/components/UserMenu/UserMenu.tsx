import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import './UserMenu.scss';

export const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  if (!user) return null;

  const initials = user.email
    .split('@')[0]
    .split('.')
    .map(part => part[0].toUpperCase())
    .join('');

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-avatar"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        <span className="initials">{initials}</span>
      </button>

      {isOpen && (
        <div className="menu-dropdown">
          <div className="user-info">
            <span className="user-email">{user.email}</span>
          </div>
          
          <div className="menu-section">
            <span className="workspace-label">Workspace...</span>
          </div>

          <div className="menu-section">
            <button className="logout-button" onClick={handleLogout}>
              <span className="icon">⟶</span>
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
