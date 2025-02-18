import React, { useState, useRef, useEffect } from 'react';
import {
  IconPlus,
  IconChevronDown,
  IconBuildingSkyscraper,
} from '@tabler/icons-react';
import { useAuthStore } from '../../store/authStore';
import './WorkspaceSelector.scss';

export const WorkspaceSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="workspace-selector" ref={menuRef}>
      <button className="workspace-button" onClick={() => setIsOpen(!isOpen)}>
        <div className="workspace-icon">
          <IconBuildingSkyscraper size={16} />
        </div>
        <span>Workspaces</span>
        <IconChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="workspace-dropdown">
          <div className="workspace-header">
            <h3>Your Workspaces</h3>
          </div>

          <div className="workspace-list">
            {user.workspaces.map((workspace) => (
              <button key={workspace.id} className="workspace-item">
                <div className="workspace-item-icon">
                  {workspace.name.charAt(0).toUpperCase()}
                </div>
                <div className="workspace-item-info">
                  <span className="name">{workspace.name}</span>
                  <span className="type">Free</span>
                </div>
              </button>
            ))}
          </div>

          <div className="workspace-footer">
            <button className="create-workspace-button">
              <IconPlus size={16} />
              Create Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
