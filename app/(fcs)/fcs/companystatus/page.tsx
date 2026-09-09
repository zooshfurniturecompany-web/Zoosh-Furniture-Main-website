"use client";

import React from "react";
import { useFcs } from "../context";
import { Compass, ArrowUpRight, ArrowDownRight, Info, Scale } from "lucide-react";
import Link from "next/link";

export default function CompanyStatusPage() {
  const { kpis, companySettings } = useFcs();

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Calculations exactly according to user formulas
  const cashInBank = kpis.currentBankBalance;
  const expectedCollections = kpis.outstandingCollections;

  const totalExpectedMoney = cashInBank + expectedCollections;

  const supplierOutstanding = kpis.supplierPayables;
  const remainingProjectCost = kpis.cashRequiredToFinish;
  const generalCompanyPayables = Number(companySettings.general_company_payables) || 0;

  const totalCommitments = supplierOutstanding + remainingProjectCost + generalCompanyPayables;

  const companyMoneyPosition = totalExpectedMoney - totalCommitments;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Money Status</h1>
          <p className="text-neutral-400 mt-1">Consolidated view of expected resources versus active commitments and project costs.</p>
        </div>
        <Link
          href="/fcs/settings"
          className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 border border-neutral-700 transition-colors shrink-0"
        >
          Edit Balance Sheets
        </Link>
      </div>

      {/* Main Net Position Summary Card */}
      <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 mt-1 shrink-0">
            <Scale className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">Company Money Position</h3>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-xl">
              This represents your free business position after accounting for current bank cash, customer pending collections, outstanding supplier payables, salary/overhead buffers, and cash required to finish active orders.
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Company Money Position</span>
          <span className={`text-3xl font-bold tracking-tight block ${companyMoneyPosition < 0 ? "text-rose-500 animate-pulse" : "text-emerald-400"}`}>
            {formatINR(companyMoneyPosition)}
          </span>
        </div>
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Resources (Positive Cash Assets) */}
        <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
            <h3 className="font-semibold text-base text-neutral-200 flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-emerald-500" />
              1. Total Expected Money
            </h3>
            <span className="text-xs text-neutral-500 font-semibold">Expected Cash Inflows</span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold text-sm text-neutral-300 block">Money in Bank</span>
                <span className="text-xs text-neutral-500 block">Current pooled balance in all accounts</span>
              </div>
              <span className="font-bold text-neutral-200 text-sm">{formatINR(cashInBank)}</span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold text-sm text-neutral-300 block">Money Customers Still Need to Pay</span>
                <span className="text-xs text-neutral-500 block">Pending collections on active project contracts</span>
              </div>
              <span className="font-bold text-neutral-200 text-sm">{formatINR(expectedCollections)}</span>
            </div>

            <div className="flex justify-between items-center border-t border-neutral-800 pt-4 font-bold text-sm bg-neutral-900/20 -mx-6 px-6 py-3">
              <span className="text-neutral-300">Total Expected Money</span>
              <span className="text-emerald-400">{formatINR(totalExpectedMoney)}</span>
            </div>
          </div>
        </div>

        {/* 2. Commitments (Liabilities & Outflows) */}
        <div className="bg-[#0e0e11] border border-neutral-800 rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
            <h3 className="font-semibold text-base text-neutral-200 flex items-center gap-2">
              <ArrowDownRight className="w-5 h-5 text-rose-500" />
              2. Commitments & Liabilities
            </h3>
            <span className="text-xs text-neutral-500 font-semibold">Expected Outflows</span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold text-sm text-neutral-300 block">Money Needed to Finish Projects</span>
                <span className="text-xs text-neutral-500 block">Estimated production costs to deliver active orders</span>
              </div>
              <span className="font-bold text-neutral-200 text-sm">{formatINR(remainingProjectCost)}</span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold text-sm text-neutral-300 block">Supplier Payments Due</span>
                <span className="text-xs text-neutral-500 block">Outstanding payables on logged supplier bills</span>
              </div>
              <span className="font-bold text-neutral-200 text-sm">{formatINR(supplierOutstanding)}</span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold text-sm text-neutral-300 block">General Company Expenses Due</span>
                <span className="text-xs text-neutral-500 block">Fixed company overhead bills (rent, salary, utility)</span>
              </div>
              <span className="font-bold text-neutral-200 text-sm">{formatINR(generalCompanyPayables)}</span>
            </div>

            <div className="flex justify-between items-center border-t border-neutral-800 pt-4 font-bold text-sm bg-neutral-900/20 -mx-6 px-6 py-3">
              <span className="text-neutral-300">Total Commitments & Outflows</span>
              <span className="text-rose-500">{formatINR(totalCommitments)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Explanation Banner */}
      <div className="bg-[#18181b] border border-neutral-800 rounded-lg p-5 flex gap-4 text-xs">
        <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-neutral-300">How is this calculated?</h4>
          <p className="text-neutral-400 leading-relaxed">
            Your company money position represents the net operating headroom of your business.
          </p>
          <div className="pt-2 font-mono flex items-center flex-wrap gap-2 text-neutral-300">
            <span>Total Expected Money ({formatINR(totalExpectedMoney)})</span>
            <span className="text-neutral-500">-</span>
            <span>Total Commitments ({formatINR(totalCommitments)})</span>
            <span className="text-neutral-500">=</span>
            <span className="font-bold text-emerald-400">{formatINR(companyMoneyPosition)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
