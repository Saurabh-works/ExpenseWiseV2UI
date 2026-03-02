import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

function titleFromPath(pathname) {
  const last = pathname.split("/").filter(Boolean).pop() || "dashboard";
  return last.charAt(0).toUpperCase() + last.slice(1);
}

export default function Header() {
  const { logout } = React.useContext(AuthContext);
  const nav = useNavigate();
  const loc = useLocation();

  const title = titleFromPath(loc.pathname);

  return (
    <header className="header">
      <div className="headerLeft">
        <div className="brandMark" aria-hidden="true" />
        <div>
          <div className="headerTitle">{title}</div>
          <div className="headerSub">ExpenseWise • Smart Money Tracker</div>
        </div>
      </div>

      <div className="headerRight">
        <div className="chip">
          <span className="chipDot" />
          Light Theme
        </div>
        <button
          className="btn btnGhost"
          onClick={() => {
            logout();
            nav("/login");
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}