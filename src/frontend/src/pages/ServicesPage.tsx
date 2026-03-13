import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building,
  Car,
  CreditCard,
  DollarSign,
  Globe,
  Home,
  Smartphone,
  Users,
  Wallet,
} from "lucide-react";

const personalServices = [
  {
    icon: DollarSign,
    title: "Savings Accounts",
    desc: "Competitive interest rates to grow your money safely.",
  },
  {
    icon: CreditCard,
    title: "Checking Accounts",
    desc: "Flexible checking with no hidden fees and free ATM access.",
  },
  {
    icon: Building,
    title: "Fixed/Term Deposits",
    desc: "Lock in higher rates with our fixed-term deposit products.",
  },
  {
    icon: CreditCard,
    title: "Debit Cards",
    desc: "Contactless Visa debit cards accepted worldwide.",
  },
  {
    icon: Globe,
    title: "Online Banking",
    desc: "Manage your accounts securely from any browser, 24/7.",
  },
  {
    icon: Smartphone,
    title: "Mobile Banking",
    desc: "Full-featured mobile app for iOS and Android.",
  },
];

const businessServices = [
  {
    icon: Building,
    title: "Small Business Accounts",
    desc: "Business checking and savings designed for local entrepreneurs.",
  },
  {
    icon: DollarSign,
    title: "Business Loans",
    desc: "Flexible financing for working capital, equipment, and expansion.",
  },
  {
    icon: CreditCard,
    title: "Merchant Services",
    desc: "Accept payments anywhere with our POS and online payment solutions.",
  },
  {
    icon: DollarSign,
    title: "Payroll Services",
    desc: "Simplified payroll processing integrated with your business account.",
  },
  {
    icon: Building,
    title: "Business Advisory",
    desc: "One-on-one financial guidance from experienced banking professionals.",
  },
];

const loanServices = [
  {
    icon: DollarSign,
    title: "Personal Loans",
    desc: "Unsecured personal loans for any purpose, with competitive rates.",
  },
  {
    icon: Building,
    title: "Small Business Loans",
    desc: "SBA-backed and conventional lending for your business goals.",
  },
  {
    icon: Home,
    title: "Mortgage Loans",
    desc: "Fixed and adjustable-rate mortgages for first-time and repeat buyers.",
  },
  {
    icon: Car,
    title: "Auto Loans",
    desc: "New and used vehicle financing with fast approval.",
  },
  {
    icon: Users,
    title: "Community Development Loans",
    desc: "Below-market-rate loans for community improvement projects.",
  },
];

const digitalServices = [
  {
    icon: Globe,
    title: "Online Banking",
    desc: "Secure 256-bit encrypted access to all your accounts online.",
  },
  {
    icon: Smartphone,
    title: "Mobile App",
    desc: "iOS and Android apps with biometric login, mobile deposit, and alerts.",
  },
  {
    icon: Wallet,
    title: "Digital Wallet",
    desc: "Apple Pay, Google Pay, and Samsung Pay integration.",
  },
  {
    icon: DollarSign,
    title: "Bill Payments",
    desc: "Schedule and automate recurring payments from your account.",
  },
];

function ServiceGrid({
  items,
}: { items: { icon: React.ElementType; title: string; desc: string }[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((s) => (
        <Card
          key={s.title}
          className="border-border hover:shadow-md transition-shadow"
        >
          <CardHeader className="pb-2">
            <div className="w-10 h-10 bg-bank-navy/10 rounded-lg flex items-center justify-center mb-2">
              <s.icon className="h-5 w-5 text-bank-navy" />
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
  );
}

export default function ServicesPage() {
  return (
    <div>
      <section className="bg-bank-navy py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Banking Services
          </h1>
          <p className="text-white/70 text-lg">
            Comprehensive financial solutions for individuals, families, and
            businesses.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white" data-ocid="services.personal.section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
          <h2 className="font-display text-3xl font-bold text-bank-navy mb-8">
            Personal Banking
          </h2>
          <ServiceGrid items={personalServices} />
        </div>
      </section>

      <section
        className="py-16 bg-slate-50"
        data-ocid="services.business.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
          <h2 className="font-display text-3xl font-bold text-bank-navy mb-8">
            Business Banking
          </h2>
          <ServiceGrid items={businessServices} />
        </div>
      </section>

      <section className="py-16 bg-white" data-ocid="services.loans.section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
          <h2 className="font-display text-3xl font-bold text-bank-navy mb-8">
            Loans
          </h2>
          <ServiceGrid items={loanServices} />
        </div>
      </section>

      <section
        className="py-16 bg-slate-50"
        data-ocid="services.digital.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
          <h2 className="font-display text-3xl font-bold text-bank-navy mb-8">
            Digital Banking
          </h2>
          <ServiceGrid items={digitalServices} />
        </div>
      </section>
    </div>
  );
}
