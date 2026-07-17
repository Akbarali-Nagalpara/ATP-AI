import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAppStore, Endpoint } from '../../store/useAppStore';
import {
  SummaryCards,
  FailureTable,
  EndpointDetailsDrawer,
  ReportCharts,
  DownloadButtons
} from '../../components/report';

export const ReportDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Zustand state fallback
  const storeProject = useAppStore((state) => state.projects.find((p) => p.id === id));
  
  // Selected endpoint for lateral drawer inspection
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);

  // TanStack Query for server state (attempts to fetch, falls back gracefully to local store)
  const { data: project, isLoading, error, refetch } = useQuery({
    queryKey: ['project-report', id],
    queryFn: async () => {
      // If we have local store state, we can use it directly or simulate API fetch delay
      if (storeProject) {
        await new Promise(resolve => setTimeout(resolve, 800)); // smooth experience
        return storeProject;
      }
      throw new Error('Report data not found in local workspace store.');
    },
    initialData: storeProject,
    staleTime: 1000 * 60 * 5, // 5 minutes caching
  });

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full space-y-8 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-10 w-48 bg-white/10 rounded-lg" />
          <div className="h-10 w-32 bg-white/10 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 bg-white/5 border border-white/5 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-white/5 border border-white/5 rounded-2xl" />
        <div className="h-96 bg-white/5 border border-white/5 rounded-2xl" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-8 max-w-md mx-auto mt-20 text-center space-y-4 bg-[#0d0d0f]/60 border border-white/5 p-8 rounded-2xl shadow-xl">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white tracking-tight">Report Unavailable</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          {error instanceof Error ? error.message : 'The requested test execution report could not be resolved.'}
        </p>
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => refetch()}
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold py-2.5 rounded-xl border border-white/5 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Re-fetching
          </button>
          <button 
            onClick={() => navigate('/projects')} 
            className="text-[var(--color-primary)] hover:underline text-xs font-bold"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Derived metrics
  const total = project.endpoints.length;
  const passed = project.endpoints.filter(e => e.status === 'Pass').length;
  const failed = project.endpoints.filter(e => e.status === 'Fail').length;
  const avgResponseTime = Math.round(
    project.endpoints.reduce((acc, ep) => acc + (ep.responseTime || 0), 0) / (total || 1)
  ) || 0;

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8 select-none">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/projects/${project.id}`)} 
            className="p-2.5 bg-[#121214] hover:bg-white/5 rounded-xl border border-white/5 transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Final AI Audit Report</h1>
              <span className="px-2.5 py-0.5 rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-extrabold border border-[var(--color-primary)]/20 uppercase tracking-widest">
                Automated
              </span>
            </div>
            <p className="text-gray-400 text-xs mt-1.5 font-medium">
              {project.name} — Tested on {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        
        {/* Action Downloads */}
        <DownloadButtons project={project} />
      </div>

      {/* Summary Cards Row */}
      <SummaryCards
        total={total}
        passed={passed}
        failed={failed}
        avgResponseTime={avgResponseTime}
      />

      {/* Recharts Analytics Panel */}
      <ReportCharts endpoints={project.endpoints} />

      {/* Detailed Failure & Results Table */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">API Spec Telemetry</h2>
          <p className="text-xs text-gray-500 mt-1">Review functional status, latency profiles, and diagnostics across tested schemas</p>
        </div>
        
        <FailureTable
          endpoints={project.endpoints}
          onInspect={(endpoint) => setSelectedEndpoint(endpoint)}
        />
      </div>

      {/* Lateral Drawer for Detailed Endpoint Inspection */}
      <EndpointDetailsDrawer
        endpoint={selectedEndpoint}
        isOpen={selectedEndpoint !== null}
        onClose={() => setSelectedEndpoint(null)}
      />
    </div>
  );
};
