import React from 'react';
import { motion } from 'framer-motion';
import { Server, Cpu, MemoryStick, Activity, CheckCircle2, Circle, Zap } from 'lucide-react';

const workers = [
  { id: 'W-01', status: 'active', cpu: 45, mem: 60, currentTask: 'GET /api/v1/users', project: 'Core API',      jobs: 234, uptime: '4h 12m' },
  { id: 'W-02', status: 'active', cpu: 78, mem: 80, currentTask: 'POST /api/v1/payments/process', project: 'Billing',  jobs: 189, uptime: '4h 12m' },
  { id: 'W-03', status: 'idle',   cpu: 5,  mem: 22, currentTask: '—',                  project: '—',            jobs: 312, uptime: '4h 12m' },
  { id: 'W-04', status: 'active', cpu: 62, mem: 55, currentTask: 'DELETE /api/v1/roles/{id}', project: 'Auth',  jobs: 201, uptime: '4h 12m' },
];

export const Workers = () => {
  return (
    <div className="max-w-[1400px] mx-auto space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Workers', value: workers.length, color: 'text-white' },
          { label: 'Active', value: workers.filter(w => w.status === 'active').length, color: 'text-[#f97316]' },
          { label: 'Idle', value: workers.filter(w => w.status === 'idle').length, color: 'text-[#888]' },
          { label: 'Total Jobs', value: workers.reduce((a, w) => a + w.jobs, 0), color: 'text-blue-400' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[#666] text-xs mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {workers.map((worker, i) => (
          <motion.div
            key={worker.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-[#111] border border-[#1f1f1f] rounded-xl p-5 hover:border-[#2a2a2a] transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${worker.status === 'active' ? 'bg-[#f97316]/10 border-[#f97316]/20' : 'bg-[#1a1a1a] border-[#2a2a2a]'}`}>
                  <Server className={`w-5 h-5 ${worker.status === 'active' ? 'text-[#f97316]' : 'text-[#666]'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm font-mono">{worker.id}</span>
                    <div className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${worker.status === 'active' ? 'text-[#f97316] bg-[#f97316]/10 border-[#f97316]/20' : 'text-[#888] bg-[#888]/10 border-[#888]/20'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${worker.status === 'active' ? 'bg-[#f97316] animate-pulse' : 'bg-[#888]'}`} />
                      {worker.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-[#666] text-xs mt-0.5">Uptime: {worker.uptime}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold text-sm">{worker.jobs}</div>
                <div className="text-[#666] text-[10px]">Jobs Done</div>
              </div>
            </div>

            {/* Current Task */}
            <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-3 py-2 mb-4 flex items-center gap-2">
              <Activity className={`w-3.5 h-3.5 shrink-0 ${worker.status === 'active' ? 'text-[#f97316]' : 'text-[#555]'}`} />
              <span className="font-mono text-xs text-[#aaa] truncate">{worker.currentTask}</span>
              {worker.project !== '—' && (
                <span className="text-[10px] text-[#666] bg-[#1a1a1a] border border-[#2a2a2a] px-1.5 py-0.5 rounded ml-auto shrink-0">{worker.project}</span>
              )}
            </div>

            {/* CPU */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#666] flex items-center gap-1"><Cpu className="w-3 h-3" />CPU</span>
                  <span className={`font-mono font-semibold ${worker.cpu > 80 ? 'text-red-400' : worker.cpu > 60 ? 'text-yellow-400' : 'text-blue-400'}`}>{worker.cpu}%</span>
                </div>
                <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${worker.cpu}%` }}
                    className={`h-full rounded-full ${worker.cpu > 80 ? 'bg-red-500' : worker.cpu > 60 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#666] flex items-center gap-1"><MemoryStick className="w-3 h-3" />Memory</span>
                  <span className={`font-mono font-semibold ${worker.mem > 80 ? 'text-red-400' : worker.mem > 60 ? 'text-yellow-400' : 'text-purple-400'}`}>{worker.mem}%</span>
                </div>
                <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${worker.mem}%` }}
                    className={`h-full rounded-full ${worker.mem > 80 ? 'bg-red-500' : worker.mem > 60 ? 'bg-yellow-500' : 'bg-purple-500'}`}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
