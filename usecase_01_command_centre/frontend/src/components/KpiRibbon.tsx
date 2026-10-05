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
          <div key={i} className="h-32 rounded-xl bg-white border border-[#E2E8F0] shadow-xs animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Total Monitored Volume */}
      <div className="card-premium p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Total Monitored Txns
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4 text-[#0284C7]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-[#0F172A] tracking-tight">
              {kpis.total_transactions.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-[#64748B]">events</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-3 border-t border-[#F1F5F9] mt-2">
          <span>Vol: <strong className="text-[#0F172A]">${(kpis.total_volume_usd / 1e6).toFixed(2)}M USD</strong></span>
          <span>CDF: <strong className="text-[#0F172A]">{(kpis.total_volume_cdf / 1e9).toFixed(2)}B</strong></span>
        </div>
      </div>

      {/* 2. Flagged Fraud Alerts */}
      <div className="card-premium p-5 flex flex-col justify-between border-l-4 border-l-[#FF7A45]">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#C2410C] uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#EA580C]" /> Flagged Alerts
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FFF7ED] border border-[#FDBA74] flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-[#EA580C]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-[#C2410C] tracking-tight">
              {kpis.total_alerts.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-[#64748B]">cases</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold pt-3 border-t border-[#F1F5F9] mt-2 flex-wrap">
          <span className="px-1.5 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
            Crit: {kpis.critical_alerts}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#FFF7ED] text-[#EA580C] border border-[#FDBA74]">
            High: {kpis.high_alerts}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]">
            Med: {kpis.medium_alerts}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
            Low: {kpis.low_alerts}
          </span>
        </div>
      </div>

      {/* 3. Financial Exposure at Risk */}
      <div className="card-premium p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#DC2626] uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626]" /> Exposure At Risk
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#DC2626]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-[#DC2626] tracking-tight">
              ${kpis.total_exposure_usd.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs font-semibold text-[#64748B]">USD</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-3 border-t border-[#F1F5F9] mt-2">
          <span>Active Queues: <strong className="text-[#0F172A]">{kpis.open_cases} Open</strong></span>
          <span className="text-[#059669] font-semibold">{kpis.closed_cases} Resolved</span>
        </div>
      </div>

      {/* 4. Anomaly Rate & Benchmark */}
      <div className="card-premium p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#B45309] uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#D97706]" /> Anomaly Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-[#D97706]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-[#0F172A] tracking-tight">
              {kpis.alert_rate}%
            </span>
            <span className="text-[10px] font-bold text-[#047857] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
              Target 14-18% &bull; Compliant
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-3 border-t border-[#F1F5F9] mt-2">
          <span>Regulatory Target: <strong className="text-[#0F172A]">14.0% &ndash; 18.0%</strong></span>
          <span className="text-xs text-[#94A3B8]">90d Baseline</span>
        </div>
      </div>
    </div>
  );
};
