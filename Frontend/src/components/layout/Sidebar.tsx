import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen, Globe, Play, FileText,
  Server, Settings, Zap, ChevronLeft, ChevronRight,
  Activity, Bot, ScrollText
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Platform',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
      { to: '/projects', icon: FolderOpen, label: 'Projects' },
      { to: '/endpoints', icon: Globe, label: 'Endpoints' },
    ],
  },
  {
    label: 'Testing',
    items: [
      { to: '/test-runs', icon: Play, label: 'Test Runs' },
      { to: '/ai-insights', icon: Bot, label: 'AI Insights', badge: 'AI' },
      { to: '/reports', icon: FileText, label: 'Reports' },
    ],
  },
  {
    label: 'Infrastructure',
    items: [
      { to: '/workers', icon: Server, label: 'Workers' },
      { to: '/logs', icon: ScrollText, label: 'Logs' },
    ],
  },
];

const BOTTOM_ITEMS = [
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 272 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-screen bg-gradient-to-b from-[#0f0f10] via-[#0c0c0d] to-[#0a0a0b] border-r border-[#1e1e22] shrink-0 overflow-hidden z-20 shadow-[8px_0_24px_rgba(0,0,0,0.25)] backdrop-blur"
    >
      {/* Logo */}
      <div className="flex items-center gap-4 px-5 py-5 border-b border-[#1e1e22] min-h-[76px]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f97316] to-[#fb923c] flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(249,115,22,0.35)] ring-1 ring-[#f97316]/20">
          <Zap className="w-5 h-5 text-white fill-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col overflow-hidden"
            >
              <span className="text-white font-semibold text-[15px] leading-tight tracking-wide whitespace-nowrap">ATP AI</span>
              <span className="text-[#f8b26a] text-[9px] font-medium tracking-[0.22em] uppercase leading-tight whitespace-nowrap">AI Testing Platform</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Live status pill */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-4 mt-4 mb-3 px-4 py-3 bg-gradient-to-r from-[#141216] to-[#101014] border border-[#23222a] rounded-xl flex items-center gap-3 shadow-[0_0_20px_rgba(249,115,22,0.08)]"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
            <span className="text-[12px] text-emerald-300 font-medium tracking-wide">4 Workers Active</span>
            <motion.div
              className="ml-auto flex items-end gap-0.5 h-4"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.span className="w-0.5 h-2 rounded-full bg-[#f97316]/70" animate={{ height: [6, 12, 6] }} transition={{ duration: 1.2, repeat: Infinity }} />
              <motion.span className="w-0.5 h-3 rounded-full bg-[#f97316]/80" animate={{ height: [8, 14, 8] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.15 }} />
              <motion.span className="w-0.5 h-4 rounded-full bg-[#f97316]" animate={{ height: [10, 16, 10] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }} />
              <motion.span className="w-0.5 h-2.5 rounded-full bg-[#f97316]/80" animate={{ height: [7, 13, 7] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.45 }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav groups */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {NAV_GROUPS.map(group => (
          <div key={group.label} className="mb-5">
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] text-[#8c8c95] uppercase tracking-[0.22em] font-semibold px-2 mb-3"
                >{group.label}</motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-2">
              {group.items.map(({ to, icon: Icon, label, end, badge }: any) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden no-underline outline-none focus:outline-none focus:ring-2 focus:ring-[#f97316]/20
                     ${isActive
                      ? 'bg-gradient-to-r from-[#1a1512] to-[#121215] text-[#f97316] border border-[#2a2624] shadow-[0_0_14px_rgba(249,115,22,0.12)]'
                      : 'text-[#c7c7d1] hover:text-[#ffffff] hover:bg-[#151518]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="navActive"
                          className="absolute inset-0 rounded-xl"
                          style={{ background: 'rgba(249,115,22,0.06)' }}
                          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                        />
                      )}
                      <Icon className={`w-[18px] h-[18px] shrink-0 relative z-10 transition-colors ${isActive ? 'text-[#f97316]' : 'text-[#a5a5b0] group-hover:text-[#ffffff]'}`} />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 flex-1 relative z-10"
                          >
                            <span className="text-[13.5px] font-medium whitespace-nowrap truncate">{label}</span>
                            {badge && (
                              <span className="ml-auto text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#f97316]/15 text-[#f97316] border border-[#f97316]/30">
                                {badge}
                              </span>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {isActive && !collapsed && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-9 rounded-r-md bg-[#f97316] shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-4 border-t border-[#1e1e22] space-y-2 bg-[#0c0c0d]">
        {BOTTOM_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 no-underline outline-none focus:outline-none focus:ring-2 focus:ring-[#f97316]/18 box-border
               ${isActive ? 'bg-gradient-to-r from-[#1a1512] to-[#121215] text-[#f97316] border border-[#2a2624]' : 'text-[#c7c7d1] hover:text-[#ffffff] hover:bg-[#151518]'}`
            }
          >
            <Icon className="w-[18px] h-[18px] shrink-0 text-[#a5a5b0] group-hover:text-[#ffffff]" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-[13.5px] font-medium whitespace-nowrap truncate text-ellipsis overflow-hidden">
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}

        {/* User card */}
        <div className={`flex items-center gap-3.5 px-3.5 py-3 mt-3 rounded-xl bg-gradient-to-r from-[#141217] to-[#101013] border border-[#24232b] hover:border-[#34323d] transition-all cursor-pointer shadow-[0_0_18px_rgba(0,0,0,0.35)] ${collapsed ? 'justify-center' : ''}`}>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f97316] to-[#fb923c] flex items-center justify-center shrink-0 text-white text-[12px] font-bold shadow-[0_0_10px_rgba(249,115,22,0.25)]">
              A
            </div>
            <span className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#101013]" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden flex-1">
                <p className="text-[14px] font-semibold text-white truncate">Admin User</p>
                <p className="text-[11px] text-[#a0a0aa] truncate">admin@atp.ai</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute right-[-12px] top-[26px] w-6 h-6 bg-[#161616] border border-[#2a2a2a] rounded-full flex items-center justify-center text-[#888] hover:text-white hover:border-[#f97316]/50 hover:bg-[#1a1a1a] transition-all z-30 shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-pointer outline-none"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </motion.aside>
  );
};