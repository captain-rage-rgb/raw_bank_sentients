'use client';

import React, { useState } from 'react';
import { CopilotTransactionItem } from '@/types';
import { Search, Flame, AlertTriangle, ShieldCheck, MapPin, CreditCard, User, SlidersHorizontal } from 'lucide-react';

interface TransactionSpotlightProps {
  transactions: CopilotTransactionItem[];
  selectedTxnId: string;
  onSelectTxn: (txnId: string) => void;
  isLoading?: boolean;
}

export const TransactionSpotlight: React.FC<TransactionSpotlightProps> = ({
  transactions,
  selectedTxnId,
  onSelectTxn,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [manualInput, setManualInput] = useState('');

  const filtered = transactions.filter((t) => {
    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();
    return (
      t.transaction_id.toLowerCase().includes(s) ||
      t.customer_name.toLowerCase().includes(s) ||
      t.customer_id.toLowerCase().includes(s) ||
      t.alert_primary_pattern.toLowerCase().includes(s)
    );
  });

  const activeTxn = transactions.find((t) => t.transaction_id === selectedTxnId) || transactions[0];

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onSelectTxn(manualInput.trim());
      setManualInput('');
    }
  };

  return (
    <div className="card-premium p-5 space-y-4">
      {/* Top Header & Selection Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">
              Target Investigation Spotlight
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#FFF7ED] text-[#C2410C] border border-[#FDBA74] text-[10px] font-bold">
              Ground Truth Telemetry
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Interrogate any flagged banking transaction using natural language forensic inquiries
          </p>
        </div>

        {/* Transaction Selector & Manual ID Entry */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative min-w-[240px]">
            <select
              value={selectedTxnId}
              onChange={(e) => onSelectTxn(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#0F172A] focus:outline-none focus:border-[#FF7A45] shadow-2xs cursor-pointer"
            >
              {transactions.map((t) => (
                <option key={t.transaction_id} value={t.transaction_id}>
                  {t.transaction_id} &bull; {t.customer_name} ({t.alert_severity} - Score {t.alert_score})
                </option>
              ))}
            </select>
          </div>

          {/* Manual Input Form */}
          <form onSubmit={handleManualSubmit} className="flex items-center gap-1.5">
            <input
              type="text"
              placeholder="Or type TXN ID..."
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="w-32 bg-white border border-[#CBD5E1] rounded-xl px-2.5 py-2 text-xs font-mono text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#FF7A45]"
            />
            <button
              type="submit"
              disabled={!manualInput.trim()}
              className="px-3 py-2 rounded-xl bg-[#FFF7ED] hover:bg-[#FFEDD5] text-[#C2410C] border border-[#FDBA74] text-xs font-bold transition-all disabled:opacity-40"
            >
              Load
            </button>
          </form>
        </div>
      </div>

      {/* Active Telemetry Spotlight Card */}
      {activeTxn && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-white via-[#FFF7ED]/30 to-[#FFF7ED]/50 border border-[#FED7AA] shadow-2xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-[#64748B] block font-medium">Transaction ID</span>
              <strong className="font-mono font-bold text-[#0F172A] text-xs block truncate">
                {activeTxn.transaction_id}
              </strong>
            </div>

            <div>
              <span className="text-[10px] text-[#64748B] block font-medium">Customer Profile</span>
              <strong className="font-bold text-[#0F172A] block truncate" title={activeTxn.customer_name}>
                {activeTxn.customer_name}
              </strong>
              <span className="text-[10px] text-[#C2410C] font-semibold">{activeTxn.customer_segment}</span>
            </div>

            <div>
              <span className="text-[10px] text-[#64748B] block font-medium">Amount Equivalent</span>
              <strong className="font-black text-[#0F172A] text-xs block">
                ${activeTxn.amount_usd_equiv.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </strong>
            </div>

            <div>
              <span className="text-[10px] text-[#64748B] block font-medium">Channel &amp; City</span>
              <strong className="font-bold text-[#0F172A] block truncate">
                {activeTxn.channel.replace(/_/g, ' ')}
              </strong>
              <span className="text-[10px] text-[#64748B]">{activeTxn.city || 'Kinshasa'}</span>
            </div>

            <div>
              <span className="text-[10px] text-[#64748B] block font-medium">Alert Score / Severity</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                    activeTxn.alert_severity === 'CRITICAL'
                      ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'
                      : activeTxn.alert_severity === 'HIGH'
                      ? 'bg-[#FFF7ED] text-[#EA580C] border-[#FDBA74]'
                      : 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]'
                  }`}
                >
                  {activeTxn.alert_severity}
                </span>
                <span className="font-mono font-bold text-[#0F172A] text-[11px]">
                  {activeTxn.alert_score}/100
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-[#64748B] block font-medium">Suspected Pattern</span>
              <strong className="font-semibold text-[#0F172A] block truncate text-[11px] mt-0.5" title={activeTxn.alert_primary_pattern}>
                {activeTxn.alert_primary_pattern ? activeTxn.alert_primary_pattern.replace(/_/g, ' ') : 'CONTROL LIMIT'}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
