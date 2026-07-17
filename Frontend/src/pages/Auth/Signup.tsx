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
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] overflow-hidden">
      {/* Left Side: Simulation */}
      <div className="hidden lg:block lg:w-1/2 h-full relative">
        <AuthSimulation />
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-start p-8 lg:p-16 relative bg-[#08080a] border-l border-[#111] overflow-y-auto custom-scrollbar">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl z-10 animate-fade-in"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20">
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tighter">ATP AI</h1>
                <p className="text-[10px] text-[var(--color-primary)] font-bold tracking-[0.3em] uppercase leading-none">Testing Platform</p>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Create Your AI Testing Workspace</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Provision a new secure environment for automated API orchestration and AI analysis.
            </p>
          </div>

          {/* Error Alert Box */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold leading-relaxed text-center lg:text-left"
            >
              {error}
            </motion.div>
          )}

          {/* Role Selection */}
          <div className="mb-8">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-4 block">Select Operational Role</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                    selectedRole === role.id 
                      ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]' 
                      : 'bg-[#0d0d10] border-[#222] hover:border-[#333]'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${role.bg}`}>
                    <role.icon className={`w-5 h-5 ${role.color}`} />
                  </div>
                  <span className={`text-[11px] font-bold tracking-tight ${selectedRole === role.id ? 'text-white' : 'text-gray-400'}`}>
                    {role.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Identity Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-[var(--color-primary)] transition-colors" />
                  <input
                    type="text"
                    required
                    placeholder="Admin User"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0d0d10] border border-[#222] focus:border-[var(--color-primary)]/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-700 transition-all outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Endpoint</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-[var(--color-primary)] transition-colors" />
                  <input
                    type="email"
                    required
                    placeholder="admin@atp.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0d0d10] border border-[#222] focus:border-[var(--color-primary)]/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-700 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Workspace Secret Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-[var(--color-primary)] transition-colors" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0d0d10] border border-[#222] focus:border-[var(--color-primary)]/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-700 transition-all outline-none"
                />
              </div>
            </div>

            <p className="text-[10px] text-gray-600 leading-relaxed px-1">
              By initializing this workspace, you agree to the <span className="text-gray-400 hover:underline cursor-pointer">AI Processing Terms</span> and <span className="text-gray-400 hover:underline cursor-pointer">DevOps Governance Policy</span>.
            </p>

            <button
              type="submit"
              disabled={isLoading || !selectedRole}
              className="w-full bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-[var(--color-primary)]/20 flex items-center justify-center gap-3 group overflow-hidden relative mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-mono text-sm tracking-tighter">{loadingText}</span>
                </>
              ) : (
                <>
                  <span className="z-10">Provision Workspace</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform z-10" />
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500" />
                </>
              )}
            </button>
          </form>

          {/* Social Auth */}
          <div className="mt-8 pt-8 border-t border-[#1a1a1f] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 font-medium">
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
