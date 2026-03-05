import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Signup.css";
import { post } from "../api";
import { AuthContext } from "../App";

export default function Signup() {
  const nav = useNavigate();
  const { login } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      const res = await post("/auth/signup", { name, email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      login();
      nav("/app/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "Signup failed");
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="authBox">
        <h1 className="authTitle">Sign Up</h1>
        <p className="authSub">Create your account ✨</p>
        {error && <div className="authError">{error}</div>}
        <form onSubmit={onSubmit} className="authForm">
          <label className="authLabel">
            Full Name
            <input
              className="authInput"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </label>

          <label className="authLabel">
            Email
            <input
              className="authInput"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </label>

          <label className="authLabel">
            Password
            <input
              className="authInput"
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </label>

          <button className="authBtn" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="authSwitch">
          <span>Already have an account?</span>
          <Link
            className={`authLink ${loading ? "isDisabled" : ""}`}
            to="/login"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
