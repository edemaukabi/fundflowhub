import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, CheckCircle2, Loader2, User } from "lucide-react";
import { tellerApi, type CustomerInfo } from "@/api/teller";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

const lookupSchema = z.object({
  account_number: z.string().min(5, "Enter a valid account number"),
});

const depositSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, "Must be positive"),
});

type LookupForm = z.infer<typeof lookupSchema>;
type DepositForm = z.infer<typeof depositSchema>;

export default function DepositPage() {
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [depositError, setDepositError] = useState<string | null>(null);

  const lookupForm = useForm<LookupForm>({ resolver: zodResolver(lookupSchema) });
  const depositForm = useForm<DepositForm>({ resolver: zodResolver(depositSchema) });

  async function onLookup(values: LookupForm) {
    setLookupError(null);
    setCustomer(null);
    setSuccessMsg(null);
    try {
      const { data } = await tellerApi.lookupAccount(values.account_number);
      setCustomer(data);
      setAccountNumber(values.account_number);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Account not found.";
      setLookupError(msg);
    }
  }

  async function onDeposit(values: DepositForm) {
    setDepositError(null);
    try {
      const { data } = await tellerApi.deposit(accountNumber, values.amount);
      setSuccessMsg(data.message);
      setCustomer((prev) =>
        prev ? { ...prev, account_balance: data.new_balance } : null,
      );
      depositForm.reset();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Deposit failed.";
      setDepositError(msg);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ffh-navy dark:text-white">Make a deposit</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Look up a customer account and deposit funds
        </p>
      </div>

      {/* Account lookup */}
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Find account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={lookupForm.handleSubmit(onLookup)} className="flex gap-2">
            <Input
              placeholder="Account number"
              {...lookupForm.register("account_number")}
            />
            <Button type="submit" disabled={lookupForm.formState.isSubmitting}>
              {lookupForm.formState.isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
            </Button>
          </form>
          {lookupForm.formState.errors.account_number && (
            <p className="mt-1 text-xs text-ffh-danger">
              {lookupForm.formState.errors.account_number.message}
            </p>
          )}
          {lookupError && (
            <p className="mt-2 text-sm text-ffh-danger">{lookupError}</p>
          )}
        </CardContent>
      </Card>

      {/* Customer info + deposit form */}
      {customer && (
        <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
          {/* Customer card */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                {customer.photo_url ? (
                  <img
                    src={customer.photo_url}
                    alt="Customer"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ffh-navy/10 dark:bg-white/10">
                    <User size={20} className="text-ffh-navy dark:text-white" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-ffh-navy dark:text-white">
                    {customer.full_name}
                  </p>
                  <p className="text-xs text-gray-500">{customer.email}</p>
                </div>
              </div>
              <div className="rounded-lg bg-ffh-bg p-3 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {customer.account_type} · {accountNumber}
                </p>
                <p className="mt-1 text-xl font-bold text-ffh-navy dark:text-white">
                  {formatCurrency(customer.account_balance, customer.currency)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Deposit form */}
          <Card>
            <CardHeader>
              <CardTitle>Deposit amount</CardTitle>
            </CardHeader>
            <CardContent>
              {successMsg ? (
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                  <CheckCircle2 size={36} className="text-ffh-teal" />
                  <p className="text-sm font-medium text-ffh-teal">{successMsg}</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSuccessMsg(null);
                      setCustomer(null);
                      lookupForm.reset();
                    }}
                  >
                    New deposit
                  </Button>
                </div>
              ) : (
                <form onSubmit={depositForm.handleSubmit(onDeposit)} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      autoFocus
                      {...depositForm.register("amount")}
                    />
                    {depositForm.formState.errors.amount && (
                      <p className="text-xs text-ffh-danger">
                        {depositForm.formState.errors.amount.message}
                      </p>
                    )}
                  </div>
                  {depositError && (
                    <p className="text-sm text-ffh-danger">{depositError}</p>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={depositForm.formState.isSubmitting}
                  >
                    {depositForm.formState.isSubmitting && (
                      <Loader2 size={14} className="mr-2 animate-spin" />
                    )}
                    Confirm deposit
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
