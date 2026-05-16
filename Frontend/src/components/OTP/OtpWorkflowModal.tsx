import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShieldCheck, Terminal, Cpu, Clock, CheckCircle2, 
  AlertCircle, Search, Key, ChevronRight, Zap, Loader2
} from 'lucide-react';
import { OtpWorkflow } from '../../store/useAppStore';

interface OtpWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflow: OtpWorkflow | null;
}

export const OtpWorkflowModal: React.FC<OtpWorkflowModalProps> = ({ isOpen, onClose, workflow }) => {
  if (!workflow) return null;

  const steps = [
    { id: 'send', label: 'Send OTP API', status: workflow.status === 'idle' ? 'pending' : (workflow.status === 'failed' ? 'failed' : 'completed'), icon: Zap },
    { id: 'detect', label: 'OTP Detection', status: ['detected', 'captured', 'verifying', 'success'].includes(workflow.status) ? 'completed' : (workflow.status === 'waiting' ? 'running' : 'pending'), icon: Search },
    { id: 'capture', label: 'OTP Captured', status: ['captured', 'verifying', 'success'].includes(workflow.status) ? 'completed' : (workflow.status === 'detected' ? 'running' : 'pending'), value: workflow.extractedOtp, icon: Key },
    { id: 'verify', label: 'Verify OTP API', status: workflow.status === 'success' ? 'completed' : (workflow.status === 'verifying' ? 'running' : 'pending'), icon: ShieldCheck },
    { id: 'token', label: 'JWT Generated', status: workflow.status === 'success' ? 'completed' : 'pending', icon: Key },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'running': return <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-rose-500" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-[var(--surface)] border border-[var(--outline)] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[80vh] md:h-[600px]"
          >
            {/* Left Panel: Workflow Progress */}
            <div className="w-full md:w-80 border-r border-[var(--outline)] bg-[var(--surface-hover)] p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-lg shadow-amber-500/10">
                  <Cpu className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--ink)] tracking-tight">OTP Engine</h2>
                  <p className="text-[10px] text-[var(--ink-muted)] font-bold uppercase tracking-widest">Workflow Monitor</p>
                </div>
              </div>

              <div className="space-y-1 relative">
                {/* Connector line */}
                <div className="absolute left-6 top-8 bottom-8 w-px bg-[var(--outline)]" />
                
                {steps.map((step, idx) => (
                  <div key={step.id} className="relative flex items-center gap-4 py-3 px-2 rounded-xl transition-colors">
                    <div className={`z-10 w-8 h-8 rounded-lg flex items-center justify-center border ${
                      step.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                      step.status === 'running' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                      'bg-[var(--surface)] border-[var(--outline)] text-[var(--ink-muted)]'
                    }`}>
                      <step.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${step.status === 'pending' ? 'text-[var(--ink-muted)]' : 'text-[var(--ink)]'}`}>
                        {step.label}
                      </p>
                      {step.value && (
                        <p className="text-xs font-mono text-emerald-400 mt-0.5">{step.value}</p>
                      )}
                    </div>
                    <div>{getStatusIcon(step.status)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-[var(--outline)]">
                <div className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--outline)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Status</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      workflow.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 
                      workflow.status === 'failed' ? 'bg-rose-500/10 text-rose-500' : 
                      'bg-amber-500/10 text-amber-500 animate-pulse'
                    }`}>
                      {workflow.status}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--outline)] rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                      initial={{ width: '0%' }}
                      animate={{ width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Simulated Logs */}
            <div className="flex-1 flex flex-col bg-[var(--canvas)]">
              <div className="px-6 py-4 border-b border-[var(--outline)] flex items-center justify-between bg-[var(--surface)]">
                <div className="flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-[var(--ink)]">otp_monitor_logs.log</span>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1.5 hover:bg-[var(--surface-hover)] rounded-lg transition-colors group"
                >
                  <X className="w-4 h-4 text-[var(--ink-muted)] group-hover:text-[var(--ink)]" />
                </button>
              </div>

              <div className="flex-1 p-6 overflow-y-auto font-mono text-[13px] leading-relaxed custom-scrollbar">
                {workflow.logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-4 opacity-50">
                    <div className="relative">
                      <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
                      <Search className="w-12 h-12 text-gray-700 relative z-10" />
                    </div>
                    <p className="text-center max-w-[240px]">Waiting for OTP generation event from terminal logs...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {workflow.logs.map((log) => {
                      let typeColor = 'text-[var(--ink-muted)]';
                      let msgColor = 'text-[var(--ink)]';
                      let icon = <ChevronRight className="w-3.5 h-3.5" />;

                      if (log.type === 'otp') {
                        typeColor = 'text-amber-500';
                        msgColor = 'text-amber-400 font-bold';
                        icon = <Zap className="w-3.5 h-3.5" />;
                      } else if (log.type === 'success') {
                        typeColor = 'text-emerald-500';
                        msgColor = 'text-emerald-400';
                        icon = <CheckCircle2 className="w-3.5 h-3.5" />;
                      } else if (log.type === 'error') {
                        typeColor = 'text-rose-500';
                        msgColor = 'text-rose-400 font-bold';
                        icon = <AlertCircle className="w-3.5 h-3.5" />;
                      }

                      return (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          key={log.id} 
                          className="flex gap-4 group"
                        >
                          <span className="text-[var(--ink-muted)] opacity-50 shrink-0 tabular-nums">[{log.timestamp}]</span>
                          <span className={`${typeColor} shrink-0`}>{icon}</span>
                          <span className={`${msgColor} break-all`}>{log.message}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-[var(--outline)] bg-[var(--surface-hover)] flex items-center justify-between text-[11px]">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    Extraction Service: Online
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Log Monitor: Listening
                  </div>
                </div>
                <div className="text-gray-600 font-mono">
                  PID: 8492
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
