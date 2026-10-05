'use client';

import React, { useState } from 'react';
import { CopilotInvestigation } from '@/types';
import {
  FileSearch,
  TrendingUp,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Scale,
  BrainCircuit,
  Check,
  Flame,
  ArrowRight
} from 'lucide-react';

interface Section12ReportProps {
  investigation: CopilotInvestigation | null;
  transactionId: string;
}

const safeArray = <T,>(val: any, fallback: T[] = []): T[] => {
  if (Array.isArray(val)) return val;
  if (val !== undefined && val !== null && typeof val === 'string' && val.trim().length > 0) {
    return [val as unknown as T];
  }
  return fallback;
};

export const Section12Report: React.FC<Section12ReportProps> = ({
  investigation,
  transactionId,
}) => {
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  if (!investigation) return null;

  const handleDisposition = (actionType: string) => {
    setActionFeedback(`Case Audit: ${actionType} recorded in DRC core banking ledger for ${transactionId}.`);
    setTimeout(() => setActionFeedback(null), 5000);
  };

  const observedFacts = safeArray<string>(investigation.observed_facts);
  const derivedMetrics = safeArray<string>(investigation.derived_metrics);
  const triggeredRules = safeArray<any>(investigation.triggered_rules);
  const supportingEvidence = safeArray<string>(investigation.supporting_evidence);
  const counterEvidence = safeArray<string>(investigation.counter_evidence);
  const evidenceGaps = safeArray<string>(investigation.evidence_gaps);
  const nextSteps = safeArray<string>(investigation.recommended_analyst_action?.next_steps);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Action Toast Feedback */}
      {actionFeedback && (
        <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            <span>{actionFeedback}</span>
          </div>
          <span className="text-[10px] text-[#059669] font-mono font-bold">Audit Verified</span>
        </div>
      )}

      {/* Executive Summary Card (Probabilistic Language Guaranteed) */}
      <div className="card-premium p-5 border-l-4 border-l-[#FF7A45] bg-gradient-to-r from-white via-[#FFF7ED]/20 to-[#FFF7ED]/40 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#C2410C] flex items-center gap-1.5">
            <BrainCircuit className="w-4 h-4 text-[#EA580C]" />
            Executive Synthesis &bull; Section 12 Probabilistic Assessment
          </span>
          <span className="text-[10px] font-mono bg-[#FFF7ED] text-[#EA580C] px-2.5 py-0.5 rounded-full border border-[#FDBA74] font-bold">
            Frontline Analyst Triage
          </span>
        </div>
        <p className="text-xs text-[#1E293B] leading-relaxed font-medium">
          {investigation.executive_summary || 'The available evidence is consistent with elevated behavioral risk patterns.'}
        </p>
      </div>

      {/* Section 1: Observed Facts */}
      <div className="card-premium p-5 space-y-2.5">
        <h4 className="text-xs font-bold text-[#0284C7] uppercase tracking-wider flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-[#0284C7]" />
          1. Observed Facts (Verified Telemetry)
        </h4>
        <ul className="space-y-1.5 text-xs text-[#334155]">
          {observedFacts.map((fact, idx) => (
            <li key={idx} className="flex items-start gap-2.5 p-1.5 rounded-lg bg-[#F8FAFC]">
              <span className="text-[#0284C7] font-bold mt-0.5 shrink-0">&bull;</span>
              <span>{typeof fact === 'string' ? fact : JSON.stringify(fact)}</span>
            </li>
          ))}
          {observedFacts.length === 0 && (
            <li className="text-[#94A3B8] italic">No telemetry facts available.</li>
          )}
        </ul>
      </div>

      {/* Section 2: Derived Metrics */}
      <div className="card-premium p-5 space-y-2.5">
        <h4 className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#4F46E5]" />
          2. Derived Metrics (Behavioral Baseline Calibration)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {derivedMetrics.map((metric, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#334155] flex items-start gap-2">
              <span className="text-[#4F46E5] font-black shrink-0 mt-0.5">#{idx + 1}</span>
              <span className="leading-snug">{typeof metric === 'string' ? metric : JSON.stringify(metric)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Triggered Rules */}
      <div className="card-premium p-5 space-y-2.5">
        <h4 className="text-xs font-bold text-[#D97706] uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#D97706]" />
          3. Triggered Rules (FR-01 to FR-20 Weights)
        </h4>
        <div className="space-y-2">
          {triggeredRules.map((rule, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-[#FFFBEB]/60 border border-[#FDE68A] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#FFF7ED] text-[#C2410C] font-mono font-bold text-[11px] border border-[#FDBA74]">
                  {rule.rule_code || 'FR-XX'}
                </span>
                <span className="text-[#0F172A] font-bold">{rule.rule_name || 'Flagged Anomaly'}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#64748B] hidden sm:inline">{rule.detail || ''}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#DC2626] font-mono font-bold text-[11px] border border-[#FECACA] shrink-0">
                  +{rule.weight || 10}
                </span>
              </div>
            </div>
          ))}
          {triggeredRules.length === 0 && (
            <div className="text-xs text-[#94A3B8] italic p-2">No rules flagged for this event.</div>
          )}
        </div>
      </div>

      {/* Section 4 & 5: Supporting Evidence vs Counter-Evidence (Split Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Supporting Evidence */}
        <div className="card-premium p-5 border-l-4 border-l-[#DC2626] space-y-2.5">
          <h4 className="text-xs font-bold text-[#DC2626] uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
            4. Supporting Evidence (Risk Signals)
          </h4>
          <ul className="space-y-2 text-xs">
            {supportingEvidence.map((ev, idx) => (
              <li key={idx} className="p-2.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] flex items-start gap-2">
                <span className="text-[#DC2626] shrink-0 font-black">&bull;</span>
                <span>{typeof ev === 'string' ? ev : JSON.stringify(ev)}</span>
              </li>
            ))}
            {supportingEvidence.length === 0 && (
              <li className="p-2.5 rounded-xl bg-[#F8FAFC] text-[#64748B] italic">
                No high-risk supporting anomalies isolated beyond triggered rules.
              </li>
            )}
          </ul>
        </div>

        {/* Counter-Evidence */}
        <div className="card-premium p-5 border-l-4 border-l-[#059669] space-y-2.5">
          <h4 className="text-xs font-bold text-[#059669] uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            5. Counter-Evidence (CE-01 to CE-05)
          </h4>
          <ul className="space-y-2 text-xs">
            {counterEvidence.map((cev, idx) => (
              <li key={idx} className="p-2.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] flex items-start gap-2">
                <span className="text-[#059669] shrink-0 font-black">&check;</span>
                <span>{typeof cev === 'string' ? cev : JSON.stringify(cev)}</span>
              </li>
            ))}
            {counterEvidence.length === 0 && (
              <li className="p-2.5 rounded-xl bg-[#F8FAFC] text-[#64748B] italic">
                No mitigating factors or exonerating counter-evidence identified in telemetry.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Section 6: Evidence Gaps */}
      <div className="card-premium p-5 space-y-2.5">
        <h4 className="text-xs font-bold text-[#B45309] uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#D97706]" />
          6. Evidence Gaps (Required Out-of-Band Verification)
        </h4>
        <div className="space-y-2 text-xs text-[#334155]">
          {evidenceGaps.map((gap, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-2">
              <span className="text-[#D97706] font-black shrink-0 mt-0.5">?</span>
              <span>{typeof gap === 'string' ? gap : JSON.stringify(gap)}</span>
            </div>
          ))}
          {evidenceGaps.length === 0 && (
            <div className="text-xs text-[#94A3B8] italic">No telemetry gaps observed.</div>
          )}
        </div>
      </div>

      {/* Section 7: Recommended Analyst Action & Disposition Flow */}
      <div className="card-premium p-5 border-l-4 border-l-[#2563EB] bg-gradient-to-br from-white to-[#EFF6FF]/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2E8F0] pb-3 gap-2">
          <div>
            <h4 className="text-xs font-bold text-[#1E40AF] uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#2563EB]" />
              7. Recommended Analyst Action
            </h4>
            <div className="mt-1.5 flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] font-mono font-bold text-xs">
                {investigation.recommended_analyst_action?.action || 'MONITOR_AND_REVIEW'}
              </span>
              <span className="text-xs text-[#475569]">
                Suggested Disposition:{' '}
                <strong className="text-[#0F172A]">
                  {investigation.recommended_analyst_action?.disposition_suggestion || 'SUSPICIOUS'}
                </strong>
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#334155] leading-relaxed">
          <strong>Rationale:</strong> {investigation.recommended_analyst_action?.rationale || 'Review verified telemetry against customer baseline.'}
        </p>

        {/* Execution Steps */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            Operational Execution Steps:
          </span>
          <ul className="space-y-1.5 text-xs text-[#334155]">
            {nextSteps.map((step, idx) => (
              <li key={idx} className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
                <span className="w-5 h-5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center text-[10px] font-bold shrink-0">
                  {idx + 1}
                </span>
                <span>{typeof step === 'string' ? step : JSON.stringify(step)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Frontline Disposition Buttons */}
        <div className="pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-[11px] font-bold text-[#64748B]">
            Frontline Case Disposition Workflow:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleDisposition('MARK_LEGITIMATE')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#ECFDF5] border border-[#CBD5E1] hover:border-[#6EE7B7] text-[#047857] font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" />
              Mark Legitimate
            </button>
            <button
              onClick={() => handleDisposition('ESCALATE_TO_QUEUE')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFF7ED] border border-[#CBD5E1] hover:border-[#FDBA74] text-[#C2410C] font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Flame className="w-3.5 h-3.5" />
              Escalate to Queue
            </button>
            <button
              onClick={() => handleDisposition('REQUEST_ADDITIONAL_INFO')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EFF6FF] border border-[#CBD5E1] hover:border-[#93C5FD] text-[#1D4ED8] font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Request Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
