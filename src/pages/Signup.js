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

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await post("/auth/signup", { name, email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      login(); // ✅ so /app routes open
      nav("/app/dashboard", { replace: true });
    } catch (err) {
      alert(err?.message || "Signup failed");
    }
  };

  return (
    <div className="authPage">
      <div className="authBox">
        <h1 className="authTitle">Sign Up</h1>
        <p className="authSub">Create your account ✨</p>

        <form onSubmit={onSubmit} className="authForm">
          <label className="authLabel">
            Full Name
            <input className="authInput" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label className="authLabel">
            Email
            <input className="authInput" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          <label className="authLabel">
            Password
            <input className="authInput" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>

          <button className="authBtn" type="submit">
            Create Account
          </button>
        </form>

        <div className="authSwitch">
          <span>Already have an account?</span>
          <Link className="authLink" to="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}