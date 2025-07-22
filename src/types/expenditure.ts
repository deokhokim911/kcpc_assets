export interface ExpenditureRecord {
  poNumber: string;
  date: string;
  description: string;
  amount: number;
  department: string;
  requester: string;
  sheet: string;
  notes: string;
}

export interface DepartmentSummary {
  department: string;
  totalAmount: number;
  count: number;
  averageAmount: number;
}

export interface YearlySummary {
  year: number;
  totalAmount: number;
  count: number;
  averageAmount: number;
}

export interface CategorySummary {
  category: string;
  totalAmount: number;
  count: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  year: number;
  totalAmount: number;
  count: number;
} 