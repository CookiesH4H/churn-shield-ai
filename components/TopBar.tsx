"use client";

import { useState } from "react";
import { Search, Bell, ChevronDown, Sun, Moon, Monitor, Globe } from "lucide-react";
import { useDashboard, Theme } from "@/context/DashboardContext";

export default function TopBar() {
  const { theme, setTheme, lang, setLang, t } = useDashboard();
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

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
        <span className="text-text-muted text-sm font-medium">{t.topbar.projectLabel}</span>
        <button 
          onClick={() => alert(t.topbar.projectSelectorAlert)}
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
            placeholder={t.topbar.searchPlaceholder}
            onKeyDown={(e) => e.key === 'Enter' && alert(`${t.topbar.searchAlert}${e.currentTarget.value}`)}
            className="bg-hover/50 border border-card-border rounded-full pl-10 pr-4 py-2 text-sm text-text-bright focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all w-64 placeholder:text-text-muted/50"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-card-border text-text-muted hover:text-text-bright hover:bg-hover transition-all relative"
              title={lang === "es" ? "Cambiar idioma" : "Change language"}
            >
              <Globe size={18} className="text-brand-brown" />
              <span className="absolute -bottom-0.5 -right-0.5 text-[8px] bg-brand-red text-white px-1 rounded-full font-bold">
                {lang.toUpperCase()}
              </span>
            </button>
            
            {isLangOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setIsLangOpen(false)} />
                <div className="absolute right-0 mt-2 w-32 bg-card border border-card-border rounded-xl shadow-lg py-1 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => { setLang("es"); setIsLangOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-left hover:bg-hover ${lang === "es" ? "text-brand-red font-medium bg-brand-red-muted/40" : "text-text-muted"}`}
                  >
                    Español
                  </button>
                  <button
                    onClick={() => { setLang("en"); setIsLangOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-left hover:bg-hover ${lang === "en" ? "text-brand-red font-medium bg-brand-red-muted/40" : "text-text-muted"}`}
                  >
                    English
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Theme Selector */}
          <div className="relative">
            <button 
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-card-border text-text-muted hover:text-text-bright hover:bg-hover transition-all"
              title={lang === "es" ? `Cambiar tema: ${theme}` : `Change theme: ${theme}`}
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
                    {lang === "es" ? "Claro" : "Light"}
                  </button>
                  <button
                    onClick={() => { setTheme("dark"); setIsThemeOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-left hover:bg-hover ${theme === "dark" ? "text-brand-red font-medium bg-brand-red-muted/40" : "text-text-muted"}`}
                  >
                    <Moon size={16} />
                    {lang === "es" ? "Oscuro" : "Dark"}
                  </button>
                  <button
                    onClick={() => { setTheme("system"); setIsThemeOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-left hover:bg-hover ${theme === "system" ? "text-brand-red font-medium bg-brand-red-muted/40" : "text-text-muted"}`}
                  >
                    <Monitor size={16} />
                    {lang === "es" ? "Sistema" : "System"}
                  </button>
                </div>
              </>
            )}
          </div>

          <button 
            onClick={() => alert(t.topbar.layoutAlert)}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-card-border text-text-muted hover:text-text-bright hover:bg-hover transition-all"
          >
            <div className="w-4 h-4 bg-text-muted rounded-sm" />
          </button>
          
          <button 
            onClick={() => alert(t.topbar.notificationsAlert)}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-card-border text-text-muted hover:text-text-bright hover:bg-hover transition-all relative"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-red rounded-full border border-background"></span>
          </button>

          <button 
            onClick={() => alert(t.topbar.profileAlert)}
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
