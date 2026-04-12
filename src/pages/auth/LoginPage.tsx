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

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
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
      const { data } = await authApi.login(values);
      // Store email so OTP page can show it
      sessionStorage.setItem("ffh-otp-email", data.email);
      navigate("/verify-otp");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Login failed. Please try again.";
      setServerError(msg);
    }
  }

  return (
    <div className="flex min-h-screen bg-ffh-bg dark:bg-ffh-bg-dark">
      {/* Left panel — branding */}
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
        <p className="text-sm text-white/40">
          Simulated banking environment
        </p>
      </div>

      {/* Right panel — form */}
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
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-ffh-navy dark:text-white">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
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

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
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

              {serverError && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-ffh-danger dark:bg-ffh-danger/10">
                  {serverError}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 size={16} className="mr-2 animate-spin" />}
                Sign in
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-ffh-blue hover:underline">
                Create one
              </Link>
            </p>

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
