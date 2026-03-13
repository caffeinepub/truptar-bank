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

export default function LoanApplicationPage() {
  const { actor } = useActor();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    loanType: "",
    amount: "",
    employment: "",
    income: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    setSubmitting(true);
    try {
      await actor.applyForLoan(
        form.fullName,
        form.email,
        form.loanType,
        Number.parseFloat(form.amount),
      );
      setSubmitted(true);
      toast.success("Loan application submitted!");
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
            Loan Application
          </h1>
          <p className="text-white/70 text-lg">
            Apply for a loan from TRUPTAR Bank with a simple online form.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white" data-ocid="loan.form.section">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          {submitted ? (
            <div
              className="bg-green-50 border border-green-200 rounded-xl p-8 text-center"
              data-ocid="loan.success_state"
            >
              <h2 className="text-green-800 font-bold text-xl mb-2">
                Application Received!
              </h2>
              <p className="text-green-700">
                Thank you, {form.fullName}. A loan officer will contact you
                within 3 business days.
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
                  data-ocid="loan.full_name.input"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                  placeholder="jane@example.com"
                  data-ocid="loan.email.input"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="+1 (555) 000-0000"
                  data-ocid="loan.phone.input"
                />
              </div>
              <div>
                <Label>Loan Type</Label>
                <Select
                  onValueChange={(v) => setForm((f) => ({ ...f, loanType: v }))}
                >
                  <SelectTrigger data-ocid="loan.loan_type.select">
                    <SelectValue placeholder="Select loan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal Loan</SelectItem>
                    <SelectItem value="business">
                      Small Business Loan
                    </SelectItem>
                    <SelectItem value="mortgage">Mortgage Loan</SelectItem>
                    <SelectItem value="auto">Auto Loan</SelectItem>
                    <SelectItem value="community">
                      Community Development Loan
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Loan Amount ($)</Label>
                <Input
                  type="number"
                  min="1000"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, amount: e.target.value }))
                  }
                  required
                  placeholder="25000"
                  data-ocid="loan.amount.input"
                />
              </div>
              <div>
                <Label>Employment Status</Label>
                <Input
                  value={form.employment}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, employment: e.target.value }))
                  }
                  placeholder="Full-time employed"
                  data-ocid="loan.employment.input"
                />
              </div>
              <div>
                <Label>Annual Income ($)</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.income}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, income: e.target.value }))
                  }
                  placeholder="60000"
                  data-ocid="loan.income.input"
                />
              </div>
              <Button
                type="submit"
                disabled={submitting || !form.loanType || !form.amount}
                className="w-full bg-bank-navy text-white hover:bg-bank-navy/90 font-semibold"
                data-ocid="loan.submit.button"
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
