"use client";

import { Search, Filter, MoreHorizontal } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { useState } from "react";

export default function CustomerList() {
  const { customers, selectedCustomer, setSelectedCustomer } = useDashboard();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.plan.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="bg-card border border-card-border rounded-2xl p-6 flex flex-col h-full shadow-xl transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-bright">Lista de Clientes</h3>
        <button 
          onClick={() => alert("Abriendo opciones de lista...")}
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
            placeholder="Buscar clientes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-hover/40 border border-card-border rounded-lg pl-9 pr-4 py-2 text-sm text-text-bright focus:outline-none focus:border-brand-red/50 transition-all placeholder:text-text-muted/50"
          />
        </div>
        <button 
          onClick={() => alert("Los filtros avanzados se abrirán aquí")}
          className="flex items-center gap-2 px-3 py-2 bg-hover/40 border border-card-border rounded-lg text-sm font-medium text-text-muted hover:text-text-bright hover:bg-hover transition-all"
        >
          <Filter size={16} />
          Filtro
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-card-border/80">
              <th className="pb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Nombre</th>
              <th className="pb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Plan</th>
              <th className="pb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Puntuación de Riesgo</th>
              <th className="pb-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c) => {
              const isSelected = selectedCustomer.id === c.id;
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
                      <img src={c.avatar} alt={c.name} className={`w-8 h-8 rounded-full bg-hover transition-all ${isSelected ? 'ring-2 ring-brand-red ring-offset-2 ring-offset-card' : ''}`} />
                      <span className={`text-sm font-medium ${isSelected ? 'text-brand-red font-semibold' : 'text-text-bright'}`}>{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-text-muted">{c.plan}</td>
                  <td className="py-3 px-4 text-sm font-semibold" style={{ color: c.risk > 70 ? '#ef4444' : c.risk > 40 ? '#f59e0b' : '#10b981' }}>
                    {c.risk}% Riesgo
                  </td>
                  <td className="py-3 pl-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${
                      c.status === 'At Risk' 
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' 
                        : c.status === 'Neutral'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    }`}>
                      {c.status === 'At Risk' ? 'En Riesgo' : c.status === 'Neutral' ? 'Neutral' : 'Estable'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
