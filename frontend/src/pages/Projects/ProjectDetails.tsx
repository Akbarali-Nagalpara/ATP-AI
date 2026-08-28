import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, ArrowLeft, ShieldAlert, Terminal, CheckCircle2, 
  Activity, Shield, Key, Eye, Search, 
  BarChart3, LayoutGrid, Zap, Copy, Check, ShieldCheck
} from 'lucide-react';
import { useAppStore, Endpoint } from '../../store/useAppStore';
import { aiService } from '../../services/aiService';
import { testRunnerService } from '../../services/testRunnerService';
import { motion, AnimatePresence } from 'framer-motion';
import { RolesTokensModal } from '../../components/Dashboard/RolesTokensModal';
import {
  SummaryCards,
  FailureTable,
  EndpointDetailsDrawer,
  ReportCharts,
  DownloadButtons,
  ExecutionTimeline
} from '../../components/report';
import { OtpWorkflowModal } from '../../components/OTP/OtpWorkflowModal';
import { OtpDetectionStatus } from '../../components/OTP/OtpDetectionStatus';

const methodColors: Record<string, string> = {
  GET: 'badge-method-get',
  POST: 'badge-method-post',
  PUT: 'badge-method-put',
  DELETE: 'badge-method-delete',
  PATCH: 'badge-method-patch',
};

const statusColors: Record<string, string> = {
  Pending: 'text-[var(--ink-muted)] bg-[var(--surface-hover)] border-[var(--outline)]',
  Queued: 'text-[var(--color-warning)] bg-[var(--color-warning)]/10 border-[var(--color-warning)]/20',
  Running: 'text-[var(--color-info)] bg-[var(--color-info)]/10 border-[var(--color-info)]/20 animate-pulse',
  Pass: 'text-[var(--color-success)] bg-[var(--color-success)]/10 border-[var(--color-success)]/20',
  Fail: 'text-[var(--color-danger)] bg-[var(--color-danger)]/10 border-[var(--color-danger)]/20',
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
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [copiedPrompts, setCopiedPrompts] = useState<Record<number, boolean>>({});

  const handleCopyPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompts(prev => ({ ...prev, [index]: true }));
    setTimeout(() => {
      setCopiedPrompts(prev => ({ ...prev, [index]: false }));
    }, 2000);
  };

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

      // 3. Sorting APIs (Authentication Endpoints First)
      updateProjectState(project.id, { testingState: 'testing' });
      addLog(project.id, 'Sorting endpoints (Auth first)...', 'info');
      
      const sortedEndpoints = [...updatedEndpoints].sort((a, b) => {
        const aPath = a.path.toLowerCase();
        const bPath = b.path.toLowerCase();
        const aIsAuth = aPath.includes('login') || aPath.includes('auth') || aPath.includes('register');
        const bIsAuth = bPath.includes('login') || bPath.includes('auth') || bPath.includes('register');
        if (aIsAuth && !bIsAuth) return -1;
        if (!aIsAuth && bIsAuth) return 1;
        return 0;
      });

      addLog(project.id, 'Running APIs in dependency order...', 'info');

      for (const ep of sortedEndpoints) {
        updateEndpoint(project.id, ep.id, { status: 'Running' });
        
        // Retrieve current token for this role from the store
        const currentProjectState = useAppStore.getState().projects.find(p => p.id === project.id);
        const roleToken = currentProjectState?.tokens.find(t => t.role === ep.role)?.token;
        
        const result = await testRunnerService.runTest(ep, roleToken);
        
        updateEndpoint(project.id, ep.id, { 
          status: result.passed ? 'Pass' : 'Fail',
          statusCode: result.statusCode,
          responseTime: result.responseTime
        });

        if (result.passed) {
          addLog(project.id, `PASS ${result.statusCode} | ${ep.method} ${ep.path}`, 'success');
          
          if (result.extractedToken) {
            // Save the newly extracted token to the store
            const existingTokens = currentProjectState?.tokens || [];
            if (!existingTokens.find(t => t.role === ep.role)) {
               updateProjectState(project.id, { tokens: [...existingTokens, { role: ep.role, status: 'Authenticated', token: result.extractedToken }] });
            } else {
               updateToken(project.id, ep.role, { status: 'Authenticated', token: result.extractedToken });
            }
            addLog(project.id, `Extracted & Saved Token for role: ${ep.role}`, 'warning');
          }
        } else {
          addLog(project.id, `FAIL ${result.statusCode} | ${ep.method} ${ep.path}${!roleToken && ep.authRequired ? ' (Missing Token)' : ''}`, 'error');
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
  
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredEndpoints = project.endpoints.filter(ep => {
    const matchesSearch = ep.path.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = methodFilter === 'ALL' || ep.method === methodFilter;
    const matchesStatus = statusFilter === 'ALL' || ep.status === statusFilter;
    return matchesSearch && matchesMethod && matchesStatus;
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
              <span className="text-[10px] text-[var(--ink-muted)] font-bold uppercase tracking-wider">Passed</span>
              <span className="text-sm font-bold text-[var(--color-success)]">{passedCount}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[var(--ink-muted)] font-bold uppercase tracking-wider">Failed</span>
              <span className="text-sm font-bold text-[var(--color-danger)]">{failedCount}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[var(--ink-muted)] font-bold uppercase tracking-wider">Success Rate</span>
              <span className={`text-sm font-bold ${passRate > 80 ? 'text-[var(--color-success)]' : passRate > 50 ? 'text-[var(--color-warning)]' : 'text-[var(--color-danger)]'}`}>
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
                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-[var(--surface)] border border-[var(--outline)] rounded-lg px-3 py-1.5 text-sm text-[var(--ink-muted)] focus:outline-none focus:border-[var(--outline-strong)] transition-colors appearance-none cursor-pointer"
                      >
                        <option value="ALL">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Pass">Pass</option>
                        <option value="Fail">Fail</option>
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
                              <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${methodColors[ep.method]}`}>
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
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-[var(--ink-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text" 
                          placeholder="Search logs..." 
                          value={logSearchQuery}
                          onChange={(e) => setLogSearchQuery(e.target.value)}
                          className="bg-[var(--canvas)] border border-[var(--outline)] rounded pl-8 pr-2 py-1 text-[11px] text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--outline-strong)] transition-colors w-40 font-sans"
                        />
                      </div>
                      <div className="flex gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                        <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5 flex-1 overflow-y-auto text-[13px] leading-loose custom-scrollbar bg-[var(--canvas)]">
                    {project.logs.length === 0 ? (
                      <div className="text-[var(--ink-muted)] h-full flex flex-col items-center justify-center gap-3 font-sans">
                        <Zap className="w-8 h-8 text-[var(--ink-muted)] opacity-50" />
                        <p>Awaiting execution... Click 'Run Full Test' to begin workflow.</p>
                      </div>
                    ) : (
                      project.logs
                        .filter(log => log.message.toLowerCase().includes(logSearchQuery.toLowerCase()))
                        .map((log) => {
                        let color = 'text-[var(--ink-muted)]';
                        if (log.type === 'success') color = 'text-[var(--color-success)]';
                        if (log.type === 'error') color = 'text-[var(--color-danger)] font-bold';
                        if (log.type === 'warning') color = 'text-[var(--color-warning)]';
                        
                        return (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={log.id} 
                            className="flex gap-4 hover:bg-[var(--surface-hover)] px-2 rounded group transition-colors"
                          >
                            <span className="text-[var(--ink-faint)] shrink-0 select-none">[{log.timestamp.split(' ')[0]}]</span>
                            <span className="text-[var(--color-primary)]/50 select-none opacity-0 group-hover:opacity-100 transition-opacity">❯</span>
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
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary-dark)] flex items-center justify-center shadow-lg">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[var(--ink)] tracking-tight">AI Insights & Remediation</h2>
                      <p className="text-sm text-[var(--ink-muted)]">Automated failure analysis and suggested fixes</p>
                    </div>
                  </div>

                  {project.insights.length === 0 ? (
                    <div className="bg-[var(--surface)] border border-[var(--outline)] rounded-2xl p-16 text-center shadow-xl">
                      <div className="w-20 h-20 bg-[var(--color-success)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-[var(--color-success)]" />
                      </div>
                      <h3 className="text-2xl font-bold text-[var(--ink)] mb-2 tracking-tight">System Healthy</h3>
                      <p className="text-[var(--ink-muted)] max-w-sm mx-auto">No failures or vulnerabilities detected during the test execution. Your APIs are solid.</p>
                    </div>
                  ) : (
                    <div className="grid gap-5">
                      {project.insights.map((insight, i) => (
                        <div key={i} className="bg-[var(--surface)] border border-[var(--outline)] rounded-2xl overflow-hidden shadow-xl transition-all">
                          {/* Header */}
                          <div className="px-6 py-4 border-b border-[var(--outline)] bg-[var(--surface-hover)] flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 shrink-0">
                              <ShieldAlert className="w-4 h-4 text-[var(--color-danger)]" />
                            </span>
                            <span className="font-mono text-sm font-bold text-[var(--ink)] truncate">{insight.endpoint}</span>
                            <span className="ml-auto text-xs font-bold bg-[var(--color-danger)]/10 text-[var(--color-danger)] px-2.5 py-1 rounded-md border border-[var(--color-danger)]/20">High Priority</span>
                          </div>
                          
                          <div className="p-6 space-y-6">
                            {/* Root Cause & Suggestion row */}
                            <div className="flex flex-col md:flex-row gap-6">
                              <div className="flex-1 space-y-2">
                                <p className="text-xs font-bold text-[var(--ink-muted)] uppercase tracking-widest">Detected Root Cause</p>
                                <p className="text-[var(--color-danger)] font-medium text-sm leading-relaxed">{insight.rootCause}</p>
                              </div>
                              <div className="w-px bg-[var(--outline)] hidden md:block" />
                              <div className="flex-1 space-y-2">
                                <p className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-widest flex items-center gap-1.5">
                                  <Zap className="w-3.5 h-3.5" /> AI Suggestion
                                </p>
                                <p className="text-[var(--ink)] text-sm leading-relaxed font-medium">{insight.suggestion}</p>
                              </div>
                            </div>
                            
                            {/* Security Findings */}
                            {insight.securityFindings && insight.securityFindings.length > 0 && (
                              <div className="space-y-2 border-t border-[var(--outline)] pt-6">
                                <p className="text-xs font-bold text-[var(--ink-muted)] uppercase tracking-widest flex items-center gap-1.5">
                                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-warning)]" /> Security Findings
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {insight.securityFindings.map((finding, idx) => (
                                    <span key={idx} className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 text-[var(--color-warning)] px-3 py-1.5 rounded-lg text-xs font-semibold">
                                      {finding}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Fix Prompt */}
                            <div className="space-y-2 border-t border-[var(--outline)] pt-6">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-[var(--ink-muted)] uppercase tracking-widest flex items-center gap-1.5">
                                  <Terminal className="w-3.5 h-3.5 text-[var(--color-success)]" /> Developer Fix Prompt
                                </p>
                                <button
                                  onClick={() => handleCopyPrompt(insight.fixPrompt, i)}
                                  className="text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] flex items-center gap-1.5 transition-colors bg-[var(--surface-hover)] px-2.5 py-1 rounded border border-[var(--outline)]"
                                >
                                  {copiedPrompts[i] ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
                                      Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      Copy Prompt
                                    </>
                                  )}
                                </button>
                              </div>
                              <div className="bg-[var(--canvas)] border border-[var(--outline)] p-4 rounded-xl overflow-x-auto custom-scrollbar">
                                <pre className="text-xs font-mono text-[var(--ink-muted)] leading-relaxed whitespace-pre-wrap">
                                  {insight.fixPrompt}
                                </pre>
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
                <div className="space-y-8 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-[var(--ink)] tracking-tight">Execution Summary</h2>
                      <p className="text-xs text-[var(--ink-muted)] mt-0.5">High-level telemetry metrics and interactive report visualization</p>
                    </div>
                    <DownloadButtons project={project} />
                  </div>

                  <SummaryCards
                    total={project.endpoints.length}
                    passed={passedCount}
                    failed={failedCount}
                    avgResponseTime={142}
                  />

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2">
                      <ReportCharts endpoints={project.endpoints} />
                    </div>
                    <div className="xl:col-span-1">
                      <ExecutionTimeline project={project} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-bold text-[var(--ink)] tracking-tight">API Spec Telemetry</h2>
                      <p className="text-xs text-[var(--ink-muted)] mt-0.5">Review functional status, latency profiles, and diagnostics across tested schemas</p>
                    </div>
                    <FailureTable
                      endpoints={project.endpoints}
                      onInspect={(endpoint) => setSelectedEndpoint(endpoint)}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <RolesTokensModal isOpen={isRolesModalOpen} onClose={() => setIsRolesModalOpen(false)} projectId={project.id} />
      <EndpointDetailsDrawer isOpen={selectedEndpoint !== null} onClose={() => setSelectedEndpoint(null)} endpoint={selectedEndpoint} />
      <OtpWorkflowModal isOpen={isOtpModalOpen} onClose={() => setIsOtpModalOpen(false)} workflow={project.otpWorkflow || null} />
    </div>
  );
};
