import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Upload, Play } from 'lucide-react';

const PAGE_MAP: Record<string, { title: string; subtitle: string }> = {
  '/':            { title: 'Command Center',  subtitle: 'Real-time observability for all API testing operations' },
  '/projects':    { title: 'Projects',        subtitle: 'Manage your API projects and Swagger imports' },
  '/endpoints':   { title: 'Endpoints',       subtitle: 'Browse and inspect all discovered API endpoints' },
  '/test-runs':   { title: 'Test Runs',       subtitle: 'Monitor and launch parallel test executions' },
  '/ai-insights': { title: 'AI Insights',     subtitle: 'AI-powered analysis, recommendations and findings' },
  '/reports':     { title: 'Reports',         subtitle: 'AI-generated test analysis and downloadable reports' },
  '/logs':        { title: 'Logs',            subtitle: 'Real-time gateway, worker and AI event logs' },
  '/workers':     { title: 'Workers',         subtitle: 'Parallel test executor health and performance' },
  '/settings':    { title: 'Settings',        subtitle: 'Platform configuration and integrations' },
};

export const Header = () => {
  const location = useLocation();
  const page = PAGE_MAP[location.pathname] ?? { title: 'ATP AI', subtitle: '' };
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="h-[60px] bg-[#0c0c0c]/95 backdrop-blur-sm border-b border-[#151515] flex items-center justify-between px-5 shrink-0 sticky top-0 z-10">
      {/* Page title */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 6 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
        >
          <h2 className="text-white font-semibold text-[14px] leading-tight tracking-tight">{page.title}</h2>
          <p className="text-[#3a3a3a] text-[10.5px] mt-0.5 font-medium">{page.subtitle}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-2">
        {/* Search */}
        <motion.div
          animate={{ width: searchFocused ? 210 : 160 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className={`hidden md:flex items-center gap-2 border rounded-xl px-3 py-1.5 transition-colors duration-200 ${
            searchFocused ? 'bg-[#141414] border-[#f97316]/25' : 'bg-[#111] border-[#181818]'
          }`}
        >
          <Search className="w-3 h-3 text-[#333] shrink-0" />
          <input
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent text-[12px] text-white placeholder-[#333] outline-none w-full"
          />
          {!searchFocused && (
            <kbd className="text-[#252525] text-[9px] font-mono border border-[#1e1e1e] rounded px-1 shrink-0">⌘K</kbd>
          )}
        </motion.div>

        {/* Import */}
        <button className="hidden md:flex items-center gap-1.5 bg-[#111] border border-[#181818] hover:border-[#252525] hover:bg-[#161616] text-[#555] hover:text-[#bbb] px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all duration-200">
          <Upload className="w-3 h-3" />
          Import
        </button>

        {/* Run Tests */}
        <button className="flex items-center gap-1.5 bg-[#f97316] hover:bg-[#fb923c] active:bg-[#ea580c] text-white px-3.5 py-1.5 rounded-xl text-[12px] font-semibold transition-all duration-200 shadow-[0_0_12px_rgba(249,115,22,0.3)] hover:shadow-[0_0_18px_rgba(249,115,22,0.45)]">
          <Play className="w-3 h-3 fill-white" />
          Run Tests
        </button>

        <div className="w-px h-4 bg-[#181818] mx-1" />

        {/* Notifications */}
        <button className="relative w-7 h-7 bg-[#111] border border-[#181818] hover:border-[#252525] rounded-xl flex items-center justify-center text-[#444] hover:text-[#aaa] transition-all duration-200">
          <Bell className="w-3 h-3" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#f97316] rounded-full" />
        </button>
      </div>
    </header>
  );
};