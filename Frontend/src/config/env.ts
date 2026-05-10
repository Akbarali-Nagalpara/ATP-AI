/**
 * Environment configuration — all env vars typed and centralised here.
 * Access via import { env } from '@config/env'
 */
const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
  wsUrl: import.meta.env.VITE_WS_URL as string,
  appName: import.meta.env.VITE_APP_NAME as string,
  appVersion: import.meta.env.VITE_APP_VERSION as string,
  jwtExpiry: Number(import.meta.env.VITE_JWT_EXPIRY ?? 3600),
  enableDarkMode: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
  enableAiInsights: import.meta.env.VITE_ENABLE_AI_INSIGHTS === 'true',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const

export { env }
