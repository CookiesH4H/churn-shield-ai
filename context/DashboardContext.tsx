"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { TranslationKeys, es, en } from "./translations";

export type Customer = {
  id: string; // user_id
  name: string;
  email: string;
  planTier: string;
  signupDate: string;
  avatar: string;
  lastLogin: string;
  daysInactive: number;
  sessionsLast30d: number;
  coreFeatureUsage: number;
  timeSpentWeekly: number;
  mrr: number;
  billingCycle: "Mensual" | "Anual" | "Monthly" | "Annual";
  paymentFailures: number;
  openTickets: number;
  npsScore: number;
  churnProbability: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  primaryRiskFactor: "low_usage" | "payment_failures" | "support_tickets" | "none";
};

export const MOCK_CUSTOMERS: Customer[] = [
  { 
    id: "USR-98421", 
    name: "Carlos Mendoza (Tienda La Unión)", 
    email: "carlos.mendoza@launion.com",
    planTier: "Canal Tradicional", 
    signupDate: "2023-05-12",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Carlos",
    lastLogin: "2026-05-22",
    daysInactive: 14,
    sessionsLast30d: 3,
    coreFeatureUsage: 25,
    timeSpentWeekly: 45,
    mrr: 99.00,
    billingCycle: "Mensual",
    paymentFailures: 1,
    openTickets: 5,
    npsScore: 4,
    churnProbability: 82,
    riskLevel: "High",
    primaryRiskFactor: "support_tickets"
  },
  { 
    id: "USR-74829", 
    name: "Sofía Rodríguez (Minisúper Centro)", 
    email: "sofia.rod@supercentro.com",
    planTier: "Canal Tradicional", 
    signupDate: "2024-02-15",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sofia",
    lastLogin: "2026-05-26",
    daysInactive: 10,
    sessionsLast30d: 5,
    coreFeatureUsage: 18,
    timeSpentWeekly: 30,
    mrr: 49.00,
    billingCycle: "Mensual",
    paymentFailures: 0,
    openTickets: 1,
    npsScore: 7,
    churnProbability: 48,
    riskLevel: "Medium",
    primaryRiskFactor: "low_usage"
  },
  { 
    id: "USR-12948", 
    name: "Alejandro Gómez (Super Express)", 
    email: "a.gomez@superexpress.net",
    planTier: "Canal Moderno", 
    signupDate: "2022-11-08",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Alejandro",
    lastLogin: "2026-06-05",
    daysInactive: 0,
    sessionsLast30d: 28,
    coreFeatureUsage: 92,
    timeSpentWeekly: 340,
    mrr: 99.00,
    billingCycle: "Anual",
    paymentFailures: 0,
    openTickets: 0,
    npsScore: 9,
    churnProbability: 12,
    riskLevel: "Low",
    primaryRiskFactor: "none"
  }
];

export type Theme = "light" | "dark" | "system";
export type Language = "es" | "en";

type DashboardContextType = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCustomer: Customer;
  setSelectedCustomer: (customer: Customer) => void;
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationKeys;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState("Home");
  const [customers, setCustomersState] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(MOCK_CUSTOMERS[0]);
  const [theme, setThemeState] = useState<Theme>("system");
  const [lang, setLangState] = useState<Language>("es");

  const addCustomer = (customer: Customer) => {
    setCustomersState((prev) => [...prev, customer]);
  };

  // Load saved theme and language on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
    }
    const savedLang = localStorage.getItem("lang") as Language;
    if (savedLang) {
      setLangState(savedLang);
    }
  }, []);

  // Sync theme with HTML class and handle system preference changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (currentTheme: Theme) => {
      root.classList.remove("light", "dark");
      
      if (currentTheme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(currentTheme);
      }
    };

    applyTheme(theme);

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
  };

  // Get active translation keys
  const t = lang === "es" ? es : en;

  return (
    <DashboardContext.Provider value={{
      activeTab, setActiveTab,
      selectedCustomer, setSelectedCustomer,
      customers, addCustomer,
      theme, setTheme,
      lang, setLang, t
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
