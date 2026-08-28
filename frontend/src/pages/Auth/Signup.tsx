import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, Lock, User as UserIcon, 
  ArrowRight, Zap, Loader2,
  Code, Activity, ShieldAlert, Cpu, Users
} from 'lucide-react';
import { AuthSimulation } from '../../components/Auth/AuthSimulation';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../store/auth.store';

const ROLES = [
  { id: 'backend', label: 'Backend Developer', icon: Code, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'qa', label: 'QA Engineer', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: 'devops', label: 'DevOps Engineer', icon: Cpu, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  { id: 'security', label: 'Security Tester', icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  { id: 'lead', label: 'Team Lead', icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
];

export const Signup = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Call Backend Registration API
      const response = await authService.register({ name, email, password, confirmPassword: password });
      const { user, tokens } = response.data.data;

      // 2. Play beautiful simulation steps
      const steps = [
        'Creating Workspace...',
        'Initializing API Runtime...',
        'Preparing AI Engine...',
        'Generating Secure Environment...',
        'Workspace Ready'
      ];

      for (const step of steps) {
        setLoadingText(step);
        await new Promise(r => setTimeout(r, 600));
      }

      // 3. Update Zustand Store
      setAccessToken(tokens.accessToken);
      setUser(user);

      // 4. Redirect
      navigate('/projects');
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to provision workspace. Please try again.';
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden" style={{ background: 'var(--canvas)' }}>
      {/* Left Side: Simulation */}
      <div className="hidden lg:block lg:w-1/2 h-full relative">
        <AuthSimulation />
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-start p-8 lg:p-16 relative overflow-y-auto custom-scrollbar border-l" style={{ background: 'var(--surface)', borderColor: 'var(--outline)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl z-10 animate-fade-in"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <img src="/Main_Logo.png" alt="Endpoint IQ Logo" className="w-80 max-w-none object-contain block dark:hidden" />
              <img src="/main_Logo_Dark.png" alt="Endpoint IQ Logo" className="w-80 max-w-none object-contain hidden dark:block" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--ink)] mb-2">Create Your Workspace</h2>
            <p className="text-[var(--ink-muted)] text-sm leading-relaxed">
              Get started with AI-powered automated API testing in minutes.
            </p>
          </div>

          {/* Error Alert Box */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 text-[var(--color-danger)] text-xs font-semibold leading-relaxed"
            >
              {error}
            </motion.div>
          )}

          {/* Role Selection */}
          <div className="mb-6">
            <label className="text-[11px] font-bold text-[var(--ink-muted)] uppercase tracking-widest ml-1 mb-3 block">Your Role</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex flex-col items-center gap-2.5 p-3.5 rounded-xl border transition-all ${
                    selectedRole === role.id
                      ? 'bg-[var(--surface-2)] border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/50'
                      : 'bg-[var(--surface-hover)] border-[var(--outline)] hover:border-[var(--outline-strong)]'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${role.bg}`}>
                    <role.icon className={`w-4 h-4 ${role.color}`} />
                  </div>
                  <span className={`text-[11px] font-bold tracking-tight ${selectedRole === role.id ? 'text-[var(--ink)]' : 'text-[var(--ink-muted)]'}`}>
                    {role.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[var(--ink-muted)] uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-faint)] group-focus-within:text-[var(--color-primary)] transition-colors" />
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[var(--surface-hover)] border border-[var(--outline)] focus:border-[var(--color-primary)]/60 focus:ring-2 focus:ring-[var(--color-primary)]/10 rounded-xl py-3 pl-10 pr-4 text-sm text-[var(--ink)] placeholder-[var(--ink-faint)] transition-all outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[var(--ink-muted)] uppercase tracking-widest ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-faint)] group-focus-within:text-[var(--color-primary)] transition-colors" />
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[var(--surface-hover)] border border-[var(--outline)] focus:border-[var(--color-primary)]/60 focus:ring-2 focus:ring-[var(--color-primary)]/10 rounded-xl py-3 pl-10 pr-4 text-sm text-[var(--ink)] placeholder-[var(--ink-faint)] transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--ink-muted)] uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-faint)] group-focus-within:text-[var(--color-primary)] transition-colors" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--surface-hover)] border border-[var(--outline)] focus:border-[var(--color-primary)]/60 focus:ring-2 focus:ring-[var(--color-primary)]/10 rounded-xl py-3 pl-10 pr-4 text-sm text-[var(--ink)] placeholder-[var(--ink-faint)] transition-all outline-none"
                />
              </div>
            </div>

            <p className="text-[10px] text-gray-600 leading-relaxed px-1">
              By initializing this workspace, you agree to the <span className="text-gray-400 hover:underline cursor-pointer">AI Processing Terms</span> and <span className="text-gray-400 hover:underline cursor-pointer">DevOps Governance Policy</span>.
            </p>

            <button
              type="submit"
              disabled={isLoading || !selectedRole}
              className="w-full btn-primary disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 group mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm tracking-tight font-mono">{loadingText}</span>
                </>
              ) : (
                <>
                  <span>Create Workspace</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Social Auth */}
          <div className="mt-8 pt-6 border-t border-[var(--outline)] flex items-center justify-center">
            <p className="text-sm text-[var(--ink-muted)] font-medium">
              Already have a workspace?{' '}
              <Link to="/login" className="text-[var(--color-primary)] font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
