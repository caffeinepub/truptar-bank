import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

export default function OpenAccountPage() {
  const { actor } = useActor();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    accountType: "",
    dob: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    setSubmitting(true);
    try {
      await actor.applyForAccount(form.fullName, form.email, form.accountType);
      setSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch {
      toast.error("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <section className="bg-bank-navy py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
          <h1 className="font-display text-4xl font-bold text-white mb-4">
            Open an Account
          </h1>
          <p className="text-white/70 text-lg">
            Join the TRUPTAR community in just a few minutes.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white" data-ocid="open_account.form.section">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          {submitted ? (
            <div
              className="bg-green-50 border border-green-200 rounded-xl p-8 text-center"
              data-ocid="open_account.success_state"
            >
              <h2 className="text-green-800 font-bold text-xl mb-2">
                Application Received!
              </h2>
              <p className="text-green-700">
                Thank you, {form.fullName}. We'll review your application and
                contact you within 2 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fullName: e.target.value }))
                  }
                  required
                  placeholder="Jane Doe"
                  data-ocid="open_account.full_name.input"
                />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                  placeholder="jane@example.com"
                  data-ocid="open_account.email.input"
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="+1 (555) 000-0000"
                  data-ocid="open_account.phone.input"
                />
              </div>
              <div>
                <Label>Home Address</Label>
                <Input
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                  placeholder="123 Main St, City, State"
                  data-ocid="open_account.address.input"
                />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={form.dob}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, dob: e.target.value }))
                  }
                  required
                  data-ocid="open_account.dob.input"
                />
              </div>
              <div>
                <Label>Account Type</Label>
                <Select
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, accountType: v }))
                  }
                  required
                >
                  <SelectTrigger data-ocid="open_account.account_type.select">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">Savings Account</SelectItem>
                    <SelectItem value="checking">Checking Account</SelectItem>
                    <SelectItem value="business">Business Account</SelectItem>
                    <SelectItem value="fixed-deposit">
                      Fixed/Term Deposit
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                disabled={submitting || !form.accountType}
                className="w-full bg-bank-navy text-white hover:bg-bank-navy/90 font-semibold"
                data-ocid="open_account.submit.button"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
