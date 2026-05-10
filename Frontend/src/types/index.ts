// ─── Generic API Response ─────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

// ─── Auth Types ───────────────────────────────────────────────────────────────
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'member' | 'viewer'
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginPayload {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// ─── Project Types ─────────────────────────────────────────────────────────────
export interface Project {
  id: string
  name: string
  description?: string
  swaggerUrl: string
  status: 'active' | 'inactive' | 'archived'
  endpointCount: number
  lastRunAt?: string
  createdAt: string
  updatedAt: string
  owner: Pick<User, 'id' | 'name' | 'avatar'>
}

export interface CreateProjectPayload {
  name: string
  description?: string
  swaggerUrl: string
}

// ─── Role / Credential Types ──────────────────────────────────────────────────
export interface ProjectRole {
  id: string
  projectId: string
  name: string
  loginUrl?: string
  username: string
  passwordHint?: string
  authType: 'jwt' | 'oauth' | 'session' | 'api_key'
  sessionActive: boolean
  tokenExpiresAt?: string
  createdAt: string
}

export interface CreateRolePayload {
  name: string
  loginUrl?: string
  username: string
  password: string
  authType: ProjectRole['authType']
}

// ─── Endpoint Types ───────────────────────────────────────────────────────────
export interface Endpoint {
  id: string
  projectId: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
  path: string
  summary?: string
  description?: string
  tags: string[]
  parameters: EndpointParameter[]
  requestBody?: unknown
  responses: Record<string, unknown>
  requiresAuth: boolean
  deprecated: boolean
}

export interface EndpointParameter {
  name: string
  in: 'query' | 'path' | 'header' | 'cookie'
  required: boolean
  schema: unknown
  description?: string
}

// ─── Test Run Types ───────────────────────────────────────────────────────────
export type TestRunStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'

export interface TestRun {
  id: string
  projectId: string
  status: TestRunStatus
  totalJobs: number
  completedJobs: number
  passedJobs: number
  failedJobs: number
  startedAt?: string
  completedAt?: string
  createdAt: string
  triggeredBy: Pick<User, 'id' | 'name'>
  durationMs?: number
}

export interface TestResult {
  id: string
  runId: string
  endpointId: string
  roleId: string
  endpoint: Pick<Endpoint, 'method' | 'path'>
  role: Pick<ProjectRole, 'name'>
  statusCode: number
  responseTimeMs: number
  passed: boolean
  errorMessage?: string
  requestBody?: unknown
  responseBody?: unknown
  headers?: Record<string, string>
}

// ─── Report Types ─────────────────────────────────────────────────────────────
export interface Report {
  id: string
  runId: string
  projectId: string
  fileUrl?: string
  summaryText: string
  aiInsights: AiInsight[]
  coveragePercent: number
  passRate: number
  generatedAt: string
}

export interface AiInsight {
  type: 'gap' | 'anomaly' | 'security' | 'recommendation'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  affectedEndpoints?: string[]
}

// ─── Spec Import Types ────────────────────────────────────────────────────────
export interface SpecImportPayload {
  projectId: string
  url: string
}

export interface SpecImportResult {
  endpointsFound: number
  endpointsSaved: number
  warnings: string[]
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export interface DashboardStats {
  totalProjects: number
  totalRuns: number
  totalEndpoints: number
  avgPassRate: number
  recentRuns: TestRun[]
  runTrend: { date: string; passed: number; failed: number }[]
}
