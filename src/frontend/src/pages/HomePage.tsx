import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Shield,
  Smartphone,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const services = [
  {
    icon: Users,
    title: "Personal Banking",
    desc: "Savings, checking, debit cards, and mobile banking tailored for you.",
    accent: "from-[oklch(0.72_0.18_210)] to-[oklch(0.58_0.20_230)]",
    iconColor: "text-[oklch(0.72_0.18_210)]",
    bgDot: "bg-[oklch(0.72_0.18_210)]",
  },
  {
    icon: TrendingUp,
    title: "Business Banking",
    desc: "Accounts, loans, merchant services and advisory for your business.",
    accent: "from-[oklch(0.78_0.14_75)] to-[oklch(0.68_0.16_60)]",
    iconColor: "text-bank-gold",
    bgDot: "bg-bank-gold",
  },
  {
    icon: Shield,
    title: "Loans",
    desc: "Personal, mortgage, auto, and community development loans.",
    accent: "from-[oklch(0.62_0.16_160)] to-[oklch(0.50_0.18_150)]",
    iconColor: "text-bank-emerald",
    bgDot: "bg-bank-emerald",
  },
  {
    icon: Smartphone,
    title: "Digital Banking",
    desc: "Secure online and mobile banking, digital wallets, and bill pay.",
    accent: "from-[oklch(0.65_0.18_20)] to-[oklch(0.55_0.20_10)]",
    iconColor: "text-bank-rose",
    bgDot: "bg-bank-rose",
  },
];

const stats = [
  { value: "10,000+", label: "Community Members", color: "text-bank-cyan" },
  { value: "$5M+", label: "Community Loans", color: "text-bank-gold" },
  { value: "25+", label: "Years of Service", color: "text-bank-emerald" },
  { value: "98%", label: "Customer Satisfaction", color: "text-bank-rose" },
];

const communityPrograms = [
  { name: "Small Business Funding", color: "bg-bank-cyan" },
  { name: "Financial Literacy", color: "bg-bank-gold" },
  { name: "Youth Savings", color: "bg-bank-emerald" },
  { name: "Community Grants", color: "bg-bank-rose" },
];

const testimonials = [
  {
    name: "Maria Johnson",
    role: "Small Business Owner",
    text: "TRUPTAR Bank helped me secure funding for my bakery. Their community loan program changed my life!",
    borderColor: "border-l-bank-cyan",
    tagColor: "bg-[oklch(0.72_0.18_210/0.12)] text-[oklch(0.72_0.18_210)]",
  },
  {
    name: "David Chen",
    role: "Homeowner",
    text: "The mortgage process was seamless. The team walked me through every step with patience and professionalism.",
    borderColor: "border-l-bank-gold",
    tagColor: "bg-[oklch(0.78_0.14_75/0.12)] text-[oklch(0.78_0.14_75)]",
  },
  {
    name: "Sandra Williams",
    role: "Account Holder",
    text: "I've banked here for 15 years. The personal service and community focus keeps me loyal to TRUPTAR.",
    borderColor: "border-l-bank-emerald",
    tagColor: "bg-[oklch(0.62_0.16_160/0.12)] text-[oklch(0.62_0.16_160)]",
  },
];

const starKeys = ["star-1", "star-2", "star-3", "star-4", "star-5"];

export default function HomePage() {
  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.09 275) 0%, oklch(0.18 0.12 255) 40%, oklch(0.16 0.10 235) 70%, oklch(0.13 0.08 285) 100%)",
        }}
        data-ocid="home.hero.section"
      >
        {/* Dot grid overlay */}
        <div className="absolute inset-0 dot-grid opacity-60" />

        {/* Glowing orb – top right */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.18 210), transparent 70%)",
          }}
        />
        {/* Glowing orb – bottom left */}
        <div
          className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.78 0.14 75), transparent 70%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-44 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border border-white/20 bg-white/8 backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5 text-bank-gold" />
            <span className="text-white/90 text-xs font-semibold tracking-widest uppercase">
              25 Years of Community Banking
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6">
            TRUPTAR Bank
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.78 0.14 75), oklch(0.72 0.18 210))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Built for the Community.
            </span>
          </h1>

          <p className="text-white/65 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            For over 25 years, TRUPTAR Bank has empowered individuals and
            businesses with trusted, community-focused financial services.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="font-bold text-base px-9 py-6 rounded-xl shadow-glow-gold transition-all hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.14 75), oklch(0.72 0.18 210))",
                color: "oklch(0.10 0.06 265)",
              }}
              data-ocid="hero.open_account.button"
            >
              <Link to="/open-account">
                Open an Account <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 font-semibold text-base px-9 py-6 rounded-xl backdrop-blur-sm"
              data-ocid="hero.online_banking.button"
            >
              <Link to="/dashboard">Online Banking</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section className="bg-foreground" data-ocid="home.stats.section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label} className="py-2">
              <div className={`font-display text-3xl font-bold ${s.color}`}>
                {s.value}
              </div>
              <div className="text-white/50 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ────────────────────────────────────────── */}
      <section
        className="py-24 bg-background"
        data-ocid="home.services.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-bank-cyan font-semibold text-sm tracking-widest uppercase mb-3">
              What We Offer
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Our Services
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
              Comprehensive banking solutions built around your needs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <Card
                key={s.title}
                className="border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${s.accent}`} />
                <CardContent className="pt-6 pb-6">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{
                      background: `linear-gradient(135deg, ${s.bgDot.replace("bg-", "")} transparent)`,
                    }}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${s.accent} opacity-15 absolute`}
                    />
                    <s.icon
                      className={`h-6 w-6 ${s.iconColor} relative z-10`}
                    />
                  </div>
                  <h3 className="font-bold text-foreground mb-2 text-base">
                    {s.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button
              asChild
              variant="outline"
              className="border-bank-cyan text-bank-cyan hover:bg-bank-cyan hover:text-white transition-colors font-semibold px-8"
              data-ocid="home.view_services.button"
            >
              <Link to="/services">
                View All Services <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── COMMUNITY ────────────────────────────────────────── */}
      <section
        className="py-24 bg-bank-navy relative overflow-hidden"
        data-ocid="home.community.section"
      >
        {/* Decorative orbs */}
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.18 210), transparent)",
          }}
        />
        <div
          className="absolute bottom-0 left-10 w-64 h-64 rounded-full opacity-8 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.62 0.16 160), transparent)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <p className="text-bank-gold font-semibold text-sm tracking-widest uppercase mb-3">
              Our Impact
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5">
              Rooted in Community
            </h2>
            <p className="text-white/65 mb-8 leading-relaxed text-lg">
              TRUPTAR Bank was founded with a single purpose: to serve the
              people in our community. We invest in local businesses, fund
              financial literacy programs, and support initiatives that build a
              stronger, more prosperous neighborhood for everyone.
            </p>
            <Button
              asChild
              className="bg-bank-gold text-bank-navy hover:bg-bank-gold/90 font-bold px-8 rounded-xl"
              data-ocid="home.community.button"
            >
              <Link to="/community">Learn About Our Programs</Link>
            </Button>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            {communityPrograms.map((p) => (
              <div
                key={p.name}
                className="glass-card rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className={`w-3 h-3 rounded-full ${p.color} mb-3`} />
                <p className="font-semibold text-white text-sm">{p.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section
        className="py-24"
        style={{ background: "oklch(0.10 0.05 265)" }}
        data-ocid="home.testimonials.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-bank-cyan font-semibold text-sm tracking-widest uppercase mb-3">
              Customer Stories
            </p>
            <h2 className="font-display text-4xl font-bold text-white">
              What Our Customers Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className={`glass-card rounded-2xl p-7 border-l-4 ${t.borderColor} hover:bg-white/10 transition-colors`}
              >
                <div className="flex gap-1 mb-4">
                  {starKeys.map((k) => (
                    <Star
                      key={k}
                      className="h-4 w-4 text-bank-gold fill-bank-gold"
                    />
                  ))}
                </div>
                <p className="text-white/75 text-sm mb-5 italic leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <p className="font-bold text-white text-sm">{t.name}</p>
                  <span
                    className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${t.tagColor} font-medium`}
                  >
                    {t.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section
        className="relative py-24 text-center overflow-hidden"
        data-ocid="home.cta.section"
      >
        {/* Mesh gradient bg */}
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 dot-grid opacity-40" />
        {/* Glow */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.72 0.18 210), oklch(0.78 0.14 75), transparent)",
          }}
        />

        <div className="relative max-w-2xl mx-auto px-4">
          <p className="text-bank-gold font-semibold text-sm tracking-widest uppercase mb-4">
            Get Started
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5">
            Ready to Join Our Community?
          </h2>
          <p className="text-white/65 mb-10 text-lg">
            Open an account today and experience banking the way it should be
            &mdash; personal, trusted, and community-first.
          </p>
          <Button
            asChild
            size="lg"
            className="font-bold px-12 py-6 rounded-xl text-base shadow-glow transition-all hover:scale-105"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.18 210), oklch(0.62 0.16 160))",
              color: "white",
            }}
            data-ocid="home.cta.open_account.button"
          >
            <Link to="/open-account">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
