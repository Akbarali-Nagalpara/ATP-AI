import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Zap, Search, Key, CheckCircle2, Eye } from 'lucide-react';
import { OtpWorkflow } from '../../store/useAppStore';

interface OtpDetectionStatusProps {
  workflow: OtpWorkflow | null;
  onViewDetails: () => void;
}

export const OtpDetectionStatus: React.FC<OtpDetectionStatusProps> = ({ workflow, onViewDetails }) => {
  if (!workflow) return null;

  const getStatusConfig = () => {
    switch (workflow.status) {
      case 'idle':
        return { icon: ShieldAlert, color: 'text-[var(--ink-muted)]', label: 'OTP Flow Detected', bg: 'bg-[var(--surface-hover)]' };
      case 'waiting':
        return { icon: Zap, color: 'text-amber-400', label: 'Waiting for OTP...', bg: 'bg-amber-400/10', animate: true };
      case 'detected':
        return { icon: Search, color: 'text-blue-400', label: 'OTP Detected in Logs', bg: 'bg-blue-400/10' };
      case 'captured':
        return { icon: Key, color: 'text-emerald-400', label: 'OTP Captured', bg: 'bg-emerald-400/10' };
      case 'verifying':
        return { icon: Zap, color: 'text-amber-400', label: 'Verifying OTP...', bg: 'bg-amber-400/10', animate: true };
      case 'success':
        return { icon: CheckCircle2, color: 'text-emerald-400', label: 'OTP Verified', bg: 'bg-emerald-400/10' };
      case 'failed':
        return { icon: ShieldAlert, color: 'text-rose-400', label: 'OTP Verification Failed', bg: 'bg-rose-400/10' };
      default:
        return { icon: ShieldAlert, color: 'text-[var(--ink-muted)]', label: 'OTP Flow', bg: 'bg-[var(--surface-hover)]' };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-3 px-4 py-2 rounded-xl border border-[var(--outline)] ${config.bg} backdrop-blur-md shadow-lg shadow-black/20 group cursor-pointer overflow-hidden relative`}
      onClick={onViewDetails}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      <div className={`relative flex items-center justify-center ${config.animate ? 'animate-pulse' : ''}`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
        {config.animate && (
          <motion.div 
            className={`absolute inset-0 rounded-full ${config.color.replace('text', 'bg')}/20`}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
      
      <div className="flex flex-col">
        <span className="text-[10px] text-[var(--ink-muted)] font-bold uppercase tracking-wider leading-none mb-1">AI Engine</span>
        <span className={`text-xs font-bold ${config.color} leading-none`}>{config.label}</span>
      </div>

      <div className="ml-2 w-px h-6 bg-[var(--outline)]" />
      
      <button className="p-1 hover:bg-white/10 rounded-lg transition-colors">
        <Eye className="w-3.5 h-3.5 text-[var(--ink-muted)] group-hover:text-[var(--ink)]" />
      </button>
    </motion.div>
  );
};
