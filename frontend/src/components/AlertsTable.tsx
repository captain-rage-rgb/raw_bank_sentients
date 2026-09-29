'use client';

import React, { useState } from 'react';
import { AlertItem } from '@/types';
import {
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  AlertTriangle,
  Info,
  Clock,
  Eye
} from 'lucide-react';

interface AlertsTableProps {
  alerts: AlertItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  isLoading: boolean;
  selectedSeverity: string;
  selectedChannel: string;
  selectedQueue: string;
  searchTerm: string;
  onPageChange: (newPage: number) => void;
  onSeverityChange: (sev: string) => void;
  onChannelChange: (ch: string) => void;
  onQueueChange: (q: string) => void;
  onSearchChange: (query: string) => void;
  onSelectTransaction: (txnId: string) => void;
  selectedTxnId?: string | null;
}

const SEVERITIES = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

const CHANNELS = [
  'ALL',
  'ILLICOCASH',
  'RAWBANK_ONLINE',
  'CARD',
  'ATM',
  'SIOP',
  'VISA_DIRECT',
  'AGENT_BANKING',
  'SWIFT_LIGHT',
  'BRANCH'
];

const QUEUES = [
  'ALL',
  'DIGITAL_FRAUD',
  'CARD_FRAUD',
  'CORPORATE_FRAUD',
  'TIER_1_FRAUD',
  'TIER_2_FRAUD'
];

export const AlertsTable: React.FC<AlertsTableProps> = ({
  alerts,
  total,
  page,
  pageSize,
  totalPages,
  isLoading,
  selectedSeverity,
  selectedChannel,
  selectedQueue,
  searchTerm,
  onPageChange,
  onSeverityChange,
  onChannelChange,
  onQueueChange,
  onSearchChange,
  onSelectTransaction,
  selectedTxnId,
}) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-red-500/20 text-red-400 border border-red-500/40 shadow-sm shadow-red-500/10">
            <Flame className="w-3 h-3" /> CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40">
            <AlertTriangle className="w-3 h-3" /> HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Info className="w-3 h-3" /> MEDIUM
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40">
            LOW
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400">
            {severity}
          </span>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-red-400 bg-red-500/10 border-red-500/30';
    if (score >= 55) return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    if (score >= 35) return 'text-amber-300 bg-amber-500/10 border-amber-500/30';
    return 'text-blue-300 bg-blue-500/10 border-blue-500/30';
  };

  return (
    <div className="rounded-xl bg-[#0F1D38] border border-[#1E2E4E] shadow-xl shadow-black/25 overflow-hidden">
      {/* Table Header & Filter Bar */}
      <div className="p-5 border-b border-[#1E2E4E] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">
                Alert Triage &amp; Case Queue
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-bold">
                {total} Pending Anomaly Events
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic scoring from rules FR-01 through FR-20 with dynamic counter-evidence deduplication
            </p>
          </div>

          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative min-w-[280px]">
            <input
              type="text"
              placeholder="Search ID, Customer, Counterparty..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-[#070D19] border border-[#1E2E4E] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E3A008] transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('');
                  onSearchChange('');
                }}
                className="absolute right-3 top-2 text-slate-400 hover:text-white text-xs font-bold"
              >
                &times;
              </button>
            )}
          </form>
        </div>

        {/* Severity Filter Tabs & Dropdowns */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Severity Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" /> Severity:
            </span>
            {SEVERITIES.map((sev) => {
              const isActive = selectedSeverity.toUpperCase() === sev;
              return (
                <button
                  key={sev}
                  onClick={() => onSeverityChange(sev)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? sev === 'CRITICAL'
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                        : sev === 'HIGH'
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                        : sev === 'MEDIUM'
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                        : sev === 'LOW'
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#E3A008] text-slate-950 font-black shadow-md shadow-[#E3A008]/20'
                      : 'bg-[#070D19] text-slate-400 hover:text-white border border-[#1E2E4E] hover:border-slate-600'
                  }`}
                >
                  {sev}
                </button>
              );
            })}
          </div>

          {/* Channel and Queue Selectors */}
          <div className="flex items-center gap-2">
            <select
              value={selectedChannel}
              onChange={(e) => onChannelChange(e.target.value)}
              className="bg-[#070D19] border border-[#1E2E4E] text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#E3A008]"
            >
              {CHANNELS.map((ch) => (
                <option key={ch} value={ch}>
                  {ch === 'ALL' ? 'All Channels' : ch.replace('_', ' ')}
                </option>
              ))}
            </select>

            <select
              value={selectedQueue}
              onChange={(e) => onQueueChange(e.target.value)}
              className="bg-[#070D19] border border-[#1E2E4E] text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#E3A008]"
            >
              {QUEUES.map((q) => (
                <option key={q} value={q}>
                  {q === 'ALL' ? 'All Analyst Queues' : q.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#070D19] text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-[#1E2E4E]">
            <tr>
              <th className="py-3.5 px-4">Transaction ID</th>
              <th className="py-3.5 px-3">Timestamp</th>
              <th className="py-3.5 px-3">Customer Entity</th>
              <th className="py-3.5 px-3">Channel / Action</th>
              <th className="py-3.5 px-3 text-right">Value (USD Equiv)</th>
              <th className="py-3.5 px-3 text-center">Alert Score</th>
              <th className="py-3.5 px-3 text-center">Severity</th>
              <th className="py-3.5 px-4">Suspected Pattern</th>
              <th className="py-3.5 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2E4E]/60">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="animate-pulse bg-[#0F1D38]">
                  <td colSpan={9} className="py-4 px-4 h-12 bg-slate-800/20" />
                </tr>
              ))
            ) : alerts.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <ShieldAlert className="w-8 h-8 text-slate-500 mb-2" />
                    <p className="font-semibold text-slate-300">No alerts found</p>
                    <p className="text-xs text-slate-500">Try adjusting your filters or search keywords.</p>
                  </div>
                </td>
              </tr>
            ) : (
              alerts.map((row) => {
                const isSelected = selectedTxnId === row.transaction_id;
                return (
                  <tr
                    key={row.transaction_id}
                    onClick={() => onSelectTransaction(row.transaction_id)}
                    className={`hover:bg-[#152445]/80 transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#152445] border-l-4 border-l-[#E3A008]' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-300">
                      {row.transaction_id}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">
                      {row.event_timestamp_local.replace('T', ' ').substring(0, 19)}
                    </td>
                    <td className="py-3.5 px-3">
                      <div>
                        <span className="font-semibold text-white block truncate max-w-[180px]">
                          {row.customer_name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span className="font-mono">{row.customer_id}</span>
                          <span>&bull;</span>
                          <span className="text-[#E3A008] font-medium">{row.customer_segment}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-slate-200 block">
                        {row.channel.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">
                        {row.channel_action}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="font-bold text-white block">
                        ${row.amount_usd_equiv.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {row.amount.toLocaleString()} {row.currency}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-black text-xs border ${getScoreColor(
                          row.alert_score
                        )}`}
                      >
                        {row.alert_score}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {getSeverityBadge(row.alert_severity)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-medium inline-block">
                        {row.alert_primary_pattern ? row.alert_primary_pattern.replace(/_/g, ' ') : 'CONTROL LIMIT'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTransaction(row.transaction_id);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#E3A008]/15 hover:bg-[#E3A008]/30 text-[#E3A008] border border-[#E3A008]/40 text-xs font-bold transition-all shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>360&deg; Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-[#1E2E4E] bg-[#070D19] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          Showing{' '}
          <strong className="text-white">
            {total === 0 ? 0 : (page - 1) * pageSize + 1}
          </strong>{' '}
          to{' '}
          <strong className="text-white">
            {Math.min(page * pageSize, total)}
          </strong>{' '}
          of <strong className="text-white">{total.toLocaleString()}</strong> flagged events
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || isLoading}
            className="p-1.5 rounded-lg bg-[#0F1D38] border border-[#1E2E4E] hover:border-slate-500 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-semibold text-slate-300 px-2">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || isLoading}
            className="p-1.5 rounded-lg bg-[#0F1D38] border border-[#1E2E4E] hover:border-slate-500 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
