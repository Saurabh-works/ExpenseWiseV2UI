import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import "../styles/layout.css";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

function titleFromPath(pathname) {
  const last = pathname.split("/").filter(Boolean).pop() || "dashboard";
  return last.charAt(0).toUpperCase() + last.slice(1);
}

export default function Header({ onToggleSidebar }) {
  const { logout, user } = React.useContext(AuthContext);
  const nav = useNavigate();
  const loc = useLocation();

  const title = titleFromPath(loc.pathname);

  // shows normal full name like "Saurabh Shinde"
  const displayName =
    user?.fullName ||
    user?.name ||
    user?.username ||
    user?.email?.split?.("@")?.[0] ||
    "Saurabh Shinde";

  return (
    <header className="tsHeader">
      <div className="tsHeaderLeft">
        <button
          className="tsIconBtn tsHamburger"
          type="button"
          aria-label="Open menu"
          onClick={onToggleSidebar}
        >
          <MenuOutlinedIcon className="tsMuiIcon" />
        </button>

        <div className="tsHeaderTitle">{title}</div>
      </div>

      <div className="tsHeaderRight">
        <div className="tsUserNameOnly">{displayName}</div>

        <button
          className="tsBtn tsBtnPrimary"
          type="button"
          onClick={() => {
            logout?.();
            nav("/", { replace: true });
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
