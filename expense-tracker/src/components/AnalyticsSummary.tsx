import type { Expense } from "../types";
import {
  getThisWeekTotal,
  getThisMonthTotal,
  getThisMonthCategoryTotals
} from "../utils/analytics";

interface AnalyticsSummaryProps {
  expenses: Expense[];
}

export function AnalyticsSummary({ expenses }: AnalyticsSummaryProps) {
  const thisWeek = getThisWeekTotal(expenses);
  const thisMonth = getThisMonthTotal(expenses);
  const categoryTotals = getThisMonthCategoryTotals(expenses);

  const topCategory = categoryTotals.reduce<
    (typeof categoryTotals)[number] | null
  >((best, current) => {
    if (!best || current.total > best.total) return current;
    return best;
  }, null);

  return (
    <div className="card summary-card">
      <h2>This Period</h2>
      <div className="summary-grid">
        <div className="summary-item">
          <span className="label">This week</span>
          <span className="value">
            {thisWeek.toLocaleString(undefined, {
              style: "currency",
              currency: "USD"
            })}
          </span>
        </div>
        <div className="summary-item">
          <span className="label">This month</span>
          <span className="value">
            {thisMonth.toLocaleString(undefined, {
              style: "currency",
              currency: "USD"
            })}
          </span>
        </div>
        <div className="summary-item">
          <span className="label">Top category (this month)</span>
          <span className="value cap">
            {topCategory
              ? `${topCategory.category} – ${topCategory.total.toLocaleString(
                  undefined,
                  {
                    style: "currency",
                    currency: "USD"
                  }
                )}`
              : "-"}
          </span>
        </div>
      </div>
    </div>
  );
}

