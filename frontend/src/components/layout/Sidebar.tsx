import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderOpen,
  FileText,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  ChevronUp,
  Settings as SettingsIcon,
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



export const Sidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('profile');

  const user = useAuthStore((state) => state.user);
  const authLogout = useAuthStore((state) => state.logout);

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const handleLogout = () => {
    authLogout();
    navigate('/login');
  };

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 68 : 260 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="relative flex flex-col h-screen bg-[var(--surface)] border-r border-[var(--outline)] shrink-0 overflow-hidden z-20 shadow-2xl"
      >
      {/* Subtle radial glow at top */}
      <div
        className="absolute top-0 left-0 w-full h-40 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% -20%, color-mix(in srgb, var(--color-primary) 12%, transparent) 0%, transparent 70%)' }}
      />

      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-[var(--outline)] min-h-[72px] relative z-10 ${collapsed ? 'justify-center' : ''}`}>
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-start overflow-hidden"
            >
              <img src="/Main_Logo.png" alt="Endpoint IQ Logo" className="w-40 max-w-none object-contain block dark:hidden" />
              <img src="/main_Logo_Dark.png" alt="Endpoint IQ Logo" className="w-40 max-w-none object-contain hidden dark:block" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
            >
              <img src="/App_Logo.png" alt="Endpoint IQ Logo" className="w-full h-full object-contain" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-hide relative z-10">
        {NAV_GROUPS.map(group => (
          <div key={group.label} className="mb-5">
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[9.5px] text-[var(--ink-faint)] uppercase tracking-[0.22em] font-bold px-3 mb-2"
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
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative outline-none
                     ${isActive
                      ? 'text-[var(--color-primary)]'
                      : 'text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)]'
                    } ${collapsed ? 'justify-center' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="navActivePill"
                          className="absolute inset-0 rounded-xl"
                          style={{ background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}
                          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                        />
                      )}
                      {isActive && (
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                          style={{ background: 'var(--color-primary)' }}
                        />
                      )}
                      <Icon className={`w-[18px] h-[18px] shrink-0 relative z-10 transition-colors ${isActive ? 'text-[var(--color-primary)]' : ''}`} />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-[13px] font-semibold whitespace-nowrap truncate relative z-10"
                          >
                            {label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-[var(--outline)] relative z-10">
        {/* User card */}
        <div className="relative">
          <div
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--surface-hover)] border border-[var(--outline)] hover:border-[var(--outline-strong)] transition-all cursor-pointer ${collapsed ? 'justify-center' : ''}`}
          >
            <div className="relative shrink-0">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shadow-md"
                style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))' }}
              >
                {initials}
              </div>
              <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full bg-[var(--color-success)] ring-2 ring-[var(--surface-hover)]" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden flex-1 flex items-center justify-between min-w-0">
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[var(--ink)] truncate leading-tight">{user?.name || 'User'}</p>
                    <p className="text-[10px] text-[var(--ink-muted)] truncate leading-tight">{user?.email || 'user@endpointiq.ai'}</p>
                  </div>
                  <ChevronUp className={`w-3.5 h-3.5 text-[var(--ink-muted)] shrink-0 transition-transform ${userMenuOpen ? 'rotate-0' : 'rotate-180'}`} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-0 w-full mb-2 bg-[var(--surface)] border border-[var(--outline)] rounded-2xl shadow-2xl overflow-hidden z-30"
              >
                <div className="p-1.5 space-y-0.5">
                  <button
                    onClick={() => { setUserMenuOpen(false); setSettingsTab('profile'); setIsSettingsOpen(true); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)] transition-all text-left"
                  >
                    <User className="w-3.5 h-3.5" />
                    Profile Settings
                  </button>
                  <button
                    onClick={() => { setUserMenuOpen(false); setSettingsTab('admin'); setIsSettingsOpen(true); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)] transition-all text-left"
                  >
                    <SettingsIcon className="w-3.5 h-3.5" />
                    Admin Settings
                  </button>
                  <div className="h-px bg-[var(--outline)] my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger)]/8 transition-all text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
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
        className="absolute right-[-12px] top-[24px] w-6 h-6 bg-[var(--surface)] border border-[var(--outline)] rounded-full flex items-center justify-center text-[var(--ink-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/40 transition-all z-30 shadow-md cursor-pointer outline-none"
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