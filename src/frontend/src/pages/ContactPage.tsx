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
      <section className="bg-bank-navy py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-white/70 text-lg">
            We're here to help. Reach out to our team anytime.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white" data-ocid="contact.form.section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
          <div>
            <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
            <h2 className="font-display text-2xl font-bold text-bank-navy mb-6">
              Send Us a Message
            </h2>
            {submitted ? (
              <div
                className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
                data-ocid="contact.success_state"
              >
                <p className="text-green-800 font-semibold">
                  Thank you for your message!
                </p>
                <p className="text-green-700 text-sm mt-1">
                  A member of our team will get back to you within 1 business
                  day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    required
                    placeholder="John Smith"
                    data-ocid="contact.name.input"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    required
                    placeholder="john@example.com"
                    data-ocid="contact.email.input"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="+1 (555) 000-0000"
                    data-ocid="contact.phone.input"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    required
                    rows={5}
                    placeholder="How can we help you?"
                    data-ocid="contact.message.textarea"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-bank-navy text-white hover:bg-bank-navy/90"
                  data-ocid="contact.submit.button"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
              <h2 className="font-display text-2xl font-bold text-bank-navy mb-6">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-bank-gold mt-0.5" />
                  <div>
                    <p className="font-semibold text-bank-navy text-sm">
                      Phone
                    </p>
                    <a
                      href="tel:+14026270793"
                      className="text-muted-foreground text-sm hover:text-bank-navy"
                    >
                      +1 (402) 627-0793
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-bank-gold mt-0.5" />
                  <div>
                    <p className="font-semibold text-bank-navy text-sm">
                      Email
                    </p>
                    <a
                      href="mailto:ikehsopuruchukwu@gmail.com"
                      className="text-muted-foreground text-sm hover:text-bank-navy"
                    >
                      ikehsopuruchukwu@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-bank-gold mt-0.5" />
                  <div>
                    <p className="font-semibold text-bank-navy text-sm">
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
              <h3 className="font-bold text-bank-navy mb-4">
                Branch Locations
              </h3>
              {branches.map((b) => (
                <Card key={b.name} className="mb-3 border-border">
                  <CardContent className="py-3 flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-bank-gold mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-bank-navy text-sm">
                        {b.name}
                      </p>
                      <p className="text-muted-foreground text-sm">{b.addr}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
