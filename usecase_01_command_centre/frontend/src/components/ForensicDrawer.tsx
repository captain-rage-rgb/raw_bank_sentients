'use client';

import React, { useState } from 'react';
import { TransactionDrilldown } from '@/types';
import {
  X,
  ShieldAlert,
  User,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Building,
  CreditCard,
  Lock,
  Globe,
  Radio,
  FileText,
  Flame,
  Scale,
  Check
} from 'lucide-react';

interface ForensicDrawerProps {
  transaction: TransactionDrilldown | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export const ForensicDrawer: React.FC<ForensicDrawerProps> = ({
  transaction,
  isOpen,
  onClose,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'profile' | 'telemetry'>('rules');
  const [dispositionToast, setDispositionToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAction = (actionName: string) => {
    setDispositionToast(`Case Action Logged: ${actionName} applied to ${transaction?.transaction?.transaction_id || 'Case'}`);
    setTimeout(() => setDispositionToast(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end transition-opacity">
      {/* Drawer Container */}
      <div className="w-full max-w-2xl bg-white border-l border-[#E2E8F0] h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E2E8F0] bg-gradient-to-r from-white via-[#FFF7ED]/30 to-[#FFF7ED]/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] border border-[#FDBA74] flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-5 h-5 text-[#EA580C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-black text-[#0F172A]">
                  {transaction?.transaction?.transaction_id || (isLoading ? 'Loading Transaction...' : 'Forensic Inspection')}
                </span>
                {transaction?.alert_evaluation?.alert_severity && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                      transaction.alert_evaluation.alert_severity === 'CRITICAL'
                        ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'
                        : transaction.alert_evaluation.alert_severity === 'HIGH'
                        ? 'bg-[#FFF7ED] text-[#EA580C] border-[#FDBA74]'
                        : 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]'
                    }`}
                  >
                    {transaction.alert_evaluation.alert_severity}
                  </span>
                )}
                {transaction?.alert_evaluation?.alert_score !== undefined && (
                  <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1] text-xs font-mono font-bold">
                    Score: {transaction.alert_evaluation.alert_score}/100
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                {transaction?.transaction?.timestamp ? transaction.transaction.timestamp.replace('T', ' ').substring(0, 19) : (isLoading ? 'Fetching telemetry...' : '—')}
                {transaction?.transaction?.channel ? ` • ${transaction.transaction.channel.replace(/_/g, ' ')}` : ''}
                {transaction?.transaction?.channel_action ? ` • ${transaction.transaction.channel_action}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#94A3B8] text-[#64748B] hover:text-[#0F172A] transition-colors shadow-2xs"
            title="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'rules'
                ? 'border-[#FF7A45] text-[#C2410C] bg-white font-extrabold'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>Rules &amp; Evidence ({transaction?.triggered_rules?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-[#FF7A45] text-[#C2410C] bg-white font-extrabold'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <User className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>Customer Baseline</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'telemetry'
                ? 'border-[#FF7A45] text-[#C2410C] bg-white font-extrabold'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Device &amp; Telemetry</span>
          </button>
        </div>

        {/* Action Toast */}
        {dispositionToast && (
          <div className="p-3 mx-5 mt-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
            <span>{dispositionToast}</span>
          </div>
        )}

        {/* Drawer Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          {!transaction ? (
            <div className="py-12 text-center text-[#64748B]">Loading forensic drill-down...</div>
          ) : activeTab === 'rules' ? (
            /* TAB 1: RULES & EVIDENCE */
            <div className="space-y-4">
              {/* Triggered Rules List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2.5 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-[#EA580C]" /> Triggered Deterministic Fraud Rules
                </h4>
                <div className="space-y-2">
                  {(transaction.triggered_rules || []).map((rule) => (
                    <div
                      key={rule.id}
                      className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 hover:border-[#CBD5E1] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-[#FFF7ED] text-[#C2410C] font-mono font-bold text-xs border border-[#FDBA74]">
                            {rule.id}
                          </span>
                          <span className="font-bold text-[#0F172A] text-xs">{rule.title}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-xs font-black bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                          +{rule.weight}
                        </span>
                      </div>
                      <p className="text-xs text-[#475569]">{rule.description}</p>
                      {rule.evidence_detail && (
                        <div className="text-[11px] p-2 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] font-mono">
                          {rule.evidence_detail}
                        </div>
                      )}
                      {rule.sop && (
                        <div className="text-[10px] text-[#64748B] italic">SOP: {rule.sop}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Counter-Evidence List */}
              {(transaction.counter_evidence || []).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#059669] mb-2.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#059669]" /> Identified Mitigating Counter-Evidence
                  </h4>
                  <div className="space-y-2">
                    {(transaction.counter_evidence || []).map((ce) => (
                      <div
                        key={ce.id}
                        className="p-3 rounded-xl bg-[#ECFDF5]/50 border border-[#A7F3D0] space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-[#047857]">{ce.id} &bull; {ce.title}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-black bg-[#ECFDF5] text-[#047857] border border-[#6EE7B7]">
                            -{ce.deduction}
                          </span>
                        </div>
                        <p className="text-xs text-[#334155]">{ce.observation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'profile' ? (
            /* TAB 2: CUSTOMER BASELINE */
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#0F172A]">{transaction.customer?.customer_name ?? '—'}</h4>
                    <span className="font-mono text-[#64748B]">{transaction.customer?.customer_id ?? '—'}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#FFF7ED] text-[#C2410C] border border-[#FDBA74] font-bold text-xs">
                    {transaction.customer?.customer_segment ?? 'RETAIL'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#E2E8F0]">
                  <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                    <span className="text-[#64748B] block text-[10px]">90-Day Median Amount</span>
                    <strong className="text-[#0F172A] font-bold">
                      ${(transaction.customer?.baseline_median_usd_90d ?? 0).toLocaleString()} USD
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                    <span className="text-[#64748B] block text-[10px]">30-Day Average Amount</span>
                    <strong className="text-[#0F172A] font-bold">
                      ${(transaction.customer?.baseline_avg_usd_90d ?? 0).toLocaleString()} USD
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                    <span className="text-[#64748B] block text-[10px]">Ratio to Median</span>
                    <strong className={(transaction.transaction?.amount_to_median_ratio ?? 1) >= 5 ? 'text-[#DC2626] font-black' : 'text-[#0F172A] font-bold'}>
                      {(transaction.transaction?.amount_to_median_ratio ?? 1).toFixed(2)}x
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                    <span className="text-[#64748B] block text-[10px]">KYC Risk Band</span>
                    <strong className="text-[#0F172A] font-bold">{transaction.customer?.kyc_risk_band ?? 'MEDIUM'}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                    <span className="text-[#64748B] block text-[10px]">Account Tenure</span>
                    <strong className="text-[#0F172A] font-bold">{transaction.customer?.relationship_tenure_days ?? '—'} days</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                    <span className="text-[#64748B] block text-[10px]">Historical Alerts</span>
                    <strong className="text-[#0F172A] font-bold">{transaction.customer?.historical_alert_count ?? 0} cases</strong>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 3: DEVICE & AUTH TELEMETRY */
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#64748B] text-[10px] block">Hardware Fingerprint ID</span>
                    <strong className="font-mono text-sm text-[#0F172A]">{transaction.device_and_channel?.device_id ?? '—'}</strong>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-white text-[#475569] border border-[#CBD5E1] font-semibold text-[10px]">
                    {transaction.device_and_channel?.device_os ?? '—'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#E2E8F0]">
                  <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                    <span className="text-[#64748B] block text-[10px]">Hardware Trusted</span>
                    <strong className={transaction.device_and_channel?.device_trusted_flag ? 'text-[#059669]' : 'text-[#DC2626]'}>
                      {transaction.device_and_channel?.device_trusted_flag ? 'YES (Trusted)' : 'NO (Untrusted Anomaly)'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                    <span className="text-[#64748B] block text-[10px]">Accounts on Device (30d)</span>
                    <strong className={(transaction.device_and_channel?.accounts_seen_on_device_30d ?? 0) >= 3 ? 'text-[#DC2626] font-black' : 'text-[#0F172A]'}>
                      {transaction.device_and_channel?.accounts_seen_on_device_30d ?? '—'} accounts
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                    <span className="text-[#64748B] block text-[10px]">IP Risk Score</span>
                    <strong className="text-[#0F172A] font-bold">{transaction.device_and_channel?.ip_risk_score ?? '—'}/100</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                    <span className="text-[#64748B] block text-[10px]">VPN / Commercial Proxy</span>
                    <strong className={transaction.device_and_channel?.vpn_proxy_flag ? 'text-[#DC2626] font-bold' : 'text-[#059669]'}>
                      {transaction.device_and_channel?.vpn_proxy_flag ? 'ACTIVE (Masked)' : 'DIRECT (Normal)'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                    <span className="text-[#64748B] block text-[10px]">Impossible Travel Violation</span>
                    <strong className={transaction.auth_and_security?.impossible_travel_flag ? 'text-[#DC2626] font-bold' : 'text-[#059669]'}>
                      {transaction.auth_and_security?.impossible_travel_flag
                        ? `VIOLATION (${transaction.auth_and_security?.geo_distance_from_home_km ?? '?'} km)`
                        : 'Normal velocity'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                    <span className="text-[#64748B] block text-[10px]">SIM Swap Telemetry</span>
                    <strong className={transaction.auth_and_security?.sim_swap_days_prior != null ? 'text-[#DC2626] font-bold' : 'text-[#64748B]'}>
                      {transaction.auth_and_security?.sim_swap_days_prior != null
                        ? `${transaction.auth_and_security.sim_swap_days_prior}d ago`
                        : 'None'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

          )}
        </div>

        {/* Drawer Action Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#64748B]">
            Case: <strong className="text-[#0F172A]">{transaction?.alert_evaluation?.case_id || 'NO_CASE'}</strong> &bull; Queue: <strong className="text-[#C2410C]">{transaction?.alert_evaluation?.analyst_queue || 'TRIAGE'}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAction('MARK_LEGITIMATE')}
              disabled={!transaction || isLoading}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#ECFDF5] border border-[#CBD5E1] hover:border-[#6EE7B7] text-[#047857] text-xs font-bold transition-all shadow-2xs disabled:opacity-40"
            >
              Mark Legitimate
            </button>
            <button
              onClick={() => handleAction('ESCALATE_TIER2')}
              disabled={!transaction || isLoading}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFF7ED] border border-[#CBD5E1] hover:border-[#FDBA74] text-[#C2410C] text-xs font-bold transition-all shadow-2xs disabled:opacity-40"
            >
              Escalate to Tier 2
            </button>
            <button
              onClick={() => handleAction('DEBIT_HOLD')}
              disabled={!transaction || isLoading}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF7A45] to-[#EA580C] hover:brightness-105 text-white font-bold text-xs transition-all shadow-sm active:scale-95 disabled:opacity-40"
            >
              Place Debit Hold
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
