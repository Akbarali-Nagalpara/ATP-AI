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

          <h3 className="text-[var(--ink)] text-base font-bold tracking-tight">No reports generated yet</h3>
          <p className="text-[var(--ink-muted)] text-xs mt-1.5 leading-relaxed max-w-sm mb-6">
            Create a project and run tests to see reports here.
          </p>
          
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-2 bg-[var(--color-primary)] hover:opacity-90 active:scale-95 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
          >
            Go to Projects
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
                className="bg-[#111112] border border-[#222] hover:border-[#444] rounded-2xl p-5 transition-all hover:-translate-y-1 shadow-lg flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{project.name} Report</h3>
                    <p className="text-gray-500 text-xs mt-1">Generated today</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${passRate > 80 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {passRate > 80 ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">APIs Tested</span>
                    <span className="text-white font-medium">{project.endpoints.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Passed APIs</span>
                    <span className="text-emerald-400 font-medium">{passed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Failed APIs</span>
                    <span className="text-rose-400 font-medium">{failed}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-3 border-t border-[#222]">
                    <span className="text-gray-400 font-medium">Success Rate</span>
                    <span className={`font-bold ${passRate > 80 ? 'text-emerald-400' : passRate > 50 ? 'text-amber-400' : 'text-rose-400'}`}>{passRate}%</span>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => navigate(`/reports/${project.id}`)}
                    className="flex items-center justify-center gap-1.5 bg-[#e32636] hover:bg-[#f24251] text-white text-xs font-semibold py-2.5 rounded-lg transition-colors shadow-lg"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Report
                  </button>
                  <button 
                    onClick={() => {}}
                    className="flex items-center justify-center gap-1.5 bg-[#1a1a1c] hover:bg-[#222] text-white text-xs font-semibold py-2.5 rounded-lg transition-colors border border-[#333]"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
