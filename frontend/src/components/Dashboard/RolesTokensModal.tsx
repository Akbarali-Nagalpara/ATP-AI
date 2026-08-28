import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Key, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const RolesTokensModal = ({ 
  isOpen, 
  onClose, 
  projectId 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  projectId: string;
}) => {
  const project = useAppStore((state) => state.projects.find(p => p.id === projectId));

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-3xl bg-[var(--surface)] border border-[var(--outline)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="px-6 py-4 border-b border-[var(--outline)] flex items-center justify-between shrink-0 bg-[var(--surface-hover)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-info)]/10 border border-[var(--color-info)]/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[var(--color-info)]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--ink)] tracking-tight">Detected Roles & Tokens</h3>
                  <p className="text-[var(--ink-muted)] text-xs">Live authentication status</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-[var(--surface)] rounded-xl transition-colors text-[var(--ink-muted)] hover:text-[var(--ink)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              {project.tokens.length === 0 ? (
                <div className="text-center py-10">
                  <Shield className="w-12 h-12 text-[var(--ink-muted)] opacity-50 mx-auto mb-3" />
                  <p className="text-[var(--ink-muted)]">No roles detected yet. Start the test run to begin role detection.</p>
                </div>
              ) : (
                <div className="bg-[var(--surface)] border border-[var(--outline)] rounded-2xl overflow-hidden shadow-xl">
                  <table className="w-full text-left text-sm text-[var(--ink-muted)]">
                    <thead className="bg-[var(--surface-hover)] text-xs uppercase text-[var(--ink-muted)] font-semibold border-b border-[var(--outline)]">
                      <tr>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Token</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--outline)]">
                      {project.tokens.map((tokenObj, idx) => (
                        <tr key={idx} className="hover:bg-[var(--surface-hover)] transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-semibold text-[var(--ink)] bg-[var(--surface-hover)] px-2.5 py-1 rounded-md text-xs border border-[var(--outline-strong)]">
                              {tokenObj.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {tokenObj.status === 'Pending' && (
                              <span className="flex items-center gap-1.5 text-[var(--ink-muted)] text-xs font-medium">
                                Waiting...
                              </span>
                            )}
                            {tokenObj.status === 'Authenticating' && (
                              <span className="flex items-center gap-1.5 text-[var(--color-info)] text-xs font-medium">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Authenticating
                              </span>
                            )}
                            {tokenObj.status === 'Authenticated' && (
                              <span className="flex items-center gap-1.5 text-[var(--color-success)] text-xs font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated
                              </span>
                            )}
                            {tokenObj.status === 'Failed' && (
                              <span className="flex items-center gap-1.5 text-[var(--color-danger)] text-xs font-medium">
                                <XCircle className="w-3.5 h-3.5" /> Failed
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 font-mono text-xs">
                            <div className="flex items-center gap-2">
                              <Key className="w-3.5 h-3.5 text-[var(--color-warning)] shrink-0" />
                              <input 
                                type="text"
                                placeholder="Paste JWT token..."
                                value={tokenObj.token || ''}
                                onChange={(e) => {
                                  useAppStore.getState().updateToken(projectId, tokenObj.role, { token: e.target.value, status: e.target.value ? 'Authenticated' : 'Pending' });
                                }}
                                className="bg-[var(--canvas)] border border-[var(--outline)] rounded px-2 py-1 text-[11px] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors w-full sm:w-64"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-[var(--outline)] bg-[var(--surface-hover)] flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-[var(--ink)] bg-[var(--surface)] hover:bg-[var(--outline)] border border-[var(--outline-strong)] transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
