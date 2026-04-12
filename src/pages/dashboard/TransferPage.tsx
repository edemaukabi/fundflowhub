import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { transferApi } from "@/api/transfer";
import { accountsApi } from "@/api/accounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import type { BankAccount } from "@/types";

// ─── Step schemas ──────────────────────────────────────────────────────────────

const step1Schema = z.object({
  sender_account: z.string().min(1, "Select a sender account"),
  receiver_account: z.string().min(10, "Enter a valid account number"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, "Amount must be positive"),
  description: z.string().max(200).optional(),
});

const step2Schema = z.object({
  security_answer: z.string().min(1, "Security answer is required"),
});

const step3Schema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "Digits only"),
});

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;
type Step3Values = z.infer<typeof step3Schema>;

// ─── Step indicator ────────────────────────────────────────────────────────────

const STEPS = ["Details", "Security", "OTP"];

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
              i === current
                ? "text-ffh-navy dark:text-white"
                : "text-gray-400",
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

// ─── Main component ────────────────────────────────────────────────────────────

export default function TransferPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: accounts = [] } = useQuery<BankAccount[]>({
    queryKey: ["accounts"],
    queryFn: () => accountsApi.list().then((r) => r.data),
  });

  const eligibleAccounts = accounts.filter(
    (a) => a.fully_activated && a.kyc_verified,
  );

  // ── Step 1 ──
  const form1 = useForm<Step1Values>({ resolver: zodResolver(step1Schema) });
  async function onStep1(values: Step1Values) {
    setServerError(null);
    try {
      const { data } = await transferApi.initiate(values);
      setToken(data.token);
      setStep(1);
    } catch (err: unknown) {
      setServerError(extractError(err));
    }
  }

  // ── Step 2 ──
  const form2 = useForm<Step2Values>({ resolver: zodResolver(step2Schema) });
  async function onStep2(values: Step2Values) {
    setServerError(null);
    try {
      await transferApi.verifySecurity(token!, values.security_answer);
      setStep(2);
    } catch (err: unknown) {
      setServerError(extractError(err));
    }
  }

  // ── Step 3 ──
  const form3 = useForm<Step3Values>({ resolver: zodResolver(step3Schema) });
  async function onStep3(values: Step3Values) {
    setServerError(null);
    try {
      await transferApi.verifyOtp(token!, values.otp);
      navigate("/dashboard/transactions", { state: { transferred: true } });
    } catch (err: unknown) {
      setServerError(extractError(err));
    }
  }

  const isSubmitting1 = form1.formState.isSubmitting;
  const isSubmitting2 = form2.formState.isSubmitting;
  const isSubmitting3 = form3.formState.isSubmitting;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ffh-navy dark:text-white">Transfer funds</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Send money securely in three steps
        </p>
      </div>

      <StepIndicator current={step} />

      <Card className="max-w-lg">
        {/* ── Step 0: Details ── */}
        {step === 0 && (
          <>
            <CardHeader>
              <CardTitle>Transfer details</CardTitle>
              <CardDescription>Enter the sender, recipient, and amount.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form1.handleSubmit(onStep1)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="sender_account">From account</Label>
                  {eligibleAccounts.length === 0 ? (
                    <p className="text-sm text-amber-600">
                      No verified accounts. Complete KYC to transfer.
                    </p>
                  ) : (
                    <select
                      id="sender_account"
                      className="form-input"
                      {...form1.register("sender_account")}
                    >
                      <option value="">Select account…</option>
                      {eligibleAccounts.map((a) => (
                        <option key={a.id} value={a.account_number}>
                          {a.account_number} — {formatCurrency(a.account_balance, a.currency)}
                        </option>
                      ))}
                    </select>
                  )}
                  {form1.formState.errors.sender_account && (
                    <p className="text-xs text-ffh-danger">
                      {form1.formState.errors.sender_account.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="receiver_account">To account number</Label>
                  <Input
                    id="receiver_account"
                    placeholder="Recipient account number"
                    {...form1.register("receiver_account")}
                  />
                  {form1.formState.errors.receiver_account && (
                    <p className="text-xs text-ffh-danger">
                      {form1.formState.errors.receiver_account.message}
                    </p>
                  )}
                </div>

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

                <div className="space-y-1.5">
                  <Label htmlFor="description">
                    Description{" "}
                    <span className="text-gray-400">(optional)</span>
                  </Label>
                  <Input
                    id="description"
                    placeholder="e.g. Rent payment"
                    {...form1.register("description")}
                  />
                </div>

                {serverError && <ErrorBanner message={serverError} />}

                <Button type="submit" className="w-full" disabled={isSubmitting1}>
                  {isSubmitting1 ? (
                    <Loader2 size={16} className="mr-2 animate-spin" />
                  ) : (
                    <ArrowRight size={16} className="mr-2" />
                  )}
                  Continue
                </Button>
              </form>
            </CardContent>
          </>
        )}

        {/* ── Step 1: Security question ── */}
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle>Verify your identity</CardTitle>
              <CardDescription>Answer your security question to continue.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form2.handleSubmit(onStep2)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="security_answer">Security answer</Label>
                  <Input
                    id="security_answer"
                    type="password"
                    placeholder="Your answer"
                    autoFocus
                    {...form2.register("security_answer")}
                  />
                  {form2.formState.errors.security_answer && (
                    <p className="text-xs text-ffh-danger">
                      {form2.formState.errors.security_answer.message}
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
                  <Button type="submit" className="flex-1" disabled={isSubmitting2}>
                    {isSubmitting2 ? (
                      <Loader2 size={16} className="mr-2 animate-spin" />
                    ) : (
                      <ArrowRight size={16} className="mr-2" />
                    )}
                    Send OTP
                  </Button>
                </div>
              </form>
            </CardContent>
          </>
        )}

        {/* ── Step 2: OTP ── */}
        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle>Enter OTP</CardTitle>
              <CardDescription>
                A 6-digit code was sent to your email. Enter it to complete the transfer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form3.handleSubmit(onStep3)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="otp">One-time password</Label>
                  <Input
                    id="otp"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="123456"
                    className="text-center text-xl font-mono tracking-widest"
                    autoFocus
                    {...form3.register("otp")}
                  />
                  {form3.formState.errors.otp && (
                    <p className="text-xs text-ffh-danger">
                      {form3.formState.errors.otp.message}
                    </p>
                  )}
                </div>

                {serverError && <ErrorBanner message={serverError} />}

                <Button type="submit" className="w-full" disabled={isSubmitting3}>
                  {isSubmitting3 ? (
                    <Loader2 size={16} className="mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 size={16} className="mr-2" />
                  )}
                  Confirm transfer
                </Button>
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
