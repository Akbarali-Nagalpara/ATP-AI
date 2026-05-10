import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, ShieldAlert, Zap, AlertTriangle, Search, Clock,
  TrendingUp, ChevronRight, Lightbulb, Lock, BarChart3
} from 'lucide-react';
import { MOCK_AI_INSIGHTS } from '../../mock-data';

const categoryConfig = {
  security:    { icon: Lock,         color: '#f87171', bg: 'rgba(248,113,113,0.08)', label: 'Security'    },
  performance: { icon: Zap,          color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  label: 'Performance' },
  coverage:    { icon: BarChart3,    color: '#818cf8', bg: 'rgba(129,140,248,0.08)', label: 'Coverage'    },
  schema:      { icon: AlertTriangle,color: '#f97316', bg: 'rgba(249,115,22,0.08)',  label: 'Schema'      },
};

const severityConfig = {
  critical: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)' },
  high:     { color: '#f97316', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.25)'  },
  medium:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)'  },
  low:      { color: '#818cf8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.25)' },
};

const CATEGORIES = ['all', 'security', 'performance', 'coverage', 'schema'] as const;
const SEVERITIES = ['all', 'critical', 'high', 'medium', 'low'] as const;

export const AIInsights = () => {
  const [catFilter, setCatFilter]   = useState<string>('all');
  const [sevFilter, setSevFilter]   = useState<string>('all');
  const [selected, setSelected]     = useState<string | null>(null);
  const [search, setSearch]         = useState('');

  const filtered = MOCK_AI_INSIGHTS.filter(i => {
    const matchCat = catFilter === 'all' || i.category === catFilter;
    const matchSev = sevFilter === 'all' || i.severity === sevFilter;
    const matchSearch = !search ||
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.endpoint.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSev && matchSearch;
  });

  const selectedInsight = MOCK_AI_INSIGHTS.find(i => i.id === selected);

  const summaryStats = [
    { label: 'Total Findings', value: MOCK_AI_INSIGHTS.length, color: '#fff' },
    { label: 'Critical',       value: MOCK_AI_INSIGHTS.filter(i => i.severity === 'critical').length, color: '#f87171' },
    { label: 'High',           value: MOCK_AI_INSIGHTS.filter(i => i.severity === 'high').length,     color: '#f97316' },
    { label: 'Avg Confidence', value: `${Math.round(MOCK_AI_INSIGHTS.reduce((a, i) => a + i.confidence, 0) / MOCK_AI_INSIGHTS.length)}%`, color: '#34d399' },
  ];

  return (
    <div className="p-6 max-w-[1440px] mx-auto">
      {/* AI Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-[#1e1e1e] bg-[#0f0f0f] p-5 mb-5"
      >
        {/* Animated scan line */}
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
          className="absolute inset-y-0 w-1/3 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.06), transparent)' }}
        />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#f97316]" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">AI Analysis Summary</h2>
              <p className="text-[#555] text-[11px] mt-0.5">Powered by DeepSeek-R1 · Last scan 2 min ago</p>
            </div>
            <div className="flex items-center gap-1.5 ml-4 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-[11px] font-medium">Live Scanning</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-5">
            {summaryStats.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[10px] text-[#444] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="flex gap-5">
        {/* Insight Cards List */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 max-w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#444]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search insights..."
                className="w-full bg-[#111] border border-[#1e1e1e] focus:border-[#f97316]/30 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-[#444] outline-none transition-colors"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map(c => (
                <button key={c}
                  onClick={() => setCatFilter(c)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all capitalize ${catFilter === c ? 'bg-[#f97316] text-white border-[#f97316]' : 'bg-[#111] border-[#1e1e1e] text-[#666] hover:text-white hover:border-[#2a2a2a]'}`}
                >{c}</button>
              ))}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {SEVERITIES.map(s => {
                const cfg = s === 'all' ? null : severityConfig[s as keyof typeof severityConfig];
                return (
                  <button key={s}
                    onClick={() => setSevFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all capitalize ${sevFilter === s ? 'text-white' : 'bg-[#111] border-[#1e1e1e] text-[#666] hover:text-white hover:border-[#2a2a2a]'}`}
                    style={sevFilter === s && cfg ? { backgroundColor: cfg.bg, borderColor: cfg.border, color: cfg.color } : {}}
                  >{s}</button>
                );
              })}
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((insight, i) => {
                const catCfg = categoryConfig[insight.category as keyof typeof categoryConfig];
                const sevCfg = severityConfig[insight.severity as keyof typeof severityConfig];
                const CatIcon = catCfg.icon;
                const isActive = selected === insight.id;

                return (
                  <motion.div
                    key={insight.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                    onClick={() => setSelected(isActive ? null : insight.id)}
                    className={`relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-200 ${isActive ? 'border-[#f97316]/30' : 'border-[#1e1e1e] hover:border-[#2a2a2a]'}`}
                    style={{ backgroundColor: isActive ? 'rgba(249,115,22,0.04)' : '#111' }}
                  >
                    {/* Left accent bar */}
                    <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full" style={{ backgroundColor: sevCfg.color }} />

                    <div className="p-4 pl-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {/* Category icon */}
                          <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-0.5"
                            style={{ backgroundColor: catCfg.bg }}>
                            <CatIcon className="w-4 h-4" style={{ color: catCfg.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-[13px] font-semibold text-white">{insight.title}</span>
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md border"
                                style={{ color: sevCfg.color, backgroundColor: sevCfg.bg, borderColor: sevCfg.border }}>
                                {insight.severity}
                              </span>
                              <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-md border border-[#1e1e1e] text-[#555]">
                                {catCfg.label}
                              </span>
                            </div>
                            <p className="text-[12px] text-[#666] leading-snug line-clamp-2">{insight.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="font-mono text-[11px] text-[#f97316] bg-[#f97316]/5 border border-[#f97316]/15 px-2 py-0.5 rounded-md">{insight.endpoint}</span>
                              <span className="text-[11px] text-[#444]">{insight.project}</span>
                              <span className="flex items-center gap-1 text-[11px] text-[#444]"><Clock className="w-3 h-3" />{insight.detectedAt}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {/* Confidence ring */}
                          <div className="flex flex-col items-center">
                            <div className="text-[16px] font-bold" style={{ color: insight.confidence >= 90 ? '#34d399' : '#fbbf24' }}>
                              {insight.confidence}%
                            </div>
                            <div className="text-[9px] text-[#444]">confidence</div>
                          </div>
                          <ChevronRight className={`w-4 h-4 text-[#333] transition-transform ${isActive ? 'rotate-90' : ''}`} />
                        </div>
                      </div>

                      {/* Expanded suggestion */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
                              <div className="flex items-start gap-2.5 bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-3.5">
                                <Lightbulb className="w-4 h-4 text-[#fbbf24] shrink-0 mt-0.5" />
                                <div>
                                  <div className="text-[11px] font-semibold text-[#fbbf24] mb-1">Suggested Fix</div>
                                  <p className="text-[12px] text-[#888] leading-relaxed">{insight.suggestion}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <Bot className="w-8 h-8 text-[#2a2a2a] mb-3" />
                <p className="text-[#444] text-sm">No insights match your filters</p>
                <p className="text-[#333] text-xs mt-1">Try adjusting the category or severity</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Summary Panel */}
        <div className="w-[220px] shrink-0 space-y-3">
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-4">
            <div className="text-[10px] text-[#444] uppercase tracking-widest font-semibold mb-3">By Category</div>
            <div className="space-y-2">
              {Object.entries(categoryConfig).map(([key, cfg]) => {
                const count = MOCK_AI_INSIGHTS.filter(i => i.category === key).length;
                const Icon = cfg.icon;
                return (
                  <div key={key} className="flex items-center gap-2 cursor-pointer" onClick={() => setCatFilter(key)}>
                    <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: cfg.bg }}>
                      <Icon className="w-3 h-3" style={{ color: cfg.color }} />
                    </div>
                    <span className="text-[12px] text-[#888] flex-1 capitalize">{key}</span>
                    <span className="text-[12px] font-bold text-white">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-4">
            <div className="text-[10px] text-[#444] uppercase tracking-widest font-semibold mb-3">By Severity</div>
            <div className="space-y-2">
              {Object.entries(severityConfig).map(([key, cfg]) => {
                const count = MOCK_AI_INSIGHTS.filter(i => i.severity === key).length;
                return (
                  <div key={key} className="flex items-center justify-between cursor-pointer" onClick={() => setSevFilter(key)}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                      <span className="text-[12px] text-[#888] capitalize">{key}</span>
                    </div>
                    <span className="text-[12px] font-bold" style={{ color: cfg.color }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-4">
            <div className="text-[10px] text-[#444] uppercase tracking-widest font-semibold mb-3">AI Model</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[12px] text-[#888]">deepseek-r1:7b</span>
            </div>
            <div className="mt-2 text-[11px] text-[#555]">Local · Ollama</div>
            <div className="mt-3 h-0.5 bg-[#1a1a1a] rounded-full overflow-hidden">
              <motion.div animate={{ width: ['30%', '85%', '55%', '70%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="h-full bg-[#f97316]/50 rounded-full" />
            </div>
            <div className="text-[10px] text-[#444] mt-1">Inference active</div>
          </div>
        </div>
      </div>
    </div>
  );
};
