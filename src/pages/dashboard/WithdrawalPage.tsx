import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { withdrawalApi } from "@/api/withdrawal";
import { accountsApi } from "@/api/accounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import type { BankAccount } from "@/types";

const step1Schema = z.object({
  account_number: z.string().min(1, "Select an account"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, "Must be positive"),
});

const step2Schema = z.object({
  username: z.string().min(3, "Username is required"),
});

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;

const STEPS = ["Details", "Confirm"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
              i < current
                ? "bg-ffh-teal text-white"
                : i === current
                  ? "border-2 border-ffh-teal text-ffh-teal"
                  : "border-2 border-gray-200 text-gray-400 dark:border-ffh-border-dark",
            )}
          >
            {i < current ? <CheckCircle2 size={14} /> : i + 1}
          </div>
          <span
            className={cn(
              "text-sm font-medium",
              i === current ? "text-ffh-navy dark:text-white" : "text-gray-400",
            )}
          >
            {label}
          </span>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                "h-px w-8 bg-gray-200 dark:bg-ffh-border-dark",
                i < current && "bg-ffh-teal",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function WithdrawalPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: accounts = [] } = useQuery<BankAccount[]>({
    queryKey: ["accounts"],
    queryFn: () => accountsApi.list().then((r) => r.data),
  });

  const eligibleAccounts = accounts.filter(
    (a) => a.fully_activated && a.kyc_verified && a.account_status === "active",
  );

  // Step 1
  const form1 = useForm<Step1Values>({ resolver: zodResolver(step1Schema) });
  async function onStep1(values: Step1Values) {
    setServerError(null);
    try {
      const { data } = await withdrawalApi.initiate(values);
      setToken(data.token);
      setStep(1);
    } catch (err: unknown) {
      setServerError(extractError(err));
    }
  }

  // Step 2
  const form2 = useForm<Step2Values>({ resolver: zodResolver(step2Schema) });
  async function onStep2(values: Step2Values) {
    setServerError(null);
    try {
      await withdrawalApi.verifyUsername(token!, values.username);
      navigate("/dashboard/transactions", { state: { withdrawn: true } });
    } catch (err: unknown) {
      setServerError(extractError(err));
    }
  }

  const selectedAccountNumber = form1.watch("account_number");
  const selectedAccount = accounts.find(
    (a) => a.account_number === selectedAccountNumber,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ffh-navy dark:text-white">Withdraw funds</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Confirm your identity to complete the withdrawal
        </p>
      </div>

      <StepIndicator current={step} />

      <Card className="max-w-lg">
        {/* Step 0: Details */}
        {step === 0 && (
          <>
            <CardHeader>
              <CardTitle>Withdrawal details</CardTitle>
              <CardDescription>Select an account and enter the amount.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form1.handleSubmit(onStep1)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="account_number">Account</Label>
                  {eligibleAccounts.length === 0 ? (
                    <p className="text-sm text-amber-600">
                      No verified accounts available for withdrawal.
                    </p>
                  ) : (
                    <select
                      id="account_number"
                      className="form-input"
                      {...form1.register("account_number")}
                    >
                      <option value="">Select account…</option>
                      {eligibleAccounts.map((a) => (
                        <option key={a.id} value={a.account_number}>
                          {a.account_number} — {formatCurrency(a.account_balance, a.currency)}
                        </option>
                      ))}
                    </select>
                  )}
                  {form1.formState.errors.account_number && (
                    <p className="text-xs text-ffh-danger">
                      {form1.formState.errors.account_number.message}
                    </p>
                  )}
                </div>

                {selectedAccount && (
                  <div className="rounded-lg bg-ffh-bg p-3 text-sm dark:bg-white/5">
                    <span className="text-gray-500">Available balance: </span>
                    <span className="font-semibold text-ffh-navy dark:text-white">
                      {formatCurrency(selectedAccount.account_balance, selectedAccount.currency)}
                    </span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    {...form1.register("amount")}
                  />
                  {form1.formState.errors.amount && (
                    <p className="text-xs text-ffh-danger">
                      {form1.formState.errors.amount.message}
                    </p>
                  )}
                </div>

                {serverError && <ErrorBanner message={serverError} />}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={form1.formState.isSubmitting || eligibleAccounts.length === 0}
                >
                  {form1.formState.isSubmitting && (
                    <Loader2 size={16} className="mr-2 animate-spin" />
                  )}
                  Continue
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </form>
            </CardContent>
          </>
        )}

        {/* Step 1: Username confirm */}
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle>Confirm your identity</CardTitle>
              <CardDescription>Enter your username to authorise this withdrawal.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form2.handleSubmit(onStep2)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Your username"
                    autoFocus
                    autoComplete="username"
                    {...form2.register("username")}
                  />
                  {form2.formState.errors.username && (
                    <p className="text-xs text-ffh-danger">
                      {form2.formState.errors.username.message}
                    </p>
                  )}
                </div>

                {serverError && <ErrorBanner message={serverError} />}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => { setStep(0); setServerError(null); }}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={form2.formState.isSubmitting}
                  >
                    {form2.formState.isSubmitting ? (
                      <Loader2 size={16} className="mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 size={16} className="mr-2" />
                    )}
                    Withdraw
                  </Button>
                </div>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-ffh-danger dark:bg-ffh-danger/10">
      {message}
    </div>
  );
}

function extractError(err: unknown): string {
  const data = (err as { response?: { data?: Record<string, unknown> } })?.response?.data;
  if (!data) return "Something went wrong. Please try again.";
  const val = data.error ?? data.non_field_errors ?? Object.values(data)[0];
  if (Array.isArray(val)) return val[0] as string;
  return String(val);
}
