import { apiClient } from '@lib/axios'
import type { Report, ApiResponse, PaginatedResponse } from '@/types'

export const reportsService = {
  list: (projectId: string) =>
    apiClient.get<PaginatedResponse<Report>>(`/projects/${projectId}/reports`),

  get: (reportId: string) =>
    apiClient.get<ApiResponse<Report>>(`/reports/${reportId}`),

  download: (reportId: string, format: 'pdf' | 'html' = 'pdf') =>
    apiClient.get(`/reports/${reportId}/download`, {
      params: { format },
      responseType: 'blob',
    }),

  regenerate: (runId: string) =>
    apiClient.post(`/runs/${runId}/report/regenerate`),
}
