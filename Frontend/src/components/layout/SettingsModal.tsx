import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Settings as SettingsIcon, Bell, Shield, Key, Camera } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../store/auth.store';

export type SettingsTab = 'profile' | 'admin';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: SettingsTab;
}

export const SettingsModal = ({ isOpen, onClose, initialTab = 'profile' }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  // Update tab when opened with a specific initial tab
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-4xl max-h-[85vh] bg-[var(--surface)] border border-[var(--outline)] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            {/* Sidebar */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--outline)] bg-[var(--surface-hover)]/30 flex flex-col">
              <div className="p-4 border-b border-[var(--outline)] flex items-center justify-between md:block">
                <h3 className="text-lg font-semibold text-[var(--ink)]">Settings</h3>
                <button onClick={onClose} className="p-1 hover:bg-[var(--surface-hover)] rounded-lg transition-colors md:hidden">
                  <X className="w-5 h-5 text-[var(--ink-muted)]" />
                </button>
              </div>
              <div className="p-3 space-y-1 flex-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    activeTab === 'profile'
                      ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                      : 'text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Profile Settings
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    activeTab === 'admin'
                      ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                      : 'text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  <SettingsIcon className="w-4 h-4" />
                  Admin User Settings
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="hidden md:flex p-4 border-b border-[var(--outline)] items-center justify-end">
                <button onClick={onClose} className="p-1 hover:bg-[var(--surface-hover)] rounded-lg transition-colors">
                  <X className="w-5 h-5 text-[var(--ink-muted)]" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                {activeTab === 'profile' ? <ProfileSettings onClose={onClose} /> : <AdminSettings onClose={onClose} />}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ProfileSettings = ({ onClose }: { onClose: () => void }) => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: 'QA Lead'
  });

  useEffect(() => {
    if (user) {
      const parts = user.name ? user.name.split(' ') : ['', ''];
      setFormData({
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        email: user.email || '',
        jobTitle: user.role === 'admin' ? 'Administrator' : 'Workspace Developer'
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      if (!fullName) {
        throw new Error('Name cannot be empty.');
      }
      if (!formData.email) {
        throw new Error('Email address is required.');
      }

      // Save to real database
      const response = await authService.updateProfile({
        name: fullName,
        email: formData.email
      });

      // Update global Zustand store with updated user record
      setUser(response.data.data);
      onClose();
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Failed to update profile settings.';
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-semibold text-[var(--ink)] mb-1">Profile Settings</h2>
        <p className="text-sm text-[var(--ink-muted)]">Manage your personal information and preferences.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold leading-relaxed">
          {error}
        </div>
      )}

      <div className="flex items-center gap-6">
        <div className="relative group cursor-pointer">
          <div className="w-24 h-24 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden relative">
            <span>{formData.firstName.charAt(0) || 'A'}</span>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div>
          <button className="px-4 py-2 bg-[var(--surface-hover)] border border-[var(--outline)] hover:border-[var(--outline-strong)] text-[var(--ink)] text-sm font-medium rounded-xl transition-all cursor-pointer">
            Change Avatar
          </button>
          <p className="text-xs text-[var(--ink-muted)] mt-2">JPG, GIF or PNG. Max size of 800K</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--ink-muted)]">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="w-full bg-[var(--surface-hover)] border border-[var(--outline)] rounded-xl px-4 py-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--ink-muted)]">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="w-full bg-[var(--surface-hover)] border border-[var(--outline)] rounded-xl px-4 py-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ink-muted)]">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-[var(--surface-hover)] border border-[var(--outline)] rounded-xl px-4 py-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ink-muted)]">Job Title</label>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
            className="w-full bg-[var(--surface-hover)] border border-[var(--outline)] rounded-xl px-4 py-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-[var(--outline)] flex justify-end gap-3">
        <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer">
          Cancel
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-70 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer"
        >
          {isSaving ? (
             <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : null}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

const AdminSettings = ({ onClose }: { onClose: () => void }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [apiKeyRevoked, setApiKeyRevoked] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('15 Minutes');
  const [require2fa, setRequire2fa] = useState(true);
  const [notifyTestFailure, setNotifyTestFailure] = useState(true);
  const [notifyWeekly, setNotifyWeekly] = useState(true);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-semibold text-[var(--ink)] mb-1">Admin Settings</h2>
        <p className="text-sm text-[var(--ink-muted)]">Manage platform configurations and security policies.</p>
      </div>

      <div className="space-y-6">
        <div className="p-5 border border-[var(--outline)] rounded-2xl bg-[var(--surface)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className="text-[15px] font-semibold text-[var(--ink)]">Security Requirements</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--outline)] hover:border-[var(--outline-strong)] bg-[var(--surface-hover)] transition-all">
              <div>
                <p className="text-sm font-medium text-[var(--ink)]">Two-Factor Authentication (2FA)</p>
                <p className="text-xs text-[var(--ink-muted)]">Require 2FA for all admin accounts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={require2fa} onChange={(e) => setRequire2fa(e.target.checked)} />
                <div className="w-11 h-6 bg-[var(--surface)] border border-[var(--outline-strong)] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)] peer-checked:border-[var(--color-primary)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--outline)] hover:border-[var(--outline-strong)] bg-[var(--surface-hover)] transition-all">
              <div>
                <p className="text-sm font-medium text-[var(--ink)]">Session Timeout</p>
                <p className="text-xs text-[var(--ink-muted)]">Automatically log out inactive users</p>
              </div>
              <select 
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="bg-[var(--surface)] border border-[var(--outline)] rounded-lg px-2 py-1 text-sm text-[var(--ink)] focus:outline-none cursor-pointer"
              >
                <option>15 Minutes</option>
                <option>30 Minutes</option>
                <option>1 Hour</option>
                <option>Never</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-5 border border-[var(--outline)] rounded-2xl bg-[var(--surface)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Key className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="text-[15px] font-semibold text-[var(--ink)]">Global API Keys</h3>
          </div>
          
          <div className="space-y-3">
            {!apiKeyRevoked ? (
              <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--outline)] bg-[var(--surface-hover)]">
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">Production API Key</p>
                  <p className="text-xs text-[var(--ink-muted)] font-mono mt-1">atp_live_xxxxxxxxxxxxxx</p>
                </div>
                <button 
                  onClick={() => setApiKeyRevoked(true)}
                  className="px-3 py-1.5 text-xs font-medium bg-[var(--surface)] border border-[var(--outline)] hover:border-rose-500 hover:text-rose-500 text-[var(--ink)] rounded-lg transition-colors cursor-pointer"
                >
                  Revoke
                </button>
              </div>
            ) : (
              <p className="text-sm text-[var(--ink-muted)] italic">No active API keys found.</p>
            )}
            <button 
              onClick={() => setApiKeyRevoked(false)}
              className="text-sm font-medium text-[var(--color-primary)] hover:underline cursor-pointer"
            >
              + Generate New Key
            </button>
          </div>
        </div>
        
        <div className="p-5 border border-[var(--outline)] rounded-2xl bg-[var(--surface)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Bell className="w-4 h-4 text-amber-500" />
            </div>
            <h3 className="text-[15px] font-semibold text-[var(--ink)]">System Notifications</h3>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={notifyTestFailure} 
                onChange={(e) => setNotifyTestFailure(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[var(--outline-strong)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer" 
              />
              <div>
                <p className="text-sm font-medium text-[var(--ink)] group-hover:text-[var(--color-primary)] transition-colors">Test Failure Alerts</p>
                <p className="text-xs text-[var(--ink-muted)]">Notify when critical end-to-end tests fail</p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={notifyWeekly}
                onChange={(e) => setNotifyWeekly(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[var(--outline-strong)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer" 
              />
              <div>
                <p className="text-sm font-medium text-[var(--ink)] group-hover:text-[var(--color-primary)] transition-colors">Weekly Reports</p>
                <p className="text-xs text-[var(--ink-muted)]">Send weekly summaries of API health</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-[var(--outline)] flex justify-end gap-3">
        <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer">
          Discard
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-70 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer"
        >
          {isSaving ? (
             <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : null}
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  );
};
