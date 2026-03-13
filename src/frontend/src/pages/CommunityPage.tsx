import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

const programs = [
  {
    title: "Small Business Funding",
    desc: "We provide micro-loans and grants to local entrepreneurs who lack access to traditional financing. Over $2M awarded to date.",
    stat: "$2M+ Awarded",
  },
  {
    title: "Financial Literacy Programs",
    desc: "Free workshops, one-on-one coaching, and school partnerships teach budgeting, credit, and saving to all ages.",
    stat: "2,000+ Participants",
  },
  {
    title: "Youth Savings Programs",
    desc: "Special savings accounts and matching programs for children and teens, building good financial habits early.",
    stat: "500+ Youth Accounts",
  },
  {
    title: "Community Grants",
    desc: "Annual grants to non-profits and community organizations doing impactful work in our neighborhoods.",
    stat: "$300K in Grants",
  },
  {
    title: "Local Investment Programs",
    desc: "We reinvest deposits locally through community development loans, keeping money circulating in the neighborhood.",
    stat: "$5M Reinvested",
  },
];

export default function CommunityPage() {
  return (
    <div>
      <section className="bg-bank-navy py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Community Programs
          </h1>
          <p className="text-white/70 text-lg">
            Investing in people, not just profits. Our community programs
            reflect our deepest values.
          </p>
        </div>
      </section>

      <section
        className="py-16 bg-white"
        data-ocid="community.programs.section"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {programs.map((p) => (
            <Card key={p.title} className="border-border overflow-hidden">
              <CardContent className="pt-6 flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-display text-xl font-bold text-bank-navy mb-2">
                    {p.title}
                  </h3>
                  <p className="text-muted-foreground">{p.desc}</p>
                </div>
                <div className="shrink-0 bg-bank-gold/10 rounded-lg px-4 py-3 text-center">
                  <p className="font-bold text-bank-navy text-sm">{p.stat}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section
        className="py-16 bg-bank-navy text-center"
        data-ocid="community.cta.section"
      >
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Get Involved
          </h2>
          <p className="text-white/70 mb-8">
            Whether you're looking for funding, financial education, or a way to
            give back, we'd love to connect with you.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-bank-gold text-bank-navy hover:bg-bank-gold/90 font-bold"
            data-ocid="community.contact.button"
          >
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
