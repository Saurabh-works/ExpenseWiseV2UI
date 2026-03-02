import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AppLayout() {
  return (
    <div className="appShell">
      <Sidebar />
      <div className="appMain">
        <Header />
        <main className="appContent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}