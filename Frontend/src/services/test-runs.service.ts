import { apiClient } from '@lib/axios'
import type {
  TestRun, TestResult, ApiResponse, PaginatedResponse
} from '@/types'

export const testRunsService = {
  list: (projectId: string, params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<TestRun>>(`/projects/${projectId}/runs`, { params }),

  get: (runId: string) =>
    apiClient.get<ApiResponse<TestRun>>(`/runs/${runId}`),

  start: (projectId: string) =>
    apiClient.post<ApiResponse<TestRun>>(`/projects/${projectId}/runs/start`),

  cancel: (runId: string) =>
    apiClient.post(`/runs/${runId}/cancel`),

  results: (runId: string, params?: { page?: number; limit?: number; roleId?: string }) =>
    apiClient.get<PaginatedResponse<TestResult>>(`/runs/${runId}/results`, { params }),

  summary: (runId: string) =>
    apiClient.get(`/runs/${runId}/summary`),
}
