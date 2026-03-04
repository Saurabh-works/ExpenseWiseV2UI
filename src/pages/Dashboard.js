import React from "react";
import "../styles/Dashboard.css";
import { get } from "../api";

import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const monthOptions = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

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

function nowYearMonth() {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

function formatINR(n) {
  const num = Number(n || 0);
  return num.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export default function Dashboard() {
  const { year: curYear, month: curMonth } = nowYearMonth();

  // Recent table
  const [recent, setRecent] = React.useState([]);

  // Histogram filter
  const [histYear, setHistYear] = React.useState(curYear);
  const [expenseByMonth, setExpenseByMonth] = React.useState(Array(12).fill(0));

  // Pie filter
  const [pieYear, setPieYear] = React.useState(curYear);
  const [pieMonth, setPieMonth] = React.useState(curMonth);
  const [expenseByCategory, setExpenseByCategory] = React.useState(() => {
    const obj = {};
    expenseCategories.forEach((c) => (obj[c] = 0));
    return obj;
  });

  // Totals
  const [totals, setTotals] = React.useState({
    totalIncome: 0,
    totalExpense: 0,
    incomeCount: 0,
    expenseCount: 0,
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const years = React.useMemo(() => {
    const start = curYear - 5;
    const end = curYear + 1;
    const arr = [];
    for (let y = end; y >= start; y--) arr.push(y);
    return arr;
  }, [curYear]);

  // Fetch recent (once)
  React.useEffect(() => {
    (async () => {
      try {
        setError("");
        const res = await get("/dashboard/recent?limit=5");
        setRecent(res?.data || []);
      } catch (err) {
        setError(err?.message || "Failed to load dashboard");
      }
    })();
  }, []);

  // Fetch histogram + totals when histYear changes
  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const [histRes, totalsRes] = await Promise.all([
          get(`/dashboard/expense-by-month?year=${histYear}`),
          get(`/dashboard/totals?year=${histYear}`),
        ]);

        setExpenseByMonth(histRes?.data || Array(12).fill(0));
        setTotals(
          totalsRes?.data || {
            totalIncome: 0,
            totalExpense: 0,
            incomeCount: 0,
            expenseCount: 0,
          }
        );
      } catch (err) {
        setError(err?.message || "Failed to load dashboard");
        setExpenseByMonth(Array(12).fill(0));
      } finally {
        setLoading(false);
      }
    })();
  }, [histYear]);

  // Fetch pie when pie filters change
  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const res = await get(`/dashboard/expense-by-category?year=${pieYear}&month=${pieMonth}`);
        const data = res?.data || {};

        // ensure all categories exist
        const normalized = {};
        expenseCategories.forEach((c) => (normalized[c] = Number(data[c] || 0)));
        setExpenseByCategory(normalized);
      } catch (err) {
        setError(err?.message || "Failed to load dashboard");
        const blank = {};
        expenseCategories.forEach((c) => (blank[c] = 0));
        setExpenseByCategory(blank);
      } finally {
        setLoading(false);
      }
    })();
  }, [pieYear, pieMonth]);

  const barData = {
    labels: monthOptions.map((m) => m.label),
    datasets: [
      {
        label: `Expense (${histYear})`,
        data: expenseByMonth.map((x) => Number(x || 0)),
      },
    ],
  };

  const pieData = {
    labels: expenseCategories,
    datasets: [
      {
        label: `Expense by Category`,
        data: expenseCategories.map((c) => Number(expenseByCategory[c] || 0)),
      },
    ],
  };

  return (
    <div className="dashPage">
      <div className="dashCard">
        <div className="dashHeader">
          <h2 className="dashTitle">Dashboard</h2>
          <p className="dashSub">Overview of your expenses and income</p>
        </div>

        {error && <div className="dashMsg dashErr">{error}</div>}
        {loading && <div className="dashMsg dashInfo">Loading…</div>}

        {/* Recent 5 */}
        <div className="dashSection">
          <div className="dashSectionHead">
            <h3 className="dashH3">Recent (Last 5)</h3>
          </div>

          <div className="dashTableWrap">
            <table className="dashTable">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th className="amt">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={6} className="emptyCell">No records found.</td>
                  </tr>
                ) : (
                  recent.map((r) => (
                    <tr key={r._id}>
                      <td>{r.date}</td>
                      <td>{r.day}</td>
                      <td className={r.entryType === "expense" ? "typeExpense" : "typeIncome"}>
                        {r.entryType}
                      </td>
                      <td>{r.category}</td>
                      <td className="desc">{r.description || "-"}</td>
                      <td className="amt">{formatINR(r.amount)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Histogram */}
        <div className="dashSection">
          <div className="dashSectionHead dashRow">
            <h3 className="dashH3">Expense per Month</h3>

            <div className="dashFilter">
              <label className="dashLabel" htmlFor="hist-year">Year</label>
              <select
                id="hist-year"
                className="dashSelect"
                value={histYear}
                onChange={(e) => setHistYear(Number(e.target.value))}
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="dashChartCard">
            <Bar data={barData} />
          </div>
        </div>

        {/* Pie */}
        <div className="dashSection">
          <div className="dashSectionHead dashRow">
            <h3 className="dashH3">Category Breakdown</h3>

            <div className="dashFilters2">
              <div className="dashFilter">
                <label className="dashLabel" htmlFor="pie-year">Year</label>
                <select
                  id="pie-year"
                  className="dashSelect"
                  value={pieYear}
                  onChange={(e) => setPieYear(Number(e.target.value))}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className="dashFilter">
                <label className="dashLabel" htmlFor="pie-month">Month</label>
                <select
                  id="pie-month"
                  className="dashSelect"
                  value={pieMonth}
                  onChange={(e) => setPieMonth(Number(e.target.value))}
                >
                  {monthOptions.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="dashChartCard">
            <Pie data={pieData} />
          </div>
        </div>

        {/* Totals */}
        <div className="dashSection">
          <div className="dashSectionHead">
            <h3 className="dashH3">Totals ({histYear})</h3>
          </div>

          <div className="dashTotals">
            <div className="totalBox">
              <div className="totalLabel">Total Expense</div>
              <div className="totalValue">{formatINR(totals.totalExpense)}</div>
              <div className="totalMeta">Count: {totals.expenseCount}</div>
            </div>

            <div className="totalBox">
              <div className="totalLabel">Total Income</div>
              <div className="totalValue">{formatINR(totals.totalIncome)}</div>
              <div className="totalMeta">Count: {totals.incomeCount}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}