import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Search, Filter, Download, RefreshCw, Pause, Play } from 'lucide-react';
import { MOCK_LOGS } from '../../mock-data';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';
type LogSource = 'gateway' | 'worker' | 'ai' | 'auth';

const LEVEL_CONFIG: Record<LogLevel, { color: string; bg: string; label: string }> = {
  info:  { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  label: 'INFO'  },
  warn:  { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  label: 'WARN'  },
  error: { color: '#f87171', bg: 'rgba(248,113,113,0.08)', label: 'ERROR' },
  debug: { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', label: 'DEBUG' },
};

const SOURCE_CONFIG: Record<LogSource, { color: string }> = {
  gateway: { color: '#f97316' },
  worker:  { color: '#34d399' },
  ai:      { color: '#818cf8' },
  auth:    { color: '#fbbf24' },
};

const SOURCES: Array<'all' | LogSource> = ['all', 'gateway', 'worker', 'ai', 'auth'];
const LEVELS:  Array<'all' | LogLevel>  = ['all', 'info', 'warn', 'error', 'debug'];

// Extra streamed logs appended over time
const STREAM_POOL = [
  { level: 'info',  source: 'worker',  msg: '[W-01] GET /api/v1/roles → 200 OK (88ms)' },
  { level: 'debug', source: 'ai',      msg: 'Token embedding completed for endpoint batch 4' },
  { level: 'error', source: 'worker',  msg: '[W-02] POST /api/v1/payments → 500 Internal Server Error' },
  { level: 'warn',  source: 'gateway', msg: 'Slow queue: 23 jobs waiting > 2s' },
  { level: 'info',  source: 'auth',    msg: 'Token refreshed for session sess_8f4a21' },
  { level: 'info',  source: 'worker',  msg: '[W-03] PUT /api/v1/users/{id} → 200 OK (198ms)' },
  { level: 'debug', source: 'ai',      msg: 'Schema comparison: 2 fields differ from spec' },
  { level: 'error', source: 'worker',  msg: '[W-04] DELETE /api/v1/users/9 → 403 Forbidden' },
];

export const Logs = () => {
  const [logs, setLogs]         = useState(MOCK_LOGS);
  const [search, setSearch]     = useState('');
  const [levelFilter, setLevelFilter]   = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [paused, setPaused]     = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(MOCK_LOGS.length + 1);

  // Simulate streaming new logs
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      const raw = STREAM_POOL[Math.floor(Math.random() * STREAM_POOL.length)];
      const now = new Date();
      const ts = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}.${String(now.getMilliseconds()).padStart(3,'0')}`;
      setLogs(prev => [...prev.slice(-199), { id: `l${idRef.current++}`, ts, ...raw } as any]);
    }, 1200);
    return () => clearInterval(interval);
  }, [paused]);

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const filtered = logs.filter(l => {
    const matchLevel  = levelFilter  === 'all' || l.level  === levelFilter;
    const matchSource = sourceFilter === 'all' || l.source === sourceFilter;
    const matchSearch = !search || l.msg.toLowerCase().includes(search.toLowerCase()) || l.source.includes(search.toLowerCase());
    return matchLevel && matchSource && matchSearch;
  });

  const clearLogs = () => setLogs([]);

  return (
    <div className="p-6 max-w-[1440px] mx-auto flex flex-col gap-4 h-full">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Lines', value: logs.length, color: '#fff' },
          { label: 'Errors',      value: logs.filter(l => l.level === 'error').length,  color: '#f87171' },
          { label: 'Warnings',    value: logs.filter(l => l.level === 'warn').length,   color: '#fbbf24' },
          { label: 'AI Events',   value: logs.filter(l => l.source === 'ai').length,    color: '#818cf8' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-4">
            <div className="text-[22px] font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[#444] text-[11px] mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Terminal card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden flex flex-col">

        {/* Terminal header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#151515] bg-[#0d0d0d] shrink-0 flex-wrap gap-y-2">
          {/* Window dots */}
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#f87171]/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#34d399]/60" />
          </div>
          <Terminal className="w-3.5 h-3.5 text-[#444]" />
          <span className="text-[11px] text-[#444] font-mono flex-1">atp-ai::logs</span>

          {/* Streaming indicator */}
          {!paused && (
            <div className="flex items-center gap-1.5">
              <motion.div animate={{ opacity: [1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 text-[10px] font-medium">LIVE</span>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#333]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search logs..."
              className="bg-[#111] border border-[#1a1a1a] focus:border-[#f97316]/30 rounded-lg pl-7 pr-3 py-1.5 text-[11px] text-white placeholder-[#333] outline-none w-44 transition-colors font-mono" />
          </div>

          {/* Level filter */}
          <div className="flex gap-1">
            {LEVELS.map(l => {
              const cfg = l === 'all' ? null : LEVEL_CONFIG[l as LogLevel];
              return (
                <button key={l}
                  onClick={() => setLevelFilter(l)}
                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase font-mono transition-all border ${levelFilter === l ? 'text-white border-[#2a2a2a]' : 'text-[#333] border-transparent hover:border-[#1a1a1a] hover:text-[#666]'}`}
                  style={levelFilter === l && cfg ? { backgroundColor: cfg.bg, color: cfg.color, borderColor: 'transparent' } : {}}
                >{l}</button>
              );
            })}
          </div>

          {/* Source filter */}
          <div className="flex gap-1">
            {SOURCES.map(s => {
              const cfg = s === 'all' ? null : SOURCE_CONFIG[s as LogSource];
              return (
                <button key={s}
                  onClick={() => setSourceFilter(s)}
                  className={`px-2 py-1 rounded text-[10px] font-semibold capitalize font-mono transition-all border ${sourceFilter === s ? 'border-[#2a2a2a]' : 'text-[#333] border-transparent hover:border-[#1a1a1a] hover:text-[#666]'}`}
                  style={sourceFilter === s && cfg ? { color: cfg.color } : sourceFilter === s ? { color: '#aaa' } : {}}
                >{s}</button>
              );
            })}
          </div>

          {/* Actions */}
          <button onClick={() => setPaused(!paused)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${paused ? 'bg-[#f97316]/10 border-[#f97316]/20 text-[#f97316]' : 'bg-[#111] border-[#1a1a1a] text-[#555] hover:text-white'}`}>
            {paused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3" />}
          </button>
          <button onClick={clearLogs}
            className="w-7 h-7 rounded-lg bg-[#111] border border-[#1a1a1a] flex items-center justify-center text-[#555] hover:text-[#f87171] transition-colors">
            <RefreshCw className="w-3 h-3" />
          </button>
          <button className="w-7 h-7 rounded-lg bg-[#111] border border-[#1a1a1a] flex items-center justify-center text-[#555] hover:text-white transition-colors">
            <Download className="w-3 h-3" />
          </button>
        </div>

        {/* Log lines */}
        <div className="flex-1 overflow-y-auto font-mono text-[11px] p-3 space-y-0.5"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#1a1a1a transparent' }}
          onScroll={e => {
            const el = e.currentTarget;
            setAutoScroll(el.scrollTop + el.clientHeight >= el.scrollHeight - 10);
          }}>
          <AnimatePresence initial={false}>
            {filtered.map(log => {
              const lCfg = LEVEL_CONFIG[log.level as LogLevel] ?? LEVEL_CONFIG.info;
              const sCfg = SOURCE_CONFIG[log.source as LogSource] ?? { color: '#888' };
              return (
                <motion.div key={log.id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-start gap-2 py-0.5 hover:bg-[#111] rounded px-1 group"
                >
                  <span className="text-[#2a2a2a] shrink-0 pt-0.5">{log.ts}</span>
                  <span className="shrink-0 px-1.5 py-0 rounded text-[9px] font-bold pt-0.5"
                    style={{ backgroundColor: lCfg.bg, color: lCfg.color }}>{lCfg.label}</span>
                  <span className="shrink-0 text-[10px] font-semibold pt-0.5 w-14" style={{ color: sCfg.color }}>[{log.source}]</span>
                  <span className={`flex-1 leading-snug ${log.level === 'error' ? 'text-[#f87171]' : log.level === 'warn' ? 'text-[#fbbf24]' : 'text-[#666]'}`}>{log.msg}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[#111] bg-[#0d0d0d] flex items-center justify-between shrink-0">
          <span className="text-[#333] text-[10px] font-mono">{filtered.length} lines shown</span>
          <button onClick={() => setAutoScroll(true)}
            className={`text-[10px] font-mono transition-colors ${autoScroll ? 'text-[#2a2a2a]' : 'text-[#f97316] hover:text-white'}`}>
            {autoScroll ? '● auto-scroll on' : '↓ scroll to bottom'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
