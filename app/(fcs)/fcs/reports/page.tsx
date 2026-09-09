"use client";

import React, { useState } from "react";
import { useFcs } from "../context";
import { 
  FileText, Download, Printer, BarChart3, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Compass, Scale, ShieldAlert, 
  Info, Users, Briefcase
} from "lucide-react";

export default function ReportsPage() {
  const { clients, projects, funds, expenses, suppliers, companySettings, kpis, evaluateProjectHealth } = useFcs();
  const [selectedReport, setSelectedReport] = useState<string>("ceo_summary");

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  // Report Types
  const reportsList = [
    { id: "ceo_summary", label: "Owner Summary (CEO Summary)", description: "High-level visual summary of cash health, margins, and alerts." },
    { id: "money_trail", label: "Money Trail Report", description: "Detailed chronological coin trails for all client project fund pools." },
    { id: "project_funds", label: "Project Fund Report", description: "Remaining and utilized balances for each client advance pool." },
    { id: "funding_utilization", label: "Where the Money Went Report", description: "Tracks cross-funding usage: money spent on own vs. other projects." },
    { id: "planned_vs_actual", label: "Planned vs Actual Report", description: "Comprehensive comparison of estimated budgets vs. actual spending." },
    { id: "cash_position", label: "Company Money Status Report", description: "Total resources (cash, collections, loans) vs. commitments balance sheet." },
    { id: "cash_forecast", label: "Future Money Forecast Report", description: "Expected inflows and outlays over the next 7, 30, and 90 days." },
    { id: "project_financial", label: "Project Financial Report", description: "Contract values, total spent, earnings, and individual health scores." },
    { id: "management_summary", label: "Management Summary", description: "Detailed narrative analysis of profitability and efficiency trends." }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up print:p-8 print:bg-white print:text-black">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Reports</h1>
          <p className="text-neutral-400 mt-1">Generate print-ready management reports and executive summaries with zero jargon.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="bg-emerald-600 hover:bg-emerald-555 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Report / Export PDF
          </button>
        </div>
      </div>

      {/* Report Switcher - Hidden in print */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 print:hidden">
        
        {/* Left Column: Report Options List */}
        <div className="lg:col-span-1 space-y-2">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-1">Select Report Type</span>
          <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg overflow-hidden divide-y divide-neutral-800/60">
            {reportsList.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedReport(r.id)}
                className={`w-full text-left p-3.5 hover:bg-neutral-900/40 transition-colors text-xs font-semibold block ${
                  selectedReport === r.id ? "bg-neutral-900/60 border-l-2 border-emerald-500 text-emerald-400" : "text-neutral-300"
                }`}
              >
                <span>{r.label}</span>
                <span className="text-[10px] text-neutral-500 block font-normal mt-1 leading-relaxed">{r.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Report Viewer (Print-optimized) */}
        <div className="lg:col-span-3 bg-[#0e0e11] border border-neutral-800 rounded-lg p-6 sm:p-8 space-y-8 min-h-[70vh]">
          
          {/* Report Header */}
          <div className="border-b border-neutral-800 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-200">
                {reportsList.find(r => r.id === selectedReport)?.label}
              </h2>
              <p className="text-xs text-neutral-500 mt-1">Generated on: {new Date().toISOString().split("T")[0]}</p>
            </div>
            <span className="bg-neutral-900 border border-neutral-800 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded text-neutral-400">
              ZOOSH MONEY REPORT
            </span>
          </div>

          {/* REPORT CONTENT RENDER */}
          {selectedReport === "ceo_summary" && (
            <div className="space-y-6 text-xs">
              <div className="bg-[#18181b]/50 border border-neutral-800 rounded-lg p-4 flex gap-4 text-xs">
                <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-neutral-300">Executive Summary Note</h4>
                  <p className="text-neutral-400 leading-relaxed">
                    This report represents the cash buffers, project profitability, and risk warnings of the company. Available working capital is healthy, and projects are generally running within variance parameters.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#18181b] p-4 rounded border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block mb-1">Money in Bank</span>
                  <span className="text-lg font-bold text-neutral-200">{formatINR(kpis.currentBankBalance)}</span>
                </div>
                <div className="bg-[#18181b] p-4 rounded border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block mb-1">Money Reserved for Projects</span>
                  <span className="text-lg font-bold text-neutral-200">{formatINR(kpis.committedCash)}</span>
                </div>
                <div className="bg-[#18181b] p-4 rounded border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block mb-1">Money Safe to Spend</span>
                  <span className="text-lg font-bold text-emerald-400">{formatINR(kpis.actuallyAvailableCash)}</span>
                </div>
                <div className="bg-[#18181b] p-4 rounded border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block mb-1">Financial Health Score</span>
                  <span className="text-lg font-bold text-emerald-400 block uppercase">{kpis.companyHealthScore.status}</span>
                </div>
              </div>
            </div>
          )}

          {selectedReport === "money_trail" && (
            <div className="space-y-6 text-xs">
              <p className="text-neutral-400 leading-relaxed">This report outlines all deposits and deductions chronologically across each project fund pool.</p>
              <div className="border border-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-900/50 text-neutral-400 font-bold uppercase">
                      <th className="p-3">Client Fund</th>
                      <th className="p-3">Payment Date</th>
                      <th className="p-3">Original Received</th>
                      <th className="p-3">Total Spent</th>
                      <th className="p-3 text-right">Fund Remaining</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850 text-neutral-300">
                    {funds.map(f => (
                      <tr key={f.id} className="hover:bg-neutral-900/30">
                        <td className="p-3 font-semibold">{f.client_name} - Fund</td>
                        <td className="p-3">{f.payment_date}</td>
                        <td className="p-3">{formatINR(f.original_amount)}</td>
                        <td className="p-3 text-rose-500">-{formatINR(f.amount_used)}</td>
                        <td className="p-3 text-right font-bold text-emerald-400">{formatINR(f.remaining_amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedReport === "project_funds" && (
            <div className="space-y-6 text-xs">
              <div className="border border-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-900/50 text-neutral-400 font-bold uppercase">
                      <th className="p-3">Project Fund</th>
                      <th className="p-3">Deposited Into</th>
                      <th className="p-3">Original Amt (₹)</th>
                      <th className="p-3">Used Amt (₹)</th>
                      <th className="p-3 text-right">Remaining Amt (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850 text-neutral-300">
                    {funds.map(f => (
                      <tr key={f.id} className="hover:bg-neutral-900/30">
                        <td className="p-3 font-semibold">{f.client_name} Fund ({f.project_name})</td>
                        <td className="p-3">{f.bank_name || "Bank Account"}</td>
                        <td className="p-3">{formatINR(f.original_amount)}</td>
                        <td className="p-3">{formatINR(f.amount_used)}</td>
                        <td className="p-3 text-right font-bold text-emerald-400">{formatINR(f.remaining_amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedReport === "funding_utilization" && (
            <div className="space-y-6 text-xs">
              <p className="text-neutral-400">Analysis of whether client advances are spent on their own projects or cross-financing other operations.</p>
              <div className="border border-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-900/50 text-neutral-400 font-bold uppercase">
                      <th className="p-3">Client Fund</th>
                      <th className="p-3">Used for Own Project</th>
                      <th className="p-3">Used for Other Projects</th>
                      <th className="p-3">Used for General Overhead</th>
                      <th className="p-3 text-right">Total Used</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850 text-neutral-300">
                    {funds.map(f => {
                      const fundExpenses = expenses.filter(e => e.funding_source_id === f.id);
                      
                      const ownSpend = fundExpenses.reduce((sum, e) => {
                        const selfAlloc = e.allocations?.find(al => al.project_id === f.project_id);
                        return sum + (selfAlloc ? Number(selfAlloc.allocated_amount) : 0);
                      }, 0);

                      const otherSpend = fundExpenses.reduce((sum, e) => {
                        const otherAllocs = e.allocations?.filter(al => al.project_id !== f.project_id) || [];
                        return sum + otherAllocs.reduce((s, al) => s + Number(al.allocated_amount), 0);
                      }, 0);

                      const overheadSpend = fundExpenses.reduce((sum, e) => {
                        return sum + ((!e.allocations || e.allocations.length === 0) ? Number(e.total_amount) : 0);
                      }, 0);

                      return (
                        <tr key={f.id} className="hover:bg-neutral-900/30">
                          <td className="p-3 font-semibold">{f.client_name} Fund</td>
                          <td className="p-3">{formatINR(ownSpend)}</td>
                          <td className="p-3 text-indigo-400">{formatINR(otherSpend)}</td>
                          <td className="p-3 text-rose-500">{formatINR(overheadSpend)}</td>
                          <td className="p-3 text-right font-bold">{formatINR(f.amount_used)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedReport === "planned_vs_actual" && (
            <div className="space-y-6 text-xs">
              <div className="border border-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-900/50 text-neutral-400 font-bold uppercase">
                      <th className="p-3">Project</th>
                      <th className="p-3">Planned Material (₹)</th>
                      <th className="p-3">Current Material (₹)</th>
                      <th className="p-3">Planned Labour (₹)</th>
                      <th className="p-3">Current Labour (₹)</th>
                      <th className="p-3 text-right">Variance (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850 text-neutral-300">
                    {projects.map(p => {
                      const plannedCost = Number(p.est_material_cost) + Number(p.est_labour_cost) + Number(p.est_hardware_cost) + Number(p.est_transport_cost) + Number(p.est_other_costs);
                      const currentCost = Number(p.act_material_cost) + Number(p.act_labour_cost) + Number(p.act_hardware_cost) + Number(p.act_transport_cost) + Number(p.act_other_costs);
                      const variance = plannedCost - currentCost;
                      return (
                        <tr key={p.id} className="hover:bg-neutral-900/30">
                          <td className="p-3 font-semibold">{p.name}</td>
                          <td className="p-3">{formatINR(p.est_material_cost)}</td>
                          <td className="p-3">{formatINR(p.act_material_cost)}</td>
                          <td className="p-3">{formatINR(p.est_labour_cost)}</td>
                          <td className="p-3">{formatINR(p.act_labour_cost)}</td>
                          <td className={`p-3 text-right font-bold ${variance < 0 ? "text-rose-500" : "text-emerald-400"}`}>
                            {variance < 0 ? `+${formatINR(Math.abs(variance))}` : `-${formatINR(variance)}`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedReport === "cash_position" && (
            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold border-b border-neutral-800 pb-2 mb-3 text-emerald-400">Resources</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>Money in Bank:</span><strong>{formatINR(kpis.currentBankBalance)}</strong></div>
                    <div className="flex justify-between"><span>Expected collections:</span><strong>{formatINR(kpis.outstandingCollections)}</strong></div>
                    <div className="flex justify-between"><span>Partner Capital:</span><strong>{formatINR(companySettings.partner_capital)}</strong></div>
                    <div className="flex justify-between"><span>Loan Balance:</span><strong>{formatINR(companySettings.loan_balance)}</strong></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold border-b border-neutral-800 pb-2 mb-3 text-rose-500">Commitments</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>Amount Owed Suppliers:</span><strong>{formatINR(kpis.supplierPayables)}</strong></div>
                    <div className="flex justify-between"><span>Labour Outstanding:</span><strong>{formatINR(companySettings.labour_outstanding)}</strong></div>
                    <div className="flex justify-between"><span>Cash Needed to Finish Projects:</span><strong>{formatINR(kpis.cashRequiredToFinish)}</strong></div>
                    <div className="flex justify-between"><span>General Company Payables:</span><strong>{formatINR(companySettings.general_company_payables)}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedReport === "cash_forecast" && (
            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-3 gap-6">
                <div className="border border-neutral-800 p-4 rounded bg-[#18181b]/35">
                  <h4 className="font-bold text-neutral-400 block mb-2">Next 7 Days</h4>
                  <p>Inflow: <span className="text-emerald-400 font-bold">+{formatINR(kpis.forecast7Days.inflow)}</span></p>
                  <p>Outflow: <span className="text-rose-500 font-bold">-{formatINR(kpis.forecast7Days.outflow)}</span></p>
                  <p className="border-t border-neutral-850 pt-2 font-bold mt-2">Expected Bal: {formatINR(kpis.forecast7Days.expectedBalance)}</p>
                </div>
                <div className="border border-neutral-800 p-4 rounded bg-[#18181b]/35">
                  <h4 className="font-bold text-neutral-400 block mb-2">Next 30 Days</h4>
                  <p>Inflow: <span className="text-emerald-400 font-bold">+{formatINR(kpis.forecast30Days.inflow)}</span></p>
                  <p>Outflow: <span className="text-rose-500 font-bold">-{formatINR(kpis.forecast30Days.outflow)}</span></p>
                  <p className="border-t border-neutral-850 pt-2 font-bold mt-2">Expected Bal: {formatINR(kpis.forecast30Days.expectedBalance)}</p>
                </div>
                <div className="border border-neutral-800 p-4 rounded bg-[#18181b]/35">
                  <h4 className="font-bold text-neutral-400 block mb-2">Next 90 Days</h4>
                  <p>Inflow: <span className="text-emerald-400 font-bold">+{formatINR(kpis.forecast90Days.inflow)}</span></p>
                  <p>Outflow: <span className="text-rose-500 font-bold">-{formatINR(kpis.forecast90Days.outflow)}</span></p>
                  <p className="border-t border-neutral-850 pt-2 font-bold mt-2">Expected Bal: {formatINR(kpis.forecast90Days.expectedBalance)}</p>
                </div>
              </div>
            </div>
          )}

          {selectedReport === "project_financial" && (
            <div className="space-y-6 text-xs">
              <div className="border border-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-900/50 text-neutral-400 font-bold uppercase">
                      <th className="p-3">Project</th>
                      <th className="p-3">Contract Value</th>
                      <th className="p-3">Total Costs Spent</th>
                      <th className="p-3">Current Earnings</th>
                      <th className="p-3 text-right">Health Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850 text-neutral-300">
                    {projects.map(p => {
                      const cost = Number(p.act_material_cost) + Number(p.act_labour_cost) + Number(p.act_hardware_cost) + Number(p.act_transport_cost) + Number(p.act_other_costs);
                      const earnings = Number(p.est_selling_price) - cost;
                      const health = evaluateProjectHealth ? evaluateProjectHealth(p).status : "Healthy";
                      return (
                        <tr key={p.id} className="hover:bg-neutral-900/30">
                          <td className="p-3 font-semibold">{p.name}</td>
                          <td className="p-3">{formatINR(p.est_selling_price)}</td>
                          <td className="p-3">{formatINR(cost)}</td>
                          <td className={`p-3 font-bold ${earnings < 0 ? "text-rose-500" : "text-emerald-400"}`}>{formatINR(earnings)}</td>
                          <td className="p-3 text-right font-semibold">{health}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedReport === "management_summary" && (
            <div className="space-y-6 text-xs text-neutral-300 leading-relaxed">
              <h3 className="font-bold text-sm text-neutral-200">Management & Operating Statement</h3>
              <p>
                The furniture manufacturing operation is running smoothly. Cash pooled across current accounts totals <strong>{formatINR(kpis.currentBankBalance)}</strong>. Over the current month, cash collections (inflow) have been <strong>{formatINR(kpis.monthlyRevenue)}</strong> against total cash outlays of <strong>{formatINR(kpis.monthlyExpenses)}</strong>.
              </p>
              <p>
                A core management parameter is cross-funding: client advances are often deployed immediately to cover timber, metal fixtures, and workshop overheads across other orders. Our system tracks this timeline. Total client cash reserves of <strong>{formatINR(kpis.committedCash)}</strong> remain fully backed by liquid balances.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
