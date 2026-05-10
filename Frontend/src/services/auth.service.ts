import { apiClient } from '@lib/axios'
import type {
  LoginPayload, RegisterPayload, AuthTokens, User, ApiResponse
} from '@/types'

export const authService = {
  login: (payload: LoginPayload) =>
    apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/register', payload),

  logout: () => apiClient.post('/auth/logout'),

  refresh: () => apiClient.post<ApiResponse<AuthTokens>>('/auth/refresh'),

  me: () => apiClient.get<ApiResponse<User>>('/auth/me'),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post('/auth/reset-password', { token, password }),
}
