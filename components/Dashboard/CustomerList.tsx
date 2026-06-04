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
    <div className="bg-[#121620] border border-slate-800 rounded-2xl p-6 flex flex-col h-full shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Interactive Customer List</h3>
        <button 
          onClick={() => alert("Opening List Options...")}
          className="text-slate-500 hover:text-white transition-colors"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search customers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-yellow-500/50 transition-all placeholder:text-slate-600"
          />
        </div>
        <button 
          onClick={() => alert("Advanced Filters Modal would open here")}
          className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
        >
          <Filter size={16} />
          Filter
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80">
              <th className="pb-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th className="pb-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Plan</th>
              <th className="pb-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Risk Score</th>
              <th className="pb-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c) => {
              const isSelected = selectedCustomer.id === c.id;
              return (
                <tr 
                  key={c.id} 
                  onClick={() => setSelectedCustomer(c)}
                  className={`border-b border-slate-800/30 cursor-pointer transition-colors group ${
                    isSelected ? 'bg-slate-800/40' : 'hover:bg-slate-800/20'
                  }`}
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <img src={c.avatar} alt={c.name} className={`w-8 h-8 rounded-full bg-slate-800 transition-all ${isSelected ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-[#121620]' : ''}`} />
                      <span className={`text-sm font-medium ${isSelected ? 'text-yellow-400' : 'text-white'}`}>{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-300">{c.plan}</td>
                  <td className="py-3 px-4 text-sm font-semibold" style={{ color: c.risk > 70 ? '#ef4444' : c.risk > 40 ? '#f59e0b' : '#10b981' }}>
                    {c.risk}% Risk
                  </td>
                  <td className="py-3 pl-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                      c.status === 'At Risk' 
                        ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                        : c.status === 'Neutral'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {c.status}
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
