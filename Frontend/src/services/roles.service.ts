import { apiClient } from '@lib/axios'
import type { ProjectRole, CreateRolePayload, ApiResponse } from '@/types'

export const rolesService = {
  list: (projectId: string) =>
    apiClient.get<ApiResponse<ProjectRole[]>>(`/projects/${projectId}/roles`),

  create: (projectId: string, payload: CreateRolePayload) =>
    apiClient.post<ApiResponse<ProjectRole>>(`/projects/${projectId}/roles`, payload),

  update: (roleId: string, payload: Partial<CreateRolePayload>) =>
    apiClient.patch<ApiResponse<ProjectRole>>(`/roles/${roleId}`, payload),

  delete: (roleId: string) =>
    apiClient.delete(`/roles/${roleId}`),

  authenticate: (roleId: string) =>
    apiClient.post<ApiResponse<{ expiresAt: string }>>(`/roles/${roleId}/authenticate`),

  revokeSession: (roleId: string) =>
    apiClient.post(`/roles/${roleId}/revoke`),
}
