"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Low Risk", value: 41, color: "#10b981" },
  { name: "Medium Risk", value: 35, color: "#f59e0b" },
  { name: "High Risk", value: 24, color: "#ef4444" },
];

export default function ChurnRiskOverview() {
  return (
    <div className="bg-[#121620] border border-slate-800 rounded-2xl p-6 flex flex-col h-full shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-6">Churn Risk Overview</h3>
      
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
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Decorative center element */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-24 h-24 rounded-full bg-slate-900/40 shadow-inner blur-sm"></div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        {data.reverse().map((item) => (
          <div key={item.name} className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="text-xs text-slate-400 font-medium">{item.name.replace(' Risk', '')}</span>
            </div>
            <span className="text-xl font-bold text-white">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
