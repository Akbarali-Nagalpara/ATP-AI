import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Download, RotateCw, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ReportsList = () => {
  const projects = useAppStore((state) => state.projects.filter(p => p.testingState === 'completed'));
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Reports</h1>
          <p className="text-gray-400 text-sm mt-1">Generated AI test reports across all projects</p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#111112] border border-[#222] border-dashed rounded-2xl">
          <FileText className="w-12 h-12 text-gray-600 mb-4" />
          <p className="text-gray-400 text-sm mb-4">No reports generated yet. Run a test to generate one.</p>
          <button
            onClick={() => navigate('/projects')}
            className="text-[#e32636] text-sm font-medium hover:underline"
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
