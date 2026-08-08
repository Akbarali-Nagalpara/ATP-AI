import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Copy, Braces, Terminal, ShieldAlert, Zap, 
  Activity, Check, AlertCircle
} from 'lucide-react';
import { Endpoint } from '../../store/useAppStore';

interface EndpointDetailsDrawerProps {
  endpoint: Endpoint | null;
  isOpen: boolean;
  onClose: () => void;
  suggestedFix?: string; // Optional custom suggestion
}

type DrawerTab = 'overview' | 'payloads' | 'logs';

export const EndpointDetailsDrawer: React.FC<EndpointDetailsDrawerProps> = ({
  endpoint,
  isOpen,
  onClose,
  suggestedFix,
}) => {
  const [activeTab, setActiveTab] = useState<DrawerTab>('overview');
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});


  // Disable body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!endpoint) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case 'GET': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
      case 'POST': return 'text-blue-400 border-blue-500/20 bg-blue-500/10';
      case 'PUT': return 'text-orange-400 border-orange-500/20 bg-orange-500/10';
      case 'DELETE': return 'text-rose-400 border-rose-500/20 bg-rose-500/10';
      default: return 'text-purple-400 border-purple-500/20 bg-purple-500/10';
    }
  };

  const getStatusClass = (code?: number) => {
    if (!code) return 'text-gray-400 border-white/10 bg-white/[0.03]';
    if (code >= 200 && code < 300) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
    if (code >= 400 && code < 500) return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/20 bg-rose-500/10';
  };

  // Generate mock response payload or schema diff
  const mockResponsePayload = {
    error: endpoint.statusCode === 403 ? 'Forbidden' : endpoint.statusCode === 500 ? 'Internal Server Error' : 'Not Found',
    message: endpoint.statusCode === 403 
      ? 'Access denied. The access token provided has insufficient roles to reach this resource.' 
      : endpoint.statusCode === 500
      ? 'An unexpected error occurred on the server. Transaction aborted.'
      : `Cannot ${endpoint.method} ${endpoint.path}`,
    statusCode: endpoint.statusCode || 500,
    timestamp: new Date().toISOString(),
    path: endpoint.path
  };

  const mockExpectedSchema = {
    success: true,
    data: (endpoint as any).responseExample || {
      id: "uuid-v4-string",
      createdAt: "date-iso-string",
      updatedAt: "date-iso-string"
    }
  };

  // Mock execution logs
  const mockLogs = [
    { time: '12:04:11.201', type: 'info', msg: `Initializing request: ${endpoint.method} ${endpoint.path}` },
    { time: '12:04:11.205', type: 'info', msg: `Resolving DNS for host API gateway...` },
    { time: '12:04:11.215', type: 'info', msg: `Injecting active authorization token for role: [${endpoint.role}]` },
    { time: '12:04:11.222', type: 'info', msg: `Sending request headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1Ni...' }` },
    { time: '12:04:11.450', type: 'warning', msg: `Received HTTP Response: ${endpoint.statusCode || 500}` },
    { time: '12:04:11.453', type: 'error', msg: `Schema validation failed: Expected 200 OK, got ${endpoint.statusCode || 500}` },
  ];

  // Default suggested fix if none supplied
  const calculatedFix = suggestedFix || (
    endpoint.statusCode === 403 
      ? `# Remediation Plan: Resolve HTTP 403 Forbidden
The endpoint **${endpoint.path}** requires the role **${endpoint.role}**, but the request was executed with an unauthorized session token or incomplete permissions headers.

## Suggested Solution
1. Update the **role mapping middleware** to permit roles with this configuration.
2. In the controller file for routing **${endpoint.path}**, verify the decorator annotations:
\`\`\`typescript
@Roles('${endpoint.role}')
@UseGuards(JwtAuthGuard, RolesGuard)
\`\`\`
3. Verify that the client is fetching a fresh token with correct scopes before invoking this API.`
      : endpoint.statusCode === 500
      ? `# Remediation Plan: Resolve HTTP 500 Internal Error
The backend server crashed while handling **${endpoint.method} ${endpoint.path}**. This is likely due to an unhandled null pointer or database constraint failure.

## Suggested Solution
1. Add proper try-catch handlers in your route logic to avoid blowing the service thread.
2. Check if the database entity constraints match the parameters sent:
\`\`\`json
${JSON.stringify(endpoint.requestBody || {}, null, 2)}
\`\`\`
3. Check the server console stack trace for DB syntax errors or schema integrity issues.`
      : `# Remediation Plan: Resolve HTTP 404 Route Missing
The endpoint **${endpoint.path}** returned 404 Not Found. The routing controller might have a trailing slash discrepancy or mismatching route variables.

## Suggested Solution
1. Check the controller base path decorator.
2. Ensure routing variables match:
\`\`\`typescript
@Controller('v1/${endpoint.path.split('/')[1] || ''}')
\`\`\`
3. Verify the deployment gateway configurations and server routing maps.`
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Lateral Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-[#0d0d0f] border-l border-white/5 flex flex-col shadow-2xl overflow-hidden h-full"
          >
            {/* Header Section */}
            <div className="p-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0">
              <div className="space-y-1.5 max-w-[80%]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getMethodBadgeClass(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getStatusClass(endpoint.statusCode)}`}>
                    {endpoint.statusCode || 'FAILED'}
                  </span>
                  {endpoint.responseTime && (
                    <span className="text-[11px] font-mono text-gray-500">
                      {endpoint.responseTime}ms
                    </span>
                  )}
                </div>
                <h3 className="text-base font-mono font-bold text-white truncate" title={endpoint.path}>
                  {endpoint.path}
                </h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/5 bg-white/[0.005] px-6 shrink-0">
              {(['overview', 'payloads', 'logs'] as DrawerTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3.5 px-4 text-xs font-semibold uppercase tracking-wider relative transition-all -mb-px ${
                    activeTab === tab ? 'text-[var(--color-primary)] font-bold' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Scrollable Drawer Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Failure Diagnostic Alert */}
                  <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-2xl flex items-start gap-4">
                    <div className="bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20 text-rose-400 shrink-0">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-rose-400">AI Failure Reason</h4>
                      <p className="text-xs text-gray-300 leading-relaxed font-medium">
                        {endpoint.statusCode === 403 
                          ? 'Authentication / Authorization mismatch. Server returned HTTP 403 Forbidden. The assigned scope or role permissions do not permit requests to this endpoint path.'
                          : endpoint.statusCode === 500
                          ? 'Server-side crash. Received HTTP 500 Internal Server Error. The request triggers an unhandled null exception or database validation failure.'
                          : `Status check assertion failed. Returned status code ${endpoint.statusCode || 'unknown'} instead of expected 2xx schema.`}
                      </p>
                    </div>
                  </div>

                  {/* Suggested Fix Prompt Card */}
                  <div className="bg-[#121215] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
                    <div className="px-5 py-4 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-400">
                        <Zap className="w-4 h-4 fill-current" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Suggested Fix Prompt</h4>
                      </div>
                      <button
                        onClick={() => handleCopy(calculatedFix, 'suggestedFix')}
                        className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1.5 transition-colors"
                      >
                        {copiedStates['suggestedFix'] ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy prompt
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-5 font-sans text-sm text-gray-300 leading-relaxed max-h-[350px] overflow-y-auto custom-scrollbar select-text bg-[#0a0a0c]">
                      <pre className="whitespace-pre-wrap font-sans text-xs text-gray-400 leading-relaxed">
                        {calculatedFix}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'payloads' && (
                <div className="space-y-6">
                  {/* Request Payload */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Braces className="w-4 h-4" /> Request Body Details
                      </h4>
                      {endpoint.requestBody && (
                        <button
                          onClick={() => handleCopy(JSON.stringify(endpoint.requestBody, null, 2), 'reqBody')}
                          className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors"
                        >
                          {copiedStates['reqBody'] ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          Copy JSON
                        </button>
                      )}
                    </div>
                    <div className="bg-[#0a0a0c] border border-white/5 rounded-xl p-4 overflow-x-auto custom-scrollbar">
                      {endpoint.requestBody ? (
                        <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
                          <code>{JSON.stringify(endpoint.requestBody, null, 2)}</code>
                        </pre>
                      ) : (
                        <p className="text-xs text-gray-600 font-mono italic">No request body required.</p>
                      )}
                    </div>
                  </div>

                  {/* Schema Difference (Expected vs Received) */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <Activity className="w-4 h-4 text-purple-400" /> Schema Diff Visualization
                    </h4>
                    <div className="bg-[#0c0c0f] border border-purple-500/10 rounded-2xl p-5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Expected Schema</span>
                          <div className="bg-[#060608] border border-white/5 p-3 rounded-xl max-h-[160px] overflow-y-auto custom-scrollbar">
                            <pre className="text-[10px] font-mono text-gray-400 leading-normal">
                              {JSON.stringify(mockExpectedSchema, null, 2)}
                            </pre>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">Received Payload</span>
                          <div className="bg-[#060608] border border-white/5 p-3 rounded-xl max-h-[160px] overflow-y-auto custom-scrollbar">
                            <pre className="text-[10px] font-mono text-rose-300 leading-normal">
                              {JSON.stringify(mockResponsePayload, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                      
                      {/* Comparison Alert */}
                      <div className="bg-[#15121c] border border-purple-500/20 p-3.5 rounded-xl flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <div className="text-xs text-gray-300 leading-relaxed font-medium">
                          <strong className="text-purple-400">Schema Mismatch:</strong> Expected root object key <code className="text-emerald-400 font-mono font-bold">success: true</code> but server responded with an error format structure enclosing status code <code className="text-rose-400 font-mono font-bold">{endpoint.statusCode || 500}</code>.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Response Payload */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Braces className="w-4 h-4 text-amber-500" /> Response Body Details
                      </h4>
                      <button
                        onClick={() => handleCopy(JSON.stringify(mockResponsePayload, null, 2), 'resBody')}
                        className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors"
                      >
                        {copiedStates['resBody'] ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        Copy JSON
                      </button>
                    </div>
                    <div className="bg-[#0a0a0c] border border-white/5 rounded-xl p-4 overflow-x-auto custom-scrollbar max-h-56">
                      <pre className="text-xs font-mono text-amber-400/90 leading-relaxed">
                        <code>{JSON.stringify(mockResponsePayload, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'logs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-500" /> API Execution Logs
                    </h4>
                    <span className="text-[10px] text-gray-500 uppercase font-mono">Isolated Request Thread</span>
                  </div>

                  <div className="bg-[#050507] border border-white/5 rounded-2xl p-5 font-mono text-xs leading-relaxed space-y-3.5 shadow-inner">
                    {mockLogs.map((log, index) => {
                      let typeColor = 'text-gray-500';
                      let msgColor = 'text-gray-400';
                      if (log.type === 'success') {
                        typeColor = 'text-emerald-500 font-bold';
                        msgColor = 'text-emerald-400';
                      } else if (log.type === 'warning') {
                        typeColor = 'text-amber-500 font-bold';
                        msgColor = 'text-amber-400';
                      } else if (log.type === 'error') {
                        typeColor = 'text-rose-500 font-bold';
                        msgColor = 'text-rose-400 font-semibold';
                      }

                      return (
                        <div key={index} className="flex items-start gap-4">
                          <span className="text-gray-600 select-none shrink-0">[{log.time}]</span>
                          <span className={`${typeColor} shrink-0 select-none`}>{`[${log.type.toUpperCase()}]`}</span>
                          <span className={`${msgColor} break-all`}>{log.msg}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions footer */}
            <div className="p-4 border-t border-white/5 bg-white/[0.01] flex justify-end gap-3 shrink-0">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
              >
                Close Drawer
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
