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
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] overflow-hidden">
      {/* Left Side: Simulation */}
      <div className="hidden lg:block lg:w-3/5 h-full relative">
        <AuthSimulation />
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-2/5 h-full flex flex-col items-center justify-center p-8 lg:p-16 relative bg-[#08080a] border-l border-[#111]">
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
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20">
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tighter">ATP AI</h1>
                <p className="text-[10px] text-[var(--color-primary)] font-bold tracking-[0.3em] uppercase leading-none">Testing Platform</p>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Initialize Workspace</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              AI-Driven API Testing Platform. Automate Swagger-based testing with intelligent workflows.
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

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
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
                  className="w-full bg-[#0d0d10] border border-[#222] focus:border-[var(--color-primary)]/50 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder-gray-700 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Secret Key</label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-[var(--color-primary)] transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0d0d10] border border-[#222] focus:border-[var(--color-primary)]/50 rounded-2xl py-4 pl-12 pr-12 text-sm text-white placeholder-gray-700 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-[var(--color-primary)]/20 flex items-center justify-center gap-3 group overflow-hidden relative"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-mono text-sm tracking-tighter">{loadingText}</span>
                </>
              ) : (
                <>
                  <span className="z-10">Initialize Workspace</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform z-10" />
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-10 text-center text-sm text-gray-500 font-medium">
            New to ATP AI?{' '}
            <Link to="/signup" className="text-[var(--color-primary)] font-bold hover:underline">
              Create AI Testing Workspace
            </Link>
          </p>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute bottom-8 right-8 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-mono text-gray-600">Secure AI Environment v2.4.0</span>
        </div>
      </div>
    </div>
  );
};
