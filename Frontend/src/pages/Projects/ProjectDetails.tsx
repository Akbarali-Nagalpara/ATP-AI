import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, ArrowLeft, ShieldAlert, Terminal, CheckCircle2, XCircle, 
  FileText, Activity, Shield, Key, Eye, Search, Filter,
  BarChart3, LayoutGrid, Download, Zap, ChevronRight, Clock
} from 'lucide-react';
import { useAppStore, Endpoint } from '../../store/useAppStore';
import { aiService } from '../../services/aiService';
import { testRunnerService } from '../../services/testRunnerService';
import { motion, AnimatePresence } from 'framer-motion';
import { RolesTokensModal } from '../../components/Dashboard/RolesTokensModal';
import { ApiDetailsModal } from '../../components/Project/ApiDetailsModal';
import { OtpWorkflowModal } from '../../components/OTP/OtpWorkflowModal';
import { OtpDetectionStatus } from '../../components/OTP/OtpDetectionStatus';

const methodColors: Record<string, string> = {
  GET: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  POST: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  PUT: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  DELETE: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  PATCH: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
};

const statusColors: Record<string, string> = {
  Pending: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
  Queued: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Running: 'text-blue-400 bg-blue-400/10 border-blue-400/20 animate-pulse',
  Pass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Fail: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
};

type ViewMode = 'explorer' | 'console' | 'analysis' | 'reports';

export const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = useAppStore((state) => state.projects.find((p) => p.id === id));
  const { updateProjectState, updateEndpoint, updateToken, addLog } = useAppStore();
  const logsEndRef = useRef<HTMLDivElement>(null);

  const [activeView, setActiveView] = useState<ViewMode>('explorer');
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');

  useEffect(() => {
    if (activeView === 'console' && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [project?.logs, activeView]);

  const handleRunTests = async () => {
    if (!project) return;
    setActiveView('console');
    
    // 1. AI Detecting Roles
    updateProjectState(project.id, { testingState: 'detecting_roles', logs: [] });
    addLog(project.id, 'Importing Swagger...', 'info');
    setTimeout(() => addLog(project.id, 'APIs Imported Successfully', 'success'), 500);

    setTimeout(async () => {
      addLog(project.id, 'AI Detecting Roles...', 'info');
      const updatedEndpoints = await aiService.detectRoles(project.endpoints);
      updateProjectState(project.id, { endpoints: updatedEndpoints });
      addLog(project.id, 'Roles Detected and Assigned', 'success');

      // 2. OTP Detection
      addLog(project.id, 'AI Analyzing Authentication Flows...', 'info');
      const otpWorkflow = await aiService.detectOtpWorkflow(project.endpoints);
      if (otpWorkflow) {
        updateProjectState(project.id, { otpWorkflow });
        addLog(project.id, 'OTP Authentication Flow Detected!', 'warning');
        
        // Execute OTP Workflow
        addLog(project.id, 'Executing OTP Authentication Flow...', 'info');
        const token = await testRunnerService.simulateOtpWorkflow(
          otpWorkflow,
          (updates) => {
            const currentProject = useAppStore.getState().projects.find(p => p.id === project.id);
            if (currentProject?.otpWorkflow) {
              updateProjectState(project.id, { otpWorkflow: { ...currentProject.otpWorkflow, ...updates } });
            }
          },
          (message, type) => {
            const currentProject = useAppStore.getState().projects.find(p => p.id === project.id);
            if (currentProject?.otpWorkflow) {
              const newLog = {
                id: Math.random().toString(36).substring(7),
                timestamp: new Date().toLocaleTimeString(),
                message,
                type
              };
              updateProjectState(project.id, { 
                otpWorkflow: { 
                  ...currentProject.otpWorkflow, 
                  logs: [...currentProject.otpWorkflow.logs, newLog] 
                } 
              });
            }
            addLog(project.id, message, type === 'otp' ? 'warning' : type as any);
          }
        );
        // Assign token to Worker role (simulated)
        updateToken(project.id, 'Worker', { status: 'Authenticated', token });
      }

      // 3. Collecting Remaining Tokens
      const rolesToAuth = [...new Set(updatedEndpoints.map(e => e.role).filter(r => r !== 'Public' && r !== 'Worker'))];
      const initialTokens = rolesToAuth.map(role => ({ role, status: 'Pending' as const }));
      
      // Merge with existing Worker token if OTP was successful
      const existingTokens = useAppStore.getState().projects.find(p => p.id === project.id)?.tokens || [];
      const updatedTokens = [...existingTokens];
      rolesToAuth.forEach(role => {
        if (!updatedTokens.find(t => t.role === role)) {
          updatedTokens.push({ role, status: 'Pending' });
        }
      });
      
      updateProjectState(project.id, { testingState: 'collecting_tokens', tokens: updatedTokens });
      addLog(project.id, 'Collecting Remaining JWT Tokens...', 'info');
      
      const tokens = await testRunnerService.collectTokens();
      
      for (const role of rolesToAuth) {
        updateToken(project.id, role, { status: 'Authenticating' });
        await new Promise(r => setTimeout(r, 800));
        
        const token = tokens[role as keyof typeof tokens] || `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${role}`;
        updateToken(project.id, role, { status: 'Authenticated', token });
        addLog(project.id, `${role} Token Stored`, 'success');
      }

      // 4. Testing APIs
      updateProjectState(project.id, { testingState: 'testing' });
      addLog(project.id, 'Running APIs...', 'info');

      for (const ep of updatedEndpoints) {
        updateEndpoint(project.id, ep.id, { status: 'Running' });
        const result = await testRunnerService.runTest(ep);
        
        updateEndpoint(project.id, ep.id, { 
          status: result.passed ? 'Pass' : 'Fail',
          statusCode: result.statusCode,
          responseTime: result.responseTime
        });

        if (result.passed) {
          addLog(project.id, `PASS ${result.statusCode} | ${ep.method} ${ep.path}`, 'success');
        } else {
          addLog(project.id, `FAIL ${result.statusCode} | ${ep.method} ${ep.path}`, 'error');
        }
      }

      // 5. Analyzing Failures
      const finalEndpoints = useAppStore.getState().projects.find(p => p.id === project.id)?.endpoints || [];
      const failedEndpoints = finalEndpoints.filter(e => e.status === 'Fail');

      addLog(project.id, 'AI Generating Report...', 'info');
      if (failedEndpoints.length > 0) {
        updateProjectState(project.id, { testingState: 'analyzing' });
        const insights = await aiService.generateFailureInsights(failedEndpoints);
        updateProjectState(project.id, { insights });
        addLog(project.id, 'AI Analysis Complete', 'success');
      }

      updateProjectState(project.id, { testingState: 'completed' });
      addLog(project.id, 'Workflow Complete.', 'success');
    }, 1000);
  };

  if (!project) return null;

  const passedCount = project.endpoints.filter(e => e.status === 'Pass').length;
  const failedCount = project.endpoints.filter(e => e.status === 'Fail').length;
  const testedCount = passedCount + failedCount;
  const passRate = testedCount > 0 ? Math.round((passedCount / testedCount) * 100) : 0;
  
  const filteredEndpoints = project.endpoints.filter(ep => {
    const matchesSearch = ep.path.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = methodFilter === 'ALL' || ep.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const activeViewClass = 'bg-gradient-to-r from-[var(--surface-hover)] to-[var(--surface)] text-[var(--color-primary)] border-[var(--outline-strong)] shadow-sm';
  const disabledClass = 'opacity-40 cursor-not-allowed text-[var(--ink-muted)]';
  const inactiveClass = 'text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)]';

  return (
    <div className="flex h-[calc(100vh-60px)] w-full bg-[var(--canvas)] overflow-hidden transition-colors duration-300">
      {/* Secondary Project Sidebar */}
      <div className="w-64 border-r border-[var(--outline)] bg-[var(--surface)] flex flex-col shrink-0 shadow-2xl z-10">
        <div className="p-5 border-b border-[var(--outline)] flex items-center gap-3">
          <button onClick={() => navigate('/projects')} className="p-1.5 hover:bg-[var(--surface-hover)] rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4 text-[var(--ink-muted)] hover:text-[var(--ink)]" />
          </button>
          <h2 className="text-[var(--ink)] font-bold tracking-tight truncate">{project.name}</h2>
        </div>
        <div className="p-3 space-y-1 relative">
          <p className="px-4 py-2 text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Workspace</p>
          <button onClick={() => setActiveView('explorer')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm border border-transparent ${activeView === 'explorer' ? activeViewClass : inactiveClass}`}>
            <LayoutGrid className={`w-4 h-4 ${activeView === 'explorer' ? 'text-[var(--color-primary)]' : ''}`} /> API Explorer
            {activeView === 'explorer' && <motion.div layoutId="activeIndicator" className="absolute left-0 w-1 h-8 bg-[var(--color-primary)] rounded-r-md shadow-[0_0_10px_var(--color-primary)]" />}
          </button>
          
          <button onClick={() => setActiveView('console')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm border border-transparent ${activeView === 'console' ? activeViewClass : inactiveClass}`}>
            <Terminal className={`w-4 h-4 ${activeView === 'console' ? 'text-[var(--color-primary)]' : ''}`} /> Testing Console
            {activeView === 'console' && <motion.div layoutId="activeIndicator" className="absolute left-0 w-1 h-8 bg-[var(--color-primary)] rounded-r-md shadow-[0_0_10px_var(--color-primary)]" />}
          </button>
          
          <button onClick={() => !(project.testingState !== 'completed' && project.insights.length === 0) && setActiveView('analysis')} disabled={project.testingState !== 'completed' && project.insights.length === 0} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm border border-transparent ${activeView === 'analysis' ? activeViewClass : (project.testingState !== 'completed' && project.insights.length === 0 ? disabledClass : inactiveClass)}`}>
            <Activity className={`w-4 h-4 ${activeView === 'analysis' ? 'text-[var(--color-primary)]' : ''}`} /> AI Analysis
            {activeView === 'analysis' && <motion.div layoutId="activeIndicator" className="absolute left-0 w-1 h-8 bg-[var(--color-primary)] rounded-r-md shadow-[0_0_10px_var(--color-primary)]" />}
          </button>
          
          <button onClick={() => project.testingState === 'completed' && setActiveView('reports')} disabled={project.testingState !== 'completed'} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm border border-transparent ${activeView === 'reports' ? activeViewClass : (project.testingState !== 'completed' ? disabledClass : inactiveClass)}`}>
            <BarChart3 className={`w-4 h-4 ${activeView === 'reports' ? 'text-[var(--color-primary)]' : ''}`} /> Report Dashboard
            {activeView === 'reports' && <motion.div layoutId="activeIndicator" className="absolute left-0 w-1 h-8 bg-[var(--color-primary)] rounded-r-md shadow-[0_0_10px_var(--color-primary)]" />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-[var(--canvas)]">
        {/* Top Header Workspace */}
        <div className="h-24 border-b border-[var(--outline)] bg-[var(--surface)] px-8 py-4 flex flex-col justify-between shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[var(--surface-hover)] border border-[var(--outline)] rounded-lg px-3 py-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-[var(--ink-muted)] font-mono">Production</span>
              </div>
              <span className="text-[var(--ink-muted)] text-sm font-mono truncate max-w-md" title={project.swaggerUrl}>{project.swaggerUrl}</span>
            </div>
            <div className="flex items-center gap-3">
              {project.otpWorkflow && (
                <OtpDetectionStatus 
                  workflow={project.otpWorkflow} 
                  onViewDetails={() => setIsOtpModalOpen(true)} 
                />
              )}
              <button
                onClick={() => setIsRolesModalOpen(true)}
                className="flex items-center gap-2 bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--ink-muted)] hover:text-[var(--ink)] px-4 py-2 rounded-xl text-sm font-medium transition-all border border-[var(--outline)] shadow-sm"
              >
                <Key className="w-4 h-4 text-amber-400" />
                Roles & Tokens
              </button>
              <button
                onClick={handleRunTests}
                disabled={project.testingState !== 'idle' && project.testingState !== 'completed'}
                className="flex items-center gap-2 bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-50 disabled:grayscale text-white px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-md"
              >
                <Play className="w-4 h-4 fill-current" />
                Run Full Test
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-8 mt-auto">
            <div className="flex flex-col">
              <span className="text-[10px] text-[var(--ink-muted)] font-bold uppercase tracking-wider">APIs Tested</span>
              <span className="text-sm font-bold text-[var(--ink)]">{testedCount} / {project.endpoints.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Passed</span>
              <span className="text-sm font-bold text-emerald-400">{passedCount}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Failed</span>
              <span className="text-sm font-bold text-rose-400">{failedCount}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Success Rate</span>
              <span className={`text-sm font-bold ${passRate > 80 ? 'text-emerald-400' : passRate > 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                {testedCount > 0 ? `${passRate}%` : '--'}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-auto custom-scrollbar p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              {activeView === 'explorer' && (
                <div className="flex flex-col h-full bg-[var(--surface)] border border-[var(--outline)] rounded-2xl overflow-hidden shadow-2xl transition-colors duration-300">
                  {/* Toolbar */}
                  <div className="p-4 border-b border-[var(--outline)] flex items-center justify-between bg-[var(--surface-hover)]">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="w-4 h-4 text-[var(--ink-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text" 
                          placeholder="Search endpoints..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-[var(--surface)] border border-[var(--outline)] rounded-lg pl-9 pr-4 py-1.5 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--outline-strong)] transition-colors w-64"
                        />
                      </div>
                      <select 
                        value={methodFilter}
                        onChange={(e) => setMethodFilter(e.target.value)}
                        className="bg-[var(--surface)] border border-[var(--outline)] rounded-lg px-3 py-1.5 text-sm text-[var(--ink-muted)] focus:outline-none focus:border-[var(--outline-strong)] transition-colors appearance-none cursor-pointer"
                      >
                        <option value="ALL">All Methods</option>
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Table */}
                  <div className="flex-1 overflow-auto custom-scrollbar">
                    <table className="w-full text-left text-sm text-[var(--ink-muted)]">
                      <thead className="bg-[var(--surface)] text-[11px] uppercase text-[var(--ink-muted)] font-bold border-b border-[var(--outline)] sticky top-0 z-10 backdrop-blur-sm">
                        <tr>
                          <th className="px-6 py-4 whitespace-nowrap">Method</th>
                          <th className="px-6 py-4">Endpoint</th>
                          <th className="px-6 py-4 whitespace-nowrap">Role</th>
                          <th className="px-6 py-4 whitespace-nowrap">Auth</th>
                          <th className="px-6 py-4 whitespace-nowrap">Status</th>
                          <th className="px-6 py-4 whitespace-nowrap">Time</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--outline)]">
                        {filteredEndpoints.map((ep) => (
                          <tr key={ep.id} className="hover:bg-[var(--surface-hover)] transition-colors group">
                            <td className="px-6 py-3 whitespace-nowrap">
                              <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${methodColors[ep.method]}`}>
                                {ep.method}
                              </span>
                            </td>
                            <td className="px-6 py-3 font-mono text-[13px] text-[var(--ink)] truncate max-w-[200px] lg:max-w-[400px]">
                              {ep.path}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap">
                              <span className="text-[var(--ink)] font-medium bg-[var(--surface-hover)] px-2 py-1 rounded-md text-xs border border-[var(--outline)] shadow-sm">{ep.role}</span>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap">
                              {ep.authRequired ? (
                                <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                                  <Shield className="w-3.5 h-3.5" /> Yes
                                </span>
                              ) : (
                                <span className="text-gray-500 text-xs">No</span>
                              )}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap">
                              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusColors[ep.status]}`}>
                                {ep.status}
                              </span>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-500 font-mono">
                              {ep.responseTime ? `${ep.responseTime}ms` : '--'}
                            </td>
                            <td className="px-6 py-3 text-right whitespace-nowrap">
                              <button 
                                onClick={() => setSelectedEndpoint(ep)}
                                className="inline-flex items-center gap-1.5 bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--ink-muted)] hover:text-[var(--ink)] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-[var(--outline)] opacity-0 group-hover:opacity-100 shadow-sm"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                Inspect
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredEndpoints.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <Search className="w-10 h-10 mb-3 opacity-20" />
                        <p>No endpoints found matching your criteria.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeView === 'console' && (
                <div className="h-full bg-[var(--canvas)] border border-[var(--outline)] rounded-2xl overflow-hidden flex flex-col shadow-2xl relative font-mono">
                  <div className="px-4 py-3 border-b border-[var(--outline)] bg-[var(--surface-hover)] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <Terminal className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium text-[var(--ink)]">execution_log.sh</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                  </div>
                  <div className="p-5 flex-1 overflow-y-auto text-[13px] leading-loose custom-scrollbar bg-[var(--canvas)]">
                    {project.logs.length === 0 ? (
                      <div className="text-gray-600 h-full flex flex-col items-center justify-center gap-3">
                        <Zap className="w-8 h-8 text-gray-700" />
                        <p>Awaiting execution... Click 'Run Full Test' to begin workflow.</p>
                      </div>
                    ) : (
                      project.logs.map((log) => {
                        let color = 'text-gray-400';
                        if (log.type === 'success') color = 'text-emerald-400';
                        if (log.type === 'error') color = 'text-rose-400 font-bold';
                        if (log.type === 'warning') color = 'text-amber-400';
                        
                        return (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={log.id} 
                            className="flex gap-4 hover:bg-[var(--surface-hover)] px-2 rounded group transition-colors"
                          >
                            <span className="text-gray-600 shrink-0 select-none">[{log.timestamp.split(' ')[0]}]</span>
                            <span className="text-blue-500/50 select-none opacity-0 group-hover:opacity-100 transition-opacity">❯</span>
                            <span className={`${color} break-all`}>{log.message}</span>
                          </motion.div>
                        );
                      })
                    )}
                    <div ref={logsEndRef} className="h-4" />
                  </div>
                </div>
              )}

              {activeView === 'analysis' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">AI Insights & Remediation</h2>
                      <p className="text-sm text-gray-400">Automated failure analysis and suggested fixes</p>
                    </div>
                  </div>

                  {project.insights.length === 0 ? (
                    <div className="bg-[var(--surface)] border border-[var(--outline)] rounded-2xl p-16 text-center shadow-xl">
                      <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">System Healthy</h3>
                      <p className="text-gray-400 max-w-sm mx-auto">No failures or vulnerabilities detected during the test execution. Your APIs are solid.</p>
                    </div>
                  ) : (
                    <div className="grid gap-5">
                      {project.insights.map((insight, i) => (
                        <div key={i} className="bg-[var(--surface)] border border-[var(--outline)] hover:border-[var(--outline-strong)] rounded-2xl overflow-hidden shadow-xl transition-all">
                          <div className="px-6 py-4 border-b border-[var(--outline)] bg-[var(--surface-hover)] flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 shrink-0">
                              <ShieldAlert className="w-4 h-4 text-rose-400" />
                            </span>
                            <span className="font-mono text-sm font-bold text-[var(--ink)] truncate">{insight.endpoint}</span>
                            <span className="ml-auto text-xs font-bold bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded-md border border-rose-500/20">High Priority</span>
                          </div>
                          <div className="p-6 flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-2">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Detected Issue</p>
                              <p className="text-rose-400 font-medium text-lg">{insight.issue}</p>
                            </div>
                            <div className="w-px bg-[var(--outline)] hidden md:block" />
                            <div className="flex-1 space-y-2">
                              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5" /> AI Suggestion
                              </p>
                              <div className="bg-[var(--surface-hover)] border border-[var(--outline)] p-4 rounded-xl">
                                <p className="text-[var(--ink-muted)] text-sm leading-relaxed">{insight.suggestion}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeView === 'reports' && (
                <div className="h-full flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-[var(--ink)] tracking-tight">Execution Summary</h2>
                      <p className="text-sm text-[var(--ink-muted)]">High-level metrics for this test run</p>
                    </div>
                    <button className="flex items-center gap-2 bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--ink)] px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-[var(--outline)] shadow-sm">
                      <Download className="w-4 h-4" /> Export PDF
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                      { label: 'Total APIs', value: project.endpoints.length, color: 'text-blue-500' },
                      { label: 'Passed Tests', value: passedCount, color: 'text-emerald-500' },
                      { label: 'Failed Tests', value: failedCount, color: 'text-rose-500' },
                      { label: 'Avg Response', value: '142ms', color: 'text-amber-500' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-[var(--surface)] border border-[var(--outline)] p-5 rounded-2xl shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform" />
                        <p className="text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider mb-2">{stat.label}</p>
                        <p className={`text-3xl font-bold ${stat.color} tracking-tight`}>{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex-1 bg-[var(--surface)] border border-[var(--outline)] rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center">
                    <BarChart3 className="w-16 h-16 text-[var(--outline-strong)] mb-4" />
                    <h3 className="text-lg font-bold text-[var(--ink)] mb-1">Visualization Module</h3>
                    <p className="text-[var(--ink-muted)] text-sm max-w-sm text-center">Interactive charts and graphs representing endpoint reliability and response time trends will appear here.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <RolesTokensModal isOpen={isRolesModalOpen} onClose={() => setIsRolesModalOpen(false)} projectId={project.id} />
      <ApiDetailsModal isOpen={selectedEndpoint !== null} onClose={() => setSelectedEndpoint(null)} endpoint={selectedEndpoint} />
      <OtpWorkflowModal isOpen={isOtpModalOpen} onClose={() => setIsOtpModalOpen(false)} workflow={project.otpWorkflow || null} />
    </div>
  );
};
