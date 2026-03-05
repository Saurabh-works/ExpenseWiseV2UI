import React from "react";
import "../styles/Dashboard.css";
import { get } from "../api";
import Select from "react-select";

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

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

const knownExpenseCategories = [
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

function nowYearMonth() {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

function formatINR(n) {
  const num = Number(n || 0);
  return num.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function hashHue(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return h;
}

export default function Dashboard() {
  const { year: curYear, month: curMonth } = nowYearMonth();

  const [recent, setRecent] = React.useState([]);

  const [histYear, setHistYear] = React.useState(curYear);
  const [expenseByMonth, setExpenseByMonth] = React.useState(Array(12).fill(0));

  const [pieYear, setPieYear] = React.useState(curYear);
  const [pieMonth, setPieMonth] = React.useState(curMonth);

  const [expenseByCategory, setExpenseByCategory] = React.useState({});

  const [monthTotals, setMonthTotals] = React.useState({
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

  const yearOptions = React.useMemo(
    () => years.map((y) => ({ value: y, label: String(y) })),
    [years],
  );

  const selectedMonthLabel =
    monthOptions.find((m) => m.value === pieMonth)?.label || "Month";

  const barOptions = React.useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
      scales: {
        y: { ticks: { precision: 0 } },
      },
    }),
    [],
  );

  const pieOptions = React.useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
      layout: { padding: 0 },
    }),
    [],
  );

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

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const histRes = await get(
          `/dashboard/expense-by-month?year=${histYear}`,
        );
        setExpenseByMonth(histRes?.data || Array(12).fill(0));
      } catch (err) {
        setError(err?.message || "Failed to load dashboard");
        setExpenseByMonth(Array(12).fill(0));
      } finally {
        setLoading(false);
      }
    })();
  }, [histYear]);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const [catRes, totalsRes] = await Promise.all([
          get(
            `/dashboard/expense-by-category?year=${pieYear}&month=${pieMonth}`,
          ),
          get(`/dashboard/totals-by-month?year=${pieYear}&month=${pieMonth}`),
        ]);

        const data = catRes?.data || {};

        const normalized = {};
        Object.entries(data).forEach(([key, val]) => {
          const cleanedKey = String(key || "").trim();
          normalized[cleanedKey] = Number(val || 0);
        });

        knownExpenseCategories.forEach((c) => {
          if (typeof normalized[c] !== "number") normalized[c] = 0;
        });

        setExpenseByCategory(normalized);

        setMonthTotals(
          totalsRes?.data || {
            totalIncome: 0,
            totalExpense: 0,
            incomeCount: 0,
            expenseCount: 0,
          },
        );
      } catch (err) {
        setError(err?.message || "Failed to load dashboard");
        setExpenseByCategory({});
        setMonthTotals({
          totalIncome: 0,
          totalExpense: 0,
          incomeCount: 0,
          expenseCount: 0,
        });
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

        // ✅ bar colors
        backgroundColor: "rgba(0, 232, 170, 0.55)", // main fill
        borderColor: "rgba(0, 232, 170, 0.95)", // outline
        borderWidth: 1,
        borderRadius: 8, // rounded bars
        hoverBackgroundColor: "rgba(0, 232, 170, 0.75)",
      },
    ],
  };

  const allCats = React.useMemo(() => {
    return Object.keys(expenseByCategory).sort(
      (a, b) =>
        Number(expenseByCategory[b] || 0) - Number(expenseByCategory[a] || 0),
    );
  }, [expenseByCategory]);

  const pieValues = allCats.map((c) => Number(expenseByCategory[c] || 0));
  const pieTotal = pieValues.reduce((a, b) => a + b, 0);

  const pieColors = allCats.map((c) => `hsl(${hashHue(c)} 80% 55%)`);

  const pieData = {
    labels: allCats,
    datasets: [
      {
        label: "Expense by Category",
        data: pieValues,
        backgroundColor: pieColors,
        borderWidth: 0,
        radius: "88%", // ✅ prevents "giant pie"
        hoverOffset: 6,
      },
    ],
  };

  const categoryRows = React.useMemo(() => {
    return allCats.map((c) => ({
      name: c,
      value: Number(expenseByCategory[c] || 0),
      hue: hashHue(c),
    }));
  }, [allCats, expenseByCategory]);

  return (
    <div className="dashPage">
      <div className="dashCard">
        <div className="dashHeader">
          <h2 className="dashTitle">Dashboard</h2>
          <p className="dashSub">Overview of your expenses and income</p>
        </div>

        {error && <div className="dashMsg dashErr">{error}</div>}
        {loading && <div className="dashMsg dashInfo">Loading…</div>}

        {/* Recent */}
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
                    <td colSpan={6} className="emptyCell">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  recent.map((r) => (
                    <tr key={r._id}>
                      <td>{r.date}</td>
                      <td>{r.day}</td>
                      <td
                        className={
                          r.entryType === "expense"
                            ? "typeExpense"
                            : "typeIncome"
                        }
                      >
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
              <label className="dashLabel" htmlFor="hist-year">
                Year
              </label>
              <Select
                inputId="hist-year"
                classNamePrefix="rs"
                options={yearOptions}
                value={yearOptions.find((o) => o.value === histYear) || null}
                onChange={(opt) => setHistYear(opt?.value ?? curYear)}
                placeholder="Select year"
                menuPlacement="bottom"
                menuPosition="fixed"
                maxMenuHeight={220}
              />
            </div>
          </div>

          <div className="dashChartCard dashChartTall">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Breakdown */}
        <div className="dashSection">
          <div className="dashSectionHead dashRow">
            <h3 className="dashH3">Category Breakdown</h3>

            <div className="dashFilters2">
              <div className="dashFilter">
                <label className="dashLabel" htmlFor="pie-year">
                  Year
                </label>
                <Select
                  inputId="pie-year"
                  classNamePrefix="rs"
                  options={yearOptions}
                  value={yearOptions.find((o) => o.value === pieYear) || null}
                  onChange={(opt) => setPieYear(opt?.value ?? curYear)}
                  placeholder="Select year"
                  menuPlacement="bottom"
                  menuPosition="fixed"
                  maxMenuHeight={220}
                />
              </div>

              <div className="dashFilter">
                <label className="dashLabel" htmlFor="pie-month">
                  Month
                </label>
                <Select
                  inputId="pie-month"
                  classNamePrefix="rs"
                  options={monthOptions}
                  value={monthOptions.find((o) => o.value === pieMonth) || null}
                  onChange={(opt) => setPieMonth(opt?.value ?? curMonth)}
                  placeholder="Select month"
                  menuPlacement="bottom"
                  menuPosition="fixed"
                  maxMenuHeight={220}
                />
              </div>
            </div>
          </div>

          <div className="dashBreakdown">
            {/* LEFT: pie */}
            <div className="dashPieCard">
              <div className="dashMiniTitle">
                {selectedMonthLabel} {pieYear}
              </div>
              <div className="dashPieWrap">
                <Pie data={pieData} options={pieOptions} />
              </div>
            </div>

            {/* RIGHT: categories (scroll) */}
            <div className="dashCatsCard">
              <div className="dashMiniTitle">Categories</div>

              <div className="dashCatsList">
                {categoryRows.map((r) => {
                  const pct = pieTotal > 0 ? (r.value / pieTotal) * 100 : 0;
                  return (
                    <div className="catRow" key={r.name}>
                      <div className="catLeft">
                        <span
                          className="catDot"
                          style={{ background: `hsl(${r.hue} 80% 55%)` }}
                        />
                        <span className="catName">{r.name}</span>
                      </div>

                      <div className="catRight">
                        <span className="catPct">
                          {pct ? `${pct.toFixed(0)}%` : "0%"}
                        </span>
                        <span className="catAmt">{formatINR(r.value)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Monthly totals */}
        <div className="dashSection">
          <div className="dashSectionHead">
            <h3 className="dashH3">
              Monthly Totals — {selectedMonthLabel} {pieYear}
            </h3>
          </div>

          <div className="dashTotals">
            <div className="totalBox">
              <div className="totalLabel">Total Expense (Month)</div>
              <div className="totalValue">
                {formatINR(monthTotals.totalExpense)}
              </div>
              <div className="totalMeta">Count: {monthTotals.expenseCount}</div>
            </div>

            <div className="totalBox">
              <div className="totalLabel">Total Income (Month)</div>
              <div className="totalValue">
                {formatINR(monthTotals.totalIncome)}
              </div>
              <div className="totalMeta">Count: {monthTotals.incomeCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
