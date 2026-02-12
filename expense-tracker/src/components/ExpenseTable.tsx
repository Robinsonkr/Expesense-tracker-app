import React, { useMemo, useState } from "react";
import type { Expense, ExpenseCategory } from "../types";

type DateFilter = "all" | "this_week" | "this_month";

interface ExpenseTableProps {
  expenses: Expense[];
  onDelete(id: string): void;
}

export function ExpenseTable({ expenses, onDelete }: ExpenseTableProps) {
  const [dateFilter, setDateFilter] = useState<DateFilter>("this_month");
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | "all">("all");

  const today = new Date();
  const filtered = useMemo(
    () =>
      expenses
        .filter((e) => applyDateFilter(e.date, dateFilter, today))
        .filter((e) => (categoryFilter === "all" ? true : e.category === categoryFilter))
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [expenses, dateFilter, categoryFilter, today]
  );

  return (
    <div className="card">
      <div className="table-header">
        <h2>Expenses</h2>
        <div className="filters">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilter)}
          >
            <option value="this_week">This week</option>
            <option value="this_month">This month</option>
            <option value="all">All</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value as ExpenseCategory | "all")
            }
          >
            <option value="all">All categories</option>
            <option value="fuel">Fuel</option>
            <option value="food">Food</option>
            <option value="travel">Travel</option>
            <option value="shopping">Shopping</option>
            <option value="entertainment">Entertainment</option>
            <option value="bills">Bills</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th className="amount-col">Amount</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty">
                  No expenses yet.
                </td>
              </tr>
            ) : (
              filtered.map((e) => (
                <tr key={e.id}>
                  <td>{new Date(e.date).toLocaleDateString()}</td>
                  <td className="cap">{e.category}</td>
                  <td>{e.description ?? "-"}</td>
                  <td className="amount-col">
                    {e.amount.toLocaleString(undefined, {
                      style: "currency",
                      currency: "USD"
                    })}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="ghost-btn"
                      onClick={() => onDelete(e.id)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function applyDateFilter(dateStr: string, filter: DateFilter, today: Date): boolean {
  if (filter === "all") return true;
  const d = new Date(dateStr);
  if (filter === "this_month") {
    return (
      d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
    );
  }
  // this_week
  const DAY_MS = 24 * 60 * 60 * 1000;
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek.getTime() + 7 * DAY_MS);
  return d >= startOfWeek && d < endOfWeek;
}

