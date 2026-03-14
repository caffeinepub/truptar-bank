import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRightLeft,
  BadgeDollarSign,
  Bell,
  Building2,
  Car,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Globe,
  Home,
  Landmark,
  Lock,
  LogOut,
  PiggyBank,
  Send,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Timer,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Transaction } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface SavingsAccountState {
  accountId: string;
  balance: number;
  interestRate: number;
  lastInterestCredited: string;
  totalInterestEarned: number;
  createdAt: string;
  updatedAt: string;
}

interface SavingsTransaction {
  date: string;
  description: string;
  isDeposit: boolean;
  amount: number;
}

interface CheckingTransaction {
  txnId: string;
  userId: string;
  txnType: string;
  amount: number;
  date: string;
  status: "Completed" | "Pending" | "Failed";
}

interface FixedDeposit {
  id: string;
  amount: number;
  termLabel: string;
  rate: number;
  maturityDate: string;
  status: "Locked";
}

const TERM_OPTIONS = [
  { value: "3", label: "3 Months", rate: 3.5 },
  { value: "6", label: "6 Months", rate: 4.0 },
  { value: "12", label: "12 Months", rate: 4.5 },
  { value: "24", label: "24 Months", rate: 4.75 },
];

function formatCurrency(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function genTxnId() {
  return `TXN-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
}

const MOCK_CHECKING_TXN: CheckingTransaction[] = [
  {
    txnId: "TXN-A1B2C3",
    userId: "usr-001",
    txnType: "Deposit",
    amount: 2500.0,
    date: "Mar 01, 2026",
    status: "Completed",
  },
  {
    txnId: "TXN-D4E5F6",
    userId: "usr-001",
    txnType: "Bill Payment",
    amount: 145.0,
    date: "Mar 05, 2026",
    status: "Completed",
  },
  {
    txnId: "TXN-G7H8I9",
    userId: "usr-001",
    txnType: "Transfer",
    amount: 500.0,
    date: "Mar 08, 2026",
    status: "Completed",
  },
  {
    txnId: "TXN-J1K2L3",
    userId: "usr-001",
    txnType: "Debit Card",
    amount: 89.99,
    date: "Mar 10, 2026",
    status: "Completed",
  },
  {
    txnId: "TXN-M4N5O6",
    userId: "usr-001",
    txnType: "Payment Received",
    amount: 1200.0,
    date: "Mar 12, 2026",
    status: "Pending",
  },
];

function calcMonthlyPayment(
  principal: number,
  annualRate: number,
  months: number,
) {
  const r = annualRate / 12;
  if (r === 0) return principal / months;
  const base = (1 + r) ** months;
  return (principal * r * base) / (base - 1);
}

function fmtMoney(n: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function DashboardPersonalLoan() {
  const [form, setForm] = useState({
    fullName: "",
    accountNumber: "",
    loanAmount: "",
    loanPurpose: "",
    incomeSource: "",
    monthlyIncome: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const set = (k: keyof typeof form) => (v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  if (submitted) {
    return (
      <div
        className="flex flex-col items-center py-12 text-center space-y-4"
        data-ocid="loans.personal.success_state"
      >
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <h3 className="font-display text-xl font-bold text-bank-navy">
          Application Submitted!
        </h3>
        <p className="text-muted-foreground max-w-md text-sm">
          Your personal loan application has been submitted successfully. We
          will review and respond within 2–3 business days.
        </p>
        <Button
          onClick={() => {
            setSubmitted(false);
            setForm({
              fullName: "",
              accountNumber: "",
              loanAmount: "",
              loanPurpose: "",
              incomeSource: "",
              monthlyIncome: "",
            });
          }}
          variant="outline"
          size="sm"
          className="border-bank-navy text-bank-navy"
        >
          New Application
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Full Name *</Label>
          <Input
            placeholder="John Doe"
            value={form.fullName}
            onChange={(e) => set("fullName")(e.target.value)}
            required
            data-ocid="loans.personal.fullname_input"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Account Number *</Label>
          <Input
            placeholder="TRUP-XXXXXXXX"
            value={form.accountNumber}
            onChange={(e) => set("accountNumber")(e.target.value)}
            required
            data-ocid="loans.personal.account_input"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Loan Amount ($) *</Label>
        <Input
          type="number"
          min="500"
          placeholder="10000"
          value={form.loanAmount}
          onChange={(e) => set("loanAmount")(e.target.value)}
          required
          data-ocid="loans.personal.amount_input"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Loan Purpose *</Label>
        <Select onValueChange={set("loanPurpose")} required>
          <SelectTrigger data-ocid="loans.personal.purpose_select">
            <SelectValue placeholder="Select purpose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="home_improvement">Home Improvement</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="medical">Medical</SelectItem>
            <SelectItem value="debt_consolidation">
              Debt Consolidation
            </SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Income Source *</Label>
          <Select onValueChange={set("incomeSource")} required>
            <SelectTrigger data-ocid="loans.personal.income_source_select">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employment">Employment</SelectItem>
              <SelectItem value="self_employment">Self-Employment</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Monthly Income ($) *</Label>
          <Input
            type="number"
            min="0"
            placeholder="5000"
            value={form.monthlyIncome}
            onChange={(e) => set("monthlyIncome")(e.target.value)}
            required
            data-ocid="loans.personal.monthly_income_input"
          />
        </div>
      </div>
      <Button
        type="submit"
        className="w-full bg-bank-navy hover:bg-bank-navy/90 text-white"
        data-ocid="loans.personal.submit_button"
      >
        Submit Loan Application
      </Button>
    </form>
  );
}

function DashboardMortgageLoan() {
  const [form, setForm] = useState({
    propertyValue: "",
    downPayment: "",
    duration: "",
    monthlyIncome: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const set = (k: keyof typeof form) => (v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const pv = Number.parseFloat(form.propertyValue) || 0;
  const dp = Number.parseFloat(form.downPayment) || 0;
  const inc = Number.parseFloat(form.monthlyIncome) || 0;
  const durationYears = Number.parseInt(form.duration) || 0;
  const loanAmt = Math.max(0, pv - dp);
  const months = durationYears * 12;
  const monthly =
    months > 0 && loanAmt > 0 ? calcMonthlyPayment(loanAmt, 0.065, months) : 0;
  const dti = inc > 0 ? (monthly / inc) * 100 : 0;
  const showCalc = pv > 0 && months > 0 && loanAmt > 0;

  if (submitted) {
    return (
      <div
        className="flex flex-col items-center py-12 text-center space-y-4"
        data-ocid="loans.mortgage.success_state"
      >
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <h3 className="font-display text-xl font-bold text-bank-navy">
          Mortgage Application Submitted!
        </h3>
        <p className="text-muted-foreground max-w-md text-sm">
          A mortgage specialist will contact you within 3–5 business days.
        </p>
        <Button
          onClick={() => {
            setSubmitted(false);
            setForm({
              propertyValue: "",
              downPayment: "",
              duration: "",
              monthlyIncome: "",
            });
          }}
          variant="outline"
          size="sm"
          className="border-bank-navy text-bank-navy"
        >
          New Application
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Property Value ($) *</Label>
          <Input
            type="number"
            min="10000"
            placeholder="350000"
            value={form.propertyValue}
            onChange={(e) => set("propertyValue")(e.target.value)}
            required
            data-ocid="loans.mortgage.property_value_input"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Down Payment ($) *</Label>
          <Input
            type="number"
            min="0"
            placeholder="70000"
            value={form.downPayment}
            onChange={(e) => set("downPayment")(e.target.value)}
            required
            data-ocid="loans.mortgage.down_payment_input"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Loan Duration *</Label>
          <Select onValueChange={set("duration")} required>
            <SelectTrigger data-ocid="loans.mortgage.duration_select">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 years</SelectItem>
              <SelectItem value="15">15 years</SelectItem>
              <SelectItem value="20">20 years</SelectItem>
              <SelectItem value="25">25 years</SelectItem>
              <SelectItem value="30">30 years</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Monthly Income ($) *</Label>
          <Input
            type="number"
            min="0"
            placeholder="8000"
            value={form.monthlyIncome}
            onChange={(e) => set("monthlyIncome")(e.target.value)}
            required
            data-ocid="loans.mortgage.monthly_income_input"
          />
        </div>
      </div>
      {showCalc && (
        <div className="rounded-lg bg-bank-navy/5 border border-bank-navy/20 p-4">
          <p className="text-xs font-semibold text-bank-navy uppercase tracking-widest mb-3">
            Estimated Repayment
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Loan Amount</p>
              <p className="font-bold text-bank-navy text-sm">
                ${fmtMoney(loanAmt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Rate</p>
              <p className="font-bold text-bank-gold text-sm">6.50% p.a.</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Monthly</p>
              <p className="font-bold text-bank-navy">${fmtMoney(monthly)}</p>
            </div>
            {inc > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">DTI Ratio</p>
                <p
                  className={`font-bold text-sm ${dti > 43 ? "text-red-600" : "text-green-600"}`}
                >
                  {dti.toFixed(1)}%
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      <Button
        type="submit"
        className="w-full bg-bank-navy hover:bg-bank-navy/90 text-white"
        data-ocid="loans.mortgage.submit_button"
      >
        Apply for Mortgage
      </Button>
    </form>
  );
}

function DashboardAutoLoan() {
  const [form, setForm] = useState({
    vehiclePrice: "",
    downPayment: "",
    loanTerm: "",
    dealershipName: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const set = (k: keyof typeof form) => (v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const vp = Number.parseFloat(form.vehiclePrice) || 0;
  const dp = Number.parseFloat(form.downPayment) || 0;
  const months = Number.parseInt(form.loanTerm) || 0;
  const loanAmt = Math.max(0, vp - dp);
  const monthly =
    months > 0 && loanAmt > 0 ? calcMonthlyPayment(loanAmt, 0.079, months) : 0;
  const totalPayment = monthly * months;
  const totalInterest = totalPayment - loanAmt;
  const showCalc = vp > 0 && months > 0 && loanAmt > 0;

  if (submitted) {
    return (
      <div
        className="flex flex-col items-center py-10 text-center space-y-4"
        data-ocid="loans.auto.success_state"
      >
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <h3 className="font-display text-xl font-bold text-bank-navy">
          Auto Loan Application Submitted!
        </h3>
        {showCalc && (
          <div className="rounded-lg bg-bank-navy text-white p-4 w-full max-w-sm text-left">
            <p className="text-white/60 text-xs uppercase tracking-widest mb-2">
              Repayment Summary
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-sm">
              <span className="text-white/70">Loan Amount:</span>
              <span className="font-semibold">${fmtMoney(loanAmt)}</span>
              <span className="text-white/70">Monthly Payment:</span>
              <span className="font-semibold text-bank-gold">
                ${fmtMoney(monthly)}
              </span>
              <span className="text-white/70">Total Payment:</span>
              <span className="font-semibold">${fmtMoney(totalPayment)}</span>
              <span className="text-white/70">Total Interest:</span>
              <span className="font-semibold">${fmtMoney(totalInterest)}</span>
            </div>
          </div>
        )}
        <Button
          onClick={() => {
            setSubmitted(false);
            setForm({
              vehiclePrice: "",
              downPayment: "",
              loanTerm: "",
              dealershipName: "",
            });
          }}
          variant="outline"
          size="sm"
          className="border-bank-navy text-bank-navy"
        >
          New Application
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Vehicle Price ($) *</Label>
          <Input
            type="number"
            min="1000"
            placeholder="35000"
            value={form.vehiclePrice}
            onChange={(e) => set("vehiclePrice")(e.target.value)}
            required
            data-ocid="loans.auto.vehicle_price_input"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Down Payment ($) *</Label>
          <Input
            type="number"
            min="0"
            placeholder="5000"
            value={form.downPayment}
            onChange={(e) => set("downPayment")(e.target.value)}
            required
            data-ocid="loans.auto.down_payment_input"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Loan Term *</Label>
          <Select onValueChange={set("loanTerm")} required>
            <SelectTrigger data-ocid="loans.auto.term_select">
              <SelectValue placeholder="Select term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24">24 months</SelectItem>
              <SelectItem value="36">36 months</SelectItem>
              <SelectItem value="48">48 months</SelectItem>
              <SelectItem value="60">60 months</SelectItem>
              <SelectItem value="72">72 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Dealership Name *</Label>
          <Input
            placeholder="ABC Auto Dealers"
            value={form.dealershipName}
            onChange={(e) => set("dealershipName")(e.target.value)}
            required
            data-ocid="loans.auto.dealership_input"
          />
        </div>
      </div>
      {showCalc && (
        <div className="rounded-lg bg-bank-navy/5 border border-bank-navy/20 p-4">
          <p className="text-xs font-semibold text-bank-navy uppercase tracking-widest mb-3">
            Repayment Plan (7.90% p.a.)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Loan Amount</p>
              <p className="font-bold text-bank-navy text-sm">
                ${fmtMoney(loanAmt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Monthly</p>
              <p className="font-bold text-bank-gold">${fmtMoney(monthly)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Total Payment
              </p>
              <p className="font-bold text-bank-navy text-sm">
                ${fmtMoney(totalPayment)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Total Interest
              </p>
              <p className="font-bold text-bank-navy text-sm">
                ${fmtMoney(totalInterest)}
              </p>
            </div>
          </div>
        </div>
      )}
      <Button
        type="submit"
        className="w-full bg-bank-navy hover:bg-bank-navy/90 text-white"
        data-ocid="loans.auto.submit_button"
      >
        Submit Auto Loan Application
      </Button>
    </form>
  );
}

function DashboardCommunityLoan() {
  const [form, setForm] = useState({
    projectName: "",
    orgName: "",
    projectType: "",
    description: "",
    budget: "",
    loanAmount: "",
    impact: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const set = (k: keyof typeof form) => (v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  if (submitted) {
    return (
      <div
        className="flex flex-col items-center py-12 text-center space-y-4"
        data-ocid="loans.community.success_state"
      >
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <h3 className="font-display text-xl font-bold text-bank-navy">
          Application Received!
        </h3>
        <p className="text-muted-foreground max-w-md text-sm">
          Your community development loan application has been received. Our
          community lending team will contact you within 5 business days.
        </p>
        <Button
          onClick={() => {
            setSubmitted(false);
            setForm({
              projectName: "",
              orgName: "",
              projectType: "",
              description: "",
              budget: "",
              loanAmount: "",
              impact: "",
            });
          }}
          variant="outline"
          size="sm"
          className="border-bank-navy text-bank-navy"
        >
          New Application
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Project Name *</Label>
          <Input
            placeholder="Community Health Clinic"
            value={form.projectName}
            onChange={(e) => set("projectName")(e.target.value)}
            required
            data-ocid="loans.community.project_name_input"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Organization Name *</Label>
          <Input
            placeholder="Riverside Community Foundation"
            value={form.orgName}
            onChange={(e) => set("orgName")(e.target.value)}
            required
            data-ocid="loans.community.org_name_input"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Project Type *</Label>
        <Select onValueChange={set("projectType")} required>
          <SelectTrigger data-ocid="loans.community.type_select">
            <SelectValue placeholder="Select project type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="school">School / Education</SelectItem>
            <SelectItem value="healthcare">Healthcare Center</SelectItem>
            <SelectItem value="local_business">Local Business</SelectItem>
            <SelectItem value="infrastructure">
              Community Infrastructure
            </SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>
          Project Description *{" "}
          <span className="text-muted-foreground text-xs">
            (min. 100 characters)
          </span>
        </Label>
        <Textarea
          placeholder="Describe the project goals, timeline, and expected outcomes..."
          rows={3}
          minLength={100}
          value={form.description}
          onChange={(e) => set("description")(e.target.value)}
          required
          data-ocid="loans.community.description_textarea"
        />
        <p className="text-xs text-muted-foreground text-right">
          {form.description.length} / 100 min
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Total Budget ($) *</Label>
          <Input
            type="number"
            min="1000"
            placeholder="250000"
            value={form.budget}
            onChange={(e) => set("budget")(e.target.value)}
            required
            data-ocid="loans.community.budget_input"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Requested Loan Amount ($) *</Label>
          <Input
            type="number"
            min="1000"
            placeholder="150000"
            value={form.loanAmount}
            onChange={(e) => set("loanAmount")(e.target.value)}
            required
            data-ocid="loans.community.loan_amount_input"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Expected Community Impact *</Label>
        <Textarea
          placeholder="Describe how this project will benefit the local community..."
          rows={2}
          value={form.impact}
          onChange={(e) => set("impact")(e.target.value)}
          required
          data-ocid="loans.community.impact_textarea"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-bank-navy hover:bg-bank-navy/90 text-white"
        data-ocid="loans.community.submit_button"
      >
        Submit Community Development Application
      </Button>
    </form>
  );
}

function DashboardLoanServices() {
  return (
    <div>
      <div className="text-center py-6 mb-6">
        <h2 className="font-display text-2xl font-bold text-bank-navy mb-2">
          Loan Services
        </h2>
        <p className="text-muted-foreground">
          Flexible financing solutions to achieve your goals.
        </p>
      </div>
      <Tabs defaultValue="personal">
        <TabsList className="w-full mb-6 bg-white border border-bank-navy/10 p-1 h-auto flex flex-wrap gap-1">
          <TabsTrigger
            value="personal"
            className="flex-1 data-[state=active]:bg-bank-navy data-[state=active]:text-white text-xs sm:text-sm"
            data-ocid="loans.personal_tab"
          >
            <DollarSign className="h-3.5 w-3.5 mr-1" /> Personal
          </TabsTrigger>
          <TabsTrigger
            value="mortgage"
            className="flex-1 data-[state=active]:bg-bank-navy data-[state=active]:text-white text-xs sm:text-sm"
            data-ocid="loans.mortgage_tab"
          >
            <Home className="h-3.5 w-3.5 mr-1" /> Mortgage
          </TabsTrigger>
          <TabsTrigger
            value="auto"
            className="flex-1 data-[state=active]:bg-bank-navy data-[state=active]:text-white text-xs sm:text-sm"
            data-ocid="loans.auto_tab"
          >
            <Car className="h-3.5 w-3.5 mr-1" /> Auto
          </TabsTrigger>
          <TabsTrigger
            value="community"
            className="flex-1 data-[state=active]:bg-bank-navy data-[state=active]:text-white text-xs sm:text-sm"
            data-ocid="loans.community_tab"
          >
            <Users className="h-3.5 w-3.5 mr-1" /> Community
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card className="border-bank-navy/10">
            <CardHeader>
              <CardTitle className="font-display text-bank-navy flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-bank-gold" /> Personal Loan
                Application
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Unsecured personal loans from $1,000 – $50,000 at 6.99% APR.
              </p>
            </CardHeader>
            <CardContent>
              <DashboardPersonalLoan />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mortgage">
          <Card className="border-bank-navy/10">
            <CardHeader>
              <CardTitle className="font-display text-bank-navy flex items-center gap-2">
                <Home className="h-5 w-5 text-bank-gold" /> Mortgage Loan
                Application
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Fixed-rate mortgages at 6.50% APR. Repayment calculated
                automatically.
              </p>
            </CardHeader>
            <CardContent>
              <DashboardMortgageLoan />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auto">
          <Card className="border-bank-navy/10">
            <CardHeader>
              <CardTitle className="font-display text-bank-navy flex items-center gap-2">
                <Car className="h-5 w-5 text-bank-gold" /> Auto Loan Application
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Vehicle financing at 7.90% APR with instant repayment plan.
              </p>
            </CardHeader>
            <CardContent>
              <DashboardAutoLoan />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community">
          <Card className="border-bank-navy/10">
            <CardHeader>
              <CardTitle className="font-display text-bank-navy flex items-center gap-2">
                <Users className="h-5 w-5 text-bank-gold" /> Community
                Development Loan
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Below-market financing for schools, healthcare, local businesses
                & more at 4.00% APR.
              </p>
            </CardHeader>
            <CardContent>
              <DashboardCommunityLoan />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ---- Dashboard Digital Banking Component ----
function DashboardDigitalBanking() {
  const [appleConnected, setAppleConnected] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(true);
  const [samsungConnected, setSamsungConnected] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [fraudDetection, setFraudDetection] = useState(true);
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30min");
  const [bpPayee, setBpPayee] = useState("");
  const [bpAcct, setBpAcct] = useState("");
  const [bpAmount, setBpAmount] = useState("");
  const [bpDate, setBpDate] = useState("");
  const [bpType, setBpType] = useState<"one-time" | "recurring">("one-time");
  const [bpFrequency, setBpFrequency] = useState("");
  const [bpSuccess, setBpSuccess] = useState(false);

  const handleBillPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bpPayee || !bpAcct || !bpAmount || !bpDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    setBpSuccess(true);
    toast.success(`Payment of $${bpAmount} to ${bpPayee} scheduled!`);
    setTimeout(() => {
      setBpPayee("");
      setBpAcct("");
      setBpAmount("");
      setBpDate("");
      setBpType("one-time");
      setBpFrequency("");
      setBpSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-8">
      {/* Digital Wallet Widget */}
      <div>
        <h3 className="font-display text-lg font-bold text-bank-navy mb-4 flex items-center gap-2">
          <Wallet className="h-5 w-5 text-bank-gold" /> Connected Wallets
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Apple Pay",
              connected: appleConnected,
              setConnected: setAppleConnected,
              ocid: "digital_wallet.apple_pay.button",
            },
            {
              label: "Google Pay",
              connected: googleConnected,
              setConnected: setGoogleConnected,
              ocid: "digital_wallet.google_pay.button",
            },
            {
              label: "Samsung Pay",
              connected: samsungConnected,
              setConnected: setSamsungConnected,
              ocid: "digital_wallet.samsung_pay.button",
            },
          ].map((w) => (
            <Card key={w.label} className="border-border bg-white text-center">
              <CardContent className="py-4 px-3 space-y-2">
                <p className="text-xs font-semibold text-bank-navy">
                  {w.label}
                </p>
                {w.connected ? (
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs block">
                    Linked
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs block">
                    Not linked
                  </Badge>
                )}
                <Button
                  size="sm"
                  className={
                    w.connected
                      ? "w-full text-xs bg-slate-100 text-bank-navy hover:bg-slate-200"
                      : "w-full text-xs bg-bank-navy text-white hover:bg-bank-navy/90"
                  }
                  onClick={() => {
                    w.setConnected(!w.connected);
                    toast(
                      w.connected
                        ? `${w.label} disconnected`
                        : `${w.label} connected!`,
                    );
                  }}
                  data-ocid={w.ocid}
                >
                  {w.connected ? "Disconnect" : "Connect"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Bill Payment */}
      <div>
        <h3 className="font-display text-lg font-bold text-bank-navy mb-4 flex items-center gap-2">
          <BadgeDollarSign className="h-5 w-5 text-bank-gold" /> Quick Bill
          Payment
        </h3>
        <Card className="border-border bg-white">
          <CardContent className="pt-5">
            {bpSuccess ? (
              <div
                className="flex items-center gap-3 py-6 justify-center"
                data-ocid="bill_payment.success_state"
              >
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                <p className="font-semibold text-bank-navy">
                  Payment scheduled successfully!
                </p>
              </div>
            ) : (
              <form onSubmit={handleBillPay} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Payee Name</Label>
                    <Input
                      placeholder="Payee"
                      value={bpPayee}
                      onChange={(e) => setBpPayee(e.target.value)}
                      className="h-8 text-sm"
                      data-ocid="bill_payment.payee_name.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Account Number</Label>
                    <Input
                      placeholder="Account #"
                      value={bpAcct}
                      onChange={(e) => setBpAcct(e.target.value)}
                      className="h-8 text-sm"
                      data-ocid="bill_payment.account_number.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Amount ($)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={bpAmount}
                      onChange={(e) => setBpAmount(e.target.value)}
                      className="h-8 text-sm"
                      data-ocid="bill_payment.amount.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Payment Date</Label>
                    <Input
                      type="date"
                      value={bpDate}
                      onChange={(e) => setBpDate(e.target.value)}
                      className="h-8 text-sm"
                      data-ocid="bill_payment.date.input"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="db-bp-type"
                      value="one-time"
                      checked={bpType === "one-time"}
                      onChange={() => setBpType("one-time")}
                      className="accent-bank-navy"
                      data-ocid="bill_payment.one_time.radio"
                    />
                    One-time
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="db-bp-type"
                      value="recurring"
                      checked={bpType === "recurring"}
                      onChange={() => setBpType("recurring")}
                      className="accent-bank-navy"
                      data-ocid="bill_payment.recurring.radio"
                    />
                    Recurring
                  </label>
                  {bpType === "recurring" && (
                    <Select value={bpFrequency} onValueChange={setBpFrequency}>
                      <SelectTrigger
                        className="h-8 text-xs w-36"
                        data-ocid="bill_payment.frequency.select"
                      >
                        <SelectValue placeholder="Frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-bank-navy text-white hover:bg-bank-navy/90 text-sm"
                  data-ocid="bill_payment.confirm.button"
                >
                  Confirm Payment
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Security Status */}
      <div>
        <h3 className="font-display text-lg font-bold text-bank-navy mb-4 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-bank-gold" /> Security Status
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Card className="border-border bg-white">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-semibold text-bank-navy">
                  Two-Factor Auth
                </p>
                <p className="text-xs text-muted-foreground">
                  {twoFA ? "Enabled" : "Disabled"}
                </p>
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
          <Card className="border-border bg-white">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-semibold text-bank-navy">
                  Fraud Detection
                </p>
                <p className="text-xs text-muted-foreground">
                  {fraudDetection ? "Monitoring" : "Off"}
                </p>
              </div>
              <Switch
                checked={fraudDetection}
                onCheckedChange={(v) => {
                  setFraudDetection(v);
                  toast(v ? "Fraud detection on" : "Fraud detection off");
                }}
                data-ocid="security.fraud_detection.toggle"
              />
            </CardContent>
          </Card>
          <Card className="border-border bg-white">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-semibold text-bank-navy">
                  Transaction Alerts
                </p>
                <p className="text-xs text-muted-foreground">
                  {transactionAlerts ? "Active" : "Muted"}
                </p>
              </div>
              <Switch
                checked={transactionAlerts}
                onCheckedChange={(v) => {
                  setTransactionAlerts(v);
                  toast(v ? "Alerts on" : "Alerts off");
                }}
                data-ocid="security.transaction_alerts.toggle"
              />
            </CardContent>
          </Card>
          <Card className="border-border bg-white">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-semibold text-bank-navy">
                  Session Timeout
                </p>
                <p className="text-xs text-muted-foreground">Auto-logout</p>
              </div>
              <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                <SelectTrigger
                  className="w-24 h-8 text-xs"
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
    </div>
  );
}

export default function DashboardPage() {
  const { identity, clear } = useInternetIdentity();
  const { actor } = useActor();
  const navigate = useNavigate();
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  // Checking account state
  const [balance, setBalance] = useState<number | null>(null);
  const [_transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog state
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [savingsDepositOpen, setSavingsDepositOpen] = useState(false);
  const [savingsWithdrawOpen, setSavingsWithdrawOpen] = useState(false);
  const [savingsTransferOpen, setSavingsTransferOpen] = useState(false);
  const [savingsStatementOpen, setSavingsStatementOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [processing, setProcessing] = useState(false);

  // Savings account state (local simulation)
  const [savingsAccount, setSavingsAccount] =
    useState<SavingsAccountState | null>(null);
  const [savingsTransactions, setSavingsTransactions] = useState<
    SavingsTransaction[]
  >([]);
  const [savingsLoading, setSavingsLoading] = useState(false);

  // Enhanced checking dialogs
  const [sendMoneyOpen, setSendMoneyOpen] = useState(false);
  const [requestPaymentOpen, setRequestPaymentOpen] = useState(false);
  const [payBillsOpen, setPayBillsOpen] = useState(false);
  const [transferBetweenOpen, setTransferBetweenOpen] = useState(false);

  const [sendRecipient, setSendRecipient] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendNote, setSendNote] = useState("");
  const [requestFrom, setRequestFrom] = useState("");
  const [requestAmount, setRequestAmount] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [billerName, setBillerName] = useState("");
  const [billerAccount, setBillerAccount] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [transferToAccount, setTransferToAccount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const [checkingTxns, setCheckingTxns] =
    useState<CheckingTransaction[]>(MOCK_CHECKING_TXN);

  // Fixed Deposit state
  const [fdAmount, setFdAmount] = useState("");
  const [fdTerm, setFdTerm] = useState("");
  const [fixedDeposits, setFixedDeposits] = useState<FixedDeposit[]>([
    {
      id: "FD-001",
      amount: 5000,
      termLabel: "12 Months",
      rate: 4.5,
      maturityDate: "Mar 13, 2027",
      status: "Locked",
    },
  ]);

  // Debit Card state
  const [cardFrozen, setCardFrozen] = useState(false);
  const [replaceCardOpen, setReplaceCardOpen] = useState(false);
  const [replaceReason, setReplaceReason] = useState("");
  const [setLimitOpen, setSetLimitOpen] = useState(false);
  const [dailyLimit, setDailyLimit] = useState("500");

  const principalStr = identity?.getPrincipal().toString() ?? "";
  const shortId = principalStr ? `${principalStr.slice(0, 8)}...` : "";
  const userId = principalStr ? `usr-${principalStr.slice(0, 6)}` : "usr-001";

  useEffect(() => {
    if (!isLoggedIn) {
      void navigate({ to: "/login" });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (actor && isLoggedIn) {
      void loadData();
      loadSavingsFromStorage();
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

  function principalKey() {
    return `savings_${identity?.getPrincipal().toString() ?? "anon"}`;
  }

  function loadSavingsFromStorage() {
    const key = principalKey();
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as {
          account: SavingsAccountState;
          transactions: SavingsTransaction[];
        };
        setSavingsAccount(parsed.account);
        setSavingsTransactions(parsed.transactions);
      } catch {
        // ignore
      }
    }
  }

  function saveSavingsToStorage(
    account: SavingsAccountState,
    txns: SavingsTransaction[],
  ) {
    const key = principalKey();
    localStorage.setItem(key, JSON.stringify({ account, transactions: txns }));
  }

  function handleOpenSavingsAccount() {
    setSavingsLoading(true);
    setTimeout(() => {
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const newAccount: SavingsAccountState = {
        accountId: `SAV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        balance: 0,
        interestRate: 3.5,
        lastInterestCredited: "None",
        totalInterestEarned: 0,
        createdAt: dateStr,
        updatedAt: dateStr,
      };
      setSavingsAccount(newAccount);
      setSavingsTransactions([]);
      saveSavingsToStorage(newAccount, []);
      setSavingsLoading(false);
      toast.success("Savings account opened successfully!");
    }, 800);
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

  function handleSavingsDeposit() {
    if (!savingsAccount || !amount) return;
    setProcessing(true);
    setTimeout(() => {
      const val = Number.parseFloat(amount);
      const date = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const updated: SavingsAccountState = {
        ...savingsAccount,
        balance: savingsAccount.balance + val,
        updatedAt: date,
      };
      const txn: SavingsTransaction = {
        date,
        description: "Deposit",
        isDeposit: true,
        amount: val,
      };
      const newTxns = [txn, ...savingsTransactions];
      setSavingsAccount(updated);
      setSavingsTransactions(newTxns);
      saveSavingsToStorage(updated, newTxns);
      setSavingsDepositOpen(false);
      setAmount("");
      setProcessing(false);
      toast.success(`Deposited $${val.toFixed(2)} to savings.`);
    }, 600);
  }

  function handleSavingsWithdraw() {
    if (!savingsAccount || !amount) return;
    const val = Number.parseFloat(amount);
    if (val > savingsAccount.balance) {
      toast.error("Insufficient savings balance.");
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      const date = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const updated: SavingsAccountState = {
        ...savingsAccount,
        balance: savingsAccount.balance - val,
        updatedAt: date,
      };
      const txn: SavingsTransaction = {
        date,
        description: "Withdrawal",
        isDeposit: false,
        amount: val,
      };
      const newTxns = [txn, ...savingsTransactions];
      setSavingsAccount(updated);
      setSavingsTransactions(newTxns);
      saveSavingsToStorage(updated, newTxns);
      setSavingsWithdrawOpen(false);
      setAmount("");
      setProcessing(false);
      toast.success(`Withdrew $${val.toFixed(2)} from savings.`);
    }, 600);
  }

  function handleSavingsTransfer() {
    if (!savingsAccount || !amount) return;
    const val = Number.parseFloat(amount);
    if (val > savingsAccount.balance) {
      toast.error("Insufficient savings balance.");
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      const date = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const updated: SavingsAccountState = {
        ...savingsAccount,
        balance: savingsAccount.balance - val,
        updatedAt: date,
      };
      const txn: SavingsTransaction = {
        date,
        description: `Transfer to ${transferTo || "Checking"}`,
        isDeposit: false,
        amount: val,
      };
      const newTxns = [txn, ...savingsTransactions];
      setSavingsAccount(updated);
      setSavingsTransactions(newTxns);
      saveSavingsToStorage(updated, newTxns);
      setSavingsTransferOpen(false);
      setAmount("");
      setTransferTo("");
      setProcessing(false);
      toast.success(`Transferred $${val.toFixed(2)} successfully.`);
    }, 600);
  }

  function addCheckingTransaction(
    txnType: string,
    amt: number,
    status: "Completed" | "Pending" | "Failed" = "Completed",
  ) {
    const now = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const newTxn: CheckingTransaction = {
      txnId: genTxnId(),
      userId,
      txnType,
      amount: amt,
      date: now,
      status,
    };
    setCheckingTxns((prev) => [newTxn, ...prev]);
  }

  function handleSendMoney() {
    if (!sendRecipient || !sendAmount) return;
    setProcessing(true);
    setTimeout(() => {
      addCheckingTransaction("Send Money", Number.parseFloat(sendAmount));
      setSendMoneyOpen(false);
      setSendRecipient("");
      setSendAmount("");
      setSendNote("");
      setProcessing(false);
      toast.success(
        `$${Number.parseFloat(sendAmount).toFixed(2)} sent to ${sendRecipient}.`,
      );
    }, 700);
  }

  function handleRequestPayment() {
    if (!requestFrom || !requestAmount) return;
    setProcessing(true);
    setTimeout(() => {
      addCheckingTransaction(
        "Payment Received",
        Number.parseFloat(requestAmount),
        "Pending",
      );
      setRequestPaymentOpen(false);
      setRequestFrom("");
      setRequestAmount("");
      setRequestMessage("");
      setProcessing(false);
      toast.success(
        `Payment request of $${Number.parseFloat(requestAmount).toFixed(2)} sent to ${requestFrom}.`,
      );
    }, 700);
  }

  function handlePayBills() {
    if (!billerName || !billAmount) return;
    setProcessing(true);
    setTimeout(() => {
      addCheckingTransaction("Bill Payment", Number.parseFloat(billAmount));
      setPayBillsOpen(false);
      setBillerName("");
      setBillerAccount("");
      setBillAmount("");
      setProcessing(false);
      toast.success(
        `Bill payment of $${Number.parseFloat(billAmount).toFixed(2)} to ${billerName} processed.`,
      );
    }, 700);
  }

  function handleTransferBetween() {
    if (!transferToAccount || !transferAmount) return;
    setProcessing(true);
    setTimeout(() => {
      addCheckingTransaction(
        `Transfer to ${transferToAccount}`,
        Number.parseFloat(transferAmount),
      );
      setTransferBetweenOpen(false);
      setTransferToAccount("");
      setTransferAmount("");
      setProcessing(false);
      toast.success(
        `$${Number.parseFloat(transferAmount).toFixed(2)} transferred to ${transferToAccount}.`,
      );
    }, 700);
  }

  // Fixed Deposit calculator
  const selectedTerm = TERM_OPTIONS.find((t) => t.value === fdTerm);
  const fdCalc = useMemo(() => {
    if (!fdAmount || !selectedTerm) return null;
    const principal = Number.parseFloat(fdAmount);
    if (Number.isNaN(principal) || principal <= 0) return null;
    const months = Number.parseInt(fdTerm);
    const rate = selectedTerm.rate / 100;
    const interest = principal * rate * (months / 12);
    const maturity = new Date();
    maturity.setMonth(maturity.getMonth() + months);
    return {
      rate: selectedTerm.rate,
      maturityDate: maturity.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      estimatedReturn: principal + interest,
      interest,
    };
  }, [fdAmount, fdTerm, selectedTerm]);

  function handleCreateFixedDeposit() {
    if (!fdCalc || !fdAmount || !selectedTerm) return;
    const newFd: FixedDeposit = {
      id: `FD-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
      amount: Number.parseFloat(fdAmount),
      termLabel: selectedTerm.label,
      rate: selectedTerm.rate,
      maturityDate: fdCalc.maturityDate,
      status: "Locked",
    };
    setFixedDeposits((prev) => [newFd, ...prev]);
    setFdAmount("");
    setFdTerm("");
    toast.success(
      `Fixed deposit of $${formatCurrency(newFd.amount)} created. Funds locked until ${newFd.maturityDate}.`,
    );
  }

  function handleDownloadStatement() {
    const rows = [
      ["Transaction ID", "User ID", "Type", "Amount", "Date", "Status"],
      ...checkingTxns.map((t) => [
        t.txnId,
        t.userId,
        t.txnType,
        t.amount.toFixed(2),
        t.date,
        t.status,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "truptar-statement.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Statement downloaded as CSV.");
  }

  function handleLogout() {
    clear();
    void navigate({ to: "/" });
  }

  return (
    <div
      className="min-h-screen bg-slate-50 py-8 px-4"
      data-ocid="dashboard.page"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
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

        {/* Main Tabs */}
        <Tabs defaultValue="personal" data-ocid="dashboard.module.tab">
          <TabsList className="w-full mb-6 bg-bank-navy/5 border border-bank-navy/10 p-1 h-auto flex flex-wrap gap-1">
            <TabsTrigger
              value="personal"
              className="flex-1 min-w-[120px] data-[state=active]:bg-bank-navy data-[state=active]:text-white font-medium"
              data-ocid="dashboard.personal.tab"
            >
              <CreditCard className="h-4 w-4 mr-2" /> Personal
            </TabsTrigger>
            <TabsTrigger
              value="business"
              className="flex-1 min-w-[120px] data-[state=active]:bg-bank-navy data-[state=active]:text-white font-medium"
              data-ocid="dashboard.business.tab"
            >
              <Building2 className="h-4 w-4 mr-2" /> Business
            </TabsTrigger>
            <TabsTrigger
              value="loans"
              className="flex-1 min-w-[120px] data-[state=active]:bg-bank-navy data-[state=active]:text-white font-medium"
              data-ocid="dashboard.loans.tab"
            >
              <Landmark className="h-4 w-4 mr-2" /> Loans
            </TabsTrigger>
            <TabsTrigger
              value="digital"
              className="flex-1 min-w-[120px] data-[state=active]:bg-bank-navy data-[state=active]:text-white font-medium"
              data-ocid="dashboard.digital.tab"
            >
              <Globe className="h-4 w-4 mr-2" /> Digital
            </TabsTrigger>
          </TabsList>

          {/* ---- PERSONAL BANKING TAB ---- */}
          <TabsContent value="personal">
            <Tabs defaultValue="checking">
              <TabsList className="mb-6 bg-white border border-border p-1 h-auto flex flex-wrap gap-1 w-full">
                <TabsTrigger
                  value="checking"
                  className="flex-1 min-w-[90px] text-sm data-[state=active]:bg-bank-navy data-[state=active]:text-white"
                  data-ocid="personal.checking_tab"
                >
                  <CreditCard className="h-3.5 w-3.5 mr-1" /> Checking
                </TabsTrigger>
                <TabsTrigger
                  value="savings"
                  className="flex-1 min-w-[90px] text-sm data-[state=active]:bg-bank-navy data-[state=active]:text-white"
                  data-ocid="personal.savings_tab"
                >
                  <PiggyBank className="h-3.5 w-3.5 mr-1" /> Savings
                </TabsTrigger>
                <TabsTrigger
                  value="fixed_deposits"
                  className="flex-1 min-w-[90px] text-sm data-[state=active]:bg-bank-navy data-[state=active]:text-white"
                  data-ocid="personal.fixed_deposits_tab"
                >
                  <Lock className="h-3.5 w-3.5 mr-1" /> Fixed Deposits
                </TabsTrigger>
                <TabsTrigger
                  value="debit_card"
                  className="flex-1 min-w-[90px] text-sm data-[state=active]:bg-bank-navy data-[state=active]:text-white"
                  data-ocid="personal.debit_card_tab"
                >
                  <Wallet className="h-3.5 w-3.5 mr-1" /> Debit Card
                </TabsTrigger>
                <TabsTrigger
                  value="online_banking"
                  className="flex-1 min-w-[90px] text-sm data-[state=active]:bg-bank-navy data-[state=active]:text-white"
                  data-ocid="personal.online_banking_tab"
                >
                  <Globe className="h-3.5 w-3.5 mr-1" /> Online Banking
                </TabsTrigger>
              </TabsList>

              {/* ---- CHECKING SUB-TAB ---- */}
              <TabsContent value="checking" className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-5 w-5 text-bank-navy" />
                  <h2 className="font-display text-xl font-bold text-bank-navy">
                    Checking Account
                  </h2>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200"
                  >
                    Active
                  </Badge>
                </div>

                {/* Balance card */}
                <Card
                  className="bg-bank-navy text-white border-0 shadow-lg"
                  data-ocid="dashboard.balance.card"
                >
                  <CardContent className="pt-8 pb-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-center sm:text-left">
                        <p className="text-white/60 text-xs uppercase tracking-widest mb-1">
                          Available Balance
                        </p>
                        {loading ? (
                          <div
                            className="h-10 w-36 bg-white/20 rounded-lg animate-pulse"
                            data-ocid="dashboard.balance.loading_state"
                          />
                        ) : (
                          <p className="font-display text-4xl font-bold text-bank-gold">
                            $
                            {balance !== null
                              ? formatCurrency(balance)
                              : "0.00"}
                          </p>
                        )}
                        <p className="text-white/50 text-xs mt-1">
                          TRUPTAR Community Checking
                        </p>
                      </div>
                      <div className="text-center sm:text-right">
                        <p className="text-white/60 text-xs uppercase tracking-widest mb-1">
                          Account Status
                        </p>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                          Active
                        </Badge>
                        <p className="text-white/40 text-xs mt-1">
                          Acct: •••• 4721
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick deposit/withdraw */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    size="lg"
                    onClick={() => {
                      setAmount("");
                      setDepositOpen(true);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11"
                    data-ocid="dashboard.deposit.button"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" /> Deposit
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => {
                      setAmount("");
                      setWithdrawOpen(true);
                    }}
                    className="bg-bank-navy hover:bg-bank-navy/90 text-white font-semibold h-11"
                    data-ocid="dashboard.withdraw.button"
                  >
                    <TrendingDown className="h-4 w-4 mr-2" /> Withdraw
                  </Button>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    className="border-bank-navy text-bank-navy hover:bg-bank-navy hover:text-white h-11 flex-col gap-1 py-2"
                    onClick={() => {
                      setSendRecipient("");
                      setSendAmount("");
                      setSendNote("");
                      setSendMoneyOpen(true);
                    }}
                    data-ocid="checking.send_money_button"
                  >
                    <Send className="h-4 w-4" />
                    <span className="text-xs">Send Money</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-bank-navy text-bank-navy hover:bg-bank-navy hover:text-white h-11 flex-col gap-1 py-2"
                    onClick={() => {
                      setRequestFrom("");
                      setRequestAmount("");
                      setRequestMessage("");
                      setRequestPaymentOpen(true);
                    }}
                    data-ocid="checking.request_payment_button"
                  >
                    <BadgeDollarSign className="h-4 w-4" />
                    <span className="text-xs">Request Payment</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-bank-navy text-bank-navy hover:bg-bank-navy hover:text-white h-11 flex-col gap-1 py-2"
                    onClick={() => {
                      setBillerName("");
                      setBillerAccount("");
                      setBillAmount("");
                      setPayBillsOpen(true);
                    }}
                    data-ocid="checking.pay_bills_button"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="text-xs">Pay Bills</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-bank-navy text-bank-navy hover:bg-bank-navy hover:text-white h-11 flex-col gap-1 py-2"
                    onClick={() => {
                      setTransferToAccount("");
                      setTransferAmount("");
                      setTransferBetweenOpen(true);
                    }}
                    data-ocid="checking.transfer_button"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                    <span className="text-xs">Transfer</span>
                  </Button>
                </div>

                {/* Transaction Table */}
                <Card
                  className="border-border"
                  data-ocid="checking.transaction_table"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="font-display text-base text-bank-navy flex items-center gap-2">
                      <BadgeDollarSign className="h-4 w-4 text-bank-gold" />{" "}
                      Transaction History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
                    {checkingTxns.length === 0 ? (
                      <div
                        className="p-8 text-center text-muted-foreground"
                        data-ocid="checking.transaction.empty_state"
                      >
                        No transactions yet. Make your first deposit!
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-bank-navy font-semibold text-xs">
                              Transaction ID
                            </TableHead>
                            <TableHead className="text-bank-navy font-semibold text-xs">
                              Type
                            </TableHead>
                            <TableHead className="text-bank-navy font-semibold text-xs text-right">
                              Amount
                            </TableHead>
                            <TableHead className="text-bank-navy font-semibold text-xs">
                              Date
                            </TableHead>
                            <TableHead className="text-bank-navy font-semibold text-xs">
                              Status
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {checkingTxns.map((t, i) => (
                            <TableRow
                              key={t.txnId}
                              data-ocid={`checking.transaction.row.${i + 1}`}
                            >
                              <TableCell className="font-mono text-xs text-muted-foreground">
                                {t.txnId}
                              </TableCell>
                              <TableCell className="text-xs font-medium">
                                {t.txnType}
                              </TableCell>
                              <TableCell className="text-xs text-right font-semibold">
                                ${formatCurrency(t.amount)}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {t.date}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`text-xs ${
                                    t.status === "Completed"
                                      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                      : t.status === "Pending"
                                        ? "bg-amber-100 text-amber-700 border-amber-200"
                                        : "bg-red-100 text-red-700 border-red-200"
                                  }`}
                                >
                                  {t.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ---- SAVINGS SUB-TAB ---- */}
              <TabsContent value="savings" className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <PiggyBank className="h-5 w-5 text-bank-navy" />
                  <h2 className="font-display text-xl font-bold text-bank-navy">
                    Savings Account
                  </h2>
                  {savingsAccount && (
                    <Badge className="bg-bank-gold/20 text-bank-navy border-bank-gold/30 text-xs">
                      Active · 3.50% APY
                    </Badge>
                  )}
                </div>

                {!savingsAccount ? (
                  <Card
                    className="border-2 border-dashed border-bank-gold/40 bg-bank-gold/5"
                    data-ocid="savings.empty_state"
                  >
                    <CardContent className="py-10 text-center">
                      <PiggyBank className="h-12 w-12 text-bank-gold/60 mx-auto mb-4" />
                      <h3 className="font-display text-lg font-bold text-bank-navy mb-2">
                        Open a Savings Account
                      </h3>
                      <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
                        Earn 3.50% APY on your savings with automatic monthly
                        interest crediting.
                      </p>
                      <Button
                        onClick={handleOpenSavingsAccount}
                        disabled={savingsLoading}
                        className="bg-bank-gold hover:bg-bank-gold/90 text-bank-navy font-semibold"
                        data-ocid="savings.open.button"
                      >
                        {savingsLoading ? "Opening..." : "Open Savings Account"}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card
                    className="border-2 border-bank-gold/30 bg-gradient-to-br from-white to-bank-gold/5 shadow-md"
                    data-ocid="savings.account.card"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-widest">
                            Account Number
                          </p>
                          <p className="font-mono font-semibold text-bank-navy text-lg mt-0.5">
                            {savingsAccount.accountId}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground uppercase tracking-widest">
                            Interest Rate
                          </p>
                          <p className="font-display text-bank-gold font-bold text-lg">
                            {savingsAccount.interestRate.toFixed(2)}% APY
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-bank-navy rounded-xl p-5 text-center">
                        <p className="text-white/60 text-xs uppercase tracking-widest mb-1">
                          Current Balance
                        </p>
                        <p className="font-display text-4xl font-bold text-bank-gold">
                          ${formatCurrency(savingsAccount.balance)}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-muted-foreground text-xs">
                            Last Interest Credited
                          </p>
                          <p className="font-semibold text-bank-navy mt-0.5">
                            {savingsAccount.lastInterestCredited}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-muted-foreground text-xs">
                            Total Interest Earned
                          </p>
                          <p className="font-semibold text-emerald-600 mt-0.5">
                            $
                            {formatCurrency(savingsAccount.totalInterestEarned)}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setAmount("");
                            setSavingsDepositOpen(true);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          data-ocid="savings.deposit.button"
                        >
                          <TrendingUp className="h-3.5 w-3.5 mr-1" /> Deposit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setAmount("");
                            setSavingsWithdrawOpen(true);
                          }}
                          variant="outline"
                          className="border-bank-navy text-bank-navy hover:bg-bank-navy hover:text-white"
                          data-ocid="savings.withdraw.button"
                        >
                          <TrendingDown className="h-3.5 w-3.5 mr-1" /> Withdraw
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setAmount("");
                            setTransferTo("");
                            setSavingsTransferOpen(true);
                          }}
                          variant="outline"
                          className="border-bank-navy text-bank-navy hover:bg-bank-navy hover:text-white"
                          data-ocid="savings.transfer.button"
                        >
                          <ArrowRightLeft className="h-3.5 w-3.5 mr-1" />{" "}
                          Transfer
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setSavingsStatementOpen(true)}
                          variant="outline"
                          className="border-bank-gold/50 text-bank-navy hover:bg-bank-gold/10"
                          data-ocid="savings.statement.button"
                        >
                          <FileText className="h-3.5 w-3.5 mr-1" /> Statement
                        </Button>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                          Recent Activity
                        </p>
                        {savingsTransactions.length === 0 ? (
                          <div
                            className="py-4 text-center text-muted-foreground text-sm"
                            data-ocid="savings.transactions.empty_state"
                          >
                            No savings transactions yet.
                          </div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-bank-navy font-semibold text-xs">
                                  Date
                                </TableHead>
                                <TableHead className="text-bank-navy font-semibold text-xs">
                                  Description
                                </TableHead>
                                <TableHead className="text-bank-navy font-semibold text-xs text-right">
                                  Amount
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {savingsTransactions.slice(0, 8).map((t, i) => (
                                <TableRow
                                  key={`stxn-${t.date}-${t.description}-${i}`}
                                  data-ocid={`savings.transactions.row.${i + 1}`}
                                >
                                  <TableCell className="text-muted-foreground text-xs">
                                    {t.date}
                                  </TableCell>
                                  <TableCell className="text-xs font-medium">
                                    {t.description}
                                  </TableCell>
                                  <TableCell
                                    className={`text-right font-semibold text-xs ${t.isDeposit ? "text-emerald-600" : "text-red-500"}`}
                                  >
                                    {t.isDeposit ? "+" : "-"}$
                                    {formatCurrency(t.amount)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* ---- FIXED DEPOSITS SUB-TAB ---- */}
              <TabsContent value="fixed_deposits" className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="h-5 w-5 text-bank-navy" />
                  <h2 className="font-display text-xl font-bold text-bank-navy">
                    Fixed / Term Deposits
                  </h2>
                </div>

                <Card className="border-2 border-bank-gold/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-display text-base text-bank-navy">
                      Fixed Deposit Calculator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fd-amount">Deposit Amount ($)</Label>
                        <Input
                          id="fd-amount"
                          type="number"
                          min="100"
                          step="100"
                          placeholder="e.g. 5000"
                          value={fdAmount}
                          onChange={(e) => setFdAmount(e.target.value)}
                          data-ocid="fixed_deposit.amount_input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Term Duration</Label>
                        <Select value={fdTerm} onValueChange={setFdTerm}>
                          <SelectTrigger data-ocid="fixed_deposit.term_select">
                            <SelectValue placeholder="Select term" />
                          </SelectTrigger>
                          <SelectContent>
                            {TERM_OPTIONS.map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                {t.label} — {t.rate}% APY
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {fdCalc && (
                      <div className="bg-bank-navy/5 border border-bank-navy/10 rounded-xl p-4 grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Interest Rate
                          </p>
                          <p className="font-display font-bold text-bank-gold text-xl">
                            {fdCalc.rate}%
                          </p>
                          <p className="text-xs text-muted-foreground">APY</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Maturity Date
                          </p>
                          <p className="font-semibold text-bank-navy text-sm">
                            {fdCalc.maturityDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Estimated Return
                          </p>
                          <p className="font-display font-bold text-emerald-600 text-lg">
                            ${formatCurrency(fdCalc.estimatedReturn)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            +${formatCurrency(fdCalc.interest)} interest
                          </p>
                        </div>
                      </div>
                    )}

                    <Button
                      disabled={!fdCalc}
                      onClick={handleCreateFixedDeposit}
                      className="w-full bg-bank-navy hover:bg-bank-navy/90 text-white font-semibold"
                      data-ocid="fixed_deposit.submit_button"
                    >
                      <Lock className="h-4 w-4 mr-2" /> Create Fixed Deposit
                    </Button>
                  </CardContent>
                </Card>

                {/* Active Fixed Deposits */}
                <Card className="border-border" data-ocid="fixed_deposit.table">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-display text-base text-bank-navy">
                        Active Fixed Deposits
                      </CardTitle>
                      <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                        <AlertTriangle className="h-3 w-3" />
                        Funds locked until maturity
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
                    {fixedDeposits.length === 0 ? (
                      <div
                        className="p-8 text-center text-muted-foreground"
                        data-ocid="fixed_deposit.empty_state"
                      >
                        No active fixed deposits.
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-bank-navy font-semibold text-xs">
                              Amount
                            </TableHead>
                            <TableHead className="text-bank-navy font-semibold text-xs">
                              Term
                            </TableHead>
                            <TableHead className="text-bank-navy font-semibold text-xs">
                              Rate
                            </TableHead>
                            <TableHead className="text-bank-navy font-semibold text-xs">
                              Maturity Date
                            </TableHead>
                            <TableHead className="text-bank-navy font-semibold text-xs">
                              Status
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fixedDeposits.map((fd, i) => (
                            <TableRow
                              key={fd.id}
                              data-ocid={`fixed_deposit.row.${i + 1}`}
                            >
                              <TableCell className="font-semibold text-sm">
                                ${formatCurrency(fd.amount)}
                              </TableCell>
                              <TableCell className="text-sm">
                                {fd.termLabel}
                              </TableCell>
                              <TableCell className="text-bank-gold font-semibold text-sm">
                                {fd.rate}% APY
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {fd.maturityDate}
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                                  <Lock className="h-2.5 w-2.5 mr-1" /> Locked
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ---- DEBIT CARD SUB-TAB ---- */}
              <TabsContent value="debit_card" className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-5 w-5 text-bank-navy" />
                  <h2 className="font-display text-xl font-bold text-bank-navy">
                    Debit Card Management
                  </h2>
                </div>

                {/* Visual Card */}
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div
                    className="w-full sm:w-72 h-44 bg-gradient-to-br from-bank-navy via-[#1a2d4d] to-[#0d1a2e] rounded-2xl p-5 shadow-xl relative overflow-hidden flex-shrink-0"
                    data-ocid="debit_card.card"
                  >
                    {/* Decorative circles */}
                    <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-bank-gold/10" />
                    <div className="absolute -right-4 -bottom-10 w-28 h-28 rounded-full bg-bank-gold/5" />
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-widest">
                          TRUPTAR Bank
                        </p>
                      </div>
                      <div className="text-right">
                        {cardFrozen ? (
                          <Badge className="bg-red-500/20 text-red-300 border-red-400/30 text-xs">
                            <Lock className="h-2.5 w-2.5 mr-1" /> Frozen
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs">
                            <CheckCircle2 className="h-2.5 w-2.5 mr-1" /> Active
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="relative z-10">
                      <p className="font-mono text-white tracking-widest text-sm">
                        **** **** **** 4287
                      </p>
                    </div>
                    <div className="flex justify-between items-end mt-4 relative z-10">
                      <div>
                        <p className="text-white/40 text-xs">CARD HOLDER</p>
                        <p className="text-white font-semibold text-xs tracking-wider">
                          ACCOUNT HOLDER
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/40 text-xs">EXPIRES</p>
                        <p className="text-bank-gold font-semibold text-sm">
                          12/28
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-5 z-10">
                      <p className="text-bank-gold/60 text-xs font-bold italic">
                        VISA
                      </p>
                    </div>
                  </div>

                  {/* Card actions */}
                  <div className="flex-1 space-y-3">
                    <h3 className="font-semibold text-bank-navy">
                      Card Controls
                    </h3>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className={`w-full justify-start h-11 ${
                          cardFrozen
                            ? "border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                            : "border-red-400 text-red-600 hover:bg-red-50"
                        }`}
                        onClick={() => {
                          setCardFrozen((v) => !v);
                          toast.success(
                            cardFrozen
                              ? "Card unfrozen successfully."
                              : "Card frozen. All transactions blocked.",
                          );
                        }}
                        data-ocid="debit_card.freeze_toggle"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        {cardFrozen ? "Unfreeze Card" : "Freeze Card"}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start h-11 border-bank-navy text-bank-navy hover:bg-bank-navy hover:text-white"
                        onClick={() => {
                          setReplaceReason("");
                          setReplaceCardOpen(true);
                        }}
                        data-ocid="debit_card.replace_button"
                      >
                        <CreditCard className="h-4 w-4 mr-2" /> Replace Card
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start h-11 border-bank-gold/60 text-bank-navy hover:bg-bank-gold/10"
                        onClick={() => setSetLimitOpen(true)}
                        data-ocid="debit_card.set_limit_button"
                      >
                        <ShieldCheck className="h-4 w-4 mr-2" /> Set Spending
                        Limit
                      </Button>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 text-sm">
                      <p className="text-muted-foreground text-xs">
                        Card Number
                      </p>
                      <p className="font-mono font-semibold text-bank-navy">
                        **** **** **** 4287
                      </p>
                      <p className="text-muted-foreground text-xs mt-2">
                        Expiry
                      </p>
                      <p className="font-semibold text-bank-navy">12/28</p>
                    </div>
                  </div>
                </div>

                {/* Recent Card Transactions */}
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-display text-base text-bank-navy">
                      Recent Card Transactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-bank-navy font-semibold text-xs">
                            Transaction ID
                          </TableHead>
                          <TableHead className="text-bank-navy font-semibold text-xs">
                            Type
                          </TableHead>
                          <TableHead className="text-bank-navy font-semibold text-xs text-right">
                            Amount
                          </TableHead>
                          <TableHead className="text-bank-navy font-semibold text-xs">
                            Date
                          </TableHead>
                          <TableHead className="text-bank-navy font-semibold text-xs">
                            Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {checkingTxns.filter((t) => t.txnType === "Debit Card")
                          .length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center text-muted-foreground py-6"
                              data-ocid="debit_card.transactions.empty_state"
                            >
                              No card transactions recorded.
                            </TableCell>
                          </TableRow>
                        ) : (
                          checkingTxns
                            .filter((t) => t.txnType === "Debit Card")
                            .map((t, i) => (
                              <TableRow
                                key={t.txnId}
                                data-ocid={`debit_card.transaction.row.${i + 1}`}
                              >
                                <TableCell className="font-mono text-xs text-muted-foreground">
                                  {t.txnId}
                                </TableCell>
                                <TableCell className="text-xs font-medium">
                                  {t.txnType}
                                </TableCell>
                                <TableCell className="text-xs text-right font-semibold">
                                  ${formatCurrency(t.amount)}
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                  {t.date}
                                </TableCell>
                                <TableCell>
                                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                                    {t.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ---- ONLINE BANKING SUB-TAB ---- */}
              <TabsContent value="online_banking" className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-5 w-5 text-bank-navy" />
                  <h2 className="font-display text-xl font-bold text-bank-navy">
                    Online Banking
                  </h2>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                    Active
                  </Badge>
                </div>

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      icon: BadgeDollarSign,
                      title: "Check Balances",
                      desc: "View real-time balances for all your accounts from a single dashboard.",
                      active: true,
                    },
                    {
                      icon: ArrowRightLeft,
                      title: "Transfer Funds",
                      desc: "Move money between accounts or send to external banks within 1 business day.",
                      active: true,
                    },
                    {
                      icon: FileText,
                      title: "Transaction History",
                      desc: "View and search your complete transaction history going back 24 months.",
                      active: true,
                    },
                    {
                      icon: Download,
                      title: "Download Statement",
                      desc: "Export your account statements in CSV or PDF format.",
                      active: true,
                    },
                    {
                      icon: Sparkles,
                      title: "Apply for Services",
                      desc: "Apply for new banking products — loans, credit cards, and more.",
                      active: true,
                    },
                    {
                      icon: ShieldCheck,
                      title: "Account Settings",
                      desc: "Update contact info, notification preferences, and security settings.",
                      active: true,
                    },
                  ].map((f) => (
                    <Card
                      key={f.title}
                      className="border-border hover:shadow-md transition-shadow"
                    >
                      <CardContent className="pt-5">
                        <div className="w-9 h-9 bg-bank-navy/10 rounded-lg flex items-center justify-center mb-3">
                          <f.icon className="h-4 w-4 text-bank-navy" />
                        </div>
                        <h4 className="font-semibold text-bank-navy text-sm mb-1">
                          {f.title}
                        </h4>
                        <p className="text-muted-foreground text-xs">
                          {f.desc}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    className="bg-bank-navy hover:bg-bank-navy/90 text-white"
                    onClick={handleDownloadStatement}
                    data-ocid="online_banking.download_statement_button"
                  >
                    <Download className="h-4 w-4 mr-2" /> Download Statement
                  </Button>
                  <Link
                    to="/services/personal"
                    data-ocid="online_banking.apply_services_button"
                  >
                    <Button
                      variant="outline"
                      className="border-bank-navy text-bank-navy hover:bg-bank-navy hover:text-white"
                    >
                      <Sparkles className="h-4 w-4 mr-2" /> Apply for New
                      Service
                    </Button>
                  </Link>
                </div>

                {/* Security Info */}
                <Card className="border-bank-gold/20 bg-bank-gold/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-display text-base text-bank-navy flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-bank-gold" />{" "}
                      Security & Authentication
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      {
                        icon: CheckCircle2,
                        label:
                          "2-Factor Verification available via Internet Identity",
                        color: "text-emerald-600",
                      },
                      {
                        icon: CheckCircle2,
                        label: "Email & password authentication supported",
                        color: "text-emerald-600",
                      },
                      {
                        icon: CheckCircle2,
                        label: "256-bit SSL encryption for all data in transit",
                        color: "text-emerald-600",
                      },
                      {
                        icon: CheckCircle2,
                        label: "Real-time fraud detection and account alerts",
                        color: "text-emerald-600",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="flex items-center gap-2 text-sm"
                      >
                        <s.icon
                          className={`h-4 w-4 ${s.color} flex-shrink-0`}
                        />
                        <span className="text-bank-navy">{s.label}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* ---- BUSINESS BANKING TAB ---- */}
          <TabsContent value="business">
            <div className="text-center py-6 mb-8">
              <h2 className="font-display text-2xl font-bold text-bank-navy mb-2">
                Business Banking
              </h2>
              <p className="text-muted-foreground">
                Comprehensive financial solutions for your business.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  icon: Building2,
                  title: "Business Checking",
                  desc: "High-volume transaction accounts with no monthly fee for qualifying businesses.",
                  badge: "Coming Soon",
                },
                {
                  icon: PiggyBank,
                  title: "Business Savings",
                  desc: "Competitive yield savings for your operating reserves and business funds.",
                  badge: "Coming Soon",
                },
                {
                  icon: BadgeDollarSign,
                  title: "Merchant Services",
                  desc: "Accept payments in-store and online with our integrated POS solutions.",
                  badge: "Coming Soon",
                },
                {
                  icon: ArrowRightLeft,
                  title: "Payroll Services",
                  desc: "Streamlined payroll processing integrated directly with your business account.",
                  badge: "Coming Soon",
                },
                {
                  icon: Sparkles,
                  title: "Business Advisory",
                  desc: "One-on-one guidance from seasoned banking professionals for your growth goals.",
                  badge: "Coming Soon",
                },
              ].map((item) => (
                <Card
                  key={item.title}
                  className="border-border hover:shadow-md transition-shadow"
                  data-ocid={`dashboard.business.${item.title.toLowerCase().replace(/\s+/g, "_")}.card`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 bg-bank-navy/10 rounded-lg flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-bank-navy" />
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs text-muted-foreground border-muted-foreground/30"
                      >
                        {item.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-base text-bank-navy mt-2">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ---- LOAN SERVICES TAB ---- */}
          <TabsContent value="loans">
            <DashboardLoanServices />
          </TabsContent>

          {/* ---- DIGITAL BANKING TAB ---- */}
          <TabsContent value="digital">
            <DashboardDigitalBanking />
          </TabsContent>
        </Tabs>
      </div>

      {/* ===== DIALOGS ===== */}

      {/* Deposit Dialog */}
      <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
        <DialogContent data-ocid="dashboard.deposit.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-bank-navy">
              Deposit to Checking
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              data-ocid="dashboard.deposit.confirm.button"
            >
              {processing ? "Processing..." : "Deposit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent data-ocid="dashboard.withdraw.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-bank-navy">
              Withdraw from Checking
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

      {/* Send Money Dialog */}
      <Dialog open={sendMoneyOpen} onOpenChange={setSendMoneyOpen}>
        <DialogContent data-ocid="checking.send_money_dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-bank-navy">
              Send Money
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="send-recipient">Recipient</Label>
              <Input
                id="send-recipient"
                value={sendRecipient}
                onChange={(e) => setSendRecipient(e.target.value)}
                placeholder="Name or account number"
                data-ocid="checking.send_money.input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="send-amount">Amount ($)</Label>
              <Input
                id="send-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="send-note">Note (optional)</Label>
              <Textarea
                id="send-note"
                value={sendNote}
                onChange={(e) => setSendNote(e.target.value)}
                placeholder="What's this for?"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSendMoneyOpen(false)}
              data-ocid="checking.send_money.cancel.button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMoney}
              disabled={processing || !sendRecipient || !sendAmount}
              className="bg-bank-navy text-white hover:bg-bank-navy/90"
              data-ocid="checking.send_money.confirm.button"
            >
              {processing ? "Sending..." : "Send Money"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Payment Dialog */}
      <Dialog open={requestPaymentOpen} onOpenChange={setRequestPaymentOpen}>
        <DialogContent data-ocid="checking.request_payment_dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-bank-navy">
              Request Payment
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="req-from">Request From</Label>
              <Input
                id="req-from"
                value={requestFrom}
                onChange={(e) => setRequestFrom(e.target.value)}
                placeholder="Name or email"
                data-ocid="checking.request_payment.input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="req-amount">Amount ($)</Label>
              <Input
                id="req-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={requestAmount}
                onChange={(e) => setRequestAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="req-message">Message (optional)</Label>
              <Textarea
                id="req-message"
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Payment description"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRequestPaymentOpen(false)}
              data-ocid="checking.request_payment.cancel.button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRequestPayment}
              disabled={processing || !requestFrom || !requestAmount}
              className="bg-bank-navy text-white hover:bg-bank-navy/90"
              data-ocid="checking.request_payment.confirm.button"
            >
              {processing ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pay Bills Dialog */}
      <Dialog open={payBillsOpen} onOpenChange={setPayBillsOpen}>
        <DialogContent data-ocid="checking.pay_bills_dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-bank-navy">
              Pay Bill
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="biller-name">Biller Name</Label>
              <Input
                id="biller-name"
                value={billerName}
                onChange={(e) => setBillerName(e.target.value)}
                placeholder="e.g. Electric Company"
                data-ocid="checking.pay_bills.input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="biller-account">Biller Account Number</Label>
              <Input
                id="biller-account"
                value={billerAccount}
                onChange={(e) => setBillerAccount(e.target.value)}
                placeholder="Account number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bill-amount">Amount ($)</Label>
              <Input
                id="bill-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPayBillsOpen(false)}
              data-ocid="checking.pay_bills.cancel.button"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayBills}
              disabled={processing || !billerName || !billAmount}
              className="bg-bank-navy text-white hover:bg-bank-navy/90"
              data-ocid="checking.pay_bills.confirm.button"
            >
              {processing ? "Processing..." : "Pay Bill"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Between Accounts Dialog */}
      <Dialog open={transferBetweenOpen} onOpenChange={setTransferBetweenOpen}>
        <DialogContent data-ocid="checking.transfer_dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-bank-navy">
              Transfer Between Accounts
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Transfer To</Label>
              <Select
                value={transferToAccount}
                onValueChange={setTransferToAccount}
              >
                <SelectTrigger data-ocid="checking.transfer.select">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Savings Account">
                    Savings Account
                  </SelectItem>
                  <SelectItem value="Fixed Deposit">Fixed Deposit</SelectItem>
                  <SelectItem value="External Account">
                    External Account
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transfer-between-amount">Amount ($)</Label>
              <Input
                id="transfer-between-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="0.00"
                data-ocid="checking.transfer.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTransferBetweenOpen(false)}
              data-ocid="checking.transfer.cancel.button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleTransferBetween}
              disabled={processing || !transferToAccount || !transferAmount}
              className="bg-bank-navy text-white hover:bg-bank-navy/90"
              data-ocid="checking.transfer.confirm.button"
            >
              {processing ? "Transferring..." : "Transfer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Replace Card Dialog */}
      <Dialog open={replaceCardOpen} onOpenChange={setReplaceCardOpen}>
        <DialogContent data-ocid="debit_card.replace.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-bank-navy">
              Replace Debit Card
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Label>Reason for Replacement</Label>
            <Select value={replaceReason} onValueChange={setReplaceReason}>
              <SelectTrigger data-ocid="debit_card.replace.select">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lost">Lost Card</SelectItem>
                <SelectItem value="stolen">Stolen Card</SelectItem>
                <SelectItem value="damaged">Damaged Card</SelectItem>
                <SelectItem value="expired">Expired Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReplaceCardOpen(false)}
              data-ocid="debit_card.replace.cancel.button"
            >
              Cancel
            </Button>
            <Button
              disabled={!replaceReason}
              onClick={() => {
                setReplaceCardOpen(false);
                toast.success(
                  "Card replacement request submitted. New card will arrive in 5-7 business days.",
                );
              }}
              className="bg-bank-navy text-white hover:bg-bank-navy/90"
              data-ocid="debit_card.replace.confirm.button"
            >
              Request Replacement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Set Spending Limit Dialog */}
      <Dialog open={setLimitOpen} onOpenChange={setSetLimitOpen}>
        <DialogContent data-ocid="debit_card.set_limit.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-bank-navy">
              Set Daily Spending Limit
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Label htmlFor="daily-limit">Daily Limit ($)</Label>
            <Input
              id="daily-limit"
              type="number"
              min="50"
              step="50"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(e.target.value)}
              data-ocid="debit_card.set_limit.input"
            />
            <p className="text-xs text-muted-foreground">
              Minimum daily limit: $50. Maximum: $10,000.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSetLimitOpen(false)}
              data-ocid="debit_card.set_limit.cancel.button"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setSetLimitOpen(false);
                toast.success(
                  `Daily spending limit set to $${Number.parseFloat(dailyLimit).toFixed(2)}.`,
                );
              }}
              className="bg-bank-navy text-white hover:bg-bank-navy/90"
              data-ocid="debit_card.set_limit.confirm.button"
            >
              Save Limit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Savings Deposit Dialog */}
      <Dialog open={savingsDepositOpen} onOpenChange={setSavingsDepositOpen}>
        <DialogContent data-ocid="savings.deposit.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-bank-navy">
              Deposit to Savings
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Label htmlFor="savings-deposit-amount">Amount ($)</Label>
            <Input
              id="savings-deposit-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              data-ocid="savings.deposit.input"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSavingsDepositOpen(false)}
              data-ocid="savings.deposit.cancel.button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavingsDeposit}
              disabled={processing || !amount}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              data-ocid="savings.deposit.confirm.button"
            >
              {processing ? "Processing..." : "Deposit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Savings Withdraw Dialog */}
      <Dialog open={savingsWithdrawOpen} onOpenChange={setSavingsWithdrawOpen}>
        <DialogContent data-ocid="savings.withdraw.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-bank-navy">
              Withdraw from Savings
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Label htmlFor="savings-withdraw-amount">Amount ($)</Label>
            <Input
              id="savings-withdraw-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              data-ocid="savings.withdraw.input"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSavingsWithdrawOpen(false)}
              data-ocid="savings.withdraw.cancel.button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavingsWithdraw}
              disabled={processing || !amount}
              className="bg-bank-navy text-white hover:bg-bank-navy/90"
              data-ocid="savings.withdraw.confirm.button"
            >
              {processing ? "Processing..." : "Withdraw"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Savings Transfer Dialog */}
      <Dialog open={savingsTransferOpen} onOpenChange={setSavingsTransferOpen}>
        <DialogContent data-ocid="savings.transfer.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-bank-navy">
              Transfer from Savings
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="transfer-to">Transfer To</Label>
              <Input
                id="transfer-to"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                placeholder="Checking account / recipient"
                data-ocid="savings.transfer.input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transfer-amount">Amount ($)</Label>
              <Input
                id="transfer-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                data-ocid="savings.transfer.amount.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSavingsTransferOpen(false)}
              data-ocid="savings.transfer.cancel.button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavingsTransfer}
              disabled={processing || !amount}
              className="bg-bank-navy text-white hover:bg-bank-navy/90"
              data-ocid="savings.transfer.confirm.button"
            >
              {processing ? "Processing..." : "Transfer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Savings Statement Dialog */}
      <Dialog
        open={savingsStatementOpen}
        onOpenChange={setSavingsStatementOpen}
      >
        <DialogContent
          className="max-w-lg"
          data-ocid="savings.statement.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-bank-navy">
              Account Statement
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            {savingsAccount && (
              <div className="bg-slate-50 rounded-lg p-4 mb-4 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground">Account:</span>{" "}
                    <span className="font-mono font-semibold">
                      {savingsAccount.accountId}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Balance:</span>{" "}
                    <span className="font-semibold">
                      ${formatCurrency(savingsAccount.balance)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rate:</span>{" "}
                    <span className="font-semibold text-bank-gold">
                      {savingsAccount.interestRate}% APY
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Interest Earned:
                    </span>{" "}
                    <span className="font-semibold text-emerald-600">
                      ${formatCurrency(savingsAccount.totalInterestEarned)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {savingsTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No transactions recorded.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savingsTransactions.map((t, i) => (
                    <TableRow key={`stmt-${t.date}-${t.description}-${i}`}>
                      <TableCell className="text-xs text-muted-foreground">
                        {t.date}
                      </TableCell>
                      <TableCell className="text-xs">{t.description}</TableCell>
                      <TableCell
                        className={`text-xs text-right font-semibold ${t.isDeposit ? "text-emerald-600" : "text-red-500"}`}
                      >
                        {t.isDeposit ? "+" : "-"}${formatCurrency(t.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSavingsStatementOpen(false)}
              data-ocid="savings.statement.close.button"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
