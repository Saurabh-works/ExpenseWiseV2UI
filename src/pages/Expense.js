// src/pages/Expense.js
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

// ✅ You can add more here — it will scroll automatically
const quickCats = [
  { emoji: "🍜", label: "Food", value: "Food" },
  { emoji: "🚕", label: "Public Transport", value: "Public Transport" },
  { emoji: "🍔", label: "Outside food", value: "Outside food" },
  { emoji: "✨", label: "Spend on other", value: "Spend on other" },
  { emoji: "🎬", label: "Entertainment", value: "Entertainment" },
  { emoji: "🏠", label: "Housing", value: "Housing" },
  { emoji: "🧴", label: "Personal Care", value: "Personal Care" },
  { emoji: "🩺", label: "Healthcare", value: "Healthcare" },
  { emoji: "🛍️", label: "Shopping", value: "Shopping" },
  { emoji: "🎁", label: "Gifts & Donations", value: "Gifts & Donations" },
  { emoji: "⛽", label: "Fuel", value: "Fuel" },
  { emoji: "🛒", label: "Groceries", value: "Groceries" },
  { emoji: "💡", label: "Bills", value: "Bills" },
  { emoji: "📚", label: "Learning", value: "Learning" },
  { emoji: "💰", label: "Savings", value: "Savings" },
  { emoji: "📈", label: "Investments", value: "Investments" },
  { emoji: "🧾", label: "Loan / EMI", value: "Loan / EMI" },
  { emoji: "🧩", label: "Other", value: "Other" },
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

  const todayISO = () => new Date().toISOString().slice(0, 10);

  const onPickQuick = (catValue) => {
    setForm((s) => ({
      ...s,
      date: s.date || todayISO(), // ✅ only set today if date is empty
      category: catValue,
      description: s.description || `I spent on ${catValue}`, // ✅ only if empty
    }));

    // ✅ jump to amount
    const amt = document.getElementById("expense-amount");
    if (amt) amt.focus();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 1000);

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
    <div className="exPage">
      <div className="exCard">
        <div className="exHeader">
          <div>
            <h2 className="exTitle">Expense</h2>
            <p className="exSub">Add your expense entry</p>
          </div>
        </div>

        {/* ✅ Top-center toast message (overlay) */}
        {(error || success) && (
          <div className="exToastWrap" role="status" aria-live="polite">
            <div
              key={error || success} // ✅ re-triggers animation on new message
              className={`exToast ${error ? "isErr" : "isOk"}`}
            >
              {error || success}
            </div>
          </div>
        )}

        <div className="exLayout">
          {/* LEFT: form */}
          <div className="exFormCard">
            <form className="exFormGrid" onSubmit={onSubmit}>
              <div className="exField">
                <label className="exLabel" htmlFor="expense-date">
                  Date
                </label>
                <input
                  id="expense-date"
                  className="exInput"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="exField">
                <label className="exLabel" htmlFor="expense-category">
                  Category
                </label>
                <Select
                  inputId="expense-category"
                  classNamePrefix="rs"
                  options={categoryOptions}
                  value={
                    categoryOptions.find((o) => o.value === form.category) ||
                    null
                  }
                  onChange={(opt) =>
                    setForm((s) => ({ ...s, category: opt?.value || "" }))
                  }
                  placeholder="Select category"
                  menuPlacement="bottom"
                  menuPosition="fixed"
                  maxMenuHeight={220}
                />
              </div>

              <div className="exField exFull">
                <label className="exLabel" htmlFor="expense-desc">
                  Description
                </label>
                <input
                  id="expense-desc"
                  className="exInput"
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  placeholder="e.g., Grocery / Rent"
                />
              </div>

              <div className="exField exFull">
                <label className="exLabel" htmlFor="expense-amount">
                  Amount
                </label>
                <input
                  id="expense-amount"
                  className="exInput"
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

              <div className="exActions">
                <button className="exSubmit" type="submit">
                  Add Expense
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: quick categories (scrollable list) */}
          <aside className="exQuickCard" aria-label="Quick categories">
            <div className="exQuickHead">
              <div className="exQuickTitle">Quick Categories</div>
              <div className="exQuickSub">Tap to auto-select category</div>
            </div>

            {/* ✅ only this part scrolls */}
            <div className="exQuickScroll">
              <div className="exQuickGrid">
                {quickCats.map((c) => {
                  const active = form.category === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      className={`exQuickBtn ${active ? "isActive" : ""}`}
                      onClick={() => onPickQuick(c.value)}
                      title={c.label}
                    >
                      <span className="exQuickEmoji">{c.emoji}</span>
                      <span className="exQuickLabel">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="exQuickHint">
              Tip: pick category → jump to amount field
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
