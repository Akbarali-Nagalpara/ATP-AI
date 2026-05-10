import { useEffect, useState } from 'react'
import { useUiStore } from '@store/ui.store'

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useUiStore()
  const [resolved, setResolved] = useState<'dark' | 'light'>(resolvedTheme())

  useEffect(() => {
    const r = resolvedTheme()
    setResolved(r)
    document.documentElement.setAttribute('data-theme', r)
  }, [theme, resolvedTheme])

  const toggleTheme = () => setTheme(resolved === 'dark' ? 'light' : 'dark')

  return { theme, setTheme, resolvedTheme: resolved, toggleTheme }
}
