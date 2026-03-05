import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { post } from "../api";
import { AuthContext } from "../App";

export default function Login() {
  const nav = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // ✅ safety
    setError("");
    setLoading(true);

    try {
      const res = await post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      login();
      nav("/app/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="authBox">
        <h1 className="authTitle">Login</h1>
        <p className="authSub">Welcome back 👋</p>

        {error && <div className="authError">{error}</div>}

        <form onSubmit={onSubmit} className="authForm">
          <label className="authLabel">
            Email
            <input
              className="authInput"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={loading}
            />
          </label>

          <label className="authLabel">
            Password
            <input
              className="authInput"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </label>

          <button className="authBtn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="authSwitch">
          <span>Don’t have an account?</span>
          <Link
            className={`authLink ${loading ? "isDisabled" : ""}`}
            to="/signup"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
