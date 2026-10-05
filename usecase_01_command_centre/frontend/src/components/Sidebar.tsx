'use client';

import React from 'react';
import {
  ShieldAlert,
  BarChart3,
  Layers,
  FileText,
  Activity,
  Landmark,
  CheckCircle2,
  Users,
  CreditCard,
  Database
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  totalAlerts: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  totalAlerts,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview & KPIs', icon: Activity },
    { id: 'analytics', label: 'Threat Analytics', icon: BarChart3 },
    { id: 'entities', label: 'Entity Intelligence', icon: Users },
    { id: 'alerts', label: 'Alert Triage Queue', icon: ShieldAlert, badge: totalAlerts },
    { id: 'channels', label: 'Omnichannel Exposure', icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between shrink-0 shadow-sm min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#E2E8F0] bg-gradient-to-b from-[#FFF7ED]/50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A45] to-[#EA580C] p-0.5 shadow-md shadow-[#FF7A45]/20 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Landmark className="w-5 h-5 text-[#FF7A45]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-wider text-[#0F172A]">RAWBANK</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FFF7ED] text-[#EA580C] border border-[#FDBA74]">
                  SENTIENT
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] font-medium">Command Centre &bull; DRC</p>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-1">
          <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
            Operational Navigation
          </span>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#FFF7ED] text-[#C2410C] border border-[#FDBA74] shadow-sm font-bold'
                    : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#EA580C]' : 'text-[#64748B]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-[#EA580C] text-white'
                        : 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* System Status Footnote */}
      <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]/80">
        <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#64748B] font-medium flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#0284C7]" /> Engine State
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
              <CheckCircle2 className="w-3 h-3" /> Live DuckDB
            </span>
          </div>
          <div className="text-[11px] text-[#64748B] pt-1 border-t border-[#F1F5F9]">
            Dataset: <strong className="text-[#0F172A]">2,500 Events</strong> (90d)
          </div>
          <div className="text-[10px] text-[#94A3B8]">
            Kinshasa HQ Central Surveillance
          </div>
        </div>
      </div>
    </aside>
  );
};
