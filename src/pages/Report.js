import React from "react";
import "../styles/Report.css";
import { get } from "../api";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

function nowYearMonth() {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

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

function formatINR(n) {
  const num = Number(n || 0);
  return num.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export default function Report() {
  const { year: curYear, month: curMonth } = nowYearMonth();

  const [year, setYear] = React.useState(curYear);
  const [month, setMonth] = React.useState(curMonth);
  const [type, setType] = React.useState("expense"); // default expense

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [items, setItems] = React.useState([]);
  const [totalAmount, setTotalAmount] = React.useState(0);
  const [totalRecords, setTotalRecords] = React.useState(0);

  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));

  const fetchReport = React.useCallback(
    async (opts = {}) => {
      const nextYear = opts.year ?? year;
      const nextMonth = opts.month ?? month;
      const nextType = opts.type ?? type;
      const nextPage = opts.page ?? page;
      const nextLimit = opts.limit ?? limit;

      setLoading(true);
      setError("");

      try {
        const qs = new URLSearchParams({
          year: String(nextYear),
          month: String(nextMonth),
          type: String(nextType),
          page: String(nextPage),
          limit: String(nextLimit),
        });

        const res = await get(`/report?${qs.toString()}`);

        // ✅ FIX: backend returns { ok, data }, not { data: { data: ... } }
        const data = res?.data;

        setItems(data?.items || []);
        setTotalAmount(data?.totalAmount || 0);
        setTotalRecords(data?.totalRecords || 0);
      } catch (err) {
        setError(err?.message || "Failed to load report");
        setItems([]);
        setTotalAmount(0);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    },
    [year, month, type, page, limit]
  );

  React.useEffect(() => {
    fetchReport();
  }, [year, month, type, page, limit, fetchReport]);

  const years = React.useMemo(() => {
    const start = curYear - 5;
    const end = curYear + 1;
    const arr = [];
    for (let y = end; y >= start; y--) arr.push(y);
    return arr;
  }, [curYear]);

  const onSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchReport({ page: 1 });
  };

  const onChangeYear = (v) => {
    setYear(Number(v));
    setPage(1);
  };
  const onChangeMonth = (v) => {
    setMonth(Number(v));
    setPage(1);
  };
  const onChangeType = (v) => {
    setType(v);
    setPage(1);
  };

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const downloadReport = async () => {
    try {
      setError("");

      const qs = new URLSearchParams({
        year: String(year),
        month: String(month),
        type: String(type),
      });

      const token = localStorage.getItem("token");

      // ✅ FIX: use same env var as your api.js uses
      const base = process.env.REACT_APP_API_BASE || "";
      const url = `${base}/report/download?${qs.toString()}`;

      const resp = await fetch(url, {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        throw new Error(txt || "Download failed");
      }

      const blob = await resp.blob();
      const a = document.createElement("a");
      const fileName = `Report_${type}_${year}-${String(month).padStart(2, "0")}.xlsx`;
      a.href = window.URL.createObjectURL(blob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError(err?.message || "Failed to download report");
    }
  };

  return (
    <div className="reportPage">
      <div className="reportCard">
        <div className="reportHeader">
          <h2 className="reportTitle">Report</h2>
          <p className="reportSub">Filter by year, month and type</p>
        </div>

        {error && <div className="reportMsg reportErr">{error}</div>}
        {loading && <div className="reportMsg reportInfo">Loading…</div>}

        <form className="reportFilters" onSubmit={onSubmit}>
          <div className="reportField">
            <label className="reportLabel" htmlFor="rep-year">
              Year
            </label>
            <select
              id="rep-year"
              className="reportSelect"
              value={year}
              onChange={(e) => onChangeYear(e.target.value)}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="reportField">
            <label className="reportLabel" htmlFor="rep-month">
              Month
            </label>
            <select
              id="rep-month"
              className="reportSelect"
              value={month}
              onChange={(e) => onChangeMonth(e.target.value)}
            >
              {monthOptions.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="reportField">
            <label className="reportLabel" htmlFor="rep-type">
              Type
            </label>
            <select
              id="rep-type"
              className="reportSelect"
              value={type}
              onChange={(e) => onChangeType(e.target.value)}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="reportActions">
            <button className="reportSubmit" type="submit">
              Submit
            </button>
          </div>
        </form>

        <div className="reportTableWrap">
          <table className="reportTable">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Category</th>
                <th>Description</th>
                <th className="amt">Amount</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="emptyCell">
                    No records found.
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr key={row._id}>
                    <td>{row.date}</td>
                    <td>{row.day}</td>
                    <td>{row.category}</td>
                    <td className="desc">{row.description || "-"}</td>
                    <td className="amt">{formatINR(row.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>

            <tfoot>
              <tr>
                <td colSpan={4} className="tfootLabel">
                  Total
                </td>
                <td className="amt tfootAmt">{formatINR(totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="reportBottom">
          <div className="pagerLeft">
            <div className="pageSize">
              <span className="pageSizeLabel">Rows:</span>
              <select
                className="pageSizeSelect"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="pageInfo">
              Page <b>{page}</b> / <b>{totalPages}</b>
            </div>

            <div className="pageBtns">
              <button
                type="button"
                className="iconBtn"
                onClick={() => canPrev && setPage((p) => p - 1)}
                disabled={!canPrev}
                aria-label="Previous page"
              >
                <ChevronLeftIcon />
              </button>

              <button
                type="button"
                className="iconBtn"
                onClick={() => canNext && setPage((p) => p + 1)}
                disabled={!canNext}
                aria-label="Next page"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>

          <div className="pagerRight">
            <button type="button" className="downloadBtn" onClick={downloadReport}>
              Download report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}