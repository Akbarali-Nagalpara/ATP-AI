import { apiClient } from '@lib/axios'
import type {
  Project, CreateProjectPayload, ApiResponse, PaginatedResponse
} from '@/types'

export const projectsService = {
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<PaginatedResponse<Project>>('/projects', { params }),

  get: (id: string) =>
    apiClient.get<ApiResponse<Project>>(`/projects/${id}`),

  create: (payload: CreateProjectPayload) =>
    apiClient.post<ApiResponse<Project>>('/projects', payload),

  update: (id: string, payload: Partial<CreateProjectPayload>) =>
    apiClient.patch<ApiResponse<Project>>(`/projects/${id}`, payload),

  delete: (id: string) =>
    apiClient.delete(`/projects/${id}`),

  archive: (id: string) =>
    apiClient.post(`/projects/${id}/archive`),

  stats: (id: string) =>
    apiClient.get(`/projects/${id}/stats`),
}
