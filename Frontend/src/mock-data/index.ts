// ─── PROJECTS ──────────────────────────────────────────────────────────────
export const MOCK_PROJECTS = [
  { id: 'p1', name: 'Core API', description: 'Main backend REST API', swaggerUrl: 'https://api.example.com/swagger.json', status: 'active', endpointCount: 145, lastRunAt: '2m ago', passRate: 94.2, roles: ['Admin', 'Client'], tags: ['production', 'v2'] },
  { id: 'p2', name: 'Billing Service', description: 'Payment processing & subscriptions', swaggerUrl: 'https://billing.example.com/openapi.yaml', status: 'active', endpointCount: 62, lastRunAt: '15m ago', passRate: 97.8, roles: ['Admin', 'Company'], tags: ['billing', 'stripe'] },
  { id: 'p3', name: 'Auth Gateway', description: 'JWT authentication & role management', swaggerUrl: 'https://auth.example.com/docs.json', status: 'active', endpointCount: 28, lastRunAt: '1h ago', passRate: 88.5, roles: ['Admin'], tags: ['auth', 'jwt'] },
  { id: 'p4', name: 'Notification Service', description: 'Email, SMS, push notifications', swaggerUrl: 'https://notify.example.com/swagger.json', status: 'inactive', endpointCount: 19, lastRunAt: '3d ago', passRate: 100, roles: ['Admin', 'Client', 'Company'], tags: ['notifications'] },
];

// ─── ENDPOINTS ─────────────────────────────────────────────────────────────
export const MOCK_ENDPOINTS = [
  { id: 'e1',  method: 'GET',    path: '/api/v1/users',              summary: 'List all users',        requiresAuth: true,  deprecated: false, tested: true,  passRate: 98,  avgMs: 145,  project: 'Core API' },
  { id: 'e2',  method: 'POST',   path: '/api/v1/users',              summary: 'Create a user',         requiresAuth: true,  deprecated: false, tested: true,  passRate: 94,  avgMs: 212,  project: 'Core API' },
  { id: 'e3',  method: 'GET',    path: '/api/v1/users/{id}',         summary: 'Get user by ID',        requiresAuth: true,  deprecated: false, tested: true,  passRate: 100, avgMs: 98,   project: 'Core API' },
  { id: 'e4',  method: 'PUT',    path: '/api/v1/users/{id}',         summary: 'Update user',           requiresAuth: true,  deprecated: false, tested: true,  passRate: 91,  avgMs: 198,  project: 'Core API' },
  { id: 'e5',  method: 'DELETE', path: '/api/v1/users/{id}',         summary: 'Delete user',           requiresAuth: true,  deprecated: false, tested: false, passRate: 0,   avgMs: 0,    project: 'Core API' },
  { id: 'e6',  method: 'POST',   path: '/api/v1/auth/login',         summary: 'Authenticate user',     requiresAuth: false, deprecated: false, tested: true,  passRate: 88,  avgMs: 323,  project: 'Auth Gateway' },
  { id: 'e7',  method: 'POST',   path: '/api/v1/auth/refresh',       summary: 'Refresh JWT token',     requiresAuth: false, deprecated: false, tested: true,  passRate: 97,  avgMs: 122,  project: 'Auth Gateway' },
  { id: 'e8',  method: 'GET',    path: '/api/v1/payments',           summary: 'List payments',         requiresAuth: true,  deprecated: false, tested: true,  passRate: 100, avgMs: 201,  project: 'Billing Service' },
  { id: 'e9',  method: 'POST',   path: '/api/v1/payments/process',   summary: 'Process payment',       requiresAuth: true,  deprecated: false, tested: true,  passRate: 82,  avgMs: 890,  project: 'Billing Service' },
  { id: 'e10', method: 'GET',    path: '/api/v1/reports/export',     summary: 'Export test report',    requiresAuth: true,  deprecated: false, tested: true,  passRate: 76,  avgMs: 1200, project: 'Core API' },
  { id: 'e11', method: 'POST',   path: '/api/v1/notifications/send', summary: 'Send notification',     requiresAuth: true,  deprecated: true,  tested: false, passRate: 0,   avgMs: 0,    project: 'Notification Service' },
  { id: 'e12', method: 'GET',    path: '/api/v1/roles',              summary: 'List project roles',    requiresAuth: true,  deprecated: false, tested: true,  passRate: 100, avgMs: 88,   project: 'Auth Gateway' },
  { id: 'e13', method: 'POST',   path: '/api/v1/auth/send-otp',      summary: 'Send OTP to mobile',    requiresAuth: false, deprecated: false, tested: false, passRate: 0,   avgMs: 0,    project: 'Auth Gateway' },
  { id: 'e14', method: 'POST',   path: '/api/v1/auth/verify-otp',    summary: 'Verify OTP and login',  requiresAuth: false, deprecated: false, tested: false, passRate: 0,   avgMs: 0,    project: 'Auth Gateway' },
];

// ─── TEST RUNS ─────────────────────────────────────────────────────────────
export const MOCK_TEST_RUNS = [
  { id: 'TR-8934', project: 'Core API',             status: 'running',   started: 'Just now',  duration: '45s',    total: 145, done: 89,  passed: 84,  failed: 5,  role: 'Admin' },
  { id: 'TR-8933', project: 'Billing Service',      status: 'completed', started: '5m ago',    duration: '2m 14s', total: 62,  done: 62,  passed: 61,  failed: 1,  role: 'Company' },
  { id: 'TR-8932', project: 'Auth Gateway',         status: 'failed',    started: '12m ago',   duration: '1m 05s', total: 28,  done: 28,  passed: 22,  failed: 6,  role: 'Admin' },
  { id: 'TR-8931', project: 'Core API',             status: 'completed', started: '28m ago',   duration: '3m 42s', total: 145, done: 145, passed: 139, failed: 6,  role: 'Client' },
  { id: 'TR-8930', project: 'Notification Service', status: 'completed', started: '1h ago',    duration: '58s',    total: 19,  done: 19,  passed: 19,  failed: 0,  role: 'Admin' },
  { id: 'TR-8929', project: 'Billing Service',      status: 'cancelled', started: '2h ago',    duration: '12s',    total: 62,  done: 8,   passed: 8,   failed: 0,  role: 'Admin' },
];

// ─── AI INSIGHTS ───────────────────────────────────────────────────────────
export const MOCK_AI_INSIGHTS = [
  {
    id: 'i1', endpoint: '/api/v1/auth/login', category: 'security',
    title: 'Missing Invalid Password Scenario',
    description: 'No test cases cover the invalid password flow. This leaves a security gap where brute-force vectors remain untested.',
    suggestion: 'Add test cases with wrong credentials and verify 401 response with proper error message and rate limiting headers.',
    severity: 'high', confidence: 92, project: 'Auth Gateway', detectedAt: '2m ago',
  },
  {
    id: 'i2', endpoint: '/api/v1/payments/process', category: 'performance',
    title: 'Slow Response Time Detected',
    description: 'Average response time is 890ms — 3x above platform baseline. This may indicate N+1 queries or unoptimized DB calls.',
    suggestion: 'Profile the endpoint with explain-analyze on DB queries. Consider caching frequently accessed payment data.',
    severity: 'high', confidence: 88, project: 'Billing Service', detectedAt: '8m ago',
  },
  {
    id: 'i3', endpoint: '/api/v1/users/{id}', category: 'coverage',
    title: 'Missing Role Coverage',
    description: '3 endpoints are only tested with Admin role. Client and Company roles are not exercised, leaving authorization untested.',
    suggestion: 'Create dedicated test scenarios for each configured role and verify expected access control behavior.',
    severity: 'medium', confidence: 95, project: 'Core API', detectedAt: '15m ago',
  },
  {
    id: 'i4', endpoint: '/api/v1/payments/refund', category: 'schema',
    title: 'Schema Drift Detected',
    description: 'Response body contains an undocumented refund_fee field not present in the OpenAPI spec. This may cause client breakage.',
    suggestion: 'Update the OpenAPI spec to include refund_fee, or remove the field from the response if it was added by mistake.',
    severity: 'medium', confidence: 97, project: 'Billing Service', detectedAt: '30m ago',
  },
  {
    id: 'i5', endpoint: '/api/v1/reports/export', category: 'performance',
    title: 'High p95 Latency on Export',
    description: 'p95 latency is 1.2s for report exports. For large datasets this will degrade UX significantly.',
    suggestion: 'Implement async export with polling, or add pagination. Consider streaming the response for large payloads.',
    severity: 'low', confidence: 84, project: 'Core API', detectedAt: '1h ago',
  },
  {
    id: 'i6', endpoint: '/api/v1/auth/refresh', category: 'security',
    title: 'Token Rotation Not Verified',
    description: 'Token refresh endpoint does not appear to invalidate the old token. This could allow replay attacks on expired tokens.',
    suggestion: 'Add test cases that verify old tokens are rejected after refresh and that new tokens are issued correctly.',
    severity: 'critical', confidence: 91, project: 'Auth Gateway', detectedAt: '2h ago',
  },
];

// ─── LOGS ──────────────────────────────────────────────────────────────────
export const MOCK_LOGS = [
  { id: 'l1',  ts: '21:54:02.312', level: 'info',    source: 'gateway', msg: 'Request received: POST /api/v1/auth/login from 10.0.0.12' },
  { id: 'l2',  ts: '21:54:02.318', level: 'info',    source: 'auth',    msg: 'JWT token validated for user admin@atp.ai' },
  { id: 'l3',  ts: '21:54:02.455', level: 'info',    source: 'worker',  msg: '[W-01] Starting test batch — 145 endpoints queued' },
  { id: 'l4',  ts: '21:54:02.502', level: 'debug',   source: 'ai',      msg: 'AI model deepseek-r1:7b initialized. Context window: 32k tokens' },
  { id: 'l5',  ts: '21:54:03.112', level: 'info',    source: 'worker',  msg: '[W-01] GET /api/v1/users → 200 OK (145ms)' },
  { id: 'l6',  ts: '21:54:03.245', level: 'info',    source: 'worker',  msg: '[W-02] POST /api/v1/payments/process → 200 OK (890ms)' },
  { id: 'l7',  ts: '21:54:03.401', level: 'warn',    source: 'gateway', msg: 'Rate limit approaching: 89/100 requests for client 10.0.0.12' },
  { id: 'l8',  ts: '21:54:03.677', level: 'error',   source: 'worker',  msg: '[W-01] POST /api/v1/auth/login → 401 Unauthorized (retry 1/3)' },
  { id: 'l9',  ts: '21:54:04.022', level: 'info',    source: 'ai',      msg: 'Analyzing response patterns for /api/v1/auth/login...' },
  { id: 'l10', ts: '21:54:04.311', level: 'error',   source: 'worker',  msg: '[W-01] POST /api/v1/auth/login → 401 Unauthorized (retry 2/3)' },
  { id: 'l11', ts: '21:54:04.512', level: 'info',    source: 'worker',  msg: '[W-03] GET /api/v1/users/{id} → 200 OK (98ms)' },
  { id: 'l12', ts: '21:54:04.788', level: 'warn',    source: 'ai',      msg: 'Insight detected: Missing invalid password scenario on /api/v1/auth/login' },
  { id: 'l13', ts: '21:54:05.001', level: 'error',   source: 'worker',  msg: '[W-01] POST /api/v1/auth/login → 401 Unauthorized (max retries reached)' },
  { id: 'l14', ts: '21:54:05.102', level: 'info',    source: 'gateway', msg: 'Queue flush: 34 jobs dispatched to worker pool' },
  { id: 'l15', ts: '21:54:05.445', level: 'debug',   source: 'ai',      msg: 'Confidence score calculated: 92% for security insight i1' },
  { id: 'l16', ts: '21:54:05.901', level: 'info',    source: 'worker',  msg: '[W-04] DELETE /api/v1/roles/{id} → 204 No Content (67ms)' },
  { id: 'l17', ts: '21:54:06.122', level: 'info',    source: 'gateway', msg: 'Test run TR-8934 progress: 89/145 (61.4%)' },
  { id: 'l18', ts: '21:54:06.445', level: 'warn',    source: 'worker',  msg: '[W-02] Response time degradation detected on POST /api/v1/payments/process (p95: 890ms)' },
  { id: 'l19', ts: '21:54:06.891', level: 'info',    source: 'ai',      msg: 'Generating AI report for TR-8933...' },
  { id: 'l20', ts: '21:54:07.312', level: 'info',    source: 'gateway', msg: 'Test run TR-8933 completed. Pass rate: 98.4%' },
];

// ─── REPORTS ───────────────────────────────────────────────────────────────
export const MOCK_REPORTS = [
  {
    id: 'R-211', run: 'TR-8933', project: 'Billing Service', generatedAt: '5m ago',
    passRate: 98.4, coveragePercent: 91.2, aiInsights: 3,
    summaryText: 'All payment endpoints passed with 98.4% success rate. Minor schema drift detected in /payments/refund.',
    insights: [
      { type: 'anomaly',        severity: 'medium', title: 'Schema drift in /payments/refund',  description: 'Response body includes an undocumented refund_fee field not present in the OpenAPI spec.' },
      { type: 'gap',            severity: 'high',   title: 'Missing role coverage',              description: '2 endpoints only tested with Admin role. Client and Company roles not exercised.' },
      { type: 'recommendation', severity: 'low',    title: 'Rate limit headers missing',         description: 'X-RateLimit-Remaining not returned on POST /payments/process.' },
    ],
  },
  {
    id: 'R-210', run: 'TR-8931', project: 'Core API', generatedAt: '28m ago',
    passRate: 95.9, coveragePercent: 100, aiInsights: 2,
    summaryText: 'Full endpoint coverage achieved. 6 failures due to stale auth tokens — auto-refresh recommended.',
    insights: [
      { type: 'security',       severity: 'high',   title: 'JWT tokens not refreshed',           description: '6 test failures caused by expired JWT tokens. Implement automatic token refresh logic.' },
      { type: 'recommendation', severity: 'low',    title: 'Slow endpoint detected',              description: '/api/v1/reports/export p95 latency is 1.2s — consider pagination or async export.' },
    ],
  },
];
