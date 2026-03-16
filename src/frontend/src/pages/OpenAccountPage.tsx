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
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useProfileStore } from "../hooks/useProfileStore";

export default function OpenAccountPage() {
  const { actor } = useActor();
  const { updateProfile } = useProfileStore();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    accountType: "",
    dob: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [accountNumber, setAccountNumber] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) {
      toast.error("Please log in before opening an account.");
      return;
    }
    setSubmitting(true);
    try {
      // Parse first and last name
      const nameParts = form.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Save profile to backend — this auto-assigns an account number
      await (actor as any).saveCallerUserProfile({
        personalInfo: {
          firstName,
          lastName,
          fullName: form.fullName,
          dob: form.dob,
          gender: "",
          country: "",
          city: "",
          address: form.address,
          postalCode: "",
        },
        username: "",
        contactInfo: {
          email: form.email,
          phone: form.phone,
          countryCode: "+1",
        },
        emailVerified: false,
        kycData: {
          country: "",
          dob: form.dob,
          idNumber: "",
          idType: "",
          kycStatus: "form",
        },
        preferences: {
          notifTransactions: false,
          notifSecurity: false,
          notifPromo: false,
          language: "English",
        },
        twoFAMethod: "",
        twoFAEnabled: false,
        totpSecret: "",
        emailTwoFAEnabled: false,
      });

      // Get the assigned account number
      const accountInfo = (await (actor as any).getAccountInfo()) as {
        accountNumber: string;
        balance: number;
      };

      // Save profile to local store so ProfilePage picks it up immediately
      updateProfile({
        personalInfo: {
          firstName,
          lastName,
          fullName: form.fullName,
          dob: form.dob,
          gender: "",
          country: "",
          city: "",
          address: form.address,
          postalCode: "",
        },
        contactInfo: {
          email: form.email,
          phone: form.phone,
          countryCode: "+1",
        },
      });

      setAccountNumber(accountInfo.accountNumber);
      toast.success("Your account has been successfully opened!");
    } catch (err) {
      console.error(err);
      toast.error("Account creation failed. Please try again.");
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
          {accountNumber ? (
            <div
              className="bg-green-50 border border-green-200 rounded-xl p-8 text-center space-y-4"
              data-ocid="open_account.success_state"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <svg
                  aria-label="Success check"
                  role="img"
                  className="w-8 h-8 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-green-800 font-bold text-2xl">
                Your Account Has Been Successfully Opened!
              </h2>
              <p className="text-green-700 text-sm">
                Welcome to TRUPTAR Bank, {form.fullName}.
              </p>

              <div className="bg-white border border-green-200 rounded-lg p-4 my-4">
                <p className="text-xs text-muted-foreground mb-1">
                  Your Account Number
                </p>
                <p className="text-3xl font-bold font-mono text-bank-navy tracking-widest">
                  {accountNumber}
                </p>
                <p className="text-xs text-muted-foreground mt-1 capitalize">
                  {form.accountType.replace("-", " ")} Account
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                Keep this account number safe. Your balance starts at $0.00 —
                submit a deposit request and we&apos;ll review and confirm it.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link to="/dashboard">
                  <Button
                    className="w-full sm:w-auto bg-bank-navy text-white hover:bg-bank-navy/90"
                    data-ocid="open_account.goto_dashboard.button"
                  >
                    Go to Dashboard
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    data-ocid="open_account.complete_profile.button"
                  >
                    Complete Your Profile
                  </Button>
                </Link>
              </div>
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
                disabled={
                  submitting ||
                  !form.accountType ||
                  !form.fullName ||
                  !form.email
                }
                className="w-full bg-bank-navy text-white hover:bg-bank-navy/90 font-semibold"
                data-ocid="open_account.submit.button"
              >
                {submitting ? "Creating Your Account..." : "Open My Account"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
