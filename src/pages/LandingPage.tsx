import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ── NAV ── */}
      <nav
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(10,15,30,0.7)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Link to="/">
          <Logo variant="mono-white" height={30} />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/docs"
            className="hidden text-sm font-medium text-white/60 transition hover:text-white sm:block"
          >
            Docs
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-white/60 transition hover:text-white"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-full px-5 py-2 text-sm font-semibold text-white transition"
            style={{ background: "#00BFA5" }}
          >
            Open Account
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        className="mesh-gradient relative overflow-hidden"
        style={{ background: "#0a0f1e", paddingTop: "65px" }}
      >
        <div className="mesh-layer" />
        <svg className="absolute inset-0 h-full w-full pointer-events-none" style={{ opacity: 0.12 }} preserveAspectRatio="none">
          <line x1="0" y1="30%" x2="100%" y2="55%" stroke="#00BFA5" strokeWidth="1" className="flow-line" />
          <line x1="0" y1="60%" x2="100%" y2="25%" stroke="#0077B6" strokeWidth="1" className="flow-line flow-line-2" />
          <line x1="20%" y1="0" x2="70%" y2="100%" stroke="#00BFA5" strokeWidth="0.5" className="flow-line flow-line-3" />
        </svg>

        {/* ── Main content ── */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">

          {/* ── Desktop: two-column grid ── */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-16">
            {/* Left text */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
                style={{ background: "rgba(0,191,165,0.15)", color: "#00BFA5", border: "1px solid rgba(0,191,165,0.25)" }}>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "#00BFA5" }} />
                Trusted by 10,000+ users worldwide
              </div>
              <h1 className="mb-6 text-5xl font-black leading-tight text-white">
                Banking that<br />
                <span style={{ background: "linear-gradient(135deg,#00BFA5,#0077B6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  flows with you.
                </span>
              </h1>
              <p className="mb-8 max-w-md text-lg leading-relaxed text-white/60">
                Open accounts, send money, manage cards, and track every transaction — all in one intelligent platform built for the modern era.
              </p>
              <div className="mb-12 flex flex-wrap gap-4">
                <Link to="/register" className="flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition"
                  style={{ background: "linear-gradient(135deg,#00BFA5,#0077B6)", boxShadow: "0 0 32px rgba(0,191,165,0.4)" }}>
                  Get started free
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
                <Link to="/docs" className="flex items-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold text-white transition"
                  style={{ borderColor: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.06)" }}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
                  </svg>
                  View docs
                </Link>
              </div>
              <div className="flex gap-8">
                {[{ val: "$2.4B+", label: "Processed monthly" }, { val: "99.9%", label: "Uptime SLA" }, { val: "256-bit", label: "Encryption" }].map((s, i) => (
                  <div key={s.val} className="flex items-center gap-8">
                    {i > 0 && <div style={{ width: 1, background: "rgba(255,255,255,0.1)", height: 36 }} />}
                    <div>
                      <p className="text-2xl font-bold text-white">{s.val}</p>
                      <p className="mt-0.5 text-xs text-white/40">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: floating cards */}
            <div className="relative flex items-center justify-center" style={{ height: 500 }}>
              <div className="float-card absolute w-80 overflow-hidden rounded-2xl"
                style={{ top: 30, right: 20, boxShadow: "0 32px 80px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ background: "#1B2F5B", padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>Total Balance</p>
                      <p style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>$12,450.00</p>
                    </div>
                    <div style={{ background: "rgba(0,191,165,0.15)", border: "1px solid rgba(0,191,165,0.3)", borderRadius: 20, padding: "3px 10px" }}>
                      <span style={{ color: "#00BFA5", fontSize: 10, fontWeight: 600 }}>▲ +2.4%</span>
                    </div>
                  </div>
                </div>
                <div style={{ background: "#131f3a", padding: "14px 16px" }}>
                  <svg width="100%" height="60" viewBox="0 0 280 60">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00BFA5" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#00BFA5" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,50 L40,38 L80,42 L120,20 L160,28 L200,12 L240,18 L280,8" stroke="#00BFA5" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M0,50 L40,38 L80,42 L120,20 L160,28 L200,12 L240,18 L280,8 L280,60 L0,60 Z" fill="url(#chartGrad)" />
                  </svg>
                  <div className="mt-2.5 flex flex-col gap-1.5">
                    {[
                      { icon: "↓", color: "#00BFA5", bg: "rgba(0,191,165,0.15)", label: "Teller Deposit", amount: "+$2,000", amtColor: "#00BFA5" },
                      { icon: "→", color: "#E53935", bg: "rgba(229,57,53,0.12)", label: "Transfer to Jane", amount: "-$500", amtColor: "#E53935" },
                    ].map((tx) => (
                      <div key={tx.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: tx.bg }}>
                            <span style={{ color: tx.color, fontSize: 12, fontWeight: 700 }}>{tx.icon}</span>
                          </div>
                          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>{tx.label}</span>
                        </div>
                        <span style={{ color: tx.amtColor, fontSize: 11, fontWeight: 700 }}>{tx.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="float-card-2 absolute overflow-hidden rounded-2xl"
                style={{ bottom: 40, left: 10, width: 220, padding: 18, background: "linear-gradient(135deg,#1B2F5B 0%,#0077B6 55%,#00BFA5 100%)", boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }}>
                <div className="flex items-start justify-between">
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 9, letterSpacing: "0.1em" }}>FUNDFLOWHUB</p>
                  <div className="flex">
                    <div className="h-5 w-5 rounded-full" style={{ background: "#E53935", opacity: 0.85 }} />
                    <div className="h-5 w-5 rounded-full" style={{ background: "#FFA000", opacity: 0.85, marginLeft: -8 }} />
                  </div>
                </div>
                <p style={{ color: "#fff", fontFamily: "monospace", fontSize: 13, letterSpacing: "0.2em", marginTop: 16, fontWeight: 700 }}>•••• •••• 9871</p>
                <div className="mt-3 flex justify-between">
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 8 }}>HOLDER</p>
                    <p style={{ color: "#fff", fontSize: 10, fontWeight: 600 }}>JOHN DOE</p>
                  </div>
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 8 }}>EXPIRES</p>
                    <p style={{ color: "#fff", fontSize: 10, fontWeight: 600 }}>04/28</p>
                  </div>
                </div>
              </div>
              <div className="notif-1 absolute" style={{ top: 10, left: 30, background: "#1B2F5B", border: "1px solid rgba(0,191,165,0.3)", borderRadius: 14, padding: "10px 14px", minWidth: 180, boxShadow: "0 12px 32px rgba(0,0,0,0.4)" }}>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 shrink-0 rounded-full" style={{ background: "#00BFA5" }} />
                  <div>
                    <p style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>Transfer Successful</p>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>$500 sent to Jane Doe</p>
                  </div>
                </div>
              </div>
              <div className="notif-2 absolute" style={{ bottom: 130, right: 0, background: "#1B2F5B", border: "1px solid rgba(0,119,182,0.4)", borderRadius: 14, padding: "10px 14px", minWidth: 170, boxShadow: "0 12px 32px rgba(0,0,0,0.4)" }}>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 shrink-0 rounded-full" style={{ background: "#0077B6" }} />
                  <div>
                    <p style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>OTP Verified ✓</p>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>Security check passed</p>
                  </div>
                </div>
              </div>
              <div className="notif-3 absolute" style={{ top: 200, left: 0, background: "#0d1a2e", border: "1px solid rgba(0,191,165,0.25)", borderRadius: 14, padding: "10px 14px", minWidth: 160, boxShadow: "0 12px 32px rgba(0,0,0,0.4)" }}>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 shrink-0 rounded-full" style={{ background: "#00BFA5" }} />
                  <div>
                    <p style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>Interest Credited</p>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>+$31.00 daily interest</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Mobile + Tablet: stacked, centered ── */}
          <div className="flex flex-col items-center py-16 text-center sm:py-20 lg:hidden">
            {/* Text */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ background: "rgba(0,191,165,0.15)", color: "#00BFA5", border: "1px solid rgba(0,191,165,0.25)" }}>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "#00BFA5" }} />
              Trusted by 10,000+ users worldwide
            </div>
            <h1 className="mb-5 text-4xl font-black leading-tight text-white sm:text-5xl">
              Banking that<br />
              <span style={{ background: "linear-gradient(135deg,#00BFA5,#0077B6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                flows with you.
              </span>
            </h1>
            <p className="mb-7 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
              Open accounts, send money, manage cards, and track every transaction — all in one intelligent platform built for the modern era.
            </p>
            <div className="mb-8 flex flex-wrap justify-center gap-3">
              <Link to="/register" className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#00BFA5,#0077B6)", boxShadow: "0 0 28px rgba(0,191,165,0.4)" }}>
                Get started free
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link to="/docs" className="flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold text-white"
                style={{ borderColor: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.06)" }}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
                </svg>
                View docs
              </Link>
            </div>
            {/* Stats row */}
            <div className="mb-10 flex gap-6 sm:gap-10">
              {[{ val: "$2.4B+", label: "Processed monthly" }, { val: "99.9%", label: "Uptime SLA" }, { val: "256-bit", label: "Encryption" }].map((s, i) => (
                <div key={s.val} className="flex items-center gap-6 sm:gap-10">
                  {i > 0 && <div style={{ width: 1, background: "rgba(255,255,255,0.1)", height: 32 }} />}
                  <div>
                    <p className="text-xl font-bold text-white sm:text-2xl">{s.val}</p>
                    <p className="mt-0.5 text-xs text-white/40">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Browser-framed product preview */}
            <div className="mx-auto w-full overflow-hidden rounded-2xl shadow-2xl" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3" style={{ background: "#111827", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#FF5F57" }} />
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#FEBC2E" }} />
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#28C840" }} />
                <div className="mx-3 flex h-5 flex-1 items-center justify-center rounded-md text-xs text-white/20"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  fundflowhub.edemaukabi.dev/dashboard
                </div>
              </div>
              {/* Dashboard content */}
              <div style={{ background: "#0d1425", padding: "16px" }}>
                {/* Balance + chart */}
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>Total Balance</p>
                    <p style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>$12,450.00</p>
                  </div>
                  <div style={{ background: "rgba(0,191,165,0.15)", border: "1px solid rgba(0,191,165,0.3)", borderRadius: 20, padding: "3px 10px" }}>
                    <span style={{ color: "#00BFA5", fontSize: 10, fontWeight: 600 }}>▲ +2.4%</span>
                  </div>
                </div>
                <svg width="100%" height="56" viewBox="0 0 600 60" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradMob" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00BFA5" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#00BFA5" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,55 L100,42 L200,46 L300,22 L400,30 L500,12 L600,6" stroke="#00BFA5" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M0,55 L100,42 L200,46 L300,22 L400,30 L500,12 L600,6 L600,60 L0,60 Z" fill="url(#chartGradMob)" />
                </svg>
                {/* Transactions */}
                <div className="mt-3 flex flex-col gap-2">
                  {[
                    { icon: "↓", color: "#00BFA5", bg: "rgba(0,191,165,0.15)", label: "Teller Deposit", amount: "+$2,000", amtColor: "#00BFA5" },
                    { icon: "→", color: "#E53935", bg: "rgba(229,57,53,0.12)", label: "Transfer to Jane", amount: "-$500", amtColor: "#E53935" },
                  ].map((tx) => (
                    <div key={tx.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg" style={{ background: tx.bg }}>
                          <span style={{ color: tx.color, fontSize: 11, fontWeight: 700 }}>{tx.icon}</span>
                        </div>
                        <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>{tx.label}</span>
                      </div>
                      <span style={{ color: tx.amtColor, fontSize: 11, fontWeight: 700 }}>{tx.amount}</span>
                    </div>
                  ))}
                </div>
                {/* Notification pills */}
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {[
                    { dot: "#00BFA5", title: "Transfer Successful", sub: "$500 → Jane Doe", border: "rgba(0,191,165,0.25)" },
                    { dot: "#0077B6", title: "OTP Verified ✓", sub: "Security passed", border: "rgba(0,119,182,0.3)" },
                    { dot: "#00BFA5", title: "Interest Credited", sub: "+$31.00 today", border: "rgba(0,191,165,0.2)" },
                  ].map((n) => (
                    <div key={n.title} className="flex items-center gap-2 rounded-xl px-3 py-2"
                      style={{ background: "#1B2F5B", border: `1px solid ${n.border}` }}>
                      <div className="h-2 w-2 shrink-0 rounded-full" style={{ background: n.dot }} />
                      <div>
                        <p style={{ color: "#fff", fontSize: 10, fontWeight: 600 }}>{n.title}</p>
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>{n.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>{/* max-w-7xl */}

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
          <p className="text-xs font-medium text-white/30">Scroll to explore</p>
          <div className="animate-pulse" style={{ width: 1, height: 40, background: "linear-gradient(to bottom,rgba(255,255,255,0.3),transparent)" }} />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ background: "#0b1220", padding: "96px 32px", position: "relative", borderTop: "1px solid rgba(0,191,165,0.08)" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(0,191,165,0.1) 0%, transparent 55%)" }} />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: "#00BFA5" }}>Everything you need</p>
            <h2 className="text-4xl font-black text-white">Built for every role in banking</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/50">
              From customers checking balances to branch managers overseeing operations — FundFlowHub serves everyone on one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="feat-card p-6">
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: f.iconBg, border: `1px solid ${f.iconBorder}` }}
                >
                  <svg className="h-6 w-6" style={{ color: f.iconColor }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d={f.iconPath} />
                  </svg>
                </div>
                <h3 className="mb-2 font-bold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-white/50">{f.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {f.tags.map((t) => (
                    <span key={t.label} className="rounded-full px-2 py-1 text-xs" style={{ background: t.bg, color: t.color }}>
                      {t.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ background: "#060b16", padding: "96px 32px", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: "#00BFA5" }}>Simple process</p>
            <h2 className="text-4xl font-black text-white">Send money in 3 steps</h2>
          </div>

          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            {STEPS.map((step, i) => (
              <>
                <div key={step.label} className="flex-1 text-center">
                  <div
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black text-white"
                    style={{ background: step.gradient }}
                  >
                    {i + 1}
                  </div>
                  <h3 className="mb-2 font-bold text-white">{step.label}</h3>
                  <p className="text-sm text-white/40">{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div key={`line-${i}`} className="step-line hidden sm:block" />
                )}
              </>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY ── */}
      <section id="security" style={{ background: "#0d1525", padding: "96px 32px", borderTop: "1px solid rgba(0,119,182,0.12)", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 100% 50%, rgba(0,119,182,0.08) 0%, transparent 60%)" }} />
        <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: "#00BFA5" }}>Bank-grade security</p>
            <h2 className="mb-8 text-4xl font-black text-white">Your money is safe. Always.</h2>
            <div className="space-y-6">
              {SECURITY_POINTS.map((s) => (
                <div key={s.title} className="flex gap-4">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: "rgba(0,191,165,0.15)" }}>
                    <svg className="h-4 w-4" style={{ color: "#00BFA5" }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{s.title}</p>
                    <p className="mt-0.5 text-sm text-white/40">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shield visual */}
          <div className="relative flex items-center justify-center" style={{ height: 280 }}>
            {[180, 120, 70].map((size, i) => (
              <div
                key={size}
                className="absolute flex items-center justify-center rounded-full"
                style={{
                  width: size,
                  height: size,
                  background: `rgba(0,191,165,${0.06 + i * 0.04})`,
                  border: `1px solid rgba(0,191,165,${0.2 + i * 0.15})`,
                }}
              >
                {i === 2 && (
                  <svg className="h-8 w-8" style={{ color: "#00BFA5" }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                )}
              </div>
            ))}
            {[
              { label: "256-bit TLS", color: "#00BFA5", bg: "rgba(0,191,165,0.1)", border: "rgba(0,191,165,0.3)", style: { top: 10, right: 30 } },
              { label: "PBKDF2 Hashing", color: "#81D4FA", bg: "rgba(0,119,182,0.1)", border: "rgba(0,119,182,0.3)", style: { bottom: 20, right: 20 } },
              { label: "CSRF Protected", color: "rgba(255,255,255,0.5)", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)", style: { top: 60, left: 10 } },
            ].map((b) => (
              <div
                key={b.label}
                className="absolute rounded-xl px-3 py-1.5"
                style={{ background: b.bg, border: `1px solid ${b.border}`, ...b.style }}
              >
                <p style={{ color: b.color, fontSize: 10, fontWeight: 600 }}>{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOCS PREVIEW ── */}
      <section style={{ background: "#080e1c", padding: "96px 32px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            {/* Left: copy */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: "#00BFA5" }}>Developer-friendly</p>
              <h2 className="mb-5 text-4xl font-black text-white">A clean API you'll actually enjoy.</h2>
              <p className="mb-8 text-white/50 leading-relaxed">
                Full REST API documentation with Swagger UI. httpOnly JWT cookies, paginated responses, and consistent error envelopes — built with DRF Spectacular.
              </p>
              <ul className="mb-8 space-y-3">
                {[
                  "JWT in httpOnly cookies — zero XSS exposure",
                  "3-step transfer flow with pending-token model",
                  "Consistent error envelope on every endpoint",
                  "Paginated lists with search & filter support",
                  "Role-scoped endpoints — customer, teller, staff",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-white/60">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "#00BFA5" }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition"
                style={{ border: "1px solid rgba(0,191,165,0.4)", background: "rgba(0,191,165,0.08)" }}
              >
                Read the docs
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Right: code block */}
            <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3" style={{ background: "#111827", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="h-3 w-3 rounded-full" style={{ background: "#E53935" }} />
                <div className="h-3 w-3 rounded-full" style={{ background: "#FFA000" }} />
                <div className="h-3 w-3 rounded-full" style={{ background: "#00BFA5" }} />
                <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, marginLeft: 8 }}>POST /api/v1/accounts/transfer/initiate/</span>
              </div>
              <pre className="overflow-x-auto px-5 py-5 text-xs leading-relaxed" style={{ background: "#0d1117", color: "#c9d1d9", fontFamily: "monospace" }}>
                <code>{`{
  "sender_account": "uuid",
  "receiver_account_number": "FFH9876543210",
  "amount": "250.00",
  "description": "Rent"
}

→ 200 OK
{
  "token": "uuid",
  "receiver_name": "Jane Doe"
}

# Step 2 — security question
POST /transfer/verify/
{ "token": "uuid", "security_answer": "Blue" }

# Step 3 — OTP confirm
POST /transfer/confirm/
{ "token": "uuid", "otp": "482910" }
→ { "message": "Transfer successful" }`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="px-8 py-24 text-center"
        style={{ background: "linear-gradient(160deg,#0a1628 0%,#1B2F5B 60%,#0d2040 100%)", borderTop: "1px solid rgba(0,191,165,0.15)" }}
      >
        <h2 className="mb-4 text-4xl font-black text-white">
          Ready to take control
          <br />
          of your finances?
        </h2>
        <p className="mx-auto mb-8 max-w-md text-white/50">
          Join thousands of customers banking smarter with FundFlowHub today.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold text-white"
          style={{
            background: "linear-gradient(135deg,#00BFA5,#0077B6)",
            boxShadow: "0 0 40px rgba(0,191,165,0.35)",
          }}
        >
          Open your account
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="px-8 py-8 text-center text-sm"
        style={{ background: "#070d1a", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p style={{ color: "rgba(255,255,255,0.25)" }}>
          © {new Date().getFullYear()} FundFlowHub — Simulated banking environment
        </p>
        <p className="mt-2 text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>
          Built by{" "}
          <a
            href="https://edemaukabi.dev"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgba(255,255,255,0.3)" }}
            className="transition hover:text-[#00BFA5]"
          >
            Edema Ukabi
          </a>
        </p>
      </footer>
    </div>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    title: "Multi-Account Banking",
    description: "Manage savings and checking accounts with real-time balances, transaction history, and daily interest on savings.",
    iconPath: "M1 4h22v16H1zM1 10h22",
    iconColor: "#00BFA5",
    iconBg: "rgba(0,191,165,0.15)",
    iconBorder: "rgba(0,191,165,0.3)",
    tags: [
      { label: "Savings", bg: "rgba(0,191,165,0.1)", color: "#00BFA5" },
      { label: "Checking", bg: "rgba(0,119,182,0.1)", color: "#81D4FA" },
      { label: "4.5% APY", bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" },
    ],
  },
  {
    title: "3-Layer Transaction Security",
    description: "Every transfer and withdrawal passes through initiation, security question verification, and OTP confirmation.",
    iconPath: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    iconColor: "#81D4FA",
    iconBg: "rgba(0,119,182,0.15)",
    iconBorder: "rgba(0,119,182,0.3)",
    tags: [
      { label: "OTP Email", bg: "rgba(0,119,182,0.1)", color: "#81D4FA" },
      { label: "HMAC CVV", bg: "rgba(0,191,165,0.1)", color: "#00BFA5" },
      { label: "httpOnly JWT", bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" },
    ],
  },
  {
    title: "Role-based Access Control",
    description: "Customer, Teller, Account Executive, and Branch Manager roles each have precisely scoped permissions and dashboards.",
    iconPath: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    iconColor: "#FFD54F",
    iconBg: "rgba(255,160,0,0.12)",
    iconBorder: "rgba(255,160,0,0.25)",
    tags: [
      { label: "4 roles", bg: "rgba(255,160,0,0.1)", color: "#FFD54F" },
      { label: "JWT gated", bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" },
    ],
  },
  {
    title: "Virtual Card Management",
    description: "Instantly generate virtual cards with HMAC-secured CVV, freeze/unfreeze, and real-time balance visibility.",
    iconPath: "M2 5h20v14H2zM2 10h20",
    iconColor: "#CE93D8",
    iconBg: "rgba(156,39,176,0.12)",
    iconBorder: "rgba(156,39,176,0.25)",
    tags: [
      { label: "Virtual", bg: "rgba(156,39,176,0.1)", color: "#CE93D8" },
      { label: "HMAC CVV", bg: "rgba(0,191,165,0.1)", color: "#00BFA5" },
    ],
  },
  {
    title: "Real-time Transaction Feeds",
    description: "Filter, paginate, and export transaction statements as PDF. Atomic database writes guarantee zero data corruption.",
    iconPath: "M22 12h-4l-3 9L9 3l-3 9H2",
    iconColor: "#EF9A9A",
    iconBg: "rgba(229,57,53,0.12)",
    iconBorder: "rgba(229,57,53,0.25)",
    tags: [
      { label: "PDF Export", bg: "rgba(229,57,53,0.1)", color: "#EF9A9A" },
      { label: "Atomic writes", bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" },
    ],
  },
  {
    title: "Automated Daily Interest",
    description: "Celery Beat applies tiered savings interest every 24 hours. Your money grows while you sleep — automatically.",
    iconPath: "M12 2a10 10 0 100 20A10 10 0 0012 2zM12 6v6l4 2",
    iconColor: "#00BFA5",
    iconBg: "rgba(0,191,165,0.15)",
    iconBorder: "rgba(0,191,165,0.3)",
    tags: [
      { label: "Celery Beat", bg: "rgba(0,191,165,0.1)", color: "#00BFA5" },
      { label: "Tiered rates", bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" },
    ],
  },
];

const STEPS = [
  { label: "Enter details", desc: "Select account, enter amount and recipient account number.", gradient: "linear-gradient(135deg,#1B2F5B,#0077B6)" },
  { label: "Verify identity", desc: "Answer your security question to prove it's really you.", gradient: "linear-gradient(135deg,#0077B6,#00BFA5)" },
  { label: "Confirm with OTP", desc: "Enter the 6-digit code emailed to you. Transfer executes atomically.", gradient: "linear-gradient(135deg,#00BFA5,#1B2F5B)" },
];

const SECURITY_POINTS = [
  { title: "httpOnly JWT cookies", desc: "Tokens are invisible to JavaScript — XSS attacks cannot steal your session." },
  { title: "HMAC-SHA256 CVV generation", desc: "CVVs are never stored — computed on-demand from a secret key." },
  { title: "Brute-force lockout", desc: "3 failed login attempts triggers a time-based lockout with email alert." },
  { title: "Atomic financial operations", desc: "Every balance change is wrapped in a database transaction — no partial writes possible." },
];
