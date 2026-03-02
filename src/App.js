import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Expense from "./pages/Expense";
import Income from "./pages/Income";
import Report from "./pages/Report";
import Alert from "./pages/Alert";

export const AuthContext = React.createContext(null);

function ProtectedRoute({ children }) {
  const { isAuthed } = React.useContext(AuthContext);
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [isAuthed, setIsAuthed] = useState(false);

  // ✅ Auth is now based on token presence (recommended)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthed(!!token);
  }, []);

  const auth = useMemo(
    () => ({
      isAuthed,

      // ✅ Call this after successful login/signup
      login: () => {
        setIsAuthed(true);
        // keep this only if you still want it (optional)
        localStorage.setItem("expensewise_authed", "true");
      },

      // ✅ Clears everything on logout
      logout: () => {
        setIsAuthed(false);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("expensewise_authed");
      },
    }),
    [isAuthed]
  );

  return (
    <AuthContext.Provider value={auth}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />

          {/* ✅ If already authed, go straight to dashboard */}
          <Route
            path="/login"
            element={isAuthed ? <Navigate to="/app/dashboard" replace /> : <Login />}
          />
          <Route
            path="/signup"
            element={isAuthed ? <Navigate to="/app/dashboard" replace /> : <Signup />}
          />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="expense" element={<Expense />} />
            <Route path="income" element={<Income />} />
            <Route path="report" element={<Report />} />
            <Route path="alert" element={<Alert />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}