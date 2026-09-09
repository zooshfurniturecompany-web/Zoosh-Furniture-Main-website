"use client";

import React, { useState } from "react";
import { useFcs } from "../context";
import { Plus, Search, Truck, FileText, CheckCircle2, AlertTriangle, Calendar, Award } from "lucide-react";

export default function SuppliersPage() {
  const { suppliers, bills, projects, recordBill } = useFcs();
  const [search, setSearch] = useState("");
  const [billStatusFilter, setBillStatusFilter] = useState<"all" | "unpaid" | "paid">("all");
  
  // Bill Form State
  const [supplierId, setSupplierId] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [billDate, setBillDate] = useState(new Date().toISOString().substring(0, 10));
  const [dueDate, setDueDate] = useState(new Date().toISOString().substring(0, 10));
  const [projectId, setProjectId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || !billNumber || !amount) return;
    setSubmitting(true);
    try {
      await recordBill({
        supplier_id: supplierId,
        bill_number: billNumber,
        amount: Number(amount),
        bill_date: billDate,
        due_date: dueDate || undefined,
        project_id: projectId || undefined
      });
      
      setSupplierId("");
      setBillNumber("");
      setAmount("");
      setProjectId("");
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter bills
  const filteredBills = bills.filter(b => {
    const matchesSearch = b.bill_number.toLowerCase().includes(search.toLowerCase()) || 
                          (b.supplier_name && b.supplier_name.toLowerCase().includes(search.toLowerCase()));
    
    let matchesStatus = true;
    if (billStatusFilter === "unpaid") {
      matchesStatus = b.status === "unpaid" || b.status === "partially_paid";
    } else if (billStatusFilter === "paid") {
      matchesStatus = b.status === "paid";
    }
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supplier History & Bills</h1>
          <p className="text-neutral-400 mt-1">Track credit purchases, supplier bills, due dates, and amount owed to suppliers.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-555 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Log Supplier Bill
        </button>
      </div>

      {/* Grid summarizing payables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Outstanding box */}
        <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Total Amount to Pay Suppliers</span>
            <h3 className="text-2xl font-bold text-rose-500 mt-1">
              {formatINR(suppliers.reduce((sum, s) => sum + Number(s.outstanding_balance), 0))}
            </h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">Sum of all outstanding bills on credit</p>
          </div>
          <Truck className="w-8 h-8 text-neutral-600 stroke-[1.5]" />
        </div>

        {/* Unpaid counts */}
        <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Pending Credit Bills</span>
            <h3 className="text-2xl font-bold text-neutral-200 mt-1">
              {bills.filter(b => b.status !== "paid").length} Bills
            </h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">Bills requiring payment clearing</p>
          </div>
          <FileText className="w-8 h-8 text-neutral-600 stroke-[1.5]" />
        </div>
      </div>

      {/* Bill filter tabs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by bill number or supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#18181b] border border-neutral-800 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-neutral-200"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          {(["all", "unpaid", "paid"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setBillStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize border transition-all ${
                billStatusFilter === st
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-neutral-400 border-neutral-800 hover:bg-neutral-900"
              }`}
            >
              {st === "unpaid" ? "Unpaid / Pending" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Bill List Table */}
      <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-[#141417]/50 text-neutral-400 font-semibold uppercase tracking-wider">
                <th className="p-3">Bill Ref / Date</th>
                <th className="p-3">Supplier Name</th>
                <th className="p-3">Linked Project</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Bill Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500">No supplier bills logged.</td>
                </tr>
              ) : (
                [...filteredBills].sort((a, b) => b.bill_date.localeCompare(a.bill_date)).map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-900/30 transition-colors">
                    <td className="p-3">
                      <span className="font-semibold block text-neutral-200">#{b.bill_number}</span>
                      <span className="text-[10px] text-neutral-500 block mt-0.5">Logged: {b.bill_date}</span>
                    </td>
                    <td className="p-3 font-semibold text-neutral-300">{b.supplier_name}</td>
                    <td className="p-3 text-neutral-400">{b.project_name || "General overhead"}</td>
                    <td className="p-3 text-neutral-400 font-semibold">{b.due_date || "Immediate"}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border capitalize ${
                        b.status === "paid" 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : b.status === "partially_paid"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      }`}>
                        {b.status === "partially_paid" ? "Part Paid" : b.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-neutral-200">{formatINR(b.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Bill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg w-full max-w-md overflow-hidden shadow-2xl animate-fade-in text-xs">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-neutral-200">Log Supplier Bill</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddBill} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-400 block">Supplier *</label>
                <select
                  required
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                >
                  <option value="">-- Select Supplier --</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (Bal: {formatINR(s.outstanding_balance)})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 block">Bill Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TIMB-987"
                    value={billNumber}
                    onChange={(e) => setBillNumber(e.target.value)}
                    className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 block">Bill Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 25000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 block">Bill Date *</label>
                  <input
                    type="date"
                    required
                    value={billDate}
                    onChange={(e) => setBillDate(e.target.value)}
                    className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 block">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400 block">Link to Project (Optional)</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                >
                  <option value="">-- General / Overhead --</option>
                  {projects.filter(p => p.status === "running").map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
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
                  className="bg-emerald-600 hover:bg-emerald-555 text-white px-4 py-2 rounded text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Log Bill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
