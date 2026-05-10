import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Search, Lock, Eye, Play, CheckCircle2, Clock } from 'lucide-react';

const endpoints = [
  { id: 'e1',  method: 'GET',    path: '/api/v1/users',              summary: 'List all users',           requiresAuth: true,  deprecated: false, tested: true,  passRate: 98,  avgMs: 145, project: 'Core API' },
  { id: 'e2',  method: 'POST',   path: '/api/v1/users',              summary: 'Create a user',            requiresAuth: true,  deprecated: false, tested: true,  passRate: 94,  avgMs: 212, project: 'Core API' },
  { id: 'e3',  method: 'GET',    path: '/api/v1/users/{id}',         summary: 'Get user by ID',           requiresAuth: true,  deprecated: false, tested: true,  passRate: 100, avgMs: 98,  project: 'Core API' },
  { id: 'e4',  method: 'PUT',    path: '/api/v1/users/{id}',         summary: 'Update user',              requiresAuth: true,  deprecated: false, tested: true,  passRate: 91,  avgMs: 198, project: 'Core API' },
  { id: 'e5',  method: 'DELETE', path: '/api/v1/users/{id}',         summary: 'Delete user',              requiresAuth: true,  deprecated: false, tested: false, passRate: 0,   avgMs: 0,   project: 'Core API' },
  { id: 'e6',  method: 'POST',   path: '/api/v1/auth/login',         summary: 'Authenticate user',        requiresAuth: false, deprecated: false, tested: true,  passRate: 88,  avgMs: 323, project: 'Auth Gateway' },
  { id: 'e7',  method: 'POST',   path: '/api/v1/auth/refresh',       summary: 'Refresh JWT token',        requiresAuth: false, deprecated: false, tested: true,  passRate: 97,  avgMs: 122, project: 'Auth Gateway' },
  { id: 'e8',  method: 'GET',    path: '/api/v1/payments',           summary: 'List payments',            requiresAuth: true,  deprecated: false, tested: true,  passRate: 100, avgMs: 201, project: 'Billing Service' },
  { id: 'e9',  method: 'POST',   path: '/api/v1/payments/process',   summary: 'Process payment',          requiresAuth: true,  deprecated: false, tested: true,  passRate: 82,  avgMs: 890, project: 'Billing Service' },
  { id: 'e10', method: 'GET',    path: '/api/v1/reports/export',     summary: 'Export test report',       requiresAuth: true,  deprecated: false, tested: true,  passRate: 76,  avgMs: 1200, project: 'Core API' },
  { id: 'e11', method: 'POST',   path: '/api/v1/notifications/send', summary: 'Send notification',        requiresAuth: true,  deprecated: true,  tested: false, passRate: 0,   avgMs: 0,   project: 'Notification Service' },
  { id: 'e12', method: 'GET',    path: '/api/v1/roles',              summary: 'List project roles',       requiresAuth: true,  deprecated: false, tested: true,  passRate: 100, avgMs: 88,  project: 'Auth Gateway' },
];

const methodColors: Record<string, string> = {
  GET:    'bg-blue-500/15 text-blue-400 border-blue-500/30',
  POST:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  PUT:    'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  PATCH:  'bg-purple-500/15 text-purple-400 border-purple-500/30',
  DELETE: 'bg-red-500/15 text-red-400 border-red-500/30',
};

export const Endpoints = () => {
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');

  const filtered = endpoints.filter(ep => {
    const matchSearch = ep.path.includes(search) || ep.summary.toLowerCase().includes(search.toLowerCase());
    const matchMethod = methodFilter === 'ALL' || ep.method === methodFilter;
    return matchSearch && matchMethod;
  });

  return (
    <div className="max-w-[1400px] mx-auto space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Endpoints', value: endpoints.length, color: 'text-white' },
          { label: 'Tested', value: endpoints.filter(e => e.tested).length, color: 'text-emerald-400' },
          { label: 'Untested', value: endpoints.filter(e => !e.tested).length, color: 'text-yellow-400' },
          { label: 'Deprecated', value: endpoints.filter(e => e.deprecated).length, color: 'text-red-400' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[#666] text-xs mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search endpoints..." className="w-full bg-[#111] border border-[#2a2a2a] focus:border-[#f97316]/50 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-[#555] outline-none transition-colors" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['ALL', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(m => (
            <button key={m} onClick={() => setMethodFilter(m)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${methodFilter === m ? 'bg-[#f97316] text-white border-[#f97316] shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'bg-[#111] border-[#2a2a2a] text-[#888] hover:text-white hover:border-[#f97316]/30'}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#111] border border-[#1f1f1f] rounded-xl overflow-hidden">
        <div className="grid grid-cols-[80px_1fr_150px_100px_110px_80px_80px] text-[10px] text-[#555] uppercase tracking-widest font-semibold px-4 py-3 border-b border-[#1f1f1f]">
          <div>Method</div><div>Path</div><div>Project</div><div>Status</div><div>Pass Rate</div><div>Avg ms</div><div className="text-right">Act</div>
        </div>
        <div className="divide-y divide-[#1a1a1a]">
          {filtered.map((ep, i) => (
            <motion.div key={ep.id} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }} className="grid grid-cols-[80px_1fr_150px_100px_110px_80px_80px] items-center px-4 py-3 hover:bg-[#161616] transition-colors cursor-pointer group">
              <div><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${methodColors[ep.method] ?? ''}`}>{ep.method}</span></div>
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-white truncate">{ep.path}</span>
                  {ep.deprecated && <span className="text-[9px] bg-red-500/15 text-red-400 border border-red-500/20 px-1.5 rounded-full shrink-0">deprecated</span>}
                  {ep.requiresAuth && <Lock className="w-3 h-3 text-[#f97316] shrink-0" />}
                </div>
                <div className="text-[11px] text-[#666] mt-0.5 truncate">{ep.summary}</div>
              </div>
              <div className="text-xs text-[#888] truncate">{ep.project}</div>
              <div>
                {ep.tested
                  ? <span className="flex items-center gap-1 text-emerald-400 text-[11px]"><CheckCircle2 className="w-3 h-3" />Tested</span>
                  : <span className="flex items-center gap-1 text-yellow-400 text-[11px]"><Clock className="w-3 h-3" />Pending</span>}
              </div>
              <div>
                {ep.tested ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-[#1f1f1f] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${ep.passRate >= 95 ? 'bg-emerald-500' : ep.passRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${ep.passRate}%` }} />
                    </div>
                    <span className={`text-xs font-mono ${ep.passRate >= 95 ? 'text-emerald-400' : ep.passRate >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>{ep.passRate}%</span>
                  </div>
                ) : <span className="text-[#555] text-xs">—</span>}
              </div>
              <div className="font-mono text-xs text-[#888]">{ep.tested ? `${ep.avgMs}ms` : '—'}</div>
              <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#888] hover:text-white transition-all"><Eye className="w-3 h-3" /></button>
                <button className="p-1.5 bg-[#f97316]/10 border border-[#f97316]/20 rounded text-[#f97316] hover:bg-[#f97316] hover:text-white transition-all"><Play className="w-3 h-3 fill-current" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <p className="text-xs text-[#555] text-right">Showing {filtered.length} of {endpoints.length} endpoints</p>
    </div>
  );
};
