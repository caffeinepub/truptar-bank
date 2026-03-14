import type { LoanStatus } from "@/backend";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BadgeDollarSign,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileText,
  Loader2,
  Lock,
  QrCode,
  Receipt,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
function today() {
  return new Date().toISOString().split("T")[0];
}

function LoginPrompt() {
  const { login, isLoggingIn } = useInternetIdentity();
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="max-w-md w-full border-2 border-bank-gold/20 shadow-lg">
        <CardContent className="pt-10 pb-10 text-center">
          <div className="w-14 h-14 bg-bank-navy rounded-xl flex items-center justify-center mx-auto mb-5">
            <Lock className="h-7 w-7 text-bank-gold" />
          </div>
          <h2 className="font-display text-2xl font-bold text-bank-navy mb-2">
            Sign In Required
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Access your Business Banking dashboard by signing in securely.
          </p>
          <Button
            className="bg-bank-navy hover:bg-bank-navy/90 text-white font-semibold w-full"
            onClick={login}
            disabled={isLoggingIn}
            data-ocid="business.login.primary_button"
          >
            {isLoggingIn ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoggingIn ? "Signing in…" : "Sign In to Continue"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <Card
      className={`border ${
        accent ? "border-bank-gold/30 bg-bank-gold/5" : "border-border bg-white"
      }`}
    >
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              accent ? "bg-bank-gold/20" : "bg-bank-navy/10"
            }`}
          >
            <Icon
              className={`h-4 w-4 ${
                accent ? "text-bank-gold" : "text-bank-navy"
              }`}
            />
          </div>
        </div>
        <p
          className={`font-display text-2xl font-bold ${
            accent ? "text-bank-gold" : "text-bank-navy"
          }`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function BusinessAccountTab() {
  const qc = useQueryClient();
  const { actor, isFetching: actorFetching } = useActor();

  const { data: account, isLoading } = useQuery({
    queryKey: ["businessAccount"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBusinessAccount();
    },
    enabled: !!actor && !actorFetching,
  });

  const [sendOpen, setSendOpen] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [sendRecipient, setSendRecipient] = useState("");
  const [sendDesc, setSendDesc] = useState("");

  const sendMutation = useMutation({
    mutationFn: () =>
      actor!.sendBusinessPayment(
        Number.parseFloat(sendAmount),
        sendRecipient,
        today(),
        sendDesc,
      ),
    onSuccess: () => {
      toast.success("Payment sent successfully");
      qc.invalidateQueries({ queryKey: ["businessAccount"] });
      setSendOpen(false);
      setSendAmount("");
      setSendRecipient("");
      setSendDesc("");
    },
    onError: () => toast.error("Failed to send payment"),
  });

  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [invAmount, setInvAmount] = useState("");
  const [invFrom, setInvFrom] = useState("");
  const [invDesc, setInvDesc] = useState("");

  const invoiceMutation = useMutation({
    mutationFn: () =>
      actor!.recordIncomingBusinessPayment(
        Number.parseFloat(invAmount),
        invFrom,
        today(),
        invDesc,
      ),
    onSuccess: () => {
      toast.success("Invoice payment recorded");
      qc.invalidateQueries({ queryKey: ["businessAccount"] });
      setInvoiceOpen(false);
      setInvAmount("");
      setInvFrom("");
      setInvDesc("");
    },
    onError: () => toast.error("Failed to record invoice payment"),
  });

  const incoming = account?.incomingPayments ?? [];
  const outgoing = account?.outgoingPayments ?? [];

  type TxRow = {
    date: string;
    description: string;
    counterparty: string;
    amount: number;
    direction: "in" | "out";
  };

  const allTx: TxRow[] = [
    ...incoming.map((p) => ({
      date: p.date,
      description: p.description,
      counterparty: p.recipient,
      amount: p.amount,
      direction: "in" as const,
    })),
    ...outgoing.map((p) => ({
      date: p.date,
      description: p.description,
      counterparty: p.recipient,
      amount: p.amount,
      direction: "out" as const,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const totalIn = incoming.reduce((s, p) => s + p.amount, 0);
  const totalOut = outgoing.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div
          className="flex items-center justify-center py-12"
          data-ocid="business.account.loading_state"
        >
          <Loader2 className="h-6 w-6 animate-spin text-bank-navy" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Business Balance"
              value={fmt(account?.businessBalance ?? 0)}
              icon={BadgeDollarSign}
              accent
            />
            <StatCard
              label="Total Incoming"
              value={fmt(totalIn)}
              icon={ArrowDownLeft}
            />
            <StatCard
              label="Total Outgoing"
              value={fmt(totalOut)}
              icon={ArrowUpRight}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Dialog open={sendOpen} onOpenChange={setSendOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-bank-navy hover:bg-bank-navy/90 text-white"
                  data-ocid="business.account.send.open_modal_button"
                >
                  <ArrowUpRight className="h-4 w-4 mr-2" /> Send Payment
                </Button>
              </DialogTrigger>
              <DialogContent data-ocid="business.account.send.dialog">
                <DialogHeader>
                  <DialogTitle className="font-display text-bank-navy">
                    Send Payment
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-1">
                    <Label htmlFor="send-amount">Amount ($)</Label>
                    <Input
                      id="send-amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      data-ocid="business.account.send.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="send-recipient">Recipient</Label>
                    <Input
                      id="send-recipient"
                      placeholder="Recipient name or account"
                      value={sendRecipient}
                      onChange={(e) => setSendRecipient(e.target.value)}
                      data-ocid="business.account.send.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="send-desc">Description</Label>
                    <Input
                      id="send-desc"
                      placeholder="Payment description"
                      value={sendDesc}
                      onChange={(e) => setSendDesc(e.target.value)}
                      data-ocid="business.account.send.input"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setSendOpen(false)}
                    data-ocid="business.account.send.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-bank-navy hover:bg-bank-navy/90 text-white"
                    onClick={() => sendMutation.mutate()}
                    disabled={
                      sendMutation.isPending || !sendAmount || !sendRecipient
                    }
                    data-ocid="business.account.send.submit_button"
                  >
                    {sendMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {sendMutation.isPending ? "Sending…" : "Send Payment"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-bank-navy text-bank-navy hover:bg-bank-navy/5"
                  data-ocid="business.account.invoice.open_modal_button"
                >
                  <Receipt className="h-4 w-4 mr-2" /> Request Invoice Payment
                </Button>
              </DialogTrigger>
              <DialogContent data-ocid="business.account.invoice.dialog">
                <DialogHeader>
                  <DialogTitle className="font-display text-bank-navy">
                    Request Invoice Payment
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-1">
                    <Label htmlFor="inv-amount">Amount ($)</Label>
                    <Input
                      id="inv-amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      value={invAmount}
                      onChange={(e) => setInvAmount(e.target.value)}
                      data-ocid="business.account.invoice.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="inv-from">From (Client / Payer)</Label>
                    <Input
                      id="inv-from"
                      placeholder="Client name or company"
                      value={invFrom}
                      onChange={(e) => setInvFrom(e.target.value)}
                      data-ocid="business.account.invoice.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="inv-desc">Description</Label>
                    <Input
                      id="inv-desc"
                      placeholder="Invoice reference or description"
                      value={invDesc}
                      onChange={(e) => setInvDesc(e.target.value)}
                      data-ocid="business.account.invoice.input"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setInvoiceOpen(false)}
                    data-ocid="business.account.invoice.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-bank-navy hover:bg-bank-navy/90 text-white"
                    onClick={() => invoiceMutation.mutate()}
                    disabled={
                      invoiceMutation.isPending || !invAmount || !invFrom
                    }
                    data-ocid="business.account.invoice.submit_button"
                  >
                    {invoiceMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {invoiceMutation.isPending
                      ? "Recording…"
                      : "Record Payment"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              className="border-bank-gold text-bank-navy hover:bg-bank-gold/10"
              onClick={() => {
                const el = document.querySelector(
                  '[data-ocid="biz.payroll.tab"]',
                );
                if (el) (el as HTMLElement).click();
              }}
              data-ocid="business.account.payroll.button"
            >
              <Users className="h-4 w-4 mr-2" /> Payroll Processing
            </Button>
          </div>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-bank-navy text-lg">
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {allTx.length === 0 ? (
                <div
                  className="py-10 text-center text-muted-foreground text-sm"
                  data-ocid="business.account.transactions.empty_state"
                >
                  No transactions yet.
                </div>
              ) : (
                <Table data-ocid="business.account.transactions.table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Counterparty</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTx.slice(0, 20).map((tx, i) => (
                      <TableRow
                        key={`${tx.date}-${tx.counterparty}-${i}`}
                        data-ocid={`business.account.transactions.item.${i + 1}`}
                      >
                        <TableCell className="text-muted-foreground text-sm">
                          {tx.date}
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          {tx.description}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {tx.counterparty}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`font-semibold ${
                              tx.direction === "in"
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {tx.direction === "in" ? "+" : "-"}
                            {fmt(tx.amount)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function BusinessLoansTab() {
  const qc = useQueryClient();
  const { actor, isFetching: actorFetching } = useActor();

  const { data: loanApps, isLoading } = useQuery({
    queryKey: ["businessLoanApplications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyBusinessLoanApplications();
    },
    enabled: !!actor && !actorFetching,
  });

  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    annualRevenue: "",
    loanAmount: "",
    loanPurpose: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: () =>
      actor!.submitBusinessLoanApplication(
        formData.businessName,
        formData.businessType,
        Number.parseFloat(formData.annualRevenue),
        Number.parseFloat(formData.loanAmount),
        formData.loanPurpose,
        new Date().toISOString(),
      ),
    onSuccess: () => {
      toast.success("Loan application submitted!");
      qc.invalidateQueries({ queryKey: ["businessLoanApplications"] });
      setSubmitted(true);
    },
    onError: () => toast.error("Failed to submit application"),
  });

  function statusBadge(status: LoanStatus) {
    if (status === "approved")
      return (
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
          Approved
        </Badge>
      );
    if (status === "rejected")
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200">
          Rejected
        </Badge>
      );
    return (
      <Badge className="bg-amber-100 text-amber-700 border-amber-200">
        Pending
      </Badge>
    );
  }

  const canSubmit =
    formData.businessName &&
    formData.businessType &&
    formData.annualRevenue &&
    formData.loanAmount &&
    formData.loanPurpose;

  return (
    <div className="space-y-8">
      <Card className="border-2 border-bank-gold/20">
        <CardHeader>
          <CardTitle className="font-display text-bank-navy flex items-center gap-2">
            <FileText className="h-5 w-5 text-bank-gold" /> Loan Application
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div
              className="text-center py-8"
              data-ocid="business.loan.success_state"
            >
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-bank-navy mb-2">
                Application Submitted!
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Our team will review your application and respond within 48
                hours.
              </p>
              <Button
                variant="outline"
                className="border-bank-navy text-bank-navy"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    businessName: "",
                    businessType: "",
                    annualRevenue: "",
                    loanAmount: "",
                    loanPurpose: "",
                  });
                }}
                data-ocid="business.loan.new.button"
              >
                Submit Another Application
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="biz-name">Business Name</Label>
                  <Input
                    id="biz-name"
                    placeholder="e.g. Sunrise Bakery LLC"
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        businessName: e.target.value,
                      }))
                    }
                    data-ocid="business.loan.name.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="biz-type">Business Type</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(v) =>
                      setFormData((p) => ({ ...p, businessType: v }))
                    }
                  >
                    <SelectTrigger
                      id="biz-type"
                      data-ocid="business.loan.type.select"
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LLC">LLC</SelectItem>
                      <SelectItem value="Sole Proprietor">
                        Sole Proprietor
                      </SelectItem>
                      <SelectItem value="Corporation">Corporation</SelectItem>
                      <SelectItem value="Partnership">Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="annual-rev">Annual Revenue ($)</Label>
                  <Input
                    id="annual-rev"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.annualRevenue}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        annualRevenue: e.target.value,
                      }))
                    }
                    data-ocid="business.loan.revenue.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="loan-amount">Loan Amount Requested ($)</Label>
                  <Input
                    id="loan-amount"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.loanAmount}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, loanAmount: e.target.value }))
                    }
                    data-ocid="business.loan.amount.input"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="loan-purpose">Loan Purpose</Label>
                <Textarea
                  id="loan-purpose"
                  placeholder="Describe how you plan to use the funds…"
                  className="min-h-[100px]"
                  value={formData.loanPurpose}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, loanPurpose: e.target.value }))
                  }
                  data-ocid="business.loan.purpose.textarea"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="loan-docs">Supporting Documents</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload financial statements, tax returns, or business plans
                  </p>
                  <Input
                    id="loan-docs"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xlsx,.jpg,.png"
                    className="max-w-[240px] mx-auto"
                    data-ocid="business.loan.docs.upload_button"
                  />
                </div>
              </div>
              <Button
                className="bg-bank-navy hover:bg-bank-navy/90 text-white w-full sm:w-auto"
                onClick={() => submitMutation.mutate()}
                disabled={submitMutation.isPending || !canSubmit}
                data-ocid="business.loan.submit_button"
              >
                {submitMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {submitMutation.isPending
                  ? "Submitting…"
                  : "Submit Loan Request"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h3 className="font-display text-lg font-bold text-bank-navy mb-4">
          My Applications
        </h3>
        {isLoading ? (
          <div
            className="flex justify-center py-6"
            data-ocid="business.loan.applications.loading_state"
          >
            <Loader2 className="h-5 w-5 animate-spin text-bank-navy" />
          </div>
        ) : !loanApps || loanApps.length === 0 ? (
          <div
            className="text-center text-muted-foreground text-sm py-6 bg-slate-50 rounded-xl border border-border"
            data-ocid="business.loan.applications.empty_state"
          >
            No loan applications yet.
          </div>
        ) : (
          <div className="space-y-3">
            {loanApps.map((app, i) => (
              <Card
                key={`${app.businessName}-${app.submittedAt}-${i}`}
                className="border-border"
                data-ocid={`business.loan.applications.item.${i + 1}`}
              >
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-bank-navy">
                        {app.businessName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {app.businessType} · {fmt(app.loanAmountRequested)}{" "}
                        requested
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Submitted: {app.submittedAt.split("T")[0]}
                      </p>
                    </div>
                    {statusBadge(app.status)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const mockPaymentHistory = [
  {
    id: "TXN-8821",
    date: "2026-03-13",
    customer: "Elena Vasquez",
    method: "Visa",
    amount: 342.5,
  },
  {
    id: "TXN-8820",
    date: "2026-03-13",
    customer: "Marcus Lee",
    method: "Mastercard",
    amount: 89.99,
  },
  {
    id: "TXN-8819",
    date: "2026-03-12",
    customer: "Sofia Andrade",
    method: "PayLink",
    amount: 615.0,
  },
  {
    id: "TXN-8818",
    date: "2026-03-12",
    customer: "James Okonkwo",
    method: "Visa",
    amount: 127.25,
  },
  {
    id: "TXN-8817",
    date: "2026-03-11",
    customer: "Priya Sharma",
    method: "Online Checkout",
    amount: 65.76,
  },
];

const merchantTools = [
  {
    icon: ShoppingCart,
    title: "POS Integration",
    slug: "pos",
    desc: "Connect your point-of-sale terminal directly to your TRUPTAR business account for automatic reconciliation and real-time fund settlement.",
  },
  {
    icon: CreditCard,
    title: "Online Checkout",
    slug: "checkout",
    desc: "Embed a hosted payment page on your website or e-commerce store with support for all major cards and digital wallets.",
  },
  {
    icon: QrCode,
    title: "Payment Links",
    slug: "links",
    desc: "Generate shareable payment links or QR codes for invoices, events, or subscription billing — no coding required.",
  },
];

function MerchantServicesTab() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Daily Sales"
          value="$1,240.00"
          icon={BadgeDollarSign}
          accent
        />
        <StatCard
          label="Weekly Revenue"
          value="$8,750.00"
          icon={ArrowDownLeft}
        />
        <StatCard
          label="Payment History"
          value="47 transactions"
          icon={Receipt}
        />
      </div>

      <div>
        <h3 className="font-display text-lg font-bold text-bank-navy mb-4">
          Merchant Tools
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {merchantTools.map((tool) => (
            <Card
              key={tool.title}
              className="border-border hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-5">
                <div className="w-10 h-10 bg-bank-navy/10 rounded-lg flex items-center justify-center mb-3">
                  <tool.icon className="h-5 w-5 text-bank-navy" />
                </div>
                <h4 className="font-display font-bold text-bank-navy mb-1">
                  {tool.title}
                </h4>
                <p className="text-muted-foreground text-sm mb-4">
                  {tool.desc}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-bank-navy text-bank-navy hover:bg-bank-navy/5"
                  data-ocid={`business.merchant.${tool.slug}.button`}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-bank-navy text-lg">
            Recent Payment History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table data-ocid="business.merchant.history.table">
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPaymentHistory.map((tx, i) => (
                <TableRow
                  key={tx.id}
                  data-ocid={`business.merchant.history.item.${i + 1}`}
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {tx.id}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {tx.date}
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {tx.customer}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {tx.method}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-emerald-600">
                    +{fmt(tx.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function PayrollTab() {
  const qc = useQueryClient();
  const { actor, isFetching: actorFetching } = useActor();

  const { data: history, isLoading } = useQuery({
    queryKey: ["payrollHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPayrollHistory();
    },
    enabled: !!actor && !actorFetching,
  });

  const [empName, setEmpName] = useState("");
  const [salary, setSalary] = useState("");
  const [payDate, setPayDate] = useState(today());

  const payrollMutation = useMutation({
    mutationFn: () =>
      actor!.processPayroll(empName, Number.parseFloat(salary), payDate),
    onSuccess: () => {
      toast.success(`Payroll processed for ${empName}`);
      qc.invalidateQueries({ queryKey: ["payrollHistory"] });
      setEmpName("");
      setSalary("");
      setPayDate(today());
    },
    onError: () => toast.error("Failed to process payroll"),
  });

  return (
    <div className="space-y-8">
      <Card className="border-2 border-bank-gold/20">
        <CardHeader>
          <CardTitle className="font-display text-bank-navy flex items-center gap-2">
            <Users className="h-5 w-5 text-bank-gold" /> Process Payroll
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4 mb-5">
            <div className="space-y-1.5">
              <Label htmlFor="emp-name">Employee Name</Label>
              <Input
                id="emp-name"
                placeholder="Full name"
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                data-ocid="business.payroll.name.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="salary">Salary Amount ($)</Label>
              <Input
                id="salary"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                data-ocid="business.payroll.amount.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pay-date">Payment Date</Label>
              <Input
                id="pay-date"
                type="date"
                value={payDate}
                onChange={(e) => setPayDate(e.target.value)}
                data-ocid="business.payroll.date.input"
              />
            </div>
          </div>
          <Button
            className="bg-bank-navy hover:bg-bank-navy/90 text-white"
            onClick={() => payrollMutation.mutate()}
            disabled={payrollMutation.isPending || !empName || !salary}
            data-ocid="business.payroll.submit_button"
          >
            {payrollMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {payrollMutation.isPending ? "Processing…" : "Process Payroll"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-bank-navy text-lg">
            Payroll History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div
              className="flex justify-center py-8"
              data-ocid="business.payroll.history.loading_state"
            >
              <Loader2 className="h-5 w-5 animate-spin text-bank-navy" />
            </div>
          ) : !history || history.length === 0 ? (
            <div
              className="text-center text-muted-foreground text-sm py-8"
              data-ocid="business.payroll.history.empty_state"
            >
              No payroll records yet.
            </div>
          ) : (
            <Table data-ocid="business.payroll.history.table">
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((rec, i) => (
                  <TableRow
                    key={`${rec.employeeName}-${rec.paymentDate}-${i}`}
                    data-ocid={`business.payroll.history.item.${i + 1}`}
                  >
                    <TableCell className="font-medium text-sm">
                      {rec.employeeName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {rec.paymentDate}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-bank-navy">
                      {fmt(rec.salaryAmount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AdvisoryTab() {
  const { actor } = useActor();
  const [name, setName] = useState("");
  const [bizType, setBizType] = useState("");
  const [topic, setTopic] = useState("");
  const [prefDate, setPrefDate] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const advisoryMutation = useMutation({
    mutationFn: () =>
      actor!.scheduleAdvisoryMeeting(name, bizType, topic, prefDate),
    onSuccess: () => {
      toast.success("Meeting scheduled!");
      setConfirmed(true);
    },
    onError: () => toast.error("Failed to schedule meeting"),
  });

  const canBook = name && bizType && topic && prefDate;

  return (
    <div className="space-y-6">
      <Card className="border-2 border-bank-gold/20 max-w-2xl">
        <CardHeader>
          <CardTitle className="font-display text-bank-navy flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-bank-gold" /> Schedule
            Advisory Meeting
          </CardTitle>
        </CardHeader>
        <CardContent>
          {confirmed ? (
            <div
              className="text-center py-8"
              data-ocid="business.advisory.success_state"
            >
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-bank-navy mb-2">
                Meeting Confirmed!
              </h3>
              <p className="text-muted-foreground text-sm mb-1">
                Your advisory session is scheduled for{" "}
                <span className="font-semibold text-bank-navy">{prefDate}</span>
                .
              </p>
              <p className="text-muted-foreground text-sm mb-6">
                Topic:{" "}
                <span className="font-semibold text-bank-navy">{topic}</span>
              </p>
              <Button
                variant="outline"
                className="border-bank-navy text-bank-navy"
                onClick={() => {
                  setConfirmed(false);
                  setName("");
                  setBizType("");
                  setTopic("");
                  setPrefDate("");
                }}
                data-ocid="business.advisory.new.button"
              >
                Schedule Another Meeting
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="adv-name">Your Name</Label>
                  <Input
                    id="adv-name"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    data-ocid="business.advisory.name.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="adv-biz-type">Business Type</Label>
                  <Select value={bizType} onValueChange={setBizType}>
                    <SelectTrigger
                      id="adv-biz-type"
                      data-ocid="business.advisory.type.select"
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LLC">LLC</SelectItem>
                      <SelectItem value="Sole Proprietor">
                        Sole Proprietor
                      </SelectItem>
                      <SelectItem value="Corporation">Corporation</SelectItem>
                      <SelectItem value="Partnership">Partnership</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="adv-topic">Consultation Topic</Label>
                  <Select value={topic} onValueChange={setTopic}>
                    <SelectTrigger
                      id="adv-topic"
                      data-ocid="business.advisory.topic.select"
                    >
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Business Growth">
                        Business Growth
                      </SelectItem>
                      <SelectItem value="Financial Planning">
                        Financial Planning
                      </SelectItem>
                      <SelectItem value="Loan Guidance">
                        Loan Guidance
                      </SelectItem>
                      <SelectItem value="Investment Strategy">
                        Investment Strategy
                      </SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="adv-date">Preferred Date</Label>
                  <Input
                    id="adv-date"
                    type="date"
                    value={prefDate}
                    onChange={(e) => setPrefDate(e.target.value)}
                    data-ocid="business.advisory.date.input"
                  />
                </div>
              </div>
              <Button
                className="bg-bank-navy hover:bg-bank-navy/90 text-white w-full sm:w-auto"
                onClick={() => advisoryMutation.mutate()}
                disabled={advisoryMutation.isPending || !canBook}
                data-ocid="business.advisory.submit_button"
              >
                {advisoryMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {advisoryMutation.isPending
                  ? "Scheduling…"
                  : "Schedule Meeting"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-3 gap-4 max-w-2xl">
        {[
          {
            icon: BookOpen,
            title: "Expert Advisors",
            desc: "Our advisors hold CFP and CPA credentials with 10+ years of SMB experience.",
          },
          {
            icon: CalendarDays,
            title: "Flexible Scheduling",
            desc: "Morning, afternoon, or evening slots available Mon–Sat.",
          },
          {
            icon: Building2,
            title: "Free for Members",
            desc: "Advisory sessions are complimentary for all active TRUPTAR business account holders.",
          },
        ].map((item) => (
          <div key={item.title} className="flex gap-3">
            <div className="w-8 h-8 bg-bank-gold/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <item.icon className="h-4 w-4 text-bank-navy" />
            </div>
            <div>
              <p className="font-semibold text-bank-navy text-sm">
                {item.title}
              </p>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BusinessBankingPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const isLoggedIn = !!identity;

  return (
    <div>
      <section className="bg-bank-navy py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            Business Banking
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            TRUPTAR Bank supports small businesses and entrepreneurs in the
            community with full-service business banking, loans, merchant tools,
            payroll, and expert advisory.
          </p>
        </div>
      </section>

      <section className="py-10 bg-slate-50 min-h-[70vh]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {isInitializing ? (
            <div
              className="flex items-center justify-center py-20"
              data-ocid="business.page.loading_state"
            >
              <Loader2 className="h-8 w-8 animate-spin text-bank-navy" />
            </div>
          ) : !isLoggedIn ? (
            <LoginPrompt />
          ) : (
            <Tabs defaultValue="account">
              <TabsList className="mb-8 bg-white border border-border h-auto flex-wrap gap-1 p-1">
                <TabsTrigger
                  value="account"
                  className="data-[state=active]:bg-bank-navy data-[state=active]:text-white text-sm"
                  data-ocid="business.account.tab"
                >
                  Business Account
                </TabsTrigger>
                <TabsTrigger
                  value="loans"
                  className="data-[state=active]:bg-bank-navy data-[state=active]:text-white text-sm"
                  data-ocid="business.loans.tab"
                >
                  Business Loans
                </TabsTrigger>
                <TabsTrigger
                  value="merchant"
                  className="data-[state=active]:bg-bank-navy data-[state=active]:text-white text-sm"
                  data-ocid="business.merchant.tab"
                >
                  Merchant Services
                </TabsTrigger>
                <TabsTrigger
                  value="payroll"
                  className="data-[state=active]:bg-bank-navy data-[state=active]:text-white text-sm"
                  data-ocid="biz.payroll.tab"
                >
                  Payroll
                </TabsTrigger>
                <TabsTrigger
                  value="advisory"
                  className="data-[state=active]:bg-bank-navy data-[state=active]:text-white text-sm"
                  data-ocid="business.advisory.tab"
                >
                  Advisory
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account">
                <BusinessAccountTab />
              </TabsContent>
              <TabsContent value="loans">
                <BusinessLoansTab />
              </TabsContent>
              <TabsContent value="merchant">
                <MerchantServicesTab />
              </TabsContent>
              <TabsContent value="payroll">
                <PayrollTab />
              </TabsContent>
              <TabsContent value="advisory">
                <AdvisoryTab />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
    </div>
  );
}
