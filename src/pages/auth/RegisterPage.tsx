import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Moon, Sun } from "lucide-react";
import { authApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/ThemeContext";
import Logo from "@/components/Logo";

const SECURITY_QUESTIONS = [
  { value: "maiden_name", label: "What is your mother's maiden name?" },
  { value: "favorite_color", label: "What is your favorite color?" },
  { value: "birth_city", label: "What is the city where you were born?" },
  { value: "childhood_friend", label: "What is the name of your childhood best friend?" },
];

const schema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Enter a valid email"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(12, "Username must be at most 12 characters"),
    id_no: z
      .string()
      .min(1, "ID number is required")
      .regex(/^\d+$/, "ID number must be numeric"),
    security_question: z.string().min(1, "Select a security question"),
    security_answer: z.string().min(2, "Security answer is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    re_password: z.string(),
  })
  .refine((d) => d.password === d.re_password, {
    message: "Passwords do not match",
    path: ["re_password"],
  });

type FormValues = z.infer<typeof schema>;

// ── Feature items for the left panel ──────────────────────────────────────────
const FEATURES = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M1 4h22v16H1zM1 10h22" />
      </svg>
    ),
    title: "Multi-account banking",
    desc: "Savings and checking with tiered daily interest applied automatically.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "3-step secure transfers",
    desc: "Security question + OTP email confirmation on every transaction.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
    title: "Virtual cards",
    desc: "HMAC-secured CVV — computed on demand, never stored in the database.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4" /><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
      </svg>
    ),
    title: "KYC-verified accounts",
    desc: "Manual review by Account Executives before Live mode is unlocked.",
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      await authApi.register({
        ...values,
        id_no: parseInt(values.id_no, 10),
      });
      navigate("/login", { state: { registered: true } });
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, string[]> } })
        ?.response?.data;
      if (data) {
        const first = Object.values(data).flat()[0];
        setServerError(first ?? "Registration failed.");
      } else {
        setServerError("Registration failed. Please try again.");
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-ffh-bg dark:bg-ffh-bg-dark">
      {/* ── Left panel — branding ── */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-5/12 mesh-gradient flex-col p-10 text-white relative overflow-hidden">
        <div className="mesh-layer" />

        {/* Logo */}
        <div className="relative z-10 mb-10">
          <Link to="/" className="hover:opacity-80 transition-opacity inline-block">
            <Logo variant="mono-white" height={34} />
          </Link>
        </div>

        {/* Feature cards */}
        <div className="relative z-10 flex-1">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
            Everything included
          </p>
          <h2 className="mb-6 text-2xl font-bold leading-snug text-white">
            A complete banking<br />experience, secured.
          </h2>

          <div className="space-y-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-3.5 rounded-xl p-3.5 transition-colors"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div
                  className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-[#00BFA5]"
                  style={{ background: "rgba(0,191,165,0.15)" }}
                >
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-white/45">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: quote + disclaimer */}
        <div className="relative z-10 mt-8">
          <div
            className="mb-4 rounded-xl p-4"
            style={{ background: "rgba(0,191,165,0.08)", border: "1px solid rgba(0,191,165,0.2)" }}
          >
            <p className="text-sm font-medium leading-relaxed text-white/80">
              "Built to show what modern banking looks like — secure, role-based, and production-ready."
            </p>
          </div>
          <p className="text-xs text-white/25">Simulated banking environment</p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-ffh-border-dark lg:hidden">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <Logo auto height={30} />
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <Link
              to="/login"
              className="text-sm font-medium text-ffh-blue hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Desktop top bar — theme toggle only */}
        <div className="hidden lg:flex items-center justify-end px-8 pt-6">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>

        {/* Scrollable form area */}
        <div className="flex flex-1 flex-col overflow-y-auto px-6 py-8 lg:px-12 lg:py-6">
          <div className="mx-auto w-full max-w-md">
            {/* Header */}
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-ffh-navy dark:text-white">
                Create your account
              </h1>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                Already have one?{" "}
                <Link to="/login" className="font-medium text-ffh-blue hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Form card */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="first_name">First name</Label>
                  <Input id="first_name" placeholder="John" {...register("first_name")} />
                  {errors.first_name && (
                    <p className="text-xs text-ffh-danger">{errors.first_name.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="last_name">Last name</Label>
                  <Input id="last_name" placeholder="Doe" {...register("last_name")} />
                  {errors.last_name && (
                    <p className="text-xs text-ffh-danger">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                {errors.email && (
                  <p className="text-xs text-ffh-danger">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="johndoe" maxLength={12} {...register("username")} />
                  {errors.username && (
                    <p className="text-xs text-ffh-danger">{errors.username.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="id_no">ID number</Label>
                  <Input id="id_no" placeholder="12345678" inputMode="numeric" {...register("id_no")} />
                  {errors.id_no && (
                    <p className="text-xs text-ffh-danger">{errors.id_no.message}</p>
                  )}
                </div>
              </div>

              {/* Security question */}
              <div className="space-y-1.5">
                <Label htmlFor="security_question">Security question</Label>
                <div className="relative">
                  <select
                    id="security_question"
                    className="form-input w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm pr-9 shadow-sm focus:outline-none focus:ring-2 focus:ring-ffh-teal/40 dark:border-ffh-border-dark dark:bg-ffh-surface-dark dark:text-white"
                    {...register("security_question")}
                  >
                    <option value="">Select a question…</option>
                    {SECURITY_QUESTIONS.map((q) => (
                      <option key={q.value} value={q.value}>{q.label}</option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                {errors.security_question && (
                  <p className="text-xs text-ffh-danger">{errors.security_question.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="security_answer">Security answer</Label>
                <Input id="security_answer" placeholder="Your answer" {...register("security_answer")} />
                {errors.security_answer && (
                  <p className="text-xs text-ffh-danger">{errors.security_answer.message}</p>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-gray-100 dark:bg-ffh-border-dark" />
                <span className="text-xs text-gray-400">Password</span>
                <div className="h-px flex-1 bg-gray-100 dark:bg-ffh-border-dark" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className="pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-ffh-danger">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="re_password">Confirm password</Label>
                <Input
                  id="re_password"
                  type="password"
                  placeholder="Repeat password"
                  {...register("re_password")}
                />
                {errors.re_password && (
                  <p className="text-xs text-ffh-danger">{errors.re_password.message}</p>
                )}
              </div>

              {serverError && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-ffh-danger dark:bg-ffh-danger/10">
                  {serverError}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting && <Loader2 size={16} className="mr-2 animate-spin" />}
                Create account
              </Button>

              <p className="text-center text-xs text-gray-400 dark:text-gray-600">
                By creating an account you agree to our{" "}
                <span className="text-ffh-blue hover:underline cursor-pointer">Terms of Service</span>
              </p>
            </form>

            <p className="mt-8 text-center text-xs text-gray-300 dark:text-gray-600">
              Built by{" "}
              <a
                href="https://edemaukabi.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-ffh-teal transition-colors dark:text-gray-500 dark:hover:text-ffh-teal"
              >
                Edema Ukabi
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
