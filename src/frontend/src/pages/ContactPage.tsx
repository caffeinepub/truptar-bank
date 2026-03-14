import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

const branches = [
  { name: "Main Branch", addr: "1420 Community Ave, Omaha, NE 68102" },
  { name: "Westside Branch", addr: "5210 West Dodge Rd, Omaha, NE 68132" },
  { name: "Eastside Branch", addr: "3300 N 72nd St, Omaha, NE 68134" },
];

export default function ContactPage() {
  const { actor } = useActor();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    setSubmitting(true);
    try {
      await actor.submitContactForm(form.name, form.email, form.message);
      setSubmitted(true);
      toast.success("Message sent! We'll be in touch shortly.");
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {/* Hero */}
      <section
        className="relative py-24 text-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.16 0.10 170) 0%, oklch(0.20 0.12 185) 40%, oklch(0.18 0.10 200) 70%, oklch(0.14 0.08 165) 100%)",
        }}
      >
        <div className="absolute inset-0 dot-grid opacity-50" />
        <div
          className="absolute -top-20 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.62 0.16 160), transparent)",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4">
          <p className="text-bank-emerald font-semibold text-sm tracking-widest uppercase mb-4">
            Get in Touch
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-5">
            Contact Us
          </h1>
          <p className="text-white/65 text-xl">
            We're here to help. Reach out to our team anytime.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-20 bg-background" data-ocid="contact.form.section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-14">
          {/* Form column */}
          <div>
            <p className="text-bank-cyan font-semibold text-sm tracking-widest uppercase mb-2">
              Drop Us a Line
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground mb-8">
              Send Us a Message
            </h2>
            {submitted ? (
              <div
                className="rounded-2xl p-8 text-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.62 0.16 160 / 0.12), oklch(0.72 0.18 210 / 0.08))",
                  border: "1px solid oklch(0.62 0.16 160 / 0.3)",
                }}
                data-ocid="contact.success_state"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.62 0.16 160), oklch(0.50 0.18 150))",
                  }}
                >
                  <Mail className="h-7 w-7 text-white" />
                </div>
                <p className="text-foreground font-bold text-lg">
                  Thank you for your message!
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  A member of our team will get back to you within 1 business
                  day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="name" className="text-foreground font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    required
                    placeholder="John Smith"
                    className="mt-1.5 rounded-xl"
                    data-ocid="contact.name.input"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="email"
                    className="text-foreground font-medium"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    required
                    placeholder="john@example.com"
                    className="mt-1.5 rounded-xl"
                    data-ocid="contact.email.input"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="phone"
                    className="text-foreground font-medium"
                  >
                    Phone (optional)
                  </Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="+1 (555) 000-0000"
                    className="mt-1.5 rounded-xl"
                    data-ocid="contact.phone.input"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="message"
                    className="text-foreground font-medium"
                  >
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    required
                    rows={5}
                    placeholder="How can we help you?"
                    className="mt-1.5 rounded-xl"
                    data-ocid="contact.message.textarea"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full font-semibold rounded-xl py-6 text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.72 0.18 210), oklch(0.60 0.20 220))",
                  }}
                  data-ocid="contact.submit.button"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>

          {/* Info column */}
          <div className="space-y-10">
            <div>
              <p className="text-bank-emerald font-semibold text-sm tracking-widest uppercase mb-2">
                Reach Out
              </p>
              <h2 className="font-display text-3xl font-bold text-foreground mb-7">
                Contact Information
              </h2>
              <div className="space-y-5">
                <div
                  className="flex items-start gap-4 p-4 rounded-2xl"
                  style={{
                    background: "oklch(0.62 0.16 160 / 0.08)",
                    border: "1px solid oklch(0.62 0.16 160 / 0.2)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.62 0.16 160), oklch(0.50 0.18 150))",
                    }}
                  >
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">Phone</p>
                    <a
                      href="tel:+14026270793"
                      className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                    >
                      +1 (402) 627-0793
                    </a>
                  </div>
                </div>
                <div
                  className="flex items-start gap-4 p-4 rounded-2xl"
                  style={{
                    background: "oklch(0.72 0.18 210 / 0.08)",
                    border: "1px solid oklch(0.72 0.18 210 / 0.2)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.72 0.18 210), oklch(0.60 0.20 220))",
                    }}
                  >
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">Email</p>
                    <a
                      href="mailto:ikehsopuruchukwu@gmail.com"
                      className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                    >
                      ikehsopuruchukwu@gmail.com
                    </a>
                  </div>
                </div>
                <div
                  className="flex items-start gap-4 p-4 rounded-2xl"
                  style={{
                    background: "oklch(0.78 0.14 75 / 0.08)",
                    border: "1px solid oklch(0.78 0.14 75 / 0.2)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.78 0.14 75), oklch(0.68 0.16 60))",
                    }}
                  >
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">
                      Customer Service Hours
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Mon&ndash;Fri: 8:00 AM &ndash; 6:00 PM
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Sat: 9:00 AM &ndash; 2:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-foreground text-lg mb-5">
                Branch Locations
              </h3>
              <div className="space-y-3">
                {branches.map((b) => (
                  <Card
                    key={b.name}
                    className="border-border hover:shadow-md transition-shadow"
                  >
                    <CardContent className="py-4 flex items-start gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.65 0.18 20), oklch(0.55 0.20 10))",
                        }}
                      >
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm">
                          {b.name}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {b.addr}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
