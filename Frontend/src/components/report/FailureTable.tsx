import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, ChevronDown, ChevronUp, ChevronRight, Eye, 
  CheckCircle, XCircle, AlertTriangle, Shield, Clock, HelpCircle,
  ChevronLeft, RefreshCcw
} from 'lucide-react';
import { Endpoint } from '../../store/useAppStore';

interface FailureTableProps {
  endpoints: Endpoint[];
  onInspect: (endpoint: Endpoint) => void;
}

type SortField = 'path' | 'method' | 'role' | 'status' | 'statusCode' | 'responseTime';
type SortOrder = 'asc' | 'desc';

export const FailureTable: React.FC<FailureTableProps> = ({ endpoints, onInspect }) => {
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL'); // ALL, Pass, Fail
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  
  // Sorting state
  const [sortField, setSortField] = useState<SortField>('status');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Expanded rows state (for failure summaries)
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setMethodFilter('ALL');
    setStatusFilter('ALL');
    setRoleFilter('ALL');
    setCurrentPage(1);
  };

  // Extract unique roles for the filter dropdown
  const uniqueRoles = useMemo(() => {
    return ['ALL', ...new Set(endpoints.map(ep => ep.role).filter(Boolean))];
  }, [endpoints]);

  // Sort & Filter logic - Memoized to prevent duplicate processing / rerender issues
  const filteredAndSortedEndpoints = useMemo(() => {
    let result = [...endpoints];

    // 1. Search Query filter (checks path and method)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(ep => 
        ep.path.toLowerCase().includes(query) || 
        ep.role.toLowerCase().includes(query) ||
        (ep.statusCode && String(ep.statusCode).includes(query))
      );
    }

    // 2. Method filter
    if (methodFilter !== 'ALL') {
      result = result.filter(ep => ep.method === methodFilter);
    }

    // 3. Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter(ep => ep.status === statusFilter);
    }

    // 4. Role filter
    if (roleFilter !== 'ALL') {
      result = result.filter(ep => ep.role === roleFilter);
    }

    // 5. Sorting
    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      // Handle null/undefined values
      if (aVal === undefined || aVal === null) aVal = '';
      if (bVal === undefined || bVal === null) bVal = '';

      if (sortField === 'responseTime') {
        aVal = Number(a.responseTime) || 0;
        bVal = Number(b.responseTime) || 0;
      }
      if (sortField === 'statusCode') {
        aVal = Number(a.statusCode) || 0;
        bVal = Number(b.statusCode) || 0;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [endpoints, searchQuery, methodFilter, statusFilter, roleFilter, sortField, sortOrder]);

  // Pagination logic
  const totalItems = filteredAndSortedEndpoints.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  
  // Safe page range adjustment
  const currentPageSafe = Math.min(currentPage, totalPages);

  const paginatedEndpoints = useMemo(() => {
    const startIndex = (currentPageSafe - 1) * pageSize;
    return filteredAndSortedEndpoints.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedEndpoints, currentPageSafe, pageSize]);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Status Styling: 2xx Green, 4xx Orange, 5xx Red
  const getStatusBadgeStyles = (status: string, statusCode?: number) => {
    if (status === 'Pending' || status === 'Queued' || status === 'Running') {
      return 'text-gray-400 bg-white/[0.03] border-white/10';
    }
    if (!statusCode) {
      return status === 'Pass' 
        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
        : 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    }

    if (statusCode >= 200 && statusCode < 300) {
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    } else if (statusCode >= 400 && statusCode < 500) {
      return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    } else if (statusCode >= 500) {
      return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    }
    return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
  };

  const getMethodBadgeStyles = (method: string) => {
    switch (method) {
      case 'GET': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'POST': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'PUT': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'DELETE': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'PATCH': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="flex flex-col bg-[#0d0d0f]/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
      {/* Control Bar: Search and Filters */}
      <div className="p-5 border-b border-white/5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white/[0.01]">
        {/* Search */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by path, status code, role..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#121214] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-white/10 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Method Filter */}
          <div className="flex items-center gap-1.5 bg-[#121214] border border-white/5 px-3 py-1.5 rounded-xl text-xs text-gray-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={methodFilter}
              onChange={(e) => {
                setMethodFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none text-gray-300 focus:outline-none pr-2 cursor-pointer font-medium"
            >
              <option value="ALL" className="bg-[#121214]">All Methods</option>
              <option value="GET" className="bg-[#121214]">GET</option>
              <option value="POST" className="bg-[#121214]">POST</option>
              <option value="PUT" className="bg-[#121214]">PUT</option>
              <option value="DELETE" className="bg-[#121214]">DELETE</option>
              <option value="PATCH" className="bg-[#121214]">PATCH</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-[#121214] border border-white/5 px-3 py-1.5 rounded-xl text-xs text-gray-400">
            <CheckCircle className="w-3.5 h-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none text-gray-300 focus:outline-none pr-2 cursor-pointer font-medium"
            >
              <option value="ALL" className="bg-[#121214]">All Statuses</option>
              <option value="Pass" className="bg-[#121214]">Passed (2xx)</option>
              <option value="Fail" className="bg-[#121214]">Failed (4xx/5xx)</option>
            </select>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-1.5 bg-[#121214] border border-white/5 px-3 py-1.5 rounded-xl text-xs text-gray-400">
            <Shield className="w-3.5 h-3.5" />
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none text-gray-300 focus:outline-none pr-2 cursor-pointer font-medium"
            >
              {uniqueRoles.map((role) => (
                <option key={role} value={role} className="bg-[#121214]">
                  {role === 'ALL' ? 'All Roles' : role}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {(searchQuery || methodFilter !== 'ALL' || statusFilter !== 'ALL' || roleFilter !== 'ALL') && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl transition-all"
            >
              <RefreshCcw className="w-3.5 h-3.5 animate-spin-hover" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-sm text-gray-400 border-collapse table-fixed min-w-[900px]">
          <thead className="bg-[#101012] text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 sticky top-0 z-10">
            <tr>
              <th className="w-[50px] px-6 py-4"></th>
              <th 
                className="w-[120px] px-6 py-4 cursor-pointer hover:text-gray-300 transition-colors select-none"
                onClick={() => handleSort('method')}
              >
                <div className="flex items-center gap-1">
                  Method
                  {sortField === 'method' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                </div>
              </th>
              <th 
                className="px-6 py-4 cursor-pointer hover:text-gray-300 transition-colors select-none"
                onClick={() => handleSort('path')}
              >
                <div className="flex items-center gap-1">
                  Endpoint Path
                  {sortField === 'path' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                </div>
              </th>
              <th 
                className="w-[180px] px-6 py-4 cursor-pointer hover:text-gray-300 transition-colors select-none"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center gap-1">
                  Auth Role
                  {sortField === 'role' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                </div>
              </th>
              <th 
                className="w-[120px] px-6 py-4 cursor-pointer hover:text-gray-300 transition-colors select-none"
                onClick={() => handleSort('statusCode')}
              >
                <div className="flex items-center gap-1">
                  Status
                  {sortField === 'statusCode' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                </div>
              </th>
              <th 
                className="w-[120px] px-6 py-4 cursor-pointer hover:text-gray-300 transition-colors select-none"
                onClick={() => handleSort('responseTime')}
              >
                <div className="flex items-center gap-1">
                  Latency
                  {sortField === 'responseTime' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                </div>
              </th>
              <th className="w-[120px] px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-white/5">
            {paginatedEndpoints.map((ep) => {
              const isExpanded = !!expandedRows[ep.id];
              const isFailed = ep.status === 'Fail';
              
              // failure message based on status code
              let failureReason = 'Request succeeded with correct assertions.';
              if (ep.statusCode === 403) {
                failureReason = 'Role mismatch: Received HTTP 403 Forbidden. Auth token lacks correct permissions for roles configured in endpoint middleware.';
              } else if (ep.statusCode === 500) {
                failureReason = 'Internal Server Error: Unhandled exception on backend. Potential null pointer or DB exception during query execution.';
              } else if (ep.statusCode === 404) {
                failureReason = 'Not Found: Endpoint returned HTTP 404. Path routing mismatch or missing resource identifier.';
              } else if (isFailed) {
                failureReason = `Failed assertions: Server returned code ${ep.statusCode || 'unknown'} instead of expected response schema.`;
              }

              return (
                <React.Fragment key={ep.id}>
                  {/* Standard Row */}
                  <tr className={`hover:bg-white/[0.02] transition-colors duration-150 group ${isExpanded ? 'bg-white/[0.01]' : ''}`}>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => toggleRow(ep.id)}
                        className="p-1 hover:bg-white/10 rounded-lg text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${getMethodBadgeStyles(ep.method)}`}>
                        {ep.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-[13px] text-gray-300 truncate" title={ep.path}>
                      {ep.path}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-lg">
                        <Shield className="w-3 h-3 text-amber-500" />
                        {ep.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadgeStyles(ep.status, ep.statusCode)}`}>
                        {ep.status === 'Pass' ? (
                          <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                        ) : ep.status === 'Fail' ? (
                          <XCircle className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                        )}
                        {ep.statusCode || ep.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-400">
                      {ep.responseTime ? (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-500" />
                          {ep.responseTime}ms
                        </div>
                      ) : (
                        '--'
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onInspect(ep)}
                        className="inline-flex items-center gap-1.5 bg-[#121214] border border-white/5 hover:bg-white/5 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect
                      </button>
                    </td>
                  </tr>

                  {/* Expandable Diagnostic Drawer inside Row */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="p-0 border-none">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="overflow-hidden bg-[#0a0a0c]/60 border-l-2 border-rose-500/40"
                          >
                            <div className="px-16 py-5 space-y-4">
                              <div className="flex flex-col md:flex-row gap-5 items-start justify-between">
                                <div className="space-y-1.5 flex-1">
                                  <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                                    Failure Diagnosis
                                  </h5>
                                  <p className="text-sm text-gray-300 leading-relaxed font-medium">
                                    {failureReason}
                                  </p>
                                </div>

                                {isFailed && (
                                  <div className="shrink-0 flex items-center gap-3">
                                    <button
                                      onClick={() => onInspect(ep)}
                                      className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-colors"
                                    >
                                      Inspect AI Suggestions
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {/* Empty State */}
        {totalItems === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <HelpCircle className="w-12 h-12 mb-3 opacity-20 text-gray-400" />
            <p className="font-semibold text-gray-400">No endpoints found matching filters.</p>
            <button 
              onClick={handleResetFilters}
              className="mt-3 text-[#e32636] hover:underline text-xs font-medium"
            >
              Clear filters and search
            </button>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400 bg-white/[0.005]">
          <div className="flex items-center gap-4">
            <span>
              Showing <strong className="text-gray-200">{Math.min(totalItems, (currentPageSafe - 1) * pageSize + 1)}</strong> to{' '}
              <strong className="text-gray-200">{Math.min(totalItems, currentPageSafe * pageSize)}</strong> of{' '}
              <strong className="text-gray-200">{totalItems}</strong> entries
            </span>
            <div className="flex items-center gap-1.5 bg-[#121214] border border-white/5 px-2 py-1 rounded-lg">
              <span className="text-[10px] text-gray-500">Show:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-transparent border-none text-gray-300 focus:outline-none cursor-pointer font-bold"
              >
                <option value="5" className="bg-[#121214]">5</option>
                <option value="10" className="bg-[#121214]">10</option>
                <option value="20" className="bg-[#121214]">20</option>
                <option value="50" className="bg-[#121214]">50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPageSafe === 1}
              className="p-2 bg-[#121214] border border-white/5 rounded-xl text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              const isSelected = pageNum === currentPageSafe;
              
              // Limit visible page numbers
              if (totalPages > 5 && Math.abs(pageNum - currentPageSafe) > 1 && pageNum !== 1 && pageNum !== totalPages) {
                if (pageNum === 2 || pageNum === totalPages - 1) {
                  return <span key={pageNum} className="px-1 text-gray-600">...</span>;
                }
                return null;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                    isSelected
                      ? 'bg-[var(--color-primary)] text-white shadow-lg'
                      : 'bg-[#121214] border border-white/5 text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPageSafe === totalPages}
              className="p-2 bg-[#121214] border border-white/5 rounded-xl text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
