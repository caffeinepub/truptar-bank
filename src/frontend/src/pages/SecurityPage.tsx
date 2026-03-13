import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Eye, Lock, Shield } from "lucide-react";

const securityItems = [
  {
    icon: Shield,
    title: "256-bit SSL Encryption",
    desc: "All data transmitted between your browser and our servers is protected with industry-standard 256-bit SSL encryption.",
  },
  {
    icon: Lock,
    title: "Multi-Factor Authentication",
    desc: "We require multi-factor authentication for all online banking logins, adding an extra layer of protection beyond your password.",
  },
  {
    icon: Eye,
    title: "24/7 Fraud Monitoring",
    desc: "Our systems continuously monitor all accounts for unusual activity. If something suspicious is detected, we'll contact you immediately.",
  },
  {
    icon: AlertTriangle,
    title: "Phishing Awareness",
    desc: "TRUPTAR Bank will never ask for your password, PIN, or full Social Security number via email, phone, or text message.",
  },
];

export default function SecurityPage() {
  return (
    <div>
      <section className="bg-bank-navy py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
          <h1 className="font-display text-4xl font-bold text-white mb-4">
            Security
          </h1>
          <p className="text-white/70 text-lg">
            Your financial security is our highest priority.
          </p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          {securityItems.map((s) => (
            <Card key={s.title} className="border-border">
              <CardContent className="pt-6 flex gap-4">
                <div className="w-12 h-12 bg-bank-navy/10 rounded-lg flex items-center justify-center shrink-0">
                  <s.icon className="h-6 w-6 text-bank-navy" />
                </div>
                <div>
                  <h3 className="font-bold text-bank-navy mb-1">{s.title}</h3>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
