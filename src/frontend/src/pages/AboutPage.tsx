import { Card, CardContent } from "@/components/ui/card";
import { Eye, Shield, TrendingUp, Users } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Trust",
    desc: "We earn trust through transparency, consistency, and honoring our commitments to every customer.",
    gradient:
      "linear-gradient(135deg, oklch(0.72 0.18 210), oklch(0.58 0.20 230))",
    textColor: "text-[oklch(0.72_0.18_210)]",
  },
  {
    icon: Users,
    title: "Community Growth",
    desc: "We invest in local businesses and initiatives that strengthen the entire community.",
    gradient:
      "linear-gradient(135deg, oklch(0.78 0.14 75), oklch(0.68 0.16 60))",
    textColor: "text-bank-gold",
  },
  {
    icon: TrendingUp,
    title: "Financial Empowerment",
    desc: "We provide tools and education to help every customer reach their financial potential.",
    gradient:
      "linear-gradient(135deg, oklch(0.62 0.16 160), oklch(0.50 0.18 150))",
    textColor: "text-bank-emerald",
  },
  {
    icon: Eye,
    title: "Transparency",
    desc: "Clear fees, honest communication, and no hidden surprises — ever.",
    gradient:
      "linear-gradient(135deg, oklch(0.65 0.18 20), oklch(0.55 0.20 10))",
    textColor: "text-bank-rose",
  },
];

const history = [
  {
    year: "1998",
    text: "TRUPTAR Bank was founded by a group of community leaders committed to providing fair, accessible financial services to underserved residents.",
    color: "bg-[oklch(0.72_0.18_210)] text-white",
  },
  {
    year: "2005",
    text: "Expanded to three branch locations and launched our first community development loan program, funding over 50 local small businesses.",
    color: "bg-bank-gold text-[oklch(0.12_0.06_265)]",
  },
  {
    year: "2012",
    text: "Introduced online banking and mobile app, making financial services more accessible to all community members.",
    color: "bg-bank-emerald text-white",
  },
  {
    year: "2018",
    text: "Launched the Financial Literacy Initiative, reaching over 2,000 students and families with free financial education programs.",
    color: "bg-bank-rose text-white",
  },
  {
    year: "2024",
    text: "Celebrated 25 years of community banking, surpassing $200M in total assets and serving over 10,000 account holders.",
    color: "bg-[oklch(0.55_0.20_280)] text-white",
  },
];

const leaderGradients = [
  "from-[oklch(0.72_0.18_210)] to-[oklch(0.58_0.20_230)]",
  "from-[oklch(0.78_0.14_75)] to-[oklch(0.68_0.16_60)]",
  "from-[oklch(0.62_0.16_160)] to-[oklch(0.50_0.18_150)]",
  "from-[oklch(0.65_0.18_20)] to-[oklch(0.55_0.20_10)]",
];

const leaders = [
  {
    name: "James Hartwell",
    title: "President & CEO",
    bio: "30 years of community banking experience. James joined TRUPTAR in 2005 and led the bank's digital transformation.",
  },
  {
    name: "Patricia Okonkwo",
    title: "Chief Financial Officer",
    bio: "A CPA with 20 years in financial services, Patricia ensures TRUPTAR's long-term fiscal health and regulatory compliance.",
  },
  {
    name: "Michael Torres",
    title: "Chief Lending Officer",
    bio: "Michael has helped over 500 families achieve homeownership and supported hundreds of small businesses with capital.",
  },
  {
    name: "Angela Reid",
    title: "VP of Community Relations",
    bio: "Angela leads TRUPTAR's community programs, from financial literacy workshops to youth savings initiatives.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative py-28 text-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.09 275) 0%, oklch(0.20 0.12 255) 40%, oklch(0.22 0.14 230) 70%, oklch(0.14 0.08 285) 100%)",
        }}
        data-ocid="about.hero.section"
      >
        <div className="absolute inset-0 dot-grid opacity-50" />
        {/* Diagonal light beam */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              "linear-gradient(115deg, transparent 40%, oklch(0.72 0.18 210 / 0.5) 50%, transparent 60%)",
          }}
        />
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.78 0.14 75), transparent)",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4">
          <p className="text-bank-gold font-semibold text-sm tracking-widest uppercase mb-4">
            Our Story
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-5">
            About TRUPTAR Bank
          </h1>
          <p className="text-white/65 text-xl">
            A community bank built on trust, service, and genuine care for the
            people we serve.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section
        className="py-20 bg-background"
        data-ocid="about.mission.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
          <div className="relative">
            <div
              className="absolute -left-4 top-0 w-1 h-full rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, oklch(0.72 0.18 210), oklch(0.78 0.14 75))",
              }}
            />
            <div className="pl-6">
              <p className="text-bank-cyan font-semibold text-xs tracking-widest uppercase mb-2">
                Why We Exist
              </p>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To provide accessible, trustworthy financial services that
                empower individuals, strengthen families, and help local
                businesses thrive &mdash; building a more prosperous community
                for everyone.
              </p>
            </div>
          </div>
          <div className="relative">
            <div
              className="absolute -left-4 top-0 w-1 h-full rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, oklch(0.62 0.16 160), oklch(0.65 0.18 20))",
              }}
            />
            <div className="pl-6">
              <p className="text-bank-emerald font-semibold text-xs tracking-widest uppercase mb-2">
                Where We're Going
              </p>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                Our Vision
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To be the most trusted financial institution in our community
                &mdash; where every customer feels valued, every loan creates
                opportunity, and every dollar deposits back into the growth of
                our neighborhood.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        className="py-20"
        style={{ background: "oklch(0.97 0.01 265)" }}
        data-ocid="about.values.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-bank-cyan font-semibold text-sm tracking-widest uppercase mb-3">
              What Drives Us
            </p>
            <h2 className="font-display text-4xl font-bold text-foreground">
              Our Core Values
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <Card
                key={v.title}
                className="border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="h-1.5" style={{ background: v.gradient }} />
                <CardContent className="pt-6">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: v.gradient, opacity: 0.15 }}
                  />
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 -mt-12"
                    style={{ background: v.gradient }}
                  >
                    <v.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`font-bold ${v.textColor} mb-2`}>{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {v.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section
        className="py-20 bg-background"
        data-ocid="about.history.section"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-bank-gold font-semibold text-sm tracking-widest uppercase mb-3">
            Our Journey
          </p>
          <h2 className="font-display text-4xl font-bold text-foreground mb-12">
            Our History
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div
              className="absolute left-12 top-0 bottom-0 w-0.5"
              style={{
                background:
                  "linear-gradient(180deg, oklch(0.72 0.18 210), oklch(0.65 0.18 20))",
              }}
            />
            <div className="space-y-10">
              {history.map((h) => (
                <div key={h.year} className="flex gap-8 items-start">
                  <div
                    className={`w-24 shrink-0 text-center py-1.5 px-2 rounded-full text-sm font-bold ${h.color}`}
                  >
                    {h.year}
                  </div>
                  <div className="pt-1.5">
                    <p className="text-muted-foreground leading-relaxed">
                      {h.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section
        className="py-20"
        style={{ background: "oklch(0.97 0.01 265)" }}
        data-ocid="about.leadership.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-bank-cyan font-semibold text-sm tracking-widest uppercase mb-3">
              The People Behind It
            </p>
            <h2 className="font-display text-4xl font-bold text-foreground">
              Leadership Team
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaders.map((l, i) => (
              <Card
                key={l.name}
                className="border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="pt-6">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${leaderGradients[i]} flex items-center justify-center text-white font-bold text-xl mb-4`}
                  >
                    {l.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="font-bold text-foreground">{l.name}</h3>
                  <p className="text-bank-cyan text-xs font-semibold mb-2 mt-0.5">
                    {l.title}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {l.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
