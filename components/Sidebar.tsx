"use client";

import { Home, BarChart2, Users, Megaphone, Settings } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export default function Sidebar() {
  const { activeTab, setActiveTab } = useDashboard();
  return (
    <aside className="w-20 lg:w-64 flex flex-col items-center lg:items-start border-r border-slate-800 bg-[#121620] h-full py-6">
      <div className="flex items-center gap-3 px-0 lg:px-6 mb-10 w-full justify-center lg:justify-start">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-xl text-white shadow-lg">
          P
        </div>
        <span className="hidden lg:block text-xl font-semibold tracking-wide">Predicte</span>
      </div>

      <nav className="flex flex-col gap-2 w-full px-2 lg:px-4 flex-1">
        <NavItem icon={<Home size={22} />} label="Home" active={activeTab === "Home"} onClick={() => setActiveTab("Home")} />
        <NavItem icon={<BarChart2 size={22} />} label="Analytics" active={activeTab === "Analytics"} onClick={() => setActiveTab("Analytics")} />
        <NavItem icon={<Users size={22} />} label="Users" active={activeTab === "Users"} onClick={() => setActiveTab("Users")} />
        <NavItem icon={<Megaphone size={22} />} label="Campaigns" active={activeTab === "Campaigns"} onClick={() => setActiveTab("Campaigns")} />
        <NavItem icon={<Settings size={22} />} label="Settings" active={activeTab === "Settings"} onClick={() => setActiveTab("Settings")} />
      </nav>
    </aside>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }) {
  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className={`flex flex-col lg:flex-row items-center gap-1 lg:gap-3 p-3 lg:px-4 lg:py-3 rounded-xl transition-all duration-200 group ${
        active
          ? "bg-slate-800/60 text-white shadow-sm border border-slate-700/50"
          : "text-slate-400 hover:text-white hover:bg-slate-800/40"
      }`}
    >
      <div className={`${active ? "text-purple-400" : "group-hover:text-purple-400 transition-colors"}`}>
        {icon}
      </div>
      <span className="text-[10px] lg:text-sm font-medium">{label}</span>
    </a>
  );
}
