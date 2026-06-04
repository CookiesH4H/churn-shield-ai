"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Customer = {
  id: number;
  name: string;
  plan: string;
  risk: number;
  status: string;
  avatar: string;
  joinedDate: string;
  xaiData: { name: string; score: number; color: string }[];
};

export const MOCK_CUSTOMERS: Customer[] = [
  { 
    id: 1, name: "Liam Davies", plan: "Pro Plan", risk: 88, status: "At Risk", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Liam", joinedDate: "Joined May '23",
    xaiData: [
      { name: 'Pricing', score: 35000, color: '#ef4444' },
      { name: 'Support', score: 25000, color: '#f59e0b' },
      { name: 'Features', score: 18000, color: '#f59e0b' },
      { name: 'Usability', score: 10000, color: '#10b981' },
    ]
  },
  { 
    id: 2, name: "Chloe Bennett", plan: "Free", risk: 65, status: "Neutral", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Chloe", joinedDate: "Joined Aug '23",
    xaiData: [
      { name: 'Features', score: 22000, color: '#f59e0b' },
      { name: 'Pricing', score: 20000, color: '#f59e0b' },
      { name: 'Support', score: 12000, color: '#10b981' },
      { name: 'Usability', score: 8000, color: '#10b981' },
    ]
  },
  { 
    id: 3, name: "Mike Zhang", plan: "Basic", risk: 22, status: "Stable", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Mike", joinedDate: "Joined Jan '24",
    xaiData: [
      { name: 'Pricing', score: 5000, color: '#10b981' },
      { name: 'Features', score: 4000, color: '#10b981' },
      { name: 'Usability', score: 3500, color: '#10b981' },
      { name: 'Support', score: 2000, color: '#10b981' },
    ]
  },
  { 
    id: 4, name: "Jessica Lee", plan: "Business", risk: 79, status: "At Risk", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Jessica", joinedDate: "Joined Nov '22",
    xaiData: [
      { name: 'Support', score: 31000, color: '#ef4444' },
      { name: 'Usability', score: 24000, color: '#f59e0b' },
      { name: 'Pricing', score: 19000, color: '#f59e0b' },
      { name: 'Features', score: 15000, color: '#10b981' },
    ]
  },
];

type DashboardContextType = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCustomer: Customer;
  setSelectedCustomer: (customer: Customer) => void;
  customers: Customer[];
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState("Home");
  const [customers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(MOCK_CUSTOMERS[0]);

  return (
    <DashboardContext.Provider value={{
      activeTab, setActiveTab,
      selectedCustomer, setSelectedCustomer,
      customers
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
