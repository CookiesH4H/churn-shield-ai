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
    <div className="bg-[#121620] border border-slate-800 rounded-2xl p-6 shadow-xl h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-lg font-semibold text-white">Churn Trends (Last 6 Months)</h3>
        <button className="text-slate-500 hover:text-white transition-colors">
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
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="churn" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorChurn)" />
            <Area type="monotone" dataKey="retention" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRetention)" />
            <Area type="monotone" dataKey="new" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorNew)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
