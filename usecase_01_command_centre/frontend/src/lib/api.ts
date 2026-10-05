import { KPIsData, AnalyticsData, AlertsResponse, TransactionDrilldown } from '@/types';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window === 'undefined' ? 'http://127.0.0.1:8000' : 'http://127.0.0.1:8000');

export async function fetchKPIs(): Promise<KPIsData> {
  const res = await fetch(`${API_BASE}/api/kpis`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load KPIs: ${res.statusText}`);
  return res.json();
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const res = await fetch(`${API_BASE}/api/analytics`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load Analytics: ${res.statusText}`);
  return res.json();
}

export interface AlertFilterParams {
  page?: number;
  pageSize?: number;
  severity?: string;
  channel?: string;
  queue?: string;
  status?: string;
  search?: string;
}

export async function fetchAlerts(params: AlertFilterParams = {}): Promise<AlertsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.pageSize) query.set('page_size', String(params.pageSize));
  if (params.severity && params.severity !== 'ALL') query.set('severity', params.severity);
  if (params.channel && params.channel !== 'ALL') query.set('channel', params.channel);
  if (params.queue && params.queue !== 'ALL') query.set('queue', params.queue);
  if (params.status && params.status !== 'ALL') query.set('status', params.status);
  if (params.search) query.set('search', params.search);

  const res = await fetch(`${API_BASE}/api/alerts?${query.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load Alerts: ${res.statusText}`);
  return res.json();
}

export async function fetchTransaction(transactionId: string): Promise<TransactionDrilldown> {
  const res = await fetch(`${API_BASE}/api/transaction/${encodeURIComponent(transactionId)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load Transaction drilldown for ${transactionId}`);
  return res.json();
}
