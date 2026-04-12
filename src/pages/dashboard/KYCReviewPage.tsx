import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { kycApi, type PendingKYCAccount } from "@/api/profile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, formatDate } from "@/lib/utils";

const verifySchema = z.object({
  verification_date: z.string().min(1, "Date is required"),
  verification_notes: z.string().min(10, "Please add meaningful notes (min 10 chars)"),
  decision: z.enum(["approve", "reject"]),
});

type VerifyForm = z.infer<typeof verifySchema>;

export default function KYCReviewPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["pending-kyc"],
    queryFn: () => kycApi.pendingList().then((r) => r.data),
  });

  const accounts: PendingKYCAccount[] = Array.isArray(data)
    ? data
    : (data as { results?: PendingKYCAccount[] })?.results ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ffh-navy dark:text-white">KYC Review</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Review and verify customer identity documents
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-ffh-teal" />
        </div>
      ) : accounts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <CheckCircle2 size={40} className="mb-4 text-ffh-teal" />
            <h3 className="text-lg font-semibold text-ffh-navy dark:text-white">
              All caught up
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No accounts are pending KYC review.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-amber-600 dark:text-amber-400">
            {accounts.length} account{accounts.length !== 1 ? "s" : ""} pending review
          </p>
          {accounts.map((account) => (
            <KYCReviewCard key={account.id} account={account} />
          ))}
        </div>
      )}
    </div>
  );
}

function KYCReviewCard({ account }: { account: PendingKYCAccount }) {
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState(false);

  const verify = useMutation({
    mutationFn: (values: VerifyForm) =>
      kycApi.verify(account.id, {
        kyc_submitted: true,
        kyc_verified: values.decision === "approve",
        verification_date: values.verification_date,
        verification_notes: values.verification_notes,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pending-kyc"] });
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      verification_date: new Date().toISOString().split("T")[0],
      decision: "approve",
    },
  });

  const decision = watch("decision");

  return (
    <Card>
      {/* Summary row */}
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {account.photo_url ? (
              <img
                src={account.photo_url}
                alt={account.full_name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ffh-navy/10 dark:bg-white/10">
                <User size={18} className="text-ffh-navy dark:text-white" />
              </div>
            )}
            <div>
              <p className="font-medium text-ffh-navy dark:text-white">{account.full_name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {account.account_number} · {account.account_type} · Submitted{" "}
                {formatDate(account.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
              <Clock size={11} />
              Pending
            </span>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Expanded review form */}
        {expanded && (
          <form
            onSubmit={handleSubmit((v) => verify.mutate(v))}
            className="mt-5 space-y-4 border-t border-gray-100 pt-5 dark:border-ffh-border-dark"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Verification date</Label>
                <Input type="date" {...register("verification_date")} />
                {errors.verification_date && (
                  <p className="text-xs text-ffh-danger">
                    {errors.verification_date.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Decision</Label>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setValue("decision", "approve")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-sm font-medium transition-colors",
                      decision === "approve"
                        ? "border-ffh-teal bg-ffh-teal/10 text-ffh-teal"
                        : "border-gray-200 text-gray-500 hover:border-ffh-teal dark:border-ffh-border-dark",
                    )}
                  >
                    <CheckCircle2 size={15} />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("decision", "reject")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-sm font-medium transition-colors",
                      decision === "reject"
                        ? "border-ffh-danger bg-ffh-danger/10 text-ffh-danger"
                        : "border-gray-200 text-gray-500 hover:border-ffh-danger dark:border-ffh-border-dark",
                    )}
                  >
                    <XCircle size={15} />
                    Reject
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Notes</Label>
              <textarea
                rows={3}
                placeholder="Verification notes — required for approval or rejection"
                className="form-input resize-none"
                {...register("verification_notes")}
              />
              {errors.verification_notes && (
                <p className="text-xs text-ffh-danger">
                  {errors.verification_notes.message}
                </p>
              )}
            </div>

            {verify.isError && (
              <p className="text-sm text-ffh-danger">
                {(verify.error as { response?: { data?: { error?: string } } })
                  ?.response?.data?.error ?? "Verification failed."}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setExpanded(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={decision === "approve" ? "default" : "destructive"}
                disabled={verify.isPending}
              >
                {verify.isPending && (
                  <Loader2 size={14} className="mr-2 animate-spin" />
                )}
                {decision === "approve" ? "Approve KYC" : "Reject KYC"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
