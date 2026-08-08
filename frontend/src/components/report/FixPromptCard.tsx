import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Copy, Check, ChevronDown, ChevronUp 
} from 'lucide-react';

interface FixPromptCardProps {
  endpointPath: string;
  issue: string;
  remediationPlan: string;
}

export const FixPromptCard: React.FC<FixPromptCardProps> = ({
  endpointPath,
  issue,
  remediationPlan,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(remediationPlan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="bg-[#101012]/60 backdrop-blur-xl border border-amber-500/10 hover:border-amber-500/20 rounded-2xl overflow-hidden shadow-xl group transition-all duration-300"
    >
      {/* Card Header */}
      <div className="px-5 py-4 border-b border-white/5 bg-gradient-to-r from-amber-500/[0.04] to-transparent flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Zap className="w-4 h-4 fill-amber-400/20 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                AI Suggested Fix
              </span>
              <span className="text-[11px] font-mono text-gray-500 truncate max-w-[180px] sm:max-w-xs font-semibold">
                {endpointPath}
              </span>
            </div>
            <p className="text-xs text-rose-400 font-semibold mt-0.5">{issue}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Copy fix prompt"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-[11px]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Content & Actionable Prompt */}
      <div className="p-5 space-y-4">
        {/* Short Summary Description */}
        <div className="text-xs text-gray-400 leading-relaxed font-medium">
          Below is the AI generated blueprint to patch this route failure. Expand to review the code-level instructions.
        </div>

        {/* Collapsible Remediation Area */}
        <div className="relative">
          <AnimatePresence initial={false}>
            <motion.div
              animate={{ 
                height: isExpanded ? 'auto' : '110px',
              }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden bg-[#070709] border border-white/5 rounded-xl font-mono text-xs text-gray-300 relative select-text"
            >
              <pre className="p-4 overflow-y-auto max-h-[400px] whitespace-pre-wrap leading-relaxed custom-scrollbar text-gray-400">
                {remediationPlan}
              </pre>

              {/* Fading bottom mask when collapsed */}
              {!isExpanded && (
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#070709] via-[#070709]/80 to-transparent pointer-events-none" />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Toggle Expand Button */}
          <div className="flex justify-center mt-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-1.5 rounded-xl transition-all border border-white/5"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  Collapse Fix Details
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  Expand Fix Details
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
