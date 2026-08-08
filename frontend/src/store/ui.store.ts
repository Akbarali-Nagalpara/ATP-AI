import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'dark' | 'light' | 'system'

interface UiState {
  theme: Theme
  sidebarCollapsed: boolean
  sidebarMobileOpen: boolean

  setTheme: (theme: Theme) => void
  toggleSidebar: () => void
  setSidebarMobileOpen: (open: boolean) => void
  resolvedTheme: () => 'dark' | 'light'
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      sidebarCollapsed: false,
      sidebarMobileOpen: false,

      setTheme: (theme) => {
        set({ theme })
        const resolved = theme === 'system'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          : theme
        document.documentElement.setAttribute('data-theme', resolved)
      },

      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),

      resolvedTheme: () => {
        const theme = get().theme
        if (theme === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        return theme
      },
    }),
    {
      name: 'atp-ui',
      partialize: (s) => ({ theme: s.theme, sidebarCollapsed: s.sidebarCollapsed }),
    },
  ),
)
