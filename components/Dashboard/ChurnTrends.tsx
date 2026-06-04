"use client";

import { MoreHorizontal } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', churn: 1200, retention: 2400, new: 1800 },
  { name: 'Feb', churn: 2100, retention: 1398, new: 2800 },
  { name: 'Mar', churn: 800, retention: 4800, new: 1900 },
  { name: 'Apr', churn: 3908, retention: 3908, new: 2000 },
  { name: 'May', churn: 1800, retention: 4800, new: 2181 },
  { name: 'Jun', churn: 2390, retention: 3800, new: 2500 },
  { name: 'Jul', churn: 3490, retention: 4300, new: 2100 },
];

export default function ChurnTrends() {
  return (
    <div className="bg-card border border-card-border rounded-2xl p-6 shadow-xl h-full flex flex-col relative overflow-hidden transition-colors duration-300">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-lg font-semibold text-text-bright">Tendencias de Churn (Últimos 6 Meses)</h3>
        <button className="text-text-muted hover:text-text-bright transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="flex-1 w-full min-h-[250px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorChurn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--brand-red)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--brand-red)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--brand-brown)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--brand-brown)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--card-border)', 
                borderRadius: '8px', 
                color: 'var(--foreground)' 
              }}
              itemStyle={{ color: 'var(--foreground)' }}
            />
            <Area type="monotone" dataKey="churn" stroke="var(--brand-red)" strokeWidth={3} fillOpacity={1} fill="url(#colorChurn)" />
            <Area type="monotone" dataKey="retention" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRetention)" />
            <Area type="monotone" dataKey="new" stroke="var(--brand-brown)" strokeWidth={3} fillOpacity={1} fill="url(#colorNew)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
