"use client";

import React, { useState, useEffect } from "react";
import { useFcs } from "../context";
import { Plus, Search, Tag, Wallet, Coins, Percent, AlertCircle, Info } from "lucide-react";
import { fcsDb } from "@/lib/fcs_db";

export default function ExpensesPage() {
  const { 
    projects, 
    funds, 
    bankAccounts, 
    bills, 
    recordExpense, 
    expenses 
  } = useFcs();
  
  // Expense Form State
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().substring(0, 10));
  const [category, setCategory] = useState<"Material" | "Labour" | "Hardware" | "Transport" | "Other Costs" | "General Company Expenses">("Material");
  const [totalAmount, setTotalAmount] = useState("");
  const [bankId, setBankId] = useState("");
  const [fundId, setFundId] = useState(""); // Project Fund Used
  const [payMethod, setPayMethod] = useState<"Bank Transfer" | "Cash">("Bank Transfer");
  const [notes, setNotes] = useState("");
  
  // Split Allocations State
  const [isSplit, setIsSplit] = useState(false);
  const [allocations, setAllocations] = useState<Array<{ project_id: string; amount: number; percentage: number }>>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Recommendations
  const [recommendedFund, setRecommendedFund] = useState<any>(null);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Get recommended project fund when totalAmount or allocations change
  useEffect(() => {
    const fetchRecommendation = async () => {
      const amt = Number(totalAmount) || 0;
      if (amt <= 0) {
        setRecommendedFund(null);
        return;
      }
      
      // If split, pick the first project in split as context
      const targetProjId = allocations.length > 0 ? allocations[0].project_id : undefined;
      const rec = await fcsDb.recommendFundingSource(amt, targetProjId);
      setRecommendedFund(rec);
      // Auto-set the Project Fund if none is selected
      if (rec && !fundId) {
        setFundId(rec.id);
      }
    };
    fetchRecommendation();
  }, [totalAmount, allocations, fundId]);

  // Adjust allocations when totalAmount changes
  const handleAmountChange = (val: string) => {
    setTotalAmount(val);
    const amt = Number(val) || 0;
    if (allocations.length > 0) {
      const updated = allocations.map(a => ({
        ...a,
        amount: Math.round((a.percentage / 100) * amt)
      }));
      setAllocations(updated);
    }
  };

  const handleAddSplitRow = () => {
    setAllocations([...allocations, { project_id: "", amount: 0, percentage: 0 }]);
  };

  const handleRemoveSplitRow = (idx: number) => {
    const updated = allocations.filter((_, i) => i !== idx);
    setAllocations(updated);
  };

  const handleSplitChange = (idx: number, field: "project_id" | "percentage", val: string) => {
    const updated = [...allocations];
    if (field === "project_id") {
      updated[idx].project_id = val;
    } else {
      const pct = Number(val) || 0;
      updated[idx].percentage = pct;
      const amt = Number(totalAmount) || 0;
      updated[idx].amount = Math.round((pct / 100) * amt);
    }
    setAllocations(updated);
  };

  const handleAddExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(totalAmount) || 0;
    if (!bankId || amt <= 0 || !fundId) {
      alert("Please fill in all required fields including Bank Account and Project Fund Used.");
      return;
    }

    // Verify splits
    let finalAllocs: Array<{ project_id: string; amount: number; percentage: number }> = [];
    if (category !== "General Company Expenses") {
      if (isSplit) {
        const totalPct = allocations.reduce((sum, a) => sum + a.percentage, 0);
        if (totalPct !== 100) {
          alert(`Total split percentage must equal 100%. Current sum: ${totalPct}%`);
          return;
        }
        if (allocations.some(a => !a.project_id)) {
          alert("Please select a project for all split lines.");
          return;
        }
        finalAllocs = allocations;
      } else {
        // Find if a single project needs to be linked
        const targetProjId = recommendedFund?.project_id || "";
        if (!targetProjId) {
          alert("Please link this expense to a project or enable split allocations.");
          return;
        }
        finalAllocs = [{ project_id: targetProjId, amount: amt, percentage: 100 }];
      }
    }

    setSubmitting(true);
    try {
      // General overhead translates to category General Overhead internally
      const dbCategory = category === "General Company Expenses" ? "General Overhead" : category;
      
      await recordExpense({
        expense_date: expenseDate,
        category: dbCategory,
        total_amount: amt,
        bank_account_id: bankId,
        funding_source_id: fundId,
        payment_method: payMethod,
        notes: notes || undefined
      }, finalAllocs);

      setTotalAmount("");
      setNotes("");
      setIsSplit(false);
      setAllocations([]);
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Expense</h1>
          <p className="text-neutral-400 mt-1">Record material purchases, carpentry labor payouts, and company overheads.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-555 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Expense Entry
        </button>
      </div>

      {/* Expenses History list */}
      <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg overflow-hidden text-xs">
        <div className="p-4 border-b border-neutral-800">
          <h3 className="font-semibold text-neutral-300 text-sm">Chronological Expense Register</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-[#141417]/50 text-neutral-400 font-semibold uppercase tracking-wider">
                <th className="p-3">Date</th>
                <th className="p-3">Expense Type</th>
                <th className="p-3">Paid Using</th>
                <th className="p-3">Project Fund Used</th>
                <th className="p-3">Details / Splits</th>
                <th className="p-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500">No expenses recorded yet.</td>
                </tr>
              ) : (
                [...expenses].sort((a, b) => b.expense_date.localeCompare(a.expense_date)).map((e) => (
                  <tr key={e.id} className="hover:bg-neutral-900/30 transition-colors">
                    <td className="p-3 text-neutral-400">{e.expense_date}</td>
                    <td className="p-3 font-semibold text-neutral-200">
                      {e.category === "General Overhead" ? "General Company Expenses" : e.category}
                    </td>
                    <td className="p-3 text-neutral-400">
                      {e.payment_method} • {e.bank_name || "Cash"}
                    </td>
                    <td className="p-3 text-neutral-400 font-semibold">{e.fund_name || "Unassigned"}</td>
                    <td className="p-3">
                      {e.allocations && e.allocations.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {e.allocations.map((al, idx) => (
                            <span key={idx} className="bg-neutral-800/80 border border-neutral-800 text-[10px] px-1.5 py-0.5 rounded text-neutral-300">
                              {al.project_name?.split(" - ")[0]}: {formatINR(al.allocated_amount)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-neutral-500 italic">General Company Overhead</span>
                      )}
                      {e.notes && <span className="text-[10px] text-neutral-500 block mt-1">Note: {e.notes}</span>}
                    </td>
                    <td className="p-3 text-right font-bold text-neutral-200">{formatINR(e.total_amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in text-xs">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-neutral-200">Add Expense Entry</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="p-5 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 block">Expense Date *</label>
                  <input
                    type="date"
                    required
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 block">Expense Type (Category) *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                  >
                    <option value="Material">Material Cost</option>
                    <option value="Labour">Labour Cost</option>
                    <option value="Hardware">Hardware Cost</option>
                    <option value="Transport">Transport Cost</option>
                    <option value="Other Costs">Other Costs</option>
                    <option value="General Company Expenses">General Company Expenses</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 block">Total Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 50000"
                    value={totalAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 block">Paid Using *</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 block">Withdraw From Bank / Petty Cash *</label>
                  <select
                    required
                    value={bankId}
                    onChange={(e) => setBankId(e.target.value)}
                    className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                  >
                    <option value="">-- Select Bank Account --</option>
                    {bankAccounts.map(b => (
                      <option key={b.id} value={b.id}>{b.account_name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 block">Project Fund Used (Financer) *</label>
                  <select
                    required
                    value={fundId}
                    onChange={(e) => setFundId(e.target.value)}
                    className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                  >
                    <option value="">-- Select Project Fund --</option>
                    {funds.map(f => (
                      <option key={f.id} value={f.id}>{f.client_name} - Fund (Rem: {formatINR(f.remaining_amount)})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* FIFO Recommendation Alert */}
              {recommendedFund && (
                <div className="bg-[#1b1b22] border border-indigo-500/25 p-3 rounded flex gap-2 text-[11px] text-neutral-300">
                  <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">FIFO Recommendation:</span> old client funds should be cleared first.
                    We recommend charging this expense to <strong>{recommendedFund.client_name} Project Fund</strong>.
                  </div>
                </div>
              )}

              {/* SPLIT ALLOCATIONS - Only if NOT a general company expense */}
              {category !== "General Company Expenses" && (
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-neutral-300">
                      <input
                        type="checkbox"
                        checked={isSplit}
                        onChange={(e) => {
                          setIsSplit(e.target.checked);
                          if (e.target.checked && allocations.length === 0) {
                            setAllocations([{ project_id: "", amount: 0, percentage: 100 }]);
                          }
                        }}
                        className="rounded bg-[#18181b] border-neutral-800 text-emerald-500 focus:ring-emerald-500 focus:ring-opacity-25"
                      />
                      Split Between Projects?
                    </label>
                    {isSplit && (
                      <button
                        type="button"
                        onClick={handleAddSplitRow}
                        className="text-xs text-emerald-400 hover:text-emerald-350 font-semibold"
                      >
                        + Add Split Project
                      </button>
                    )}
                  </div>

                  {isSplit ? (
                    <div className="space-y-2 border border-neutral-800 rounded p-3 bg-neutral-900/10">
                      {allocations.map((a, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <select
                            required
                            value={a.project_id}
                            onChange={(e) => handleSplitChange(idx, "project_id", e.target.value)}
                            className="flex-1 bg-[#18181b] border border-neutral-800 rounded-md px-2 py-1.5 focus:outline-none focus:border-emerald-500 text-neutral-200"
                          >
                            <option value="">-- Project --</option>
                            {projects.filter(p => p.status === "running").map(p => (
                              <option key={p.id} value={p.id}>{p.name.split(" - ")[0]}</option>
                            ))}
                          </select>
                          <div className="relative w-20">
                            <input
                              type="number"
                              required
                              placeholder="%"
                              value={a.percentage || ""}
                              onChange={(e) => handleSplitChange(idx, "percentage", e.target.value)}
                              className="w-full bg-[#18181b] border border-neutral-800 rounded-md pl-2 pr-6 py-1.5 focus:outline-none focus:border-emerald-500 text-neutral-200"
                            />
                            <Percent className="w-3.5 h-3.5 text-neutral-500 absolute right-2 top-2" />
                          </div>
                          <span className="w-24 text-right text-neutral-400 pr-1">{formatINR(a.amount)}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSplitRow(idx)}
                            className="text-rose-500 font-bold p-1"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-[#18181b]/50 p-2.5 rounded border border-neutral-800 text-neutral-400">
                      Expense will be linked directly to the project financed by the chosen Project Fund: <strong>{recommendedFund?.project_name || "Select Project Fund above"}</strong>.
                    </div>
                  )}
                </div>
              )}

              {/* General overhead note */}
              {category === "General Company Expenses" && (
                <div className="bg-[#18181b]/50 p-3 rounded border border-neutral-800 text-neutral-400 leading-relaxed">
                  General Company Expenses (such as rent, salaries, marketing, and electricity) **will not** increase any project's costing sheet, but will be paid out of the selected Project Fund.
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs text-neutral-400 block">Notes / Bill reference</label>
                <input
                  type="text"
                  placeholder="e.g. Timber invoice #Mart-42"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-neutral-800/80">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-4 py-2 rounded text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Record Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
