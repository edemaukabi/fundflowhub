import { useQuery } from "@tanstack/react-query";
import { Landmark, CheckCircle2, Clock, Star, Loader2 } from "lucide-react";
import { accountsApi } from "@/api/accounts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";
import type { BankAccount } from "@/types";

const CURRENCY_LABELS: Record<string, string> = {
  us_dollar: "USD",
  pound_sterling: "GBP",
  kenya_shilling: "KES",
};

export default function AccountsPage() {
  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => accountsApi.list().then((r) => r.data),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ffh-navy dark:text-white">Accounts</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your bank accounts
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-ffh-teal" />
        </div>
      ) : accounts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      )}
    </div>
  );
}

function AccountCard({ account }: { account: BankAccount }) {
  const isActive = account.account_status === "active";
  const currencyCode = CURRENCY_LABELS[account.currency] ?? account.currency;

  return (
    <Card className={cn("relative overflow-hidden", !isActive && "opacity-70")}>
      {/* Accent stripe */}
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-1",
          account.account_type === "savings" ? "bg-ffh-teal" : "bg-ffh-blue",
        )}
      />

      <CardHeader className="pl-6 pb-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Landmark size={16} className="text-gray-400" />
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {account.account_type} · {currencyCode}
              </span>
              {account.is_primary && (
                <Star size={12} className="fill-amber-400 text-amber-400" />
              )}
            </div>
            <p className="mt-1 font-mono text-sm text-gray-500 dark:text-gray-400">
              {account.account_number}
            </p>
          </div>
          <StatusBadge active={isActive} />
        </div>
      </CardHeader>

      <CardContent className="pl-6">
        <p className="text-3xl font-bold text-ffh-navy dark:text-white">
          {formatCurrency(account.account_balance, account.currency)}
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <KycStatus submitted={account.kyc_submitted} verified={account.kyc_verified} />
          <span>·</span>
          <span className={account.fully_activated ? "text-ffh-teal" : "text-amber-500"}>
            {account.fully_activated ? "Fully activated" : "Activation pending"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        active
          ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
          : "bg-gray-100 text-gray-500 dark:bg-white/10",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-green-500" : "bg-gray-400")} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function KycStatus({ submitted, verified }: { submitted: boolean; verified: boolean }) {
  if (verified) {
    return (
      <span className="flex items-center gap-1 text-ffh-teal">
        <CheckCircle2 size={12} />
        KYC verified
      </span>
    );
  }
  if (submitted) {
    return (
      <span className="flex items-center gap-1 text-amber-500">
        <Clock size={12} />
        KYC under review
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-gray-400">
      <Clock size={12} />
      KYC not submitted
    </span>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center py-16 text-center">
        <Landmark size={40} className="mb-4 text-gray-300" />
        <h3 className="mb-1 text-lg font-semibold text-ffh-navy dark:text-white">
          No accounts yet
        </h3>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Visit a branch to open your first account.
        </p>
      </CardContent>
    </Card>
  );
}
