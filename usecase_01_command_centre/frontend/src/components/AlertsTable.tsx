'use client';

import React, { useState } from 'react';
import { AlertItem } from '@/types';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  AlertTriangle,
  Info,
  Eye,
  ShieldAlert,
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
            <Flame className="w-3 h-3 text-[#DC2626]" /> CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF7ED] text-[#EA580C] border border-[#FDBA74]">
            <AlertTriangle className="w-3 h-3 text-[#EA580C]" /> HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]">
            <Info className="w-3 h-3 text-[#D97706]" /> MEDIUM
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
            LOW
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F1F5F9] text-[#64748B]">
            {severity}
          </span>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-[#DC2626] bg-[#FEF2F2] border-[#FECACA]';
    if (score >= 55) return 'text-[#EA580C] bg-[#FFF7ED] border-[#FDBA74]';
    if (score >= 35) return 'text-[#D97706] bg-[#FFFBEB] border-[#FDE68A]';
    return 'text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE]';
  };

  return (
    <div className="card-premium overflow-hidden">
      {/* Table Header & Filter Bar */}
      <div className="p-5 border-b border-[#E2E8F0] bg-gradient-to-b from-white to-[#F8FAFC]/50 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-[#0F172A] tracking-tight">
                Alert Triage &amp; Case Queue
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFF7ED] text-[#C2410C] border border-[#FDBA74] text-xs font-bold shadow-2xs">
                {total} Flagged Events
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1">
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
              className="w-full bg-white border border-[#CBD5E1] rounded-xl pl-9 pr-8 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF7A45] focus:ring-1 focus:ring-[#FF7A45] transition-all shadow-2xs"
            />
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('');
                  onSearchChange('');
                }}
                className="absolute right-3 top-2 text-[#94A3B8] hover:text-[#0F172A] text-xs font-bold"
              >
                &times;
              </button>
            )}
          </form>
        </div>

        {/* Severity Filter Tabs & Dropdowns */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Severity Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-[#64748B] mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-[#94A3B8]" /> Severity:
            </span>
            {SEVERITIES.map((sev) => {
              const isActive = selectedSeverity.toUpperCase() === sev;
              return (
                <button
                  key={sev}
                  onClick={() => onSeverityChange(sev)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? sev === 'CRITICAL'
                        ? 'bg-[#DC2626] text-white shadow-xs'
                        : sev === 'HIGH'
                        ? 'bg-[#EA580C] text-white shadow-xs'
                        : sev === 'MEDIUM'
                        ? 'bg-[#D97706] text-white shadow-xs'
                        : sev === 'LOW'
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'bg-[#FF7A45] text-white shadow-xs'
                      : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] hover:border-[#CBD5E1]'
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
              className="bg-white border border-[#CBD5E1] text-[#334155] text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#FF7A45] shadow-2xs font-medium"
            >
              {CHANNELS.map((ch) => (
                <option key={ch} value={ch}>
                  {ch === 'ALL' ? 'All Channels' : ch.replace(/_/g, ' ')}
                </option>
              ))}
            </select>

            <select
              value={selectedQueue}
              onChange={(e) => onQueueChange(e.target.value)}
              className="bg-white border border-[#CBD5E1] text-[#334155] text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#FF7A45] shadow-2xs font-medium"
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
        <table className="w-full text-left text-xs text-[#334155]">
          <thead className="bg-[#F8FAFC] text-[#64748B] uppercase tracking-wider text-[11px] font-bold border-b border-[#E2E8F0]">
            <tr>
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-3">Timestamp</th>
              <th className="py-3 px-3">Customer Entity</th>
              <th className="py-3 px-3">Channel / Action</th>
              <th className="py-3 px-3 text-right">Value (USD Equiv)</th>
              <th className="py-3 px-3 text-center">Score</th>
              <th className="py-3 px-3 text-center">Severity</th>
              <th className="py-3 px-4">Suspected Pattern</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="animate-pulse bg-white">
                  <td colSpan={9} className="py-4 px-4 h-12 bg-slate-100/50" />
                </tr>
              ))
            ) : alerts.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-[#64748B]">
                  <div className="flex flex-col items-center justify-center">
                    <ShieldAlert className="w-8 h-8 text-[#94A3B8] mb-2" />
                    <p className="font-bold text-[#0F172A]">No alerts found</p>
                    <p className="text-xs text-[#64748B]">Try adjusting your search query or severity filters.</p>
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
                    className={`hover:bg-[#FFF7ED]/40 transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#FFF7ED]/70 border-l-4 border-l-[#FF7A45]' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0F172A]">
                      {row.transaction_id}
                    </td>
                    <td className="py-3.5 px-3 text-[#64748B] whitespace-nowrap">
                      {row.event_timestamp_local.replace('T', ' ').substring(0, 19)}
                    </td>
                    <td className="py-3.5 px-3">
                      <div>
                        <span className="font-bold text-[#0F172A] block truncate max-w-[180px]">
                          {row.customer_name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-[#64748B]">
                          <span className="font-mono">{row.customer_id}</span>
                          <span>&bull;</span>
                          <span className="text-[#C2410C] font-semibold">{row.customer_segment}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-[#0F172A] block">
                        {row.channel.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-[#64748B] block truncate max-w-[140px]">
                        {row.channel_action}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="font-black text-[#0F172A] block">
                        ${row.amount_usd_equiv.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-[10px] text-[#64748B] block">
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
                      <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0] text-[11px] font-semibold inline-block">
                        {row.alert_primary_pattern ? row.alert_primary_pattern.replace(/_/g, ' ') : 'CONTROL LIMIT'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTransaction(row.transaction_id);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFF7ED] hover:bg-[#FFEDD5] text-[#C2410C] border border-[#FDBA74] text-xs font-bold transition-all shadow-2xs active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#EA580C]" />
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
      <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
        <div>
          Showing{' '}
          <strong className="text-[#0F172A]">
            {total === 0 ? 0 : (page - 1) * pageSize + 1}
          </strong>{' '}
          to{' '}
          <strong className="text-[#0F172A]">
            {Math.min(page * pageSize, total)}
          </strong>{' '}
          of <strong className="text-[#0F172A]">{total.toLocaleString()}</strong> flagged events
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || isLoading}
            className="p-1.5 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#94A3B8] text-[#334155] disabled:opacity-40 disabled:pointer-events-none transition-all shadow-2xs"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-bold text-[#0F172A] px-2">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || isLoading}
            className="p-1.5 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#94A3B8] text-[#334155] disabled:opacity-40 disabled:pointer-events-none transition-all shadow-2xs"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
