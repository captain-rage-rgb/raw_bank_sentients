export interface TriggeredRuleItem {
  rule_code: string;
  rule_name: string;
  weight: number;
  detail: string;
}

export interface CopilotInvestigation {
  observed_facts: string[];
  derived_metrics: string[];
  triggered_rules: TriggeredRuleItem[];
  supporting_evidence: string[];
  counter_evidence: string[];
  evidence_gaps: string[];
  recommended_analyst_action: {
    action: string;
    rationale: string;
    disposition_suggestion: 'LEGITIMATE' | 'SUSPICIOUS' | 'INSUFFICIENT_EVIDENCE' | string;
    next_steps: string[];
  };
  executive_summary: string;
}

export interface CopilotChatResponse {
  success: boolean;
  transaction_id: string;
  query: string;
  engine: string;
  error?: string;
  context_summary?: {
    amount_usd: number;
    channel: string;
    severity: string;
    score: number;
    pattern: string;
    triggered_rules_count: number;
    counter_evidence_count: number;
    semantic_similar_count: number;
  };
  investigation: CopilotInvestigation;
}

export interface CopilotTransactionItem {
  transaction_id: string;
  timestamp: string;
  customer_id: string;
  customer_name: string;
  customer_segment: string;
  channel: string;
  channel_action: string;
  amount_usd_equiv: number;
  alert_score: number;
  alert_severity: string;
  alert_primary_pattern: string;
  city: string;
}

export interface CopilotTransactionsResponse {
  transactions: CopilotTransactionItem[];
  total: number;
}
