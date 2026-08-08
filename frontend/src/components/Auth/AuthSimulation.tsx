import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Zap, Search, ShieldCheck, Cpu, 
  CheckCircle2, XCircle, ChevronRight, Activity,
  Globe, Database, Lock, Code
} from 'lucide-react';

const LOGS = [
  { text: "> Parsing Swagger Schema...", type: 'info' },
  { text: "> 248 Endpoints Imported", type: 'success' },
  { text: "> AI Role Detection Started", type: 'info' },
  { text: "> User Role: [Client] Identified", type: 'success' },
  { text: "> Admin Role: [Platform Admin] Identified", type: 'success' },
  { text: "> OTP Authentication Flow Detected", type: 'warning' },
  { text: "> Mock Terminal Listener Online", type: 'info' },
  { text: "> Extracting OTP: 882415", type: 'warning' },
  { text: "> JWT Token Generated Successfully", type: 'success' },
  { text: "> Running Parallel API Tests...", type: 'info' },
  { text: "> GET /api/v1/users [PASS 200 OK]", type: 'success' },
  { text: "> POST /api/v1/orders [FAIL 403 Forbidden]", type: 'error' },
  { text: "> Analyzing RBAC Vulnerability...", type: 'warning' },
  { text: "> AI Fix Suggestion: Add scope 'orders:write'", type: 'success' },
  { text: "> AI Report Generated Successfully", type: 'success' },
];

const API_CARDS = [
  { method: 'GET', path: '/api/v1/users', status: 'PASS', code: 200, time: '120ms' },
  { method: 'POST', path: '/api/v1/orders', status: 'FAIL', code: 403, time: '45ms' },
  { method: 'PUT', path: '/api/v1/profile', status: 'PASS', code: 200, time: '185ms' },
  { method: 'DELETE', path: '/api/v1/items/4', status: 'FAIL', code: 401, time: '12ms' },
];

export const AuthSimulation = () => {
  const [activeLogs, setActiveLogs] = useState<typeof LOGS>([]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLogs(prev => {
        const next = [...prev, LOGS[prev.length % LOGS.length]];
        if (next.length > 12) return next.slice(1);
        return next;
      });
      setStep(s => (s + 1) % 100);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full bg-[#050505] overflow-hidden flex flex-col p-8 font-inter">
      {/* Background Grid & Particles */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #333 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      {/* Floating API Cards */}
      <div className="absolute top-10 right-10 flex flex-col gap-4 z-10">
        {API_CARDS.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.5 }}
            className="bg-[#0f0f12]/80 backdrop-blur-xl border border-[#222] p-4 rounded-2xl w-64 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                card.method === 'GET' ? 'bg-emerald-500/10 text-emerald-500' :
                card.method === 'POST' ? 'bg-blue-500/10 text-blue-500' :
                'bg-orange-500/10 text-orange-500'
              }`}>
                {card.method}
              </span>
              <span className={`text-[10px] font-bold ${card.status === 'PASS' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {card.status} • {card.time}
              </span>
            </div>
            <p className="text-xs font-mono text-gray-400 truncate">{card.path}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Workflow Visualization */}
      <div className="flex-1 flex flex-col justify-center gap-12 relative z-10">
        <div className="flex items-center gap-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 max-w-sm">
            <h3 className="text-xl font-bold text-white mb-1">Swagger Imported</h3>
            <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-500"
                animate={{ width: ['0%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 translate-x-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 max-w-sm">
            <h3 className="text-xl font-bold text-white mb-1">AI Detecting Roles</h3>
            <div className="flex gap-2">
              <span className="text-[10px] font-bold bg-[#111] text-emerald-400 border border-emerald-400/20 px-2 py-1 rounded">Admin</span>
              <span className="text-[10px] font-bold bg-[#111] text-blue-400 border border-blue-400/20 px-2 py-1 rounded">Worker</span>
              <span className="text-[10px] font-bold bg-[#111] text-purple-400 border border-purple-400/20 px-2 py-1 rounded">Public</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 translate-x-24">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 max-w-sm">
            <h3 className="text-xl font-bold text-white mb-1">Secure Execution</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs text-gray-500 font-mono">Running Automated Test Suite...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Panel */}
      <div className="h-64 bg-[#08080a]/80 backdrop-blur-md border border-[#222] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-3 border-b border-[#222] bg-[#0d0d0f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 text-emerald-500" />
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">AI Core Runtime</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
          </div>
        </div>
        <div className="p-5 flex-1 font-mono text-[13px] overflow-y-auto custom-scrollbar bg-gradient-to-b from-transparent to-emerald-500/5">
          <AnimatePresence mode="popLayout">
            {activeLogs.map((log, i) => (
              <motion.div
                key={i + log.text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-4 mb-2 group"
              >
                <span className="text-gray-700 shrink-0 select-none">[{new Date().toLocaleTimeString()}]</span>
                <span className={`${
                  log.type === 'success' ? 'text-emerald-400' :
                  log.type === 'error' ? 'text-rose-400' :
                  log.type === 'warning' ? 'text-amber-400' :
                  'text-blue-400'
                } break-all`}>
                  {log.text}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 animate-pulse">❯</span>
            <span className="w-2 h-5 bg-emerald-500/50 animate-blink" />
          </div>
        </div>
      </div>

      {/* Decorative AI Glow */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[var(--color-primary)]/10 to-transparent pointer-events-none" />
    </div>
  );
};
