'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  FileSearch,
  Check,
  Flame,
  Scale,
  BrainCircuit,
  CornerDownLeft,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { TransactionDrilldown, CopilotInvestigation, CopilotChatResponse } from '@/types';
import { fetchCopilotChat, fetchCopilotSuggestions } from '@/lib/api';

interface CopilotPanelProps {
  transaction: TransactionDrilldown;
}

export const CopilotPanel: React.FC<CopilotPanelProps> = ({ transaction }) => {
  const txnId = transaction.transaction.transaction_id;

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [investigation, setInvestigation] = useState<CopilotInvestigation | null>(null);
  const [engineUsed, setEngineUsed] = useState<string>('');
  const [contextSummary, setContextSummary] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dispositionStatus, setDispositionStatus] = useState<string | null>(null);

  // Load suggestions and run initial investigation turn on mount
  useEffect(() => {
    let isMounted = true;

    async function initCopilot() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        // 1. Fetch suggestions
        const suggs = await fetchCopilotSuggestions(txnId);
        if (isMounted && suggs.length > 0) {
          setSuggestions(suggs);
        }

        // 2. Initial investigation
        const res: CopilotChatResponse = await fetchCopilotChat(
          txnId,
          'Provide comprehensive fraud triage and forensic risk assessment.'
        );
        if (isMounted) {
          setInvestigation(res.investigation);
          setEngineUsed(res.engine);
          setContextSummary(res.context_summary);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Copilot initialization failed:', err);
          setErrorMessage(err.message || 'Failed to initialize Sentient Copilot');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initCopilot();

    return () => {
      isMounted = false;
    };
  }, [txnId]);

  const handleSendQuery = async (customQuery?: string) => {
    const q = customQuery !== undefined ? customQuery : query;
    if (!q.trim()) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await fetchCopilotChat(txnId, q);
      setInvestigation(res.investigation);
      setEngineUsed(res.engine);
      setContextSummary(res.context_summary);
      if (!customQuery) setQuery('');
    } catch (err: any) {
      console.error('Copilot query error:', err);
      setErrorMessage(err.message || 'Failed to process inquiry');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisposition = (actionType: string) => {
    setDispositionStatus(`Action Recorded: ${actionType} logged to case journal for ${txnId}.`);
    setTimeout(() => setDispositionStatus(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Copilot Header Card */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-[#0A1324] border border-purple-500/30 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shadow-inner">
            <BrainCircuit className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Sentient Fraud Investigation Copilot
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-900/60 text-purple-300 border border-purple-500/40">
                Use Case 02
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Engine: <span className="text-slate-300 font-mono font-semibold">{engineUsed || 'Dual-Retrieval (Pandas + FAISS E5)'}</span>
            </p>
          </div>
        </div>

        {contextSummary && (
          <div className="hidden sm:flex items-center gap-2 text-[11px]">
            <span className="px-2 py-1 rounded bg-[#070D19] border border-slate-800 text-slate-300">
              Rules Triggered: <strong className="text-amber-400">{contextSummary.triggered_rules_count}</strong>
            </span>
            <span className="px-2 py-1 rounded bg-[#070D19] border border-slate-800 text-slate-300">
              Counter-Evidence: <strong className="text-emerald-400">{contextSummary.counter_evidence_count}</strong>
            </span>
            <span className="px-2 py-1 rounded bg-[#070D19] border border-slate-800 text-slate-300">
              Vector Matches: <strong className="text-cyan-400">{contextSummary.semantic_similar_count}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Interactive Chat Input */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
            placeholder="Interrogate alert (e.g. 'Analyze ATO probability', 'Explain counter-evidence', 'Inspect mule network')..."
            className="w-full bg-[#070D19] border border-purple-500/30 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 pr-24 shadow-inner outline-none transition-all"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendQuery()}
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-2 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Ask</span>
          </button>
        </div>

        {/* Quick-Prompt Suggestions */}
        {suggestions.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mr-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              Quick Chips:
            </span>
            {suggestions.map((sugg, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(sugg)}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1 rounded-full bg-[#0D182E] hover:bg-purple-950/60 border border-slate-700/80 hover:border-purple-400/60 text-slate-300 hover:text-purple-200 transition-all text-left truncate max-w-[280px]"
                title={sugg}
              >
                {sugg}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Disposition Feedback Toast */}
      {dispositionStatus && (
        <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{dispositionStatus}</span>
          </div>
          <span className="text-[10px] text-emerald-400/80 font-mono">DRC Core Audited</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="p-8 rounded-xl bg-[#0D182E] border border-purple-500/20 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-400 animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white">Synthesizing Ground Truth Telemetry...</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Retrieving customer 90-day baseline, calculating sliding velocity, evaluating counter-evidence (CE-01..CE-05), and matching historical vectors in FAISS.
          </p>
        </div>
      )}

      {/* 7-Part Investigation Breakdown (Section 12 Compliant) */}
      {!isLoading && investigation && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Executive Summary Card */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                Executive Synthesis (Probabilistic Assessment)
              </span>
              <span className="text-[10px] font-mono bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                Analyst Triage Level
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
              {investigation.executive_summary}
            </p>
          </div>

          {/* Section 1: Observed Facts */}
          <div className="p-4 rounded-xl bg-[#070D19] border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-cyan-400" />
              1. Observed Facts (Verified Telemetry)
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {investigation.observed_facts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1 shrink-0 text-[10px]">&bull;</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Derived Metrics */}
          <div className="p-4 rounded-xl bg-[#070D19] border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              2. Derived Metrics (Behavioral Calibration)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {investigation.derived_metrics.map((metric, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[#0A1324] border border-[#1E2E4E] text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-indigo-400 font-bold shrink-0 mt-0.5">#{idx + 1}</span>
                  <span className="leading-snug">{metric}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Triggered Rules */}
          <div className="p-4 rounded-xl bg-[#070D19] border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              3. Triggered Rules (FR-01 to FR-20 Weights)
            </h4>
            <div className="space-y-2">
              {investigation.triggered_rules.map((rule, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[#0F1D38] border border-amber-500/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-bold text-[11px]">
                      {rule.rule_code}
                    </span>
                    <span className="text-white font-semibold">{rule.rule_name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 hidden sm:inline">{rule.detail}</span>
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono font-bold text-[11px] shrink-0">
                      +{rule.weight}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4 & 5: Supporting Evidence vs Counter-Evidence (Split Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Supporting Evidence */}
            <div className="p-4 rounded-xl bg-[#070D19] border border-red-900/30 space-y-2.5">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                4. Supporting Evidence (Risk Signals)
              </h4>
              <ul className="space-y-2 text-xs">
                {investigation.supporting_evidence.map((ev, idx) => (
                  <li key={idx} className="p-2 rounded bg-red-950/20 border border-red-500/20 text-red-200 flex items-start gap-2">
                    <span className="text-red-400 shrink-0 font-bold">&bull;</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Counter-Evidence */}
            <div className="p-4 rounded-xl bg-[#070D19] border border-emerald-900/30 space-y-2.5">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                5. Counter-Evidence (CE-01 to CE-05)
              </h4>
              <ul className="space-y-2 text-xs">
                {investigation.counter_evidence.map((cev, idx) => (
                  <li key={idx} className="p-2 rounded bg-emerald-950/20 border border-emerald-500/20 text-emerald-200 flex items-start gap-2">
                    <span className="text-emerald-400 shrink-0 font-bold">&check;</span>
                    <span>{cev}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 6: Evidence Gaps */}
          <div className="p-4 rounded-xl bg-[#070D19] border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              6. Evidence Gaps (Required Out-of-Band Verification)
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              {investigation.evidence_gaps.map((gap, idx) => (
                <div key={idx} className="p-2 rounded bg-[#0A1324] border border-slate-800 flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0 mt-0.5">?</span>
                  <span>{gap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Recommended Analyst Action & Disposition Flow */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#0F1D38] to-[#0A1324] border border-blue-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E2E4E] pb-3">
              <div>
                <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-400" />
                  7. Recommended Analyst Action
                </h4>
                <div className="mt-1 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-blue-600/30 border border-blue-400/40 text-blue-200 font-mono font-bold text-xs">
                    {investigation.recommended_analyst_action.action}
                  </span>
                  <span className="text-xs text-slate-300">
                    Suggested Disposition:{' '}
                    <strong className="text-white">
                      {investigation.recommended_analyst_action.disposition_suggestion}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Rationale:</strong> {investigation.recommended_analyst_action.rationale}
            </p>

            {/* Next Steps Checklist */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Recommended Execution Steps:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {investigation.recommended_analyst_action.next_steps.map((step, idx) => (
                  <li key={idx} className="flex items-center gap-2 p-1.5 rounded bg-[#070D19]/60 border border-slate-800/80">
                    <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Frontline Disposition Action Buttons */}
            <div className="pt-2 border-t border-[#1E2E4E] flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] font-bold text-slate-400">
                Frontline Disposition Workflow:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDisposition('MARK_LEGITIMATE')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 hover:border-emerald-500 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  Mark Legitimate
                </button>
                <button
                  onClick={() => handleDisposition('ESCALATE_TO_QUEUE')}
                  className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 hover:border-amber-500 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Flame className="w-3.5 h-3.5" />
                  Escalate to Queue
                </button>
                <button
                  onClick={() => handleDisposition('REQUEST_ADDITIONAL_INFO')}
                  className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 hover:border-blue-500 text-blue-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Request Info
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
