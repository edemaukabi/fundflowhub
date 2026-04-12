import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  TrendingUp,
  Filter,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { accountsApi } from "@/api/accounts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction, TransactionType, BankAccount } from "@/types";

const PAGE_SIZE = 10;

const TYPE_META: Record<
  TransactionType,
  { label: string; icon: React.ElementType; credit: boolean; color: string }
> = {
  deposit: { label: "Deposit", icon: ArrowDownLeft, credit: true, color: "text-ffh-teal" },
  withdrawal: { label: "Withdrawal", icon: ArrowUpRight, credit: false, color: "text-ffh-danger" },
  transfer: { label: "Transfer", icon: ArrowLeftRight, credit: false, color: "text-ffh-blue" },
  interest: { label: "Interest", icon: TrendingUp, credit: true, color: "text-ffh-teal" },
};

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [accountNumber, setAccountNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: accounts = [] } = useQuery<BankAccount[]>({
    queryKey: ["accounts"],
    queryFn: () => accountsApi.list().then((r) => r.data),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", page, accountNumber, startDate, endDate],
    queryFn: () =>
      accountsApi
        .transactions({
          page,
          account_number: accountNumber || undefined,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          ordering: "-created_at",
        })
        .then((r) => r.data),
  });

  const pdfMutation = useMutation({
    mutationFn: () =>
      accountsApi.requestPdf({
        account_number: accountNumber || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      }),
  });

  const transactions = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 1;

  function clearFilters() {
    setAccountNumber("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  }

  const hasFilters = accountNumber || startDate || endDate;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ffh-navy dark:text-white">Transactions</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {data ? `${data.count} total` : "Loading…"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFilters((v) => !v)}
          >
            <Filter size={14} className="mr-1.5" />
            Filters
            {hasFilters && (
              <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-ffh-teal text-xs text-white">
                !
              </span>
            )}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => pdfMutation.mutate()}
            disabled={pdfMutation.isPending}
            title="Email PDF statement"
          >
            {pdfMutation.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Download size={14} className="mr-1.5" />
            )}
            Export
          </Button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Account</Label>
                <select
                  className="form-input"
                  value={accountNumber}
                  onChange={(e) => { setAccountNumber(e.target.value); setPage(1); }}
                >
                  <option value="">All accounts</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.account_number}>
                      {a.account_number}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>From date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                />
              </div>
              <div className="space-y-1.5">
                <Label>To date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                />
              </div>
            </div>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-3 text-sm text-ffh-blue hover:underline"
              >
                Clear filters
              </button>
            )}
          </CardContent>
        </Card>
      )}

      {pdfMutation.isSuccess && (
        <div className="rounded-lg bg-ffh-teal/10 px-4 py-3 text-sm text-ffh-teal">
          Statement PDF is being generated and will be sent to your email.
        </div>
      )}

      {/* Table */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-ffh-teal" />
            </div>
          ) : transactions.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-400">No transactions found</p>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-ffh-border-dark">
                      {["Type", "Description", "Date", "Amount", "Status"].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-ffh-border-dark">
                    {transactions.map((tx) => (
                      <TableRow key={tx.id} tx={tx} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile list */}
              <div className="divide-y divide-gray-100 dark:divide-ffh-border-dark md:hidden">
                {transactions.map((tx) => (
                  <MobileRow key={tx.id} tx={tx} />
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function TableRow({ tx }: { tx: Transaction }) {
  const meta = TYPE_META[tx.transaction_type] ?? TYPE_META.transfer;
  const Icon = meta.icon;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-white/5">
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full",
              meta.credit
                ? "bg-ffh-teal/10 text-ffh-teal"
                : "bg-ffh-danger/10 text-ffh-danger",
            )}
          >
            <Icon size={14} />
          </div>
          <span className="font-medium text-ffh-navy dark:text-white">{meta.label}</span>
        </div>
      </td>
      <td className="max-w-[200px] truncate px-6 py-4 text-gray-500 dark:text-gray-400">
        {tx.description ?? "—"}
      </td>
      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
        {formatDate(tx.created_at)}
      </td>
      <td className={cn("px-6 py-4 font-semibold", meta.color)}>
        {meta.credit ? "+" : "-"}
        {formatCurrency(tx.amount)}
      </td>
      <td className="px-6 py-4">
        <StatusPill status={tx.status} />
      </td>
    </tr>
  );
}

function MobileRow({ tx }: { tx: Transaction }) {
  const meta = TYPE_META[tx.transaction_type] ?? TYPE_META.transfer;
  const Icon = meta.icon;

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            meta.credit ? "bg-ffh-teal/10 text-ffh-teal" : "bg-ffh-danger/10 text-ffh-danger",
          )}
        >
          <Icon size={15} />
        </div>
        <div>
          <p className="text-sm font-medium text-ffh-navy dark:text-white">
            {tx.description ?? meta.label}
          </p>
          <p className="text-xs text-gray-400">{formatDate(tx.created_at)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={cn("text-sm font-semibold", meta.color)}>
          {meta.credit ? "+" : "-"}
          {formatCurrency(tx.amount)}
        </p>
        <StatusPill status={tx.status} />
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        status === "completed"
          ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
          : status === "pending"
            ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
            : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
      )}
    >
      {status}
    </span>
  );
}
