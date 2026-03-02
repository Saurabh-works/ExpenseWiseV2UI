import React from "react";
import "../styles/Income.css";
import { post } from "../api";

const incomeCategories = ["Salary", "Borrowing Money", "Side Income", "Other"];

export default function Income() {
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
      await post("/income/entry", payload);

      setSuccess("Income added ✅");
      setForm({ date: "", category: "", description: "", amount: "" });
    } catch (err) {
      setError(err?.message || "Failed to add income");
    }
  };

  return (
    <div className="formPage">
      <div className="formCard">
        <div className="formHeader">
          <h2 className="formTitle">Income</h2>
          <p className="formSub">Add your income entry</p>
        </div>

        {error && <div style={{ marginBottom: 12, color: "crimson" }}>{error}</div>}
        {success && <div style={{ marginBottom: 12, color: "green" }}>{success}</div>}

        <form className="formGrid" onSubmit={onSubmit}>
          <div className="field">
            <label className="label" htmlFor="income-date">Date</label>
            <input
              id="income-date"
              className="input"
              type="date"
              name="date"
              value={form.date}
              onChange={onChange}
              required
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="income-category">Category</label>
            <select
              id="income-category"
              className="select"
              name="category"
              value={form.category}
              onChange={onChange}
              required
            >
              <option value="" disabled>Select category</option>
              {incomeCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="field fieldFull">
            <label className="label" htmlFor="income-desc">Description</label>
            <input
              id="income-desc"
              className="input"
              type="text"
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="e.g., March salary"
            />
          </div>

          <div className="field fieldFull">
            <label className="label" htmlFor="income-amount">Amount</label>
            <input
              id="income-amount"
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
            <button className="submitBtn" type="submit">Add Income</button>
          </div>
        </form>
      </div>
    </div>
  );
}