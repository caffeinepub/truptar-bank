import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "@tanstack/react-router";
import {
  Building2,
  DollarSign,
  LogOut,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Transaction } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function DashboardPage() {
  const { identity, clear } = useInternetIdentity();
  const { actor } = useActor();
  const navigate = useNavigate();
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      void navigate({ to: "/login" });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (actor && isLoggedIn) {
      void loadData();
    }
  }, [actor, isLoggedIn]);

  async function loadData() {
    if (!actor) return;
    setLoading(true);
    try {
      const [bal, txns] = await Promise.all([
        actor.getBalance(),
        actor.getTransactions(),
      ]);
      setBalance(bal);
      setTransactions(txns);
    } catch {
      toast.error("Failed to load account data.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeposit() {
    if (!actor || !amount) return;
    setProcessing(true);
    try {
      const date = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      await actor.deposit(Number.parseFloat(amount), "Deposit", date);
      await loadData();
      setDepositOpen(false);
      setAmount("");
      toast.success(
        `Deposited $${Number.parseFloat(amount).toFixed(2)} successfully.`,
      );
    } catch {
      toast.error("Deposit failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  async function handleWithdraw() {
    if (!actor || !amount) return;
    setProcessing(true);
    try {
      const date = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      await actor.withdraw(Number.parseFloat(amount), "Withdrawal", date);
      await loadData();
      setWithdrawOpen(false);
      setAmount("");
      toast.success(
        `Withdrew $${Number.parseFloat(amount).toFixed(2)} successfully.`,
      );
    } catch {
      toast.error("Insufficient funds or withdrawal failed.");
    } finally {
      setProcessing(false);
    }
  }

  function handleLogout() {
    clear();
    void navigate({ to: "/" });
  }

  const principalStr = identity?.getPrincipal().toString() ?? "";
  const shortId = principalStr ? `${principalStr.slice(0, 8)}...` : "";

  return (
    <div
      className="min-h-screen bg-slate-50 py-8 px-4"
      data-ocid="dashboard.page"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-bank-navy rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-bank-gold" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-bank-navy">
                Welcome back
              </h1>
              <p className="text-muted-foreground text-xs">{shortId}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-bank-navy text-bank-navy hover:bg-bank-navy hover:text-white"
            data-ocid="dashboard.logout.button"
          >
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>

        <Card
          className="bg-bank-navy text-white mb-6 border-0 shadow-lg"
          data-ocid="dashboard.balance.card"
        >
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-white/60 text-sm uppercase tracking-widest mb-2">
              Available Balance
            </p>
            {loading ? (
              <div
                className="h-12 w-40 bg-white/20 rounded-lg animate-pulse mx-auto"
                data-ocid="dashboard.balance.loading_state"
              />
            ) : (
              <p className="font-display text-5xl font-bold text-bank-gold">
                $
                {balance !== null
                  ? balance.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "0.00"}
              </p>
            )}
            <p className="text-white/50 text-xs mt-3">
              TRUPTAR Community Checking
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Button
            size="lg"
            onClick={() => {
              setAmount("");
              setDepositOpen(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold h-14"
            data-ocid="dashboard.deposit.button"
          >
            <TrendingUp className="h-5 w-5 mr-2" /> Deposit
          </Button>
          <Button
            size="lg"
            onClick={() => {
              setAmount("");
              setWithdrawOpen(true);
            }}
            className="bg-bank-navy hover:bg-bank-navy/90 text-white font-semibold h-14"
            data-ocid="dashboard.withdraw.button"
          >
            <TrendingDown className="h-5 w-5 mr-2" /> Withdraw
          </Button>
        </div>

        <Card className="border-border" data-ocid="dashboard.transactions.card">
          <CardHeader>
            <CardTitle className="font-display text-lg text-bank-navy flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-bank-gold" /> Recent
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div
                className="p-6 space-y-3"
                data-ocid="dashboard.transactions.loading_state"
              >
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 bg-slate-100 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div
                className="p-8 text-center text-muted-foreground"
                data-ocid="dashboard.transactions.empty_state"
              >
                No transactions yet. Make your first deposit!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-bank-navy font-semibold">
                      Date
                    </TableHead>
                    <TableHead className="text-bank-navy font-semibold">
                      Description
                    </TableHead>
                    <TableHead className="text-bank-navy font-semibold text-right">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t, i) => (
                    <TableRow
                      key={`txn-${t.date}-${t.description}-${i}`}
                      data-ocid={`dashboard.transactions.row.${i + 1}`}
                    >
                      <TableCell className="text-muted-foreground text-sm">
                        {t.date}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {t.description}
                      </TableCell>
                      <TableCell
                        className={`text-right font-semibold text-sm ${t.isDeposit ? "text-green-600" : "text-red-500"}`}
                      >
                        {t.isDeposit ? "+" : "-"}$
                        {t.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
        <DialogContent data-ocid="dashboard.deposit.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-bank-navy">
              Deposit Funds
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Label htmlFor="deposit-amount">Amount ($)</Label>
            <Input
              id="deposit-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              data-ocid="dashboard.deposit.input"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDepositOpen(false)}
              data-ocid="dashboard.deposit.cancel.button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeposit}
              disabled={processing || !amount}
              className="bg-green-600 hover:bg-green-700 text-white"
              data-ocid="dashboard.deposit.confirm.button"
            >
              {processing ? "Processing..." : "Deposit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent data-ocid="dashboard.withdraw.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-bank-navy">
              Withdraw Funds
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Label htmlFor="withdraw-amount">Amount ($)</Label>
            <Input
              id="withdraw-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              data-ocid="dashboard.withdraw.input"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setWithdrawOpen(false)}
              data-ocid="dashboard.withdraw.cancel.button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={processing || !amount}
              className="bg-bank-navy text-white hover:bg-bank-navy/90"
              data-ocid="dashboard.withdraw.confirm.button"
            >
              {processing ? "Processing..." : "Withdraw"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
