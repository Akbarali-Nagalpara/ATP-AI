import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Download, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ReportsList = () => {
  const allProjects = useAppStore((state) => state.projects);
  const projects = allProjects.filter(p => p.testingState === 'completed');
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">


      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center max-w-lg mx-auto mt-12 transition-all">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-[var(--surface-hover)] border border-[var(--outline)] rounded-2xl flex items-center justify-center shadow-lg relative z-10 text-[var(--ink-muted)]">
              <FileText className="w-8 h-8 opacity-80" />
            </div>
            <div className="absolute inset-0 bg-[var(--color-primary)]/20 blur-xl rounded-full -z-10 animate-pulse" style={{ animationDuration: '3s' }} />
          </div>

          <h3 className="text-[var(--ink)] text-base font-bold tracking-tight">No reports generated yet</h3>
          <p className="text-[var(--ink-muted)] text-xs mt-1.5 leading-relaxed max-w-sm mb-6">
            Create a project and run tests to see reports here.
          </p>
          
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-2 bg-[var(--color-primary)] hover:opacity-90 active:scale-95 text-[#080810] px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
          >
            Go to Projects
          </button>
        </div>
      ) : (
        <div className="flex flex-col bg-[var(--surface)] border border-[var(--outline)] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
          <div className="flex-1 overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm text-[var(--ink-muted)] border-collapse table-fixed min-w-[900px]">
              <thead className="bg-[var(--surface-hover)]/50 text-[11px] font-bold text-[var(--ink-muted)] uppercase tracking-widest border-b border-[var(--outline)] sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 w-[250px]">Report Name</th>
                  <th className="px-6 py-4 w-[120px]">Date</th>
                  <th className="px-6 py-4 w-[120px]">Total APIs</th>
                  <th className="px-6 py-4 w-[120px]">Passed</th>
                  <th className="px-6 py-4 w-[120px]">Failed</th>
                  <th className="px-6 py-4 w-[150px]">Success Rate</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--outline)]">
                {projects.map((project) => {
                  const passed = project.endpoints.filter(e => e.status === 'Pass').length;
                  const failed = project.endpoints.filter(e => e.status === 'Fail').length;
                  const passRate = project.endpoints.length > 0 ? Math.round((passed / project.endpoints.length) * 100) : 0;
                  
                  return (
                    <tr key={project.id} className="hover:bg-[var(--surface-hover)] transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${passRate > 80 ? 'bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20' : 'bg-[var(--color-danger)]/10 text-[var(--color-danger)] border border-[var(--color-danger)]/20'}`}>
                            {passRate > 80 ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                          </div>
                          <span className="text-[13px] font-bold text-[var(--ink)] truncate">
                            {project.name} Report
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-[var(--ink-muted)] font-medium">
                        Today
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[13px] text-[var(--ink)] font-bold">
                        {project.endpoints.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[13px] font-bold text-[var(--color-success)]">
                        {passed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[13px] font-bold text-[var(--color-danger)]">
                        {failed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`text-[13px] font-bold ${passRate > 80 ? 'text-[var(--color-success)]' : passRate > 50 ? 'text-[var(--color-warning)]' : 'text-[var(--color-danger)]'}`}>
                            {passRate}%
                          </span>
                          <div className="w-16 h-1.5 bg-[var(--surface-hover)] rounded-full overflow-hidden border border-[var(--outline)]">
                            <div 
                              className={`h-full ${passRate > 80 ? 'bg-[var(--color-success)]' : passRate > 50 ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-danger)]'}`}
                              style={{ width: `${passRate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => {}}
                            className="p-2 text-[var(--ink-muted)] hover:text-[var(--ink)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--outline)] rounded-lg transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => navigate(`/reports/${project.id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[var(--color-primary)] hover:opacity-90 active:scale-95 text-[#080810] rounded-lg text-xs font-bold transition-all shadow-md"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
