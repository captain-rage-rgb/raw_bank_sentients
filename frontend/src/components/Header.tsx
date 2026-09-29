'use client';

import React from 'react';
import { ShieldAlert, Activity, RefreshCw, Database, Landmark, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  isLoading?: boolean;
  totalTxns?: number;
  totalAlerts?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onRefresh,
  isLoading = false,
  totalTxns = 2500,
  totalAlerts = 374,
}) => {
  return (
    <header className="border-b border-[#1E2E4E] bg-[#0A1324]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Platform Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E3A008] via-[#B87A04] to-[#0A1324] p-0.5 shadow-lg shadow-[#E3A008]/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0A1324] rounded-[10px] flex items-center justify-center">
              <Landmark className="w-5 h-5 text-[#E3A008]" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-white">RAWBANK</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E3A008]/15 text-[#E3A008] border border-[#E3A008]/30">
                SENTIENT
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> CANONICAL KB LOADED
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Enterprise Fraud Intelligence Platform &bull; Kinshasa Command Centre (DRC)
            </p>
          </div>
        </div>

        {/* Live Operational Metrics & Refresh */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-4 bg-[#0F1D38] px-3.5 py-1.5 rounded-lg border border-[#1E2E4E] text-xs">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">Dataset:</span>
              <span className="font-semibold text-slate-200">2,500 Rows</span>
            </div>
            <div className="w-px h-3.5 bg-slate-700" />
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Rules Active:</span>
              <span className="font-semibold text-slate-200">FR-01 &ndash; FR-20</span>
            </div>
            <div className="w-px h-3.5 bg-slate-700" />
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-slate-400">Engine:</span>
              <span className="font-semibold text-emerald-400">DuckDB Live</span>
            </div>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#152445] hover:bg-[#1E2E4E] text-slate-200 hover:text-white border border-[#1E2E4E] text-xs font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50"
            title="Refresh analytics and alert queue"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#E3A008] ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        </div>
      </div>
    </header>
  );
};
