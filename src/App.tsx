import React, { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Board } from './components/Board/Board';
import { AuthPage } from './components/Auth/AuthPage';
import { UserMenu } from './components/UserMenu/UserMenu';
import { WorkspaceSelector } from './components/WorkspaceSelector/WorkspaceSelector';
import { useAuthStore } from './store/authStore';
import { useBoardStore } from './store/boardStore';
import './App.scss';

export const App: React.FC = () => {
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const { isAuthenticated } = useAuthStore();
  const { boards, activeBoard, addBoard, setActiveBoard } = useBoardStore();

  const handleAddBoard = () => {
    if (newBoardTitle.trim()) {
      addBoard(newBoardTitle.trim());
      setNewBoardTitle('');
    }
  };

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <h1>Kabano</h1>
          <WorkspaceSelector />
          {boards.length > 0 && (
            <select
              className="board-selector"
              value={activeBoard || ''}
              onChange={(e) => setActiveBoard(e.target.value)}
            >
              {boards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.title}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="header-actions">
          <button className="add-board-button" onClick={handleAddBoard}>
            <IconPlus />
            New Board
          </button>
          <UserMenu />
        </div>
      </header>

      <main className="app-content">
        {boards.length === 0 ? (
          <div className="empty-state">
            <h2>Welcome to Kabano!</h2>
            <p>Create your first board to get started</p>
            <button className="create-board-button" onClick={handleAddBoard}>
              <IconPlus />
              Create Board
            </button>
          </div>
        ) : (
          activeBoard && (
            <Board 
              board={boards.find(board => board.id === activeBoard)!}
            />
          )
        )}
      </main>
    </div>
  );
};
