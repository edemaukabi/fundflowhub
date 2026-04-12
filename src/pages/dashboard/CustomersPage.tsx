import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Users, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { customersApi, type CustomerProfile } from "@/api/customers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["customers", page, debouncedSearch],
    queryFn: () =>
      customersApi.list({ search: debouncedSearch || undefined, page }).then((r) => r.data),
  });

  const customers = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 1;

  function handleSearchChange(value: string) {
    setSearch(value);
    if (searchTimer) clearTimeout(searchTimer);
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 350);
    setSearchTimer(timer);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ffh-navy dark:text-white">Customers</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {data ? `${data.count} registered customer${data.count !== 1 ? "s" : ""}` : "Loading…"}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-9"
          placeholder="Search by name or ID…"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>All customers</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-ffh-teal" />
            </div>
          ) : customers.length === 0 ? (
            <EmptyState hasSearch={!!debouncedSearch} />
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-ffh-border-dark">
                      {["Customer", "Username", "Contact", "Nationality", "Gender"].map((h) => (
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
                    {customers.map((c) => (
                      <DesktopRow key={c.email} customer={c} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-gray-100 dark:divide-ffh-border-dark md:hidden">
                {customers.map((c) => (
                  <MobileRow key={c.email} customer={c} />
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

// ─── Sub-components ────────────────────────────────────────────────────────────

function Avatar({ customer }: { customer: CustomerProfile }) {
  return customer.photo ? (
    <img
      src={customer.photo}
      alt={customer.full_name}
      className="h-9 w-9 rounded-full object-cover"
    />
  ) : (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ffh-navy/10 text-sm font-semibold text-ffh-navy dark:bg-white/10 dark:text-white">
      {customer.full_name[0]}
    </div>
  );
}

function GenderBadge({ gender }: { gender: string | null }) {
  if (!gender) return <span className="text-gray-400">—</span>;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        gender === "M"
          ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
          : gender === "F"
            ? "bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400"
            : "bg-gray-100 text-gray-600 dark:bg-white/10",
      )}
    >
      {gender === "M" ? "Male" : gender === "F" ? "Female" : "Other"}
    </span>
  );
}

function DesktopRow({ customer }: { customer: CustomerProfile }) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-white/5">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar customer={customer} />
          <div>
            <p className="font-medium text-ffh-navy dark:text-white">{customer.full_name}</p>
            <p className="text-xs text-gray-400">{customer.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 font-mono text-sm text-gray-500 dark:text-gray-400">
        @{customer.username}
      </td>
      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
        {customer.phone_number ?? "—"}
      </td>
      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
        {customer.nationality ?? customer.country_of_birth ?? "—"}
      </td>
      <td className="px-6 py-4">
        <GenderBadge gender={customer.gender} />
      </td>
    </tr>
  );
}

function MobileRow({ customer }: { customer: CustomerProfile }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Avatar customer={customer} />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ffh-navy dark:text-white">
          {customer.full_name}
        </p>
        <p className="truncate text-xs text-gray-400">{customer.email}</p>
        {customer.phone_number && (
          <p className="text-xs text-gray-400">{customer.phone_number}</p>
        )}
      </div>
      <GenderBadge gender={customer.gender} />
    </div>
  );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center py-14 text-center">
      <Users size={36} className="mb-3 text-gray-300" />
      <p className="font-medium text-ffh-navy dark:text-white">
        {hasSearch ? "No customers match your search" : "No customers yet"}
      </p>
      <p className="mt-1 text-sm text-gray-400">
        {hasSearch ? "Try a different name or ID" : "Customers will appear here once they register"}
      </p>
    </div>
  );
}
