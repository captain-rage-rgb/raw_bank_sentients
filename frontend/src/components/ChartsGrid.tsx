'use client';

import React from 'react';
import { AnalyticsData } from '@/types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Radio,
  MapPin,
  Laptop,
  Users,
  AlertOctagon,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

interface ChartsGridProps {
  analytics: AnalyticsData | null;
  isLoading?: boolean;
}

const SEVERITY_COLORS = {
  CRITICAL: '#EF4444',
  HIGH: '#F97316',
  MEDIUM: '#F59E0B',
  LOW: '#3B82F6',
};

const CHANNEL_COLORS: Record<string, string> = {
  ILLICOCASH: '#06B6D4',
  RAWBANK_ONLINE: '#3B82F6',
  CARD: '#8B5CF6',
  ATM: '#10B981',
  SIOP: '#F59E0B',
  VISA_DIRECT: '#EC4899',
  AGENT_BANKING: '#6366F1',
  SWIFT_LIGHT: '#14B8A6',
  BRANCH: '#64748B',
};

export const ChartsGrid: React.FC<ChartsGridProps> = ({ analytics, isLoading }) => {
  if (isLoading || !analytics) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 h-80 rounded-xl bg-[#0F1D38]/60 border border-[#1E2E4E] animate-pulse" />
        <div className="h-80 rounded-xl bg-[#0F1D38]/60 border border-[#1E2E4E] animate-pulse" />
        <div className="h-80 rounded-xl bg-[#0F1D38]/60 border border-[#1E2E4E] animate-pulse" />
        <div className="lg:col-span-2 h-80 rounded-xl bg-[#0F1D38]/60 border border-[#1E2E4E] animate-pulse" />
      </div>
    );
  }

  // Aggregate weekly or downsample daily trends to ~13 week intervals for smooth view
  const trends = analytics.daily_trends || [];

  // Channel data formatted
  const channelData = (analytics.channel_distribution || []).map((c) => ({
    name: (c.channel || '').replace('_', ' '),
    raw_channel: c.channel,
    alerts: c.alert_count,
    txns: c.total_txns,
    rate: c.alert_rate,
    volume: c.total_volume_usd,
    exposure: c.exposure_usd,
  }));

  // Geographic data sorted
  const geoData = (analytics.geographic_distribution || []).slice(0, 6);

  return (
    <div className="space-y-6 mb-8">
      {/* Row 1: Time Series Trend & Channel Risk Radar/Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Alerts & Volume Trend */}
        <div className="lg:col-span-2 rounded-xl bg-[#0F1D38] border border-[#1E2E4E] p-5 shadow-lg shadow-black/20 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#E3A008]" />
                90-Day Anomaly & Threat Velocity Timeline
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Daily alert cadence with Critical &amp; High severity surges
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E3A008]" /> Alert Count
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Critical Threats
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="alertGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E3A008" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#E3A008" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="critGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2E4E" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#64748B"
                  fontSize={10}
                  tickFormatter={(val: string) => {
                    const parts = val.split('-');
                    return parts.length >= 3 ? `${parts[1]}/${parts[2]}` : val;
                  }}
                  minTickGap={25}
                />
                <YAxis stroke="#64748B" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A1324',
                    borderColor: '#1E2E4E',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#F8FAFC',
                  }}
                  labelStyle={{ color: '#E3A008', fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="alert_count"
                  name="Total Alerts"
                  stroke="#E3A008"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#alertGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="critical_count"
                  name="Critical Alerts"
                  stroke="#EF4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#critGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Risk Distribution */}
        <div className="rounded-xl bg-[#0F1D38] border border-[#1E2E4E] p-5 shadow-lg shadow-black/20 flex flex-col justify-between">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              Omnichannel Threat Exposure
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Alert rate and volume distribution per banking channel
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData} layout="vertical" margin={{ top: 5, right: 10, left: 15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2E4E" horizontal={false} />
                <XAxis type="number" stroke="#64748B" fontSize={10} />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={9} width={80} />
                <Tooltip
                  formatter={(val: any, name: any) => [val, name === 'alerts' ? 'Flagged Alerts' : 'Total Txns']}
                  contentStyle={{
                    backgroundColor: '#0A1324',
                    borderColor: '#1E2E4E',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#F8FAFC',
                  }}
                />
                <Bar dataKey="alerts" name="Flagged Alerts" fill="#E3A008" radius={[0, 4, 4, 0]}>
                  {channelData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHANNEL_COLORS[entry.raw_channel] || '#3B82F6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Geographic Footprint & Entity Risk Intelligence Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Geographic Distribution */}
        <div className="rounded-xl bg-[#0F1D38] border border-[#1E2E4E] p-5 shadow-lg shadow-black/20 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              Geographic Concentration
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Top operational hubs by flagged anomaly volume
            </p>
          </div>

          <div className="space-y-3">
            {geoData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#070D19]/60 border border-[#1E2E4E]/60">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-semibold text-slate-200">{item.city}</span>
                    <p className="text-[10px] text-slate-400">{item.total_txns} total txns</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-amber-400">{item.alert_count} alerts</span>
                  <p className="text-[10px] text-slate-400">
                    ${(item.exposure_usd / 1000).toFixed(0)}k exp
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flagged Shared Devices (FR-13 & Syndicate Detection) */}
        <div className="rounded-xl bg-[#0F1D38] border border-[#1E2E4E] p-5 shadow-lg shadow-black/20 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Laptop className="w-4 h-4 text-purple-400" />
              Flagged Multi-Account Devices (FR-13)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Hardware signatures linked across 3+ unrelated customer accounts
            </p>
          </div>

          <div className="space-y-2.5">
            {(analytics.top_risky_entities?.flagged_devices || []).map((dev, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-[#070D19]/60 border border-[#1E2E4E] flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-300">{dev.device_id}</span>
                    <span className="px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] font-semibold">
                      {dev.device_type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{dev.device_os}</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold border border-red-500/30 text-[10px]">
                    {dev.accounts_seen} Accounts
                  </span>
                  <p className="text-[10px] text-amber-400 mt-1">{dev.alert_count} alerts triggered</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suspicious Beneficiaries & Mule Detection (FR-14) */}
        <div className="rounded-xl bg-[#0F1D38] border border-[#1E2E4E] p-5 shadow-lg shadow-black/20 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              High-Risk Mule Beneficiaries (FR-14)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Counterparties funneling funds from 5+ distinct customers
            </p>
          </div>

          <div className="space-y-2.5">
            {(analytics.top_risky_entities?.suspicious_beneficiaries || []).map((ben, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-[#070D19]/60 border border-[#1E2E4E] flex items-center justify-between text-xs">
                <div className="max-w-[65%]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-amber-300">{ben.beneficiary_id}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {ben.beneficiary_type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5" title={ben.beneficiary_name}>
                    {ben.beneficiary_name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold border border-red-500/30 text-[10px]">
                    {ben.max_senders} Senders
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">${(ben.total_received_usd).toLocaleString()} USD</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
