'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CopilotHeader } from '@/components/CopilotHeader';
import { TransactionSpotlight } from '@/components/TransactionSpotlight';
import { CopilotChat } from '@/components/CopilotChat';
import { Section12Report } from '@/components/Section12Report';
import { CopilotInvestigation, CopilotTransactionItem, CopilotChatResponse } from '@/types';
import { fetchCopilotChat, fetchCopilotSuggestions, fetchFlaggedTransactions } from '@/lib/api';
import { AlertCircle, RefreshCw, MessageSquare, ChevronDown, ChevronUp, Clock, BrainCircuit } from 'lucide-react';

interface HistoryEntry {
  query: string;
  investigation: CopilotInvestigation;
  engine: string;
  timestamp: string;
  transactionId: string;
}

export default function SentientCopilotPortal() {
  const [transactions, setTransactions] = useState<CopilotTransactionItem[]>([]);
  const [selectedTxnId, setSelectedTxnId] = useState<string>('TXN-SYN0000001');

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [investigation, setInvestigation] = useState<CopilotInvestigation | null>(null);
  const [activeQuery, setActiveQuery] = useState<string>('');
  const [engineUsed, setEngineUsed] = useState<string>('Groq LLM + FAISS E5-Small Dual Retrieval');

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTxns, setIsLoadingTxns] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Fetch available flagged transactions on mount
  useEffect(() => {
    async function loadTransactions() {
      try {
        setIsLoadingTxns(true);
        const txns = await fetchFlaggedTransactions();
        if (txns && txns.length > 0) {
          setTransactions(txns);
          setSelectedTxnId(txns[0].transaction_id);
        }
      } catch (err: any) {
        console.error('Failed to load flagged transactions:', err);
      } finally {
        setIsLoadingTxns(false);
      }
    }
    loadTransactions();
  }, []);

  // 2. Load investigation & suggestions when selectedTxnId changes
  const runInvestigation = useCallback(async (targetTxnId: string, customQuery?: string) => {
    if (!targetTxnId) return;

    const q = customQuery !== undefined ? customQuery : 'Provide comprehensive fraud triage and forensic risk assessment.';

    try {
      setIsLoading(true);
      setErrorMessage(null);
      setActiveQuery(q);

      // Load prompt suggestions in parallel
      fetchCopilotSuggestions(targetTxnId).then((suggs) => {
        if (suggs && suggs.length > 0) setSuggestions(suggs);
      });

      const res: CopilotChatResponse = await fetchCopilotChat(targetTxnId, q);

      if (!res || !res.success || !res.investigation) {
        setErrorMessage(res?.error || 'Failed to complete forensic interrogation.');
      } else {
        const result = res.investigation;
        const engine = res.engine || 'Deterministic Rule Synthesizer';
        setInvestigation(result);
        setEngineUsed(engine);

        // Push to conversation history
        setHistory(prev => [{
          query: q,
          investigation: result,
          engine,
          timestamp: new Date().toLocaleTimeString(),
          transactionId: targetTxnId,
        }, ...prev].slice(0, 10)); // keep last 10

        if (customQuery !== undefined) setQuery('');
      }
    } catch (err: any) {
      console.error('Copilot investigation error:', err);
      setErrorMessage(err.message || 'Failed to connect to Copilot backend service.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Run on transaction switch
  useEffect(() => {
    if (selectedTxnId) {
      setHistory([]); // clear history on transaction change
      runInvestigation(selectedTxnId);
    }
  }, [selectedTxnId, runInvestigation]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      {/* 1. Assistant Header */}
      <CopilotHeader engineName={engineUsed} activeTxnId={selectedTxnId} />

      {/* 2. Main Portal Container */}
      <main className="flex-1 p-6 md:p-8 space-y-6 max-w-6xl mx-auto w-full">
        {/* Error Notice */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
              <span>
                <strong>Service Notice:</strong> {errorMessage} (Backend: <code className="bg-white px-1.5 py-0.5 rounded border border-[#FECACA]">http://127.0.0.1:8001</code>)
              </span>
            </div>
            <button
              onClick={() => runInvestigation(selectedTxnId)}
              className="px-3 py-1 rounded-lg bg-white border border-[#FCA5A5] text-[#991B1B] hover:bg-[#FEF2F2] font-bold text-xs"
            >
              Retry
            </button>
          </div>
        )}

        {/* 3. Transaction Selector Spotlight */}
        <TransactionSpotlight
          transactions={transactions}
          selectedTxnId={selectedTxnId}
          onSelectTxn={(id) => setSelectedTxnId(id)}
          isLoading={isLoadingTxns}
        />

        {/* 4. Natural Language Chat Input */}
        <CopilotChat
          query={query}
          onQueryChange={(q) => setQuery(q)}
          onSend={(customQuery) => runInvestigation(selectedTxnId, customQuery || query)}
          suggestions={suggestions}
          isLoading={isLoading}
        />

        {/* 5. Loading Skeleton */}
        {isLoading && (
          <div className="card-premium p-10 text-center space-y-3 bg-gradient-to-b from-white to-[#FFF7ED]/30">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FFF7ED] border border-[#FDBA74] text-[#EA580C] animate-spin">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[#0F172A]">Synthesizing Ground Truth Telemetry...</h4>
            {activeQuery && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF7ED] border border-[#FDBA74] text-[#C2410C] text-xs font-medium max-w-lg mx-auto">
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">"{activeQuery}"</span>
              </div>
            )}
          </div>
        )}

        {/* 6. Active Query Banner + 7-Part Section 12 Report */}
        {!isLoading && investigation && (
          <div className="space-y-4">
            {/* Active query banner */}
            {activeQuery && (
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-[#FFF7ED] border border-[#FDBA74] flex items-center justify-center shrink-0">
                  <BrainCircuit className="w-4 h-4 text-[#EA580C]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Responding to your query</span>
                  <p className="text-xs font-semibold text-[#0F172A] truncate">"{activeQuery}"</p>
                </div>
                <span className="text-[10px] text-[#94A3B8] shrink-0 font-mono">{engineUsed.includes('deterministic') ? 'Rule Engine' : 'Groq LLM'}</span>
              </div>
            )}

            <Section12Report
              investigation={investigation}
              transactionId={selectedTxnId}
            />
          </div>
        )}

        {/* 7. Conversation History */}
        {history.length > 1 && (
          <div className="card-premium overflow-hidden">
            <button
              onClick={() => setShowHistory(h => !h)}
              className="w-full flex items-center justify-between px-5 py-3.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors text-xs font-bold text-[#475569]"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#64748B]" />
                <span>Investigation History ({history.length - 1} previous)</span>
              </div>
              {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showHistory && (
              <div className="divide-y divide-[#E2E8F0]">
                {history.slice(1).map((entry, idx) => (
                  <div key={idx} className="px-5 py-4 space-y-2 hover:bg-[#F8FAFC] transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <MessageSquare className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                        <span className="text-xs font-semibold text-[#0F172A] truncate">"{entry.query}"</span>
                      </div>
                      <span className="text-[10px] text-[#94A3B8] shrink-0 font-mono">{entry.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed line-clamp-2 pl-5">
                      {entry.investigation.executive_summary}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white px-6 py-4 mt-8 text-xs text-[#64748B] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#0F172A]">Rawbank DRC</span>
          <span>&bull;</span>
          <span>Sentient Fraud Investigation Copilot (Use Case 02)</span>
        </div>
        <div>
          <span>BFSI Section 12 Reasoning &bull; Probabilistic Assessment Standard</span>
        </div>
      </footer>
    </div>
  );
}
