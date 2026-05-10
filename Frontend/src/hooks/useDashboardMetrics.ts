import { useState, useEffect } from 'react';

export interface KPIData {
  totalProjects: number;
  importedEndpoints: number;
  totalTestRuns: number;
  queueSize: number;
  successRate: number;
  avgResponseTime: number;
}

export interface WorkerData {
  id: string;
  status: 'active' | 'idle';
  cpu: number;
  mem: number;
  currentTask: string;
}

export interface InsightData {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

export interface FailedEndpoint {
  url: string;
  method: string;
  failRate: number;
  totalFails: number;
}

export interface TestRun {
  id: string;
  project: string;
  status: 'passed' | 'failed' | 'running';
  time: string;
  duration: string;
}

export interface ChartData {
  time: string;
  pass: number;
  fail: number;
  avg: number;
  p95: number;
}

export const useDashboardMetrics = () => {
  const [kpis, setKpis] = useState<KPIData>({
    totalProjects: 14,
    importedEndpoints: 1248,
    totalTestRuns: 8934,
    queueSize: 45,
    successRate: 94.2,
    avgResponseTime: 214,
  });

  const [execution, setExecution] = useState({
    completed: 65,
    pending: 25,
    inProgress: 8,
    failed: 2,
  });

  const [workers, setWorkers] = useState<WorkerData[]>([
    { id: 'W-01', status: 'active', cpu: 45, mem: 60, currentTask: 'Auth Tests' },
    { id: 'W-02', status: 'active', cpu: 78, mem: 80, currentTask: 'Payment Flow' },
    { id: 'W-03', status: 'idle', cpu: 5, mem: 20, currentTask: '-' },
    { id: 'W-04', status: 'active', cpu: 62, mem: 55, currentTask: 'Role Checks' },
  ]);

  const [queueHealth, setQueueHealth] = useState({
    throughput: 120,
    pending: 45,
    avgDelay: 1.2,
  });

  const [analytics, setAnalytics] = useState<ChartData[]>(
    Array.from({ length: 20 }).map((_, i) => ({
      time: `${new Date().getHours()}:${new Date().getMinutes() - 20 + i}`,
      pass: Math.floor(Math.random() * 80) + 20,
      fail: Math.floor(Math.random() * 20),
      avg: Math.floor(Math.random() * 100) + 150,
      p95: Math.floor(Math.random() * 200) + 250,
    }))
  );

  const [insights] = useState<InsightData[]>([
    { id: '1', title: 'Anomaly Detected', description: 'Unusual spike in 500 errors on /api/payment', severity: 'critical', timestamp: '2m ago' },
    { id: '2', title: 'Missing Roles', description: '3 endpoints lack Role-Based Access tests', severity: 'high', timestamp: '15m ago' },
    { id: '3', title: 'Performance Degradation', description: '/api/users response time increased by 40%', severity: 'medium', timestamp: '1h ago' },
  ]);

  const [failedEndpoints, setFailedEndpoints] = useState<FailedEndpoint[]>([
    { url: '/api/v1/auth/login', method: 'POST', failRate: 8.5, totalFails: 142 },
    { url: '/api/v1/payments/process', method: 'POST', failRate: 6.2, totalFails: 89 },
    { url: '/api/v1/users/profile', method: 'GET', failRate: 4.1, totalFails: 45 },
    { url: '/api/v1/reports/export', method: 'GET', failRate: 3.8, totalFails: 34 },
  ]);

  const [recentRuns, setRecentRuns] = useState<TestRun[]>([
    { id: 'TR-8934', project: 'Core API', status: 'running', time: 'Just now', duration: '45s' },
    { id: 'TR-8933', project: 'Billing Service', status: 'passed', time: '5m ago', duration: '2m 14s' },
    { id: 'TR-8932', project: 'Auth Gateway', status: 'failed', time: '12m ago', duration: '1m 05s' },
    { id: 'TR-8931', project: 'Core API', status: 'passed', time: '28m ago', duration: '3m 42s' },
  ]);

  const [coverage] = useState({
    total: 1248,
    untested: 142,
    methods: [
      { name: 'GET', value: 450, color: '#3b82f6' },
      { name: 'POST', value: 380, color: '#10b981' },
      { name: 'PUT', value: 210, color: '#f59e0b' },
      { name: 'DELETE', value: 208, color: '#ef4444' },
    ]
  });

  const [systemHealth] = useState([
    { service: 'API Gateway', status: 'healthy', uptime: '99.9%' },
    { service: 'Redis Cache', status: 'healthy', uptime: '100%' },
    { service: 'PostgreSQL DB', status: 'degraded', uptime: '99.5%' },
    { service: 'Worker Nodes', status: 'healthy', uptime: '99.8%' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setKpis((prev) => ({
        ...prev,
        queueSize: Math.max(0, prev.queueSize + (Math.floor(Math.random() * 5) - 2)),
        avgResponseTime: Math.max(100, prev.avgResponseTime + (Math.floor(Math.random() * 20) - 10)),
        successRate: Math.max(85, Math.min(100, +(prev.successRate + (Math.random() * 0.4 - 0.2)).toFixed(1))),
      }));

      setWorkers((prev) =>
        prev.map((w) => ({
          ...w,
          cpu: w.status === 'active' ? Math.max(10, Math.min(100, w.cpu + (Math.floor(Math.random() * 15) - 7))) : Math.max(1, w.cpu - 5),
          mem: w.status === 'active' ? Math.max(20, Math.min(95, w.mem + (Math.floor(Math.random() * 10) - 5))) : w.mem,
        }))
      );

      setQueueHealth((prev) => ({
        throughput: Math.max(50, prev.throughput + (Math.floor(Math.random() * 20) - 10)),
        pending: Math.max(0, prev.pending + (Math.floor(Math.random() * 10) - 5)),
        avgDelay: Math.max(0.1, +(prev.avgDelay + (Math.random() * 0.4 - 0.2)).toFixed(1)),
      }));

      setAnalytics((prev) => {
        const newTime = new Date();
        const next = [...prev.slice(1)];
        next.push({
          time: `${newTime.getHours()}:${newTime.getMinutes()}:${newTime.getSeconds()}`,
          pass: Math.floor(Math.random() * 80) + 20,
          fail: Math.floor(Math.random() * 20),
          avg: Math.floor(Math.random() * 100) + 150,
          p95: Math.floor(Math.random() * 200) + 250,
        });
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return {
    kpis,
    execution,
    workers,
    queueHealth,
    analytics,
    insights,
    failedEndpoints,
    recentRuns,
    coverage,
    systemHealth,
  };
};