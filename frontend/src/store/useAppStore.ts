import { create } from 'zustand';

export interface Endpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  authRequired: boolean;
  role: string;
  status: 'Pending' | 'Queued' | 'Running' | 'Pass' | 'Fail';
  statusCode?: number;
  responseTime?: number;
  requestBody?: Record<string, any>;
  headers?: Record<string, string>;
  queryParams?: Record<string, any>;
  responseExample?: Record<string, any>;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface AiInsight {
  endpoint: string;
  issue: string;
  rootCause: string;
  suggestion: string;
  fixPrompt: string;
  securityFindings: string[];
}

export interface RoleToken {
  role: string;
  status: 'Pending' | 'Authenticating' | 'Authenticated' | 'Failed';
  token?: string;
}

export interface OtpLogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'otp';
}

export interface OtpWorkflow {
  sendOtpApi: string;
  verifyOtpApi: string;
  otpSource: string;
  mockOtp: string;
  extractedOtp?: string;
  status: 'idle' | 'waiting' | 'detected' | 'captured' | 'verifying' | 'success' | 'failed';
  logs: OtpLogEntry[];
}

export interface Project {
  id: string;
  name: string;
  swaggerUrl: string;
  endpoints: Endpoint[];
  logs: LogEntry[];
  insights: AiInsight[];
  tokens: RoleToken[];
  testingState: 'idle' | 'importing' | 'detecting_roles' | 'collecting_tokens' | 'testing' | 'analyzing' | 'completed';
  otpWorkflow?: OtpWorkflow;
}

interface AppState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  projects: Project[];
  activeProjectId: string | null;
  addProject: (project: Project) => void;
  setActiveProject: (id: string) => void;
  updateProjectState: (id: string, state: Partial<Project>) => void;
  updateEndpoint: (projectId: string, endpointId: string, data: Partial<Endpoint>) => void;
  updateToken: (projectId: string, role: string, data: Partial<RoleToken>) => void;
  addLog: (projectId: string, message: string, type?: LogEntry['type']) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'dark',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    return { theme: newTheme };
  }),
  projects: [],
  activeProjectId: null,

  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),

  setActiveProject: (id) => set({ activeProjectId: id }),

  updateProjectState: (id, updates) => set((state) => ({
    projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
  })),

  updateEndpoint: (projectId, endpointId, data) => set((state) => ({
    projects: state.projects.map((p) => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        endpoints: p.endpoints.map((e) => (e.id === endpointId ? { ...e, ...data } : e)),
      };
    }),
  })),

  updateToken: (projectId, role, data) => set((state) => ({
    projects: state.projects.map((p) => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        tokens: p.tokens.map((t) => (t.role === role ? { ...t, ...data } : t)),
      };
    }),
  })),

  addLog: (projectId, message, type = 'info') => set((state) => ({
    projects: state.projects.map((p) => {
      if (p.id !== projectId) return p;
      const log: LogEntry = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString(),
        message,
        type,
      };
      return {
        ...p,
        logs: [...p.logs, log],
      };
    }),
  })),
}));
