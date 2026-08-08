import { apiClient } from '@lib/axios'
import type { Endpoint, ApiResponse, PaginatedResponse } from '@/types'

export const endpointsService = {
  list: (projectId: string, params?: { page?: number; limit?: number; method?: string; tag?: string; search?: string }) =>
    apiClient.get<PaginatedResponse<Endpoint>>(`/projects/${projectId}/endpoints`, { params }),

  get: (endpointId: string) =>
    apiClient.get<ApiResponse<Endpoint>>(`/endpoints/${endpointId}`),

  tags: (projectId: string) =>
    apiClient.get<ApiResponse<string[]>>(`/projects/${projectId}/endpoints/tags`),
}

export const specService = {
  import: (projectId: string, url: string) =>
    apiClient.post(`/projects/${projectId}/spec/import`, { url }),

  validate: (url: string) =>
    apiClient.post('/spec/validate', { url }),
}
