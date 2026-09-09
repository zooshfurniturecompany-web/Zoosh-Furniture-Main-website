"use client";

import React, { useState } from "react";
import { useFcs } from "../context";
import { Coins, Search, ArrowRight, Eye, Calendar, Tag, User, MapPin, ArrowDown } from "lucide-react";

export default function MoneyTrailPage() {
  const { funds, expenses, projects, bankAccounts, suppliers } = useFcs();
  const [selectedFundId, setSelectedFundId] = useState<string>("");
  const [search, setSearch] = useState("");
  
  // Filters
  const [projectFilter, setProjectFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [bankFilter, setBankFilter] = useState("all");

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Find expenses financed by this fund
  const getFundTransactionsTrail = (fundId: string) => {
    const fund = funds.find(f => f.id === fundId);
    if (!fund) return null;

    // Chronological expense list
    const fundExpenses = expenses.filter(e => e.funding_source_id === fundId);
    
    // Sort expenses ascending by date to build a chronological money trail
    const sortedExpenses = [...fundExpenses].sort((a, b) => a.expense_date.localeCompare(b.expense_date));

    // Build trail nodes:
    // Node 0: Initial cash receipt
    let runningBalance = Number(fund.original_amount);
    const trail = [
      {
        id: "start",
        date: fund.payment_date,
        type: "receipt",
        label: "Project Fund Received",
        description: `Client payment deposited via ${fund.payment_method} into ${fund.bank_name || "Bank"}`,
        amount: fund.original_amount,
        balance: runningBalance
      }
    ];

    // Node 1..N: Chronological deductions
    sortedExpenses.forEach(exp => {
      runningBalance -= Number(exp.total_amount);
      
      // Determine what was purchased
      let spentDetail = "";
      if (exp.allocations && exp.allocations.length > 0) {
        spentDetail = exp.allocations.map(a => `${a.project_name} (${a.allocated_percentage}%)`).join(", ");
      } else {
        spentDetail = "General Company Overhead";
      }

      trail.push({
        id: exp.id,
        date: exp.expense_date,
        type: "expense",
        label: `Paid: ${exp.category} ${exp.supplier_name ? `to ${exp.supplier_name}` : ""}`,
        description: `Split: ${spentDetail} ${exp.notes ? `• Remarks: ${exp.notes}` : ""}`,
        amount: exp.total_amount,
        balance: runningBalance
      });
    });

    return { fund, trail };
  };

  // Run filters across all project funds
  const filteredFunds = funds.filter(f => {
    const matchesSearch = f.client_name?.toLowerCase().includes(search.toLowerCase()) || 
                          f.project_name?.toLowerCase().includes(search.toLowerCase());
    
    // If specific filters are active, check if the fund has transactions matching those filters
    const fundExpenses = expenses.filter(e => e.funding_source_id === f.id);
    
    const matchesProject = projectFilter === "all" || f.project_id === projectFilter || 
                           fundExpenses.some(e => e.allocations?.some(al => al.project_id === projectFilter));
                           
    const matchesCategory = categoryFilter === "all" || fundExpenses.some(e => e.category === categoryFilter);
    
    const matchesSupplier = supplierFilter === "all" || fundExpenses.some(e => e.supplier_id === supplierFilter);
    
    const matchesBank = bankFilter === "all" || f.bank_account_id === bankFilter || 
                        fundExpenses.some(e => e.bank_account_id === bankFilter);

    return matchesSearch && matchesProject && matchesCategory && matchesSupplier && matchesBank;
  });

  const activeTrail = selectedFundId ? getFundTransactionsTrail(selectedFundId) : null;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Money Trail</h1>
        <p className="text-neutral-400 mt-1">Trace the exact journey of every rupee received. Follow payments from deposit down to material and labor deductions.</p>
      </div>

      {/* Filter and selector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN: Project Funds list */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search funds..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#18181b] border border-neutral-800 rounded-md pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-emerald-500 text-neutral-200"
            />
          </div>

          <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg max-h-[60vh] overflow-y-auto divide-y divide-neutral-800/60">
            {filteredFunds.length === 0 ? (
              <div className="p-6 text-center text-neutral-500 text-xs">No project funds match filters.</div>
            ) : (
              filteredFunds.map(f => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFundId(f.id)}
                  className={`p-3.5 cursor-pointer text-xs transition-colors hover:bg-neutral-900/40 ${
                    selectedFundId === f.id ? "bg-neutral-900/60 border-l-2 border-emerald-500" : ""
                  }`}
                >
                  <span className="font-semibold block text-neutral-200">{f.client_name} - Project Fund</span>
                  <span className="text-[10px] text-neutral-400 block mt-1 truncate">{f.project_name}</span>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-neutral-500 font-medium">Pool: {formatINR(f.original_amount)}</span>
                    <span className={`font-semibold ${f.remaining_amount <= 0 ? "text-neutral-500" : "text-emerald-400"}`}>
                      Rem: {formatINR(f.remaining_amount)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Money Trail Visual Timeline */}
        <div className="lg:col-span-3">
          {activeTrail ? (
            <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-6 space-y-6">
              <div className="border-b border-neutral-800 pb-4 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-neutral-200">{activeTrail.fund.client_name} - Project Fund Trail</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Project: {activeTrail.fund.project_name}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Remaining Balance</span>
                  <span className="font-bold text-lg text-emerald-400">{formatINR(activeTrail.fund.remaining_amount)}</span>
                </div>
              </div>

              {/* Visual Flow nodes */}
              <div className="relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-neutral-800">
                {activeTrail.trail.map((node, index) => {
                  const isStart = node.type === "receipt";
                  return (
                    <div key={node.id} className="relative group">
                      
                      {/* Node Icon Indicator */}
                      <span className={`absolute -left-8 top-1.5 w-6.5 h-6.5 rounded-full flex items-center justify-center border transition-all ${
                        isStart 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 group-hover:bg-emerald-500/20" 
                          : "bg-rose-500/10 text-rose-400 border-rose-500/30 group-hover:bg-rose-500/20"
                      }`}>
                        {isStart ? "₹" : <ArrowDown className="w-3 h-3" />}
                      </span>

                      {/* Content */}
                      <div className="bg-[#18181b]/30 hover:bg-[#18181b]/50 border border-neutral-800 rounded-lg p-4 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <div>
                            <span className="text-neutral-400 text-[10px] block font-semibold">{node.date}</span>
                            <h4 className="font-semibold text-sm text-neutral-200 mt-0.5">{node.label}</h4>
                            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{node.description}</p>
                          </div>
                          <div className="text-left sm:text-right shrink-0">
                            <span className={`text-base font-bold block ${isStart ? "text-emerald-400" : "text-rose-500"}`}>
                              {isStart ? "+" : "-"}{formatINR(node.amount)}
                            </span>
                            <span className="text-[10px] text-neutral-500 block mt-0.5">Fund Balance: {formatINR(node.balance)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-12 text-center text-neutral-500 text-sm h-full flex flex-col items-center justify-center gap-2">
              <Coins className="w-8 h-8 text-neutral-600 animate-bounce" />
              <span>Select a Project Fund from the left menu to view its complete money trail.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
