'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { KpiRibbon } from '@/components/KpiRibbon';
import { ChartsGrid } from '@/components/ChartsGrid';
import { AlertsTable } from '@/components/AlertsTable';
import { ForensicDrawer } from '@/components/ForensicDrawer';
import { KPIsData, AnalyticsData, AlertItem, TransactionDrilldown } from '@/types';
import { fetchKPIs, fetchAnalytics, fetchAlerts, fetchTransaction } from '@/lib/api';
import { ShieldAlert, AlertCircle, Sparkles, Building2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function SentientCommandCentre() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('overview');

  // Operational Data State
  const [kpis, setKpis] = useState<KPIsData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);

  // Filters State
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedChannel, setSelectedChannel] = useState('ALL');
  const [selectedQueue, setSelectedQueue] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Transaction for 360-Degree Forensic Drilldown
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
      setErrorMessage(err.message || 'Failed to connect to Rawbank Sentient backend');
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
    loadKPIs();
    loadAnalytics();
  }, [loadKPIs, loadAnalytics]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  // Handle Refresh All
  const handleRefreshAll = () => {
    loadKPIs();
    loadAnalytics();
    loadAlerts();
  };

  // Handle Transaction Click for 360-degree forensic inspection
  const handleSelectTransaction = async (txnId: string) => {
    setSelectedTxnId(txnId);
    setIsDrawerOpen(true);
    setIsLoadingDrilldown(true);
    try {
      const data = await fetchTransaction(txnId);
      setDrilldownData(data);
    } catch (err) {
      console.error('Failed to load transaction drilldown:', err);
    } finally {
      setIsLoadingDrilldown(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex">
      {/* 1. Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          // Scroll smoothly to relevant section if on overview
          if (tab === 'alerts') {
            document.getElementById('alerts-section')?.scrollIntoView({ behavior: 'smooth' });
          } else if (tab === 'analytics' || tab === 'channels' || tab === 'entities') {
            document.getElementById('analytics-section')?.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        totalAlerts={kpis?.total_alerts || totalAlerts}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar
          onRefresh={handleRefreshAll}
          isLoading={isLoadingKPIs || isLoadingAnalytics || isLoadingAlerts}
          totalTxns={kpis?.total_transactions}
          totalAlerts={kpis?.total_alerts}
          alertRate={kpis?.alert_rate}
        />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Global Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
                <span>
                  <strong>Connection Error:</strong> {errorMessage}. Ensure backend is running at{' '}
                  <code className="bg-white px-1.5 py-0.5 rounded border border-[#FECACA]">http://127.0.0.1:8000</code>.
                </span>
              </div>
              <button
                onClick={handleRefreshAll}
                className="px-3 py-1 rounded-lg bg-white border border-[#FCA5A5] text-[#991B1B] hover:bg-[#FEF2F2] font-bold text-xs"
              >
                Retry
              </button>
            </div>
          )}

          {/* Welcome & Operational Hero Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-white via-[#FFF7ED]/50 to-[#FFF7ED] border border-[#FED7AA] p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFF7ED] text-[#C2410C] border border-[#FDBA74] text-[11px] font-bold">
                    Rawbank DRC &bull; Direction Générale Kinshasa
                  </span>
                  <span className="text-xs text-[#64748B] font-medium hidden sm:inline">
                    Central Risk Oversight
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-[#0F172A] tracking-tight">
                  Rawbank Sentient Fraud Command Centre
                </h2>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Real-time algorithmic surveillance, behavioral baseline deviation tracking, and multi-rail risk arbitration across Illicocash, Rawbank Online, ATMs, POS, and SIOP.
                </p>
              </div>

              {/* Quick Actions & Status Card */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs text-left min-w-[140px]">
                  <span className="text-[10px] uppercase font-bold text-[#64748B] block">Surveillance Status</span>
                  <strong className="text-xs text-[#059669] flex items-center gap-1 font-bold mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" /> ACTIVE 24/7
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs text-left min-w-[140px]">
                  <span className="text-[10px] uppercase font-bold text-[#64748B] block">Rule Engine</span>
                  <strong className="text-xs text-[#C2410C] font-bold mt-0.5 block">
                    FR-01 &ndash; FR-20
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Executive KPI Ribbon */}
          <KpiRibbon kpis={kpis} isLoading={isLoadingKPIs} />

          {/* 4. Analytics & Threat Velocity Visualizations */}
          <section id="analytics-section">
            <ChartsGrid analytics={analytics} isLoading={isLoadingAnalytics} />
          </section>

          {/* 5. Alert Queue Triage Table */}
          <section id="alerts-section">
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
              onSeverityChange={(s) => {
                setSelectedSeverity(s);
                setPage(1);
              }}
              onChannelChange={(c) => {
                setSelectedChannel(c);
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
          </section>
        </main>

        {/* 6. Footer */}
        <footer className="border-t border-[#E2E8F0] bg-white px-6 py-4 mt-8 text-xs text-[#64748B] flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0F172A]">Rawbank DRC</span>
            <span>&bull;</span>
            <span>Sentient Fraud Intelligence Platform (Use Case 01)</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Security Standard: ISO 27001 &bull; PCI-DSS Level 1</span>
            <span className="text-[#059669] font-medium">&bull; System Operational</span>
          </div>
        </footer>
      </div>

      {/* 7. Forensic Inspection Drawer (NO Copilot Tab - Dedicated Dashboard Forensic View) */}
      <ForensicDrawer
        transaction={drilldownData}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        isLoading={isLoadingDrilldown}
      />
    </div>
  );
}
