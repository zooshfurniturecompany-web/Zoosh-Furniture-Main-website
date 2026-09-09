"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  fcsDb, 
  FcsClient, 
  FcsProject, 
  FcsBankAccount, 
  FcsFundingSource, 
  FcsSupplier, 
  FcsSupplierBill, 
  FcsExpense,
  FcsForecastSchedule,
  FcsCompanyMoneyStatusSettings
} from "@/lib/fcs_db";

interface FcsContextType {
  clients: FcsClient[];
  projects: FcsProject[];
  bankAccounts: FcsBankAccount[];
  funds: FcsFundingSource[];
  suppliers: FcsSupplier[];
  bills: FcsSupplierBill[];
  expenses: FcsExpense[];
  forecastSchedules: FcsForecastSchedule[];
  companySettings: FcsCompanyMoneyStatusSettings;
  loading: boolean;
  isMock: boolean;
  kpis: {
    currentBankBalance: number;
    actuallyAvailableCash: number;
    committedCash: number;
    runningProjects: number;
    completedProjects: number;
    outstandingCollections: number;
    supplierPayables: number;
    estimatedProfit: number;
    actualProfit: number;
    cashRequiredToFinish: number;
    totalFundingRemaining: number;
    totalFundingUsed: number;
    monthlyRevenue: number;
    monthlyExpenses: number;
    companyHealthScore: { status: string; color: "green" | "yellow" | "red" };
    forecast7Days: { inflow: number; outflow: number; expectedBalance: number; shortage: number; surplus: number };
    forecast30Days: { inflow: number; outflow: number; expectedBalance: number; shortage: number; surplus: number };
    forecast90Days: { inflow: number; outflow: number; expectedBalance: number; shortage: number; surplus: number };
  };
  refreshData: () => Promise<void>;
  recordPayment: (payment: Omit<FcsFundingSource, "id" | "amount_used" | "remaining_amount">) => Promise<FcsFundingSource>;
  recordExpense: (expense: Omit<FcsExpense, "id">, allocs: Array<{ project_id: string; amount: number; percentage: number }>) => Promise<FcsExpense>;
  recordBill: (bill: Omit<FcsSupplierBill, "id" | "status">) => Promise<FcsSupplierBill>;
  addClient: (client: Omit<FcsClient, "id">) => Promise<FcsClient>;
  addProject: (project: Omit<FcsProject, "id" | "act_material_cost" | "act_labour_cost" | "act_hardware_cost" | "act_transport_cost" | "act_other_costs">) => Promise<FcsProject>;
  addBankAccount: (bank: Omit<FcsBankAccount, "id">) => Promise<FcsBankAccount>;
  addSupplier: (supplier: Omit<FcsSupplier, "id" | "outstanding_balance">) => Promise<FcsSupplier>;
  updateProject: (id: string, updates: Partial<FcsProject>) => Promise<FcsProject>;
  updateCompanySettings: (updates: Partial<FcsCompanyMoneyStatusSettings>) => Promise<FcsCompanyMoneyStatusSettings>;
  addForecastSchedule: (schedule: Omit<FcsForecastSchedule, "id">) => Promise<FcsForecastSchedule>;
  deleteForecastSchedule: (id: string) => Promise<void>;
  evaluateProjectHealth: (p: FcsProject) => { status: "Healthy" | "Watch" | "Critical"; color: "green" | "yellow" | "red" };
}

const FcsContext = createContext<FcsContextType | undefined>(undefined);

export function FcsProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<FcsClient[]>([]);
  const [projects, setProjects] = useState<FcsProject[]>([]);
  const [bankAccounts, setBankAccounts] = useState<FcsBankAccount[]>([]);
  const [funds, setFunds] = useState<FcsFundingSource[]>([]);
  const [suppliers, setSuppliers] = useState<FcsSupplier[]>([]);
  const [bills, setBills] = useState<FcsSupplierBill[]>([]);
  const [expenses, setExpenses] = useState<FcsExpense[]>([]);
  const [forecastSchedules, setForecastSchedules] = useState<FcsForecastSchedule[]>([]);
  const [companySettings, setCompanySettings] = useState<FcsCompanyMoneyStatusSettings>({
    partner_capital: 0,
    loan_balance: 0,
    labour_outstanding: 0,
    general_company_payables: 0
  });
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [cData, pData, bData, fData, sData, billData, expData, settingsData, forecastData] = await Promise.all([
        fcsDb.getClients(),
        fcsDb.getProjects(),
        fcsDb.getBankAccounts(),
        fcsDb.getFundingSources(),
        fcsDb.getSuppliers(),
        fcsDb.getSupplierBills(),
        fcsDb.getExpenses(),
        fcsDb.getCompanySettings(),
        fcsDb.getForecastSchedules()
      ]);

      setClients(cData);
      setProjects(pData);
      setBankAccounts(bData);
      setFunds(fData);
      setSuppliers(sData);
      setBills(billData);
      setExpenses(expData);
      setCompanySettings(settingsData);
      setForecastSchedules(forecastData);
    } catch (err) {
      console.error("Error fetching FCS data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // --- CALCULATION OF CENTRAL KPIs ---
  
  // 1. Money in Bank (pooled balance across all accounts)
  const currentBankBalance = bankAccounts.reduce((sum, b) => sum + Number(b.current_balance), 0);

  // 2. Project Fund Remaining (total remaining client funds)
  const totalFundingRemaining = funds.reduce((sum, f) => sum + Number(f.remaining_amount), 0);
  const totalFundingUsed = funds.reduce((sum, f) => sum + Number(f.amount_used), 0);

  // 3. Money Reserved for Projects (Sum of all project funds remaining balances)
  const committedCash = totalFundingRemaining;

  // 4. Money We Need to Pay Suppliers (Supplier Payments Due)
  // Calculate as Supplier Bills - Payments made against those bills
  const supplierPayables = bills.reduce((sum, b) => {
    const paymentsForBill = expenses
      .filter(e => e.supplier_bill_id === b.id)
      .reduce((s, e) => s + Number(e.total_amount), 0);
    return sum + Math.max(0, Number(b.amount) - paymentsForBill);
  }, 0);

  // 5. Money Needed to Finish All Projects (Remaining Cost to Complete)
  // Calculate: Planned Cost - Current Project Expenses
  const cashRequiredToFinish = projects
    .filter(p => p.status === "running")
    .reduce((sum, p) => {
      const estCost = Number(p.est_material_cost) + Number(p.est_labour_cost) + Number(p.est_hardware_cost) + Number(p.est_transport_cost) + Number(p.est_other_costs);
      const actCost = Number(p.act_material_cost) + Number(p.act_labour_cost) + Number(p.act_hardware_cost) + Number(p.act_transport_cost) + Number(p.act_other_costs);
      return sum + Math.max(0, estCost - actCost);
    }, 0);

  // 6. Money Safe to Spend = Money in Bank - Money Needed to Finish Projects - Supplier Payments Due - Labour Payments Due - Upcoming Company Expenses
  const actuallyAvailableCash = currentBankBalance - cashRequiredToFinish - supplierPayables - Number(companySettings.labour_outstanding) - Number(companySettings.general_company_payables);

  // 7. Running / Completed Projects counts
  const runningProjects = projects.filter(p => p.status === "running").length;
  const completedProjects = projects.filter(p => p.status === "completed").length;

  // 8. Money Customers Still Need to Pay (Customer Pending Payments)
  // Calculate: Project Value - Money Received for every project
  const outstandingCollections = projects.reduce((sum, p) => {
    const paymentsForProj = funds.filter(f => f.project_id === p.id).reduce((s, f) => s + Number(f.original_amount), 0);
    const remainingCollection = Math.max(0, Number(p.est_selling_price) - paymentsForProj);
    return sum + remainingCollection;
  }, 0);

  // 9. Profits (Expected vs Current)
  // Expected Earnings = Estimated Selling Price - Estimated Total Cost
  const estimatedProfit = projects.reduce((sum, p) => {
    const estCost = Number(p.est_material_cost) + Number(p.est_labour_cost) + Number(p.est_hardware_cost) + Number(p.est_transport_cost) + Number(p.est_other_costs);
    return sum + (Number(p.est_selling_price) - estCost);
  }, 0);

  // Current Earnings = Selling Price - Actual Expenses for completed projects only
  const actualProfit = projects
    .filter(p => p.status === "completed")
    .reduce((sum, p) => {
      const actCost = Number(p.act_material_cost) + Number(p.act_labour_cost) + Number(p.act_hardware_cost) + Number(p.act_transport_cost) + Number(p.act_other_costs);
      return sum + (Number(p.est_selling_price) - actCost);
    }, 0);

  // 10. Month activity
  const currentMonthStr = new Date().toISOString().substring(0, 7);
  const monthlyRevenue = funds
    .filter(f => f.payment_date.substring(0, 7) === currentMonthStr)
    .reduce((sum, f) => sum + Number(f.original_amount), 0);

  const monthlyExpenses = expenses
    .filter(e => e.expense_date.substring(0, 7) === currentMonthStr)
    .reduce((sum, e) => sum + Number(e.total_amount), 0);

  // --- HEALTH EVALUATIONS ---

  const evaluateProjectHealth = (p: FcsProject) => {
    const estCost = Number(p.est_material_cost) + Number(p.est_labour_cost) + Number(p.est_hardware_cost) + Number(p.est_transport_cost) + Number(p.est_other_costs);
    const actCost = Number(p.act_material_cost) + Number(p.act_labour_cost) + Number(p.act_hardware_cost) + Number(p.act_transport_cost) + Number(p.act_other_costs);
    const fundingReceived = funds.filter(f => f.project_id === p.id).reduce((sum, f) => sum + Number(f.original_amount), 0);
    const isCompleted = p.status === "completed";
    
    if (isCompleted) return { status: "Healthy" as const, color: "green" as const };

    const budgetVarianceRatio = estCost > 0 ? (actCost - estCost) / estCost : 0;
    const profit = Number(p.est_selling_price) - actCost;
    
    if (profit < 0 || budgetVarianceRatio > 0.10) {
      return { status: "Critical" as const, color: "red" as const };
    }
    if (budgetVarianceRatio > 0 || actCost > fundingReceived) {
      return { status: "Watch" as const, color: "yellow" as const };
    }
    return { status: "Healthy" as const, color: "green" as const };
  };

  const getCompanyHealthScore = () => {
    if (projects.length === 0 && currentBankBalance === 0) {
      return { status: "Good" as const, color: "green" as const };
    }

    const criticalProjects = projects.filter(p => evaluateProjectHealth(p).status === "Critical").length;
    const watchProjects = projects.filter(p => evaluateProjectHealth(p).status === "Watch").length;
    
    // Budget Difference: sum of (planned - actual) for running projects
    const totalBudgetDifference = projects
      .filter(p => p.status === "running")
      .reduce((sum, p) => {
        const est = Number(p.est_material_cost) + Number(p.est_labour_cost) + Number(p.est_hardware_cost) + Number(p.est_transport_cost) + Number(p.est_other_costs);
        const act = Number(p.act_material_cost) + Number(p.act_labour_cost) + Number(p.act_hardware_cost) + Number(p.act_transport_cost) + Number(p.act_other_costs);
        return sum + (est - act);
      }, 0);

    const isShortage = actuallyAvailableCash < 0;
    const futureDeficit = (currentBankBalance + outstandingCollections - supplierPayables - cashRequiredToFinish) < 0;

    // Critical conditions
    if (criticalProjects > 0 || futureDeficit || actuallyAvailableCash < -50000 || totalBudgetDifference < -50000) {
      return { status: "Critical" as const, color: "red" as const };
    }

    // Watch conditions
    if (watchProjects > 0 || isShortage || totalBudgetDifference < 0) {
      return { status: "Watch" as const, color: "yellow" as const };
    }

    // Excellent conditions
    if (actuallyAvailableCash > 100000 && totalBudgetDifference >= 0) {
      return { status: "Excellent" as const, color: "green" as const };
    }

    return { status: "Good" as const, color: "green" as const };
  };

  // --- DATE-DRIVEN CASH FORECASTING ("Future Money") ---

  const getForecastForPeriod = (days: number) => {
    const today = new Date();
    const targetDate = new Date();
    targetDate.setDate(today.getDate() + days);
    
    const formatDate = (d: Date) => d.toISOString().substring(0, 10);
    const todayStr = formatDate(today);
    const targetStr = formatDate(targetDate);

    // 1. Expected incoming from schedules
    const expectedIncoming = forecastSchedules
      .filter(f => f.type === "incoming" && f.due_date >= todayStr && f.due_date <= targetStr)
      .reduce((sum, f) => sum + Number(f.amount), 0);

    // 2. Expected outgoing from schedules
    const expectedOutgoingSchedules = forecastSchedules
      .filter(f => f.type === "outgoing" && f.due_date >= todayStr && f.due_date <= targetStr)
      .reduce((sum, f) => sum + Number(f.amount), 0);

    // 3. Supplier bills due in this range (unpaid/partially paid)
    const expectedOutgoingBills = bills
      .filter(b => b.status !== "paid" && b.due_date && b.due_date >= todayStr && b.due_date <= targetStr)
      .reduce((sum, b) => sum + Number(b.amount), 0);

    const totalInflow = expectedIncoming;
    const totalOutflow = expectedOutgoingSchedules + expectedOutgoingBills;
    const expectedBalance = currentBankBalance + totalInflow - totalOutflow;
    const shortage = expectedBalance < 0 ? Math.abs(expectedBalance) : 0;
    const surplus = expectedBalance > 0 ? expectedBalance : 0;

    return {
      inflow: totalInflow,
      outflow: totalOutflow,
      expectedBalance,
      shortage,
      surplus
    };
  };

  const forecast7Days = getForecastForPeriod(7);
  const forecast30Days = getForecastForPeriod(30);
  const forecast90Days = getForecastForPeriod(90);

  const kpis = {
    currentBankBalance,
    actuallyAvailableCash,
    committedCash,
    runningProjects,
    completedProjects,
    outstandingCollections,
    supplierPayables,
    estimatedProfit,
    actualProfit,
    cashRequiredToFinish,
    totalFundingRemaining,
    totalFundingUsed,
    monthlyRevenue,
    monthlyExpenses,
    companyHealthScore: getCompanyHealthScore(),
    forecast7Days,
    forecast30Days,
    forecast90Days
  };

  // --- TRANSACTION WRAPPERS ---

  const recordPayment = async (payment: Omit<FcsFundingSource, "id" | "amount_used" | "remaining_amount">) => {
    const res = await fcsDb.addFundingSource(payment);
    await refreshData();
    return res;
  };

  const recordExpense = async (expense: Omit<FcsExpense, "id">, allocs: Array<{ project_id: string; amount: number; percentage: number }>) => {
    const res = await fcsDb.addExpense(expense, allocs);
    await refreshData();
    return res;
  };

  const recordBill = async (bill: Omit<FcsSupplierBill, "id" | "status">) => {
    const res = await fcsDb.addSupplierBill(bill);
    await refreshData();
    return res;
  };

  const addClient = async (client: Omit<FcsClient, "id">) => {
    const res = await fcsDb.addClient(client);
    await refreshData();
    return res;
  };

  const addProject = async (project: Omit<FcsProject, "id" | "act_material_cost" | "act_labour_cost" | "act_hardware_cost" | "act_transport_cost" | "act_other_costs">) => {
    const res = await fcsDb.addProject(project);
    await refreshData();
    return res;
  };

  const addBankAccount = async (bank: Omit<FcsBankAccount, "id">) => {
    const res = await fcsDb.addBankAccount(bank);
    await refreshData();
    return res;
  };

  const addSupplier = async (supplier: Omit<FcsSupplier, "id" | "outstanding_balance">) => {
    const res = await fcsDb.addSupplier(supplier);
    await refreshData();
    return res;
  };

  const updateProject = async (id: string, updates: Partial<FcsProject>) => {
    const res = await fcsDb.updateProject(id, updates);
    await refreshData();
    return res;
  };

  const updateCompanySettings = async (updates: Partial<FcsCompanyMoneyStatusSettings>) => {
    const res = await fcsDb.updateCompanySettings(updates);
    await refreshData();
    return res;
  };

  const addForecastSchedule = async (schedule: Omit<FcsForecastSchedule, "id">) => {
    const res = await fcsDb.addForecastSchedule(schedule);
    await refreshData();
    return res;
  };

  const deleteForecastSchedule = async (id: string) => {
    await fcsDb.deleteForecastSchedule(id);
    await refreshData();
  };

  return (
    <FcsContext.Provider
      value={{
        clients,
        projects,
        bankAccounts,
        funds,
        suppliers,
        bills,
        expenses,
        forecastSchedules,
        companySettings,
        loading,
        isMock: fcsDb.isMock,
        kpis,
        refreshData,
        recordPayment,
        recordExpense,
        recordBill,
        addClient,
        addProject,
        addBankAccount,
        addSupplier,
        updateProject,
        updateCompanySettings,
        addForecastSchedule,
        deleteForecastSchedule,
        evaluateProjectHealth
      }}
    >
      {children}
    </FcsContext.Provider>
  );
}

export function useFcs() {
  const context = useContext(FcsContext);
  if (context === undefined) {
    throw new Error("useFcs must be used within an FcsProvider");
  }
  return context;
}
