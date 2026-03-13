import { Card, CardContent } from "@/components/ui/card";
import { Eye, Shield, TrendingUp, Users } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Trust",
    desc: "We earn trust through transparency, consistency, and honoring our commitments to every customer.",
  },
  {
    icon: Users,
    title: "Community Growth",
    desc: "We invest in local businesses and initiatives that strengthen the entire community.",
  },
  {
    icon: TrendingUp,
    title: "Financial Empowerment",
    desc: "We provide tools and education to help every customer reach their financial potential.",
  },
  {
    icon: Eye,
    title: "Transparency",
    desc: "Clear fees, honest communication, and no hidden surprises — ever.",
  },
];

const history = [
  {
    year: "1998",
    text: "TRUPTAR Bank was founded by a group of community leaders committed to providing fair, accessible financial services to underserved residents.",
  },
  {
    year: "2005",
    text: "Expanded to three branch locations and launched our first community development loan program, funding over 50 local small businesses.",
  },
  {
    year: "2012",
    text: "Introduced online banking and mobile app, making financial services more accessible to all community members.",
  },
  {
    year: "2018",
    text: "Launched the Financial Literacy Initiative, reaching over 2,000 students and families with free financial education programs.",
  },
  {
    year: "2024",
    text: "Celebrated 25 years of community banking, surpassing $200M in total assets and serving over 10,000 account holders.",
  },
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
      <section
        className="bg-bank-navy py-20 text-center"
        data-ocid="about.hero.section"
      >
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            About TRUPTAR Bank
          </h1>
          <p className="text-white/70 text-lg">
            A community bank built on trust, service, and genuine care for the
            people we serve.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white" data-ocid="about.mission.section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
          <div>
            <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
            <h2 className="font-display text-2xl font-bold text-bank-navy mb-3">
              Our Mission
            </h2>
            <p className="text-muted-foreground">
              To provide accessible, trustworthy financial services that empower
              individuals, strengthen families, and help local businesses thrive
              &mdash; building a more prosperous community for everyone.
            </p>
          </div>
          <div>
            <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
            <h2 className="font-display text-2xl font-bold text-bank-navy mb-3">
              Our Vision
            </h2>
            <p className="text-muted-foreground">
              To be the most trusted financial institution in our community
              &mdash; where every customer feels valued, every loan creates
              opportunity, and every dollar deposits back into the growth of our
              neighborhood.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50" data-ocid="about.values.section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
            <h2 className="font-display text-3xl font-bold text-bank-navy">
              Our Core Values
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <Card key={v.title} className="border-border">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-bank-navy/10 rounded-lg flex items-center justify-center mb-4">
                    <v.icon className="h-6 w-6 text-bank-navy" />
                  </div>
                  <h3 className="font-bold text-bank-navy mb-2">{v.title}</h3>
                  <p className="text-muted-foreground text-sm">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-ocid="about.history.section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
          <h2 className="font-display text-3xl font-bold text-bank-navy mb-6">
            Our History
          </h2>
          <div className="space-y-6 text-muted-foreground">
            {history.map((h) => (
              <div key={h.year} className="flex gap-4">
                <div className="font-bold text-bank-gold w-16 shrink-0">
                  {h.year}
                </div>
                <p>{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-16 bg-slate-50"
        data-ocid="about.leadership.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
            <h2 className="font-display text-3xl font-bold text-bank-navy">
              Leadership Team
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaders.map((l) => (
              <Card key={l.name} className="border-border">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 rounded-full bg-bank-navy flex items-center justify-center text-white font-bold text-xl mb-4">
                    {l.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="font-bold text-bank-navy">{l.name}</h3>
                  <p className="text-bank-gold text-xs font-semibold mb-2">
                    {l.title}
                  </p>
                  <p className="text-muted-foreground text-sm">{l.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
