import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, 
  ArrowRight, Zap, Loader2, Shield
} from 'lucide-react';
import { AuthSimulation } from '../../components/Auth/AuthSimulation';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../store/auth.store';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Authenticate with Backend API
      const response = await authService.login({ email, password });
      const { user, tokens } = response.data.data;

      // 2. Play beautiful simulation steps
      const steps = [
        'Connecting AI Engine...',
        'Initializing Secure Session...',
        'Loading API Runtime...'
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
      const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to authenticate. Please check your credentials.';
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden" style={{ background: 'var(--canvas)' }}>
      {/* Left Side: Simulation */}
      <div className="hidden lg:block lg:w-3/5 h-full relative">
        <AuthSimulation />
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-2/5 h-full flex flex-col items-center justify-center p-8 lg:p-14 relative border-l" style={{ background: 'var(--surface)', borderColor: 'var(--outline)' }}>
        {/* Mobile Simulation Placeholder */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-1/3 opacity-30 pointer-events-none">
          <AuthSimulation />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md z-10"
        >
          {/* Header */}
          <div className="mb-8 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <img src="/Main_Logo.png" alt="Endpoint IQ Logo" className="w-80 max-w-none object-contain block dark:hidden" />
              <img src="/main_Logo_Dark.png" alt="Endpoint IQ Logo" className="w-80 max-w-none object-contain hidden dark:block" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--ink)] mb-2">Welcome back</h2>
            <p className="text-[var(--ink-muted)] text-sm leading-relaxed">
              Sign in to your workspace to continue testing your APIs.
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

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--ink-muted)] uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-faint)] group-focus-within:text-[var(--color-primary)] transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--surface-hover)] border border-[var(--outline)] focus:border-[var(--color-primary)]/60 focus:ring-2 focus:ring-[var(--color-primary)]/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-[var(--ink)] placeholder-[var(--ink-faint)] transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--ink-muted)] uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-faint)] group-focus-within:text-[var(--color-primary)] transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--surface-hover)] border border-[var(--outline)] focus:border-[var(--color-primary)]/60 focus:ring-2 focus:ring-[var(--color-primary)]/10 rounded-xl py-3.5 pl-11 pr-12 text-sm text-[var(--ink)] placeholder-[var(--ink-faint)] transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 group mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm tracking-tight font-mono">{loadingText}</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mt-6">
            <div className="flex-1 h-px bg-[var(--outline)]" />
            <span className="text-[11px] text-[var(--ink-faint)] font-medium">New to Endpoint IQ?</span>
            <div className="flex-1 h-px bg-[var(--outline)]" />
          </div>
          <Link
            to="/signup"
            className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--outline)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:border-[var(--outline-strong)] hover:bg-[var(--surface-hover)] text-sm font-semibold transition-all"
          >
            Create a workspace
          </Link>
        </motion.div>

        {/* Decorative bottom badge */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-[var(--color-success)]" />
          <span className="text-[10px] font-mono text-[var(--ink-faint)]">Secured by Endpoint IQ v2.4</span>
        </div>
      </div>
    </div>
  );
};
