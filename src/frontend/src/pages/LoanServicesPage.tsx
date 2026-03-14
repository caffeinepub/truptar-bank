import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calculator,
  Car,
  CheckCircle2,
  DollarSign,
  Home,
  Users,
} from "lucide-react";
import { useState } from "react";

function fmt(n: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function calcMonthly(principal: number, annualRate: number, months: number) {
  const r = annualRate / 12;
  if (r === 0) return principal / months;
  const base = (1 + r) ** months;
  return (principal * r * base) / (base - 1);
}

/* ---- Personal Loans ---- */
function PersonalLoanForm() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-center space-y-4"
        data-ocid="loans.personal.success_state"
      >
        <CheckCircle2 className="h-14 w-14 text-green-500" />
        <h3 className="font-display text-2xl font-bold text-bank-navy">
          Application Submitted!
        </h3>
        <p className="text-muted-foreground max-w-md">
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
          className="border-bank-navy text-bank-navy hover:bg-bank-navy/5"
        >
          Submit Another Application
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pl-fullname">Full Name *</Label>
          <Input
            id="pl-fullname"
            placeholder="John Doe"
            value={form.fullName}
            onChange={(e) => set("fullName")(e.target.value)}
            required
            data-ocid="loans.personal.fullname_input"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pl-account">Account Number *</Label>
          <Input
            id="pl-account"
            placeholder="TRUP-XXXXXXXX"
            value={form.accountNumber}
            onChange={(e) => set("accountNumber")(e.target.value)}
            required
            data-ocid="loans.personal.account_input"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pl-amount">Loan Amount ($) *</Label>
        <Input
          id="pl-amount"
          type="number"
          min="500"
          placeholder="10000"
          value={form.loanAmount}
          onChange={(e) => set("loanAmount")(e.target.value)}
          required
          data-ocid="loans.personal.amount_input"
        />
      </div>

      <div className="space-y-2">
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
        <div className="space-y-2">
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
        <div className="space-y-2">
          <Label htmlFor="pl-income">Monthly Income ($) *</Label>
          <Input
            id="pl-income"
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
        className="w-full bg-bank-navy hover:bg-bank-navy/90 text-white font-semibold py-3 h-auto"
        data-ocid="loans.personal.submit_button"
      >
        Submit Loan Application
      </Button>
    </form>
  );
}

/* ---- Mortgage Loans ---- */
function MortgageForm() {
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
  const annualRate = 0.065;
  const monthly =
    months > 0 && loanAmt > 0 ? calcMonthly(loanAmt, annualRate, months) : 0;
  const dti = inc > 0 ? (monthly / inc) * 100 : 0;
  const showCalc = pv > 0 && dp >= 0 && months > 0 && loanAmt > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-center space-y-4"
        data-ocid="loans.mortgage.success_state"
      >
        <CheckCircle2 className="h-14 w-14 text-green-500" />
        <h3 className="font-display text-2xl font-bold text-bank-navy">
          Mortgage Application Submitted!
        </h3>
        <p className="text-muted-foreground max-w-md">
          Thank you for applying. A mortgage specialist will contact you within
          3–5 business days to discuss your options.
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
          className="border-bank-navy text-bank-navy hover:bg-bank-navy/5"
        >
          Submit Another Application
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mg-pv">Property Value ($) *</Label>
          <Input
            id="mg-pv"
            type="number"
            min="10000"
            placeholder="350000"
            value={form.propertyValue}
            onChange={(e) => set("propertyValue")(e.target.value)}
            required
            data-ocid="loans.mortgage.property_value_input"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mg-dp">Down Payment ($) *</Label>
          <Input
            id="mg-dp"
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
        <div className="space-y-2">
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
        <div className="space-y-2">
          <Label htmlFor="mg-inc">Monthly Income ($) *</Label>
          <Input
            id="mg-inc"
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
        <div className="rounded-xl bg-bank-navy/5 border border-bank-navy/20 p-5 space-y-3">
          <h4 className="font-display font-bold text-bank-navy text-sm uppercase tracking-widest">
            Estimated Repayment Summary
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Loan Amount</p>
              <p className="font-bold text-bank-navy">${fmt(loanAmt)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">
                Interest Rate
              </p>
              <p className="font-bold text-bank-gold">6.50% p.a.</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">
                Monthly Payment
              </p>
              <p className="font-bold text-bank-navy text-lg">
                ${fmt(monthly)}
              </p>
            </div>
            {inc > 0 && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  Debt-to-Income
                </p>
                <p
                  className={`font-bold text-lg ${dti > 43 ? "text-red-600" : "text-green-600"}`}
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
        className="w-full bg-bank-navy hover:bg-bank-navy/90 text-white font-semibold py-3 h-auto"
        data-ocid="loans.mortgage.submit_button"
      >
        Apply for Mortgage
      </Button>
    </form>
  );
}

/* ---- Auto Loans ---- */
function AutoLoanForm() {
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
  const annualRate = 0.079;
  const monthly =
    months > 0 && loanAmt > 0 ? calcMonthly(loanAmt, annualRate, months) : 0;
  const totalPayment = monthly * months;
  const totalInterest = totalPayment - loanAmt;
  const showCalc = vp > 0 && months > 0 && loanAmt > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="flex flex-col items-center justify-center py-10 text-center space-y-4"
        data-ocid="loans.auto.success_state"
      >
        <CheckCircle2 className="h-14 w-14 text-green-500" />
        <h3 className="font-display text-2xl font-bold text-bank-navy">
          Auto Loan Application Submitted!
        </h3>
        {showCalc && (
          <div className="rounded-xl bg-bank-navy text-white p-5 w-full max-w-md text-left space-y-2">
            <p className="text-white/60 text-xs uppercase tracking-widest mb-2">
              Repayment Summary
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-white/70">Loan Amount:</span>
              <span className="font-semibold">${fmt(loanAmt)}</span>
              <span className="text-white/70">Monthly Payment:</span>
              <span className="font-semibold text-bank-gold">
                ${fmt(monthly)}
              </span>
              <span className="text-white/70">Total Payment:</span>
              <span className="font-semibold">${fmt(totalPayment)}</span>
              <span className="text-white/70">Total Interest:</span>
              <span className="font-semibold">${fmt(totalInterest)}</span>
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
          className="border-bank-navy text-bank-navy hover:bg-bank-navy/5"
        >
          Submit Another Application
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="al-vp">Vehicle Price ($) *</Label>
          <Input
            id="al-vp"
            type="number"
            min="1000"
            placeholder="35000"
            value={form.vehiclePrice}
            onChange={(e) => set("vehiclePrice")(e.target.value)}
            required
            data-ocid="loans.auto.vehicle_price_input"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="al-dp">Down Payment ($) *</Label>
          <Input
            id="al-dp"
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
        <div className="space-y-2">
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
        <div className="space-y-2">
          <Label htmlFor="al-dealer">Dealership Name *</Label>
          <Input
            id="al-dealer"
            placeholder="ABC Auto Dealers"
            value={form.dealershipName}
            onChange={(e) => set("dealershipName")(e.target.value)}
            required
            data-ocid="loans.auto.dealership_input"
          />
        </div>
      </div>

      {showCalc && (
        <div className="rounded-xl bg-bank-navy/5 border border-bank-navy/20 p-5 space-y-3">
          <h4 className="font-display font-bold text-bank-navy text-sm uppercase tracking-widest">
            Repayment Plan
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Loan Amount</p>
              <p className="font-bold text-bank-navy">${fmt(loanAmt)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Monthly Payment
              </p>
              <p className="font-bold text-bank-gold text-lg">
                ${fmt(monthly)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Total Payment
              </p>
              <p className="font-bold text-bank-navy">${fmt(totalPayment)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Total Interest
              </p>
              <p className="font-bold text-bank-navy">${fmt(totalInterest)}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            * Rate: 7.90% p.a. fixed
          </p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-bank-navy hover:bg-bank-navy/90 text-white font-semibold py-3 h-auto"
        data-ocid="loans.auto.submit_button"
      >
        Submit Auto Loan Application
      </Button>
    </form>
  );
}

/* ---- Community Development Loans ---- */
function CommunityLoanForm() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-center space-y-4"
        data-ocid="loans.community.success_state"
      >
        <CheckCircle2 className="h-14 w-14 text-green-500" />
        <h3 className="font-display text-2xl font-bold text-bank-navy">
          Application Received!
        </h3>
        <p className="text-muted-foreground max-w-md">
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
          className="border-bank-navy text-bank-navy hover:bg-bank-navy/5"
        >
          Submit Another Application
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cl-pname">Project Name *</Label>
          <Input
            id="cl-pname"
            placeholder="Community Health Clinic"
            value={form.projectName}
            onChange={(e) => set("projectName")(e.target.value)}
            required
            data-ocid="loans.community.project_name_input"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cl-org">Organization Name *</Label>
          <Input
            id="cl-org"
            placeholder="Riverside Community Foundation"
            value={form.orgName}
            onChange={(e) => set("orgName")(e.target.value)}
            required
            data-ocid="loans.community.org_name_input"
          />
        </div>
      </div>

      <div className="space-y-2">
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

      <div className="space-y-2">
        <Label htmlFor="cl-desc">
          Project Description *{" "}
          <span className="text-muted-foreground text-xs">
            (min. 100 characters)
          </span>
        </Label>
        <Textarea
          id="cl-desc"
          placeholder="Describe the project goals, timeline, and expected outcomes in detail..."
          rows={4}
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
        <div className="space-y-2">
          <Label htmlFor="cl-budget">Total Budget ($) *</Label>
          <Input
            id="cl-budget"
            type="number"
            min="1000"
            placeholder="250000"
            value={form.budget}
            onChange={(e) => set("budget")(e.target.value)}
            required
            data-ocid="loans.community.budget_input"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cl-loan">Requested Loan Amount ($) *</Label>
          <Input
            id="cl-loan"
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

      <div className="space-y-2">
        <Label htmlFor="cl-impact">Expected Community Impact *</Label>
        <Textarea
          id="cl-impact"
          placeholder="Describe how this project will benefit the local community..."
          rows={3}
          value={form.impact}
          onChange={(e) => set("impact")(e.target.value)}
          required
          data-ocid="loans.community.impact_textarea"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-bank-navy hover:bg-bank-navy/90 text-white font-semibold py-3 h-auto"
        data-ocid="loans.community.submit_button"
      >
        Submit Community Development Application
      </Button>
    </form>
  );
}

/* ---- Loan Estimator (sidebar) ---- */
function LoanEstimator() {
  const [principal, setPrincipal] = useState(10000);
  const [termMonths, setTermMonths] = useState(36);
  const annualRate = 0.05;
  const monthly = calcMonthly(principal, annualRate, termMonths);
  const totalCost = monthly * termMonths;
  const totalInterest = totalCost - principal;

  return (
    <Card className="border-2 border-bank-gold/30 bg-gradient-to-br from-white to-bank-gold/5">
      <CardHeader>
        <CardTitle className="font-display text-bank-navy flex items-center gap-2">
          <Calculator className="h-5 w-5 text-bank-gold" /> Quick Estimator
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Estimate at a 5% illustrative rate.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Loan Amount</Label>
            <span className="font-semibold text-bank-navy">
              ${principal.toLocaleString()}
            </span>
          </div>
          <Slider
            min={1000}
            max={100000}
            step={1000}
            value={[principal]}
            onValueChange={(v) => setPrincipal(v[0])}
            className="[&_[role=slider]]:bg-bank-navy"
            data-ocid="loans.estimator.amount.input"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$1,000</span>
            <span>$100,000</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Loan Term</Label>
            <span className="font-semibold text-bank-navy">
              {termMonths} months
            </span>
          </div>
          <Slider
            min={6}
            max={360}
            step={6}
            value={[termMonths]}
            onValueChange={(v) => setTermMonths(v[0])}
            className="[&_[role=slider]]:bg-bank-navy"
            data-ocid="loans.estimator.term.input"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>6 months</span>
            <span>360 months</span>
          </div>
        </div>
        <div className="bg-bank-navy rounded-xl p-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-white/60 text-xs uppercase mb-1">Monthly</p>
              <p className="font-display text-xl font-bold text-bank-gold">
                ${Number.isFinite(monthly) ? monthly.toFixed(2) : "—"}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-xs uppercase mb-1">Total</p>
              <p className="font-display text-xl font-bold text-white">
                ${Number.isFinite(totalCost) ? totalCost.toFixed(0) : "—"}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-xs uppercase mb-1">Interest</p>
              <p className="font-display text-xl font-bold text-white/70">
                $
                {Number.isFinite(totalInterest)
                  ? totalInterest.toFixed(0)
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---- Main Page ---- */
export default function LoanServicesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-bank-navy py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Loan Services
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Competitive rates, fast decisions, and flexible terms from a
            community lender that keeps its decisions local.
          </p>
        </div>
      </section>

      {/* Loan Application Tabs */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Forms */}
            <div className="lg:col-span-2">
              <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
              <h2 className="font-display text-3xl font-bold text-bank-navy mb-6">
                Apply for a Loan
              </h2>
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
                        <DollarSign className="h-5 w-5 text-bank-gold" />
                        Personal Loan Application
                      </CardTitle>
                      <p className="text-muted-foreground text-sm">
                        Unsecured personal loans from $1,000 – $50,000 at 6.99%
                        APR.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <PersonalLoanForm />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="mortgage">
                  <Card className="border-bank-navy/10">
                    <CardHeader>
                      <CardTitle className="font-display text-bank-navy flex items-center gap-2">
                        <Home className="h-5 w-5 text-bank-gold" />
                        Mortgage Loan Application
                      </CardTitle>
                      <p className="text-muted-foreground text-sm">
                        Fixed-rate mortgages at 6.50% APR. Repayment calculated
                        automatically.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <MortgageForm />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="auto">
                  <Card className="border-bank-navy/10">
                    <CardHeader>
                      <CardTitle className="font-display text-bank-navy flex items-center gap-2">
                        <Car className="h-5 w-5 text-bank-gold" />
                        Auto Loan Application
                      </CardTitle>
                      <p className="text-muted-foreground text-sm">
                        Vehicle financing at 7.90% APR with instant repayment
                        plan.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <AutoLoanForm />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="community">
                  <Card className="border-bank-navy/10">
                    <CardHeader>
                      <CardTitle className="font-display text-bank-navy flex items-center gap-2">
                        <Users className="h-5 w-5 text-bank-gold" />
                        Community Development Loan
                      </CardTitle>
                      <p className="text-muted-foreground text-sm">
                        Below-market financing for schools, healthcare, local
                        businesses &amp; more at 4.00% APR.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <CommunityLoanForm />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar Estimator */}
            <div className="lg:col-span-1 sticky top-6">
              <LoanEstimator />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-bank-navy text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Ready to Apply?
          </h2>
          <p className="text-white/70 mb-8">
            Complete our simple application in under 10 minutes. Most decisions
            in 48 hours.
          </p>
          <Link to="/services/loans" data-ocid="loans.cta.apply.link">
            <Button className="bg-bank-gold text-bank-navy hover:bg-bank-gold/90 font-semibold text-lg px-8 py-3 h-auto">
              Explore All Loan Products <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
