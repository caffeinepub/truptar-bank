import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Shield,
  Smartphone,
  TrendingUp,
  Users,
} from "lucide-react";

const services = [
  {
    icon: Users,
    title: "Personal Banking",
    desc: "Savings, checking, debit cards, and mobile banking tailored for you.",
  },
  {
    icon: TrendingUp,
    title: "Business Banking",
    desc: "Accounts, loans, merchant services and advisory for your business.",
  },
  {
    icon: Shield,
    title: "Loans",
    desc: "Personal, mortgage, auto, and community development loans.",
  },
  {
    icon: Smartphone,
    title: "Digital Banking",
    desc: "Secure online and mobile banking, digital wallets, and bill pay.",
  },
];

const stats = [
  { value: "10,000+", label: "Community Members" },
  { value: "$5M+", label: "Community Loans" },
  { value: "25+", label: "Years of Service" },
  { value: "98%", label: "Customer Satisfaction" },
];

const communityPrograms = [
  "Small Business Funding",
  "Financial Literacy",
  "Youth Savings",
  "Community Grants",
];

const testimonials = [
  {
    name: "Maria Johnson",
    role: "Small Business Owner",
    text: "TRUPTAR Bank helped me secure funding for my bakery. Their community loan program changed my life!",
  },
  {
    name: "David Chen",
    role: "Homeowner",
    text: "The mortgage process was seamless. The team walked me through every step with patience and professionalism.",
  },
  {
    name: "Sandra Williams",
    role: "Account Holder",
    text: "I've banked here for 15 years. The personal service and community focus keeps me loyal to TRUPTAR.",
  },
];

const starKeys = ["star-1", "star-2", "star-3", "star-4", "star-5"];

export default function HomePage() {
  return (
    <div>
      <section
        className="relative bg-bank-navy overflow-hidden"
        data-ocid="home.hero.section"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-bank-navy via-bank-navy to-blue-950 opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-40 text-center">
          <div className="inline-block w-16 h-1 bg-bank-gold mb-6 rounded-full" />
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            TRUPTAR Bank &ndash;
            <br />
            <span className="text-bank-gold">
              Banking Built for the Community.
            </span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            For over 25 years, TRUPTAR Bank has empowered individuals and
            businesses with trusted, community-focused financial services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-bank-gold text-bank-navy hover:bg-bank-gold/90 font-bold text-base px-8"
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
              className="border-white text-white hover:bg-white hover:text-bank-navy font-semibold text-base px-8"
              data-ocid="hero.online_banking.button"
            >
              <Link to="/dashboard">Online Banking</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-bank-gold" data-ocid="home.stats.section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-3xl font-bold text-bank-navy">
                {s.value}
              </div>
              <div className="text-bank-navy/70 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-white" data-ocid="home.services.section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-bank-navy">
              Our Services
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Comprehensive banking solutions built around your needs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <Card
                key={s.title}
                className="border-border hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-bank-navy/10 rounded-lg flex items-center justify-center mb-4">
                    <s.icon className="h-6 w-6 text-bank-navy" />
                  </div>
                  <h3 className="font-semibold text-bank-navy mb-2">
                    {s.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button
              asChild
              variant="outline"
              className="border-bank-navy text-bank-navy hover:bg-bank-navy hover:text-white"
              data-ocid="home.view_services.button"
            >
              <Link to="/services">
                View All Services <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50" data-ocid="home.community.section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-bank-navy mb-4">
              Rooted in Community
            </h2>
            <p className="text-muted-foreground mb-4">
              TRUPTAR Bank was founded with a single purpose: to serve the
              people in our community. We invest in local businesses, fund
              financial literacy programs, and support initiatives that build a
              stronger, more prosperous neighborhood for everyone.
            </p>
            <Button
              asChild
              className="bg-bank-navy text-white hover:bg-bank-navy/90"
              data-ocid="home.community.button"
            >
              <Link to="/community">Learn About Our Programs</Link>
            </Button>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            {communityPrograms.map((p) => (
              <div
                key={p}
                className="bg-white rounded-xl p-5 shadow-sm border border-border"
              >
                <div className="w-2 h-2 rounded-full bg-bank-gold mb-2" />
                <p className="font-medium text-bank-navy text-sm">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white" data-ocid="home.testimonials.section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
            <h2 className="font-display text-3xl font-bold text-bank-navy">
              What Our Customers Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-border">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-3">
                    {starKeys.map((k) => (
                      <svg
                        key={k}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4 text-bank-gold"
                      >
                        <title>Star</title>
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div>
                    <p className="font-semibold text-bank-navy text-sm">
                      {t.name}
                    </p>
                    <p className="text-muted-foreground text-xs">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        className="bg-bank-navy py-16 text-center"
        data-ocid="home.cta.section"
      >
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-white/70 mb-8">
            Open an account today and experience banking the way it should be
            &mdash; personal, trusted, and community-first.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-bank-gold text-bank-navy hover:bg-bank-gold/90 font-bold"
            data-ocid="home.cta.open_account.button"
          >
            <Link to="/open-account">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
