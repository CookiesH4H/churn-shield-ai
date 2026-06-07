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
  primaryRiskFactor: "low_usage" | "payment_failures" | "support_tickets" | "none" | string;
  customerSize?: string;
  realId?: string;
  abandonmentReason?: string;
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
    primaryRiskFactor: "support_tickets",
    realId: "USR-98421",
    abandonmentReason: "Falta de seguimiento en tickets",
    customerSize: "Grande"
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
    primaryRiskFactor: "low_usage",
    realId: "USR-74829",
    abandonmentReason: "Poco uso de la plataforma",
    customerSize: "Mediano"
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
    primaryRiskFactor: "none",
    realId: "USR-12948",
    abandonmentReason: "Ninguna",
    customerSize: "Gigante"
  }
];

export type Theme = "light" | "dark" | "system";
export type Language = "es" | "en";

type DashboardContextType = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCustomer: Customer;
  setSelectedCustomer: (customer: Customer) => void;
  customers: Customer[]; // Dynamically points to dashboardCustomers or usersCustomers
  dashboardCustomers: Customer[];
  usersCustomers: Customer[];
  riskStats: { low: number; medium: number; high: number; critical: number };
  pagination: { total: number; page: number; limit: number; totalPages: number };
  dashboardPagination: { page: number; totalPages: number };
  reasonsStats: { reason: string, count: number }[];
  fetchDashboardCustomers: (search?: string, page?: number) => Promise<void>;
  fetchUsersCustomers: (params: { page?: number; search?: string; risk?: string; size?: string }) => Promise<void>;
  addCustomer: (customer: Customer) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationKeys;
  isLoading: boolean;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState("Home");
  const [dashboardCustomers, setDashboardCustomers] = useState<Customer[]>([]);
  const [usersCustomers, setUsersCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(MOCK_CUSTOMERS[0]);
  const [riskStats, setRiskStats] = useState({ low: 3, medium: 2, high: 1, critical: 1 });
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 30, totalPages: 0 });
  const [dashboardPagination, setDashboardPagination] = useState({ page: 1, totalPages: 1 });
  const [reasonsStats, setReasonsStats] = useState<{reason: string, count: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardCustomers = async (search = "", page = 1) => {
    try {
      const res = await fetch(`/api/customers?limit=10&page=${page}&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data && data.customers) {
        setDashboardCustomers(data.customers);
        setRiskStats(data.stats);
        if (data.reasonsStats) {
          setReasonsStats(data.reasonsStats);
        }
        if (data.customers.length > 0) {
          // Keep the currently selected customer if it exists in the new list, or select the first one
          const stillExists = data.customers.find((c: Customer) => c.id === selectedCustomer.id);
          if (!stillExists) {
            setSelectedCustomer(data.customers[0]);
          }
        }
        if (data.pagination) {
          setDashboardPagination({
            page: data.pagination.page,
            totalPages: data.pagination.totalPages
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch dashboard customers", err);
    }
  };

  const fetchUsersCustomers = async ({ page = 1, search = "", risk = "All", size = "All" }) => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: "30",
        search,
        risk,
        size
      });
      const res = await fetch(`/api/customers?${query.toString()}`);
      const data = await res.json();
      if (data && data.customers) {
        setUsersCustomers(data.customers);
        setPagination(data.pagination);
        setRiskStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch users customers", err);
    }
  };

  // Perform initial fetches on mount
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchDashboardCustomers(),
        fetchUsersCustomers({ page: 1 })
      ]);
      setIsLoading(false);
    };
    init();
  }, []);

  const [theme, setThemeState] = useState<Theme>("system");
  const [lang, setLangState] = useState<Language>("es");

  const addCustomer = (customer: Customer) => {
    setUsersCustomers((prev) => [customer, ...prev]);
    setDashboardCustomers((prev) => [customer, ...prev.slice(0, 4)]);
  };

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

  // Dynamically map active customers for components referencing 'customers'
  const customers = activeTab === "Home" ? dashboardCustomers : usersCustomers;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-text-bright">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold tracking-wide">Cargando Churn Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <DashboardContext.Provider      value={{
        activeTab, setActiveTab,
        dashboardCustomers, usersCustomers,
        customers: activeTab === "Users" ? usersCustomers : dashboardCustomers,
        selectedCustomer, setSelectedCustomer,
        riskStats, pagination, dashboardPagination, reasonsStats,
        fetchDashboardCustomers, fetchUsersCustomers,
        addCustomer, theme, setTheme,
        lang, setLang, t, isLoading
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
