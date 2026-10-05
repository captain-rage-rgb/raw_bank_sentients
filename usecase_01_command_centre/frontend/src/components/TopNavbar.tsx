'use client';

import React from 'react';
import { RefreshCw, Activity, ShieldAlert, Database, Calendar, UserCheck } from 'lucide-react';

interface TopNavbarProps {
  onRefresh: () => void;
  isLoading?: boolean;
  totalTxns?: number;
  totalAlerts?: number;
  alertRate?: number;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onRefresh,
  isLoading = false,
  totalTxns = 2500,
  totalAlerts = 374,
  alertRate = 15.0,
}) => {
  return (
    <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30 px-6 py-3.5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Title and Context */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-[#0F172A]">
              Fraud Intelligence &amp; Operational Triage
            </h1>
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              Surveillance Live
            </span>
          </div>
          <p className="text-xs text-[#64748B] flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#94A3B8]" />
              Continuous 90-Day Telemetry Window
            </span>
            <span>&bull;</span>
            <span>Kinshasa Clearing Hub (DRC)</span>
          </p>
        </div>

        {/* Operational Indicators and Refresh Button */}
        <div className="flex items-center gap-3">
          {/* Quick Stats Pill */}
          <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[#64748B]">Dataset:</span>
              <strong className="text-[#0F172A]">{totalTxns.toLocaleString()} Events</strong>
            </div>
            <span className="text-[#CBD5E1]">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#64748B]">Alert Rate:</span>
              <strong className="text-[#C2410C] font-mono">{alertRate}%</strong>
            </div>
            <span className="text-[#CBD5E1]">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#64748B]">Alerts:</span>
              <strong className="text-[#DC2626] font-mono">{totalAlerts} Flagged</strong>
            </div>
          </div>

          {/* Refresh Action Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFF7ED] hover:bg-[#FFEDD5] text-[#C2410C] border border-[#FDBA74] text-xs font-bold transition-all shadow-xs active:scale-95 disabled:opacity-50"
            title="Refresh analytics and alert queue from DuckDB"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#EA580C] ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

          {/* User Badge */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-full bg-[#FFF7ED] border border-[#FDBA74] flex items-center justify-center text-[#EA580C] font-bold text-xs">
              AD
            </div>
            <div className="text-left text-xs leading-tight">
              <span className="font-bold text-[#0F172A] block">Analyst Desk</span>
              <span className="text-[10px] text-[#64748B]">DRC Tier-2 Unit</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
