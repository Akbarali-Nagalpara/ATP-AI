import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings as SettingsIcon, Key, Bot, Bell, Shield, Save,
  ChevronRight, Globe, Cpu, CheckCircle2, AlertTriangle, Link2
} from 'lucide-react';

const TABS = [
  { id: 'general',       icon: SettingsIcon, label: 'General'       },
  { id: 'security',      icon: Shield,       label: 'Security'      },
  { id: 'ai',            icon: Bot,          label: 'AI Models'     },
  { id: 'notifications', icon: Bell,         label: 'Notifications' },
  { id: 'integrations',  icon: Link2,        label: 'Integrations'  },
];

const AI_MODELS = [
  {
    id: 'ollama',   name: 'Ollama (Local)',   icon: Cpu,   status: 'active',
    description:    'Self-hosted LLM inference engine. Supports DeepSeek-R1, Llama, Qwen and more.',
    models:         ['deepseek-r1:7b', 'llama3:8b', 'qwen2.5:7b', 'mistral:7b'],
    latency:        '~180ms', cost: 'Free', badge: 'Default',
  },
  {
    id: 'gpt4',    name: 'GPT-4o',           icon: Globe,  status: 'inactive',
    description:    'OpenAI\'s most capable model. Best for complex reasoning and multi-step test analysis.',
    models:         ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
    latency:        '~1.2s', cost: '$0.01/1K tokens', badge: 'Cloud',
  },
  {
    id: 'claude',  name: 'Claude',           icon: Bot,    status: 'inactive',
    description:    'Anthropic\'s Claude model family. Excellent at following instructions and safety-aware analysis.',
    models:         ['claude-3-5-sonnet', 'claude-3-haiku', 'claude-3-opus'],
    latency:        '~900ms', cost: '$0.008/1K tokens', badge: 'Cloud',
  },
  {
    id: 'gemini',  name: 'Gemini',           icon: Globe,  status: 'inactive',
    description:    'Google\'s multimodal model. Strong at schema understanding and structured data analysis.',
    models:         ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash'],
    latency:        '~700ms', cost: '$0.007/1K tokens', badge: 'Cloud',
  },
];

const INPUT = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full bg-[#0a0a0a] border border-[#1a1a1a] focus:border-[#f97316]/40 rounded-xl px-3 py-2 text-[13px] text-white placeholder-[#333] outline-none transition-colors ${props.className ?? ''}`}
  />
);

const LABEL = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[10px] text-[#444] uppercase tracking-widest font-semibold block mb-1.5">{children}</label>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <LABEL>{label}</LABEL>
    {children}
  </div>
);

const SaveBtn = ({ label = 'Save Changes' }: { label?: string }) => (
  <button className="flex items-center gap-2 bg-[#f97316] hover:bg-[#fb923c] active:bg-[#ea580c] text-white px-4 py-2 rounded-xl text-[12px] font-semibold transition-all shadow-[0_0_12px_rgba(249,115,22,0.28)]">
    <Save className="w-3.5 h-3.5" /> {label}
  </button>
);

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0 ${checked ? 'bg-[#f97316]' : 'bg-[#1e1e1e] border border-[#2a2a2a]'}`}
  >
    <motion.div
      animate={{ x: checked ? 16 : 2 }}
      transition={{ type: 'spring', stiffness: 600, damping: 35 }}
      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
    />
  </button>
);

export const Settings = () => {
  const [active, setActive]     = useState('general');
  const [activeModel, setActiveModel] = useState('ollama');
  const [selectedModel, setSelectedModel] = useState<Record<string, string>>({
    ollama: 'deepseek-r1:7b', gpt4: 'gpt-4o', claude: 'claude-3-5-sonnet', gemini: 'gemini-1.5-pro',
  });
  const [notifs, setNotifs]     = useState({ email: true, slack: false, webhook: false });

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex gap-5">
        {/* Sidebar nav */}
        <div className="w-48 shrink-0">
          <div className="bg-[#0f0f0f] border border-[#161616] rounded-2xl overflow-hidden">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = active === tab.id;
              return (
                <button key={tab.id} onClick={() => setActive(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-[12.5px] transition-all border-b border-[#111] last:border-0 ${isActive ? 'text-[#f97316] bg-[#f97316]/5' : 'text-[#555] hover:text-[#ccc] hover:bg-[#141414]'}`}>
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="font-medium">{tab.label}</span>
                  </div>
                  <ChevronRight className={`w-3 h-3 transition-all ${isActive ? 'opacity-100 text-[#f97316]' : 'opacity-0'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}>

              {/* ── GENERAL ──────────────────────────────────────────── */}
              {active === 'general' && (
                <div className="bg-[#0f0f0f] border border-[#161616] rounded-2xl p-6 space-y-5">
                  <h3 className="text-white font-semibold text-[14px] border-b border-[#161616] pb-3">General Settings</h3>
                  <Field label="Platform Name">
                    <INPUT defaultValue="ATP AI" />
                    <p className="text-[#333] text-[11px] mt-1">Used in reports and notifications</p>
                  </Field>
                  <Field label="Default Swagger URL">
                    <INPUT placeholder="https://api.example.com/openapi.json" />
                    <p className="text-[#333] text-[11px] mt-1">Pre-fill for new projects</p>
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Request Timeout (ms)">
                      <INPUT defaultValue="30000" type="number" />
                    </Field>
                    <Field label="Max Parallel Workers">
                      <INPUT defaultValue="8" type="number" />
                    </Field>
                  </div>
                  <Field label="Retry Attempts">
                    <INPUT defaultValue="3" type="number" />
                    <p className="text-[#333] text-[11px] mt-1">Number of retries before marking a test as failed</p>
                  </Field>
                  <SaveBtn />
                </div>
              )}

              {/* ── SECURITY ─────────────────────────────────────────── */}
              {active === 'security' && (
                <div className="bg-[#0f0f0f] border border-[#161616] rounded-2xl p-6 space-y-5">
                  <h3 className="text-white font-semibold text-[14px] border-b border-[#161616] pb-3">Security Settings</h3>
                  <Field label="JWT Secret Key">
                    <INPUT type="password" defaultValue="supersecret" />
                    <p className="text-[#333] text-[11px] mt-1">Used to sign test session tokens</p>
                  </Field>
                  <Field label="API Rate Limit (req/min)">
                    <INPUT defaultValue="1000" type="number" />
                  </Field>
                  <div className="space-y-3">
                    {[
                      { label: 'Enforce HTTPS only', hint: 'Reject all HTTP test URLs', key: 'https' },
                      { label: 'Mask sensitive fields', hint: 'Hide passwords and tokens in logs', key: 'mask' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3">
                        <div>
                          <div className="text-[13px] text-[#ccc] font-medium">{item.label}</div>
                          <div className="text-[11px] text-[#444] mt-0.5">{item.hint}</div>
                        </div>
                        <Toggle checked={true} onChange={() => {}} />
                      </div>
                    ))}
                  </div>
                  <SaveBtn label="Save Security Settings" />
                </div>
              )}

              {/* ── AI MODELS ────────────────────────────────────────── */}
              {active === 'ai' && (
                <div className="space-y-4">
                  <div className="bg-[#0f0f0f] border border-[#161616] rounded-2xl p-5">
                    <h3 className="text-white font-semibold text-[14px] border-b border-[#161616] pb-3 mb-4">AI Engine Configuration</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {AI_MODELS.map(model => {
                        const Icon = model.icon;
                        const isActive = activeModel === model.id;
                        return (
                          <motion.button key={model.id}
                            onClick={() => setActiveModel(model.id)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`text-left p-4 rounded-2xl border transition-all ${isActive ? 'border-[#f97316]/30 bg-[#f97316]/5' : 'border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#222]'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${isActive ? 'bg-[#f97316]/10 border-[#f97316]/20' : 'bg-[#141414] border-[#1e1e1e]'}`}>
                                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#f97316]' : 'text-[#555]'}`} />
                                </div>
                                <span className={`text-[12.5px] font-semibold ${isActive ? 'text-white' : 'text-[#888]'}`}>{model.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${isActive ? 'text-[#f97316] border-[#f97316]/25 bg-[#f97316]/10' : 'text-[#444] border-[#1e1e1e]'}`}>
                                  {model.badge}
                                </span>
                                <div className={`w-1.5 h-1.5 rounded-full ${model.status === 'active' ? 'bg-emerald-400' : 'bg-[#2a2a2a]'}`} />
                              </div>
                            </div>
                            <p className={`text-[11px] leading-snug mb-3 ${isActive ? 'text-[#777]' : 'text-[#444]'}`}>{model.description}</p>
                            <div className="flex items-center gap-3 text-[10px]">
                              <span className={isActive ? 'text-[#555]' : 'text-[#333]'}>⚡ {model.latency}</span>
                              <span className={isActive ? 'text-[#555]' : 'text-[#333]'}>💰 {model.cost}</span>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Model config */}
                  {AI_MODELS.filter(m => m.id === activeModel).map(model => (
                    <div key={model.id} className="bg-[#0f0f0f] border border-[#161616] rounded-2xl p-5 space-y-4">
                      <h4 className="text-[#ccc] font-semibold text-[13px] border-b border-[#161616] pb-3 flex items-center gap-2">
                        <model.icon className="w-3.5 h-3.5 text-[#f97316]" />
                        Configure {model.name}
                        {model.status === 'active' && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium ml-auto">
                            <CheckCircle2 className="w-3 h-3" /> Connected
                          </span>
                        )}
                      </h4>
                      {model.id === 'ollama' && (
                        <Field label="Ollama Endpoint">
                          <INPUT defaultValue="http://localhost:11434" />
                        </Field>
                      )}
                      {model.id !== 'ollama' && (
                        <Field label="API Key">
                          <INPUT type="password" placeholder="sk-..." />
                          <p className="text-[#333] text-[11px] mt-1">Stored encrypted locally</p>
                        </Field>
                      )}
                      <Field label="Active Model">
                        <select
                          value={selectedModel[model.id]}
                          onChange={e => setSelectedModel(p => ({ ...p, [model.id]: e.target.value }))}
                          className="w-full bg-[#0a0a0a] border border-[#1a1a1a] focus:border-[#f97316]/40 rounded-xl px-3 py-2 text-[13px] text-white outline-none"
                        >
                          {model.models.map(m => <option key={m}>{m}</option>)}
                        </select>
                      </Field>
                      <SaveBtn label={`Save ${model.name} Settings`} />
                    </div>
                  ))}
                </div>
              )}

              {/* ── NOTIFICATIONS ────────────────────────────────────── */}
              {active === 'notifications' && (
                <div className="bg-[#0f0f0f] border border-[#161616] rounded-2xl p-6 space-y-5">
                  <h3 className="text-white font-semibold text-[14px] border-b border-[#161616] pb-3">Notification Settings</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'email',   label: 'Email Notifications',   hint: 'Send reports and alerts via email' },
                      { key: 'slack',   label: 'Slack Alerts',          hint: 'Post test results to Slack channel' },
                      { key: 'webhook', label: 'Webhook Events',        hint: 'Send POST events to custom URL' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3">
                        <div>
                          <div className="text-[13px] text-[#ccc] font-medium">{item.label}</div>
                          <div className="text-[11px] text-[#444] mt-0.5">{item.hint}</div>
                        </div>
                        <Toggle
                          checked={notifs[item.key as keyof typeof notifs]}
                          onChange={() => setNotifs(p => ({ ...p, [item.key]: !p[item.key as keyof typeof notifs] }))}
                        />
                      </div>
                    ))}
                  </div>
                  {notifs.email && (
                    <Field label="Email Address">
                      <INPUT type="email" defaultValue="admin@atp.ai" />
                    </Field>
                  )}
                  {notifs.slack && (
                    <Field label="Slack Webhook URL">
                      <INPUT placeholder="https://hooks.slack.com/services/..." />
                    </Field>
                  )}
                  {notifs.webhook && (
                    <Field label="Webhook URL">
                      <INPUT placeholder="https://your-server.com/webhook" />
                    </Field>
                  )}
                  <SaveBtn label="Save Notification Settings" />
                </div>
              )}

              {/* ── INTEGRATIONS ─────────────────────────────────────── */}
              {active === 'integrations' && (
                <div className="bg-[#0f0f0f] border border-[#161616] rounded-2xl p-6 space-y-4">
                  <h3 className="text-white font-semibold text-[14px] border-b border-[#161616] pb-3">Integrations</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'GitHub Actions',  desc: 'Trigger test runs from CI pipelines',        status: 'connected' },
                      { name: 'Jira',            desc: 'Auto-create tickets for failed test runs',   status: 'disconnected' },
                      { name: 'Datadog',         desc: 'Forward metrics and traces to Datadog',      status: 'disconnected' },
                      { name: 'PagerDuty',       desc: 'Alert on-call when critical failures occur', status: 'disconnected' },
                    ].map(int => (
                      <div key={int.name} className="flex items-center justify-between bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${int.status === 'connected' ? 'bg-emerald-400' : 'bg-[#2a2a2a]'}`} />
                          <div>
                            <div className="text-[13px] text-[#ccc] font-medium">{int.name}</div>
                            <div className="text-[11px] text-[#444]">{int.desc}</div>
                          </div>
                        </div>
                        <button className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all ${int.status === 'connected' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10' : 'text-[#555] border-[#1e1e1e] hover:text-white hover:border-[#2a2a2a]'}`}>
                          {int.status === 'connected' ? 'Connected' : 'Connect'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
