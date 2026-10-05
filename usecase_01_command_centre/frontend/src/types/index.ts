export interface KPIsData {
  total_transactions: number;
  total_volume_usd: number;
  total_volume_cdf: number;
  total_alerts: number;
  alert_rate: number;
  critical_alerts: number;
  high_alerts: number;
  medium_alerts: number;
  low_alerts: number;
  no_risk_alerts: number;
  total_exposure_usd: number;
  open_cases: number;
  closed_cases: number;
  under_review_cases: number;
  last_updated: string;
}

export interface DailyTrendPoint {
  date: string;
  alert_count: number;
  critical_count: number;
  volume_usd: number;
}

export interface ChannelStat {
  channel: string;
  total_txns: number;
  alert_count: number;
  alert_rate: number;
  total_volume_usd: number;
  exposure_usd: number;
}

export interface GeoStat {
  city: string;
  province: string;
  alert_count: number;
  total_txns: number;
  exposure_usd: number;
}

export interface RiskyCustomer {
  customer_id: string;
  customer_name: string;
  customer_segment: string;
  alert_count: number;
  max_alert_score: number;
  total_exposure_usd: number;
}

export interface SuspiciousBeneficiary {
  beneficiary_id: string;
  beneficiary_name: string;
  beneficiary_type: string;
  max_senders: number;
  alert_count: number;
  total_received_usd: number;
}

export interface FlaggedDevice {
  device_id: string;
  device_type: string;
  device_os: string;
  accounts_seen: number;
  alert_count: number;
  max_alert_score: number;
}

export interface AnalyticsData {
  daily_trends: DailyTrendPoint[];
  channel_distribution: ChannelStat[];
  geographic_distribution: GeoStat[];
  top_risky_entities: {
    top_customers: RiskyCustomer[];
    suspicious_beneficiaries: SuspiciousBeneficiary[];
    flagged_devices: FlaggedDevice[];
  };
}

export interface AlertItem {
  transaction_id: string;
  event_timestamp_local: string;
  customer_id: string;
  customer_name: string;
  customer_segment: string;
  channel: string;
  channel_action: string;
  amount: number;
  currency: string;
  amount_usd_equiv: number;
  amount_to_median_ratio: number;
  alert_score: number;
  alert_severity: string;
  alert_primary_pattern: string;
  alert_reason_codes: string;
  potential_exposure_usd: number;
  case_id: string;
  case_status: string;
  analyst_queue: string;
  human_disposition: string;
  touchpoint_id?: string;
  txn_city?: string;
}

export interface AlertsResponse {
  items: AlertItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface TriggeredRule {
  id: string;
  title: string;
  category: string;
  weight: number;
  severity: string;
  description: string;
  sop?: string;
  evidence_detail: string;
}

export interface CounterEvidence {
  id: string;
  title: string;
  deduction: number;
  description: string;
  observation: string;
}

export interface TransactionDrilldown {
  transaction: {
    transaction_id: string;
    timestamp: string;
    batch_id: string;
    amount: number;
    currency: string;
    amount_usd_equiv: number;
    amount_to_median_ratio: number;
    channel: string;
    channel_action: string;
    payment_rail: string;
    rail_message_type: string;
    mandate_reference: string;
    narration: string;
    settlement_status: string;
    chargeback_flag: boolean;
  };
  customer: {
    customer_id: string;
    customer_name: string;
    customer_type: string;
    customer_segment: string;
    product_package: string;
    kyc_level: string;
    kyc_risk_band: string;
    relationship_tenure_days: number;
    pep_flag: boolean;
    sanction_match_flag: boolean;
    dormancy_days_prior: number;
    baseline_median_usd_90d: number;
    baseline_avg_usd_90d: number;
    historical_alert_count: number;
    historical_confirmed_fraud: number;
  };
  device_and_channel: {
    touchpoint_id: string;
    device_id: string;
    device_type: string;
    device_os: string;
    device_app_version: string;
    device_trusted_flag: boolean;
    device_first_seen_days_prior: number;
    accounts_seen_on_device_30d: number;
    atm_pos_terminal_id: string;
    terminal_city: string;
    terminal_province: string;
    terminal_risk_tier: string;
    session_id: string;
    ip_address_masked: string;
    ip_risk_score: number;
    vpn_proxy_flag: boolean;
    tor_exit_node_flag: boolean;
    device_anomaly_score: number;
  };
  auth_and_security: {
    auth_method: string;
    auth_factor_count: number;
    auth_success_flag: boolean;
    login_failures_prior_30m: number;
    password_reset_hours_prior: number | null;
    sim_swap_days_prior: number | null;
    impossible_travel_flag: boolean;
    geo_distance_from_home_km: number;
    minutes_since_prior_transaction: number;
    daily_spend_velocity_rank: number;
    sliding_count_10m: number;
    sliding_amount_1h_usd: number;
  };
  counterparty: {
    beneficiary_id: string;
    beneficiary_name: string;
    beneficiary_account: string;
    beneficiary_type: string;
    beneficiary_relationship: string;
    destination_institution: string;
    destination_country: string;
    destination_city: string;
    destination_risk_score: number;
    beneficiary_prior_txn_count: number;
    beneficiary_first_interaction_date: string;
    beneficiary_account_age_days: number;
    distinct_senders_to_beneficiary_30d: number;
  };
  alert_evaluation: {
    alert_id: string;
    alert_score: number;
    alert_severity: string;
    primary_pattern: string;
    reason_codes: string;
    behavioral_deviation_score: number;
    potential_exposure_usd: number;
    case_id: string;
    case_status: string;
    analyst_queue: string;
    human_disposition: string;
    disposition_reason: string;
    escalation_required: boolean;
    escalation_tier: string;
  };
  triggered_rules: TriggeredRule[];
  counter_evidence: CounterEvidence[];
}
