import axios from 'axios'
import { env } from '@config/env'
import { useAuthStore } from '@store/auth.store'

const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// ─── Request Interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ─── Response Interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        await apiClient.post('/auth/refresh')
        return apiClient(originalRequest)
      } catch {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

export { apiClient }
