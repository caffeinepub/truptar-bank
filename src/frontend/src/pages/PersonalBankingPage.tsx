import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeDollarSign,
  Bell,
  Building,
  CreditCard,
  Globe,
  PiggyBank,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

const services = [
  {
    icon: PiggyBank,
    title: "Savings Accounts",
    desc: "Earn 3.50% APY with automatic monthly interest crediting. Open with as little as $25. FDIC insured up to $250,000.",
    badge: "3.50% APY",
    badgeColor: "bg-bank-gold/20 text-bank-navy border-bank-gold/30",
  },
  {
    icon: CreditCard,
    title: "Checking Accounts",
    desc: "Fee-free checking with unlimited transactions, free debit card, and access to 30,000+ surcharge-free ATMs nationwide.",
    badge: "No Monthly Fee",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    icon: Building,
    title: "Fixed/Term Deposits",
    desc: "Lock in higher guaranteed rates with 3, 6, 12, or 24-month term deposits. Ideal for savings goals with a defined timeline.",
    badge: "Up to 4.75% APY",
    badgeColor: "bg-bank-gold/20 text-bank-navy border-bank-gold/30",
  },
  {
    icon: CreditCard,
    title: "Debit Cards",
    desc: "Contactless Visa debit cards accepted at millions of locations worldwide with real-time transaction alerts.",
    badge: "Visa",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    icon: Globe,
    title: "Online Banking",
    desc: "Manage all accounts, pay bills, and transfer funds securely from any browser, any time, from anywhere in the world.",
    badge: "24/7 Access",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    icon: Smartphone,
    title: "Mobile Banking",
    desc: "Full-featured iOS and Android app with mobile check deposit, instant transfers, and biometric login.",
    badge: "iOS & Android",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
  },
];

const savingsFeatures = [
  { label: "Interest Rate", value: "3.50% APY" },
  { label: "Minimum Opening Deposit", value: "$25.00" },
  { label: "Monthly Fee", value: "None" },
  { label: "Interest Compounding", value: "Monthly" },
  { label: "FDIC Insured", value: "Up to $250,000" },
  { label: "Withdrawal Limit", value: "6 per month" },
];

const mobileBankingFeatures = [
  {
    icon: BadgeDollarSign,
    title: "Balance Viewing",
    desc: "Check all account balances in real-time from your phone.",
  },
  {
    icon: ArrowRight,
    title: "Instant Transfers",
    desc: "Move money between accounts or send to contacts instantly.",
  },
  {
    icon: CreditCard,
    title: "Mobile Check Deposit",
    desc: "Deposit checks by simply taking a photo with your camera.",
  },
  {
    icon: Bell,
    title: "Push Notifications",
    desc: "Receive instant alerts for every transaction and account activity.",
  },
  {
    icon: ShieldCheck,
    title: "Security Alerts",
    desc: "Real-time notifications for suspicious activity and login attempts.",
  },
];

export default function PersonalBankingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-bank-navy py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Personal Banking
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Financial products designed around your life — from your first
            savings account to complex personal finance needs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/open-account" data-ocid="personal.open_account.link">
              <Button className="bg-bank-gold text-bank-navy hover:bg-bank-gold/90 font-semibold">
                Open an Account <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/dashboard" data-ocid="personal.dashboard.link">
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Savings Account Feature Spotlight */}
      <section className="py-16 bg-white" data-ocid="personal.savings.section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
          <h2 className="font-display text-3xl font-bold text-bank-navy mb-2">
            Savings Accounts
          </h2>
          <p className="text-muted-foreground mb-8">
            Grow your money with one of the most competitive savings rates in
            the region.
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Feature table */}
            <Card className="border-2 border-bank-gold/20">
              <CardHeader>
                <CardTitle className="font-display text-bank-navy flex items-center gap-2">
                  <PiggyBank className="h-5 w-5 text-bank-gold" /> Account
                  Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-border">
                  {savingsFeatures.map((f) => (
                    <div
                      key={f.label}
                      className="flex justify-between py-3 text-sm"
                    >
                      <span className="text-muted-foreground">{f.label}</span>
                      <span className="font-semibold text-bank-navy">
                        {f.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <div className="space-y-4">
              <h3 className="font-display text-xl font-bold text-bank-navy">
                Why Choose TRUPTAR Savings?
              </h3>
              {[
                {
                  icon: BadgeDollarSign,
                  title: "Competitive 3.50% APY",
                  desc: "Earn more with one of the highest rates available at a community bank.",
                },
                {
                  icon: ShieldCheck,
                  title: "FDIC Insured",
                  desc: "Your deposits are fully protected up to $250,000 by the FDIC.",
                },
                {
                  icon: Globe,
                  title: "24/7 Online Access",
                  desc: "Monitor balances and track interest earnings from anywhere, anytime.",
                },
                {
                  icon: BadgeDollarSign,
                  title: "Automatic Interest Crediting",
                  desc: "Interest is calculated daily and credited to your account monthly.",
                },
              ].map((b) => (
                <div key={b.title} className="flex gap-3">
                  <div className="w-8 h-8 bg-bank-navy/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <b.icon className="h-4 w-4 text-bank-navy" />
                  </div>
                  <div>
                    <p className="font-semibold text-bank-navy text-sm">
                      {b.title}
                    </p>
                    <p className="text-muted-foreground text-sm">{b.desc}</p>
                  </div>
                </div>
              ))}

              <Link
                to="/open-account"
                data-ocid="personal.savings.open_account.link"
              >
                <Button className="bg-bank-navy hover:bg-bank-navy/90 text-white w-full mt-4">
                  Open Savings Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Banking Section */}
      <section
        className="py-16 bg-bank-navy"
        data-ocid="personal.mobile_banking.section"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-bank-gold/20 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-bank-gold" />
                </div>
                <Badge className="bg-bank-gold/20 text-bank-gold border-bank-gold/30 text-xs">
                  iOS & Android
                </Badge>
              </div>
              <h2 className="font-display text-3xl font-bold text-white mb-4">
                Mobile Banking
              </h2>
              <p className="text-white/70 text-base mb-6">
                Everything you can do online, in your pocket. TRUPTAR's mobile
                app mirrors all online banking features with a mobile-first
                experience designed for daily use.
              </p>
              <Link
                to="/dashboard"
                data-ocid="personal.mobile_banking.dashboard.link"
              >
                <Button className="bg-bank-gold text-bank-navy hover:bg-bank-gold/90 font-semibold">
                  Access Dashboard <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {mobileBankingFeatures.map((f, i) => (
                <div
                  key={f.title}
                  className="flex gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  data-ocid={`personal.mobile_banking.feature.${i + 1}`}
                >
                  <div className="w-9 h-9 bg-bank-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <f.icon className="h-4 w-4 text-bank-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">
                      {f.title}
                    </p>
                    <p className="text-white/60 text-xs mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Personal Services */}
      <section
        className="py-16 bg-slate-50"
        data-ocid="personal.services.section"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
          <h2 className="font-display text-3xl font-bold text-bank-navy mb-8">
            All Personal Services
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <Card
                key={s.title}
                className="border-border hover:shadow-md transition-shadow bg-white"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 bg-bank-navy/10 rounded-lg flex items-center justify-center">
                      <s.icon className="h-5 w-5 text-bank-navy" />
                    </div>
                    <Badge className={`text-xs ${s.badgeColor}`}>
                      {s.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-base text-bank-navy">
                    {s.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 bg-bank-navy text-center"
        data-ocid="personal.cta.section"
      >
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/70 mb-8">
            Open your account in minutes. No paperwork. No hidden fees.
          </p>
          <Link to="/open-account" data-ocid="personal.cta.open_account.link">
            <Button className="bg-bank-gold text-bank-navy hover:bg-bank-gold/90 font-semibold text-lg px-8 py-3 h-auto">
              Open an Account Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
