'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { KpiRibbon } from '@/components/KpiRibbon';
import { ChartsGrid } from '@/components/ChartsGrid';
import { AlertsTable } from '@/components/AlertsTable';
import { InvestigationDrawer } from '@/components/InvestigationDrawer';
import { KPIsData, AnalyticsData, AlertItem, TransactionDrilldown } from '@/types';
import { fetchKPIs, fetchAnalytics, fetchAlerts, fetchTransaction } from '@/lib/api';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function SentientCommandCentre() {
  const [mounted, setMounted] = useState(false);

  // State
  const [kpis, setKpis] = useState<KPIsData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedChannel, setSelectedChannel] = useState('ALL');
  const [selectedQueue, setSelectedQueue] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Transaction for Forensic Drilldown Drawer
  const [selectedTxnId, setSelectedTxnId] = useState<string | null>(null);
  const [drilldownData, setDrilldownData] = useState<TransactionDrilldown | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Loading & Error States
  const [isLoadingKPIs, setIsLoadingKPIs] = useState(true);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(true);
  const [isLoadingDrilldown, setIsLoadingDrilldown] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Fetch Executive KPIs
  const loadKPIs = useCallback(async () => {
    try {
      setIsLoadingKPIs(true);
      const data = await fetchKPIs();
      setKpis(data);
      setErrorMessage(null);
    } catch (err: any) {
      console.error('Error loading KPIs:', err);
      setErrorMessage(err.message || 'Failed to connect to backend server');
    } finally {
      setIsLoadingKPIs(false);
    }
  }, []);

  // 2. Fetch Analytics Data
  const loadAnalytics = useCallback(async () => {
    try {
      setIsLoadingAnalytics(true);
      const data = await fetchAnalytics();
      setAnalytics(data);
    } catch (err: any) {
      console.error('Error loading Analytics:', err);
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, []);

  // 3. Fetch Alert Queue
  const loadAlerts = useCallback(async () => {
    try {
      setIsLoadingAlerts(true);
      const res = await fetchAlerts({
        page,
        pageSize,
        severity: selectedSeverity,
        channel: selectedChannel,
        queue: selectedQueue,
        search: searchTerm,
      });
      setAlerts(res.items);
      setTotalAlerts(res.total);
      setTotalPages(res.total_pages);
    } catch (err: any) {
      console.error('Error loading alerts:', err);
    } finally {
      setIsLoadingAlerts(false);
    }
  }, [page, pageSize, selectedSeverity, selectedChannel, selectedQueue, searchTerm]);

  // Initial load
  useEffect(() => {
    setMounted(true);
    loadKPIs();
    loadAnalytics();
  }, [loadKPIs, loadAnalytics]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  // Open Forensic Drilldown
  const handleSelectTransaction = async (txnId: string) => {
    setSelectedTxnId(txnId);
    setIsDrawerOpen(true);
    setIsLoadingDrilldown(true);
    try {
      const data = await fetchTransaction(txnId);
      setDrilldownData(data);
    } catch (err: any) {
      console.error('Failed to load transaction drilldown:', err);
    } finally {
      setIsLoadingDrilldown(false);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleRefreshAll = () => {
    loadKPIs();
    loadAnalytics();
    loadAlerts();
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#070D19] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#E3A008] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070D19] text-slate-100 flex flex-col font-sans">
      {/* Top Operational Header */}
      <Header
        onRefresh={handleRefreshAll}
        isLoading={isLoadingKPIs || isLoadingAnalytics || isLoadingAlerts}
        totalTxns={kpis?.total_transactions || 2500}
        totalAlerts={kpis?.total_alerts || 374}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error Alert Banner if Backend is down */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>
                <strong>Backend Connection Notice:</strong> {errorMessage}. Ensure the FastAPI server is running on <code className="bg-red-900/50 px-1 py-0.5 rounded font-mono">http://localhost:8000</code>.
              </span>
            </div>
            <button
              onClick={handleRefreshAll}
              className="px-3 py-1 rounded bg-red-800 hover:bg-red-700 text-white font-bold transition-all text-xs shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Section 1: Executive KPI Ribbon */}
        <KpiRibbon kpis={kpis} isLoading={isLoadingKPIs} />

        {/* Section 2: Recharts Intelligence & Trend Grid */}
        <ChartsGrid analytics={analytics} isLoading={isLoadingAnalytics} />

        {/* Section 3: Alert Triage Queue DataTable */}
        <AlertsTable
          alerts={alerts}
          total={totalAlerts}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          isLoading={isLoadingAlerts}
          selectedSeverity={selectedSeverity}
          selectedChannel={selectedChannel}
          selectedQueue={selectedQueue}
          searchTerm={searchTerm}
          onPageChange={(p) => setPage(p)}
          onSeverityChange={(sev) => {
            setSelectedSeverity(sev);
            setPage(1);
          }}
          onChannelChange={(ch) => {
            setSelectedChannel(ch);
            setPage(1);
          }}
          onQueueChange={(q) => {
            setSelectedQueue(q);
            setPage(1);
          }}
          onSearchChange={(q) => {
            setSearchTerm(q);
            setPage(1);
          }}
          onSelectTransaction={handleSelectTransaction}
          selectedTxnId={selectedTxnId}
        />
      </main>

      {/* Slide-over Forensic Drill-Down Drawer */}
      <InvestigationDrawer
        transaction={drilldownData}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        isLoading={isLoadingDrilldown}
      />

      {/* Operational Footer */}
      <footer className="border-t border-[#1E2E4E] bg-[#0A1324] px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 mt-12">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#E3A008]" />
          <span>Rawbank Sentient Fraud Intelligence Platform &bull; Kinshasa Command Centre</span>
        </div>
        <div>
          <span>Deterministic Ground Truth Compliance: 100% &bull; Canonical Dataset: RAWBANK_SENTIENT_KB.csv</span>
        </div>
      </footer>
    </div>
  );
}
