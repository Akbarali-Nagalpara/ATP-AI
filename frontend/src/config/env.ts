/**
 * Environment configuration — all env vars typed and centralised here.
 * Access via import { env } from '@config/env'
 */
const env = {
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3000/api/v1',
  wsUrl: (import.meta.env.VITE_WS_URL as string) || 'ws://localhost:3000',
  appName: (import.meta.env.VITE_APP_NAME as string) || 'ATP-AI',
  appVersion: (import.meta.env.VITE_APP_VERSION as string) || '1.0.0',
  jwtExpiry: Number(import.meta.env.VITE_JWT_EXPIRY ?? 3600),
  enableDarkMode: import.meta.env.VITE_ENABLE_DARK_MODE !== 'false',
  enableAiInsights: import.meta.env.VITE_ENABLE_AI_INSIGHTS !== 'false',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const

export { env }
