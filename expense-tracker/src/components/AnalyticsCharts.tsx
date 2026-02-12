import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import type { Expense } from "../types";
import { getLastFourWeeksTotals, getThisMonthCategoryTotals } from "../utils/analytics";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

interface AnalyticsChartsProps {
  expenses: Expense[];
}

export function AnalyticsCharts({ expenses }: AnalyticsChartsProps) {
  const weekly = getLastFourWeeksTotals(expenses);
  const categoryTotals = getThisMonthCategoryTotals(expenses);

  const weeklyData = {
    labels: weekly.map((w) => w.weekLabel),
    datasets: [
      {
        label: "Total per week",
        data: weekly.map((w) => w.total),
        backgroundColor: "rgba(59, 130, 246, 0.6)"
      }
    ]
  };

  const categoryData = {
    labels: categoryTotals.map((c) => c.category),
    datasets: [
      {
        label: "This month by category",
        data: categoryTotals.map((c) => c.total),
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(234, 179, 8, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(168, 85, 247, 0.7)",
          "rgba(249, 115, 22, 0.7)",
          "rgba(107, 114, 128, 0.7)"
        ]
      }
    ]
  };

  return (
    <div className="charts-grid">
      <div className="card chart-card">
        <h2>Last 4 Weeks</h2>
        <Bar data={weeklyData} />
      </div>
      <div className="card chart-card">
        <h2>This Month by Category</h2>
        {categoryTotals.length === 0 ? (
          <p className="empty">Add expenses this month to see category breakdown.</p>
        ) : (
          <Pie data={categoryData} />
        )}
      </div>
    </div>
  );
}

