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
  MinusCircle,
  PlusCircle,
  Sparkles,
  ArrowRight,
  Send,
  Building,
  CreditCard,
  Lock,
  Globe,
  Radio,
  FileText,
  BadgeAlert,
  Flame,
  Scale
} from 'lucide-react';

import { CopilotPanel } from '@/components/CopilotPanel';

interface InvestigationDrawerProps {
  transaction: TransactionDrilldown | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export const InvestigationDrawer: React.FC<InvestigationDrawerProps> = ({
  transaction,
  isOpen,
  onClose,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'profile' | 'telemetry' | 'copilot'>('rules');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end transition-opacity">
      {/* Drawer Container */}
      <div className="w-full max-w-3xl bg-[#0A1324] border-l border-[#1E2E4E] h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#1E2E4E] bg-[#0F1D38] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-[#E3A008]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-black text-cyan-300">
                  {transaction?.transaction.transaction_id || 'Forensic Inspection'}
                </span>
                {transaction?.alert_evaluation && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                      transaction.alert_evaluation.alert_severity === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : transaction.alert_evaluation.alert_severity === 'HIGH'
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {transaction.alert_evaluation.alert_severity}
                  </span>
                )}
                {transaction?.alert_evaluation.alert_score !== undefined && (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono font-bold">
                    Score: {transaction.alert_evaluation.alert_score}/100
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {transaction?.transaction.timestamp.replace('T', ' ').substring(0, 19)} &bull; {transaction?.transaction.channel} &bull; {transaction?.transaction.channel_action}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#070D19] border border-[#1E2E4E] hover:border-slate-500 text-slate-400 hover:text-white transition-colors"
            title="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[#1E2E4E] bg-[#070D19] px-5 gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'rules'
                ? 'border-[#E3A008] text-[#E3A008]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            Rules &amp; Counter-Evidence ({transaction?.triggered_rules.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-[#E3A008] text-[#E3A008]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Customer &amp; Baseline 360&deg;
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'telemetry'
                ? 'border-[#E3A008] text-[#E3A008]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            Device &amp; Session Telemetry
          </button>
          <button
            onClick={() => setActiveTab('copilot')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'copilot'
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-purple-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Sentient Copilot (Use Case 02)
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading || !transaction ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-28 rounded-xl bg-slate-800/40 border border-[#1E2E4E]" />
              <div className="h-44 rounded-xl bg-slate-800/40 border border-[#1E2E4E]" />
              <div className="h-44 rounded-xl bg-slate-800/40 border border-[#1E2E4E]" />
            </div>
          ) : activeTab === 'rules' ? (
            /* TAB 1: RULES & COUNTER EVIDENCE */
            <div className="space-y-5">
              {/* Scoring Summary Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#0F1D38] via-[#152445] to-[#0F1D38] border border-[#1E2E4E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Net Clamped Score Calculation
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-white">
                      {transaction.alert_evaluation.alert_score}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">/ 100</span>
                    <span className="text-xs text-[#E3A008] font-semibold ml-2">
                      Pattern: {transaction.alert_evaluation.primary_pattern}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-center min-w-[90px]">
                    <span className="text-slate-400 block text-[10px]">Rules Fired</span>
                    <strong className="text-red-400 text-sm">+{transaction.triggered_rules.reduce((acc, r) => acc + r.weight, 0)} pts</strong>
                  </div>
                  <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-center min-w-[90px]">
                    <span className="text-slate-400 block text-[10px]">Counter-Evidence</span>
                    <strong className="text-emerald-400 text-sm">-{transaction.counter_evidence.reduce((acc, c) => acc + c.deduction, 0)} pts</strong>
                  </div>
                </div>
              </div>

              {/* Triggered Fraud Rules List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-red-400" />
                  Triggered Synthetic Fraud Rules ({transaction.triggered_rules.length})
                </h4>
                {transaction.triggered_rules.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 rounded bg-[#070D19]">
                    No explicit fraud rules fired for this baseline event.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {transaction.triggered_rules.map((rule) => (
                      <div
                        key={rule.id}
                        className="p-3.5 rounded-xl bg-[#0F1D38] border border-[#1E2E4E] hover:border-red-500/40 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                              {rule.id}
                            </span>
                            <span className="font-bold text-xs text-white">{rule.title}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                              {rule.category}
                            </span>
                          </div>
                          <span className="font-black text-red-400 text-xs">+{rule.weight} pts</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-2 font-medium bg-[#070D19]/60 p-2 rounded border border-[#1E2E4E]/50">
                          {rule.evidence_detail}
                        </p>
                        {rule.sop && (
                          <div className="text-[11px] text-[#E3A008] mt-2 flex items-start gap-1">
                            <span className="font-bold shrink-0">Analyst SOP:</span>
                            <span>{rule.sop}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Counter-Evidence List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                  <MinusCircle className="w-4 h-4 text-emerald-400" />
                  Counter-Evidence Identified ({transaction.counter_evidence.length})
                </h4>
                {transaction.counter_evidence.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 rounded bg-[#070D19]">
                    No counter-evidence factors observed to lower the risk score.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {transaction.counter_evidence.map((ce) => (
                      <div
                        key={ce.id}
                        className="p-3.5 rounded-xl bg-[#0F1D38] border border-emerald-500/30 hover:border-emerald-500/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              {ce.id}
                            </span>
                            <span className="font-bold text-xs text-white">{ce.title}</span>
                          </div>
                          <span className="font-black text-emerald-400 text-xs">-{ce.deduction} pts</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-2 bg-[#070D19]/60 p-2 rounded border border-emerald-500/20">
                          {ce.observation}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'profile' ? (
            /* TAB 2: CUSTOMER & BASELINE 360 */
            <div className="space-y-5">
              {/* Customer Profile Grid */}
              <div className="p-4 rounded-xl bg-[#0F1D38] border border-[#1E2E4E] space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#E3A008] flex items-center gap-2">
                  <User className="w-4 h-4" /> Customer Baseline Profile
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">Customer Name</span>
                    <strong className="text-white block mt-0.5">{transaction.customer.customer_name}</strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">Customer ID</span>
                    <strong className="font-mono text-cyan-300 block mt-0.5">{transaction.customer.customer_id}</strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">Segment</span>
                    <strong className="text-[#E3A008] block mt-0.5">{transaction.customer.customer_segment} ({transaction.customer.customer_type})</strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">KYC Risk Band</span>
                    <strong className="text-white block mt-0.5">{transaction.customer.kyc_risk_band}</strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">Relationship Tenure</span>
                    <strong className="text-white block mt-0.5">{transaction.customer.relationship_tenure_days} days</strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">PEP Flag</span>
                    <strong className={transaction.customer.pep_flag ? 'text-red-400' : 'text-emerald-400'}>
                      {transaction.customer.pep_flag ? 'TRUE (High Risk)' : 'FALSE'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Historical Median & Spending Comparison */}
              <div className="p-4 rounded-xl bg-[#0F1D38] border border-[#1E2E4E] space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> 90-Day Spending Baseline vs Current Transaction
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">Current Value</span>
                    <strong className="text-white text-sm block mt-0.5 font-bold">
                      ${transaction.transaction.amount_usd_equiv.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">Customer 90d Median</span>
                    <strong className="text-slate-200 text-sm block mt-0.5">
                      ${transaction.customer.median_usd_90d?.toLocaleString()}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">Amount / Median Ratio</span>
                    <strong className={`text-sm block mt-0.5 ${transaction.transaction.amount_to_median_ratio >= 5.0 ? 'text-red-400 font-black' : 'text-emerald-400 font-bold'}`}>
                      {transaction.transaction.amount_to_median_ratio}x
                    </strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">Monthly Inflow</span>
                    <strong className="text-slate-200 text-sm block mt-0.5">
                      ${transaction.customer.monthly_inflow_usd_equiv?.toLocaleString()}
                    </strong>
                  </div>
                </div>

                {/* Ledger Balance Flow */}
                <div className="p-3 rounded-lg bg-[#070D19] border border-[#1E2E4E] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Pre-Txn Balance</span>
                    <strong className="text-white">${transaction.account.available_balance_before_usd?.toLocaleString()}</strong>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Debit / Credit</span>
                    <strong className={transaction.transaction.direction === 'DEBIT' ? 'text-red-400' : 'text-emerald-400'}>
                      {transaction.transaction.direction} ${transaction.transaction.amount_usd_equiv.toLocaleString()}
                    </strong>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Post-Txn Balance</span>
                    <strong className="text-white">${transaction.account.available_balance_after_usd?.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Beneficiary Details */}
              {transaction.counterparty.beneficiary_id && (
                <div className="p-4 rounded-xl bg-[#0F1D38] border border-[#1E2E4E] space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                    <Building className="w-4 h-4" /> Beneficiary / Counterparty Profile
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2 rounded bg-[#070D19] border border-[#1E2E4E]">
                      <span className="text-slate-400 block text-[10px]">Beneficiary Name</span>
                      <strong className="text-white block mt-0.5">{transaction.counterparty.beneficiary_name}</strong>
                    </div>
                    <div className="p-2 rounded bg-[#070D19] border border-[#1E2E4E]">
                      <span className="text-slate-400 block text-[10px]">Beneficiary ID</span>
                      <strong className="font-mono text-purple-300 block mt-0.5">{transaction.counterparty.beneficiary_id}</strong>
                    </div>
                    <div className="p-2 rounded bg-[#070D19] border border-[#1E2E4E]">
                      <span className="text-slate-400 block text-[10px]">Type / Relationship</span>
                      <strong className="text-slate-200 block mt-0.5">{transaction.counterparty.beneficiary_type} &bull; {transaction.counterparty.beneficiary_relationship}</strong>
                    </div>
                    <div className="p-2 rounded bg-[#070D19] border border-[#1E2E4E]">
                      <span className="text-slate-400 block text-[10px]">Customer Familiarity</span>
                      <strong className="text-white block mt-0.5">{transaction.counterparty.beneficiary_prior_txn_count} prior txns</strong>
                    </div>
                    <div className="p-2 rounded bg-[#070D19] border border-[#1E2E4E]">
                      <span className="text-slate-400 block text-[10px]">Distinct Senders (30d)</span>
                      <strong className={Number(transaction.counterparty.beneficiary_distinct_sender_count_30d) >= 5 ? 'text-red-400 font-bold' : 'text-slate-200'}>
                        {transaction.counterparty.beneficiary_distinct_sender_count_30d} accounts
                      </strong>
                    </div>
                    <div className="p-2 rounded bg-[#070D19] border border-[#1E2E4E]">
                      <span className="text-slate-400 block text-[10px]">Registration Age</span>
                      <strong className="text-slate-200 block mt-0.5">{transaction.counterparty.beneficiary_age_days} days ago</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'telemetry' ? (
            /* TAB 3: DEVICE & SESSION TELEMETRY */
            <div className="space-y-5">
              {/* Hardware Fingerprint */}
              <div className="p-4 rounded-xl bg-[#0F1D38] border border-[#1E2E4E] space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Laptop className="w-4 h-4" /> Hardware &amp; Touchpoint Fingerprint
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">Device ID</span>
                    <strong className="font-mono text-cyan-300 block mt-0.5">{transaction.device_and_session.device_id || 'TERMINAL'}</strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">Hardware Type / OS</span>
                    <strong className="text-white block mt-0.5">{transaction.device_and_session.device_type} &bull; {transaction.device_and_session.device_os}</strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">Multi-Account Usage (30d)</span>
                    <strong className={transaction.device_and_session.device_accounts_seen_30d >= 3 ? 'text-red-400 font-black' : 'text-slate-200'}>
                      {transaction.device_and_session.device_accounts_seen_30d} Accounts
                    </strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">Device Binding Age</span>
                    <strong className="text-white block mt-0.5">{transaction.device_and_session.device_first_seen_days} days on platform</strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">Touchpoint</span>
                    <strong className="text-white block mt-0.5">{transaction.device_and_session.touchpoint_type} ({transaction.device_and_session.touchpoint_id})</strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">Card Entry Mode</span>
                    <strong className="text-slate-200 block mt-0.5">{transaction.device_and_session.card_entry_mode}</strong>
                  </div>
                </div>
              </div>

              {/* IP & Geolocation Security Signals */}
              <div className="p-4 rounded-xl bg-[#0F1D38] border border-[#1E2E4E] space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> IP Intelligence &amp; Impossible Travel Check
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">IP Location</span>
                    <strong className="text-white block mt-0.5">{transaction.device_and_session.ip_city}, {transaction.device_and_session.ip_country}</strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">IP Risk Score</span>
                    <strong className={transaction.device_and_session.ip_risk_score > 60 ? 'text-red-400 font-bold' : 'text-slate-200'}>
                      {transaction.device_and_session.ip_risk_score}/100
                    </strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">VPN / Proxy</span>
                    <strong className={transaction.device_and_session.vpn_proxy_flag ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                      {transaction.device_and_session.vpn_proxy_flag ? 'DETECTED' : 'CLEAR'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">Previous City</span>
                    <strong className="text-slate-200 block mt-0.5">
                      {transaction.device_and_session.previous_txn_city || 'N/A'} ({transaction.device_and_session.minutes_since_prev_txn ? `${transaction.device_and_session.minutes_since_prev_txn}m` : 'First'})
                    </strong>
                  </div>
                </div>
              </div>

              {/* Authentication & Security Telemetry */}
              <div className="p-4 rounded-xl bg-[#0F1D38] border border-[#1E2E4E] space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Authentication &amp; Credential Telemetry
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">Auth Method</span>
                    <strong className="text-white block mt-0.5">{transaction.auth_and_security.auth_method}</strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">Failed Logins (30m)</span>
                    <strong className={transaction.auth_and_security.login_failures_30m >= 3 ? 'text-red-400 font-black' : 'text-slate-200'}>
                      {transaction.auth_and_security.login_failures_30m} Attempts
                    </strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">Password Reset</span>
                    <strong className={transaction.auth_and_security.password_reset_hours_ago !== null ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                      {transaction.auth_and_security.password_reset_hours_ago !== null ? `${transaction.auth_and_security.password_reset_hours_ago}h ago` : 'None'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#070D19] border border-[#1E2E4E]">
                    <span className="text-slate-400 block text-[10px]">SIM Swap Telemetry</span>
                    <strong className={transaction.auth_and_security.sim_swap_days_ago !== null ? 'text-red-400 font-bold' : 'text-slate-400'}>
                      {transaction.auth_and_security.sim_swap_days_ago !== null ? `${transaction.auth_and_security.sim_swap_days_ago}d ago` : 'None'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 4: SENTIENT COPILOT (USE CASE 02) */
            <CopilotPanel transaction={transaction} />
          )}
        </div>

        {/* Drawer Action Footer */}
        <div className="p-4 border-t border-[#1E2E4E] bg-[#070D19] flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Case: <strong className="text-white">{transaction?.alert_evaluation.case_id || 'NO_CASE'}</strong> &bull; Queue: <strong className="text-[#E3A008]">{transaction?.alert_evaluation.analyst_queue}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#0F1D38] border border-[#1E2E4E] hover:border-slate-500 text-slate-300 text-xs font-bold transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                alert(`Transaction ${transaction?.transaction.transaction_id} escalated to ${transaction?.alert_evaluation.escalation_tier || 'TIER_1'}. Analyst review confirmed.`);
              }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#E3A008] to-[#B87A04] text-slate-950 font-black text-xs transition-all shadow-md shadow-[#E3A008]/20 hover:brightness-110 active:scale-95"
            >
              Take Action / Hold
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
