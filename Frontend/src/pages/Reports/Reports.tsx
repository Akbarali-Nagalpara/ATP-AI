import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Bot, AlertTriangle, CheckCircle2, ShieldAlert, Lightbulb, Clock, BarChart3 } from 'lucide-react';

const reports = [
  {
    id: 'R-211', run: 'TR-8933', project: 'Billing Service', generatedAt: '5m ago',
    passRate: 98.4, coveragePercent: 91.2, aiInsights: 3,
    summaryText: 'All payment endpoints passed with 98.4% success rate. Minor schema drift detected in /payments/refund.',
    insights: [
      { type: 'anomaly', severity: 'medium', title: 'Schema drift in /payments/refund', description: 'Response body includes an undocumented refund_fee field not present in the OpenAPI spec.' },
      { type: 'gap', severity: 'high', title: 'Missing role coverage', description: '2 endpoints only tested with Admin role. Client and Company roles not exercised.' },
      { type: 'recommendation', severity: 'low', title: 'Rate limit headers missing', description: 'X-RateLimit-Remaining not returned on POST /payments/process.' },
    ]
  },
  {
    id: 'R-210', run: 'TR-8931', project: 'Core API', generatedAt: '28m ago',
    passRate: 95.9, coveragePercent: 100, aiInsights: 2,
    summaryText: 'Full endpoint coverage achieved. 6 failures due to stale auth tokens — auto-refresh recommended.',
    insights: [
      { type: 'security', severity: 'high', title: 'JWT tokens not refreshed', description: '6 test failures caused by expired JWT tokens. Implement automatic token refresh logic.' },
      { type: 'recommendation', severity: 'low', title: 'Slow endpoint detected', description: '/api/v1/reports/export p95 latency is 1.2s — consider pagination or async export.' },
    ]
  },
];

const insightIcons = {
  anomaly: AlertTriangle,
  gap: ShieldAlert,
  security: ShieldAlert,
  recommendation: Lightbulb,
};

const severityColors = {
  critical: 'text-red-400 border-l-red-500',
  high:     'text-[#f97316] border-l-[#f97316]',
  medium:   'text-yellow-400 border-l-yellow-500',
  low:      'text-blue-400 border-l-blue-500',
};

export const Reports = () => {
  return (
    <div className="max-w-[1400px] mx-auto space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Reports', value: reports.length, color: 'text-white', sub: 'generated this week' },
          { label: 'Avg Pass Rate', value: '97.1%', color: 'text-emerald-400', sub: 'across all runs' },
          { label: 'AI Insights', value: reports.reduce((a, r) => a + r.aiInsights, 0), color: 'text-[#f97316]', sub: 'total findings' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[#666] text-xs mt-1">{s.label}</div>
            <div className="text-[#555] text-[10px] mt-0.5">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {reports.map((report, i) => (
        <motion.div
          key={report.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="bg-[#111] border border-[#1f1f1f] rounded-xl overflow-hidden"
        >
          {/* Report header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f1f1f]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#f97316]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold text-sm">{report.project}</span>
                  <span className="font-mono text-xs text-[#666]">{report.id}</span>
                  <span className="font-mono text-xs text-[#555]">← {report.run}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#666] text-xs mt-0.5">
                  <Clock className="w-3 h-3" /> Generated {report.generatedAt}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <div className="text-sm font-bold text-emerald-400">{report.passRate}%</div>
                <div className="text-[10px] text-[#666]">Pass Rate</div>
              </div>
              <div className="text-right hidden md:block">
                <div className="text-sm font-bold text-blue-400">{report.coveragePercent}%</div>
                <div className="text-[10px] text-[#666]">Coverage</div>
              </div>
              <button className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#f97316]/40 text-[#aaa] hover:text-white px-3 py-1.5 rounded-lg text-xs transition-all">
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="px-5 py-4 border-b border-[#1f1f1f]">
            <p className="text-[#aaa] text-sm leading-relaxed">{report.summaryText}</p>
          </div>

          {/* AI Insights */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-4 h-4 text-[#f97316]" />
              <span className="text-white font-medium text-sm">AI Insights</span>
              <span className="text-[10px] bg-[#f97316]/10 border border-[#f97316]/20 text-[#f97316] px-2 py-0.5 rounded-full font-semibold">{report.insights.length} findings</span>
            </div>
            <div className="space-y-3">
              {report.insights.map((insight, j) => {
                const Icon = insightIcons[insight.type as keyof typeof insightIcons] ?? Lightbulb;
                const col = severityColors[insight.severity as keyof typeof severityColors];
                return (
                  <div key={j} className={`bg-[#0d0d0d] border-l-2 border border-[#1f1f1f] rounded-r-lg p-3 pl-4 ${col}`}>
                    <div className="flex items-start gap-3">
                      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${col.split(' ')[0]}`} />
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-white text-sm font-semibold">{insight.title}</span>
                          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${col.split(' ')[0]} border-current bg-current/10`}>{insight.severity}</span>
                        </div>
                        <p className="text-[#888] text-xs leading-relaxed">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
