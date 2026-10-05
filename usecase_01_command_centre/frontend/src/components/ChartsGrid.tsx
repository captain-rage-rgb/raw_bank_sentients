'use client';

import React from 'react';
import { AnalyticsData } from '@/types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  Radio,
  MapPin,
  Laptop,
  Users,
} from 'lucide-react';

interface ChartsGridProps {
  analytics: AnalyticsData | null;
  isLoading?: boolean;
}

const CHANNEL_COLORS: Record<string, string> = {
  ILLICOCASH: '#0284C7',
  RAWBANK_ONLINE: '#2563EB',
  CARD: '#7C3AED',
  ATM: '#059669',
  SIOP: '#D97706',
  VISA_DIRECT: '#DB2777',
  AGENT_BANKING: '#4F46E5',
  SWIFT_LIGHT: '#0D9488',
  BRANCH: '#64748B',
};

export const ChartsGrid: React.FC<ChartsGridProps> = ({ analytics, isLoading }) => {
  if (isLoading || !analytics) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 h-80 rounded-xl bg-white border border-[#E2E8F0] shadow-xs animate-pulse" />
        <div className="h-80 rounded-xl bg-white border border-[#E2E8F0] shadow-xs animate-pulse" />
        <div className="h-80 rounded-xl bg-white border border-[#E2E8F0] shadow-xs animate-pulse" />
        <div className="lg:col-span-2 h-80 rounded-xl bg-white border border-[#E2E8F0] shadow-xs animate-pulse" />
      </div>
    );
  }

  const trends = analytics.daily_trends || [];

  const channelData = (analytics.channel_distribution || []).map((c) => ({
    name: (c.channel || '').replace(/_/g, ' '),
    raw_channel: c.channel,
    alerts: c.alert_count,
    txns: c.total_txns,
    rate: c.alert_rate,
    volume: c.total_volume_usd,
    exposure: c.exposure_usd,
  }));

  const geoData = (analytics.geographic_distribution || []).slice(0, 6);

  return (
    <div className="space-y-6 mb-8">
      {/* Row 1: Time Series Trend & Channel Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Alerts & Volume Trend */}
        <div className="lg:col-span-2 card-premium p-5 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#EA580C]" />
                90-Day Anomaly &amp; Threat Velocity Timeline
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Daily alert cadence with Critical &amp; High severity surges
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#334155] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A45]" /> Total Alerts
              </span>
              <span className="flex items-center gap-1.5 text-[#334155] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Critical Threats
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="apricotGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF7A45" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF7A45" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="critGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#94A3B8"
                  fontSize={10}
                  tickFormatter={(val: string) => {
                    const parts = val.split('-');
                    return parts.length >= 3 ? `${parts[1]}/${parts[2]}` : val;
                  }}
                  minTickGap={25}
                />
                <YAxis stroke="#94A3B8" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '10px',
                    fontSize: '11px',
                    color: '#0F172A',
                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)',
                  }}
                  labelStyle={{ color: '#C2410C', fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="alert_count"
                  name="Total Alerts"
                  stroke="#FF7A45"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#apricotGrad)"
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
        <div className="card-premium p-5 flex flex-col justify-between">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#0284C7]" />
              Omnichannel Threat Exposure
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Alert volume distribution per Rawbank digital rail
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData} layout="vertical" margin={{ top: 5, right: 10, left: 15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" stroke="#94A3B8" fontSize={10} />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={9} width={80} />
                <Tooltip
                  formatter={(val: any, name: any) => [val, name === 'alerts' ? 'Flagged Alerts' : 'Total Txns']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '10px',
                    fontSize: '11px',
                    color: '#0F172A',
                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)',
                  }}
                />
                <Bar dataKey="alerts" name="Flagged Alerts" fill="#FF7A45" radius={[0, 4, 4, 0]}>
                  {channelData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHANNEL_COLORS[entry.raw_channel] || '#0284C7'}
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
        <div className="card-premium p-5 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#E11D48]" />
              Geographic Concentration
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Top operational hubs by flagged anomaly volume
            </p>
          </div>

          <div className="space-y-2.5">
            {geoData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white border border-[#CBD5E1] text-[#334155] font-bold flex items-center justify-center text-[10px] shadow-2xs">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-[#0F172A]">{item.city}</span>
                    <p className="text-[10px] text-[#64748B]">{item.total_txns} total txns</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#C2410C] bg-[#FFF7ED] px-2 py-0.5 rounded-full border border-[#FDBA74]">
                    {item.alert_count} alerts
                  </span>
                  <p className="text-[10px] text-[#64748B] mt-0.5">
                    ${(item.exposure_usd / 1000).toFixed(0)}k exp
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flagged Shared Devices (FR-13 & Syndicate Detection) */}
        <div className="card-premium p-5 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Laptop className="w-4 h-4 text-[#7C3AED]" />
              Flagged Multi-Account Devices (FR-13)
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Hardware signatures linked across 3+ unrelated customer accounts
            </p>
          </div>

          <div className="space-y-2.5">
            {(analytics.top_risky_entities?.flagged_devices || []).map((dev, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#0F172A]">{dev.device_id}</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF] text-[10px] font-bold">
                      {dev.device_type}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5">{dev.device_os}</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#DC2626] font-bold border border-[#FECACA] text-[10px]">
                    {dev.accounts_seen} Accounts
                  </span>
                  <p className="text-[10px] text-[#EA580C] font-semibold mt-1">{dev.alert_count} alerts</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suspicious Beneficiaries & Mule Detection (FR-14) */}
        <div className="card-premium p-5 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#D97706]" />
              High-Risk Mule Beneficiaries (FR-14)
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Counterparties funneling funds from 5+ distinct customers
            </p>
          </div>

          <div className="space-y-2.5">
            {(analytics.top_risky_entities?.suspicious_beneficiaries || []).map((ben, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs">
                <div className="max-w-[65%]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[#0F172A]">{ben.beneficiary_id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#475569] border border-[#CBD5E1] font-medium">
                      {ben.beneficiary_type}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#334155] font-semibold truncate mt-0.5" title={ben.beneficiary_name}>
                    {ben.beneficiary_name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#DC2626] font-bold border border-[#FECACA] text-[10px]">
                    {ben.max_senders} Senders
                  </span>
                  <p className="text-[10px] text-[#64748B] font-semibold mt-1">${(ben.total_received_usd).toLocaleString()} USD</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
