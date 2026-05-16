import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Download, CheckCircle, XCircle, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { motion } from 'framer-motion';

export const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = useAppStore((state) => state.projects.find((p) => p.id === id));

  if (!project || project.testingState !== 'completed') {
    return (
      <div className="p-8 text-center mt-20">
        <h2 className="text-xl font-bold text-white mb-2">Report not available</h2>
        <button onClick={() => navigate('/')} className="text-[#e32636] hover:underline">Return to Dashboard</button>
      </div>
    );
  }

  const total = project.endpoints.length;
  const passed = project.endpoints.filter(e => e.status === 'Pass').length;
  const failed = project.endpoints.filter(e => e.status === 'Fail').length;
  const passRate = Math.round((passed / total) * 100) || 0;
  
  const avgResponseTime = Math.round(
    project.endpoints.reduce((acc, ep) => acc + (ep.responseTime || 0), 0) / total
  ) || 0;

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/projects/${project.id}`)} className="p-2 hover:bg-[#222] rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-white tracking-tight">Final AI Report</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#e32636]/15 text-[#e32636] text-[10px] font-bold border border-[#e32636]/30 uppercase tracking-wider">
                Automated
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-1">{project.name} — {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        
        <button className="flex items-center gap-2 bg-[#222] hover:bg-[#333] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border border-[#444]">
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#111112] border border-[#222] p-5 rounded-2xl">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Success Rate</p>
          <div className="flex items-end gap-2">
            <h3 className={`text-3xl font-bold ${passRate > 80 ? 'text-emerald-400' : passRate > 50 ? 'text-amber-400' : 'text-rose-400'}`}>
              {passRate}%
            </h3>
          </div>
        </div>
        <div className="bg-[#111112] border border-[#222] p-5 rounded-2xl">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Tested APIs</p>
          <h3 className="text-3xl font-bold text-white">{total}</h3>
        </div>
        <div className="bg-[#111112] border border-[#222] p-5 rounded-2xl">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Avg Response</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-bold text-white">{avgResponseTime}</h3>
            <span className="text-gray-500 font-medium pb-1">ms</span>
          </div>
        </div>
        <div className="bg-[#111112] border border-[#222] p-5 rounded-2xl">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Failed APIs</p>
          <h3 className={`text-3xl font-bold ${failed > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{failed}</h3>
        </div>
      </div>

      {project.insights.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            AI Failure Analysis
          </h2>
          <div className="space-y-4">
            {project.insights.map((insight, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="bg-[#1a1512] border border-[#3a2618] rounded-2xl p-5"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl shrink-0">
                    <ShieldAlert className="w-6 h-6 text-rose-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-sm text-gray-300 bg-[#222] px-2 py-0.5 rounded">{insight.endpoint}</span>
                      <span className="text-rose-400 text-sm font-bold">{insight.issue}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                      <strong className="text-gray-200">AI Suggestion:</strong> {insight.suggestion}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-white mb-4">Detailed Results</h2>
        <div className="bg-[#111112] border border-[#222] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-[#151516] text-xs uppercase text-gray-500 font-semibold border-b border-[#222]">
                <tr>
                  <th className="px-6 py-4">Endpoint</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {project.endpoints.map((ep) => (
                  <tr key={ep.id} className="hover:bg-[#151516]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          ep.method === 'GET' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' :
                          ep.method === 'POST' ? 'text-blue-400 border-blue-400/30 bg-blue-400/10' :
                          ep.method === 'PUT' ? 'text-orange-400 border-orange-400/30 bg-orange-400/10' :
                          ep.method === 'DELETE' ? 'text-rose-400 border-rose-400/30 bg-rose-400/10' :
                          'text-purple-400 border-purple-400/30 bg-purple-400/10'
                        }`}>
                          {ep.method}
                        </span>
                        <span className="font-mono text-gray-300">{ep.path}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {ep.status === 'Pass' ? (
                        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                          <CheckCircle className="w-4 h-4" /> Pass
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                          <XCircle className="w-4 h-4" /> Fail
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-mono font-medium ${ep.statusCode === 200 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {ep.statusCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {ep.responseTime}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
