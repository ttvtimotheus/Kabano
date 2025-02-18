import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Board, Task } from '../types';

interface BoardStore {
  boards: Board[];
  activeBoard: string | null;
  addBoard: (title: string) => void;
  setActiveBoard: (boardId: string) => void;
  addColumn: (boardId: string, title: string) => void;
  addTask: (boardId: string, columnId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  moveTask: (boardId: string, fromColumnId: string, toColumnId: string, taskId: string, index: number) => void;
  updateTask: (boardId: string, columnId: string, taskId: string, updates: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteTask: (boardId: string, columnId: string, taskId: string) => void;
  updateColumn: (boardId: string, columnId: string, title: string) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
}

export const useBoardStore = create<BoardStore>()(
  persist(
    (set) => ({
      boards: [],
      activeBoard: null,

      addBoard: (title) => {
        const timestamp = new Date().toISOString();
        const newBoard: Board = {
          id: uuidv4(),
          title,
          visibility: 'private',
          members: [],
          columns: [
            {
              id: uuidv4(),
              title: 'To Do',
              tasks: [],
            },
            {
              id: uuidv4(),
              title: 'In Progress',
              tasks: [],
            },
            {
              id: uuidv4(),
              title: 'Done',
              tasks: [],
            },
          ],
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        set((state) => ({
          boards: [...state.boards, newBoard],
          activeBoard: newBoard.id,
        }));
      },

      setActiveBoard: (boardId) => {
        set({ activeBoard: boardId });
      },

      addColumn: (boardId, title) => {
        const timestamp = new Date().toISOString();
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  columns: [
                    ...board.columns,
                    {
                      id: uuidv4(),
                      title,
                      tasks: [],
                    },
                  ],
                  updatedAt: timestamp,
                }
              : board
          ),
        }));
      },

      addTask: (boardId, columnId, task) => {
        const timestamp = new Date().toISOString();
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  columns: board.columns.map((column) =>
                    column.id === columnId
                      ? {
                          ...column,
                          tasks: [
                            ...column.tasks,
                            {
                              id: uuidv4(),
                              ...task,
                              createdAt: timestamp,
                              updatedAt: timestamp,
                            },
                          ],
                        }
                      : column
                  ),
                  updatedAt: timestamp,
                }
              : board
          ),
        }));
      },

      moveTask: (boardId, fromColumnId, toColumnId, taskId, index) => {
        const timestamp = new Date().toISOString();
        set((state) => {
          const board = state.boards.find((b) => b.id === boardId);
          if (!board) return state;

          const fromColumn = board.columns.find((c) => c.id === fromColumnId);
          if (!fromColumn) return state;

          const taskToMove = fromColumn.tasks.find((t) => t.id === taskId);
          if (!taskToMove) return state;

          return {
            boards: state.boards.map((board) =>
              board.id === boardId
                ? {
                    ...board,
                    columns: board.columns.map((column) => {
                      if (column.id === fromColumnId) {
                        return {
                          ...column,
                          tasks: column.tasks.filter((t) => t.id !== taskId),
                        };
                      }
                      if (column.id === toColumnId) {
                        const newTasks = [...column.tasks];
                        newTasks.splice(index, 0, {
                          ...taskToMove,
                          updatedAt: timestamp,
                        });
                        return {
                          ...column,
                          tasks: newTasks,
                        };
                      }
                      return column;
                    }),
                    updatedAt: timestamp,
                  }
                : board
            ),
          };
        });
      },

      updateTask: (boardId, columnId, taskId, updates) => {
        const timestamp = new Date().toISOString();
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  columns: board.columns.map((column) =>
                    column.id === columnId
                      ? {
                          ...column,
                          tasks: column.tasks.map((task) =>
                            task.id === taskId
                              ? {
                                  ...task,
                                  ...updates,
                                  updatedAt: timestamp,
                                }
                              : task
                          ),
                        }
                      : column
                  ),
                  updatedAt: timestamp,
                }
              : board
          ),
        }));
      },

      deleteTask: (boardId, columnId, taskId) => {
        const timestamp = new Date().toISOString();
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  columns: board.columns.map((column) =>
                    column.id === columnId
                      ? {
                          ...column,
                          tasks: column.tasks.filter((task) => task.id !== taskId),
                        }
                      : column
                  ),
                  updatedAt: timestamp,
                }
              : board
          ),
        }));
      },

      updateColumn: (boardId, columnId, title) => {
        const timestamp = new Date().toISOString();
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  columns: board.columns.map((column) =>
                    column.id === columnId
                      ? {
                          ...column,
                          title,
                        }
                      : column
                  ),
                  updatedAt: timestamp,
                }
              : board
          ),
        }));
      },

      deleteColumn: (boardId, columnId) => {
        const timestamp = new Date().toISOString();
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  columns: board.columns.filter((column) => column.id !== columnId),
                  updatedAt: timestamp,
                }
              : board
          ),
        }));
      },
    }),
    {
      name: 'kabano-storage',
    }
  )
);
