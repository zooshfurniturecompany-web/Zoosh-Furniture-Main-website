"use client";

import React, { useState } from "react";
import { useFcs } from "../context";
import { Plus, Search, Briefcase, FileText, CheckCircle2, AlertTriangle, PlayCircle, BarChart3, TrendingUp, Compass, Heart, Eye } from "lucide-react";

export default function ProjectsPage() {
  const { 
    clients, 
    projects, 
    funds, 
    expenses, 
    bankAccounts, 
    addProject, 
    updateProject, 
    evaluateProjectHealth,
    recordExpense 
  } = useFcs();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "running" | "completed">("all");
  
  // Project Form State
  const [clientId, setClientId] = useState("");
  const [name, setName] = useState("");
  const [estSellingPrice, setEstSellingPrice] = useState("");
  const [estMaterial, setEstMaterial] = useState("");
  const [estLabour, setEstLabour] = useState("");
  const [estHardware, setEstHardware] = useState("");
  const [estTransport, setEstTransport] = useState("");
  const [estOther, setEstOther] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Selected project for details
  const [selectedProjId, setSelectedProjId] = useState<string | null>(null);

  // Add Cost Sub-Form State inside project details
  const [showAddCostForm, setShowAddCostForm] = useState(false);
  const [costAmount, setCostAmount] = useState("");
  const [costCategory, setCostCategory] = useState<"Material" | "Labour" | "Hardware" | "Transport" | "Other Costs">("Material");
  const [costBankId, setCostBankId] = useState("");
  const [costFundId, setCostFundId] = useState("");
  const [costNotes, setCostNotes] = useState("");
  const [costDate, setCostDate] = useState(new Date().toISOString().substring(0, 10));
  const [costSubmitting, setCostSubmitting] = useState(false);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !name || !estSellingPrice) return;
    setSubmitting(true);
    try {
      await addProject({
        client_id: clientId,
        name,
        status: "running",
        est_selling_price: Number(estSellingPrice) || 0,
        est_material_cost: Number(estMaterial) || 0,
        est_labour_cost: Number(estLabour) || 0,
        est_hardware_cost: Number(estHardware) || 0,
        est_transport_cost: Number(estTransport) || 0,
        est_other_costs: Number(estOther) || 0
      });
      
      setClientId("");
      setName("");
      setEstSellingPrice("");
      setEstMaterial("");
      setEstLabour("");
      setEstHardware("");
      setEstTransport("");
      setEstOther("");
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleProjectStatus = async (id: string, currentStatus: 'running' | 'completed') => {
    try {
      await updateProject(id, {
        status: currentStatus === 'running' ? 'completed' : 'running'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const openAddCostForm = (projId: string) => {
    setShowAddCostForm(true);
    if (bankAccounts.length > 0) {
      setCostBankId(bankAccounts[0].id);
    }
    const projFunds = funds.filter(f => f.project_id === projId && f.remaining_amount > 0);
    if (projFunds.length > 0) {
      setCostFundId(projFunds[0].id);
    } else {
      const activeFunds = funds.filter(f => f.remaining_amount > 0);
      if (activeFunds.length > 0) {
        setCostFundId(activeFunds[0].id);
      }
    }
  };

  const handleAddProjectCost = async (e: React.FormEvent, projId: string) => {
    e.preventDefault();
    const amt = Number(costAmount) || 0;
    if (!costBankId || !costFundId || amt <= 0) {
      alert("Please fill in all required fields including Bank Account and Project Fund Used.");
      return;
    }
    setCostSubmitting(true);
    try {
      await recordExpense({
        expense_date: costDate,
        category: costCategory,
        total_amount: amt,
        bank_account_id: costBankId,
        funding_source_id: costFundId,
        payment_method: "Bank Transfer",
        notes: costNotes || undefined
      }, [{ project_id: projId, amount: amt, percentage: 100 }]);

      setCostAmount("");
      setCostNotes("");
      setShowAddCostForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCostSubmitting(false);
    }
  };

  // Filter projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          (p.client_name && p.client_name.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedProject = projects.find(p => p.id === selectedProjId);

  // Advanced project financials including Project Funds allocations
  const getProjectFinancials = (p: typeof projects[0]) => {
    const plannedTotalCost = Number(p.est_material_cost) + Number(p.est_labour_cost) + Number(p.est_hardware_cost) + Number(p.est_transport_cost) + Number(p.est_other_costs);
    const currentTotalCost = Number(p.act_material_cost) + Number(p.act_labour_cost) + Number(p.act_hardware_cost) + Number(p.act_transport_cost) + Number(p.act_other_costs);
    
    const expectedEarnings = Number(p.est_selling_price) - plannedTotalCost;
    const expectedMargin = p.est_selling_price > 0 ? (expectedEarnings / p.est_selling_price) * 100 : 0;
    
    const currentEarnings = Number(p.est_selling_price) - currentTotalCost;
    const currentMargin = p.est_selling_price > 0 ? (currentEarnings / p.est_selling_price) * 100 : 0;

    const budgetDifference = plannedTotalCost - currentTotalCost;

    // Payments received (Project Funds original sum)
    const projectFunds = funds.filter(f => f.project_id === p.id);
    const paymentsReceived = projectFunds.reduce((sum, f) => sum + Number(f.original_amount), 0);
    const outstandingAmount = Math.max(0, Number(p.est_selling_price) - paymentsReceived);
    const fundRemaining = projectFunds.reduce((sum, f) => sum + Number(f.remaining_amount), 0);

    // Cost required to finish
    const cashRequiredToFinish = p.status === "running" ? Math.max(0, plannedTotalCost - currentTotalCost) : 0;

    // Project Fund Breakdown tracking
    const ownFundIds = projectFunds.map(f => f.id);
    
    const moneyUsedOwnProject = expenses
      .filter(e => e.funding_source_id && ownFundIds.includes(e.funding_source_id))
      .reduce((sum, e) => {
        const selfAlloc = e.allocations?.find(al => al.project_id === p.id);
        return sum + (selfAlloc ? Number(selfAlloc.allocated_amount) : 0);
      }, 0);

    const moneyUsedOtherProjects = expenses
      .filter(e => e.funding_source_id && ownFundIds.includes(e.funding_source_id))
      .reduce((sum, e) => {
        const otherAllocs = e.allocations?.filter(al => al.project_id !== p.id) || [];
        const otherSum = otherAllocs.reduce((s, al) => s + Number(al.allocated_amount), 0);
        return sum + otherSum;
      }, 0);

    const generalOverheadsPaid = expenses
      .filter(e => e.funding_source_id && ownFundIds.includes(e.funding_source_id) && (!e.allocations || e.allocations.length === 0))
      .reduce((sum, e) => sum + Number(e.total_amount), 0);

    // Health Score
    const health = evaluateProjectHealth(p);

    return {
      plannedTotalCost,
      currentTotalCost,
      expectedEarnings,
      expectedMargin,
      currentEarnings,
      currentMargin,
      budgetDifference,
      paymentsReceived,
      outstandingAmount,
      fundRemaining,
      cashRequiredToFinish,
      moneyUsedOwnProject,
      moneyUsedOtherProjects,
      generalOverheadsPaid,
      health
    };
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Money & Costs</h1>
          <p className="text-neutral-400 mt-1">Manage project quotes, live production cost variances, health status, and cross-funding breakdowns.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-555 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Project Estimate
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search projects or clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#18181b] border border-neutral-800 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-neutral-200"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          {(["all", "running", "completed"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize border transition-all ${
                statusFilter === st
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-neutral-400 border-neutral-800 hover:bg-neutral-900"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-800 bg-[#141417]/50 text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                <th className="p-4">Project / Client</th>
                <th className="p-4">Contract Value (₹)</th>
                <th className="p-4">Planned Cost (₹)</th>
                <th className="p-4">Current Cost (₹)</th>
                <th className="p-4">Payments Received (₹)</th>
                <th className="p-4">Current Earnings</th>
                <th className="p-4">Health Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-neutral-500">No project money files found.</td>
                </tr>
              ) : (
                filteredProjects.map((p) => {
                  const fin = getProjectFinancials(p);
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-neutral-900/20 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedProjId(p.id);
                        setShowAddCostForm(false);
                      }}
                    >
                      <td className="p-4">
                        <span className="font-semibold block text-neutral-200">{p.name}</span>
                        <span className="text-xs text-neutral-400 mt-0.5">{p.client_name}</span>
                      </td>
                      <td className="p-4 font-semibold text-neutral-200">{formatINR(p.est_selling_price)}</td>
                      <td className="p-4 text-neutral-400">{formatINR(fin.plannedTotalCost)}</td>
                      <td className="p-4">
                        <span className={`font-semibold ${fin.currentTotalCost > fin.plannedTotalCost ? "text-rose-500" : "text-neutral-300"}`}>
                          {formatINR(fin.currentTotalCost)}
                        </span>
                      </td>
                      <td className="p-4 text-emerald-400 font-semibold">{formatINR(fin.paymentsReceived)}</td>
                      <td className="p-4">
                        <span className={`font-semibold ${fin.currentEarnings < 0 ? "text-rose-500" : "text-emerald-400"}`}>
                          {formatINR(fin.currentEarnings)}
                        </span>
                        <span className="text-xs text-neutral-400 block">{fin.currentMargin.toFixed(0)}% earnings</span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          fin.health.color === "green" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                          fin.health.color === "yellow" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                          "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        }`}>
                          {fin.health.status}
                        </span>
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleProjectStatus(p.id, p.status)}
                          className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                            p.status === "running"
                              ? "border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
                              : "border-sky-500/20 text-sky-500 hover:bg-sky-500/10"
                          }`}
                        >
                          {p.status === "running" ? "Mark Complete" : "Re-open Project"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (() => {
        const fin = getProjectFinancials(selectedProject);
        
        const categories = [
          { label: "Material Cost", est: selectedProject.est_material_cost, act: selectedProject.act_material_cost },
          { label: "Labour Cost", est: selectedProject.est_labour_cost, act: selectedProject.act_labour_cost },
          { label: "Hardware Cost", est: selectedProject.est_hardware_cost, act: selectedProject.act_hardware_cost },
          { label: "Transport Cost", est: selectedProject.est_transport_cost, act: selectedProject.act_transport_cost },
          { label: "Other Costs", est: selectedProject.est_other_costs, act: selectedProject.act_other_costs },
        ];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm p-4">
            <div className="bg-[#0e0e11] border-l border-neutral-800 w-full max-w-2xl h-full flex flex-col justify-between shadow-2xl animate-fade-in">
              <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xl text-neutral-100">{selectedProject.name} Money</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Client Profile: {selectedProject.client_name}</p>
                </div>
                <button
                  onClick={() => setSelectedProjId(null)}
                  className="text-neutral-400 hover:text-white text-lg p-1 hover:bg-neutral-800 rounded"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable details */}
              <div className="p-6 flex-1 overflow-y-auto space-y-6 text-xs">
                
                {/* Project health message */}
                <div className={`border p-4 rounded-lg flex gap-3 ${
                  fin.health.color === "green" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  fin.health.color === "yellow" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                  "bg-rose-500/10 text-rose-500 border-rose-500/20"
                }`}>
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Project Health Score: {fin.health.status}</h4>
                    <p className="text-xs opacity-90 mt-1 leading-relaxed">
                      {fin.health.status === "Healthy" 
                        ? "This project is running within planned cost targets and is financed correctly."
                        : fin.health.status === "Watch"
                        ? "Watch: Expenses exceed contract collections or planned budgets slightly."
                        : "Alert: This project is running at a net loss or exceeds planned target costs significantly."
                      }
                    </p>
                  </div>
                </div>

                {/* Primary numbers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-[#18181b] p-3 rounded-lg border border-neutral-800 text-center">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Contract Value</span>
                    <span className="text-sm font-bold text-neutral-200">{formatINR(selectedProject.est_selling_price)}</span>
                  </div>
                  <div className="bg-[#18181b] p-3 rounded-lg border border-neutral-800 text-center">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Paid Received</span>
                    <span className="text-sm font-bold text-emerald-400">{formatINR(fin.paymentsReceived)}</span>
                  </div>
                  <div className="bg-[#18181b] p-3 rounded-lg border border-neutral-800 text-center">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Customer Outstanding</span>
                    <span className="text-sm font-bold text-amber-500">{formatINR(fin.outstandingAmount)}</span>
                  </div>
                  <div className="bg-[#18181b] p-3 rounded-lg border border-neutral-800 text-center">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Project Fund Remaining</span>
                    <span className="text-sm font-bold text-sky-400">{formatINR(fin.fundRemaining)}</span>
                  </div>
                </div>

                {/* Project Fund Complete Journey */}
                <div className="bg-[#18181b] border border-neutral-800 rounded-lg p-4 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400">Client Payments Complete Money Journey</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <span className="text-[10px] text-neutral-500 block">Money Used for Own Project:</span>
                      <span className="font-semibold text-neutral-200 text-xs block mt-1">{formatINR(fin.moneyUsedOwnProject)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 block">Money Used for Other Projects:</span>
                      <span className="font-semibold text-indigo-400 text-xs block mt-1">{formatINR(fin.moneyUsedOtherProjects)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 block">General Company Expenses Paid:</span>
                      <span className="font-semibold text-rose-500 text-xs block mt-1">{formatINR(fin.generalOverheadsPaid)}</span>
                    </div>
                  </div>
                </div>

                {/* Planned vs Actual table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Planned vs Current cost breakdown</h4>
                  <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-800 bg-[#18181b]/50 text-neutral-400 font-bold uppercase tracking-wider">
                          <th className="p-3">Category</th>
                          <th className="p-3">Planned Cost (₹)</th>
                          <th className="p-3">Current Cost (₹)</th>
                          <th className="p-3">Difference (₹)</th>
                          <th className="p-3">Usage Bar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/80">
                        {categories.map((c, idx) => {
                          const diffVal = c.est - c.act;
                          const pct = c.est > 0 ? (c.act / c.est) * 100 : 0;
                          return (
                            <tr key={idx} className="hover:bg-neutral-900/40">
                              <td className="p-3 font-semibold text-neutral-300">{c.label}</td>
                              <td className="p-3 text-neutral-300">{formatINR(c.est)}</td>
                              <td className="p-3 font-medium text-neutral-200">{formatINR(c.act)}</td>
                              <td className={`p-3 font-bold ${diffVal < 0 ? "text-rose-500" : "text-emerald-400"}`}>
                                {diffVal < 0 ? `+${formatINR(Math.abs(diffVal))}` : `-${formatINR(diffVal)}`}
                              </td>
                              <td className="p-3 w-1/4">
                                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      pct > 100 ? "bg-rose-500" : pct > 85 ? "bg-amber-500" : "bg-emerald-500"
                                    }`}
                                    style={{ width: `${Math.min(100, pct)}%` }}
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {/* Summary totals */}
                        <tr className="bg-[#18181b]/40 font-bold border-t border-neutral-700">
                          <td className="p-3">Total Costs</td>
                          <td className="p-3">{formatINR(fin.plannedTotalCost)}</td>
                          <td className="p-3 text-neutral-200">{formatINR(fin.currentTotalCost)}</td>
                          <td className={`p-3 ${fin.budgetDifference < 0 ? "text-rose-500" : "text-emerald-400"}`}>
                            {fin.budgetDifference < 0 
                              ? `+${formatINR(Math.abs(fin.budgetDifference))}` 
                              : `-${formatINR(fin.budgetDifference)}`
                            }
                          </td>
                          <td className="p-3">
                            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  fin.currentTotalCost > fin.plannedTotalCost ? "bg-rose-500" : "bg-emerald-500"
                                }`}
                                style={{ width: `${Math.min(100, fin.plannedTotalCost > 0 ? (fin.currentTotalCost / fin.plannedTotalCost) * 100 : 0)}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Additional KPI Summary details */}
                <div className="bg-[#18181b] p-4 rounded-lg border border-neutral-800 space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Project Status:</span>
                    <span className={`font-semibold capitalize ${selectedProject.status === "running" ? "text-sky-400" : "text-emerald-400"}`}>
                      {selectedProject.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Expected Earnings (Planned profit):</span>
                    <span className="font-semibold text-neutral-200">{formatINR(fin.expectedEarnings)} ({fin.expectedMargin.toFixed(0)}% margin)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Current Earnings (Actual profit so far):</span>
                    <span className={`font-semibold ${fin.currentEarnings < 0 ? "text-rose-500" : "text-emerald-400"}`}>
                      {formatINR(fin.currentEarnings)} ({fin.currentMargin.toFixed(0)}% margin)
                    </span>
                  </div>
                  {selectedProject.status === "running" && (
                    <div className="flex justify-between border-t border-neutral-800 pt-2 mt-2 font-bold text-xs">
                      <span className="text-neutral-300">Cash Still Required To Finish Project:</span>
                      <span className="text-sky-400">{formatINR(fin.cashRequiredToFinish)}</span>
                    </div>
                  )}
                </div>

                {/* 📝 ACTUAL EXPENSE LOG & ADD DIRECT COST PANEL */}
                <div className="space-y-4 pt-4 border-t border-neutral-800">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Actual Expense Log for this Project</h4>
                    {selectedProject.status === "running" && !showAddCostForm && (
                      <button
                        onClick={() => openAddCostForm(selectedProject.id)}
                        className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Actual Cost
                      </button>
                    )}
                  </div>

                  {/* Add Cost Form Inline */}
                  {showAddCostForm && (
                    <form 
                      onSubmit={(e) => handleAddProjectCost(e, selectedProject.id)}
                      className="bg-[#18181b]/50 border border-neutral-800 p-4 rounded-lg space-y-3 text-xs"
                    >
                      <h5 className="font-semibold text-neutral-300">Record Direct Project Cost</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-neutral-400 block text-[10px]">Cost Type *</label>
                          <select
                            value={costCategory}
                            onChange={(e) => setCostCategory(e.target.value as any)}
                            className="w-full bg-[#0e0e11] border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                          >
                            <option value="Material">Material Cost</option>
                            <option value="Labour">Labour Cost</option>
                            <option value="Hardware">Hardware Cost</option>
                            <option value="Transport">Transport Cost</option>
                            <option value="Other">Other Costs</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-neutral-400 block text-[10px]">Amount (₹) *</label>
                          <input
                            type="number"
                            required
                            placeholder="e.g. 15000"
                            value={costAmount}
                            onChange={(e) => setCostAmount(e.target.value)}
                            className="w-full bg-[#0e0e11] border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-neutral-400 block text-[10px]">Bank / Petty Cash *</label>
                          <select
                            required
                            value={costBankId}
                            onChange={(e) => setCostBankId(e.target.value)}
                            className="w-full bg-[#0e0e11] border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                          >
                            <option value="">-- Select --</option>
                            {bankAccounts.map(b => (
                              <option key={b.id} value={b.id}>{b.account_name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-neutral-400 block text-[10px]">Project Fund Used *</label>
                          <select
                            required
                            value={costFundId}
                            onChange={(e) => setCostFundId(e.target.value)}
                            className="w-full bg-[#0e0e11] border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                          >
                            <option value="">-- Select --</option>
                            {funds.map(f => (
                              <option key={f.id} value={f.id}>{f.client_name} - Fund (Rem: {formatINR(f.remaining_amount)})</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1 col-span-2">
                          <label className="text-neutral-400 block text-[10px]">Notes / Bill Reference *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Purchase of teakwood planks"
                            value={costNotes}
                            onChange={(e) => setCostNotes(e.target.value)}
                            className="w-full bg-[#0e0e11] border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddCostForm(false)}
                          className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-1.5 rounded font-semibold text-[11px] transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={costSubmitting}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded font-semibold text-[11px] transition-colors disabled:opacity-50"
                        >
                          {costSubmitting ? "Adding..." : "Add Direct Cost"}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Expense history list table */}
                  <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-800 bg-[#18181b]/50 text-neutral-400 font-bold uppercase tracking-wider">
                          <th className="p-3">Date</th>
                          <th className="p-3">Expense Type</th>
                          <th className="p-3">Remarks / Supplier</th>
                          <th className="p-3 text-right">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/80 text-neutral-300 font-medium">
                        {(() => {
                          const projectExpenses = expenses.filter(e => 
                            e.allocations?.some(al => al.project_id === selectedProject.id)
                          );
                          
                          if (projectExpenses.length === 0) {
                            return (
                              <tr>
                                <td colSpan={4} className="p-3 text-center text-neutral-500 italic">
                                  No actual costs have been logged for this project yet.
                                </td>
                              </tr>
                            );
                          }
                          
                          return projectExpenses.map(e => {
                            const allocAmount = e.allocations?.find(al => al.project_id === selectedProject.id)?.allocated_amount || 0;
                            return (
                              <tr key={e.id} className="hover:bg-neutral-900/40">
                                <td className="p-3 text-neutral-400">{e.expense_date}</td>
                                <td className="p-3 font-semibold text-neutral-200">
                                  {e.category === "General Overhead" ? "General Company Expenses" : e.category}
                                </td>
                                <td className="p-3 truncate max-w-xs">{e.notes || "N/A"}</td>
                                <td className="p-3 text-right font-bold text-neutral-200">{formatINR(allocAmount)}</td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              <div className="p-6 border-t border-neutral-800 bg-[#141417]/50 flex justify-end">
                <button
                  onClick={() => setSelectedProjId(null)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-5 py-2.5 rounded text-sm font-semibold transition-colors"
                >
                  Close File
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Add Project Estimate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg w-full max-w-xl overflow-hidden shadow-2xl animate-fade-in text-xs">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-neutral-200">Create New Project Estimate</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddProject} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-xs text-neutral-400 block">Link to Client *</label>
                  <select
                    required
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                  >
                    <option value="">-- Select Client --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-xs text-neutral-400 block">Project Description Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ali - Luxury Oak Sofa Set"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 block">Quoted Contract Value (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 350000"
                    value={estSellingPrice}
                    onChange={(e) => setEstSellingPrice(e.target.value)}
                    className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 block">Planned Material Cost (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 120000"
                    value={estMaterial}
                    onChange={(e) => setEstMaterial(e.target.value)}
                    className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 block">Planned Labour Cost (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={estLabour}
                    onChange={(e) => setEstLabour(e.target.value)}
                    className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 block">Planned Hardware Cost (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 15000"
                    value={estHardware}
                    onChange={(e) => setEstHardware(e.target.value)}
                    className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 block">Planned Transport Cost (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 10000"
                    value={estTransport}
                    onChange={(e) => setEstTransport(e.target.value)}
                    className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400 block">Planned Other Costs (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={estOther}
                    onChange={(e) => setEstOther(e.target.value)}
                    className="w-full bg-[#18181b] border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-neutral-200"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-neutral-800/85">
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
                  className="bg-emerald-600 hover:bg-emerald-505 text-white px-4 py-2 rounded text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Save Project Estimate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
