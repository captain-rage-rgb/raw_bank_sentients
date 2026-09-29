'use client';

import React from 'react';
import { KPIsData } from '@/types';
import { ShieldAlert, DollarSign, Activity, FileSpreadsheet, AlertTriangle, CheckCircle, Flame } from 'lucide-react';

interface KpiRibbonProps {
  kpis: KPIsData | null;
  isLoading?: boolean;
}

export const KpiRibbon: React.FC<KpiRibbonProps> = ({ kpis, isLoading }) => {
  if (isLoading || !kpis) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-xl bg-[#0F1D38]/60 border border-[#1E2E4E] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Total Monitored Volume */}
      <div className="relative overflow-hidden rounded-xl bg-[#0F1D38] border border-[#1E2E4E] p-5 shadow-lg shadow-black/20 hover:border-[#2B3E63] transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Monitored Txns
          </span>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-black text-white tracking-tight">
            {kpis.total_transactions.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-slate-400">events</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#1E2E4E]/80">
          <span>Vol: <strong className="text-slate-200">${(kpis.total_volume_usd / 1e6).toFixed(2)}M USD</strong></span>
          <span>CDF: <strong className="text-slate-200">{(kpis.total_volume_cdf / 1e9).toFixed(2)}B</strong></span>
        </div>
      </div>

      {/* 2. Active Fraud Alerts */}
      <div className="relative overflow-hidden rounded-xl bg-[#0F1D38] border border-[#1E2E4E] p-5 shadow-lg shadow-black/20 hover:border-amber-500/40 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Flagged Alerts
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-black text-amber-300 tracking-tight">
            {kpis.total_alerts.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-slate-400">cases</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold pt-2 border-t border-[#1E2E4E]/80">
          <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
            Crit: {kpis.critical_alerts}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
            High: {kpis.high_alerts}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Med: {kpis.medium_alerts}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Low: {kpis.low_alerts}
          </span>
        </div>
      </div>

      {/* 3. Financial Exposure at Risk */}
      <div className="relative overflow-hidden rounded-xl bg-[#0F1D38] border border-[#1E2E4E] p-5 shadow-lg shadow-black/20 hover:border-red-500/40 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-red-300 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Exposure At Risk
          </span>
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-red-400" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-black text-red-400 tracking-tight">
            ${kpis.total_exposure_usd.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          <span className="text-xs font-semibold text-slate-400">USD</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#1E2E4E]/80">
          <span>Active Queues: <strong className="text-white">{kpis.open_cases} Open</strong></span>
          <span className="text-emerald-400 font-semibold">{kpis.closed_cases} Resolved</span>
        </div>
      </div>

      {/* 4. Alert Rate & Benchmark */}
      <div className="relative overflow-hidden rounded-xl bg-[#0F1D38] border border-[#1E2E4E] p-5 shadow-lg shadow-black/20 hover:border-[#E3A008]/40 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-[#E3A008] uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#E3A008]" /> Anomaly Rate
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#E3A008]/10 border border-[#E3A008]/20 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-[#E3A008]" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-black text-white tracking-tight">
            {kpis.alert_rate}%
          </span>
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Target 14-18% &bull; Met
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#1E2E4E]/80">
          <span>Target Window: <strong className="text-slate-200">14.0% &ndash; 18.0%</strong></span>
          <span className="text-xs text-slate-400">90d History</span>
        </div>
      </div>
    </div>
  );
};
