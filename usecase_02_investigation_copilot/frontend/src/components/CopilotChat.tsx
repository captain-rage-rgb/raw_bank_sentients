'use client';

import React, { useState } from 'react';
import { Send, Loader2, Sparkles, RefreshCw, MessageSquare } from 'lucide-react';

interface CopilotChatProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSend: (customQuery?: string) => void;
  suggestions: string[];
  isLoading: boolean;
}

export const CopilotChat: React.FC<CopilotChatProps> = ({
  query,
  onQueryChange,
  onSend,
  suggestions,
  isLoading,
}) => {
  return (
    <div className="card-premium p-5 space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-[#EA580C]" />
          Natural Language Forensic Interrogation
        </h3>
        <span className="text-[10px] text-[#64748B]">Press Enter to Ask</span>
      </div>

      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          placeholder="Interrogate alert (e.g. 'Analyze ATO probability', 'Explain counter-evidence', 'Inspect mule syndicate')..."
          className="w-full bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#FF7A45] focus:ring-2 focus:ring-[#FF7A45]/20 rounded-xl px-4 py-3.5 text-xs text-[#0F172A] placeholder-[#94A3B8] pr-28 shadow-2xs outline-none transition-all"
          disabled={isLoading}
        />
        <button
          onClick={() => onSend()}
          disabled={isLoading || !query.trim()}
          className="absolute right-2 top-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FF7A45] to-[#EA580C] hover:brightness-105 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          <span>Investigate</span>
        </button>
      </div>

      {/* 1-Click Prompt Suggestion Chips */}
      {suggestions.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-[#EA580C]" />
            Prompt Chips:
          </span>
          {suggestions.map((sugg, idx) => (
            <button
              key={idx}
              onClick={() => onSend(sugg)}
              disabled={isLoading}
              className="text-[11px] px-3 py-1 rounded-full bg-[#FFF7ED] hover:bg-[#FFEDD5] border border-[#FDBA74] text-[#C2410C] font-medium transition-all text-left truncate max-w-[320px] shadow-2xs"
              title={sugg}
            >
              {sugg}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
