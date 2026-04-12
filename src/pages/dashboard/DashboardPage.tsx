import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeftRight, ArrowDownToLine, CreditCard, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { accountsApi } from "@/api/accounts";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Transaction } from "@/types";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: accounts = [], isLoading: accountsLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => accountsApi.list().then((r) => r.data),
  });

  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ["transactions", "recent"],
    queryFn: () =>
      accountsApi.transactions({ ordering: "-created_at" }).then((r) => r.data),
  });

  const transactions = txData?.results ?? [];
  const totalBalance = accounts.reduce(
    (sum, acc) => sum + parseFloat(acc.account_balance),
    0,
  );
  const primaryAccount = accounts.find((a) => a.is_primary) ?? accounts[0];

  // Build simple sparkline data from last 7 transactions (reversed for chronological)
  const chartData = [...transactions]
    .slice(0, 7)
    .reverse()
    .map((tx, i) => ({
      name: `T${i + 1}`,
      amount: parseFloat(tx.amount),
    }));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-ffh-navy dark:text-white">
          Good {greeting()}, {user?.first_name}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Total balance
            </p>
            {accountsLoading ? (
              <Skeleton className="mt-2 h-7 w-32" />
            ) : (
              <p className="mt-1 text-2xl font-bold text-ffh-navy dark:text-white">
                {formatCurrency(totalBalance, primaryAccount?.currency ?? "us_dollar")}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-400">Across all accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Active accounts
            </p>
            {accountsLoading ? (
              <Skeleton className="mt-2 h-7 w-12" />
            ) : (
              <p className="mt-1 text-2xl font-bold text-ffh-navy dark:text-white">
                {accounts.filter((a) => a.account_status === "active").length}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              {accounts.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Transactions
            </p>
            {txLoading ? (
              <Skeleton className="mt-2 h-7 w-16" />
            ) : (
              <p className="mt-1 text-2xl font-bold text-ffh-navy dark:text-white">
                {txData?.count ?? 0}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-400">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              KYC status
            </p>
            <p className="mt-1 text-2xl font-bold text-ffh-navy dark:text-white">
              {primaryAccount?.kyc_verified ? "Verified" : "Pending"}
            </p>
            <p
              className={cn(
                "mt-1 text-xs",
                primaryAccount?.kyc_verified ? "text-ffh-teal" : "text-amber-500",
              )}
            >
              {primaryAccount?.fully_activated ? "Fully active" : "Incomplete"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart + quick actions row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Area chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="teal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00BFA5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00BFA5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#00BFA5"
                    fill="url(#teal)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-48 items-center justify-center text-sm text-gray-400">
                No transaction data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <QuickAction
              to="/dashboard/transfer"
              icon={ArrowLeftRight}
              label="Send transfer"
              description="Move funds between accounts"
              color="text-ffh-blue"
              bg="bg-ffh-blue/10"
            />
            <QuickAction
              to="/dashboard/withdraw"
              icon={ArrowDownToLine}
              label="Withdraw"
              description="Withdraw to your account"
              color="text-amber-600"
              bg="bg-amber-50 dark:bg-amber-500/10"
            />
            <QuickAction
              to="/dashboard/cards"
              icon={CreditCard}
              label="Virtual cards"
              description="Manage your cards"
              color="text-ffh-teal"
              bg="bg-ffh-teal/10"
            />
            <QuickAction
              to="/dashboard/accounts"
              icon={Plus}
              label="New account"
              description="Open a savings or checking account"
              color="text-purple-600"
              bg="bg-purple-50 dark:bg-purple-500/10"
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent transactions</CardTitle>
          <Link
            to="/dashboard/transactions"
            className="text-sm font-medium text-ffh-blue hover:underline"
          >
            View all →
          </Link>
        </CardHeader>
        <CardContent>
          {txLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              No transactions yet
            </p>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-ffh-border-dark">
              {transactions.slice(0, 5).map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function QuickAction({
  to,
  icon: Icon,
  label,
  description,
  color,
  bg,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
  bg: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
    >
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", bg)}>
        <Icon size={18} className={color} />
      </div>
      <div>
        <p className="text-sm font-medium text-ffh-navy dark:text-white">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </Link>
  );
}

function TransactionRow({ tx }: { tx: Transaction }) {
  const isCredit =
    tx.transaction_type === "deposit" || tx.transaction_type === "interest";
  const typeLabel: Record<string, string> = {
    deposit: "Deposit",
    withdrawal: "Withdrawal",
    transfer: "Transfer",
    interest: "Interest",
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ffh-navy dark:text-white">
          {tx.description ?? typeLabel[tx.transaction_type]}
        </p>
        <p className="text-xs text-gray-400">{formatDate(tx.created_at)}</p>
      </div>
      <div className="ml-4 shrink-0 text-right">
        <p
          className={cn(
            "text-sm font-semibold",
            isCredit ? "text-ffh-teal" : "text-ffh-danger",
          )}
        >
          {isCredit ? "+" : "-"}
          {formatCurrency(tx.amount)}
        </p>
        <p className="text-xs capitalize text-gray-400">{tx.status}</p>
      </div>
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-lg bg-gray-200 dark:bg-white/10", className)} />
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
