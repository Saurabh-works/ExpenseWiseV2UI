import React from "react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/app/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/app/expense", label: "Expense", icon: "💸" },
  { to: "/app/income", label: "Income", icon: "💰" },
  { to: "/app/report", label: "Report", icon: "📈" },
  { to: "/app/alert", label: "Alert", icon: "🔔" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebarTop">
        <div className="logo">
          <div className="logoIcon">EW</div>
          <div className="logoText">
            <div className="logoName">ExpenseWise</div>
            <div className="logoTag">Fintech • MERN</div>
          </div>
        </div>
      </div>

      <nav className="nav">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) => "navItem" + (isActive ? " active" : "")}
          >
            <span className="navIcon" aria-hidden="true">
              {it.icon}
            </span>
            <span className="navLabel">{it.label}</span>
            <span className="navGlow" aria-hidden="true" />
          </NavLink>
        ))}
      </nav>

      <div className="sidebarBottom">
        <div className="sidebarCard">
          <div className="sidebarCardTitle">Tip</div>
          <div className="sidebarCardText">
            Track expenses daily — small leaks sink big budgets.
          </div>
        </div>
      </div>
    </aside>
  );
}