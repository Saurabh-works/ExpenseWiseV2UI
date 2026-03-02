import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/layout.css";

export default function AppLayout() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="appShell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="appMain">
        <Header onToggleSidebar={() => setOpen((v) => !v)} />
        <main className="appContent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}