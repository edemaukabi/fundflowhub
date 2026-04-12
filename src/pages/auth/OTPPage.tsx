import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ShieldCheck, Moon, Sun } from "lucide-react";
import { authApi } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";

const OTP_LENGTH = 6;

export default function OTPPage() {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { theme, toggleTheme } = useTheme();
  const email = sessionStorage.getItem("ffh-otp-email");

  useEffect(() => {
    // Redirect if no email in session (user didn't come from login)
    if (!email) navigate("/login");
    else inputRefs.current[0]?.focus();
  }, [email, navigate]);

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return; // digits only
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = [...digits];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) {
      setError("Enter the complete 6-digit OTP.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await authApi.verifyOtp(otp);
      sessionStorage.removeItem("ffh-otp-email");
      await refetchUser();
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Invalid or expired OTP.";
      setError(msg);
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-ffh-bg px-6 dark:bg-ffh-bg-dark">
      {/* Theme toggle — top right */}
      <div className="flex justify-end p-4">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-ffh-teal/10">
          <ShieldCheck size={28} className="text-ffh-teal" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-ffh-navy dark:text-white">
          Check your email
        </h1>
        <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-ffh-navy dark:text-white">{email}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 flex justify-center gap-2" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="h-12 w-11 rounded-lg border border-gray-300 bg-white text-center text-lg font-semibold shadow-sm
                  focus:border-ffh-blue focus:outline-none focus:ring-1 focus:ring-ffh-blue
                  dark:border-ffh-border-dark dark:bg-ffh-surface-dark dark:text-white"
              />
            ))}
          </div>

          {error && (
            <p className="mb-4 text-sm text-ffh-danger">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 size={16} className="mr-2 animate-spin" />}
            Verify OTP
          </Button>
        </form>

        <button
          className="mt-6 text-sm text-gray-500 hover:text-ffh-blue dark:text-gray-400"
          onClick={() => navigate("/login")}
        >
          ← Back to login
        </button>
      </div>
      </div>
    </div>
  );
}
