export type ExpenseCategory =
  | "fuel"
  | "food"
  | "travel"
  | "shopping"
  | "entertainment"
  | "bills"
  | "other";

export interface Expense {
  id: string;
  date: string; // ISO date (yyyy-mm-dd)
  amount: number;
  category: ExpenseCategory;
  description?: string;
}

export interface WeeklyTotal {
  weekLabel: string;
  total: number;
}

export interface CategoryTotal {
  category: ExpenseCategory;
  total: number;
}

