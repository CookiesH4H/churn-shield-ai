"use client";

import { Search, Bell, ChevronDown } from "lucide-react";

export default function TopBar() {
  return (
    <header className="h-20 flex items-center justify-between px-8 border-b border-slate-800/50 bg-[#0b0e14]/80 backdrop-blur-md sticky top-0 z-10 w-full">
      <div className="flex items-center gap-3">
        <span className="text-slate-400 text-sm font-medium">Project:</span>
        <button 
          onClick={() => alert("Opening Project Selector...")}
          className="flex items-center gap-2 text-white font-medium hover:bg-slate-800/50 px-3 py-1.5 rounded-lg transition-colors"
        >
          Predicte
          <ChevronDown size={16} className="text-slate-400" />
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search" 
            onKeyDown={(e) => e.key === 'Enter' && alert(`Searching for: ${e.currentTarget.value}`)}
            className="bg-slate-900/50 border border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all w-64 placeholder:text-slate-600"
          />
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert("Opening Layout Settings...")}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
          >
            <div className="w-4 h-4 bg-slate-400 rounded-sm" /> {/* Placeholder for a layout icon */}
          </button>
          
          <button 
            onClick={() => alert("Opening Notifications...")}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all relative"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-[#0b0e14]"></span>
          </button>

          <button 
            onClick={() => alert("Opening User Profile Menu...")}
            className="flex items-center gap-2 ml-2 hover:opacity-80 transition-opacity"
          >
            <img 
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=b6e3f4" 
              alt="User" 
              className="w-9 h-9 rounded-full bg-slate-800 object-cover border border-slate-700"
            />
            <ChevronDown size={16} className="text-slate-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
