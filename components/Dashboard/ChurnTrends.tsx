"use client";

import { MoreHorizontal } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useDashboard } from "@/context/DashboardContext";

export default function ChurnTrends() {
  const { reasonsStats } = useDashboard();

  // If there's no data, show a fallback
  const chartData = reasonsStats && reasonsStats.length > 0 
    ? reasonsStats 
    : [
        { reason: 'Cargando datos...', count: 0 }
      ];

  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];

  return (
    <div className="bg-card border border-card-border rounded-2xl p-6 shadow-xl h-full flex flex-col relative overflow-hidden transition-colors duration-300">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-lg font-semibold text-text-bright">Razones Principales de Abandono</h3>
        <button className="text-text-muted hover:text-text-bright transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="flex-1 w-full min-h-[250px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 10,
              right: 30,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" horizontal={true} vertical={false} />
            <XAxis type="number" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis 
              dataKey="reason" 
              type="category" 
              stroke="var(--text-muted)" 
              tick={{ fill: 'var(--text-bright)', fontSize: 11 }} 
              tickLine={false} 
              axisLine={false} 
              width={150} 
            />
            <Tooltip 
              cursor={{ fill: 'var(--hover)' }}
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--card-border)', 
                borderRadius: '8px', 
                color: 'var(--foreground)' 
              }}
              itemStyle={{ color: 'var(--text-bright)' }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
