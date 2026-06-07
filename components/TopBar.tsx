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
        <span className="text-text-bright font-semibold px-3 py-1.5">
          Arca Continental
        </span>
      </div>

      <div className="flex items-center gap-6">

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




        </div>
      </div>
    </header>
  );
}
