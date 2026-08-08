import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format bytes to human readable */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/** Truncate string with ellipsis */
export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.substring(0, length)}...` : str
}

/** Sleep utility */
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Format duration ms to human readable */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`
}

/** Get initials from name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

/** HTTP method badge color */
export function getMethodColor(method: string): string {
  const colors: Record<string, string> = {
    GET: 'text-emerald-400 bg-emerald-400/10',
    POST: 'text-blue-400 bg-blue-400/10',
    PUT: 'text-amber-400 bg-amber-400/10',
    PATCH: 'text-orange-400 bg-orange-400/10',
    DELETE: 'text-red-400 bg-red-400/10',
  }
  return colors[method.toUpperCase()] ?? 'text-slate-400 bg-slate-400/10'
}

/** Status code badge color */
export function getStatusColor(status: number): string {
  if (status >= 500) return 'text-red-400 bg-red-400/10'
  if (status >= 400) return 'text-orange-400 bg-orange-400/10'
  if (status >= 300) return 'text-yellow-400 bg-yellow-400/10'
  if (status >= 200) return 'text-emerald-400 bg-emerald-400/10'
  return 'text-slate-400 bg-slate-400/10'
}
