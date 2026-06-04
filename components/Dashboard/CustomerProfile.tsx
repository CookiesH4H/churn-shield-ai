"use client";

import { MoreHorizontal } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useDashboard } from "@/context/DashboardContext";

export default function CustomerProfile() {
  const { selectedCustomer } = useDashboard();

  return (
    <div className="bg-[#121620] border border-slate-800 rounded-2xl p-6 shadow-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Detailed Customer Profile</h3>
        <button className="text-slate-500 hover:text-white transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <img 
          src={selectedCustomer.avatar} 
          alt={selectedCustomer.name} 
          className="w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-700"
        />
        <div>
          <h4 className="text-white font-bold text-lg">{selectedCustomer.name}</h4>
          <p className="text-slate-400 text-sm">{selectedCustomer.joinedDate} • {selectedCustomer.plan}</p>
        </div>
      </div>

      <h4 className="text-white font-semibold mb-2">Explainable AI (XAI) Reasons</h4>
      <p className="text-slate-500 text-sm mb-4">Top Churn Drivers</p>

      <div className="flex-1 w-full min-h-[180px] -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={selectedCustomer.xaiData}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} width={70} />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
              {selectedCustomer.xaiData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
