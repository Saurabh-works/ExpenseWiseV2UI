import React from "react";
import { useNavigate } from "react-router-dom";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import "../styles/Welcome.css";

export default function Welcome() {
  const nav = useNavigate();

  return (
    <div className="welcomeShell">
      <header className="welcomeHeader">
        <div className="brand" onClick={() => nav("/")}>
          <span className="brandMark" />
          <span className="brandText">ExpenseWise</span>
        </div>

        <nav className="headerActions">
          <button className="linkBtn" onClick={() => nav("/login")}>
            Login
          </button>
          <button className="btn btnPrimary" onClick={() => nav("/signup")}>
            Get Started
          </button>
        </nav>
      </header>

      <main className="welcomeMain">
        <section className="heroLeft">
          <div className="heroBadge">Smart expense tracking for everyday use</div>

          <h1 className="heroTitle">
            Manage money with <span>clarity</span> and confidence.
          </h1>

          <p className="heroText">
            Track expenses, record income, view monthly reports, and stay in control
            of your spending with a clean and simple dashboard.
          </p>

          <div className="heroActions">
            <button className="btn btnPrimary heroBtn" onClick={() => nav("/signup")}>
              Create Account
            </button>
            <button className="btn btnSecondary heroBtn" onClick={() => nav("/login")}>
              Login
            </button>
          </div>

          <div className="statsRow">
            <div className="statCard">
              <div className="statValue">Fast</div>
              <div className="statLabel">Quick expense entry</div>
            </div>

            <div className="statCard">
              <div className="statValue">Clear</div>
              <div className="statLabel">Reports and summaries</div>
            </div>

            <div className="statCard">
              <div className="statValue">Simple</div>
              <div className="statLabel">Easy daily money tracking</div>
            </div>
          </div>
        </section>

        <section className="heroRight" aria-hidden="true">
          <div className="previewCard">
            <div className="previewTop">
              <div className="previewDots">
                <span />
                <span />
                <span />
              </div>
              <div className="previewTopTitle">ExpenseWise Dashboard</div>
            </div>

            <div className="previewSummary">
              <div className="summaryCard">
                <div className="summaryLabel">Income</div>
                <div className="summaryValue income">₹ 90,000</div>
              </div>
              <div className="summaryCard">
                <div className="summaryLabel">Expense</div>
                <div className="summaryValue expense">₹ 59,546</div>
              </div>
              <div className="summaryCard">
                <div className="summaryLabel">Balance</div>
                <div className="summaryValue balance">₹ 30,454</div>
              </div>
            </div>

            <div className="chartCard">
              <div className="chartHeader">
                <span>Monthly spending</span>
                <span className="chartTag">March</span>
              </div>

              <div className="bars">
                <div className="bar h40" />
                <div className="bar h65" />
                <div className="bar h52" />
                <div className="bar h82" />
                <div className="bar h58" />
                <div className="bar h72" />
              </div>

              <div className="barLabels">
                <span>W1</span>
                <span>W2</span>
                <span>W3</span>
                <span>W4</span>
                <span>W5</span>
                <span>W6</span>
              </div>
            </div>

            <div className="recentCard">
              <div className="recentHeader">Recent activity</div>

              <div className="recentRow">
                <span className="recentCategory">Groceries</span>
                <span className="recentDesc">Pay for groceries</span>
                <span className="recentAmount expense">- ₹ 12,000</span>
              </div>

              <div className="recentRow">
                <span className="recentCategory">Salary</span>
                <span className="recentDesc">Received salary</span>
                <span className="recentAmount income">+ ₹ 80,656</span>
              </div>

              <div className="recentRow">
                <span className="recentCategory">Housing</span>
                <span className="recentDesc">Pay a Rent</span>
                <span className="recentAmount expense">- ₹ 20,000</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="welcomeFooter">
        <div className="footerLeft">
          © {new Date().getFullYear()} ExpenseWise. All rights reserved.
        </div>

        <div className="footerRight">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="socialLink"
            aria-label="LinkedIn"
          >
            <LinkedInIcon fontSize="small" />
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="socialLink"
            aria-label="Instagram"
          >
            <InstagramIcon fontSize="small" />
          </a>

          <a
            href="mailto:yourmail@example.com"
            className="socialLink"
            aria-label="Email"
          >
            <MailOutlineIcon fontSize="small" />
          </a>
        </div>
      </footer>
    </div>
  );
}