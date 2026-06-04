"use client";

import { MoreHorizontal } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useDashboard } from "@/context/DashboardContext";

export default function CustomerProfile() {
  const { selectedCustomer, t } = useDashboard();

  // Translate XAI category labels dynamically based on the current language
  const translatedXaiData = selectedCustomer.xaiData.map(item => {
    let translatedName = item.name;
    if (item.name.toLowerCase() === 'pricing') translatedName = t.customerProfile.pricing;
    else if (item.name.toLowerCase() === 'support') translatedName = t.customerProfile.support;
    else if (item.name.toLowerCase() === 'features') translatedName = t.customerProfile.features;
    else if (item.name.toLowerCase() === 'usability') translatedName = t.customerProfile.usability;
    return { ...item, name: translatedName };
  });

  return (
    <div className="bg-card border border-card-border rounded-2xl p-6 shadow-xl h-full flex flex-col transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-bright">{t.customerProfile.title}</h3>
        <button className="text-text-muted hover:text-text-bright transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <img 
          src={selectedCustomer.avatar} 
          alt={selectedCustomer.name} 
          className="w-14 h-14 rounded-full bg-hover border-2 border-card-border"
        />
        <div>
          <h4 className="text-text-bright font-bold text-lg">{selectedCustomer.name}</h4>
          <p className="text-text-muted text-sm">{t.customerProfile.joined(selectedCustomer.joinedDate)} • {selectedCustomer.plan}</p>
        </div>
      </div>

      <h4 className="text-text-bright font-semibold mb-2">{t.customerProfile.xaiTitle}</h4>
      <p className="text-text-muted text-sm mb-4">{t.customerProfile.xaiSubtitle}</p>

      <div className="flex-1 w-full min-h-[180px] -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={translatedXaiData}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ className: 'fill-text-muted', fontSize: 12 }} 
              width={70} 
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--card-border)', 
                borderRadius: '8px', 
                color: 'var(--foreground)' 
              }}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
              {translatedXaiData.map((entry, index) => {
                // Map hardcoded colors to Arca Continental palette
                const barColor = entry.color === '#ef4444' 
                  ? 'var(--brand-red)' 
                  : entry.color === '#f59e0b' 
                  ? 'var(--brand-brown)' 
                  : '#10b981';
                return <Cell key={`cell-${index}`} fill={barColor} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
