import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // In a real app, you would validate credentials against a backend
          const user: User = {
            id: uuidv4(),
            email,
            fullName: email.split('@')[0],
            workspaces: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({
            error: 'Invalid email or password',
            isLoading: false,
          });
        }
      },

      register: async (email: string, password: string, fullName: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // In a real app, you would create the user in a backend
          const user: User = {
            id: uuidv4(),
            email,
            fullName,
            workspaces: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({
            error: 'Registration failed. Please try again.',
            isLoading: false,
          });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'kabano-auth',
    }
  )
);
