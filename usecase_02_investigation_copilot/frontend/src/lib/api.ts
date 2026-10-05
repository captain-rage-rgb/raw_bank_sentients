import { CopilotChatResponse, CopilotTransactionsResponse, CopilotTransactionItem } from '@/types';

const API_BASE =
  process.env.NEXT_PUBLIC_COPILOT_API_URL ||
  (typeof window === 'undefined' ? 'http://127.0.0.1:8001' : 'http://127.0.0.1:8001');

export async function fetchCopilotChat(
  transactionId: string,
  query: string
): Promise<CopilotChatResponse> {
  const res = await fetch(`${API_BASE}/api/copilot/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transaction_id: transactionId, query }),
    cache: 'no-store'
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Copilot investigation request failed: ${errText || res.statusText}`);
  }
  return res.json();
}

export async function fetchCopilotSuggestions(transactionId: string): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE}/api/copilot/suggestions/${encodeURIComponent(transactionId)}`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.suggestions || [];
  } catch (err) {
    console.error('Error fetching copilot suggestions:', err);
    return [];
  }
}

export async function fetchFlaggedTransactions(search?: string): Promise<CopilotTransactionItem[]> {
  try {
    const query = new URLSearchParams();
    query.set('limit', '40');
    if (search && search.trim()) query.set('search', search.trim());
    const res = await fetch(`${API_BASE}/api/copilot/transactions?${query.toString()}`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data: CopilotTransactionsResponse = await res.json();
    return data.transactions || [];
  } catch (err) {
    console.error('Error fetching flagged transactions:', err);
    return [];
  }
}
