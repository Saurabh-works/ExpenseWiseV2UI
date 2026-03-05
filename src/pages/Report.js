// src/pages/Report.js (or wherever your Report component lives)
import React from "react";
import "../styles/Report.css";
import { get } from "../api";
import Select from "react-select";

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

const typeOptions = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

function formatINR(n) {
  const num = Number(n || 0);
  return num.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export default function Report() {
  const { year: curYear, month: curMonth } = nowYearMonth();

  const [year, setYear] = React.useState(curYear);
  const [month, setMonth] = React.useState(curMonth);
  const [type, setType] = React.useState("expense");

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [items, setItems] = React.useState([]);
  const [totalAmount, setTotalAmount] = React.useState(0);
  const [totalRecords, setTotalRecords] = React.useState(0);

  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));

  const years = React.useMemo(() => {
    const start = curYear - 5;
    const end = curYear + 1;
    const arr = [];
    for (let y = end; y >= start; y--) arr.push(y);
    return arr;
  }, [curYear]);

  const yearOptions = React.useMemo(
    () => years.map((y) => ({ value: y, label: String(y) })),
    [years]
  );

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

        // backend returns { ok, data }
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

  const onSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchReport({ page: 1 });
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
            <Select
              inputId="rep-year"
              classNamePrefix="rs"
              options={yearOptions}
              value={yearOptions.find((o) => o.value === year) || null}
              onChange={(opt) => {
                setYear(opt?.value ?? curYear);
                setPage(1);
              }}
              placeholder="Select year"
              menuPlacement="bottom"
              menuPosition="fixed"
              maxMenuHeight={220}
            />
          </div>

          <div className="reportField">
            <label className="reportLabel" htmlFor="rep-month">
              Month
            </label>
            <Select
              inputId="rep-month"
              classNamePrefix="rs"
              options={monthOptions}
              value={monthOptions.find((o) => o.value === month) || null}
              onChange={(opt) => {
                setMonth(opt?.value ?? curMonth);
                setPage(1);
              }}
              placeholder="Select month"
              menuPlacement="bottom"
              menuPosition="fixed"
              maxMenuHeight={220}
            />
          </div>

          <div className="reportField">
            <label className="reportLabel" htmlFor="rep-type">
              Type
            </label>
            <Select
              inputId="rep-type"
              classNamePrefix="rs"
              options={typeOptions}
              value={typeOptions.find((o) => o.value === type) || null}
              onChange={(opt) => {
                setType(opt?.value ?? "expense");
                setPage(1);
              }}
              placeholder="Select type"
              menuPlacement="bottom"
              menuPosition="fixed"
              maxMenuHeight={220}
            />
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
                {[5, 10, 20, 50, 100].map((n) => (
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