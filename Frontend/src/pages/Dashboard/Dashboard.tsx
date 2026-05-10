import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity, Server, Database, AlertTriangle,
  Play, Zap, Layers, GitPullRequest, CheckCircle2,
  XCircle, Clock, RefreshCw, BarChart3, ShieldAlert, TrendingUp
} from 'lucide-react';
import { useDashboardMetrics } from '../../hooks/useDashboardMetrics';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

/* ─── Animation helpers ──────────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, delay, ease: [0.4, 0, 0.2, 1] as const },
});

/* ─── Re-usable Card ─────────────────────────────────────────────────────── */
const Card = ({
  children,
  className = '',
  title,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    {...fadeUp(delay)}
    className={`bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden relative group ${className}`}
    whileHover={{ borderColor: 'rgba(249,115,22,0.18)' }}
    transition={{ duration: 0.2 }}
  >
    {/* Subtle top-left glow on hover */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      style={{ background: 'radial-gradient(280px circle at 0% 0%, rgba(249,115,22,0.06), transparent 70%)' }} />

    <div className="relative z-10 p-5 h-full flex flex-col">
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <div className="text-[#555] uppercase tracking-widest text-[10px] font-semibold flex items-center gap-2">
            {title}
          </div>
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  </motion.div>
);

/* ─── Stat Badge (KPI card) ──────────────────────────────────────────────── */
const StatCard = ({
  label, value, icon: Icon, accent, delay,
}: {
  label: string; value: string | number; icon: React.ElementType; accent: string; delay: number;
}) => (
  <motion.div
    {...fadeUp(delay)}
    className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-4 relative overflow-hidden group cursor-default"
    whileHover={{ borderColor: 'rgba(249,115,22,0.2)', y: -1 }}
    transition={{ duration: 0.18 }}
  >
    <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      style={{ background: `radial-gradient(circle, ${accent}12, transparent 70%)` }} />
    <div className="flex items-center justify-between mb-3">
      <span className="text-[#444] text-[10px] uppercase tracking-widest font-semibold">{label}</span>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${accent}18` }}>
        <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
      </div>
    </div>
    <div className="text-[22px] font-bold text-white tracking-tight">{value}</div>
  </motion.div>
);

/* ─── Custom Tooltip for charts ──────────────────────────────────────────── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#161616] border border-[#252525] rounded-xl px-3 py-2 text-xs shadow-2xl">
      <p className="text-[#555] mb-1.5 font-medium">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
          <span className="text-[#888]">{p.name}:</span>
          <span className="text-white font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── Dashboard ──────────────────────────────────────────────────────────── */
export const Dashboard = () => {
  const {
    kpis, execution, workers, queueHealth,
    analytics, insights, failedEndpoints,
    recentRuns, coverage, systemHealth,
  } = useDashboardMetrics();

  const kpiList = [
    { label: 'Projects',     value: kpis.totalProjects,                       icon: Layers,      accent: '#818cf8' },
    { label: 'Endpoints',    value: kpis.importedEndpoints,                   icon: Database,    accent: '#a78bfa' },
    { label: 'Test Runs',    value: kpis.totalTestRuns.toLocaleString(),       icon: Play,        accent: '#34d399' },
    { label: 'Queue',        value: kpis.queueSize,                           icon: GitPullRequest, accent: '#fbbf24' },
    { label: 'Success Rate', value: `${kpis.successRate}%`,                   icon: Activity,    accent: '#34d399' },
    { label: 'Avg Response', value: `${kpis.avgResponseTime}ms`,              icon: Clock,       accent: '#f97316' },
  ];

  return (
    <div className="min-h-full bg-[#0a0a0a] p-6">
      <div className="max-w-[1440px] mx-auto space-y-5">

        {/* ── KPI Row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {kpiList.map((k, i) => (
            <StatCard key={k.label} {...k} delay={i * 0.04} />
          ))}
        </div>

        {/* ── Main Content ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

          {/* Left Column — 8 cols */}
          <div className="xl:col-span-8 flex flex-col gap-4">

            {/* Analytics Chart */}
            <Card
              delay={0.05}
              title={<><BarChart3 className="w-3.5 h-3.5 text-[#f97316]" /> Real-Time Analytics</>}
              className="min-h-[280px]"
            >
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={analytics} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gPass" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"  stopColor="#34d399" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gFail" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"  stopColor="#f87171" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#f87171" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                  <XAxis dataKey="time" stroke="#333" fontSize={10} tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis stroke="#333" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="pass" stroke="#34d399" strokeWidth={2} fill="url(#gPass)" name="Passed" dot={false} />
                  <Area type="monotone" dataKey="fail" stroke="#f87171" strokeWidth={2} fill="url(#gFail)" name="Failed" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="flex items-center gap-5 mt-2 pt-2 border-t border-[#1a1a1a]">
                {[{ color: '#34d399', label: 'Passed' }, { color: '#f87171', label: 'Failed' }].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                    <span className="text-[11px] text-[#555]">{l.label}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Workers + Failed Endpoints */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Workers */}
              <Card delay={0.1} title={<><Server className="w-3.5 h-3.5 text-[#f97316]" /> Parallel Workers</>}>
                <div className="space-y-3">
                  {workers.map((w) => (
                    <div key={w.id} className="rounded-xl bg-[#0f0f0f] border border-[#1e1e1e] p-3 transition-colors hover:border-[#272727]">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${w.status === 'active' ? 'bg-[#f97316] shadow-[0_0_6px_rgba(249,115,22,0.8)] animate-pulse' : 'bg-[#333]'}`} />
                          <span className="text-xs font-semibold text-[#ccc] font-mono">{w.id}</span>
                        </div>
                        <span className={`text-[10px] font-semibold tracking-wider ${w.status === 'active' ? 'text-[#f97316]' : 'text-[#444]'}`}>
                          {w.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[{ label: 'CPU', val: w.cpu, color: w.cpu > 80 ? '#f87171' : '#818cf8' },
                          { label: 'MEM', val: w.mem, color: w.mem > 80 ? '#f87171' : '#a78bfa' }].map(m => (
                          <div key={m.label}>
                            <div className="flex justify-between text-[10px] text-[#444] mb-1 font-medium">
                              <span>{m.label}</span><span>{m.val}%</span>
                            </div>
                            <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                              <motion.div
                                animate={{ width: `${m.val}%` }}
                                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                                className="h-full rounded-full"
                                style={{ background: m.color }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Failed Endpoints */}
              <Card delay={0.12} title={<><XCircle className="w-3.5 h-3.5 text-[#f97316]" /> Failed Endpoints</>}>
                <div className="space-y-2.5">
                  {failedEndpoints.map((ep, i) => (
                    <div key={i} className="group/row p-2.5 rounded-xl hover:bg-[#0f0f0f] transition-colors border border-transparent hover:border-[#1e1e1e]">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md tracking-wide
                            ${ep.method === 'GET'  ? 'bg-[#1e3a5f] text-[#60a5fa]' :
                              ep.method === 'POST' ? 'bg-[#14532d] text-[#4ade80]' :
                              'bg-[#431407] text-[#f97316]'}`}>
                            {ep.method}
                          </span>
                          <span className="font-mono text-[11px] text-[#888] truncate max-w-[130px]">{ep.url}</span>
                        </div>
                        <span className="text-[11px] text-[#f87171] font-semibold">{ep.failRate}%</span>
                      </div>
                      <div className="h-0.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div className="h-full bg-[#f87171]/60 rounded-full transition-all duration-700"
                          style={{ width: `${Math.min(ep.failRate * 4, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Queue Health + Coverage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Queue Health */}
              <Card delay={0.16} title={<><GitPullRequest className="w-3.5 h-3.5 text-[#f97316]" /> Queue Health</>}>
                <div className="grid grid-cols-3 gap-3 h-full">
                  {[
                    { label: 'Throughput', value: `${queueHealth.throughput}`, unit: 'req/s', color: '#818cf8' },
                    { label: 'Pending',    value: `${queueHealth.pending}`,     unit: 'jobs',  color: '#fbbf24' },
                    { label: 'Avg Delay',  value: `${queueHealth.avgDelay}`,    unit: 's',     color: '#34d399' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-3 text-center">
                      <div className="text-[10px] text-[#444] uppercase tracking-widest font-semibold mb-2">{stat.label}</div>
                      <div className="text-[20px] font-bold" style={{ color: stat.color }}>{stat.value}</div>
                      <div className="text-[10px] text-[#333] mt-0.5">{stat.unit}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Coverage Donut */}
              <Card delay={0.18} title={<><TrendingUp className="w-3.5 h-3.5 text-[#f97316]" /> Coverage</>}>
                <div className="flex items-center gap-4">
                  <div className="relative w-[100px] h-[100px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={coverage.methods} cx="50%" cy="50%" innerRadius={32} outerRadius={46}
                          paddingAngle={3} dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                          {coverage.methods.map((entry: any, index: number) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[17px] font-bold text-white leading-none">
                        {Math.round(((coverage.total - coverage.untested) / coverage.total) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    {coverage.methods.map((m: any) => (
                      <div key={m.name} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: m.color }} />
                        <span className="text-[11px] text-[#666] flex-1">{m.name}</span>
                        <span className="text-[11px] text-[#aaa] font-semibold">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Column — 4 cols */}
          <div className="xl:col-span-4 flex flex-col gap-4">

            {/* Execution Progress */}
            <Card delay={0.07} title={<><Activity className="w-3.5 h-3.5 text-[#f97316]" /> Execution Status</>}>
              {/* Segmented progress bar */}
              <div className="overflow-hidden rounded-full h-2 flex gap-0.5 bg-[#0f0f0f] mb-4">
                {[
                  { val: execution.completed,  color: '#34d399' },
                  { val: execution.inProgress, color: '#f97316' },
                  { val: execution.failed,     color: '#f87171' },
                ].map((seg, i) => (
                  <motion.div
                    key={i}
                    initial={{ width: 0 }}
                    animate={{ width: `${seg.val}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                    className="h-full rounded-full first:rounded-l-full last:rounded-r-full"
                    style={{ background: seg.color }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Done',    val: execution.completed,  color: '#34d399' },
                  { label: 'Running', val: execution.inProgress, color: '#f97316' },
                  { label: 'Failed',  val: execution.failed,     color: '#f87171' },
                ].map(s => (
                  <div key={s.label} className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-2.5 text-center">
                    <div className="text-[16px] font-bold" style={{ color: s.color }}>{s.val}%</div>
                    <div className="text-[10px] text-[#444] mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* AI Insights */}
            <Card delay={0.09} title={<><Zap className="w-3.5 h-3.5 text-[#f97316]" /> Copilot Insights</>}>
              <div className="space-y-2.5">
                {insights.map((insight: any) => (
                  <div
                    key={insight.id}
                    className="rounded-xl bg-[#0f0f0f] border border-[#1e1e1e] p-3 relative overflow-hidden group/ins hover:border-[#272727] transition-colors"
                  >
                    {/* Severity accent line */}
                    <div className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full ${
                      insight.severity === 'critical' ? 'bg-[#f87171]' :
                      insight.severity === 'high'     ? 'bg-[#f97316]' : 'bg-[#fbbf24]'
                    }`} />
                    <div className="pl-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          insight.severity === 'critical' ? 'text-[#f87171]' :
                          insight.severity === 'high'     ? 'text-[#f97316]' : 'text-[#fbbf24]'
                        }`} />
                        <div>
                          <p className="text-[12px] font-semibold text-[#ddd] leading-snug">{insight.title}</p>
                          <p className="text-[11px] text-[#555] mt-0.5 leading-snug">{insight.description}</p>
                          <span className="text-[10px] text-[#3a3a3a] mt-1 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> {insight.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Runs */}
            <Card delay={0.14} title={<><RefreshCw className="w-3.5 h-3.5 text-[#f97316]" /> Recent Runs</>}>
              <div className="space-y-0">
                {recentRuns.map((run: any, i: number) => (
                  <div
                    key={run.id}
                    className="flex items-center justify-between py-2.5 border-b border-[#151515] last:border-0 group/run hover:bg-[#0f0f0f] -mx-5 px-5 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      {run.status === 'passed'  ? <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399] shrink-0" /> :
                       run.status === 'failed'  ? <XCircle      className="w-3.5 h-3.5 text-[#f87171] shrink-0" /> :
                                                  <RefreshCw    className="w-3.5 h-3.5 text-[#f97316] shrink-0 animate-spin" />}
                      <div>
                        <div className="text-[12px] font-semibold text-[#ccc] leading-snug">{run.project}</div>
                        <div className="text-[10px] text-[#444]">{run.id} · {run.time}</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#444] font-mono">{run.duration}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* System Health */}
            <Card delay={0.2} title={<><ShieldAlert className="w-3.5 h-3.5 text-[#f97316]" /> System Health</>}>
              <div className="space-y-2">
                {systemHealth.map((sys: any, i: number) => (
                  <div key={i} className="flex items-center justify-between bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${sys.status === 'healthy' ? 'bg-[#34d399]' : 'bg-[#f87171] animate-pulse'}`} />
                      <span className="text-[12px] text-[#aaa] font-medium">{sys.service}</span>
                    </div>
                    <span className="text-[10px] text-[#3a3a3a] font-mono">{sys.uptime}</span>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};