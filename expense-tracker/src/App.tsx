import { useEffect, useState } from "react";
import type { Expense } from "./types";
import { loadExpenses, saveExpenses } from "./storage/expenseStorage";
import { ExpenseForm } from "./components/ExpenseForm";
import { ExpenseTable } from "./components/ExpenseTable";
import { AnalyticsSummary } from "./components/AnalyticsSummary";
import { AnalyticsCharts } from "./components/AnalyticsCharts";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState<Expense[]>(() => loadExpenses());

  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  const handleAdd = (expense: Expense) => {
    setExpenses((prev) => [...prev, expense]);
  };

  const handleDelete = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Expense Tracker</h1>
        <p>Track your daily spending by category with weekly and monthly insights.</p>
      </header>
      <main className="app-main">
        <section className="top-section">
          <ExpenseForm onAdd={handleAdd} />
          <AnalyticsSummary expenses={expenses} />
        </section>
        <section className="middle-section">
          <ExpenseTable expenses={expenses} onDelete={handleDelete} />
        </section>
        <section className="bottom-section">
          <AnalyticsCharts expenses={expenses} />
        </section>
      </main>
      <footer className="app-footer">
        <span>Data is stored locally in your browser only.</span>
      </footer>
    </div>
  );
}

export default App;

