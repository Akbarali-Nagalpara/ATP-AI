import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle2, XCircle, RefreshCw, Clock, BarChart3, ChevronDown, Plus, StopCircle } from 'lucide-react';

const runs = [
  { id: 'TR-8934', project: 'Core API',            status: 'running',   started: 'Just now',   duration: '45s',   total: 145, done: 89,  passed: 84,  failed: 5,  role: 'Admin' },
  { id: 'TR-8933', project: 'Billing Service',     status: 'completed', started: '5m ago',     duration: '2m 14s', total: 62,  done: 62,  passed: 61,  failed: 1,  role: 'Company' },
  { id: 'TR-8932', project: 'Auth Gateway',        status: 'failed',    started: '12m ago',    duration: '1m 05s', total: 28,  done: 28,  passed: 22,  failed: 6,  role: 'Admin' },
  { id: 'TR-8931', project: 'Core API',            status: 'completed', started: '28m ago',    duration: '3m 42s', total: 145, done: 145, passed: 139, failed: 6,  role: 'Client' },
  { id: 'TR-8930', project: 'Notification Service',status: 'completed', started: '1h ago',     duration: '58s',    total: 19,  done: 19,  passed: 19,  failed: 0,  role: 'Admin' },
  { id: 'TR-8929', project: 'Billing Service',     status: 'cancelled', started: '2h ago',     duration: '12s',    total: 62,  done: 8,   passed: 8,   failed: 0,  role: 'Admin' },
];

const statusConfig = {
  running:   { icon: RefreshCw, color: 'text-[#f97316]',  bg: 'bg-[#f97316]/10 border-[#f97316]/20',  label: 'Running',   spin: true },
  completed: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', label: 'Completed', spin: false },
  failed:    { icon: XCircle,   color: 'text-red-400',    bg: 'bg-red-400/10 border-red-400/20',      label: 'Failed',    spin: false },
  cancelled: { icon: StopCircle, color: 'text-[#888]',    bg: 'bg-[#888]/10 border-[#888]/20',        label: 'Cancelled', spin: false },
};

export const TestRuns = () => {
  const [expanded, setExpanded] = useState<string | null>('TR-8934');

  return (
    <div className="max-w-[1400px] mx-auto space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Runs', value: runs.length, color: 'text-white' },
          { label: 'Running', value: runs.filter(r => r.status === 'running').length, color: 'text-[#f97316]' },
          { label: 'Completed', value: runs.filter(r => r.status === 'completed').length, color: 'text-emerald-400' },
          { label: 'Failed', value: runs.filter(r => r.status === 'failed').length, color: 'text-red-400' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[#666] text-xs mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-sm">All Test Runs</h2>
        <button className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-[0_0_14px_rgba(249,115,22,0.35)]">
          <Plus className="w-4 h-4" /> New Test Run
        </button>
      </div>

      {/* Runs list */}
      <div className="space-y-3">
        {runs.map((run, i) => {
          const cfg = statusConfig[run.status as keyof typeof statusConfig];
          const Icon = cfg.icon;
          const progress = Math.round((run.done / run.total) * 100);
          const passRate = run.done > 0 ? Math.round((run.passed / run.done) * 100) : 0;
          const isExpanded = expanded === run.id;

          return (
            <motion.div
              key={run.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#111] border border-[#1f1f1f] rounded-xl overflow-hidden"
            >
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-[#141414] transition-colors"
                onClick={() => setExpanded(isExpanded ? null : run.id)}
              >
                <Icon className={`w-4 h-4 shrink-0 ${cfg.color} ${cfg.spin ? 'animate-spin' : ''}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-white font-semibold text-sm">{run.project}</span>
                    <span className="font-mono text-xs text-[#666]">{run.id}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                    <span className="text-[11px] text-[#666] bg-[#1a1a1a] border border-[#2a2a2a] px-2 py-0.5 rounded">{run.role}</span>
                  </div>
                  {/* Progress bar */}
                  {run.status === 'running' && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-[#1f1f1f] rounded-full overflow-hidden">
                        <motion.div
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-[#f97316] rounded-full"
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <span className="text-[#f97316] text-xs font-mono">{progress}%</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-6 text-right shrink-0">
                  <div className="hidden md:block">
                    <div className="text-xs text-[#666]">Tests</div>
                    <div className="text-sm font-semibold text-white">{run.done}/{run.total}</div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-xs text-[#666]">Pass Rate</div>
                    <div className={`text-sm font-bold ${passRate >= 90 ? 'text-emerald-400' : passRate >= 75 ? 'text-yellow-400' : 'text-red-400'}`}>{passRate}%</div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-xs text-[#666]">Duration</div>
                    <div className="text-sm font-mono text-white">{run.duration}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#666]">Started</div>
                    <div className="text-xs text-[#888] flex items-center gap-1"><Clock className="w-3 h-3" />{run.started}</div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#555] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-[#1f1f1f] px-5 py-4 bg-[#0d0d0d]"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {[
                      { label: 'Total Jobs', value: run.total },
                      { label: 'Completed', value: run.done },
                      { label: 'Passed', value: run.passed, color: 'text-emerald-400' },
                      { label: 'Failed', value: run.failed, color: 'text-red-400' },
                    ].map((s, j) => (
                      <div key={j} className="bg-[#111] border border-[#1f1f1f] rounded-lg p-3">
                        <div className={`text-xl font-bold ${s.color ?? 'text-white'}`}>{s.value}</div>
                        <div className="text-[#666] text-xs mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${(run.passed / run.total) * 100}%` }} />
                    <div className="h-full bg-red-500" style={{ width: `${(run.failed / run.total) * 100}%` }} />
                    <div className="h-full bg-[#f97316]" style={{ width: `${((run.done - run.passed - run.failed) / run.total) * 100}%` }} />
                  </div>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-400"><div className="w-2 h-2 rounded-full bg-emerald-500" />Passed</div>
                    <div className="flex items-center gap-1.5 text-[11px] text-red-400"><div className="w-2 h-2 rounded-full bg-red-500" />Failed</div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#f97316]"><div className="w-2 h-2 rounded-full bg-[#f97316]" />In Progress</div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="flex items-center gap-1.5 bg-[#1a1a1a] border border-[#2a2a2a] text-[#aaa] hover:text-white px-3 py-1.5 rounded-lg text-xs transition-all">
                      <BarChart3 className="w-3.5 h-3.5" /> View Results
                    </button>
                    {run.status === 'running' && (
                      <button className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-all">
                        <StopCircle className="w-3.5 h-3.5" /> Stop Run
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
