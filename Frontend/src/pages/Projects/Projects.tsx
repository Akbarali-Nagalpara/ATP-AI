import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen, Plus, Globe, Play, CheckCircle2, AlertTriangle,
  MoreVertical, Upload, Trash2, Edit2, ExternalLink, Clock, Tag
} from 'lucide-react';

const projects = [
  {
    id: 'p1', name: 'Core API', description: 'Main backend REST API',
    swaggerUrl: 'https://api.example.com/swagger.json', status: 'active',
    endpointCount: 145, lastRunAt: '2m ago', passRate: 94.2, roles: ['Admin', 'Client'],
    tags: ['production', 'v2']
  },
  {
    id: 'p2', name: 'Billing Service', description: 'Payment processing & subscriptions',
    swaggerUrl: 'https://billing.example.com/openapi.yaml', status: 'active',
    endpointCount: 62, lastRunAt: '15m ago', passRate: 97.8, roles: ['Admin', 'Company'],
    tags: ['billing', 'stripe']
  },
  {
    id: 'p3', name: 'Auth Gateway', description: 'JWT authentication & role management',
    swaggerUrl: 'https://auth.example.com/docs.json', status: 'active',
    endpointCount: 28, lastRunAt: '1h ago', passRate: 88.5, roles: ['Admin'],
    tags: ['auth', 'jwt']
  },
  {
    id: 'p4', name: 'Notification Service', description: 'Email, SMS, push notifications',
    swaggerUrl: 'https://notify.example.com/swagger.json', status: 'inactive',
    endpointCount: 19, lastRunAt: '3d ago', passRate: 100, roles: ['Admin', 'Client', 'Company'],
    tags: ['notifications']
  },
];

const statusColors = {
  active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  inactive: 'text-[#888] bg-[#888]/10 border-[#888]/20',
  archived: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
};

export const Projects = () => {
  const [showImport, setShowImport] = useState(false);
  const [swaggerUrl, setSwaggerUrl] = useState('');
  const [projectName, setProjectName] = useState('');

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-[#f97316]" /> Projects
          </h1>
          <p className="text-[#888] text-sm mt-1">{projects.length} projects configured · Import via Swagger/OpenAPI</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowImport(!showImport)}
            className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#f97316]/40 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            <Upload className="w-4 h-4 text-[#f97316]" /> Import Swagger
          </button>
          <button className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-[0_0_14px_rgba(249,115,22,0.35)]">
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>
      </div>

      {/* Import Swagger Panel */}
      {showImport && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111] border border-[#f97316]/20 rounded-xl p-6"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#f97316]" /> Import OpenAPI / Swagger Spec
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="text-xs text-[#888] mb-1.5 block font-medium uppercase tracking-wider">Project Name</label>
              <input
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                placeholder="e.g. Core API"
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#f97316]/50 rounded-lg px-3 py-2 text-sm text-white placeholder-[#555] outline-none transition-colors"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-[#888] mb-1.5 block font-medium uppercase tracking-wider">Swagger / OpenAPI URL</label>
              <input
                value={swaggerUrl}
                onChange={e => setSwaggerUrl(e.target.value)}
                placeholder="https://api.example.com/openapi.json"
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#f97316]/50 rounded-lg px-3 py-2 text-sm text-white placeholder-[#555] outline-none transition-colors"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all">
              <Upload className="w-3.5 h-3.5" /> Parse & Import
            </button>
            <button onClick={() => setShowImport(false)} className="text-[#888] hover:text-white px-4 py-2 text-sm transition-colors">
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-[#111] border border-[#1f1f1f] hover:border-[#2a2a2a] rounded-xl p-5 group relative overflow-hidden transition-all hover:shadow-xl hover:shadow-black/40"
          >
            {/* Hover glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f97316]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl" />

            <div className="relative z-10">
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-[#f97316]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{project.name}</h3>
                    <p className="text-[#666] text-xs mt-0.5">{project.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${statusColors[project.status as keyof typeof statusColors]}`}>
                    {project.status}
                  </span>
                  <button className="text-[#555] hover:text-white p-1 rounded transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Swagger URL */}
              <div className="flex items-center gap-2 bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-3 py-1.5 mb-4">
                <Globe className="w-3 h-3 text-[#f97316] shrink-0" />
                <span className="font-mono text-xs text-[#888] truncate">{project.swaggerUrl}</span>
                <ExternalLink className="w-3 h-3 text-[#555] shrink-0 ml-auto" />
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg p-2.5 text-center">
                  <div className="text-white font-bold text-base">{project.endpointCount}</div>
                  <div className="text-[#666] text-[10px] mt-0.5">Endpoints</div>
                </div>
                <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg p-2.5 text-center">
                  <div className={`font-bold text-base ${project.passRate >= 95 ? 'text-emerald-400' : project.passRate >= 85 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {project.passRate}%
                  </div>
                  <div className="text-[#666] text-[10px] mt-0.5">Pass Rate</div>
                </div>
                <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg p-2.5 text-center">
                  <div className="text-white font-bold text-base">{project.roles.length}</div>
                  <div className="text-[#666] text-[10px] mt-0.5">Roles</div>
                </div>
              </div>

              {/* Roles */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.roles.map(role => (
                  <span key={role} className="text-[10px] bg-[#1a1a1a] border border-[#2a2a2a] text-[#aaa] px-2 py-0.5 rounded-full">
                    {role}
                  </span>
                ))}
                {project.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-[#f97316]/10 border border-[#f97316]/20 text-[#f97316] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" />{tag}
                  </span>
                ))}
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between pt-3 border-t border-[#1f1f1f]">
                <div className="flex items-center gap-1.5 text-[#666] text-xs">
                  <Clock className="w-3 h-3" />
                  Last run {project.lastRunAt}
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-[#aaa] hover:text-white px-2.5 py-1.5 rounded-lg text-xs transition-all">
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button className="flex items-center gap-1.5 bg-[#f97316] hover:bg-[#ea580c] text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                    <Play className="w-3 h-3 fill-white" /> Run
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
