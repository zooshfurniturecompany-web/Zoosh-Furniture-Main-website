"use client";

import React, { useState } from "react";
import { useFcs } from "../context";
import { Search, BookOpen, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function CashBookPage() {
  const { funds, expenses, bankAccounts } = useFcs();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "in" | "out">("all");
  const [bankFilter, setBankFilter] = useState("all");

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Compile chronological cashbook list
  const getConsolidatedTransactions = () => {
    const list: Array<{
      id: string;
      date: string;
      type: "in" | "out";
      category: string;
      details: string;
      bankName: string;
      amount: number;
    }> = [];

    // 1. Inflows (Project Funds)
    funds.forEach(f => {
      list.push({
        id: `fund-${f.id}`,
        date: f.payment_date,
        type: "in",
        category: f.payment_type,
        details: `Received from ${f.client_name} • Project: ${f.project_name}`,
        bankName: f.bank_name || "Bank",
        amount: f.original_amount
      });
    });

    // 2. Outflows (Expenses)
    expenses.forEach(e => {
      let spentOn = "";
      if (e.allocations && e.allocations.length > 0) {
        spentOn = `Allocated: ${e.allocations.map(al => al.project_name?.split(" - ")[0]).join(", ")}`;
      } else {
        spentOn = "General Company Overhead";
      }

      list.push({
        id: `exp-${e.id}`,
        date: e.expense_date,
        type: "out",
        category: e.category === "General Overhead" ? "General Company Expenses" : e.category,
        details: `${spentOn} ${e.supplier_name ? `• Paid to: ${e.supplier_name}` : ""} ${e.notes ? `(${e.notes})` : ""}`,
        bankName: e.bank_name || "Bank",
        amount: e.total_amount
      });
    });

    // Sort descending by date
    return list.sort((a, b) => b.date.localeCompare(a.date));
  };

  const transactions = getConsolidatedTransactions();

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.details.toLowerCase().includes(search.toLowerCase()) || 
                          t.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || t.type === typeFilter;
    const matchesBank = bankFilter === "all" || t.bankName === bankFilter; // matches simple bankName or matching details

    return matchesSearch && matchesType && matchesBank;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Money In & Out</h1>
        <p className="text-neutral-400 mt-1">Unified, chronological ledger of all cash deposits (inflows) and expense payouts (outflows).</p>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        
        {/* Total Inflow box */}
        <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-5 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Total Money Received (In)</span>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">
              {formatINR(funds.reduce((sum, f) => sum + Number(f.original_amount), 0))}
            </h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">Sum of all customer payments and advances</p>
          </div>
          <ArrowUpRight className="w-8 h-8 text-emerald-500/20 stroke-[1.5]" />
        </div>

        {/* Total Outflow box */}
        <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-5 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Total Money Spent (Out)</span>
            <h3 className="text-2xl font-bold text-rose-500 mt-1">
              {formatINR(expenses.reduce((sum, e) => sum + Number(e.total_amount), 0))}
            </h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">Sum of materials, labor, and company overheads paid</p>
          </div>
          <ArrowDownRight className="w-8 h-8 text-rose-500/20 stroke-[1.5]" />
        </div>

      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search details or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#18181b] border border-neutral-800 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-neutral-200"
          />
        </div>
        
        <div className="flex gap-2 shrink-0">
          {(["all", "in", "out"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setTypeFilter(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize border transition-all ${
                typeFilter === st
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-neutral-400 border-neutral-800 hover:bg-neutral-900"
              }`}
            >
              {st === "in" ? "Money In" : st === "out" ? "Money Out" : "All Entries"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-[#141417]/50 text-neutral-400 font-semibold uppercase tracking-wider">
                <th className="p-3">Date</th>
                <th className="p-3">Type</th>
                <th className="p-3">Category</th>
                <th className="p-3">Account (Cash Book)</th>
                <th className="p-3">Details / Beneficiaries</th>
                <th className="p-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500">No transactions recorded under filters.</td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-900/35 transition-colors">
                    <td className="p-3 text-neutral-400 font-medium">{t.date}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                        t.type === "in" 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      }`}>
                        {t.type === "in" ? "IN" : "OUT"}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-neutral-200">{t.category}</td>
                    <td className="p-3 text-neutral-400">{t.bankName}</td>
                    <td className="p-3 text-neutral-400">{t.details}</td>
                    <td className={`p-3 text-right font-bold ${t.type === "in" ? "text-emerald-400" : "text-neutral-200"}`}>
                      {t.type === "in" ? "+" : "-"}{formatINR(t.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
