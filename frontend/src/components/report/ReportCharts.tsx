import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area 
} from 'recharts';
import { Endpoint } from '../../store/useAppStore';

interface ReportChartsProps {
  endpoints: Endpoint[];
}

export const ReportCharts: React.FC<ReportChartsProps> = ({ endpoints }) => {
  // 1. Success Rate Donut Chart
  const successData = useMemo(() => {
    const passed = endpoints.filter(e => e.status === 'Pass').length;
    const failed = endpoints.filter(e => e.status === 'Fail').length;
    const runningOrPending = endpoints.length - (passed + failed);

    const data = [
      { name: 'Passed', value: passed, color: '#10b981' }, // emerald-500
      { name: 'Failed', value: failed, color: '#f43f5e' }, // rose-500
    ];

    if (runningOrPending > 0) {
      data.push({ name: 'Incomplete', value: runningOrPending, color: '#6b7280' }); // gray-500
    }

    return data.filter(d => d.value > 0);
  }, [endpoints]);

  // 2. Response Time / Latency Area Chart
  const latencyData = useMemo(() => {
    // Sort or filter to show meaningful latency trend (up to 15 endpoints to prevent clutter)
    const samples = endpoints
      .filter(e => e.status !== 'Pending' && e.status !== 'Queued' && e.responseTime)
      .slice(0, 15)
      .map(e => ({
        path: e.path.length > 20 ? `...${e.path.slice(-18)}` : e.path,
        fullPath: e.path,
        latency: e.responseTime || 0,
        method: e.method,
      }));
    return samples;
  }, [endpoints]);

  // 3. Status Code Frequencies Bar Chart
  const statusCodeData = useMemo(() => {
    const counts: Record<number, number> = {};
    endpoints.forEach(e => {
      if (e.statusCode) {
        counts[e.statusCode] = (counts[e.statusCode] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([code, count]) => {
      let group = '2xx';
      const c = Number(code);
      if (c >= 300 && c < 400) group = '3xx';
      if (c >= 400 && c < 500) group = '4xx';
      if (c >= 500) group = '5xx';

      return {
        code: `${code}`,
        count,
        group,
        color: c < 300 ? '#10b981' : c < 400 ? '#3b82f6' : c < 500 ? '#f59e0b' : '#f43f5e'
      };
    }).sort((a, b) => Number(a.code) - Number(b.code));
  }, [endpoints]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#121215] border border-white/10 px-3.5 py-2.5 rounded-xl shadow-2xl backdrop-blur-xl">
          <p className="text-xs font-mono font-semibold text-gray-200">{data.fullPath || data.name || data.code}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            <p className="text-xs font-bold text-gray-400">
              {payload[0].name}: <span className="text-white font-mono">{payload[0].value}</span>
              {data.latency !== undefined ? 'ms' : ''}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const total = endpoints.length;
  const passed = endpoints.filter(e => e.status === 'Pass').length;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Success Rate Donut */}
      <div className="bg-[#0d0d0f]/60 backdrop-blur-xl border border-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-xl min-h-[300px]">
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Success Distribution</h4>
          <p className="text-xs text-gray-400 mt-1">Endpoint pass vs failure rates</p>
        </div>

        <div className="relative flex-1 flex items-center justify-center my-2">
          {successData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={successData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {successData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <p className="text-[10px] text-gray-500 uppercase font-extrabold tracking-widest">Pass Rate</p>
                <p className="text-2xl font-extrabold text-white tracking-tight">{passRate}%</p>
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-600 font-mono">No execution records available.</p>
          )}
        </div>

        {/* Legend */}
        <div className="flex justify-center items-center gap-4 text-xs font-semibold mt-2">
          {successData.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-gray-400">{item.name} ({item.value})</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Response Time / Latency Area Chart */}
      <div className="lg:col-span-2 bg-[#0d0d0f]/60 backdrop-blur-xl border border-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-xl min-h-[300px]">
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Response Latency Profiler</h4>
          <p className="text-xs text-gray-400 mt-1">Latency distribution across endpoints (ms)</p>
        </div>

        <div className="flex-1 my-4 min-h-[160px]">
          {latencyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={latencyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="latencyGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis 
                  dataKey="path" 
                  stroke="#555" 
                  fontSize={8} 
                  tickLine={false} 
                  fontFamily="monospace"
                />
                <YAxis 
                  stroke="#555" 
                  fontSize={9} 
                  tickLine={false} 
                  fontFamily="monospace"
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="latency" 
                  name="Latency" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#latencyGlow)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-xs text-gray-600 font-mono">No latency telemetry logged.</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Status Code Breakdown Bar Chart */}
      <div className="lg:col-span-3 bg-[#0d0d0f]/60 backdrop-blur-xl border border-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-xl min-h-[220px]">
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">HTTP Status Response Groups</h4>
          <p className="text-xs text-gray-400 mt-1">Telemetry analysis of returned status categories</p>
        </div>

        <div className="flex-1 my-4 min-h-[120px]">
          {statusCodeData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusCodeData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis 
                  dataKey="code" 
                  stroke="#555" 
                  fontSize={10} 
                  tickLine={false} 
                  fontFamily="monospace"
                />
                <YAxis 
                  stroke="#555" 
                  fontSize={10} 
                  tickLine={false} 
                  fontFamily="monospace"
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Frequency" radius={[4, 4, 0, 0]}>
                  {statusCodeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-xs text-gray-600 font-mono">No status code categories returned.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
