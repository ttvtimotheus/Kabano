export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignee: string;
  labels: string[];
  createdAt: string;
  updatedAt: string;
  attachments?: Attachment[];
  checklists?: Checklist[];
  comments?: Comment[];
}

export interface Board {
  id: string;
  title: string;
  visibility: 'private' | 'workspace' | 'public';
  members: BoardMember[];
  columns: Column[];
  createdAt: string;
  updatedAt: string;
  description?: string;
  background?: string;
  isStarred?: boolean;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  workspaces: Workspace[];
  createdAt: string;
  updatedAt: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  role?: 'user' | 'admin';
}

export interface Workspace {
  id: string;
  name: string;
  type: 'free' | 'premium';
  members: WorkspaceMember[];
  createdAt: string;
  updatedAt: string;
  description?: string;
  boards?: Board[];
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

export interface BoardMember {
  id: string;
  userId: string;
  role: 'admin' | 'member' | 'viewer';
  joinedAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  attachments?: Attachment[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  fullName: string;
}
