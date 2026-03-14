import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  CreditCard,
  Database,
  Globe,
  Key,
  Lock,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Timer,
  Wallet,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────
type WalletId = "apple" | "google" | "samsung";
interface WalletState {
  connected: boolean;
  accountLinked: boolean;
}
type WalletMap = Record<WalletId, WalletState>;

const WALLETS: { id: WalletId; name: string; icon: string; color: string }[] = [
  {
    id: "apple",
    name: "Apple Pay",
    icon: "🍎",
    color: "bg-gray-900 text-white",
  },
  {
    id: "google",
    name: "Google Pay",
    icon: "G",
    color: "bg-white text-gray-700 border border-gray-200",
  },
  {
    id: "samsung",
    name: "Samsung Pay",
    icon: "S",
    color: "bg-blue-600 text-white",
  },
];

const MODULES = [
  {
    name: "Authentication System",
    desc: "Secure identity verification and session management",
    icon: Key,
  },
  {
    name: "Account Management System",
    desc: "Multi-account lifecycle and balance tracking",
    icon: Database,
  },
  {
    name: "Transaction Engine",
    desc: "Real-time payment processing and ledger updates",
    icon: Zap,
  },
  {
    name: "Loan Management System",
    desc: "Application, approval, and repayment workflows",
    icon: CreditCard,
  },
  {
    name: "Business Banking Module",
    desc: "Corporate accounts, payroll, and merchant services",
    icon: Globe,
  },
  {
    name: "Digital Wallet Integration",
    desc: "Apple Pay, Google Pay, Samsung Pay connectivity",
    icon: Wallet,
  },
  {
    name: "Payment Processing System",
    desc: "Bill pay, ACH transfers, and recurring payments",
    icon: RefreshCw,
  },
];

// ─── Digital Wallet Section ───────────────────────────────────────────────────
function DigitalWalletSection() {
  const [wallets, setWallets] = useState<WalletMap>({
    apple: { connected: false, accountLinked: false },
    google: { connected: false, accountLinked: false },
    samsung: { connected: false, accountLinked: false },
  });
  const [linkDialogOpen, setLinkDialogOpen] = useState<WalletId | null>(null);
  const [accountInput, setAccountInput] = useState("");

  const connectWallet = (id: WalletId) => {
    setWallets((prev) => ({ ...prev, [id]: { ...prev[id], connected: true } }));
    toast.success(`${WALLETS.find((w) => w.id === id)?.name} connected!`);
  };

  const authorizePayment = (id: WalletId) => {
    toast.success(
      `Payment authorized via ${WALLETS.find((w) => w.id === id)?.name}`,
    );
  };

  const linkAccount = (id: WalletId) => {
    if (!accountInput.trim()) {
      toast.error("Please enter an account number");
      return;
    }
    setWallets((prev) => ({
      ...prev,
      [id]: { ...prev[id], accountLinked: true },
    }));
    setLinkDialogOpen(null);
    setAccountInput("");
    toast.success("Bank account linked successfully!");
  };

  return (
    <section className="py-12 bg-slate-50" data-ocid="digital.wallet.section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
        <h2 className="font-display text-3xl font-bold text-bank-navy mb-2">
          Digital Wallet
        </h2>
        <p className="text-muted-foreground mb-8">
          Connect your preferred mobile payment platform to your TRUPTAR
          account.
        </p>

        <div className="grid sm:grid-cols-3 gap-6">
          {WALLETS.map((wallet) => {
            const state = wallets[wallet.id];
            const ocidBase = `digital_wallet.${wallet.id}_pay`;
            return (
              <Card
                key={wallet.id}
                className="border-border bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${wallet.color}`}
                    >
                      {wallet.icon}
                    </div>
                    {state.connected && (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Linked
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base text-bank-navy">
                    {wallet.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {!state.connected ? (
                    <Button
                      className="w-full bg-bank-navy text-white hover:bg-bank-navy/90 text-sm"
                      onClick={() => connectWallet(wallet.id)}
                      data-ocid={`${ocidBase}.button`}
                    >
                      Connect {wallet.name}
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full border-bank-gold text-bank-navy hover:bg-bank-gold/10 text-sm"
                        onClick={() => authorizePayment(wallet.id)}
                        data-ocid={`${ocidBase}.button`}
                      >
                        Authorize Payment
                      </Button>
                      <Dialog
                        open={linkDialogOpen === wallet.id}
                        onOpenChange={(open) =>
                          setLinkDialogOpen(open ? wallet.id : null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full text-bank-navy text-sm"
                            data-ocid="digital_wallet.link_account.open_modal_button"
                          >
                            {state.accountLinked
                              ? "Change Linked Account"
                              : "Link Bank Account"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent data-ocid="digital_wallet.link_account.dialog">
                          <DialogHeader>
                            <DialogTitle className="font-display text-bank-navy">
                              Link Bank Account to {wallet.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-2">
                            <Label htmlFor="link-account-input">
                              Account Number
                            </Label>
                            <Input
                              id="link-account-input"
                              placeholder="Enter your account number"
                              value={accountInput}
                              onChange={(e) => setAccountInput(e.target.value)}
                              data-ocid="digital_wallet.link_account.input"
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setLinkDialogOpen(null)}
                              data-ocid="digital_wallet.link_account.cancel_button"
                            >
                              Cancel
                            </Button>
                            <Button
                              className="bg-bank-navy text-white hover:bg-bank-navy/90"
                              onClick={() => linkAccount(wallet.id)}
                              data-ocid="digital_wallet.link_account.submit_button"
                            >
                              Link Account
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Bill Payment Section ─────────────────────────────────────────────────────
function BillPaymentSection() {
  const [payeeName, setPayeeName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentType, setPaymentType] = useState<"one-time" | "recurring">(
    "one-time",
  );
  const [frequency, setFrequency] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payeeName || !accountNumber || !amount || !paymentDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitted(true);
    toast.success(
      `Payment of $${amount} to ${payeeName} scheduled successfully!`,
    );
    setTimeout(() => {
      setPayeeName("");
      setAccountNumber("");
      setAmount("");
      setPaymentDate("");
      setPaymentType("one-time");
      setFrequency("");
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section
      className="py-12 bg-white"
      data-ocid="digital.bill_payment.section"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
        <h2 className="font-display text-3xl font-bold text-bank-navy mb-2">
          Bill Payment System
        </h2>
        <p className="text-muted-foreground mb-8">
          Schedule one-time or recurring bill payments directly from your
          account.
        </p>

        <Card className="max-w-2xl border-border shadow-sm">
          <CardContent className="pt-6">
            {submitted ? (
              <div
                className="flex flex-col items-center gap-3 py-10 text-center"
                data-ocid="bill_payment.success_state"
              >
                <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                <h3 className="font-display text-xl font-bold text-bank-navy">
                  Payment Scheduled!
                </h3>
                <p className="text-muted-foreground">
                  Your payment has been confirmed and will be processed on the
                  selected date.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="bp-payee">Payee Name *</Label>
                    <Input
                      id="bp-payee"
                      placeholder="e.g. TRUPTAR Mortgage"
                      value={payeeName}
                      onChange={(e) => setPayeeName(e.target.value)}
                      data-ocid="bill_payment.payee_name.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bp-acct">Account Number *</Label>
                    <Input
                      id="bp-acct"
                      placeholder="e.g. 123456789"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      data-ocid="bill_payment.account_number.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bp-amount">Payment Amount ($) *</Label>
                    <Input
                      id="bp-amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      data-ocid="bill_payment.amount.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bp-date">Payment Date *</Label>
                    <Input
                      id="bp-date"
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      data-ocid="bill_payment.date.input"
                    />
                  </div>
                </div>

                {/* Payment Type */}
                <div className="space-y-3">
                  <Label>Payment Type</Label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment-type"
                        value="one-time"
                        checked={paymentType === "one-time"}
                        onChange={() => setPaymentType("one-time")}
                        className="accent-bank-navy"
                        data-ocid="bill_payment.one_time.radio"
                      />
                      <span className="text-sm font-medium text-bank-navy">
                        One-time Payment
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment-type"
                        value="recurring"
                        checked={paymentType === "recurring"}
                        onChange={() => setPaymentType("recurring")}
                        className="accent-bank-navy"
                        data-ocid="bill_payment.recurring.radio"
                      />
                      <span className="text-sm font-medium text-bank-navy">
                        Recurring Payment
                      </span>
                    </label>
                  </div>
                </div>

                {paymentType === "recurring" && (
                  <div className="space-y-1.5">
                    <Label>Frequency</Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger data-ocid="bill_payment.frequency.select">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-bank-navy text-white hover:bg-bank-navy/90 font-semibold py-2.5 h-auto"
                  data-ocid="bill_payment.confirm.button"
                >
                  Confirm Payment
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// ─── Security Features Section ────────────────────────────────────────────────
function SecurityFeaturesSection() {
  const [twoFA, setTwoFA] = useState(true);
  const [fraudDetection, setFraudDetection] = useState(true);
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30min");

  return (
    <section className="py-12 bg-slate-50" data-ocid="digital.security.section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
        <h2 className="font-display text-3xl font-bold text-bank-navy mb-2">
          Security Features
        </h2>
        <p className="text-muted-foreground mb-8">
          Enterprise-grade security protecting every transaction and account
          interaction.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
          {/* Two-Factor Auth */}
          <Card className="border-border bg-white">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-bank-navy/10 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-bank-navy" />
                </div>
                <div>
                  <p className="font-semibold text-bank-navy text-sm">
                    Two-Factor Auth
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {twoFA ? "Active" : "Disabled"}
                  </p>
                </div>
              </div>
              <Switch
                checked={twoFA}
                onCheckedChange={(v) => {
                  setTwoFA(v);
                  toast(v ? "2FA enabled" : "2FA disabled");
                }}
                data-ocid="security.twofa.toggle"
              />
            </CardContent>
          </Card>

          {/* Encryption – always active */}
          <Card className="border-border bg-white">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-bank-navy text-sm">
                    256-bit Encryption
                  </p>
                  <p className="text-xs text-muted-foreground">Always active</p>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                Active
              </Badge>
            </CardContent>
          </Card>

          {/* Fraud Detection */}
          <Card className="border-border bg-white">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-bank-navy/10 flex items-center justify-center">
                  <ShieldAlert className="h-5 w-5 text-bank-navy" />
                </div>
                <div>
                  <p className="font-semibold text-bank-navy text-sm">
                    Fraud Detection
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fraudDetection ? "Monitoring active" : "Disabled"}
                  </p>
                </div>
              </div>
              <Switch
                checked={fraudDetection}
                onCheckedChange={(v) => {
                  setFraudDetection(v);
                  toast(
                    v ? "Fraud detection enabled" : "Fraud detection disabled",
                  );
                }}
                data-ocid="security.fraud_detection.toggle"
              />
            </CardContent>
          </Card>

          {/* Transaction Alerts */}
          <Card className="border-border bg-white">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-bank-navy/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-bank-navy" />
                </div>
                <div>
                  <p className="font-semibold text-bank-navy text-sm">
                    Transaction Alerts
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transactionAlerts ? "Notifications on" : "Muted"}
                  </p>
                </div>
              </div>
              <Switch
                checked={transactionAlerts}
                onCheckedChange={(v) => {
                  setTransactionAlerts(v);
                  toast(v ? "Transaction alerts on" : "Transaction alerts off");
                }}
                data-ocid="security.transaction_alerts.toggle"
              />
            </CardContent>
          </Card>

          {/* Session Security */}
          <Card className="border-border bg-white sm:col-span-2">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-bank-navy/10 flex items-center justify-center">
                  <Timer className="h-5 w-5 text-bank-navy" />
                </div>
                <div>
                  <p className="font-semibold text-bank-navy text-sm">
                    Session Security
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Auto-logout after inactivity
                  </p>
                </div>
              </div>
              <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                <SelectTrigger
                  className="w-32"
                  data-ocid="security.session_timeout.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15min">15 min</SelectItem>
                  <SelectItem value="30min">30 min</SelectItem>
                  <SelectItem value="1hr">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// ─── System Modules Section ───────────────────────────────────────────────────
function SystemModulesSection() {
  return (
    <section className="py-12 bg-white" data-ocid="digital.modules.section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
        <h2 className="font-display text-3xl font-bold text-bank-navy mb-2">
          Developer-Ready System Modules
        </h2>
        <p className="text-muted-foreground mb-8">
          All seven core banking modules are active and integrated within the
          TRUPTAR platform.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((mod, i) => (
            <Card
              key={mod.name}
              className="border-border bg-white hover:shadow-md transition-shadow"
              data-ocid={`digital.modules.item.${i + 1}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 bg-bank-navy/10 rounded-lg flex items-center justify-center">
                    <mod.icon className="h-5 w-5 text-bank-navy" />
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                    Active
                  </Badge>
                </div>
                <CardTitle className="text-sm font-semibold text-bank-navy leading-snug">
                  {mod.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-xs">{mod.desc}</p>
              </CardContent>
            </Card>
          ))}

          {/* Filler card to keep grid even if needed */}
          <Card className="border-dashed border-border bg-slate-50 hidden lg:flex items-center justify-center">
            <CardContent className="text-center py-8">
              <Code2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">
                More modules coming soon
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DigitalBankingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-bank-navy py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Digital Banking Infrastructure
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Modern financial technology built on a foundation of security,
            accessibility, and innovation — with full digital wallet, bill pay,
            and enterprise security integration.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/dashboard" data-ocid="digital.dashboard.link">
              <Button className="bg-bank-gold text-bank-navy hover:bg-bank-gold/90 font-semibold">
                Access Dashboard <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/login" data-ocid="digital.login.link">
              <Button
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <DigitalWalletSection />
      <BillPaymentSection />
      <SecurityFeaturesSection />
      <SystemModulesSection />

      {/* CTA */}
      <section className="py-16 bg-bank-navy text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Bank Smarter, Not Harder
          </h2>
          <p className="text-white/70 mb-8">
            All your digital banking tools in one secure, modern platform.
          </p>
          <Link to="/login" data-ocid="digital.cta.login.link">
            <Button className="bg-bank-gold text-bank-navy hover:bg-bank-gold/90 font-semibold text-lg px-8 py-3 h-auto">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
