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

        </div>
      </div>

      {/* Grid of metrics */}
      <div className="grid grid-cols-1 gap-4 mb-6 flex-1 overflow-y-auto pr-1 scrollbar-custom min-h-0">
        {/* Basic Information */}
        <div className="border border-card-border/60 bg-hover/10 rounded-xl p-4">
          <div className="grid grid-cols-1 gap-3 text-sm min-w-0">
            <div className="min-w-0">
              <span className="text-text-muted block text-xs uppercase tracking-wider font-semibold">ID Real</span>
              <div className="overflow-x-auto whitespace-nowrap scrollbar-custom pb-1 mt-0.5">
                <span className="font-semibold text-text-bright">{selectedCustomer.realId || "N/A"}</span>
              </div>
            </div>
            <div>
              <span className="text-text-muted block text-xs uppercase tracking-wider font-semibold">Tamaño</span>
              <span className="font-semibold text-text-bright">{selectedCustomer.customerSize || "Unknown"}</span>
            </div>
          </div>
        </div>

        {/* Abandonment Reason */}
        <div className="border border-card-border/60 bg-hover/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-text-bright uppercase tracking-wider">
            <Activity size={14} className="text-brand-red" />
            <span>Razón de Abandono</span>
          </div>
          <div>
            <span className="font-semibold text-text-bright text-sm">{selectedCustomer.abandonmentReason || "N/A"}</span>
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
        </div>
      </div>
    </div>
  );
}
