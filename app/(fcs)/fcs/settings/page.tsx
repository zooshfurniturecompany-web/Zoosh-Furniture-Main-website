"use client";

import React, { useState } from "react";
import { useFcs } from "../context";
import { Plus, Wallet, Truck, Info, Compass, Database, Trash2, Calendar, TrendingUp } from "lucide-react";

export default function SettingsPage() {
  const { 
    bankAccounts, 
    suppliers, 
    isMock, 
    addBankAccount, 
    addSupplier,
    companySettings,
    updateCompanySettings,
    forecastSchedules,
    addForecastSchedule,
    deleteForecastSchedule,
    projects
  } = useFcs();
  
  // Bank Form State
  const [accName, setAccName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [initBalance, setInitBalance] = useState("");
  const [bankSubmitting, setBankSubmitting] = useState(false);

  // Supplier Form State
  const [supName, setSupName] = useState("");
  const [supContact, setSupContact] = useState("");
  const [supPhone, setSupPhone] = useState("");
  const [supSubmitting, setSupSubmitting] = useState(false);

  // Company Settings Form State
  const [partnerCapital, setPartnerCapital] = useState(companySettings.partner_capital.toString());
  const [loanBalance, setLoanBalance] = useState(companySettings.loan_balance.toString());
  const [labourOutstanding, setLabourOutstanding] = useState(companySettings.labour_outstanding.toString());
  const [generalPayables, setGeneralPayables] = useState(companySettings.general_company_payables.toString());
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Forecast Schedule Form State
  const [schedType, setSchedType] = useState<"incoming" | "outgoing">("incoming");
  const [schedCat, setSchedCat] = useState<"Customer Collection" | "Supplier Payment" | "Salary" | "Rent" | "Labour Payment" | "Other">("Customer Collection");
  const [schedDesc, setSchedDesc] = useState("");
  const [schedAmt, setSchedAmt] = useState("");
  const [schedDate, setSchedDate] = useState(new Date().toISOString().substring(0, 10));
  const [schedProjId, setSchedProjId] = useState("");
  const [schedSubmitting, setSchedSubmitting] = useState(false);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleAddBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accName) return;
    setBankSubmitting(true);
    try {
      await addBankAccount({
        account_name: accName,
        bank_name: bankName || undefined,
        account_number: accNumber || undefined,
        current_balance: Number(initBalance) || 0
      });
      setAccName("");
      setBankName("");
      setAccNumber("");
      setInitBalance("");
    } catch (err) {
      console.error(err);
    } finally {
      setBankSubmitting(false);
    }
  };

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName) return;
    setSupSubmitting(true);
    try {
      await addSupplier({
        name: supName,
        contact_person: supContact || undefined,
        phone: supPhone || undefined
      });
      setSupName("");
      setSupContact("");
      setSupPhone("");
    } catch (err) {
      console.error(err);
    } finally {
      setSupSubmitting(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    try {
      await updateCompanySettings({
        partner_capital: Number(partnerCapital) || 0,
        loan_balance: Number(loanBalance) || 0,
        labour_outstanding: Number(labourOutstanding) || 0,
        general_company_payables: Number(generalPayables) || 0
      });
      alert("Company financial settings saved successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedDesc || !schedAmt) return;
    setSchedSubmitting(true);
    try {
      await addForecastSchedule({
        type: schedType,
        category: schedCat,
        description: schedDesc,
        amount: Number(schedAmt) || 0,
        due_date: schedDate,
        project_id: schedProjId || undefined
      });
      setSchedDesc("");
      setSchedAmt("");
      setSchedProjId("");
    } catch (err) {
      console.error(err);
    } finally {
      setSchedSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-neutral-400 mt-1">Configure company bank accounts, supplier profiles, balance sheets, and cash flow schedules.</p>
      </div>

      {/* Database Mode Card */}
      <div className="bg-[#18181b] border border-neutral-800 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20 mt-1">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">System Database Status</h3>
            <p className="text-sm text-neutral-400 mt-0.5">
              {isMock 
                ? "Currently running in Browser LocalStorage (Demo Mode). All changes will persist in this browser session only." 
                : "Connected directly to Supabase Production PostgreSQL Database. Real-time synchronisation active."
              }
            </p>
          </div>
        </div>
        <div className="flex shrink-0">
          <span className={`px-4 py-2 rounded-full text-xs font-bold border ${
            isMock 
              ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
          }`}>
            {isMock ? "Demo Mode" : "Production Online"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COMPANY MONEY STATUS BALANCE CONFIG */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Compass className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-semibold">Financial Resource & Liabilities Configuration</h2>
          </div>

          <form onSubmit={handleSaveSettings} className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-5 space-y-4 text-xs">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">Balance Sheet Adjustments</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-400 block">Partner Capital (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 500000"
                  value={partnerCapital}
                  onChange={(e) => setPartnerCapital(e.target.value)}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400 block">Loan Balance (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 1000000"
                  value={loanBalance}
                  onChange={(e) => setLoanBalance(e.target.value)}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400 block">Labour Outstanding (₹)</label>
                <input
                  type="number"
                  placeholder="Wages owed to carpenters/labourers"
                  value={labourOutstanding}
                  onChange={(e) => setLabourOutstanding(e.target.value)}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400 block">General Company Payables (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. electric bills, rent outstanding"
                  value={generalPayables}
                  onChange={(e) => setGeneralPayables(e.target.value)}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={settingsSaving}
              className="w-full bg-emerald-600 hover:bg-emerald-505 text-white rounded-md py-2 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {settingsSaving ? "Saving..." : "Save Financial Status Balance"}
            </button>
          </form>
        </div>

        {/* BANK ACCOUNTS */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Wallet className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-semibold">Bank Accounts & Cash Books</h2>
          </div>

          {/* Add Bank Form */}
          <form onSubmit={handleAddBank} className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-5 space-y-4 text-xs">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">Add New Account / Cash Drawer</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Account Display Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ICICI Current A/c"
                  value={accName}
                  onChange={(e) => setAccName(e.target.value)}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Bank Name</label>
                <input
                  type="text"
                  placeholder="e.g. ICICI Bank"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Account Number</label>
                <input
                  type="text"
                  placeholder="e.g. 502000xxxx"
                  value={accNumber}
                  onChange={(e) => setAccNumber(e.target.value)}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Opening Balance (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 500000"
                  value={initBalance}
                  onChange={(e) => setInitBalance(e.target.value)}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={bankSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-505 text-white rounded-md py-2 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {bankSubmitting ? "Creating..." : "Add Bank Account"}
            </button>
          </form>

          {/* Bank list */}
          <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-neutral-800">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">Active Accounts</h3>
            </div>
            <div className="divide-y divide-neutral-800 text-xs">
              {bankAccounts.map((b) => (
                <div key={b.id} className="p-4 flex items-center justify-between hover:bg-neutral-900/40 transition-colors">
                  <div>
                    <h4 className="font-semibold text-sm">{b.account_name}</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {b.bank_name ? `${b.bank_name} • ` : ""}{b.account_number ? `A/c: ${b.account_number}` : "Petty Cash Book"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`font-semibold text-sm ${b.current_balance < 0 ? "text-rose-500" : "text-emerald-400"}`}>
                      {formatINR(b.current_balance)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* FORECAST TRANSACTION LIST & ADD FORM */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-semibold">Future Money Schedules (Cash Forecasts)</h2>
          </div>

          <form onSubmit={handleAddSchedule} className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-5 space-y-4 text-xs">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">Schedule Expected Transaction</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-400 block">Type *</label>
                <select
                  value={schedType}
                  onChange={(e) => {
                    const type = e.target.value as "incoming" | "outgoing";
                    setSchedType(type);
                    setSchedCat(type === "incoming" ? "Customer Collection" : "Supplier Payment");
                  }}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                >
                  <option value="incoming">Incoming (Cash Inflow)</option>
                  <option value="outgoing">Outgoing (Cash Outflow)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400 block">Category *</label>
                <select
                  value={schedCat}
                  onChange={(e) => setSchedCat(e.target.value as any)}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                >
                  {schedType === "incoming" ? (
                    <>
                      <option value="Customer Collection">Customer Collection</option>
                      <option value="Other">Other Incoming</option>
                    </>
                  ) : (
                    <>
                      <option value="Supplier Payment">Supplier Payment</option>
                      <option value="Salary">Salary Date</option>
                      <option value="Rent">Rent Date</option>
                      <option value="Labour Payment">Labour Due Date</option>
                      <option value="Other">Other Expenses</option>
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400 block">Expected Due Date *</label>
                <input
                  type="date"
                  required
                  value={schedDate}
                  onChange={(e) => setSchedDate(e.target.value)}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400 block">Amount (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 50000"
                  value={schedAmt}
                  onChange={(e) => setSchedAmt(e.target.value)}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                />
              </div>

              <div className="space-y-1 col-span-2">
                <label className="text-xs text-neutral-400 block">Description / Note *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh - Progress Payment 1"
                  value={schedDesc}
                  onChange={(e) => setSchedDesc(e.target.value)}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                />
              </div>

              <div className="space-y-1 col-span-2">
                <label className="text-xs text-neutral-400 block">Linked Project (Optional)</label>
                <select
                  value={schedProjId}
                  onChange={(e) => setSchedProjId(e.target.value)}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                >
                  <option value="">-- Select Project --</option>
                  {projects.filter(p => p.status === "running").map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={schedSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-505 text-white rounded-md py-2 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              Add Scheduled Forecast Item
            </button>
          </form>

          {/* Schedule list */}
          <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-neutral-800">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">Scheduled Items</h3>
            </div>
            <div className="divide-y divide-neutral-800 text-xs max-h-[40vh] overflow-y-auto">
              {forecastSchedules.length === 0 ? (
                <div className="p-8 text-center text-neutral-500">No future transactions scheduled.</div>
              ) : (
                forecastSchedules.map((s) => (
                  <div key={s.id} className="p-4 flex items-center justify-between hover:bg-neutral-900/40 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${s.type === "incoming" ? "bg-emerald-500" : "bg-rose-500"}`} />
                        <h4 className="font-semibold text-xs text-neutral-200">{s.description}</h4>
                      </div>
                      <p className="text-[10px] text-neutral-500">
                        {s.category} • Due: {s.due_date}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-semibold ${s.type === "incoming" ? "text-emerald-400" : "text-rose-500"}`}>
                        {s.type === "incoming" ? "+" : "-"}{formatINR(s.amount)}
                      </span>
                      <button
                        onClick={() => deleteForecastSchedule(s.id)}
                        className="text-rose-500/70 hover:text-rose-500 p-1 hover:bg-rose-500/10 rounded transition-colors"
                        title="Delete Schedule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* SUPPLIERS */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Truck className="w-5 h-5 text-sky-500" />
            <h2 className="text-xl font-semibold">Supplier Directories</h2>
          </div>

          {/* Add Supplier Form */}
          <form onSubmit={handleAddSupplier} className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-5 space-y-4 text-xs">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">Add New Supplier Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs text-neutral-400">Supplier Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Malabar Timber Mart"
                  value={supName}
                  onChange={(e) => setSupName(e.target.value)}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-sky-500 text-neutral-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Contact Person</label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Kumar"
                  value={supContact}
                  onChange={(e) => setSupContact(e.target.value)}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-sky-500 text-neutral-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Phone number</label>
                <input
                  type="text"
                  placeholder="e.g. +91 9988..."
                  value={supPhone}
                  onChange={(e) => setSupPhone(e.target.value)}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-sky-500 text-neutral-200"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={supSubmitting}
              className="w-full bg-sky-600 hover:bg-sky-505 text-white rounded-md py-2 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {supSubmitting ? "Creating..." : "Add Supplier"}
            </button>
          </form>

          {/* Supplier List */}
          <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-neutral-800">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">Registered Suppliers</h3>
            </div>
            <div className="divide-y divide-neutral-800 text-xs">
              {suppliers.length === 0 ? (
                <div className="p-8 text-center text-neutral-500">No suppliers registered. Add one above.</div>
              ) : (
                suppliers.map((s) => (
                  <div key={s.id} className="p-4 flex items-center justify-between hover:bg-neutral-900/40 transition-colors">
                    <div>
                      <h4 className="font-semibold text-sm">{s.name}</h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {s.contact_person ? `Contact: ${s.contact_person}` : ""} {s.phone ? `• Tel: ${s.phone}` : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-500 block mb-0.5">Outstanding Payable:</span>
                      <span className={`font-semibold text-sm ${s.outstanding_balance > 0 ? "text-rose-500" : "text-neutral-400"}`}>
                        {formatINR(s.outstanding_balance)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
