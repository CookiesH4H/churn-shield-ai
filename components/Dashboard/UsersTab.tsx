"use client";

import React, { useState } from "react";
import { Search, Filter, Plus, X, UserPlus, CheckCircle } from "lucide-react";
import { useDashboard, Customer } from "@/context/DashboardContext";

export default function UsersTab() {
  const { customers, addCustomer, setSelectedCustomer, setActiveTab, t } = useDashboard();
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState("All");
  const [filterChannel, setFilterChannel] = useState("All");
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    channel: "Canal Tradicional",
    signupDate: new Date().toISOString().split('T')[0]
  });
  
  // State for toast notification
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Filtering logic
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesRisk = filterRisk === "All" || c.riskLevel === filterRisk;
    
    const matchesChannel = 
      filterChannel === "All" || 
      (filterChannel === "Tradicional" && c.planTier === "Canal Tradicional") ||
      (filterChannel === "Moderno" && c.planTier === "Canal Moderno");
      
    return matchesSearch && matchesRisk && matchesChannel;
  });

  const handleRegisterClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      email: "",
      channel: "Canal Tradicional",
      signupDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    // Generate random user ID
    const randomId = `USR-${Math.floor(10000 + Math.random() * 90000)}`;

    // Create new customer object with default active metrics
    const newCustomer: Customer = {
      id: randomId,
      name: formData.name,
      email: formData.email,
      planTier: formData.channel,
      signupDate: formData.signupDate,
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(formData.name)}`,
      lastLogin: formData.signupDate,
      daysInactive: 0,
      sessionsLast30d: 8,
      coreFeatureUsage: 75,
      timeSpentWeekly: 120,
      mrr: formData.channel === "Canal Moderno" ? 199.00 : 49.00,
      billingCycle: "Mensual",
      paymentFailures: 0,
      openTickets: 0,
      npsScore: 10,
      churnProbability: 15,
      riskLevel: "Low",
      primaryRiskFactor: "none"
    };

    addCustomer(newCustomer);
    
    // Trigger toast notification
    setToastMessage(t.usersTab.successToast);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);

    handleCloseModal();
  };

  const handleSelectCustomer = (c: Customer) => {
    setSelectedCustomer(c);
    setActiveTab("Home"); // Redirect to home so they can see this customer's details and chatbot recommendations!
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-12">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-5 right-5 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce duration-500 border border-emerald-500">
          <CheckCircle size={20} />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Cabecera de Página */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-bright tracking-tight">{t.usersTab.title}</h1>
          <p className="text-text-muted text-sm mt-1">{t.usersTab.subtitle}</p>
        </div>
        <button
          onClick={handleRegisterClick}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-red text-white hover:bg-brand-red-hover hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-red/25 font-semibold text-sm self-start sm:self-auto"
        >
          <Plus size={18} />
          {t.usersTab.registerBtn}
        </button>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-card border border-card-border rounded-2xl p-5 shadow-xl flex flex-col md:flex-row gap-4 justify-between items-center transition-colors duration-300">
        <div className="relative w-full md:w-80 group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand-red transition-colors" />
          <input
            type="text"
            placeholder={t.customerList.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-hover/40 border border-card-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-bright focus:outline-none focus:border-brand-red/50 transition-all placeholder:text-text-muted/50"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Canal Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted whitespace-nowrap">Canal:</span>
            <select
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value)}
              className="bg-hover/40 border border-card-border rounded-xl px-3 py-2 text-xs text-text-bright focus:outline-none focus:border-brand-red/50 w-full sm:w-auto"
            >
              <option value="All" className="bg-[#121620]">{t.usersTab.filterAllChannels}</option>
              <option value="Tradicional" className="bg-[#121620]">Canal Tradicional</option>
              <option value="Moderno" className="bg-[#121620]">Canal Moderno</option>
            </select>
          </div>

          {/* Riesgo Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted whitespace-nowrap">Riesgo:</span>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="bg-hover/40 border border-card-border rounded-xl px-3 py-2 text-xs text-text-bright focus:outline-none focus:border-brand-red/50 w-full sm:w-auto"
            >
              <option value="All" className="bg-[#121620]">{t.usersTab.filterAllRisks}</option>
              <option value="Low" className="bg-[#121620]">Bajo</option>
              <option value="Medium" className="bg-[#121620]">Medio</option>
              <option value="High" className="bg-[#121620]">Alto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-card border border-card-border rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-card-border bg-hover/20">
                <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">{t.usersTab.colId}</th>
                <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">{t.customerList.colName}</th>
                <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">{t.usersTab.colChannel}</th>
                <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">{t.usersTab.colJoined}</th>
                <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">{t.customerList.colRisk}</th>
                <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">{t.customerList.colStatus}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-text-muted text-sm">
                    No se encontraron clientes registrados con los filtros activos.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const isHigh = c.riskLevel === "High" || c.riskLevel === "Critical";
                  const isMed = c.riskLevel === "Medium";
                  return (
                    <tr
                      key={c.id}
                      onClick={() => handleSelectCustomer(c)}
                      className="border-b border-card-border/30 hover:bg-hover/20 cursor-pointer transition-colors group"
                    >
                      <td className="py-4 px-6 text-sm font-semibold text-brand-red">{c.id}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full bg-hover" />
                          <div>
                            <span className="text-sm font-medium text-text-bright group-hover:text-brand-red transition-colors block">{c.name}</span>
                            <span className="text-xs text-text-muted block">{c.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-text-muted">{c.planTier}</td>
                      <td className="py-4 px-6 text-sm text-text-muted">{c.signupDate}</td>
                      <td className="py-4 px-6 text-sm font-bold" style={{ color: isHigh ? '#ef4444' : isMed ? '#f59e0b' : '#10b981' }}>
                        {c.churnProbability}%
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${
                          isHigh
                            ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                            : isMed
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        }`}>
                          {isHigh 
                            ? t.customerList.statusAtRisk 
                            : isMed 
                            ? t.customerList.statusNeutral 
                            : t.customerList.statusStable}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Registrar Cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-card border border-card-border rounded-2xl w-full max-w-lg p-6 shadow-2xl relative transition-colors duration-300">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-text-muted hover:text-text-bright transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-red/10 border border-brand-red-border flex items-center justify-center text-brand-red">
                <UserPlus size={20} />
              </div>
              <h2 className="text-xl font-bold text-text-bright">{t.usersTab.modalTitle}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase mb-1.5">{t.usersTab.labelName}</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder={t.usersTab.placeholderName}
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-hover/40 border border-card-border rounded-xl px-4 py-3 text-sm text-text-bright focus:outline-none focus:border-brand-red/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase mb-1.5">{t.usersTab.labelEmail}</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder={t.usersTab.placeholderEmail}
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-hover/40 border border-card-border rounded-xl px-4 py-3 text-sm text-text-bright focus:outline-none focus:border-brand-red/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase mb-1.5">{t.usersTab.labelChannel}</label>
                  <select
                    name="channel"
                    value={formData.channel}
                    onChange={handleInputChange}
                    className="w-full bg-hover/40 border border-card-border rounded-xl px-4 py-3 text-sm text-text-bright focus:outline-none focus:border-brand-red/50"
                  >
                    <option value="Canal Tradicional" className="bg-[#121620]">Canal Tradicional</option>
                    <option value="Canal Moderno" className="bg-[#121620]">Canal Moderno</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase mb-1.5">{t.usersTab.labelDate}</label>
                  <input
                    type="date"
                    name="signupDate"
                    required
                    value={formData.signupDate}
                    onChange={handleInputChange}
                    className="w-full bg-hover/40 border border-card-border rounded-xl px-4 py-3 text-sm text-text-bright focus:outline-none focus:border-brand-red/50 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-8">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl border border-card-border text-sm font-semibold text-text-muted hover:text-text-bright hover:bg-hover transition-all"
                >
                  {t.usersTab.btnCancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-red text-white hover:bg-brand-red-hover transition-all font-semibold text-sm"
                >
                  {t.usersTab.btnSubmit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
