"use client";

import { Search, Filter, MoreHorizontal } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { useState, useEffect } from "react";

export default function CustomerList() {
  const { dashboardCustomers, selectedCustomer, setSelectedCustomer, fetchDashboardCustomers, t, dashboardPagination } = useDashboard();
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce the backend query on search input change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDashboardCustomers(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="bg-card border border-card-border rounded-2xl p-6 flex flex-col h-full shadow-xl transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-bright">{t.customerList.title}</h3>
        <button 
          onClick={() => alert(t.customerList.filterAlert)}
          className="text-text-muted hover:text-text-bright transition-colors"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand-red transition-colors" />
          <input 
            type="text" 
            placeholder={t.customerList.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-hover/40 border border-card-border rounded-lg pl-9 pr-4 py-2 text-sm text-text-bright focus:outline-none focus:border-brand-red/50 transition-all placeholder:text-text-muted/50"
          />
        </div>
        <button 
          onClick={() => alert(t.customerList.filterAlert)}
          className="flex items-center gap-2 px-3 py-2 bg-hover/40 border border-card-border rounded-lg text-sm font-medium text-text-muted hover:text-text-bright hover:bg-hover transition-all"
        >
          <Filter size={16} />
          {t.customerList.filterLabel}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-auto scrollbar-custom min-h-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-card-border/80">
              <th className="pb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">CLIENTE</th>
              <th className="pb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">SCORE RIESGO</th>
              <th className="pb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">NIVEL RIESGO</th>
              <th className="pb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">TAMAÑO</th>
            </tr>
          </thead>
          <tbody>
            {dashboardCustomers.map((c, index) => {
              const isSelected = selectedCustomer?.id === c.id;
              const isHighRisk = c.riskLevel === "High" || c.riskLevel === "Critical";
              const isMediumRisk = c.riskLevel === "Medium";
              return (
                <tr 
                  key={c.id} 
                  onClick={() => setSelectedCustomer(c)}
                  className={`border-b border-card-border/30 cursor-pointer transition-colors group ${
                    isSelected ? 'bg-brand-red-muted/40' : 'hover:bg-hover/30'
                  }`}
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${isSelected ? 'text-brand-red' : 'text-text-bright'}`}>
                        {c.id}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold" style={{ color: isHighRisk ? '#ef4444' : isMediumRisk ? '#f59e0b' : '#10b981' }}>
                    {c.churnProbability}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${
                      isHighRisk 
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' 
                        : isMediumRisk
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    }`}>
                      {c.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 pl-4 text-sm text-text-muted font-medium">
                    {c.customerSize || "Unknown"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {dashboardPagination && dashboardPagination.totalPages > 1 && (
        <div className="mt-4 pt-4 border-t border-card-border/80 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            Página {dashboardPagination.page} de {dashboardPagination.totalPages}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => fetchDashboardCustomers(searchQuery, dashboardPagination.page - 1)}
              disabled={dashboardPagination.page <= 1}
              className="px-3 py-1.5 text-xs font-semibold rounded-md border border-card-border bg-hover/30 text-text-muted hover:text-text-bright hover:bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <button 
              onClick={() => fetchDashboardCustomers(searchQuery, dashboardPagination.page + 1)}
              disabled={dashboardPagination.page >= dashboardPagination.totalPages}
              className="px-3 py-1.5 text-xs font-semibold rounded-md border border-card-border bg-hover/30 text-text-muted hover:text-text-bright hover:bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
