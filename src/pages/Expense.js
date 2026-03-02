import React from "react";
import "../styles/Expense.css";
import { post } from "../api";

const expenseCategories = [
  "Housing",
  "Food",
  "Transportation",
  "Bills",
  "Healthcare",
  "Personal Care",
  "Entertainment",
  "Shopping",
  "Other",
];

export default function Expense() {
  const [form, setForm] = React.useState({
    date: "",
    category: "",
    description: "",
    amount: "",
  });

  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = { ...form, amount: Number(form.amount) };
      await post("/expense/entry", payload);

      setSuccess("Expense added ✅");
      setForm({ date: "", category: "", description: "", amount: "" });
    } catch (err) {
      setError(err?.message || "Failed to add expense");
    }
  };

  return (
    <div className="formPage">
      <div className="formCard">
        <div className="formHeader">
          <h2 className="formTitle">Expense</h2>
          <p className="formSub">Add your expense entry</p>
        </div>

        {error && <div style={{ marginBottom: 12, color: "crimson" }}>{error}</div>}
        {success && <div style={{ marginBottom: 12, color: "green" }}>{success}</div>}

        <form className="formGrid" onSubmit={onSubmit}>
          <div className="field">
            <label className="label" htmlFor="expense-date">Date</label>
            <input
              id="expense-date"
              className="input"
              type="date"
              name="date"
              value={form.date}
              onChange={onChange}
              required
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="expense-category">Category</label>
            <select
              id="expense-category"
              className="select"
              name="category"
              value={form.category}
              onChange={onChange}
              required
            >
              <option value="" disabled>Select category</option>
              {expenseCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="field fieldFull">
            <label className="label" htmlFor="expense-desc">Description</label>
            <input
              id="expense-desc"
              className="input"
              type="text"
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="e.g., Grocery / Rent"
            />
          </div>

          <div className="field fieldFull">
            <label className="label" htmlFor="expense-amount">Amount</label>
            <input
              id="expense-amount"
              className="input"
              type="number"
              name="amount"
              value={form.amount}
              onChange={onChange}
              placeholder="0"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="actions">
            <button className="submitBtn" type="submit">Add Expense</button>
          </div>
        </form>
      </div>
    </div>
  );
}