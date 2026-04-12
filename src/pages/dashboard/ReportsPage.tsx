import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Users, Landmark, ArrowLeftRight, UserCheck, Loader2 } from "lucide-react";
import { kycApi } from "@/api/profile";
import { accountsApi } from "@/api/accounts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#00BFA5", "#0077B6", "#1B2F5B", "#E53935"];

export default function ReportsPage() {
  const { data: pendingKyc, isLoading: kycLoading } = useQuery({
    queryKey: ["pending-kyc"],
    queryFn: () => kycApi.pendingList().then((r) => r.data),
  });

  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ["transactions", "reports"],
    queryFn: () =>
      accountsApi.transactions({ ordering: "-created_at" }).then((r) => r.data),
  });

  const pendingKycCount = Array.isArray(pendingKyc)
    ? pendingKyc.length
    : (pendingKyc as { count?: number })?.count ?? 0;

  const transactions = txData?.results ?? [];
  const totalTx = txData?.count ?? 0;

  // Aggregate tx by type for pie chart
  const typeCounts = transactions.reduce<Record<string, number>>((acc, tx) => {
    acc[tx.transaction_type] = (acc[tx.transaction_type] ?? 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(typeCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  // Last 7 transaction amounts for bar chart
  const barData = [...transactions]
    .slice(0, 7)
    .reverse()
    .map((tx, i) => ({
      name: `T${i + 1}`,
      amount: parseFloat(tx.amount),
      type: tx.transaction_type,
    }));

  const totalVolume = transactions.reduce(
    (sum, tx) => sum + parseFloat(tx.amount),
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ffh-navy dark:text-white">Reports</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Branch overview and activity summary
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          icon={ArrowLeftRight}
          label="Total transactions"
          value={String(totalTx)}
          sub="All time"
          isLoading={txLoading}
        />
        <KPICard
          icon={Landmark}
          label="Transaction volume"
          value={formatCurrency(totalVolume)}
          sub="Last 10 shown"
          isLoading={txLoading}
        />
        <KPICard
          icon={UserCheck}
          label="Pending KYC"
          value={String(pendingKycCount)}
          sub="Awaiting review"
          isLoading={kycLoading}
          highlight={pendingKycCount > 0}
        />
        <KPICard
          icon={Users}
          label="Active transactions"
          value={String(
            transactions.filter((t) => t.status === "completed").length,
          )}
          sub="Completed"
          isLoading={txLoading}
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Bar chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent transaction amounts</CardTitle>
          </CardHeader>
          <CardContent>
            {txLoading ? (
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-ffh-teal" />
            ) : barData.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">No data</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#00BFA5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie chart */}
        <Card>
          <CardHeader>
            <CardTitle>By type</CardTitle>
          </CardHeader>
          <CardContent>
            {txLoading ? (
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-ffh-teal" />
            ) : pieData.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">No data</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconSize={10} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending KYC quick list */}
      {pendingKycCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                {pendingKycCount}
              </span>
              Accounts awaiting KYC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Visit the{" "}
              <a href="/dashboard/kyc" className="font-medium text-ffh-blue hover:underline">
                KYC Review page
              </a>{" "}
              to process pending verifications.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function KPICard({
  icon: Icon,
  label,
  value,
  sub,
  isLoading,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  isLoading?: boolean;
  highlight?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
              highlight ? "bg-amber-100 text-amber-600" : "bg-ffh-teal/10 text-ffh-teal"
            }`}
          >
            <Icon size={18} />
          </div>
        </div>
        {isLoading ? (
          <div className="mt-3 h-7 w-24 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
        ) : (
          <p className="mt-3 text-2xl font-bold text-ffh-navy dark:text-white">{value}</p>
        )}
        <p className="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </CardContent>
    </Card>
  );
}
