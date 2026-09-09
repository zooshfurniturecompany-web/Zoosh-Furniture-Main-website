import { supabase, isSupabaseConfigured } from "./supabase";

// ==========================================
// INTERFACES & TYPES
// ==========================================

export interface FcsClient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  created_at?: string;
}

export interface FcsProject {
  id: string;
  client_id: string;
  name: string;
  status: 'running' | 'completed';
  // Estimates (Budget)
  est_selling_price: number;
  est_material_cost: number;
  est_labour_cost: number;
  est_hardware_cost: number;
  est_transport_cost: number;
  est_other_costs: number;
  // Actuals
  act_material_cost: number;
  act_labour_cost: number;
  act_hardware_cost: number;
  act_transport_cost: number;
  act_other_costs: number;
  created_at?: string;
  client_name?: string; // Virtual join field
}

export interface FcsBankAccount {
  id: string;
  account_name: string;
  bank_name?: string;
  account_number?: string;
  current_balance: number;
  created_at?: string;
}

export interface FcsFundingSource {
  id: string;
  project_id: string;
  payment_type: 'Advance' | 'Progress Payment' | 'Final Payment' | 'Full Payment';
  payment_method: 'Bank Transfer' | 'Cash';
  bank_account_id: string;
  original_amount: number;
  amount_used: number;
  remaining_amount: number; // original - amount_used
  payment_date: string; // YYYY-MM-DD
  attachment_url?: string;
  notes?: string;
  created_at?: string;
  project_name?: string; // Virtual join field
  client_name?: string;  // Virtual join field
  bank_name?: string;    // Virtual join field
}

export interface FcsSupplier {
  id: string;
  name: string;
  contact_person?: string;
  phone?: string;
  outstanding_balance: number;
  created_at?: string;
}

export interface FcsSupplierBill {
  id: string;
  supplier_id: string;
  bill_number: string;
  amount: number;
  bill_date: string; // YYYY-MM-DD
  due_date?: string; // YYYY-MM-DD
  status: 'unpaid' | 'partially_paid' | 'paid';
  attachment_url?: string;
  project_id?: string; // Optional, links directly to a project
  created_at?: string;
  supplier_name?: string; // Virtual join field
  project_name?: string;  // Virtual join field
}

export interface FcsForecastSchedule {
  id: string;
  type: 'incoming' | 'outgoing';
  category: 'Customer Collection' | 'Supplier Payment' | 'Salary' | 'Rent' | 'Labour Payment' | 'Other';
  description: string;
  amount: number;
  due_date: string; // YYYY-MM-DD
  project_id?: string;
  supplier_id?: string;
}

export interface FcsCompanyMoneyStatusSettings {
  partner_capital: number;
  loan_balance: number;
  labour_outstanding: number;
  general_company_payables: number;
}

export interface FcsExpense {
  id: string;
  expense_date: string; // YYYY-MM-DD
  category: 'Material' | 'Labour' | 'Hardware' | 'Transport' | 'Other Costs' | 'General Overhead' | 'General Company Expenses';
  total_amount: number;
  bank_account_id: string;
  funding_source_id?: string; // Project Fund financing this
  supplier_bill_id?: string;  // If paying a supplier bill
  supplier_id?: string;
  payment_method: 'Bank Transfer' | 'Cash';
  attachment_url?: string;
  notes?: string;
  created_at?: string;
  bank_name?: string;         // Virtual join field
  fund_name?: string;         // Virtual join field
  supplier_name?: string;     // Virtual join field
  bill_number?: string;       // Virtual join field
  allocations?: FcsExpenseAllocation[]; // Virtual nested list
}

export interface FcsExpenseAllocation {
  id: string;
  expense_id: string;
  project_id: string;
  allocated_amount: number;
  allocated_percentage: number;
  created_at?: string;
  project_name?: string; // Virtual join field
}

// ==========================================
// LOCAL STORAGE MOCK DATA SEEDING
// ==========================================

const SEED_CLIENTS: FcsClient[] = [];
const SEED_PROJECTS: FcsProject[] = [];
const SEED_BANKS: FcsBankAccount[] = [
  { id: "b1", account_name: "HDFC Operations Account", bank_name: "HDFC Bank", account_number: "XXXX-XXXX-5678", current_balance: 0 }
];
const SEED_SUPPLIERS: FcsSupplier[] = [];

// Helper to check environment
const isClient = typeof window !== "undefined";

// Cache variables for mock store
let clients: FcsClient[] = [];
let projects: FcsProject[] = [];
let bankAccounts: FcsBankAccount[] = [];
let fundingSources: FcsFundingSource[] = [];
let suppliers: FcsSupplier[] = [];
let supplierBills: FcsSupplierBill[] = [];
let expenses: FcsExpense[] = [];
let expenseAllocations: FcsExpenseAllocation[] = [];
let forecastSchedules: FcsForecastSchedule[] = [];
let companySettings: FcsCompanyMoneyStatusSettings = {
  partner_capital: 0,
  loan_balance: 0,
  labour_outstanding: 0,
  general_company_payables: 0
};

// Initialize Local Mock DB
function initLocalDb() {
  if (!isClient) return;

  // Clear seed databases once on reload to allow blank-slate testing from scratch
  const hasReset = localStorage.getItem("fcs_db_reset_zero_v6");
  if (!hasReset) {
    localStorage.removeItem("fcs_clients");
    localStorage.removeItem("fcs_projects");
    localStorage.removeItem("fcs_bank_accounts");
    localStorage.removeItem("fcs_funding_sources");
    localStorage.removeItem("fcs_suppliers");
    localStorage.removeItem("fcs_supplier_bills");
    localStorage.removeItem("fcs_expenses");
    localStorage.removeItem("fcs_expense_allocations");
    localStorage.removeItem("fcs_forecast_schedules");
    localStorage.removeItem("fcs_company_settings");
    localStorage.setItem("fcs_db_reset_zero_v6", "true");
  }

  const loadOrSeed = <T>(key: string, seed: T[]): T[] => {
    const val = localStorage.getItem(key);
    if (val) return JSON.parse(val);
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  };

  clients = loadOrSeed("fcs_clients", SEED_CLIENTS);
  projects = loadOrSeed("fcs_projects", SEED_PROJECTS);
  bankAccounts = loadOrSeed("fcs_bank_accounts", SEED_BANKS);
  suppliers = loadOrSeed("fcs_suppliers", SEED_SUPPLIERS);
  fundingSources = loadOrSeed("fcs_funding_sources", []);
  supplierBills = loadOrSeed("fcs_supplier_bills", []);
  expenses = loadOrSeed("fcs_expenses", []);
  expenseAllocations = loadOrSeed("fcs_expense_allocations", []);
  forecastSchedules = loadOrSeed("fcs_forecast_schedules", []);

  const savedSettings = localStorage.getItem("fcs_company_settings");
  if (savedSettings) {
    companySettings = JSON.parse(savedSettings);
  } else {
    localStorage.setItem("fcs_company_settings", JSON.stringify(companySettings));
  }
}

// Sync all tables to LocalStorage
function saveLocalDb() {
  if (!isClient) return;
  localStorage.setItem("fcs_clients", JSON.stringify(clients));
  localStorage.setItem("fcs_projects", JSON.stringify(projects));
  localStorage.setItem("fcs_bank_accounts", JSON.stringify(bankAccounts));
  localStorage.setItem("fcs_funding_sources", JSON.stringify(fundingSources));
  localStorage.setItem("fcs_suppliers", JSON.stringify(suppliers));
  localStorage.setItem("fcs_supplier_bills", JSON.stringify(supplierBills));
  localStorage.setItem("fcs_expenses", JSON.stringify(expenses));
  localStorage.setItem("fcs_expense_allocations", JSON.stringify(expenseAllocations));
  localStorage.setItem("fcs_forecast_schedules", JSON.stringify(forecastSchedules));
  localStorage.setItem("fcs_company_settings", JSON.stringify(companySettings));
}

// Initialize on load
if (isClient) {
  initLocalDb();
}

// ==========================================
// REAL-TIME HANDLERS & DATABASE METHODS
// ==========================================

export const fcsDb = {
  isMock: !isSupabaseConfigured,

  // --- CLIENTS ---
  async getClients(): Promise<FcsClient[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from("fcs_clients").select("*").order("name");
      if (!error && data) return data as FcsClient[];
      console.error("Supabase getClients error, using mock:", error);
    }
    return clients;
  },

  async addClient(client: Omit<FcsClient, "id">): Promise<FcsClient> {
    const newClient: FcsClient = {
      ...client,
      id: crypto.randomUUID ? crypto.randomUUID() : `client-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from("fcs_clients").insert([newClient]).select().single();
      if (!error && data) return data as FcsClient;
      console.error("Supabase addClient error, using mock:", error);
    }
    clients.push(newClient);
    saveLocalDb();
    return newClient;
  },

  async updateClient(id: string, updates: Partial<FcsClient>): Promise<FcsClient> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from("fcs_clients").update(updates).eq("id", id).select().single();
      if (!error && data) return data as FcsClient;
      console.error("Supabase updateClient error, using mock:", error);
    }
    const idx = clients.findIndex(c => c.id === id);
    if (idx !== -1) {
      clients[idx] = { ...clients[idx], ...updates };
      saveLocalDb();
      return clients[idx];
    }
    throw new Error("Client not found");
  },

  async deleteClient(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("fcs_clients").delete().eq("id", id);
      if (!error) return;
      console.error("Supabase deleteClient error:", error);
    }
    clients = clients.filter(c => c.id !== id);
    projects = projects.filter(p => p.client_id !== id);
    saveLocalDb();
  },

  // --- PROJECTS ---
  async getProjects(): Promise<FcsProject[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from("fcs_projects").select("*, fcs_clients(name)").order("created_at", { ascending: false });
      if (!error && data) {
        return data.map((d: any) => ({
          ...d,
          client_name: d.fcs_clients?.name
        })) as FcsProject[];
      }
      console.error("Supabase getProjects error, using mock:", error);
    }
    return projects.map(p => ({
      ...p,
      client_name: clients.find(c => c.id === p.client_id)?.name || "Unknown Client"
    }));
  },

  async addProject(project: Omit<FcsProject, "id" | "act_material_cost" | "act_labour_cost" | "act_hardware_cost" | "act_transport_cost" | "act_other_costs">): Promise<FcsProject> {
    const newProject: FcsProject = {
      ...project,
      id: crypto.randomUUID ? crypto.randomUUID() : `proj-${Date.now()}`,
      act_material_cost: 0,
      act_labour_cost: 0,
      act_hardware_cost: 0,
      act_transport_cost: 0,
      act_other_costs: 0,
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from("fcs_projects").insert([newProject]).select().single();
      if (!error && data) return data as FcsProject;
      console.error("Supabase addProject error, using mock:", error);
    }
    projects.push(newProject);
    saveLocalDb();
    return newProject;
  },

  async updateProject(id: string, updates: Partial<FcsProject>): Promise<FcsProject> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from("fcs_projects").update(updates).eq("id", id).select().single();
      if (!error && data) return data as FcsProject;
      console.error("Supabase updateProject error, using mock:", error);
    }
    const idx = projects.findIndex(p => p.id === id);
    if (idx !== -1) {
      projects[idx] = { ...projects[idx], ...updates };
      saveLocalDb();
      return projects[idx];
    }
    throw new Error("Project not found");
  },

  async deleteProject(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("fcs_projects").delete().eq("id", id);
      if (!error) return;
      console.error("Supabase deleteProject error:", error);
    }
    projects = projects.filter(p => p.id !== id);
    fundingSources = fundingSources.filter(f => f.project_id !== id);
    saveLocalDb();
  },

  // --- BANK ACCOUNTS ---
  async getBankAccounts(): Promise<FcsBankAccount[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from("fcs_bank_accounts").select("*").order("account_name");
      if (!error && data) return data as FcsBankAccount[];
      console.error("Supabase getBankAccounts error, using mock:", error);
    }
    return bankAccounts;
  },

  async addBankAccount(account: Omit<FcsBankAccount, "id">): Promise<FcsBankAccount> {
    const newAcc: FcsBankAccount = {
      ...account,
      id: crypto.randomUUID ? crypto.randomUUID() : `bank-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from("fcs_bank_accounts").insert([newAcc]).select().single();
      if (!error && data) return data as FcsBankAccount;
      console.error("Supabase addBankAccount error, using mock:", error);
    }
    bankAccounts.push(newAcc);
    saveLocalDb();
    return newAcc;
  },

  // --- FUNDING SOURCES (Project Funds / Client Payments) ---
  async getFundingSources(): Promise<FcsFundingSource[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("fcs_funding_sources")
        .select("*, fcs_projects(name, fcs_clients(name)), fcs_bank_accounts(account_name)")
        .order("payment_date", { ascending: false });
      
      if (!error && data) {
        return data.map((d: any) => ({
          ...d,
          project_name: d.fcs_projects?.name,
          client_name: d.fcs_projects?.fcs_clients?.name,
          bank_name: d.fcs_bank_accounts?.account_name || "Bank Account"
        })) as FcsFundingSource[];
      }
      console.error("Supabase getFundingSources error, using mock:", error);
    }
    
    return fundingSources.map(f => {
      const proj = projects.find(p => p.id === f.project_id);
      const cl = proj ? clients.find(c => c.id === proj.client_id) : null;
      const bank = bankAccounts.find(b => b.id === f.bank_account_id);
      return {
        ...f,
        project_name: proj?.name || "Unknown Project",
        client_name: cl?.name || "Unknown Client",
        bank_name: bank?.account_name || "Unknown Bank"
      };
    });
  },

  async addFundingSource(source: Omit<FcsFundingSource, "id" | "amount_used" | "remaining_amount">): Promise<FcsFundingSource> {
    const newSource: FcsFundingSource = {
      ...source,
      id: crypto.randomUUID ? crypto.randomUUID() : `fund-${Date.now()}`,
      amount_used: 0,
      remaining_amount: source.original_amount,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      // Create transaction in Supabase
      const { data, error } = await supabase.from("fcs_funding_sources").insert([newSource]).select().single();
      if (!error && data) {
        // Also update Bank Account Balance on Supabase
        await supabase.rpc("fcs_adjust_bank_balance", {
          bank_id: source.bank_account_id,
          amount_delta: source.original_amount
        });
        return data as FcsFundingSource;
      }
      console.error("Supabase addFundingSource error, using mock:", error);
    }

    // Client-side calculations
    fundingSources.push(newSource);
    
    // Update bank balance
    const bankIdx = bankAccounts.findIndex(b => b.id === source.bank_account_id);
    if (bankIdx !== -1) {
      bankAccounts[bankIdx].current_balance += source.original_amount;
    }
    
    saveLocalDb();
    return newSource;
  },

  // --- SUPPLIERS ---
  async getSuppliers(): Promise<FcsSupplier[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from("fcs_suppliers").select("*").order("name");
      if (!error && data) return data as FcsSupplier[];
      console.error("Supabase getSuppliers error, using mock:", error);
    }
    return suppliers;
  },

  async addSupplier(supplier: Omit<FcsSupplier, "id" | "outstanding_balance">): Promise<FcsSupplier> {
    const newSupplier: FcsSupplier = {
      ...supplier,
      id: crypto.randomUUID ? crypto.randomUUID() : `supplier-${Date.now()}`,
      outstanding_balance: 0,
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from("fcs_suppliers").insert([newSupplier]).select().single();
      if (!error && data) return data as FcsSupplier;
      console.error("Supabase addSupplier error, using mock:", error);
    }
    suppliers.push(newSupplier);
    saveLocalDb();
    return newSupplier;
  },

  // --- SUPPLIER BILLS ---
  async getSupplierBills(): Promise<FcsSupplierBill[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("fcs_supplier_bills")
        .select("*, fcs_suppliers(name), fcs_projects(name)")
        .order("bill_date", { ascending: false });
      
      if (!error && data) {
        return data.map((d: any) => ({
          ...d,
          supplier_name: d.fcs_suppliers?.name,
          project_name: d.fcs_projects?.name
        })) as FcsSupplierBill[];
      }
      console.error("Supabase getSupplierBills error, using mock:", error);
    }
    
    return supplierBills.map(b => ({
      ...b,
      supplier_name: suppliers.find(s => s.id === b.supplier_id)?.name || "Unknown Supplier",
      project_name: projects.find(p => p.id === b.project_id)?.name || ""
    }));
  },

  async addSupplierBill(bill: Omit<FcsSupplierBill, "id" | "status">): Promise<FcsSupplierBill> {
    const newBill: FcsSupplierBill = {
      ...bill,
      id: crypto.randomUUID ? crypto.randomUUID() : `bill-${Date.now()}`,
      status: 'unpaid',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from("fcs_supplier_bills").insert([newBill]).select().single();
      if (!error && data) {
        // Increment Supplier Outstanding Balance
        await supabase.rpc("fcs_adjust_supplier_outstanding", {
          supp_id: bill.supplier_id,
          amount_delta: bill.amount
        });

        // If direct project bill, update actual costs
        if (bill.project_id) {
          // Determine actual cost column based on bill category if present
          // For bills, we default to material since timber/plywood/hardware are materials.
          // In production, we'd have category on bill. Let's assume it updates material cost.
          await supabase.rpc("fcs_adjust_project_actual_cost", {
            proj_id: bill.project_id,
            cost_cat: "act_material_cost",
            amount_delta: bill.amount
          });
        }
        return data as FcsSupplierBill;
      }
      console.error("Supabase addSupplierBill error, using mock:", error);
    }

    // Client-side calculations
    supplierBills.push(newBill);

    // Update supplier outstanding balance
    const supIdx = suppliers.findIndex(s => s.id === bill.supplier_id);
    if (supIdx !== -1) {
      suppliers[supIdx].outstanding_balance += bill.amount;
    }

    // Update project cost sheet (accrual basis: materials received on credit count towards actuals)
    if (bill.project_id) {
      const projIdx = projects.findIndex(p => p.id === bill.project_id);
      if (projIdx !== -1) {
        projects[projIdx].act_material_cost += bill.amount;
      }
    }

    saveLocalDb();
    return newBill;
  },

  // --- EXPENSES & ALLOCATIONS ---
  async getExpenses(): Promise<FcsExpense[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("fcs_expenses")
        .select("*, fcs_bank_accounts(account_name), fcs_funding_sources(payment_type, fcs_projects(name)), fcs_suppliers(name), fcs_supplier_bills(bill_number), fcs_expense_allocations(*, fcs_projects(name))")
        .order("expense_date", { ascending: false });
      
      if (!error && data) {
        return data.map((d: any) => ({
          ...d,
          bank_name: d.fcs_bank_accounts?.account_name,
          fund_name: d.fcs_funding_sources ? `${d.fcs_funding_sources.fcs_projects?.name} - ${d.fcs_funding_sources.payment_type}` : undefined,
          supplier_name: d.fcs_suppliers?.name,
          bill_number: d.fcs_supplier_bills?.bill_number,
          allocations: d.fcs_expense_allocations?.map((al: any) => ({
            ...al,
            project_name: al.fcs_projects?.name
          }))
        })) as FcsExpense[];
      }
      console.error("Supabase getExpenses error, using mock:", error);
    }

    return expenses.map(e => {
      const bank = bankAccounts.find(b => b.id === e.bank_account_id);
      const fs = fundingSources.find(f => f.id === e.funding_source_id);
      const projFs = fs ? projects.find(p => p.id === fs.project_id) : null;
      const supp = suppliers.find(s => s.id === e.supplier_id);
      const bill = supplierBills.find(b => b.id === e.supplier_bill_id);
      const allocs = expenseAllocations.filter(al => al.expense_id === e.id).map(al => ({
        ...al,
        project_name: projects.find(p => p.id === al.project_id)?.name || "Unknown Project"
      }));

      return {
        ...e,
        bank_name: bank?.account_name || "Unknown Account",
        fund_name: fs && projFs ? `${projFs.name} - Project Fund` : undefined,
        supplier_name: supp?.name,
        bill_number: bill?.bill_number,
        allocations: allocs
      };
    });
  },

  async addExpense(
    expense: Omit<FcsExpense, "id">,
    allocs: Array<{ project_id: string; amount: number; percentage: number }>
  ): Promise<FcsExpense> {
    const expenseId = crypto.randomUUID ? crypto.randomUUID() : `exp-${Date.now()}`;
    const newExpense: FcsExpense = {
      ...expense,
      id: expenseId,
      created_at: new Date().toISOString()
    };

    const newAllocs: FcsExpenseAllocation[] = allocs.map(a => ({
      id: crypto.randomUUID ? crypto.randomUUID() : `alloc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      expense_id: expenseId,
      project_id: a.project_id,
      allocated_amount: a.amount,
      allocated_percentage: a.percentage,
      created_at: new Date().toISOString()
    }));

    if (isSupabaseConfigured && supabase) {
      // Perform database operations in Supabase (in transactions)
      const { data, error } = await supabase.from("fcs_expenses").insert([newExpense]).select().single();
      if (!error && data) {
        // Insert allocations
        await supabase.from("fcs_expense_allocations").insert(newAllocs);

        // RPC: Adjust Bank Account Balance (Deduct)
        await supabase.rpc("fcs_adjust_bank_balance", {
          bank_id: expense.bank_account_id,
          amount_delta: -expense.total_amount
        });

        // RPC: Adjust Funding Source (Project Fund) Used amount (Add)
        if (expense.funding_source_id) {
          await supabase.rpc("fcs_adjust_fund_used", {
            fund_id: expense.funding_source_id,
            amount_delta: expense.total_amount
          });
        }

        // RPC: Adjust Supplier Outstanding Balance & Bill status
        if (expense.supplier_bill_id) {
          await supabase.rpc("fcs_adjust_bill_payment", {
            bill_id: expense.supplier_bill_id,
            payment_amount: expense.total_amount
          });
        } else if (expense.supplier_id) {
          // Direct supplier payment (not tied to bill)
          await supabase.rpc("fcs_adjust_supplier_outstanding", {
            supp_id: expense.supplier_id,
            amount_delta: -expense.total_amount
          });
        }

        // RPC: Update Project Actual Costs for each allocation (if not paying off a bill that was already costed!)
        // Note: If paying off a bill, and the bill was already tied to a project, it was costed on accrual basis.
        // If not tied to a bill, we add the expense allocation to actual costs on cash basis.
        const isBillPayment = !!expense.supplier_bill_id;
        const linkedBill = isBillPayment ? supplierBills.find(b => b.id === expense.supplier_bill_id) : null;
        const isBillAlreadyCosted = linkedBill && !!linkedBill.project_id;

        if (!isBillAlreadyCosted) {
          const costCol = this.getCostCategoryField(expense.category);
          if (costCol) {
            for (const a of allocs) {
              await supabase.rpc("fcs_adjust_project_actual_cost", {
                proj_id: a.project_id,
                cost_cat: costCol,
                amount_delta: a.amount
              });
            }
          }
        }

        return data as FcsExpense;
      }
      console.error("Supabase addExpense error, using mock:", error);
    }

    // --- CLIENT-SIDE LOCALSTORAGE MOCK EXECUTION ---
    expenses.unshift(newExpense);
    expenseAllocations.push(...newAllocs);

    // 1. Update bank balance
    const bankIdx = bankAccounts.findIndex(b => b.id === expense.bank_account_id);
    if (bankIdx !== -1) {
      bankAccounts[bankIdx].current_balance -= expense.total_amount;
    }

    // 2. Update project fund (funding source) remaining balance
    if (expense.funding_source_id) {
      const fundIdx = fundingSources.findIndex(f => f.id === expense.funding_source_id);
      if (fundIdx !== -1) {
        fundingSources[fundIdx].amount_used += expense.total_amount;
        // remaining_amount is auto calculated in SQL but we must update it locally
        fundingSources[fundIdx].remaining_amount = fundingSources[fundIdx].original_amount - fundingSources[fundIdx].amount_used;
      }
    }

    // 3. Update supplier balance & bill status
    if (expense.supplier_bill_id) {
      const billIdx = supplierBills.findIndex(b => b.id === expense.supplier_bill_id);
      if (billIdx !== -1) {
        const bill = supplierBills[billIdx];
        const remainingBillAmount = bill.amount - expense.total_amount;
        
        if (remainingBillAmount <= 0) {
          bill.status = 'paid';
        } else {
          bill.status = 'partially_paid';
        }

        // Deduct from supplier outstanding
        const supIdx = suppliers.findIndex(s => s.id === bill.supplier_id);
        if (supIdx !== -1) {
          suppliers[supIdx].outstanding_balance -= expense.total_amount;
        }
      }
    } else if (expense.supplier_id) {
      // Direct supplier ledger adjust
      const supIdx = suppliers.findIndex(s => s.id === expense.supplier_id);
      if (supIdx !== -1) {
        suppliers[supIdx].outstanding_balance -= expense.total_amount;
      }
    }

    // 4. Update project cost sheets (Actual costs)
    // Only update project costs if this is NOT a payment for a bill that was already associated with a project (accrued)
    const linkedBillLocal = expense.supplier_bill_id ? supplierBills.find(b => b.id === expense.supplier_bill_id) : null;
    const isBillAlreadyCostedLocal = linkedBillLocal && !!linkedBillLocal.project_id;

    if (!isBillAlreadyCostedLocal) {
      const costCol = this.getCostCategoryField(expense.category);
      if (costCol) {
        allocs.forEach(a => {
          const projIdx = projects.findIndex(p => p.id === a.project_id);
          if (projIdx !== -1) {
            projects[projIdx][costCol] += a.amount;
          }
        });
      }
    }

    saveLocalDb();
    return newExpense;
  },

  // Helper mapping categories to schema fields
  getCostCategoryField(category: string): 'act_material_cost' | 'act_labour_cost' | 'act_hardware_cost' | 'act_transport_cost' | 'act_other_costs' | null {
    switch (category) {
      case 'Material': return 'act_material_cost';
      case 'Labour': return 'act_labour_cost';
      case 'Hardware': return 'act_hardware_cost';
      case 'Transport': return 'act_transport_cost';
      case 'Other Costs': return 'act_other_costs';
      default: return null; // 'General Overhead' does not hit project-specific cost columns directly
    }
  },

  // --- FIFO PROJECT FUND RECOMMENDATION ---
  async recommendFundingSource(totalAmount: number, projectId?: string): Promise<FcsFundingSource | null> {
    // 1. Get all available funds with positive remaining balance
    const funds = await this.getFundingSources();
    const availableFunds = funds.filter(f => f.remaining_amount > 0);

    if (availableFunds.length === 0) return null;

    // 2. FIFO order: oldest payment_date first
    const sortedFunds = [...availableFunds].sort((a, b) => {
      const dateA = new Date(a.payment_date).getTime();
      const dateB = new Date(b.payment_date).getTime();
      if (dateA !== dateB) return dateA - dateB;
      // If dates match, prioritize project specific fund if a project is provided
      if (projectId) {
        if (a.project_id === projectId && b.project_id !== projectId) return -1;
        if (b.project_id === projectId && a.project_id !== projectId) return 1;
      }
      return 0;
    });

    // 3. Recommendation logic:
    // If a project is specified, try to find a fund for this project first (oldest)
    if (projectId) {
      const projectFund = sortedFunds.find(f => f.project_id === projectId);
      if (projectFund) return projectFund;
    }

    // 4. Otherwise, recommend the oldest available fund overall
    return sortedFunds[0];
  },

  // --- COMPANY MONEY STATUS SETTINGS ---
  async getCompanySettings(): Promise<FcsCompanyMoneyStatusSettings> {
    // In a real Supabase setup, you would query a config table.
    // For local fallback, we return companySettings.
    return companySettings;
  },

  async updateCompanySettings(updates: Partial<FcsCompanyMoneyStatusSettings>): Promise<FcsCompanyMoneyStatusSettings> {
    companySettings = { ...companySettings, ...updates };
    saveLocalDb();
    return companySettings;
  },

  // --- FORECAST SCHEDULES ("Future Money") ---
  async getForecastSchedules(): Promise<FcsForecastSchedule[]> {
    return forecastSchedules.sort((a, b) => a.due_date.localeCompare(b.due_date));
  },

  async addForecastSchedule(schedule: Omit<FcsForecastSchedule, "id">): Promise<FcsForecastSchedule> {
    const newItem: FcsForecastSchedule = {
      ...schedule,
      id: crypto.randomUUID ? crypto.randomUUID() : `fs-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    };
    forecastSchedules.push(newItem);
    saveLocalDb();
    return newItem;
  },

  async deleteForecastSchedule(id: string): Promise<void> {
    forecastSchedules = forecastSchedules.filter(f => f.id !== id);
    saveLocalDb();
  }
};
