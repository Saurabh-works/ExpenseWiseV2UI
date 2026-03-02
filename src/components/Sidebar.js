import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/layout.css";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import AddAlertOutlinedIcon from "@mui/icons-material/AddAlertOutlined";

const items = [
  { to: "/app/dashboard", label: "Dashboard", Icon: DashboardOutlinedIcon },
  { to: "/app/expense", label: "Expense", Icon: ShoppingCartOutlinedIcon },
  { to: "/app/income", label: "Income", Icon: PaidOutlinedIcon },
  { to: "/app/report", label: "Report", Icon: AssessmentOutlinedIcon },
  { to: "/app/alert", label: "Alert", Icon: AddAlertOutlinedIcon },
];

export default function Sidebar({ open = false, onClose }) {
  return (
    <>
      <aside className={"tsSidebar" + (open ? " isOpen" : "")}>
        <div className="tsSidebarTop">
          <div className="tsBrand">
            <div className="tsBrandName">ExpenseWise</div>

            <button
              className="tsIconBtn tsSidebarClose"
              type="button"
              aria-label="Close menu"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        <nav className="tsNav">
          {items.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                "tsNavItem" + (isActive ? " isActive" : "")
              }
            >
              <span className="tsNavIcon" aria-hidden="true">
                <Icon className="tsMuiIcon" />
              </span>
              <span className="tsNavLabel">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <button
        className={"tsOverlay" + (open ? " isOpen" : "")}
        type="button"
        aria-label="Close menu overlay"
        onClick={onClose}
      />
    </>
  );
}