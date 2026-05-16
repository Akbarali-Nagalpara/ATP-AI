import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, CheckCircle2, Braces, AlignLeft, Hash, Shield } from 'lucide-react';
import { Endpoint } from '../../store/useAppStore';

const methodColors: Record<string, string> = {
  GET: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  POST: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  PUT: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  DELETE: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  PATCH: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
};

const JsonViewer = ({ data, title, icon: Icon }: { data: any, title: string, icon: React.ElementType }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!data || Object.keys(data).length === 0) return null;

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-500" />
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</h4>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="bg-[#0a0a0c] border border-[#222] rounded-xl overflow-hidden p-4">
        <pre className="text-[13px] font-mono leading-relaxed overflow-x-auto custom-scrollbar">
          <code className="text-gray-300">
            {JSON.stringify(data, null, 2).split('\n').map((line, i) => {
              // Basic syntax highlighting simulation
              let color = 'text-gray-300';
              if (line.includes('true') || line.includes('false')) color = 'text-orange-400';
              else if (line.match(/: \d+/)) color = 'text-blue-400';
              else if (line.match(/: "/)) color = 'text-emerald-400';
              
              const isKey = line.match(/^\s*"/);
              if (isKey) {
                const parts = line.split(':');
                return (
                  <div key={i} className="table-row">
                    <span className="table-cell pr-4 text-gray-600 select-none text-right">{i + 1}</span>
                    <span className="table-cell whitespace-pre">
                      <span className="text-purple-400">{parts[0]}</span>
                      {parts.length > 1 && ':'}
                      <span className={color}>{parts.slice(1).join(':')}</span>
                    </span>
                  </div>
                );
              }

              return (
                <div key={i} className="table-row">
                  <span className="table-cell pr-4 text-gray-600 select-none text-right">{i + 1}</span>
                  <span className={`table-cell whitespace-pre ${color}`}>{line}</span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
};

export const ApiDetailsModal = ({ 
  endpoint, 
  isOpen, 
  onClose 
}: { 
  endpoint: Endpoint | null; 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  if (!endpoint) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-4xl bg-[var(--surface)] border border-[var(--outline)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-full transition-colors duration-300"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[var(--outline)] flex items-center justify-between shrink-0 bg-[var(--surface-hover)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--outline-strong)] to-transparent opacity-50" />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${methodColors[endpoint.method]}`}>
                    {endpoint.method}
                  </span>
                  <h3 className="text-lg font-mono font-bold text-[var(--ink)] tracking-tight">{endpoint.path}</h3>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-xs text-[var(--ink-muted)] font-medium">
                    <Shield className="w-3.5 h-3.5" /> 
                    {endpoint.authRequired ? 'Auth Required' : 'No Auth'}
                  </span>
                  {endpoint.role !== 'Unknown' && (
                    <span className="text-xs text-[var(--ink-muted)] font-medium">
                      Detected Role: <span className="text-[var(--ink)]">{endpoint.role}</span>
                    </span>
                  )}
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-[var(--surface)] rounded-xl transition-colors text-[var(--ink-muted)] hover:text-[var(--ink)] group">
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
            
            {/* Content body */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar bg-[var(--canvas)] transition-colors duration-300">
              <div className="max-w-3xl mx-auto space-y-8">
                
                <JsonViewer data={endpoint.headers} title="Headers" icon={AlignLeft} />
                <JsonViewer data={endpoint.queryParams} title="Query Params" icon={Hash} />
                <JsonViewer data={endpoint.requestBody} title="Request Body" icon={Braces} />
                <JsonViewer data={endpoint.responseExample} title="Expected Response" icon={Braces} />
                
                {(!endpoint.headers && !endpoint.queryParams && !endpoint.requestBody && !endpoint.responseExample) && (
                  <div className="text-center py-20">
                    <Braces className="w-12 h-12 text-[var(--ink-muted)] opacity-50 mx-auto mb-4" />
                    <p className="text-[var(--ink-muted)] text-sm">No detailed schema available for this endpoint.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-[var(--outline)] bg-[var(--surface-hover)] flex justify-end shrink-0 gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[var(--ink)] bg-[var(--surface)] hover:bg-[var(--outline)] border border-[var(--outline-strong)] transition-colors"
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
