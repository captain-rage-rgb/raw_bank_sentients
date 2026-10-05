'use client';

import React from 'react';
import { Landmark, BrainCircuit, Sparkles, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface CopilotHeaderProps {
  engineName?: string;
  activeTxnId?: string;
}

export const CopilotHeader: React.FC<CopilotHeaderProps> = ({
  engineName = 'Groq LLM + FAISS E5-Small Dual Retrieval',
  activeTxnId,
}) => {
  return (
    <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30 px-6 py-3.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A45] to-[#EA580C] p-0.5 shadow-md shadow-[#FF7A45]/20 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-[#EA580C]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-wider text-[#0F172A]">RAWBANK</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF7ED] text-[#C2410C] border border-[#FDBA74]">
                SENTIENT COPILOT
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-[#047857] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                <CheckCircle2 className="w-3 h-3 text-[#059669]" /> USE CASE 02 STANDALONE
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              Autonomous BFSI Fraud Investigation Layer &bull; Section 12 Reasoning Standards
            </p>
          </div>
        </div>

        {/* Operational Status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[#64748B]">Reasoning Engine:</span>
            <strong className="text-[#0F172A] font-mono text-[11px] truncate max-w-[240px]">
              {engineName}
            </strong>
          </div>

          <div className="text-right text-xs hidden lg:block">
            <span className="text-[#64748B] block text-[10px]">Surveillance Focus</span>
            <strong className="text-[#C2410C] font-mono font-bold">
              {activeTxnId || 'Select Transaction'}
            </strong>
          </div>
        </div>
      </div>
    </header>
  );
};
