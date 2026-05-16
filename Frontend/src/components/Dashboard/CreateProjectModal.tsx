import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useAppStore, Project } from '../../store/useAppStore';
import { swaggerService } from '../../services/swaggerService';

export const CreateProjectModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const addProject = useAppStore((state) => state.addProject);
  const navigate = useNavigate();

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    setIsLoading(true);
    const endpoints = await swaggerService.importSwagger(url);
    
    const newProject: Project = {
      id: Math.random().toString(36).substring(7),
      name,
      swaggerUrl: url,
      endpoints,
      logs: [{ id: '1', timestamp: new Date().toLocaleTimeString(), message: 'Swagger APIs imported successfully', type: 'success' }],
      insights: [],
      tokens: [],
      testingState: 'idle'
    };

    addProject(newProject);
    setIsLoading(false);
    onClose();
    navigate(`/projects/${newProject.id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-[var(--surface)] border border-[var(--outline)] rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-[var(--outline)] flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--ink)]">Create New Project</h3>
              <button onClick={onClose} className="p-1 hover:bg-[var(--surface-hover)] rounded-lg transition-colors">
                <X className="w-5 h-5 text-[var(--ink-muted)]" />
              </button>
            </div>
            
            <form onSubmit={handleImport} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--ink-muted)]">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Core API Service"
                  className="w-full bg-[var(--surface-hover)] border border-[var(--outline)] rounded-xl px-4 py-2.5 text-[var(--ink)] placeholder-[var(--outline-strong)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--ink-muted)]">Swagger URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-[var(--outline-strong)]" />
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://api.example.com/swagger.json"
                    className="w-full bg-[var(--surface-hover)] border border-[var(--outline)] rounded-xl pl-10 pr-4 py-2.5 text-[var(--ink)] placeholder-[var(--outline-strong)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-70 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-md"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Importing APIs...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Import APIs
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
