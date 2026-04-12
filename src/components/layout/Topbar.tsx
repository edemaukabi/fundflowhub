import { Menu, Moon, Sun, LogOut, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user, mode, setMode, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-ffh-border-dark dark:bg-ffh-surface-dark">
      {/* Left: hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Mode badge */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMode(mode === "test" ? "live" : "test")}
          className={
            mode === "test"
              ? "badge-test cursor-pointer select-none"
              : user?.is_test_account
                ? "badge-live-pending cursor-pointer select-none"
                : "badge-live cursor-pointer select-none"
          }
          title={
            mode === "live" && user?.is_test_account
              ? "Live mode requires KYC verification"
              : undefined
          }
        >
          {mode === "test"
            ? "TEST MODE"
            : user?.is_test_account
              ? "LIVE — SETUP REQUIRED"
              : "LIVE"}
        </button>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        <button
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          onClick={logout}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
