import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Upload, Play, Sun, Moon } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const Header = () => {
  const location = useLocation();
  const projects = useAppStore(state => state.projects);
  const { theme, toggleTheme } = useAppStore();
  const [searchFocused, setSearchFocused] = useState(false);
  
  let title = 'Projects';
  let subtitle = 'Manage and execute your API test suites';

  if (location.pathname === '/reports') {
    title = 'Reports';
    subtitle = 'Generated AI test reports across all projects';
  } else if (location.pathname.includes('/projects/')) {
    const id = location.pathname.split('/')[2];
    const project = projects.find(p => p.id === id);
    if (project) {
      if (location.pathname.endsWith('/run')) {
        title = `Testing Console`;
        subtitle = `Running automated tests for ${project.name}`;
      } else {
        title = `Project Details`;
        subtitle = `Workspace for ${project.name}`;
      }
    }
  } else if (location.pathname.includes('/reports/')) {
    const id = location.pathname.split('/')[2];
    const project = projects.find(p => p.id === id);
    if (project) {
      title = `Final Report`;
      subtitle = `Analysis for ${project.name}`;
    }
  }

  return (
    <header className="h-[60px] bg-[var(--surface)]/95 backdrop-blur-sm border-b border-[var(--outline)] flex items-center justify-between px-5 shrink-0 sticky top-0 z-10 transition-colors duration-200">
      {/* Page title */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 6 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
        >
          <h2 className="text-[var(--ink)] font-semibold text-[14px] leading-tight tracking-tight transition-colors">{title}</h2>
          <p className="text-[var(--ink-muted)] text-[10.5px] mt-0.5 font-medium transition-colors">{subtitle}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-2">
        {/* Search */}
        <motion.div
          animate={{ width: searchFocused ? 210 : 160 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className={`hidden md:flex items-center gap-2 border rounded-xl px-3 py-1.5 transition-colors duration-200 ${
            searchFocused ? 'bg-[var(--surface-hover)] border-[var(--color-primary)]' : 'bg-[var(--canvas)] border-[var(--outline)]'
          }`}
        >
          <Search className="w-3 h-3 text-[var(--ink-muted)] shrink-0" />
          <input
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent text-[12px] text-[var(--ink)] placeholder-[var(--ink-muted)] outline-none w-full"
          />
          {!searchFocused && (
            <kbd className="text-[var(--ink-muted)] bg-[var(--surface)] text-[9px] font-mono border border-[var(--outline)] rounded px-1 shrink-0">⌘K</kbd>
          )}
        </motion.div>

        <div className="w-px h-4 bg-[var(--outline)] mx-1 transition-colors" />

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="relative w-8 h-8 bg-[var(--canvas)] border border-[var(--outline)] hover:border-[var(--outline-strong)] rounded-xl flex items-center justify-center text-[var(--ink-muted)] hover:text-[var(--ink)] transition-all duration-200"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </motion.div>
          </AnimatePresence>
        </button>

        {/* Notifications */}
        <button className="relative w-8 h-8 bg-[var(--canvas)] border border-[var(--outline)] hover:border-[var(--outline-strong)] rounded-xl flex items-center justify-center text-[var(--ink-muted)] hover:text-[var(--ink)] transition-all duration-200">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[var(--color-danger)] rounded-full" />
        </button>
      </div>
    </header>
  );
};