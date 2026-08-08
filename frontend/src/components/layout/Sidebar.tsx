import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderOpen,
  FileText,
  Zap,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  ChevronUp,
  Settings as SettingsIcon
} from 'lucide-react';
import { SettingsModal, SettingsTab } from './SettingsModal';
import { useAuthStore } from '../../store/auth.store';

const NAV_GROUPS = [
  {
    label: 'Platform',
    items: [
      { to: '/projects', icon: FolderOpen, label: 'Projects' },
      { to: '/reports', icon: FileText, label: 'Reports' },
    ],
  },
];

const BOTTOM_ITEMS: any[] = [];

export const Sidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('profile');

  const user = useAuthStore((state) => state.user);
  const authLogout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    authLogout();
    navigate('/login');
  };

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 72 : 272 }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="relative flex flex-col h-screen bg-[var(--surface)] border-r border-[var(--outline)] shrink-0 overflow-hidden z-20 shadow-xl backdrop-blur transition-colors duration-300"
      >
      {/* Logo */}
      <div className="flex items-center gap-4 px-5 py-5 border-b border-[var(--outline)] min-h-[76px] transition-colors duration-300">
        <div className="w-10 h-10 rounded-xl bg-transparent flex items-center justify-center shrink-0">
          <img src="/Endpoint%20IQ.png" alt="Logo" className="w-full h-full object-contain" />
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
              <span className="text-[var(--ink)] font-bold text-[15px] leading-tight tracking-wide whitespace-nowrap">Endpoint IQ</span>
              <span className="text-[var(--color-primary)] text-[9px] font-bold tracking-[0.2em] uppercase leading-tight whitespace-nowrap">Testing Platform</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto scrollbar-hide">
        {NAV_GROUPS.map(group => (
          <div key={group.label} className="mb-5">
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] text-[var(--ink-muted)] uppercase tracking-[0.2em] font-bold px-2 mb-3"
                >{group.label}</motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-2">
              {group.items.map(({ to, icon: Icon, label, end }: { to: string; icon: React.ElementType; label: string; end?: boolean }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden outline-none
                     ${isActive
                      ? 'bg-[var(--surface-hover)] text-[var(--color-primary)] shadow-sm'
                      : 'text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="navActive"
                          className="absolute inset-0 rounded-xl bg-[var(--color-primary)]/5"
                          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                        />
                      )}
                      <Icon className={`w-[18px] h-[18px] shrink-0 relative z-10 transition-colors ${isActive ? 'text-[var(--color-primary)]' : 'group-hover:text-[var(--ink)]'}`} />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 flex-1 relative z-10"
                          >
                            <span className="text-[13.5px] font-semibold whitespace-nowrap truncate">{label}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {isActive && !collapsed && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-md bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]" />
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
      <div className="px-4 py-4 border-t border-[var(--outline)] space-y-2 bg-[var(--surface)] transition-colors duration-300">
        {BOTTOM_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 outline-none
               ${isActive ? 'bg-[var(--surface-hover)] text-[var(--color-primary)]' : 'text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)]'}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-[var(--color-primary)]' : 'group-hover:text-[var(--ink)]'}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-[13.5px] font-semibold whitespace-nowrap truncate">
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}

        {/* User card */}
        <div className="relative">
          <div 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`flex items-center gap-3.5 px-3.5 py-3 mt-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--outline)] hover:border-[var(--outline-strong)] transition-all cursor-pointer ${collapsed ? 'justify-center' : ''}`}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shrink-0 text-white text-[12px] font-bold shadow-sm uppercase">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <span className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-[var(--color-success)] ring-2 ring-[var(--surface-hover)]" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden flex-1 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-[var(--ink)] truncate">{user?.name || 'User'}</p>
                    <p className="text-[11px] text-[var(--ink-muted)] truncate">{user?.email || 'user@atp.ai'}</p>
                  </div>
                  <ChevronUp className={`w-4 h-4 text-[var(--ink-muted)] transition-transform ${userMenuOpen ? 'rotate-0' : 'rotate-180'}`} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Dropdown */}
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-0 w-full mb-2 bg-[var(--surface)] border border-[var(--outline)] rounded-2xl shadow-2xl overflow-hidden z-30"
              >
                <div className="p-2 space-y-1">
                  <button 
                    onClick={() => { setUserMenuOpen(false); setSettingsTab('profile'); setIsSettingsOpen(true); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)] transition-all text-left"
                  >
                    <User className="w-4 h-4" />
                    Profile Settings
                  </button>
                  <button 
                    onClick={() => { setUserMenuOpen(false); setSettingsTab('admin'); setIsSettingsOpen(true); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)] transition-all text-left"
                  >
                    <SettingsIcon className="w-4 h-4" />
                    Admin user setting
                  </button>
                  <div className="h-px bg-[var(--outline)] my-1" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/5 transition-all text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute right-[-12px] top-[26px] w-6 h-6 bg-[var(--surface)] border border-[var(--outline)] rounded-full flex items-center justify-center text-[var(--ink-muted)] hover:text-[var(--ink)] hover:border-[var(--outline-strong)] transition-all z-30 shadow-md cursor-pointer outline-none"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
      </motion.aside>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        initialTab={settingsTab} 
      />
    </>
  );
};