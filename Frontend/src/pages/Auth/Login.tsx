import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, 
  ChevronRight, ArrowRight, Zap, Loader2, Shield
} from 'lucide-react';
import { AuthSimulation } from '../../components/Auth/AuthSimulation';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const steps = [
      'Connecting AI Engine...',
      'Initializing Secure Session...',
      'Loading API Runtime...'
    ];

    for (const step of steps) {
      setLoadingText(step);
      await new Promise(r => setTimeout(r, 800));
    }

    navigate('/projects');
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
          <div className="mb-10 text-center lg:text-left">
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
                <button type="button" className="text-[11px] font-bold text-[var(--color-primary)] hover:underline">Forgot?</button>
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

            <div className="flex items-center gap-3 pt-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded-md bg-[#0d0d10] border border-[#222] accent-[var(--color-primary)]" />
              <label htmlFor="remember" className="text-xs text-gray-500 font-medium cursor-pointer">Maintain persistent session</label>
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

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#1a1a1f]" />
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Or authenticate via</span>
            <div className="h-px flex-1 bg-[#1a1a1f]" />
          </div>

          <button className="w-full bg-white text-black font-bold py-4 rounded-2xl transition-all hover:bg-gray-100 flex items-center justify-center gap-3 shadow-xl">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            Continue with GitHub
          </button>

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
