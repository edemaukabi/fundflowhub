import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Moon, Sun, KeyRound } from "lucide-react";
import { authApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/ThemeContext";
import Logo from "@/components/Logo";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { theme, toggleTheme } = useTheme();
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      await authApi.forgotPassword(values);
      setSent(true);
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen bg-ffh-bg dark:bg-ffh-bg-dark">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 mesh-gradient flex-col justify-between p-12 text-white">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <Logo variant="mono-white" height={30} />
        </Link>
        <div>
          <blockquote className="text-2xl font-semibold leading-snug">
            "Secure, multi-role banking in one dashboard."
          </blockquote>
          <p className="mt-4 text-white/60">
            Savings, transfers, virtual cards — built with security first.
          </p>
        </div>
        <p className="text-sm text-white/40">Simulated banking environment</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between p-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 lg:hidden"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Home
          </Link>
          <div className="ml-auto">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-16">
          <div className="w-full max-w-sm">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ffh-teal/10">
                <KeyRound size={26} className="text-ffh-teal" />
              </div>
              <h1 className="text-2xl font-bold text-ffh-navy dark:text-white">
                Forgot your password?
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {sent
                  ? "Check your inbox for a reset link."
                  : "Enter your email and we'll send you a reset link."}
              </p>
            </div>

            {!sent && (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-ffh-danger">{errors.email.message}</p>
                  )}
                </div>

                {serverError && (
                  <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-ffh-danger dark:bg-ffh-danger/10">
                    {serverError}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 size={16} className="mr-2 animate-spin" />}
                  Send reset link
                </Button>
              </form>
            )}

            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Remember it?{" "}
              <Link to="/login" className="font-medium text-ffh-blue hover:underline">
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
