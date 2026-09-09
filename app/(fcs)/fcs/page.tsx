"use client";

import React, { useState } from "react";
import { useFcs } from "./context";
import { 
  Wallet, Coins, Briefcase, TrendingUp, AlertTriangle, 
  ArrowUpRight, ArrowDownRight, Users, PlusCircle, 
  TrendingDown, CheckCircle2, ChevronRight, HelpCircle,
  Clock, ShieldAlert, Info, Scale
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { kpis, projects, funds, expenses, bankAccounts, suppliers, companySettings } = useFcs();
  
  // Drill-down Modal State
  const [drillDownType, setDrillDownType] = useState<string | null>(null);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Find projects needing attention
  const projectsAttention = projects.filter(p => {
    const estCost = Number(p.est_material_cost) + Number(p.est_labour_cost) + Number(p.est_hardware_cost) + Number(p.est_transport_cost) + Number(p.est_other_costs);
    const actCost = Number(p.act_material_cost) + Number(p.act_labour_cost) + Number(p.act_hardware_cost) + Number(p.act_transport_cost) + Number(p.act_other_costs);
    const budgetVarianceRatio = estCost > 0 ? (actCost - estCost) / estCost : 0;
    const profit = Number(p.est_selling_price) - actCost;
    return p.status === "running" && (profit < 0 || budgetVarianceRatio > 0);
  });

  // Projects status checks
  const projectsOverBudget = projects.filter(p => {
    const est = Number(p.est_material_cost) + Number(p.est_labour_cost) + Number(p.est_hardware_cost) + Number(p.est_transport_cost) + Number(p.est_other_costs);
    const act = Number(p.act_material_cost) + Number(p.act_labour_cost) + Number(p.act_hardware_cost) + Number(p.act_transport_cost) + Number(p.act_other_costs);
    return act > est;
  });

  const projectsInLoss = projects.filter(p => {
    const act = Number(p.act_material_cost) + Number(p.act_labour_cost) + Number(p.act_hardware_cost) + Number(p.act_transport_cost) + Number(p.act_other_costs);
    return (Number(p.est_selling_price) - act) < 0;
  });

  // Category expense calculations
  const expenseCategories = {
    Material: expenses.filter(e => e.category === "Material").reduce((sum, e) => sum + e.total_amount, 0),
    Labour: expenses.filter(e => e.category === "Labour").reduce((sum, e) => sum + e.total_amount, 0),
    Hardware: expenses.filter(e => e.category === "Hardware").reduce((sum, e) => sum + e.total_amount, 0),
    Transport: expenses.filter(e => e.category === "Transport").reduce((sum, e) => sum + e.total_amount, 0),
    Overhead: expenses.filter(e => e.category === "General Overhead" || e.category === "General Company Expenses").reduce((sum, e) => sum + e.total_amount, 0),
  };

  const totalExpenses = Object.values(expenseCategories).reduce((sum, val) => sum + val, 0);

  // Business intelligence responses
  const canSpendToday = kpis.actuallyAvailableCash > 50000;
  const canFinishAllProjects = (kpis.currentBankBalance + kpis.outstandingCollections) >= (kpis.cashRequiredToFinish + kpis.supplierPayables);

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* 🚀 EXECUTIVE BRIEFING PANEL (HOMEPAGE ANSWERS) */}
      <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-200">Company Money Briefing</h2>
          <p className="text-xs text-neutral-400 mt-1">Plain English answers to your daily business management questions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          {/* Question 1 */}
          <div className="bg-[#18181b]/40 border border-neutral-800/80 p-4 rounded-lg space-y-2">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Can we spend money today?</span>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${canSpendToday ? "bg-emerald-500" : "bg-rose-500"}`} />
              <span className="font-semibold text-sm">
                {canSpendToday 
                  ? "Yes, you have free capital safe to spend." 
                  : "Caution: Avoid non-essential spending. Working capital is low."
                }
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Safe cash: <strong>{formatINR(kpis.actuallyAvailableCash)}</strong> (excludes reserved project advances and bills).
            </p>
          </div>

          {/* Question 2 */}
          <div className="bg-[#18181b]/40 border border-neutral-800/80 p-4 rounded-lg space-y-2">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Can we finish every active project?</span>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${canFinishAllProjects ? "bg-emerald-500" : "bg-amber-500"}`} />
              <span className="font-semibold text-sm">
                {canFinishAllProjects 
                  ? "Yes, long-term cash resources are sufficient." 
                  : "Watch: Outstanding liabilities exceed near-term cash forecasts."
                }
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Money needed: <strong>{formatINR(kpis.cashRequiredToFinish)}</strong> | Bank + Uncollected: <strong>{formatINR(kpis.currentBankBalance + kpis.outstandingCollections)}</strong>.
            </p>
          </div>

          {/* Question 3 */}
          <div className="bg-[#18181b]/40 border border-neutral-800/80 p-4 rounded-lg space-y-2">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Which projects need attention?</span>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${projectsAttention.length > 0 ? "bg-rose-500 animate-pulse" : "bg-emerald-500"}`} />
              <span className="font-semibold text-sm">
                {projectsAttention.length > 0 
                  ? `${projectsAttention.length} projects running in loss or over budget.` 
                  : "All projects are healthy and on track."
                }
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              {projectsAttention.length > 0 
                ? `Alerts on: ${projectsAttention.map(p => p.name.split(" - ")[0]).join(", ")}.` 
                : "Spend is within planned parameters."
              }
            </p>
          </div>
        </div>
      </div>

      {/* Financial Health Score Banner */}
      <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg border ${
            kpis.companyHealthScore.color === "green" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
            kpis.companyHealthScore.color === "yellow" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
            "bg-rose-500/10 text-rose-500 border-rose-500/20"
          }`}>
            <Scale className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-neutral-200">Financial Health Score</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Overall evaluation based on project margins, outstanding debts, and working capital buffers.</p>
          </div>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border uppercase ${
          kpis.companyHealthScore.color === "green" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
          kpis.companyHealthScore.color === "yellow" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
          "bg-rose-500/10 text-rose-500 border-rose-500/20"
        }`}>
          {kpis.companyHealthScore.status}
        </span>
      </div>

      {/* KPI GRID WITH DRILL DOWNS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* KPI 1: Money in Bank */}
        <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-5 flex flex-col justify-between group hover:border-neutral-700 transition-all">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Money in Bank</span>
            <button
              onClick={() => setDrillDownType("bank_balance")}
              className="text-neutral-500 hover:text-sky-400 transition-colors p-1"
              title="How is this calculated?"
            >
              <HelpCircle className="w-4.5 h-4.5" />
            </button>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-neutral-200">{formatINR(kpis.currentBankBalance)}</h3>
            <p className="text-[10px] text-neutral-400 mt-1">Cash in bank & petty cash pools</p>
          </div>
        </div>

        {/* KPI 2: Money Reserved for Projects */}
        <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-5 flex flex-col justify-between group hover:border-neutral-700 transition-all">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Money Reserved for Projects</span>
            <button
              onClick={() => setDrillDownType("reserved_cash")}
              className="text-neutral-500 hover:text-sky-400 transition-colors p-1"
              title="How is this calculated?"
            >
              <HelpCircle className="w-4.5 h-4.5" />
            </button>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-neutral-200">{formatINR(kpis.committedCash)}</h3>
            <p className="text-[10px] text-neutral-400 mt-1">Client payments unspent on project costs</p>
          </div>
        </div>

        {/* KPI 3: Money Safe to Spend */}
        <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-5 flex flex-col justify-between group hover:border-neutral-700 transition-all">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Money Safe to Spend</span>
            <button
              onClick={() => setDrillDownType("safe_spend")}
              className="text-neutral-500 hover:text-sky-400 transition-colors p-1"
              title="How is this calculated?"
            >
              <HelpCircle className="w-4.5 h-4.5" />
            </button>
          </div>
          <div className="mt-3">
            <h3 className={`text-2xl font-bold ${kpis.actuallyAvailableCash < 0 ? "text-rose-500" : "text-sky-400"}`}>
              {formatINR(kpis.actuallyAvailableCash)}
            </h3>
            <p className="text-[10px] text-neutral-400 mt-1">Available capital for company overheads</p>
          </div>
        </div>

        {/* KPI 4: Money Needed to Finish All Projects */}
        <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-5 flex flex-col justify-between group hover:border-neutral-700 transition-all">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Needed to Finish Projects</span>
            <button
              onClick={() => setDrillDownType("cash_required_finish")}
              className="text-neutral-500 hover:text-sky-400 transition-colors p-1"
              title="How is this calculated?"
            >
              <HelpCircle className="w-4.5 h-4.5" />
            </button>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-neutral-200">{formatINR(kpis.cashRequiredToFinish)}</h3>
            <p className="text-[10px] text-neutral-400 mt-1">Cost required to complete active projects</p>
          </div>
        </div>

        {/* KPI 5: Money Customers Still Need to Pay */}
        <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-5 flex flex-col justify-between group hover:border-neutral-700 transition-all">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Uncollected Client Money</span>
            <button
              onClick={() => setDrillDownType("customer_collections")}
              className="text-neutral-500 hover:text-sky-400 transition-colors p-1"
              title="How is this calculated?"
            >
              <HelpCircle className="w-4.5 h-4.5" />
            </button>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-neutral-200">{formatINR(kpis.outstandingCollections)}</h3>
            <p className="text-[10px] text-neutral-400 mt-1">Contract balances uncollected</p>
          </div>
        </div>

        {/* KPI 6: Money We Need to Pay Suppliers */}
        <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-5 flex flex-col justify-between group hover:border-neutral-700 transition-all">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Money Owed to Suppliers</span>
            <button
              onClick={() => setDrillDownType("supplier_payables")}
              className="text-neutral-500 hover:text-sky-400 transition-colors p-1"
              title="How is this calculated?"
            >
              <HelpCircle className="w-4.5 h-4.5" />
            </button>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-neutral-200">{formatINR(kpis.supplierPayables)}</h3>
            <p className="text-[10px] text-neutral-400 mt-1">Liability balance on supplier bills</p>
          </div>
        </div>

        {/* KPI 7: Expected Earnings */}
        <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-5 flex flex-col justify-between group hover:border-neutral-700 transition-all">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Expected Earnings</span>
            <button
              onClick={() => setDrillDownType("expected_earnings")}
              className="text-neutral-500 hover:text-sky-400 transition-colors p-1"
              title="How is this calculated?"
            >
              <HelpCircle className="w-4.5 h-4.5" />
            </button>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-neutral-200">{formatINR(kpis.estimatedProfit)}</h3>
            <p className="text-[10px] text-neutral-400 mt-1">Projected profit margin across contracts</p>
          </div>
        </div>

        {/* KPI 8: Current Earnings */}
        <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-5 flex flex-col justify-between group hover:border-neutral-700 transition-all">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Current Earnings</span>
            <button
              onClick={() => setDrillDownType("current_earnings")}
              className="text-neutral-500 hover:text-sky-400 transition-colors p-1"
              title="How is this calculated?"
            >
              <HelpCircle className="w-4.5 h-4.5" />
            </button>
          </div>
          <div className="mt-3">
            <h3 className={`text-xl font-bold ${kpis.actualProfit < 0 ? "text-rose-500" : "text-emerald-400"}`}>
              {formatINR(kpis.actualProfit)}
            </h3>
            <p className="text-[10px] text-neutral-400 mt-1">Selling prices minus actual costs spent</p>
          </div>
        </div>

      </div>

      {/* Drill-down Calculation Overlay Modals */}
      {drillDownType && (() => {
        let title = "";
        let details: Array<{ label: string; val: number | string; subtract?: boolean }> = [];
        let totalVal = 0;

        switch (drillDownType) {
          case "safe_spend":
            title = "Money Safe to Spend Calculation";
            details = [
              { label: "Money in Bank", val: kpis.currentBankBalance },
              { label: "Money Needed to Finish Running Projects", val: kpis.cashRequiredToFinish, subtract: true },
              { label: "Supplier Payments Due", val: kpis.supplierPayables, subtract: true },
              { label: "Labour Payments Due", val: companySettings.labour_outstanding, subtract: true },
              { label: "Upcoming Company Expenses", val: companySettings.general_company_payables, subtract: true }
            ];
            totalVal = kpis.actuallyAvailableCash;
            break;
          case "bank_balance":
            title = "Money in Bank Breakdown";
            details = bankAccounts.map(b => ({
              label: b.account_name,
              val: b.current_balance
            }));
            totalVal = kpis.currentBankBalance;
            break;
          case "reserved_cash":
            title = "Money Reserved for Projects Breakdown";
            details = funds.filter(f => f.remaining_amount > 0).map(f => ({
              label: `${f.client_name} - Project Fund`,
              val: f.remaining_amount
            }));
            totalVal = kpis.committedCash;
            break;
          case "cash_required_finish":
            title = "Money Needed to Finish Running Projects";
            details = projects.filter(p => p.status === "running").map(p => {
              const est = Number(p.est_material_cost) + Number(p.est_labour_cost) + Number(p.est_hardware_cost) + Number(p.est_transport_cost) + Number(p.est_other_costs);
              const act = Number(p.act_material_cost) + Number(p.act_labour_cost) + Number(p.act_hardware_cost) + Number(p.act_transport_cost) + Number(p.act_other_costs);
              return {
                label: p.name,
                val: Math.max(0, est - act)
              };
            });
            totalVal = kpis.cashRequiredToFinish;
            break;
          case "customer_collections":
            title = "Uncollected Client Money Breakdown";
            details = projects.filter(p => p.status === "running").map(p => {
              const paid = funds.filter(f => f.project_id === p.id).reduce((sum, f) => sum + Number(f.original_amount), 0);
              return {
                label: p.name,
                val: Math.max(0, Number(p.est_selling_price) - paid)
              };
            });
            totalVal = kpis.outstandingCollections;
            break;
          case "supplier_payables":
            title = "Money Owed to Suppliers Breakdown";
            details = suppliers.map(s => ({
              label: s.name,
              val: s.outstanding_balance
            }));
            totalVal = kpis.supplierPayables;
            break;
          case "expected_earnings":
            title = "Expected Earnings Summary";
            details = projects.map(p => {
              const estCost = Number(p.est_material_cost) + Number(p.est_labour_cost) + Number(p.est_hardware_cost) + Number(p.est_transport_cost) + Number(p.est_other_costs);
              return {
                label: p.name,
                val: Number(p.est_selling_price) - estCost
              };
            });
            totalVal = kpis.estimatedProfit;
            break;
          case "current_earnings":
            title = "Current Earnings Summary";
            details = projects.map(p => {
              const actCost = Number(p.act_material_cost) + Number(p.act_labour_cost) + Number(p.act_hardware_cost) + Number(p.act_transport_cost) + Number(p.act_other_costs);
              return {
                label: p.name,
                val: Number(p.est_selling_price) - actCost
              };
            });
            totalVal = kpis.actualProfit;
            break;
        }

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg w-full max-w-md overflow-hidden shadow-2xl animate-fade-in text-xs">
              <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
                <h3 className="font-semibold text-sm text-neutral-200">{title}</h3>
                <button
                  onClick={() => setDrillDownType(null)}
                  className="text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-3">
                {details.map((d, idx) => (
                  <div key={idx} className="flex justify-between items-center text-neutral-300">
                    <span>{d.label}</span>
                    <span className={d.subtract ? "text-rose-500 font-semibold" : "font-semibold"}>
                      {d.subtract ? "-" : ""}{typeof d.val === "number" ? formatINR(d.val) : d.val}
                    </span>
                  </div>
                ))}
                <div className="border-t border-neutral-800 pt-3 flex justify-between font-bold text-sm bg-neutral-900/20 -mx-4 px-4 py-2 mt-2">
                  <span className="text-neutral-300">Final Calculated Result</span>
                  <span className={totalVal < 0 ? "text-rose-500" : "text-emerald-400"}>{formatINR(totalVal)}</span>
                </div>
              </div>
              <div className="p-4 border-t border-neutral-800 bg-[#141417]/50 flex justify-end">
                <button
                  onClick={() => setDrillDownType(null)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded font-semibold text-xs transition-colors"
                >
                  Close Explanation
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* SECONDARY ROW: Visual Analytics & Alarms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Project Health Alerts */}
        <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-6 space-y-6">
          <h3 className="font-semibold text-base text-neutral-300">Project Alarms & Health Monitors</h3>
          
          <div className="space-y-4">
            
            {/* Loss Alert */}
            <div className="space-y-2">
              <h4 className="text-xs text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                Projects Overage (Exceeding Contract Value) ({projectsInLoss.length})
              </h4>
              {projectsInLoss.length === 0 ? (
                <p className="text-xs text-neutral-500 italic p-3 bg-neutral-900/20 rounded">No projects currently exceeding contract values.</p>
              ) : (
                <div className="space-y-1.5 text-xs">
                  {projectsInLoss.map(p => (
                    <div key={p.id} className="flex justify-between p-2.5 bg-rose-500/5 border border-rose-500/10 rounded">
                      <span className="font-semibold text-neutral-300">{p.name}</span>
                      <span className="text-rose-500 font-bold">In Loss Position</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Over budget alert */}
            <div className="space-y-2">
              <h4 className="text-xs text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Projects Exceeding Planned Budget ({projectsOverBudget.length})
              </h4>
              {projectsOverBudget.length === 0 ? (
                <p className="text-xs text-neutral-500 italic p-3 bg-neutral-900/20 rounded">No projects currently exceeding cost budgets.</p>
              ) : (
                <div className="space-y-1.5 text-xs">
                  {projectsOverBudget.map(p => (
                    <div key={p.id} className="flex justify-between p-2.5 bg-amber-500/5 border border-amber-500/10 rounded">
                      <span className="font-semibold text-neutral-300">{p.name}</span>
                      <span className="text-amber-500 font-bold">Planned Cost Exceeded</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Expense Category distribution */}
        <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-6 space-y-6">
          <h3 className="font-semibold text-base text-neutral-300">Expenditure Category Allocation</h3>
          
          {totalExpenses === 0 ? (
            <div className="p-8 text-center text-neutral-500 italic">No data available</div>
          ) : (
            <div className="space-y-4">
              {Object.entries(expenseCategories).map(([cat, amt]) => {
                const pct = totalExpenses > 0 ? (amt / totalExpenses) * 100 : 0;
                return (
                  <div key={cat} className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span className="font-semibold text-neutral-300">{cat} Costs</span>
                      <span>{formatINR(amt)} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          cat === "Material" ? "bg-amber-500" :
                          cat === "Labour" ? "bg-emerald-500" :
                          cat === "Hardware" ? "bg-sky-500" :
                          cat === "Transport" ? "bg-indigo-400" :
                          "bg-neutral-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* DATE-DRIVEN FUTURE MONEY FORECAST WIDGET */}
      <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-base text-neutral-300">Future Money Projections</h3>
          <p className="text-xs text-neutral-400 mt-1">Expectation profiles calculated using scheduled collection dates and supplier bill due dates.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          {/* Next 7 Days */}
          <div className="bg-[#18181b]/30 border border-neutral-800 p-4 rounded-lg space-y-3">
            <span className="font-bold text-neutral-400 uppercase tracking-wider block text-[10px]">Next 7 Days</span>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-400">Expected Incoming:</span>
                <span className="text-emerald-400">+{formatINR(kpis.forecast7Days.inflow)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Expected Outgoing:</span>
                <span className="text-rose-500">-{formatINR(kpis.forecast7Days.outflow)}</span>
              </div>
              <div className="border-t border-neutral-800 pt-2 flex justify-between font-bold mt-2">
                <span>Expected Balance:</span>
                <span className={kpis.forecast7Days.expectedBalance < 0 ? "text-rose-500" : "text-sky-400"}>
                  {formatINR(kpis.forecast7Days.expectedBalance)}
                </span>
              </div>
            </div>
          </div>

          {/* Next 30 Days */}
          <div className="bg-[#18181b]/30 border border-neutral-800 p-4 rounded-lg space-y-3">
            <span className="font-bold text-neutral-400 uppercase tracking-wider block text-[10px]">Next 30 Days</span>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-400">Expected Incoming:</span>
                <span className="text-emerald-400">+{formatINR(kpis.forecast30Days.inflow)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Expected Outgoing:</span>
                <span className="text-rose-500">-{formatINR(kpis.forecast30Days.outflow)}</span>
              </div>
              <div className="border-t border-neutral-800 pt-2 flex justify-between font-bold mt-2">
                <span>Expected Balance:</span>
                <span className={kpis.forecast30Days.expectedBalance < 0 ? "text-rose-500" : "text-sky-400"}>
                  {formatINR(kpis.forecast30Days.expectedBalance)}
                </span>
              </div>
            </div>
          </div>

          {/* Next 90 Days */}
          <div className="bg-[#18181b]/30 border border-neutral-800 p-4 rounded-lg space-y-3">
            <span className="font-bold text-neutral-400 uppercase tracking-wider block text-[10px]">Next 90 Days</span>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-400">Expected Incoming:</span>
                <span className="text-emerald-400">+{formatINR(kpis.forecast90Days.inflow)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Expected Outgoing:</span>
                <span className="text-rose-500">-{formatINR(kpis.forecast90Days.outflow)}</span>
              </div>
              <div className="border-t border-neutral-800 pt-2 flex justify-between font-bold mt-2">
                <span>Expected Balance:</span>
                <span className={kpis.forecast90Days.expectedBalance < 0 ? "text-rose-500" : "text-sky-400"}>
                  {formatINR(kpis.forecast90Days.expectedBalance)}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
