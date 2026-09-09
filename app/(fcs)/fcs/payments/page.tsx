"use client";

import React, { useState } from "react";
import { useFcs } from "../context";
import { Plus, Search, Wallet, DollarSign, Calendar, Eye, FileText, ArrowRightLeft, ArrowDown } from "lucide-react";

export default function PaymentsPage() {
  const { funds, projects, bankAccounts, recordPayment, expenses } = useFcs();
  const [search, setSearch] = useState("");
  
  // Form State
  const [projectId, setProjectId] = useState("");
  const [paymentType, setPaymentType] = useState<"Advance" | "Progress Payment" | "Final Payment" | "Full Payment">("Advance");
  const [payMethod, setPayMethod] = useState<"Bank Transfer" | "Cash">("Bank Transfer");
  const [bankId, setBankId] = useState("");
  const [originalAmt, setOriginalAmt] = useState("");
  const [payDate, setPayDate] = useState(new Date().toISOString().substring(0, 10));
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Selected fund for detail trail
  const [selectedFundId, setSelectedFundId] = useState<string | null>(null);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const getFundBreakdown = (f: typeof funds[0]) => {
    const fundExpenses = expenses.filter(e => e.funding_source_id === f.id);
    
    const ownProjectUsed = fundExpenses.reduce((sum, e) => {
      const ownAlloc = e.allocations?.find(al => al.project_id === f.project_id);
      return sum + (ownAlloc ? Number(ownAlloc.allocated_amount) : 0);
    }, 0);

    const otherProjectsUsed = fundExpenses.reduce((sum, e) => {
      const otherAllocs = e.allocations?.filter(al => al.project_id !== f.project_id) || [];
      return sum + otherAllocs.reduce((s, al) => s + Number(al.allocated_amount), 0);
    }, 0);

    const generalExpensesUsed = fundExpenses.reduce((sum, e) => {
      if (!e.allocations || e.allocations.length === 0) {
        return sum + Number(e.total_amount);
      }
      return sum;
    }, 0);

    return {
      ownProjectUsed,
      otherProjectsUsed,
      generalExpensesUsed
    };
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !bankId || !originalAmt) return;
    setSubmitting(true);
    try {
      await recordPayment({
        project_id: projectId,
        payment_type: paymentType,
        payment_method: payMethod,
        bank_account_id: bankId,
        original_amount: Number(originalAmt),
        payment_date: payDate,
        notes: notes || undefined
      });
      
      setProjectId("");
      setOriginalAmt("");
      setNotes("");
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter project funds
  const filteredFunds = funds.filter(f => {
    const matchesSearch = f.client_name?.toLowerCase().includes(search.toLowerCase()) || 
                          f.project_name?.toLowerCase().includes(search.toLowerCase()) ||
                          f.notes?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const selectedFund = funds.find(f => f.id === selectedFundId);

  // Get chronological usage log of selected Project Fund
  const getFundUsageLog = (fundId: string) => {
    const fund = funds.find(f => f.id === fundId);
    if (!fund) return [];
    
    // Find expenses that list this project fund as source
    const fundExpenses = expenses.filter(e => e.funding_source_id === fundId);
    const sortedExpenses = [...fundExpenses].sort((a, b) => a.expense_date.localeCompare(b.expense_date));
    
    let balance = Number(fund.original_amount);
    
    const logs = [{
      id: "deposit",
      date: fund.payment_date,
      type: "Deposit",
      description: "Initial client deposit pool",
      outflow: 0,
      balance
    }];

    sortedExpenses.forEach(exp => {
      balance -= Number(exp.total_amount);
      let benefiting = "";
      if (exp.allocations && exp.allocations.length > 0) {
        benefiting = exp.allocations.map(al => `${al.project_name} (${al.allocated_percentage}%)`).join(", ");
      } else {
        benefiting = "General Company Overhead";
      }

      logs.push({
        id: exp.id,
        date: exp.expense_date,
        type: exp.category,
        description: `Benefited: ${benefiting} ${exp.notes ? `• Remarks: ${exp.notes}` : ""}`,
        outflow: exp.total_amount,
        balance
      });
    });

    return logs;
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Funds</h1>
          <p className="text-neutral-400 mt-1">Record client deposits and track remaining balances for every client's project fund.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-555 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Record Client Payment
        </button>
      </div>

      {/* Filter and search */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search Project Funds..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#18181b] border border-neutral-800 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-neutral-200"
          />
        </div>
      </div>

      {/* Project Funds List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFunds.length === 0 ? (
          <div className="col-span-full bg-[#0e0e11] border border-neutral-800 rounded-lg p-12 text-center text-neutral-500 text-sm">
            No active project funds registered.
          </div>
        ) : (
          filteredFunds.map((f) => (
            <div key={f.id} className="bg-[#0e0e11] border border-neutral-800 hover:border-neutral-700 rounded-lg p-5 flex flex-col justify-between hover:shadow-md transition-all group">
              <div className="space-y-4 text-xs">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-base text-neutral-200 group-hover:text-emerald-400 transition-colors">{f.client_name} Fund</h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{f.project_name}</p>
                  </div>
                  <span className="bg-[#18181b] border border-neutral-800 text-[10px] font-semibold px-2 py-0.5 rounded text-neutral-300">
                    {f.payment_type}
                  </span>
                </div>

                {/* Account Details */}
                <div className="flex justify-between items-center bg-[#18181b]/40 p-2.5 rounded text-neutral-400">
                  <span>Deposited on: {f.payment_date}</span>
                  <span>Via: {f.payment_method}</span>
                </div>

                {/* Ledger metrics */}
                <div className="space-y-2 border-t border-neutral-800/80 pt-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Original Amount:</span>
                    <span className="font-semibold text-neutral-200">{formatINR(f.original_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Project Fund Used:</span>
                    <span className="font-semibold text-rose-500">-{formatINR(f.amount_used)}</span>
                  </div>
                  {f.amount_used > 0 && (() => {
                    const bd = getFundBreakdown(f);
                    return (
                      <div className="bg-[#141417]/50 p-2.5 rounded border border-neutral-900 mt-1 space-y-1.5 text-[10px] text-neutral-400">
                        <div className="flex justify-between">
                          <span>• Used on Own Project:</span>
                          <span className="font-semibold text-neutral-300">{formatINR(bd.ownProjectUsed)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>• Used on Other Projects:</span>
                          <span className="font-semibold text-indigo-400">{formatINR(bd.otherProjectsUsed)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>• General Company Overheads:</span>
                          <span className="font-semibold text-rose-400">{formatINR(bd.generalExpensesUsed)}</span>
                        </div>
                      </div>
                    );
                  })()}
                  <div className="flex justify-between border-t border-neutral-850 pt-2 font-bold text-sm">
                    <span className="text-neutral-300">Project Fund Remaining:</span>
                    <span className={`font-bold ${f.remaining_amount <= 0 ? "text-neutral-500" : "text-emerald-400"}`}>
                      {formatINR(f.remaining_amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* View usage logs */}
              <button
                onClick={() => setSelectedFundId(f.id)}
                className="mt-5 w-full bg-neutral-800/60 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold py-2 rounded border border-neutral-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Usage History log
              </button>
            </div>
          ))
        )}
      </div>

      {/* Usage log timeline modal */}
      {selectedFund && (() => {
        const usageLogs = getFundUsageLog(selectedFund.id);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg w-full max-w-xl overflow-hidden shadow-2xl animate-fade-in text-xs">
              <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-neutral-200">{selectedFund.client_name} - Project Fund Ledger</h3>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{selectedFund.project_name}</p>
                </div>
                <button
                  onClick={() => setSelectedFundId(null)}
                  className="text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Ledger logs timeline */}
              <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">
                <h4 className="font-bold uppercase tracking-wider text-neutral-400 text-[10px] mb-2">Chronological Deductions</h4>
                <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-800">
                  {usageLogs.map((log, idx) => {
                    const isDeposit = log.type === "Deposit";
                    return (
                      <div key={idx} className="relative">
                        <span className={`absolute -left-6 top-1 w-4 h-4 rounded-full flex items-center justify-center border ${
                          isDeposit 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                            : "bg-rose-500/10 text-rose-500 border-rose-500/30"
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        </span>
                        <div className="bg-[#18181b]/35 border border-neutral-800 rounded p-3 flex justify-between items-center">
                          <div>
                            <span className="text-[9px] text-neutral-500 font-semibold">{log.date}</span>
                            <h5 className="font-semibold text-neutral-200 mt-0.5">{log.type}</h5>
                            <p className="text-[11px] text-neutral-400 mt-0.5">{log.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`font-bold block ${isDeposit ? "text-emerald-400" : "text-rose-500"}`}>
                              {isDeposit ? "+" : "-"}{formatINR(isDeposit ? selectedFund.original_amount : log.outflow)}
                            </span>
                            <span className="text-[10px] text-neutral-500 block mt-0.5">Bal: {formatINR(log.balance)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-5 border-t border-neutral-850 bg-[#141417]/50 flex justify-between items-center">
                <div className="text-left">
                  <span className="text-[10px] text-neutral-400 block uppercase">Final Fund Remaining</span>
                  <span className="text-sm font-bold text-emerald-400">{formatINR(selectedFund.remaining_amount)}</span>
                </div>
                <button
                  onClick={() => setSelectedFundId(null)}
                  className="bg-neutral-850 hover:bg-neutral-800 text-neutral-200 px-4 py-2 rounded text-xs font-semibold transition-colors"
                >
                  Close History
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Add Client Payment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg w-full max-w-md overflow-hidden shadow-2xl animate-fade-in text-xs">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-neutral-200">Record Client Deposit</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddPayment} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-400 block">Link to Project *</label>
                <select
                  required
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                >
                  <option value="">-- Select Project --</option>
                  {projects.filter(p => p.status === "running").map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 block">Payment Type *</label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value as any)}
                    className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                  >
                    <option value="Advance">Advance</option>
                    <option value="Progress Payment">Progress Payment</option>
                    <option value="Final Payment">Final Payment</option>
                    <option value="Full Payment">Full Payment</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 block">Payment Method *</label>
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

              <div className="space-y-1">
                <label className="text-xs text-neutral-400 block">Deposit Into Account *</label>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 block">Payment Date *</label>
                  <input
                    type="date"
                    required
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                    className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 block">Received Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 100000"
                    value={originalAmt}
                    onChange={(e) => setOriginalAmt(e.target.value)}
                    className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400 block">Notes / Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Advance payment invoice 42"
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
                  {submitting ? "Saving..." : "Record Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
