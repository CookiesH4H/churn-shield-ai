"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Riesgo Bajo", value: 41, color: "#10b981" },
  { name: "Riesgo Medio", value: 35, color: "var(--brand-brown)" },
  { name: "Riesgo Alto", value: 24, color: "var(--brand-red)" },
];

export default function ChurnRiskOverview() {
  return (
    <div className="bg-card border border-card-border rounded-2xl p-6 flex flex-col h-full shadow-xl transition-colors duration-300">
      <h3 className="text-lg font-semibold text-text-bright mb-6">Resumen de Riesgo de Churn</h3>
      
      <div className="flex-1 min-h-[200px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--card-border)', 
                borderRadius: '8px', 
                color: 'var(--foreground)' 
              }}
              itemStyle={{ color: 'var(--foreground)' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Decorative center element */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-24 h-24 rounded-full bg-hover/40 shadow-inner blur-sm"></div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        {[...data].reverse().map((item) => (
          <div key={item.name} className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="text-xs text-text-muted font-medium">{item.name.replace('Riesgo ', '')}</span>
            </div>
            <span className="text-xl font-bold text-text-bright">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
