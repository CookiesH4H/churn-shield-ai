"use client";

import { useState } from "react";
import { Search, Bell, ChevronDown, Sun, Moon, Monitor } from "lucide-react";
import { useDashboard, Theme } from "@/context/DashboardContext";

export default function TopBar() {
  const { theme, setTheme } = useDashboard();
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const getThemeIcon = (currentTheme: Theme) => {
    switch (currentTheme) {
      case "light":
        return <Sun size={18} className="text-brand-red animate-pulse" />;
      case "dark":
        return <Moon size={18} className="text-brand-red" />;
      case "system":
        return <Monitor size={18} className="text-text-muted" />;
    }
  };

  return (
    <header className="h-20 flex items-center justify-between px-8 border-b border-topbar-border bg-topbar/80 backdrop-blur-md sticky top-0 z-10 w-full transition-colors duration-300">
      <div className="flex items-center gap-3">
        <span className="text-text-muted text-sm font-medium">Proyecto:</span>
        <button 
          onClick={() => alert("Abriendo selector de proyecto...")}
          className="flex items-center gap-2 text-text-bright font-semibold hover:bg-hover px-3 py-1.5 rounded-lg transition-colors"
        >
          Arca Continental
          <ChevronDown size={16} className="text-text-muted" />
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand-red transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            onKeyDown={(e) => e.key === 'Enter' && alert(`Buscando: ${e.currentTarget.value}`)}
            className="bg-hover/50 border border-card-border rounded-full pl-10 pr-4 py-2 text-sm text-text-bright focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all w-64 placeholder:text-text-muted/50"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Selector */}
          <div className="relative">
            <button 
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-card-border text-text-muted hover:text-text-bright hover:bg-hover transition-all"
              title={`Cambiar tema: ${theme}`}
            >
              {getThemeIcon(theme)}
            </button>
            
            {isThemeOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setIsThemeOpen(false)} />
                <div className="absolute right-0 mt-2 w-36 bg-card border border-card-border rounded-xl shadow-lg py-1 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => { setTheme("light"); setIsThemeOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-left hover:bg-hover ${theme === "light" ? "text-brand-red font-medium bg-brand-red-muted/40" : "text-text-muted"}`}
                  >
                    <Sun size={16} />
                    Claro
                  </button>
                  <button
                    onClick={() => { setTheme("dark"); setIsThemeOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-left hover:bg-hover ${theme === "dark" ? "text-brand-red font-medium bg-brand-red-muted/40" : "text-text-muted"}`}
                  >
                    <Moon size={16} />
                    Oscuro
                  </button>
                  <button
                    onClick={() => { setTheme("system"); setIsThemeOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-left hover:bg-hover ${theme === "system" ? "text-brand-red font-medium bg-brand-red-muted/40" : "text-text-muted"}`}
                  >
                    <Monitor size={16} />
                    Sistema
                  </button>
                </div>
              </>
            )}
          </div>

          <button 
            onClick={() => alert("Abriendo configuración de vista...")}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-card-border text-text-muted hover:text-text-bright hover:bg-hover transition-all"
          >
            <div className="w-4 h-4 bg-text-muted rounded-sm" />
          </button>
          
          <button 
            onClick={() => alert("Abriendo notificaciones...")}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-card-border text-text-muted hover:text-text-bright hover:bg-hover transition-all relative"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-red rounded-full border border-background"></span>
          </button>

          <button 
            onClick={() => alert("Abriendo menú de perfil...")}
            className="flex items-center gap-2 ml-2 hover:opacity-80 transition-opacity"
          >
            <img 
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=b6e3f4" 
              alt="User" 
              className="w-9 h-9 rounded-full bg-hover object-cover border border-card-border"
            />
            <ChevronDown size={16} className="text-text-muted" />
          </button>
        </div>
      </div>
    </header>
  );
}
