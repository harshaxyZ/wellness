export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SessionStep {
  title: string;
  content: string;
}

export interface Session {
  _id: string;
  userId: string | Partial<User>;
  title: string;
  description: string;
  category: string;
  duration: number;
  steps: SessionStep[];
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  totalUsers: number;
  totalSessions: number;
  publishedSessions: number;
  draftSessions: number;
  categoryStats: { _id: string; count: number }[];
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  token: string;
}
