import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Landmark,
  ArrowLeftRight,
  ArrowDownToLine,
  CreditCard,
  History,
  Users,
  UserCheck,
  BarChart3,
  Settings,
  PiggyBank,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/Logo";
import type { Role } from "@/types";

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
  roles: Role[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
    roles: ["customer", "teller", "account_executive", "branch_manager"],
  },
  {
    label: "Accounts",
    to: "/dashboard/accounts",
    icon: Landmark,
    roles: ["customer"],
  },
  {
    label: "Transfer",
    to: "/dashboard/transfer",
    icon: ArrowLeftRight,
    roles: ["customer"],
  },
  {
    label: "Withdrawal",
    to: "/dashboard/withdraw",
    icon: ArrowDownToLine,
    roles: ["customer"],
  },
  {
    label: "Virtual Cards",
    to: "/dashboard/cards",
    icon: CreditCard,
    roles: ["customer"],
  },
  {
    label: "Transactions",
    to: "/dashboard/transactions",
    icon: History,
    roles: ["customer"],
  },
  {
    label: "Deposit",
    to: "/dashboard/deposit",
    icon: PiggyBank,
    roles: ["teller"],
  },
  {
    label: "Customers",
    to: "/dashboard/customers",
    icon: Users,
    roles: ["account_executive", "branch_manager"],
  },
  {
    label: "KYC Review",
    to: "/dashboard/kyc",
    icon: UserCheck,
    roles: ["account_executive", "branch_manager"],
  },
  {
    label: "Reports",
    to: "/dashboard/reports",
    icon: BarChart3,
    roles: ["branch_manager"],
  },
  {
    label: "Settings",
    to: "/dashboard/settings",
    icon: Settings,
    roles: ["customer", "teller", "account_executive", "branch_manager"],
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user } = useAuth();
  const role = user?.role ?? "customer";

  const visible = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="flex h-full w-64 flex-col bg-ffh-navy">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-5">
        <Logo variant="mono-white" height={32} />
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {visible.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-ffh-teal/20 text-ffh-teal"
                  : "text-gray-300 hover:bg-white/10 hover:text-white",
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Docs link */}
      <div className="shrink-0 border-t border-white/10 px-3 py-2">
        <Link
          to="/docs"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <BookOpen size={18} />
          API Docs
        </Link>
      </div>

      {/* User chip at bottom */}
      {user && (
        <div className="shrink-0 border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ffh-teal/20 text-sm font-semibold text-ffh-teal">
              {user.first_name[0]}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{user.full_name}</p>
              <p className="truncate text-xs capitalize text-gray-400">
                {user.role.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Built by */}
      <div className="shrink-0 px-5 pb-4">
        <p className="text-xs text-white/20">
          Built by{" "}
          <a
            href="https://edemaukabi.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 transition hover:text-ffh-teal"
          >
            Edema Ukabi
          </a>
        </p>
      </div>
    </aside>
  );
}
