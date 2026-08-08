import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CreateProjectModal } from '../../components/Dashboard/CreateProjectModal';

export const ProjectsList = () => {
  const projects = useAppStore((state) => state.projects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-7xl mx-auto w-full transition-colors duration-300">
      <div className="flex items-center justify-end mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[var(--color-primary)] hover:opacity-90 active:scale-95 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Create New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center max-w-lg mx-auto mt-12 transition-all">
          <div className="relative mb-6">
            {/* Sparkles */}
            <div className="absolute -top-4 -left-4 animate-bounce text-pink-300" style={{ animationDuration: '3s' }}>
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-4 animate-bounce text-pink-300" style={{ animationDuration: '4.5s' }}>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
              </svg>
            </div>
            <div className="absolute bottom-2 -right-4 animate-pulse text-pink-300">
              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
              </svg>
            </div>

            {/* Pink Folder */}
            <div className="w-20 h-16 bg-gradient-to-br from-pink-300 via-pink-400 to-rose-400 rounded-2xl shadow-[0_12px_24px_rgba(244,63,94,0.2)] relative flex items-center justify-center border border-white/20">
              {/* Folder tab */}
              <div className="absolute -top-2.5 left-3 w-8 h-4 bg-pink-300 rounded-t-lg -z-10" />
              {/* Inner document sheet peaking out */}
              <div className="absolute -top-1 left-6 w-8 h-8 bg-white/90 rounded-md -z-10 shadow-sm transform -rotate-6" />
              {/* Folder front flap */}
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-br from-pink-300/40 to-rose-500/10 backdrop-blur-[2px] rounded-b-2xl border-t border-white/20" />
            </div>
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => {
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
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-[var(--surface-hover)] border border-[var(--outline)] p-4 rounded-xl shadow-sm transition-colors duration-300">
                    <p className="text-[10px] text-[var(--ink-muted)] uppercase font-bold tracking-widest mb-1.5">Total APIs</p>
                    <p className="text-2xl font-extrabold text-[var(--ink)] font-sans">{project.endpoints.length}</p>
                  </div>
                  <div className="bg-[var(--surface-hover)] border border-[var(--outline)] p-4 rounded-xl shadow-sm transition-colors duration-300">
                    <p className="text-[10px] text-[var(--ink-muted)] uppercase font-bold tracking-widest mb-1.5">Pass Rate</p>
                    <p className={`text-2xl font-extrabold font-sans ${
                      project.endpoints.length === 0 ? 'text-[var(--ink-muted)]' :
                      passRate > 80 ? 'text-emerald-500 dark:text-emerald-400' : 
                      passRate > 50 ? 'text-amber-500 dark:text-amber-400' : 
                      'text-rose-500 dark:text-rose-400'
                    }`}>
                      {project.endpoints.length > 0 ? `${passRate}%` : '--'}
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 pt-5 border-t border-[var(--outline)] transition-colors duration-300">
                  <button 
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="flex-1 bg-[var(--surface-hover)] hover:bg-[var(--outline)] text-[var(--ink)] text-xs font-bold py-2.5 px-4 rounded-xl transition-all border border-[var(--outline)] flex items-center justify-center gap-1.5"
                  >
                    Open Workspace
                  </button>
                  {project.testingState === 'completed' && (
                    <button 
                      onClick={() => navigate(`/reports/${project.id}`)}
                      className="flex-1 bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold py-2.5 px-4 rounded-xl transition-all border border-[var(--color-primary)]/20 flex items-center justify-center gap-1.5 shadow-sm"
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
