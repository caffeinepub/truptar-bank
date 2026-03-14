import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Globe, Landmark, User } from "lucide-react";

const modules = [
  {
    icon: User,
    title: "Personal Banking",
    description:
      "Savings accounts, checking, fixed deposits, debit cards, and personal loan products designed for your financial wellbeing.",
    href: "/services/personal",
    headerGradient: "from-[oklch(0.22_0.10_265)] to-[oklch(0.30_0.14_255)]",
    accentColor: "text-[oklch(0.72_0.18_210)]",
    dotColor: "bg-[oklch(0.72_0.18_210)]",
    btnGradient:
      "linear-gradient(135deg, oklch(0.72 0.18 210), oklch(0.58 0.20 230))",
    highlights: [
      "Savings Accounts · 3.50% APY",
      "Checking Accounts",
      "Debit Cards",
      "Fixed Deposits",
    ],
  },
  {
    icon: Building2,
    title: "Business Banking",
    description:
      "Business checking, merchant services, payroll, and advisory tailored to help local businesses thrive and grow.",
    href: "/services/business",
    headerGradient: "from-[oklch(0.20_0.10_170)] to-[oklch(0.28_0.14_160)]",
    accentColor: "text-bank-emerald",
    dotColor: "bg-bank-emerald",
    btnGradient:
      "linear-gradient(135deg, oklch(0.62 0.16 160), oklch(0.50 0.18 150))",
    highlights: [
      "Business Checking",
      "Merchant Services",
      "Payroll Processing",
      "Business Advisory",
    ],
  },
  {
    icon: Landmark,
    title: "Loan Services",
    description:
      "Personal, mortgage, auto, and business loans with competitive rates and fast approvals from a community lender you can trust.",
    href: "/services/loans",
    headerGradient: "from-[oklch(0.24_0.10_75)] to-[oklch(0.32_0.14_65)]",
    accentColor: "text-bank-gold",
    dotColor: "bg-bank-gold",
    btnGradient:
      "linear-gradient(135deg, oklch(0.78 0.14 75), oklch(0.68 0.16 60))",
    highlights: [
      "Personal Loans from 6.99%",
      "Mortgage from 7.25%",
      "Auto Loans from 5.49%",
      "Community Dev. Loans",
    ],
  },
  {
    icon: Globe,
    title: "Digital Banking Infrastructure",
    description:
      "Secure online banking, mobile app, digital wallet integrations, and real-time fraud protection built for modern life.",
    href: "/services/digital",
    headerGradient: "from-[oklch(0.20_0.10_220)] to-[oklch(0.28_0.14_210)]",
    accentColor: "text-bank-cyan",
    dotColor: "bg-bank-cyan",
    btnGradient:
      "linear-gradient(135deg, oklch(0.72 0.18 210), oklch(0.60 0.20 220))",
    highlights: [
      "Online Banking 24/7",
      "Digital Wallet",
      "Bill Pay",
      "2FA Security",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative py-24 text-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.09 275) 0%, oklch(0.18 0.12 255) 45%, oklch(0.16 0.10 235) 75%, oklch(0.13 0.08 285) 100%)",
        }}
      >
        <div className="absolute inset-0 dot-grid opacity-50" />
        <div
          className="absolute -top-24 right-1/3 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.18 210), transparent)",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4">
          <p className="text-bank-cyan font-semibold text-sm tracking-widest uppercase mb-4">
            All Modules
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-5">
            Banking Services
          </h1>
          <p className="text-white/65 text-xl">
            Four integrated modules. One trusted community bank.
          </p>
        </div>
      </section>

      {/* Module Cards */}
      <section
        className="py-20 bg-background"
        data-ocid="services.modules.section"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {modules.map((mod) => (
              <Card
                key={mod.title}
                className="group border-border hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                data-ocid={`services.${mod.title.toLowerCase().replace(/\s+/g, "_")}.card`}
              >
                <CardContent className="p-0">
                  {/* Gradient header band */}
                  <div
                    className={`bg-gradient-to-r ${mod.headerGradient} px-6 py-6 flex items-center gap-4 relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 dot-grid opacity-30" />
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center relative z-10"
                      style={{ background: "oklch(1 0 0 / 0.12)" }}
                    >
                      <mod.icon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="font-display text-xl font-bold text-white relative z-10">
                      {mod.title}
                    </h2>
                  </div>

                  {/* Body */}
                  <div className="p-7 bg-white">
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {mod.description}
                    </p>

                    <ul className="space-y-2 mb-7">
                      {mod.highlights.map((h) => (
                        <li
                          key={h}
                          className="flex items-center gap-2.5 text-sm text-foreground"
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${mod.dotColor} flex-shrink-0`}
                          />
                          {h}
                        </li>
                      ))}
                    </ul>

                    <Link
                      to={
                        mod.href as
                          | "/services/personal"
                          | "/services/business"
                          | "/services/loans"
                          | "/services/digital"
                      }
                      data-ocid={`services.${mod.title.toLowerCase().replace(/\s+/g, "_")}.link`}
                    >
                      <Button
                        className="w-full font-semibold text-white rounded-xl"
                        style={{ background: mod.btnGradient }}
                      >
                        Explore {mod.title}{" "}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
