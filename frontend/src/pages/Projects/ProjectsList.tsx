import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, FolderOpen, Clock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CreateProjectModal } from '../../components/Dashboard/CreateProjectModal';

export const ProjectsList = () => {
  const projects = useAppStore((state) => state.projects);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.swaggerUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-[var(--ink-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by name or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--surface-hover)] border border-[var(--outline)] hover:border-[var(--outline-strong)] focus:border-[var(--color-primary)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none transition-colors"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:opacity-90 active:scale-95 text-[#080810] px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(0,229,160,0.15)] shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center max-w-lg mx-auto mt-12 transition-all">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-[var(--surface-hover)] border border-[var(--outline)] rounded-2xl flex items-center justify-center shadow-lg relative z-10 text-[var(--ink-muted)]">
              <FolderOpen className="w-8 h-8 opacity-80" />
            </div>
            <div className="absolute inset-0 bg-[var(--color-primary)]/20 blur-xl rounded-full -z-10 animate-pulse" style={{ animationDuration: '3s' }} />
          </div>

          <h3 className="text-[var(--ink)] text-base font-bold tracking-tight">No projects configured yet</h3>
          <p className="text-[var(--ink-muted)] text-xs mt-1.5 leading-relaxed max-w-sm mb-6">
            Import a Swagger description file to create a project.
          </p>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[var(--color-primary)] hover:opacity-90 active:scale-95 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            Create your first project
          </button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center max-w-lg mx-auto mt-12 transition-all">
          <Search className="w-12 h-12 text-[var(--ink-muted)] opacity-50 mb-4" />
          <h3 className="text-[var(--ink)] text-base font-bold tracking-tight">No matching projects</h3>
          <p className="text-[var(--ink-muted)] text-xs mt-1.5 leading-relaxed max-w-sm mb-6">
            We couldn't find any projects matching "{searchQuery}".
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-[var(--color-primary)] hover:underline text-xs font-bold"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const passed = project.endpoints.filter(e => e.status === 'Pass').length;
            const passRate = project.endpoints.length > 0 ? Math.round((passed / project.endpoints.length) * 100) : 0;
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="relative overflow-hidden bg-[var(--surface)] border border-[var(--outline)] hover:border-[var(--outline-strong)] p-6 rounded-2xl flex flex-col h-full shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                {/* Subtle Hover Gradient Layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/[0.01] dark:from-white/[0.01] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="flex justify-between items-start mb-2.5">
                  <h3 className="text-[var(--ink)] font-bold text-lg tracking-tight truncate max-w-[70%]" title={project.name}>
                    {project.name}
                  </h3>
                  <span className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest rounded-md border ${
                    project.testingState === 'completed' ? 'text-emerald-500 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/10' :
                    project.testingState === 'idle' ? 'text-[var(--ink-muted)] border-[var(--outline)] bg-[var(--surface-hover)]' :
                    'text-rose-500 dark:text-rose-400 border-rose-500/20 bg-rose-500/10 animate-pulse'
                  }`}>
                    {project.testingState === 'completed' ? 'Tested' : project.testingState === 'idle' ? 'Ready' : 'Running'}
                  </span>
                </div>
                
                <p className="text-[var(--ink-muted)] text-xs truncate mb-6 font-mono" title={project.swaggerUrl}>
                  {project.swaggerUrl}
                </p>
                
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-[var(--surface-hover)] border border-[var(--outline)] p-3.5 rounded-xl shadow-sm transition-colors duration-300 flex flex-col justify-between">
                    <p className="text-[9px] text-[var(--ink-muted)] uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5">
                      Total Endpoints
                    </p>
                    <p className="text-xl font-extrabold text-[var(--ink)] font-mono">{project.endpoints.length}</p>
                  </div>
                  <div className="bg-[var(--surface-hover)] border border-[var(--outline)] p-3.5 rounded-xl shadow-sm transition-colors duration-300 flex flex-col justify-between">
                    <p className="text-[9px] text-[var(--ink-muted)] uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5">
                      Pass Rate
                    </p>
                    <p className={`text-xl font-extrabold font-mono ${
                      project.endpoints.length === 0 ? 'text-[var(--ink-muted)]' :
                      passRate > 80 ? 'text-[var(--color-success)]' : 
                      passRate > 50 ? 'text-[var(--color-warning)]' : 
                      'text-[var(--color-danger)]'
                    }`}>
                      {project.endpoints.length > 0 ? `${passRate}%` : '--'}
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-[var(--outline)] transition-colors duration-300">
                  <button 
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="flex-1 bg-[var(--surface-hover)] hover:bg-[var(--outline)] text-[var(--ink)] text-[11px] font-bold py-2 px-3 rounded-lg transition-all border border-[var(--outline)] flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    Open Workspace
                  </button>
                  {project.testingState === 'completed' && (
                    <button 
                      onClick={() => navigate(`/reports/${project.id}`)}
                      className="flex-1 bg-[var(--color-primary)] hover:opacity-90 active:scale-95 text-[#080810] text-[11px] font-bold py-2 px-3 rounded-lg transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      View Report
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
