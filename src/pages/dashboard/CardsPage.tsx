import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreditCard,
  Eye,
  EyeOff,
  Snowflake,
  Play,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react";
import { cardsApi } from "@/api/cards";
import { accountsApi } from "@/api/accounts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, formatCurrency, maskCardNumber } from "@/lib/utils";
import type { VirtualCard, BankAccount } from "@/types";

export default function CardsPage() {
  const qc = useQueryClient();
  const [showTopUp, setShowTopUp] = useState<string | null>(null);

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ["cards"],
    queryFn: () => cardsApi.list().then((r) => r.data),
  });

  const { data: accounts = [] } = useQuery<BankAccount[]>({
    queryKey: ["accounts"],
    queryFn: () => accountsApi.list().then((r) => r.data),
  });

  const createCard = useMutation({
    mutationFn: (bank_account_number: string) => cardsApi.create(bank_account_number),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cards"] }),
  });

  const primaryAccount = accounts.find((a) => a.is_primary) ?? accounts[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ffh-navy dark:text-white">Virtual cards</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Up to 3 cards per account
          </p>
        </div>
        {cards.length < 3 && primaryAccount && (
          <Button
            onClick={() => createCard.mutate(primaryAccount.account_number)}
            disabled={createCard.isPending}
            size="sm"
          >
            {createCard.isPending ? (
              <Loader2 size={14} className="mr-2 animate-spin" />
            ) : (
              <Plus size={14} className="mr-2" />
            )}
            New card
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-ffh-teal" />
        </div>
      ) : cards.length === 0 ? (
        <EmptyState
          hasAccount={!!primaryAccount}
          onCreateCard={() =>
            primaryAccount && createCard.mutate(primaryAccount.account_number)
          }
          isCreating={createCard.isPending}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onToggleTopUp={() =>
                setShowTopUp(showTopUp === card.id ? null : card.id)
              }
              showTopUp={showTopUp === card.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Virtual card display ──────────────────────────────────────────────────────

function CardItem({
  card,
  onToggleTopUp,
  showTopUp,
}: {
  card: VirtualCard;
  onToggleTopUp: () => void;
  showTopUp: boolean;
}) {
  const qc = useQueryClient();
  const [cvv, setCvv] = useState<string | null>(null);
  const [cvvVisible, setCvvVisible] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpError, setTopUpError] = useState<string | null>(null);

  const isFrozen = card.status === "frozen";

  const revealCvv = useMutation({
    mutationFn: () => cardsApi.revealCvv(card.id),
    onSuccess: ({ data }) => {
      setCvv(data.cvv);
      setCvvVisible(true);
      // Auto-hide after 15 seconds
      setTimeout(() => setCvvVisible(false), 15_000);
    },
  });

  const toggleFreeze = useMutation({
    mutationFn: () =>
      cardsApi.updateStatus(card.id, isFrozen ? "active" : "frozen"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cards"] }),
  });

  const deleteCard = useMutation({
    mutationFn: () => cardsApi.delete(card.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cards"] }),
  });

  const topUp = useMutation({
    mutationFn: () => cardsApi.topUp(card.id, topUpAmount),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cards"] });
      qc.invalidateQueries({ queryKey: ["accounts"] });
      setTopUpAmount("");
      onToggleTopUp();
    },
    onError: (err: unknown) => {
      const data = (err as { response?: { data?: { error?: string } } })?.response?.data;
      setTopUpError(data?.error ?? "Top-up failed.");
    },
  });

  // Format expiry
  const expiry = new Date(card.expiry_date);
  const expiryStr = `${String(expiry.getMonth() + 1).padStart(2, "0")}/${String(expiry.getFullYear()).slice(-2)}`;

  return (
    <div className="space-y-3">
      {/* Card visual */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl p-6 text-white shadow-lg",
          isFrozen
            ? "bg-gradient-to-br from-gray-500 to-gray-700"
            : "bg-gradient-to-br from-ffh-navy via-ffh-blue to-ffh-teal",
        )}
      >
        {/* Frosted overlay when frozen */}
        {isFrozen && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
              <Snowflake size={16} />
              Card frozen
            </div>
          </div>
        )}

        <div className="flex items-start justify-between">
          <span className="text-sm font-semibold tracking-widest opacity-80">VISA</span>
          <CreditCard size={28} className="opacity-60" />
        </div>

        <p className="mt-8 font-mono text-lg tracking-widest">
          {maskCardNumber(card.card_number)}
        </p>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase opacity-60">Balance</p>
            <p className="text-xl font-bold">{formatCurrency(card.balance)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase opacity-60">Expires</p>
            <p className="font-mono text-sm">{expiryStr}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase opacity-60">CVV</p>
            <div className="flex items-center gap-1">
              <p className="font-mono text-sm">
                {cvvVisible && cvv ? cvv : "•••"}
              </p>
              <button
                onClick={() => {
                  if (!cvv) revealCvv.mutate();
                  else setCvvVisible((v) => !v);
                }}
                className="opacity-60 hover:opacity-100"
                disabled={revealCvv.isPending}
                title={cvvVisible ? "Hide CVV" : "Reveal CVV"}
              >
                {revealCvv.isPending ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : cvvVisible ? (
                  <EyeOff size={12} />
                ) : (
                  <Eye size={12} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => toggleFreeze.mutate()}
          disabled={toggleFreeze.isPending}
        >
          {toggleFreeze.isPending ? (
            <Loader2 size={13} className="mr-1.5 animate-spin" />
          ) : isFrozen ? (
            <Play size={13} className="mr-1.5" />
          ) : (
            <Snowflake size={13} className="mr-1.5" />
          )}
          {isFrozen ? "Unfreeze" : "Freeze"}
        </Button>

        <Button
          size="sm"
          className="flex-1"
          onClick={onToggleTopUp}
        >
          <Plus size={13} className="mr-1.5" />
          Top up
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => deleteCard.mutate()}
          disabled={deleteCard.isPending || parseFloat(card.balance) > 0}
          title={
            parseFloat(card.balance) > 0
              ? "Cannot delete a card with balance"
              : "Delete card"
          }
        >
          {deleteCard.isPending ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Trash2 size={13} />
          )}
        </Button>
      </div>

      {/* Top-up form */}
      {showTopUp && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <Label htmlFor={`topup-${card.id}`}>Amount to top up</Label>
            <div className="flex gap-2">
              <Input
                id={`topup-${card.id}`}
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={topUpAmount}
                onChange={(e) => {
                  setTopUpAmount(e.target.value);
                  setTopUpError(null);
                }}
              />
              <Button
                onClick={() => topUp.mutate()}
                disabled={topUp.isPending || !topUpAmount}
              >
                {topUp.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  "Add"
                )}
              </Button>
            </div>
            {topUpError && (
              <p className="text-xs text-ffh-danger">{topUpError}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function EmptyState({
  hasAccount,
  onCreateCard,
  isCreating,
}: {
  hasAccount: boolean;
  onCreateCard: () => void;
  isCreating: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center py-16 text-center">
        <CreditCard size={40} className="mb-4 text-gray-300" />
        <h3 className="mb-1 text-lg font-semibold text-ffh-navy dark:text-white">
          No virtual cards yet
        </h3>
        <p className="mb-6 max-w-xs text-sm text-gray-500 dark:text-gray-400">
          {hasAccount
            ? "Create your first virtual card. CVV is generated securely and never stored."
            : "You need a bank account before creating a virtual card."}
        </p>
        {hasAccount && (
          <Button onClick={onCreateCard} disabled={isCreating}>
            {isCreating && <Loader2 size={14} className="mr-2 animate-spin" />}
            <Plus size={14} className="mr-2" />
            Create card
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
