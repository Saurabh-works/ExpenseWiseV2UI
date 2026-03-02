import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Welcome.css";

export default function Welcome() {
  const nav = useNavigate();

  return (
    <div className="welcomeShell">
      {/* Header */}
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
            Sign Up
          </button>
        </nav>
      </header>

      {/* Main */}
      <main className="welcomeMain">
        <section className="heroLeft">
          <div className="heroBadge">Dark Mint Fintech</div>

          <h1 className="heroTitle">
            Track smart. <span className="mint">Spend wise.</span>
          </h1>

          <p className="heroText">
            ExpenseWise helps you log expenses fast, visualize patterns, and stay on budget —
            with a clean dashboard that feels premium.
          </p>

          <div className="heroActions">
            <button className="btn btnPrimary" onClick={() => nav("/signup")}>
              Get Started Free
            </button>
            <button className="btn btnOutline" onClick={() => nav("/login")}>
              View Demo (Login)
            </button>
          </div>

          <div className="heroMini">
            <div className="miniCard">
              <div className="miniIcon mintGlow">📈</div>
              <div>
                <div className="miniTitle">Smart Tracking</div>
                <div className="miniText">Quick add, clean categories, instant totals.</div>
              </div>
            </div>

            <div className="miniCard">
              <div className="miniIcon cyanGlow">🧾</div>
              <div>
                <div className="miniTitle">Clear Reports</div>
                <div className="miniText">See where your money goes in seconds.</div>
              </div>
            </div>

            <div className="miniCard">
              <div className="miniIcon warnGlow">⏱️</div>
              <div>
                <div className="miniTitle">Budget Alerts</div>
                <div className="miniText">Spot overspending before it becomes a problem.</div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Art / Mock */}
        <section className="heroRight" aria-hidden="true">
          <div className="glow mintOrb" />
          <div className="glow cyanOrb" />
          <div className="gridGlow" />

          <div className="mockCard">
            <div className="mockTop">
              <span className="mockDot" />
              <span className="mockDot" />
              <span className="mockDot" />
              <span className="mockTitle">Dashboard</span>
            </div>

            <div className="mockKpis">
              <div className="kpi">
                <div className="kpiLabel">Balance</div>
                <div className="kpiValue mint">$ 12,480</div>
              </div>
              <div className="kpi">
                <div className="kpiLabel">Spent</div>
                <div className="kpiValue warn">$ 1,920</div>
              </div>
              <div className="kpi">
                <div className="kpiLabel">Saved</div>
                <div className="kpiValue cyan">$ 680</div>
              </div>
            </div>

            <div className="mockLines">
              <div className="mockLine w80" />
              <div className="mockLine w95" />
              <div className="mockLine w60" />
            </div>

            <div className="mockBarRow">
              <div className="mockBar h35" />
              <div className="mockBar h65" />
              <div className="mockBar h50" />
              <div className="mockBar h85" />
              <div className="mockBar h55" />
            </div>

            <div className="mockFooterNote">
              Tip: keep expenses under <span className="warn">₹</span> budget.
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="welcomeFooter">
        <span>© {new Date().getFullYear()} ExpenseWise</span>
        <span className="dotSep">•</span>
        <span className="footerHint">Dark Mint Theme</span>
      </footer>
    </div>
  );
}