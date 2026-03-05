import React from "react";
import "../styles/Expense.css";
import { post } from "../api";
import Select from "react-select";

const expenseCategories = [
  "Housing",
  "Groceries",
  "Food",
  "Outside food",
  "Fuel",
  "Public Transport",
  "Bills",
  "Healthcare",
  "Spend on other",
  "Learning",
  "Personal Care",
  "Entertainment",
  "Shopping",
  "Gifts & Donations",
  "Investments",
  "Loan / EMI",
  "Savings",
  "Other",
];

const categoryOptions = expenseCategories.map((c) => ({ value: c, label: c }));

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

        {error && (
          <div style={{ marginBottom: 12, color: "crimson" }}>{error}</div>
        )}
        {success && (
          <div style={{ marginBottom: 12, color: "green" }}>{success}</div>
        )}

        <form className="formGrid" onSubmit={onSubmit}>
          <div className="field">
            <label className="label" htmlFor="expense-date">
              Date
            </label>
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
            <label className="label" htmlFor="expense-category">
              Category
            </label>
            <div className="field">
              <Select
                inputId="expense-category"
                classNamePrefix="rs"
                options={categoryOptions}
                value={
                  categoryOptions.find((o) => o.value === form.category) || null
                }
                onChange={(opt) =>
                  setForm((s) => ({ ...s, category: opt?.value || "" }))
                }
                placeholder="Select category"
                menuPlacement="bottom" // 👈 force downward
                menuPosition="fixed" // 👈 avoids clipping / weird flipping
                maxMenuHeight={220} // 👈 small + scroll
              />
            </div>
          </div>

          <div className="field fieldFull">
            <label className="label" htmlFor="expense-desc">
              Description
            </label>
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
            <label className="label" htmlFor="expense-amount">
              Amount
            </label>
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
            <button className="submitBtn" type="submit">
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
