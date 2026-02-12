import { useState } from "react";
import type { ExpenseCategory, Expense } from "../types";

const categories: { value: ExpenseCategory; label: string }[] = [
  { value: "fuel", label: "Fuel" },
  { value: "food", label: "Food" },
  { value: "travel", label: "Travel" },
  { value: "shopping", label: "Shopping" },
  { value: "entertainment", label: "Entertainment" },
  { value: "bills", label: "Bills" },
  { value: "other", label: "Other" }
];

interface ExpenseFormProps {
  onAdd(expense: Expense): void;
}

export function ExpenseForm({ onAdd }: ExpenseFormProps) {
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<ExpenseCategory>("food");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Number.parseFloat(amount);
    if (!date || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid date and a positive amount.");
      return;
    }
    setError(null);
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      date,
      amount: parsedAmount,
      category,
      description: description.trim() || undefined
    };
    onAdd(newExpense);
    setAmount("");
    setDescription("");
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <h2>Add Expense</h2>
      {error && <p className="error">{error}</p>}
      <div className="form-row">
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <label>
          Amount
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </label>
        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="full-width">
        Description
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional note"
        />
      </label>
      <button type="submit" className="primary-btn">
        Add Expense
      </button>
    </form>
  );
}

