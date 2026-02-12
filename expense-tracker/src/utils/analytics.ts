import type { Expense, CategoryTotal, WeeklyTotal } from "../types";

function isSameWeek(date: Date, reference: Date): boolean {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const startOfRefWeek = new Date(reference);
  startOfRefWeek.setDate(reference.getDate() - reference.getDay());
  startOfRefWeek.setHours(0, 0, 0, 0);

  const endOfRefWeek = new Date(startOfRefWeek.getTime() + 7 * DAY_MS);

  return date >= startOfRefWeek && date < endOfRefWeek;
}

export function getThisWeekTotal(expenses: Expense[], today = new Date()): number {
  return expenses.reduce((sum, e) => {
    const d = new Date(e.date);
    return isSameWeek(d, today) ? sum + e.amount : sum;
  }, 0);
}

export function getThisMonthTotal(expenses: Expense[], today = new Date()): number {
  const month = today.getMonth();
  const year = today.getFullYear();
  return expenses.reduce((sum, e) => {
    const d = new Date(e.date);
    return d.getMonth() === month && d.getFullYear() === year ? sum + e.amount : sum;
  }, 0);
}

export function getThisMonthCategoryTotals(
  expenses: Expense[],
  today = new Date()
): CategoryTotal[] {
  const month = today.getMonth();
  const year = today.getFullYear();
  const map = new Map<string, number>();

  expenses.forEach((e) => {
    const d = new Date(e.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
    }
  });

  return Array.from(map.entries()).map(([category, total]) => ({
    category: category as CategoryTotal["category"],
    total
  }));
}

export function getLastFourWeeksTotals(
  expenses: Expense[],
  today = new Date()
): WeeklyTotal[] {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const weeks: WeeklyTotal[] = [];

  for (let i = 3; i >= 0; i -= 1) {
    const refDate = new Date(today.getTime() - i * 7 * DAY_MS);
    const label = `W${getWeekNumber(refDate)} ${refDate.getFullYear()}`;
    const total = expenses.reduce((sum, e) => {
      const d = new Date(e.date);
      return isSameWeek(d, refDate) ? sum + e.amount : sum;
    }, 0);
    weeks.push({ weekLabel: label, total });
  }

  return weeks;
}

function getWeekNumber(date: Date): number {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  return Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

