"use client";

import { MoreHorizontal, Calendar, CreditCard, Activity, ShieldAlert, LifeBuoy } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export default function CustomerProfile() {
  const { selectedCustomer, t } = useDashboard();

  const isHighRisk = selectedCustomer.riskLevel === "High" || selectedCustomer.riskLevel === "Critical";
  const isMediumRisk = selectedCustomer.riskLevel === "Medium";
  
  // Custom theme colors matching Arca Continental (brand-red, brand-brown, etc.)
  const riskColor = isHighRisk 
    ? "text-brand-red border-brand-red-border bg-brand-red-muted/30" 
    : isMediumRisk 
    ? "text-brand-brown border-brand-brown-border bg-brand-brown-muted/30" 
    : "text-emerald-500 border-emerald-500/20 bg-emerald-500/10";
    
  const riskBorderColor = isHighRisk 
    ? "border-brand-red-border/60" 
    : isMediumRisk 
    ? "border-brand-brown-border/60" 
    : "border-emerald-500/20";
    
  const riskGlow = isHighRisk 
    ? "shadow-brand-red/10" 
    : isMediumRisk 
    ? "shadow-brand-brown/10" 
    : "shadow-emerald-500/10";

  return (
    <div className="bg-card border border-card-border rounded-2xl p-6 shadow-xl h-full flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-bright">{t.customerProfile.title}</h3>
        <button className="text-text-muted hover:text-text-bright transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <img 
          src={selectedCustomer.avatar} 
          alt={selectedCustomer.name} 
          className="w-14 h-14 rounded-full bg-hover border-2 border-card-border"
        />
        <div className="min-w-0 flex-1">
          <h4 className="text-text-bright font-bold text-base truncate">{selectedCustomer.name}</h4>
          <p className="text-text-muted text-xs truncate">{selectedCustomer.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-hover/80 text-text-bright border border-card-border">
            {selectedCustomer.planTier} Plan
          </span>
        </div>
      </div>

      {/* Grid of metrics */}
      <div className="grid grid-cols-1 gap-4 mb-6 flex-1 overflow-y-auto max-h-[320px] pr-1">
        {/* Interaction & Usage */}
        <div className="border border-card-border/60 bg-hover/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-text-bright uppercase tracking-wider">
            <Activity size={14} className="text-brand-red" />
            <span>Uso e Interacción</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-text-muted block">{t.customerProfile.lastLogin}</span>
              <span className="font-semibold text-text-bright">{selectedCustomer.lastLogin}</span>
            </div>
            <div>
              <span className="text-text-muted block">{t.customerProfile.daysInactive}</span>
              <span className={`font-semibold ${selectedCustomer.daysInactive > 7 ? 'text-brand-red' : 'text-text-bright'}`}>
                {selectedCustomer.daysInactive} d
              </span>
            </div>
            <div>
              <span className="text-text-muted block">{t.customerProfile.sessions}</span>
              <span className="font-semibold text-text-bright">{selectedCustomer.sessionsLast30d}</span>
            </div>
            <div>
              <span className="text-text-muted block">{t.customerProfile.weeklyTime}</span>
              <span className="font-semibold text-text-bright">{selectedCustomer.timeSpentWeekly} min</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-text-muted">{t.customerProfile.usage}</span>
              <span className="font-semibold text-text-bright">{selectedCustomer.coreFeatureUsage}%</span>
            </div>
            <div className="w-full bg-hover rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-brand-brown to-brand-red h-full rounded-full transition-all duration-500" 
                style={{ width: `${selectedCustomer.coreFeatureUsage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Financial & Support split */}
        <div className="grid grid-cols-2 gap-4">
          {/* Financials */}
          <div className="border border-card-border/60 bg-hover/10 rounded-xl p-4 text-xs">
            <div className="flex items-center gap-2 mb-2.5 font-semibold text-text-bright uppercase tracking-wider text-[10px]">
              <CreditCard size={13} className="text-brand-red" />
              <span>Finanzas</span>
            </div>
            <div className="space-y-1.5">
              <div>
                <span className="text-text-muted block">MRR</span>
                <span className="font-bold text-text-bright">${selectedCustomer.mrr}</span>
              </div>
              <div>
                <span className="text-text-muted block">{t.customerProfile.failures}</span>
                <span className={`font-semibold ${selectedCustomer.paymentFailures > 0 ? 'text-brand-red' : 'text-text-bright'}`}>
                  {selectedCustomer.paymentFailures}
                </span>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="border border-card-border/60 bg-hover/10 rounded-xl p-4 text-xs">
            <div className="flex items-center gap-2 mb-2.5 font-semibold text-text-bright uppercase tracking-wider text-[10px]">
              <LifeBuoy size={13} className="text-brand-red" />
              <span>Soporte</span>
            </div>
            <div className="space-y-1.5">
              <div>
                <span className="text-text-muted block">{t.customerProfile.tickets}</span>
                <span className={`font-semibold ${selectedCustomer.openTickets > 2 ? 'text-brand-red' : 'text-text-bright'}`}>
                  {selectedCustomer.openTickets}
                </span>
              </div>
              <div>
                <span className="text-text-muted block">{t.customerProfile.nps}</span>
                <span className={`font-bold ${selectedCustomer.npsScore < 6 ? 'text-brand-red' : selectedCustomer.npsScore < 8 ? 'text-brand-brown' : 'text-emerald-500'}`}>
                  {selectedCustomer.npsScore}/10
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Diagnostic Card */}
      <div className={`mt-auto border rounded-xl p-4 shadow-md transition-all duration-300 ${riskColor} ${riskBorderColor} ${riskGlow}`}>
        <div className="flex items-center gap-2 mb-3 font-bold uppercase tracking-wider text-xs">
          <ShieldAlert size={16} />
          <span>{t.customerProfile.predictionTitle}</span>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>{t.customerProfile.probLabel}</span>
              <span>{selectedCustomer.churnProbability}%</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden border border-white/5">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${isHighRisk ? 'bg-brand-red' : isMediumRisk ? 'bg-brand-brown' : 'bg-emerald-500'}`} 
                style={{ width: `${selectedCustomer.churnProbability}%` }}
              />
            </div>
          </div>
          <div className="text-xs">
            <span className="text-white/60 block">{t.customerProfile.factorLabel}</span>
            <span className="font-semibold text-text-bright truncate block">
              {t.customerProfile.factors[selectedCustomer.primaryRiskFactor]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
