import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronRight, ExternalLink, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import Logo from "@/components/Logo";

// ─── Nav structure ────────────────────────────────────────────────────────────

interface NavItem {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Getting Started",
    items: [
      { id: "gs-overview", label: "Overview" },
      { id: "gs-architecture", label: "Architecture" },
      { id: "gs-test-mode", label: "Test vs Live Mode" },
      { id: "gs-roles", label: "Roles & Permissions" },
    ],
  },
  {
    label: "User Guide",
    items: [
      { id: "ug-create-account", label: "Creating an Account" },
      { id: "ug-kyc", label: "KYC Verification" },
      { id: "ug-transfer", label: "Making a Transfer" },
      { id: "ug-withdrawal", label: "Making a Withdrawal" },
      { id: "ug-cards", label: "Virtual Cards" },
    ],
  },
  {
    label: "API Reference",
    items: [
      { id: "api-base-url", label: "Base URL" },
      { id: "api-auth", label: "Authentication" },
      {
        id: "api-endpoints",
        label: "Endpoints",
        children: [
          { id: "ep-auth", label: "Auth" },
          { id: "ep-accounts", label: "Accounts" },
          { id: "ep-transactions", label: "Transactions" },
          { id: "ep-transfer", label: "Transfers" },
          { id: "ep-withdrawal", label: "Withdrawals" },
          { id: "ep-cards", label: "Cards" },
          { id: "ep-profiles", label: "Profiles" },
          { id: "ep-teller", label: "Teller (Staff)" },
          { id: "ep-kyc", label: "KYC (Staff)" },
        ],
      },
      { id: "api-errors", label: "Error Format" },
      { id: "api-pagination", label: "Pagination" },
    ],
  },
];

const ALL_IDS = NAV_SECTIONS.flatMap((s) =>
  s.items.flatMap((item) => [item.id, ...(item.children?.map((c) => c.id) ?? [])]),
);

// ─── Small primitives ─────────────────────────────────────────────────────────

function Badge({ method }: { method: string }) {
  const colours: Record<string, string> = {
    GET: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
    POST: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    PATCH: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    PUT: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    DELETE: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
  };
  return (
    <span
      className={cn(
        "inline-block rounded px-1.5 py-0.5 font-mono text-xs font-semibold",
        colours[method] ?? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
      )}
    >
      {method}
    </span>
  );
}

function Code({ children, className }: { children: string; className?: string }) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-lg bg-[#0d1117] p-4 text-sm leading-relaxed text-gray-300 ring-1 ring-black/10 dark:ring-white/10",
        className,
      )}
    >
      <code>{children}</code>
    </pre>
  );
}

function InlineCode({ children }: { children: string }) {
  return (
    <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-700 dark:bg-white/10 dark:text-gray-300">
      {children}
    </code>
  );
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="mb-4 mt-12 scroll-mt-24 text-xl font-semibold text-gray-900 dark:text-white first:mt-0"
    >
      {children}
    </h2>
  );
}

function H3({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h3
      id={id}
      className="mb-3 mt-8 scroll-mt-24 text-base font-semibold text-gray-800 dark:text-gray-200"
    >
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 leading-7 text-gray-600 dark:text-gray-400">{children}</p>;
}

function StepList({ steps }: { steps: { n: string | number; title: string; body: React.ReactNode }[] }) {
  return (
    <ol className="mb-6 space-y-4">
      {steps.map((s) => (
        <li key={String(s.n)} className="flex gap-4">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#00BFA5]/10 text-xs font-bold text-[#00BFA5]">
            {s.n}
          </div>
          <div className="pt-0.5">
            <p className="mb-1 text-sm font-semibold text-gray-800 dark:text-gray-200">{s.title}</p>
            <div className="text-sm text-gray-500 dark:text-gray-400">{s.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

interface EndpointRowProps {
  method: string;
  path: string;
  auth: string;
  description: string;
}
function EndpointRow({ method, path, auth, description }: EndpointRowProps) {
  return (
    <tr className="border-b border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5">
      <td className="py-3 pr-4">
        <Badge method={method} />
      </td>
      <td className="py-3 pr-4 font-mono text-xs text-gray-700 dark:text-gray-300">{path}</td>
      <td className="py-3 pr-4 text-xs text-gray-500 dark:text-gray-400">{auth}</td>
      <td className="py-3 text-xs text-gray-500 dark:text-gray-400">{description}</td>
    </tr>
  );
}

// ─── Active section tracker ───────────────────────────────────────────────────

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids]);

  return active;
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function DocsSidebar({
  active,
  open,
  onClose,
}: {
  active: string;
  open: boolean;
  onClose: () => void;
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-gray-200 bg-[#F6F8FA] transition-transform duration-200 dark:border-white/10 dark:bg-[#0d1117]",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between border-b border-gray-200 px-5 dark:border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <Logo auto height={22} />
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">Docs</span>
          </Link>
          <button onClick={onClose} className="text-gray-400 lg:hidden hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 text-sm">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-5">
              <p className="mb-1.5 px-3 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                {section.label}
              </p>
              {section.items.map((item) => (
                <div key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={onClose}
                    className={cn(
                      "flex items-center rounded-md px-3 py-1.5 font-medium transition-colors",
                      active === item.id
                        ? "bg-[#00BFA5]/10 text-[#00BFA5]"
                        : "text-gray-600 hover:bg-gray-200/60 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white",
                    )}
                  >
                    {item.label}
                  </a>
                  {item.children?.map((child) => (
                    <a
                      key={child.id}
                      href={`#${child.id}`}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-1.5 rounded-md py-1 pl-7 pr-3 text-xs transition-colors",
                        active === child.id
                          ? "text-[#00BFA5]"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300",
                      )}
                    >
                      <ChevronRight size={10} />
                      {child.label}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 px-5 py-3 dark:border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 dark:text-gray-600">API v1 · FundFlowHub</span>
            <button
              onClick={toggleTheme}
              className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-300 dark:text-gray-700">
            Built by{" "}
            <a
              href="https://edemaukabi.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 transition hover:text-[#00BFA5] dark:text-gray-600 dark:hover:text-[#00BFA5]"
            >
              Edema Ukabi
            </a>
          </p>
        </div>
      </aside>
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const active = useActiveSection(ALL_IDS);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-[#0d1117] dark:text-white">
      {/* Mobile topbar */}
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-gray-200 bg-white/90 px-4 backdrop-blur dark:border-white/10 dark:bg-[#0d1117]/90 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <span className="flex-1 text-sm font-bold">
          FundFlow<span className="text-[#00BFA5]">Hub</span>{" "}
          <span className="font-normal text-gray-400">Docs</span>
        </span>
        <button
          onClick={toggleTheme}
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <DocsSidebar
        active={active}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-3xl px-6 py-12">

          {/* ══════════════════════════════════════════
              GETTING STARTED
          ══════════════════════════════════════════ */}

          {/* ── Overview ── */}
          <H2 id="gs-overview">Overview</H2>
          <P>
            FundFlowHub is a secure, multi-role banking platform with savings and checking accounts,
            real-time transfers, virtual cards, and a full staff management layer. This documentation
            covers both the <strong className="text-gray-800 dark:text-gray-200">web app</strong> (User Guide) and the{" "}
            <strong className="text-gray-800 dark:text-gray-200">REST API</strong> (API Reference).
          </P>
          <P>
            The API is versioned under <InlineCode>/api/v1/</InlineCode> and uses{" "}
            <strong className="text-gray-800 dark:text-gray-200">JSON Web Tokens (JWT)</strong> stored in{" "}
            <InlineCode>httpOnly</InlineCode> cookies — tokens are never exposed to JavaScript. All
            requests must include <InlineCode>credentials: "include"</InlineCode> (or{" "}
            <InlineCode>withCredentials: true</InlineCode> in Axios).
          </P>

          {/* ── Architecture ── */}
          <H2 id="gs-architecture">Architecture</H2>
          <P>
            FundFlowHub runs as a <strong className="text-gray-800 dark:text-gray-200">7-container Docker Compose stack</strong> on a
            self-managed VPS, reverse-proxied by Nginx with Let's Encrypt SSL. The diagram below shows how the
            services connect.
          </P>
          <div className="mb-4 overflow-hidden rounded-xl border border-white/10 bg-[#060a14]">
            <img
              src="/system-architecture.png"
              alt="FundFlowHub system architecture diagram"
              className="w-full"
            />
          </div>
          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Service 1 — Nginx", desc: "Reverse proxy, SSL termination, load balancer" },
              { name: "Service 2 — Django API", desc: "Core services: auth, accounts, KYC, cards, profiles" },
              { name: "Service 3 — PostgreSQL", desc: "Primary data store + automated backup dumps" },
              { name: "Service 4 — Async Workers", desc: "Celery worker, Celery Beat scheduler, Flower monitor" },
              { name: "Service 5 — Data Layer", desc: "Redis (cache + broker) + RabbitMQ (message queue)" },
              { name: "Support Services", desc: "Cloudinary (media/KYC docs) + Mailpit (local email)" },
            ].map((s) => (
              <div
                key={s.name}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-white/10 dark:bg-white/5"
              >
                <p className="mb-0.5 text-xs font-semibold text-gray-800 dark:text-gray-200">{s.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* ── Test vs Live ── */}
          <H2 id="gs-test-mode">Test vs Live Mode</H2>
          <P>
            The dashboard sidebar lets you switch between <strong className="text-amber-600 dark:text-amber-400">Test Mode</strong> and{" "}
            <strong className="text-[#00BFA5]">Live Mode</strong>. Use Test Mode while exploring — no real data is affected.
          </P>
          <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-white/10 dark:ring-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  {["", "Test Mode", "Live Mode"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {[
                  ["OTP", "Always 123456 — shown as a hint in the UI", "Real 6-digit code sent to your email"],
                  ["Email backend", "Console (no email sent)", "SMTP — real emails delivered"],
                  ["Topbar badge", "Amber TEST MODE badge", "Teal LIVE (or red LIVE — SETUP REQUIRED)"],
                  ["Data", "Pre-seeded demo data", "Real user data — all writes persist"],
                  ["KYC requirement", "Not enforced", "Required to unlock Live mode"],
                ].map(([label, test, live]) => (
                  <tr key={label}>
                    <td className="px-4 py-3 text-xs font-medium text-gray-700 dark:text-gray-300">{label}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{test}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{live}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Roles ── */}
          <H2 id="gs-roles">Roles & Permissions</H2>
          <P>
            Every user has a role set at account creation. Role is returned in{" "}
            <InlineCode>GET /auth/users/me/</InlineCode> and controls which sidebar
            items and API endpoints are accessible.
          </P>
          <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  {["Role", "Dashboard access"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {[
                  ["customer", "Own accounts, transactions, transfers, withdrawals, cards, settings"],
                  ["teller", "All customer access + deposit panel"],
                  ["account_executive", "All teller access + KYC review + customers list"],
                  ["branch_manager", "Full access — all roles + reports dashboard + KPIs"],
                ].map(([role, access]) => (
                  <tr key={role}>
                    <td className="px-4 py-3 font-mono text-xs font-medium text-gray-700 dark:text-gray-200">{role}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{access}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ══════════════════════════════════════════
              USER GUIDE
          ══════════════════════════════════════════ */}

          {/* ── Create Account ── */}
          <H2 id="ug-create-account">Creating an Account</H2>
          <P>
            Registration is open to all visitors. No invitation required.
          </P>
          <StepList
            steps={[
              {
                n: 1,
                title: "Go to the registration page",
                body: (
                  <>
                    Visit <Link to="/register" className="text-[#00BFA5] hover:underline">/register</Link> or click{" "}
                    <strong>Open Account</strong> in the navigation bar.
                  </>
                ),
              },
              {
                n: 2,
                title: "Fill in your personal details",
                body: "Enter your first name, last name, email address, username (3–12 characters), and ID number.",
              },
              {
                n: 3,
                title: "Choose a security question",
                body: "Pick one of the four security questions and provide your answer. This answer is required to authorise every transfer — keep it memorable.",
              },
              {
                n: 4,
                title: "Set a password",
                body: "Minimum 8 characters. Confirm it in the repeat field. Click Create account.",
              },
              {
                n: 5,
                title: "Verify your OTP",
                body: "After submitting credentials at login, a 6-digit OTP is emailed to you. In Test Mode it is always 123456 and shown on-screen.",
              },
              {
                n: 6,
                title: "You're in",
                body: "Your dashboard is ready. Switch to Test Mode to explore with demo data, or complete KYC to unlock Live mode.",
              },
            ]}
          />

          {/* ── KYC ── */}
          <H2 id="ug-kyc">KYC Verification</H2>
          <P>
            KYC (Know Your Customer) is required before using Live mode. It involves uploading identity documents for manual review by an Account Executive or Branch Manager.
          </P>
          <StepList
            steps={[
              {
                n: 1,
                title: "Open Settings → Documents & KYC",
                body: "From the sidebar click Settings, then switch to the Documents & KYC tab.",
              },
              {
                n: 2,
                title: "Upload your ID / Passport photo",
                body: "Click the upload area and select a clear photo of your government-issued ID or passport.",
              },
              {
                n: 3,
                title: "Upload your signature photo",
                body: "A clear image of your handwritten signature on a white background.",
              },
              {
                n: 4,
                title: "Wait for review",
                body: "Status moves: pending → under_review → verified (or rejected with notes). You'll receive an email when the decision is made.",
              },
              {
                n: 5,
                title: "Live mode unlocked",
                body: "Once verified, the Live mode toggle in the sidebar becomes available. The topbar shows a teal LIVE badge.",
              },
            ]}
          />

          {/* ── Transfer ── */}
          <H2 id="ug-transfer">Making a Transfer</H2>
          <P>
            Transfers go through three verification steps to prevent unauthorised movements.
          </P>
          <StepList
            steps={[
              {
                n: 1,
                title: "Dashboard → Transfer",
                body: "Select the source account, enter the recipient's account number, amount, and an optional description. Click Continue.",
              },
              {
                n: 2,
                title: "Verify your security question",
                body: "The answer you provided during registration. This proves the transfer was initiated by you.",
              },
              {
                n: 3,
                title: "Enter your OTP",
                body: "A 6-digit code is sent to your registered email. In Test Mode it's always 123456. Enter it and confirm. The transfer executes atomically.",
              },
            ]}
          />
          <P>
            Both the sender and receiver receive an email confirmation. The transaction appears immediately in both accounts' history.
          </P>

          {/* ── Withdrawal ── */}
          <H2 id="ug-withdrawal">Making a Withdrawal</H2>
          <P>
            Withdrawals are a 2-step process — no OTP required, but username confirmation is needed.
          </P>
          <StepList
            steps={[
              {
                n: 1,
                title: "Dashboard → Withdrawal",
                body: "Select the account to debit and enter the withdrawal amount. Click Continue.",
              },
              {
                n: 2,
                title: "Confirm with your username",
                body: "Enter your username exactly as registered. This is your second-factor confirmation. Click Confirm — funds are debited immediately.",
              },
            ]}
          />

          {/* ── Cards ── */}
          <H2 id="ug-cards">Virtual Cards</H2>
          <P>
            Virtual cards are linked to a bank account and can be used for online payments. CVVs are computed on-demand and never stored in the database.
          </P>
          <StepList
            steps={[
              {
                n: "→",
                title: "Create a card",
                body: "Dashboard → Virtual Cards → New Card. Choose a linked account. A 16-digit card number and expiry date are generated instantly.",
              },
              {
                n: "→",
                title: "Top up balance",
                body: "Click Top Up on the card. Enter the amount — it is debited from the linked bank account and added to the card balance.",
              },
              {
                n: "→",
                title: "Reveal CVV",
                body: "Click Reveal CVV. The 3-digit code is computed from HMAC-SHA256 and displayed for 10 seconds. It is never stored.",
              },
              {
                n: "→",
                title: "Freeze / unfreeze",
                body: "Toggle the Frozen state at any time. A frozen card cannot be topped up or used for payments.",
              },
              {
                n: "→",
                title: "Delete a card",
                body: "A card can only be deleted when its balance is zero. Transfer the balance to your bank account first.",
              },
            ]}
          />

          {/* ══════════════════════════════════════════
              API REFERENCE
          ══════════════════════════════════════════ */}

          {/* ── Base URL ── */}
          <H2 id="api-base-url">Base URL</H2>
          <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 dark:border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Environment</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400">URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                <tr>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Local</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">http://localhost:8001/api/v1</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Production</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">https://fundflowhub-api.edemaukabi.dev/api/v1</td>
                </tr>
              </tbody>
            </table>
          </div>
          <P>
            Interactive API documentation (Swagger UI) is available at{" "}
            <a
              href="https://fundflowhub-api.edemaukabi.dev/api/v1/schema/swagger-ui/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#00BFA5] hover:underline"
            >
              /api/v1/schema/swagger-ui/
              <ExternalLink size={12} />
            </a>
            .
          </P>

          {/* ── Authentication ── */}
          <H2 id="api-auth">Authentication</H2>
          <P>
            Authentication uses a two-step flow: email/password login → OTP verification. On
            successful OTP verification, the server sets two httpOnly cookies:{" "}
            <InlineCode>access</InlineCode> (5 min TTL) and{" "}
            <InlineCode>refresh</InlineCode> (7 day TTL). The frontend never reads these cookies
            directly.
          </P>
          <H3>Login flow</H3>
          <Code>{`# Step 1 — submit credentials
POST /auth/login/
{ "email": "user@example.com", "password": "secret" }

→ 200 { "email": "user@example.com", "message": "OTP sent to your email" }

# Step 2 — verify OTP
POST /auth/verify-otp/
{ "otp": "123456" }

→ 200 { "message": "Login successful" }
   Set-Cookie: access=...; HttpOnly; SameSite=Lax
   Set-Cookie: refresh=...; HttpOnly; SameSite=Lax`}</Code>

          <H3>Token refresh</H3>
          <P>
            The Axios interceptor automatically calls{" "}
            <InlineCode>POST /auth/token/refresh/</InlineCode> when a 401 is received, then
            retries the original request. If refresh also fails the user is redirected to{" "}
            <InlineCode>/login</InlineCode>.
          </P>
          <Code>{`POST /auth/token/refresh/
(no body — reads refresh cookie automatically)

→ 200 — new access cookie set
→ 401 — refresh expired, user must log in again`}</Code>

          {/* ── Endpoints ── */}
          <H2 id="api-endpoints">Endpoints</H2>

          <H3 id="ep-auth">Auth</H3>
          <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  {["Method", "Path", "Auth", "Description"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <EndpointRow method="POST" path="/auth/users/" auth="Public" description="Register a new user" />
                <EndpointRow method="POST" path="/auth/login/" auth="Public" description="Step 1 — submit credentials, receive OTP by email" />
                <EndpointRow method="POST" path="/auth/verify-otp/" auth="Public" description="Step 2 — verify OTP, receive JWT cookies" />
                <EndpointRow method="POST" path="/auth/logout/" auth="Authenticated" description="Clear JWT cookies" />
                <EndpointRow method="GET" path="/auth/users/me/" auth="Authenticated" description="Current user profile + role" />
                <EndpointRow method="POST" path="/auth/token/refresh/" auth="Cookie" description="Refresh access token" />
              </tbody>
            </table>
          </div>

          <H3 id="ep-accounts">Accounts</H3>
          <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  {["Method", "Path", "Auth", "Description"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <EndpointRow method="GET" path="/accounts/" auth="Authenticated" description="List the current user's bank accounts" />
                <EndpointRow method="GET" path="/accounts/transactions/" auth="Authenticated" description="Paginated transaction history (filter by account, date)" />
                <EndpointRow method="GET" path="/accounts/statement/pdf/" auth="Authenticated" description="Download PDF statement" />
              </tbody>
            </table>
          </div>

          <H3>Account object</H3>
          <Code>{`{
  "id": "uuid",
  "account_number": "FFH1234567890",
  "account_type": "savings" | "checking",
  "balance": "5000.00",
  "currency": "us_dollar" | "pound_sterling" | "kenya_shilling",
  "is_active": true,
  "kyc_verified": true,
  "created_at": "2024-01-15T10:30:00Z"
}`}</Code>

          <H3 id="ep-transactions">Transactions</H3>
          <P>
            All transaction list responses are paginated. Include{" "}
            <InlineCode>?page=2</InlineCode> to advance pages.
          </P>
          <Code>{`GET /accounts/transactions/?account=<uuid>&page=1

→ {
    "count": 142,
    "next": "http://.../transactions/?page=2",
    "previous": null,
    "results": [
      {
        "id": "uuid",
        "transaction_type": "deposit" | "withdrawal" | "transfer_in" | "transfer_out",
        "amount": "250.00",
        "description": "Deposit by teller",
        "created_at": "2024-06-01T09:00:00Z"
      }
    ]
  }`}</Code>

          <H3 id="ep-transfer">Transfers (3-step)</H3>
          <P>
            Transfers use a pending-token flow. Each step receives the token from the previous step
            and returns it (or a new one) to pass forward.
          </P>
          <Code>{`# Step 1 — initiate
POST /accounts/transfer/initiate/
{
  "sender_account": "uuid",
  "receiver_account_number": "FFH9876543210",
  "amount": "100.00",
  "description": "Rent"
}
→ { "token": "uuid", "receiver_name": "Bob Jones" }

# Step 2 — verify security question
POST /accounts/transfer/verify/
{
  "token": "uuid",
  "security_answer": "Fluffy"
}
→ { "token": "uuid", "message": "OTP sent to your email" }

# Step 3 — confirm with OTP
POST /accounts/transfer/confirm/
{
  "token": "uuid",
  "otp": "482910"
}
→ { "message": "Transfer successful" }`}</Code>

          <H3 id="ep-withdrawal">Withdrawals (2-step)</H3>
          <Code>{`# Step 1 — initiate
POST /accounts/withdrawal/initiate/
{
  "account": "uuid",
  "amount": "500.00"
}
→ { "token": "uuid" }

# Step 2 — confirm with username
POST /accounts/withdrawal/confirm/
{
  "token": "uuid",
  "username": "alice_smith"
}
→ { "message": "Withdrawal successful" }`}</Code>

          <H3 id="ep-cards">Cards</H3>
          <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  {["Method", "Path", "Auth", "Description"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <EndpointRow method="GET" path="/cards/virtual-cards/" auth="Authenticated" description="List user's virtual cards (CVV omitted)" />
                <EndpointRow method="POST" path="/cards/virtual-cards/" auth="Authenticated" description="Create a virtual card linked to an account" />
                <EndpointRow method="POST" path="/cards/virtual-cards/{id}/top-up/" auth="Authenticated" description="Top up card balance from linked account" />
                <EndpointRow method="GET" path="/cards/virtual-cards/{id}/reveal-cvv/" auth="Authenticated" description="Reveal CVV (computed on-demand, not stored)" />
                <EndpointRow method="PATCH" path="/cards/virtual-cards/{id}/" auth="Authenticated" description="Freeze or unfreeze a card (is_frozen)" />
                <EndpointRow method="DELETE" path="/cards/virtual-cards/{id}/" auth="Authenticated" description="Delete card (balance must be zero)" />
              </tbody>
            </table>
          </div>

          <H3 id="ep-profiles">Profiles</H3>
          <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  {["Method", "Path", "Auth", "Description"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <EndpointRow method="GET" path="/profiles/" auth="Authenticated" description="Current user's profile" />
                <EndpointRow method="PATCH" path="/profiles/" auth="Authenticated" description="Update profile (multipart/form-data for photo)" />
                <EndpointRow method="GET" path="/profiles/next-of-kin/" auth="Authenticated" description="List next-of-kin records" />
                <EndpointRow method="POST" path="/profiles/next-of-kin/" auth="Authenticated" description="Add a next-of-kin record" />
                <EndpointRow method="DELETE" path="/profiles/next-of-kin/{id}/" auth="Authenticated" description="Remove a next-of-kin record" />
                <EndpointRow method="GET" path="/profiles/all/" auth="AE / BM" description="Paginated list of all customer profiles (search by name or ID)" />
              </tbody>
            </table>
          </div>

          <H3 id="ep-teller">Teller (Staff)</H3>
          <Code>{`# Look up a customer account before depositing
GET /accounts/lookup/?account_number=FFH1234567890
→ {
    "account_number": "FFH1234567890",
    "account_type": "savings",
    "balance": "3200.00",
    "full_name": "Alice Smith",
    ...
  }

# Deposit
POST /accounts/deposit/
{
  "account_number": "FFH1234567890",
  "amount": "500.00",
  "description": "Cash deposit"
}
→ { "message": "Deposit successful", "new_balance": "3700.00" }`}</Code>

          <H3 id="ep-kyc">KYC (Staff)</H3>
          <Code>{`# List accounts pending KYC review (AE / BM only)
GET /accounts/pending-kyc/
→ [{ "id": "uuid", "full_name": "...", "account_number": "...", ... }]

# Look up a specific account by number (AE / BM)
GET /accounts/kyc-lookup/?account_number=FFH...
→ { "id": "uuid", "full_name": "...", "kyc_submitted": true, ... }

# Approve or reject
PATCH /accounts/{id}/kyc-verify/
{
  "kyc_submitted": true,
  "kyc_verified": true,          // false to reject
  "verification_date": "2024-06-15",
  "verification_notes": "Documents verified."
}
→ { "message": "KYC status updated" }`}</Code>

          {/* ── Errors ── */}
          <H2 id="api-errors">Error Format</H2>
          <P>
            All API errors return a consistent JSON shape so the frontend can display them without
            parsing guesswork.
          </P>
          <Code>{`// 400 Bad Request
{ "error": "Insufficient balance." }

// 401 Unauthorized
{ "detail": "Authentication credentials were not provided." }

// 403 Forbidden
{ "detail": "You do not have permission to perform this action." }

// 422 Validation error (DRF default)
{
  "amount": ["This field is required."],
  "account": ["This field may not be null."]
}`}</Code>

          {/* ── Pagination ── */}
          <H2 id="api-pagination">Pagination</H2>
          <P>
            All list endpoints that can return large result sets use page-based pagination with a
            standard envelope:
          </P>
          <Code>{`{
  "count": 142,          // total items
  "next": "http://...?page=3",
  "previous": "http://...?page=1",
  "results": [ ... ]
}`}</Code>
          <P>
            The default page size is 10. Pass <InlineCode>?page=N</InlineCode> to advance. Search
            is supported via <InlineCode>?search=query</InlineCode> on endpoints that advertise it
            (e.g. <InlineCode>/profiles/all/</InlineCode>).
          </P>

          <div className="mt-16 border-t border-gray-200 pt-8 dark:border-white/10">
            <p className="text-xs text-gray-400 dark:text-gray-600">
              Built by{" "}
              <a
                href="https://edemaukabi.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 transition hover:text-[#00BFA5] dark:text-gray-500 dark:hover:text-[#00BFA5]"
              >
                Edema Ukabi
              </a>{" "}
              · FundFlowHub API v1
            </p>
          </div>

          <div className="h-12" />
        </div>
      </main>
    </div>
  );
}
