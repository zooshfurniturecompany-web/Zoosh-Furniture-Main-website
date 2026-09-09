"use client";

import React, { useState } from "react";
import { useFcs } from "../context";
import { Plus, Search, User, Mail, Phone, Calendar, ArrowRight, Coins } from "lucide-react";

export default function ClientsPage() {
  const { clients, projects, funds, addClient } = useFcs();
  const [search, setSearch] = useState("");
  
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setSubmitting(true);
    try {
      await addClient({
        name,
        email: email || undefined,
        phone: phone || undefined
      });
      setName("");
      setEmail("");
      setPhone("");
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter clients
  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
    (c.phone && c.phone.includes(search))
  );

  // Compute stats per client
  const getClientStats = (clientId: string) => {
    const clientProjects = projects.filter(p => p.client_id === clientId);
    const projectIds = clientProjects.map(p => p.id);
    
    // Total quoted (Contract Value)
    const totalContractValue = clientProjects.reduce((sum, p) => sum + Number(p.est_selling_price), 0);
    
    // Total payments received (Project Funds received)
    const totalReceived = funds
      .filter(f => projectIds.includes(f.project_id))
      .reduce((sum, f) => sum + Number(f.original_amount), 0);

    // Outstanding collection
    const outstanding = Math.max(0, totalContractValue - totalReceived);

    // Total actual spent
    const totalSpent = clientProjects.reduce((sum, p) => {
      return sum + Number(p.act_material_cost) + Number(p.act_labour_cost) + Number(p.act_hardware_cost) + Number(p.act_transport_cost) + Number(p.act_other_costs);
    }, 0);

    // Profitability
    const profit = totalContractValue - totalSpent;
    const margin = totalContractValue > 0 ? (profit / totalContractValue) * 100 : 0;

    return {
      projectCount: clientProjects.length,
      totalContractValue,
      totalReceived,
      outstanding,
      totalSpent,
      profit,
      margin
    };
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients Directory</h1>
          <p className="text-neutral-400 mt-1">Manage client profiles and view client-level aggregated financial summaries.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-505 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Client Profile
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#18181b] border border-neutral-800 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Grid of Client Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.length === 0 ? (
          <div className="col-span-full bg-[#0e0e11] border border-neutral-800 rounded-lg p-12 text-center text-neutral-500 text-sm">
            No client records found.
          </div>
        ) : (
          filteredClients.map((c) => {
            const stats = getClientStats(c.id);
            return (
              <div key={c.id} className="bg-[#0e0e11] border border-neutral-800 hover:border-neutral-700 rounded-lg overflow-hidden transition-all flex flex-col justify-between group">
                <div className="p-5 space-y-4">
                  {/* Title & Info */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-emerald-400 transition-colors">{c.name}</h3>
                      <div className="flex flex-col gap-1 mt-1 text-xs text-neutral-400">
                        {c.email && (
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-neutral-500" />
                            <span>{c.email}</span>
                          </div>
                        )}
                        {c.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-neutral-500" />
                            <span>{c.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="bg-[#18181b] text-neutral-300 border border-neutral-800 px-2.5 py-1 rounded text-xs font-semibold">
                      {stats.projectCount} {stats.projectCount === 1 ? "Project" : "Projects"}
                    </span>
                  </div>

                  {/* Financial Grid in Plain English */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-800/60 text-xs">
                    <div className="bg-[#18181b]/50 p-2 rounded">
                      <span className="text-neutral-400 block mb-0.5">Contract Value:</span>
                      <span className="font-semibold text-neutral-200">{formatINR(stats.totalContractValue)}</span>
                    </div>
                    <div className="bg-[#18181b]/50 p-2 rounded">
                      <span className="text-emerald-500/80 block mb-0.5">Project Fund Received:</span>
                      <span className="font-semibold text-emerald-400">{formatINR(stats.totalReceived)}</span>
                    </div>
                    <div className="bg-[#18181b]/50 p-2 rounded">
                      <span className="text-neutral-400 block mb-0.5">Outstanding collection:</span>
                      <span className="font-semibold text-amber-500">{formatINR(stats.outstanding)}</span>
                    </div>
                    <div className="bg-[#18181b]/50 p-2 rounded">
                      <span className="text-neutral-400 block mb-0.5">Expected Earnings:</span>
                      <span className={`font-semibold ${stats.profit < 0 ? "text-rose-500" : "text-emerald-400"}`}>
                        {formatINR(stats.profit)} ({stats.margin.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#141417] px-5 py-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-emerald-500 hover:text-emerald-400 hover:bg-neutral-800/20 cursor-pointer transition-all">
                  <span>View Project Details</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="font-semibold text-lg">Add New Client</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddClient} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-400 block">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ali Mohammed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400 block">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. ali@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400 block">Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  {submitting ? "Saving..." : "Save Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
