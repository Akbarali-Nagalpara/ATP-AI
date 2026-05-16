import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Folder, CheckCircle, XCircle, Plus, Activity } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CreateProjectModal } from '../../components/Dashboard/CreateProjectModal';

export const ProjectsList = () => {
  const projects = useAppStore((state) => state.projects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-7xl mx-auto w-full transition-colors duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ink)] tracking-tight">Projects</h1>
          <p className="text-[var(--ink-muted)] text-sm mt-1">Manage and execute your API test suites</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[var(--color-primary)] hover:opacity-90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Create New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[var(--surface)] border border-[var(--outline)] border-dashed rounded-2xl transition-colors duration-300">
          <Folder className="w-12 h-12 text-[var(--ink-muted)] mb-4 opacity-50" />
          <p className="text-[var(--ink-muted)] text-sm mb-4">No projects found. Import a Swagger file to get started.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-[var(--color-primary)] text-sm font-medium hover:underline"
          >
            Create your first project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => {
            const passed = project.endpoints.filter(e => e.status === 'Pass').length;
            const failed = project.endpoints.filter(e => e.status === 'Fail').length;
            const passRate = project.endpoints.length > 0 ? Math.round((passed / project.endpoints.length) * 100) : 0;
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--surface)] border border-[var(--outline)] hover:border-[var(--outline-strong)] rounded-2xl p-5 transition-all hover:-translate-y-1 shadow-md hover:shadow-lg flex flex-col h-full duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[var(--ink)] font-semibold text-lg">{project.name}</h3>
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                    project.testingState === 'completed' ? 'text-[var(--color-success)] border-[var(--color-success)]/30 bg-[var(--color-success)]/10' :
                    project.testingState === 'idle' ? 'text-[var(--ink-muted)] border-[var(--outline-strong)] bg-[var(--surface-hover)]' :
                    'text-[var(--color-info)] border-[var(--color-info)]/30 bg-[var(--color-info)]/10 animate-pulse'
                  }`}>
                    {project.testingState === 'completed' ? 'Tested' : project.testingState === 'idle' ? 'Ready' : 'Running'}
                  </span>
                </div>
                <p className="text-[var(--ink-muted)] text-xs truncate mb-6" title={project.swaggerUrl}>
                  {project.swaggerUrl}
                </p>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-[var(--surface-hover)] p-3 rounded-xl border border-[var(--outline)] transition-colors duration-300">
                    <p className="text-[10px] text-[var(--ink-muted)] uppercase font-bold tracking-wider mb-1">Total APIs</p>
                    <p className="text-xl font-bold text-[var(--ink)]">{project.endpoints.length}</p>
                  </div>
                  <div className="bg-[var(--surface-hover)] p-3 rounded-xl border border-[var(--outline)] transition-colors duration-300">
                    <p className="text-[10px] text-[var(--ink-muted)] uppercase font-bold tracking-wider mb-1">Pass Rate</p>
                    <p className={`text-xl font-bold ${passRate > 80 ? 'text-[var(--color-success)]' : passRate > 50 ? 'text-[var(--color-warning)]' : 'text-[var(--color-danger)]'}`}>
                      {project.endpoints.length > 0 ? `${passRate}%` : '--'}
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-[var(--outline)] transition-colors duration-300">
                  <button 
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="flex-1 bg-[var(--surface-hover)] hover:bg-[var(--outline)] text-[var(--ink)] text-xs font-semibold py-2 rounded-lg transition-colors border border-[var(--outline)]"
                  >
                    Open Project
                  </button>
                  {project.testingState === 'completed' && (
                    <button 
                      onClick={() => navigate(`/reports/${project.id}`)}
                      className="flex-1 bg-[var(--surface-hover)] hover:bg-[var(--outline)] text-[var(--ink)] text-xs font-semibold py-2 rounded-lg transition-colors border border-[var(--outline)]"
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
