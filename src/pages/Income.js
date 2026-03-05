// src/pages/Income.js
import React from "react";
import "../styles/Income.css";
import { post } from "../api";
import Select from "react-select";

const incomeCategories = ["Salary", "Borrowing Money", "Side Income", "Other"];
const categoryOptions = incomeCategories.map((c) => ({ value: c, label: c }));

// ✅ Quick categories (scrollable list)
const quickCats = [
  { emoji: "💼", label: "Salary", value: "Salary" },
  { emoji: "🧑‍🤝‍🧑", label: "Borrowing Money", value: "Borrowing Money" },
  { emoji: "🛠️", label: "Side Income", value: "Side Income" },
  { emoji: "✨", label: "Other", value: "Other" },
];

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

  const todayISO = () => new Date().toISOString().slice(0, 10);

  // ✅ Quick pick: set today + category + description + focus amount
  const onPickQuick = (catValue) => {
    setForm((s) => ({
      ...s,
      date: s.date || todayISO(),
      category: catValue,
      description: s.description || `I received from ${catValue}`,
    }));

    const amt = document.getElementById("income-amount");
    if (amt) amt.focus();
  };

  const clearToastSoon = () => {
    window.setTimeout(() => {
      setSuccess("");
      setError("");
    }, 1200);
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
      clearToastSoon();
    } catch (err) {
      setError(err?.message || "Failed to add income");
      clearToastSoon();
    }
  };

  return (
    <div className="inPage">
      <div className="inCard">
        <div className="inHeader">
          <div>
            <h2 className="inTitle">Income</h2>
            <p className="inSub">Add your income entry</p>
          </div>
        </div>

        {/* ✅ Top-center toast message (overlay) */}
        {(error || success) && (
          <div className="inToastWrap" role="status" aria-live="polite">
            <div
              key={error || success} // ✅ re-triggers animation on new message
              className={`inToast ${error ? "isErr" : "isOk"}`}
            >
              {error || success}
            </div>
          </div>
        )}

        <div className="inLayout">
          {/* LEFT: form */}
          <div className="inFormCard">
            <form className="inFormGrid" onSubmit={onSubmit}>
              <div className="inField">
                <label className="inLabel" htmlFor="income-date">
                  Date
                </label>
                <input
                  id="income-date"
                  className="inInput"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="inField">
                <label className="inLabel" htmlFor="income-category">
                  Category
                </label>
                <Select
                  inputId="income-category"
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

              <div className="inField inFull">
                <label className="inLabel" htmlFor="income-desc">
                  Description
                </label>
                <input
                  id="income-desc"
                  className="inInput"
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  placeholder="e.g., March salary"
                />
              </div>

              <div className="inField inFull">
                <label className="inLabel" htmlFor="income-amount">
                  Amount
                </label>
                <input
                  id="income-amount"
                  className="inInput"
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

              <div className="inActions">
                <button className="inSubmit" type="submit">
                  Add Income
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: quick categories (scrollable list) */}
          <aside className="inQuickCard" aria-label="Quick categories">
            <div className="inQuickHead">
              <div className="inQuickTitle">Quick Categories</div>
              <div className="inQuickSub">Tap to auto-select category</div>
            </div>

            {/* ✅ only this part scrolls */}
            <div className="inQuickScroll">
              <div className="inQuickGrid">
                {quickCats.map((c) => {
                  const active = form.category === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      className={`inQuickBtn ${active ? "isActive" : ""}`}
                      onClick={() => onPickQuick(c.value)}
                      title={c.label}
                    >
                      <span className="inQuickEmoji">{c.emoji}</span>
                      <span className="inQuickLabel">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="inQuickHint">
              Tip: pick category → jump to amount field
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}