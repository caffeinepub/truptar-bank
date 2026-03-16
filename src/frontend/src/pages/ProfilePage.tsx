import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useProfileStore } from "@/hooks/useProfileStore";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Lock,
  LogIn,
  Monitor,
  Phone,
  QrCode,
  Settings,
  Shield,
  Upload,
  User,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ---- Static Data ----
const SESSIONS = [
  {
    device: "Chrome on Windows 11",
    location: "Current Session",
    lastActive: "Just now",
  },
];

const SECTION_TABS = [
  { value: "overview", label: "Profile Overview", icon: User },
  { value: "personal", label: "Personal Info", icon: UserCheck },
  { value: "contact", label: "Contact", icon: Phone },
  { value: "username", label: "Username", icon: Settings },
  { value: "kyc", label: "KYC Verification", icon: Shield },
  { value: "security", label: "Security", icon: Lock },
  { value: "documents", label: "Documents", icon: FileText },
  { value: "preferences", label: "Preferences", icon: Settings },
  { value: "activity", label: "Activity Log", icon: LogIn },
];

// Generate a random 6-digit code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate a Base32 TOTP secret (16 chars, A-Z2-7)
function generateTotpSecret(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Persistent profile store
  const { profile, updateProfile, syncStatus, loadFromBackend } =
    useProfileStore();
  const { actor } = useActor();
  const [accountNumber, setAccountNumber] = useState<string | null>(null);
  const saveProfile = (partial: Parameters<typeof updateProfile>[0]) =>
    updateProfile(partial, (actor as any) ?? undefined);

  // Load profile from backend on mount once actor is ready
  useEffect(() => {
    if (actor) {
      loadFromBackend(actor as any);
    }
  }, [actor, loadFromBackend]);

  // Load account number
  useEffect(() => {
    if (!actor) return;
    try {
      (actor as any)
        .getAccountInfo()
        .then((info: { accountNumber: string; balance: number } | null) => {
          if (info?.accountNumber) setAccountNumber(info.accountNumber);
        })
        .catch(() => {});
    } catch {
      // ignore
    }
  }, [actor]);

  // Personal Info — initialized from store
  const [personal, setPersonal] = useState({
    fullName: profile.personalInfo.fullName,
    firstName: profile.personalInfo.firstName,
    lastName: profile.personalInfo.lastName,
    dob: profile.personalInfo.dob,
    gender: profile.personalInfo.gender,
    country: profile.personalInfo.country,
    city: profile.personalInfo.city,
    address: profile.personalInfo.address,
    postal: profile.personalInfo.postalCode,
    personalSaved: false,
  });

  // Username — initialized from store
  const [username, setUsername] = useState(profile.username);
  const [newUsername, setNewUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<null | boolean>(
    null,
  );
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameSaved, setUsernameSaved] = useState(false);

  // Contact — initialized from store
  const [contactEmail, setContactEmail] = useState(profile.contactInfo.email);
  const [countryCode, setCountryCode] = useState(
    profile.contactInfo.countryCode || "+234",
  );
  const [localPhone, setLocalPhone] = useState(profile.contactInfo.phone);

  // Email verification state — initialized from store
  const [emailVerified, setEmailVerified] = useState(profile.emailVerified);
  const [verifyStep, setVerifyStep] = useState<
    "idle" | "loading" | "sent" | "verified"
  >(profile.emailVerified ? "verified" : "idle");
  const [verifyCodeInput, setVerifyCodeInput] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [verifyError, setVerifyError] = useState("");

  // KYC state — initialized from store
  const [kycStatus, setKycStatus] = useState<
    "form" | "pending" | "approved" | "rejected"
  >(
    (profile.kycData.kycStatus as
      | "form"
      | "pending"
      | "approved"
      | "rejected") || "form",
  );
  const [kycCountry, setKycCountry] = useState(profile.kycData.country);
  const [kycDob, setKycDob] = useState(profile.kycData.dob);
  const [kycGovId, setKycGovId] = useState(profile.kycData.idNumber);
  const [kycIdType, setKycIdType] = useState(
    profile.kycData.idType || "Passport",
  );
  const [kycIdFile, setKycIdFile] = useState<File | null>(null);
  const [kycSelfie, setKycSelfie] = useState<File | null>(null);

  // Security — initialized from store
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [_twoFaEnabled, setTwoFaEnabled] = useState(profile.twoFAEnabled);
  const [twoFaMethod, setTwoFaMethod] = useState<"email" | "app">(
    (profile.twoFAMethod as "email" | "app") || "email",
  );
  const [emailTwoFaEnabled, setEmailTwoFaEnabled] = useState(
    profile.emailTwoFAEnabled,
  );

  // TOTP / Authenticator App state — initialized from store
  const [totpSetupStep, setTotpSetupStep] = useState<
    "idle" | "setup" | "enabled"
  >(profile.totpSetupStep || "idle");
  const [totpSecret, setTotpSecret] = useState(profile.totpSecret || "");
  const [totpCodeInput, setTotpCodeInput] = useState("");
  const [totpCodeError, setTotpCodeError] = useState("");

  const [sessions, setSessions] = useState(SESSIONS);

  // Preferences — initialized from store
  const [notifTransactions, setNotifTransactions] = useState(
    profile.preferences.notifTransactions,
  );
  const [notifSecurity, setNotifSecurity] = useState(
    profile.preferences.notifSecurity,
  );
  const [notifPromo, setNotifPromo] = useState(profile.preferences.notifPromo);
  const [prefLanguage, setPrefLanguage] = useState(
    profile.preferences.language || "English",
  );

  // Activity Logs — empty by default (will be populated after user actions)
  const [activityLogs] = useState<
    { date: string; action: string; device: string; ip: string }[]
  >([]);

  // Documents — empty by default
  const [documents] = useState<
    { name: string; type: string; uploadDate: string; status: string }[]
  >([]);

  function getGovIdLabel(country: string) {
    if (country === "Nigeria") return "BVN (Bank Verification Number)";
    if (country === "United States") return "SSN (Social Security Number)";
    if (country === "United Kingdom") return "National Insurance Number";
    return "Government ID Number";
  }

  function handleUsernameCheck() {
    const takenNames = ["admin", "truptar", "testuser"];
    setUsernameChecking(true);
    setUsernameAvailable(null);
    setTimeout(() => {
      const isValid = /^[a-zA-Z0-9]{4,20}$/.test(newUsername);
      const isTaken = takenNames.includes(newUsername.toLowerCase());
      setUsernameAvailable(isValid && !isTaken);
      setUsernameChecking(false);
    }, 1200);
  }

  function revokeSession(idx: number) {
    setSessions((prev) => prev.filter((_, i) => i !== idx));
    toast.success("Session revoked successfully");
  }

  function handleSendVerificationCode() {
    if (!contactEmail) {
      toast.error(
        "Please enter your email address in the Contact section first.",
      );
      return;
    }
    setVerifyStep("loading");
    setVerifyError("");
    setVerifyCodeInput("");
    const code = generateCode();
    setGeneratedCode(code);
    setTimeout(() => {
      setVerifyStep("sent");
      toast.success(`Verification code sent to ${contactEmail}`);
    }, 1500);
  }

  function handleVerifyEmail() {
    if (verifyCodeInput.length !== 6) {
      setVerifyError("Please enter the full 6-digit code.");
      return;
    }
    if (verifyCodeInput === generatedCode) {
      setEmailVerified(true);
      setVerifyStep("verified");
      setVerifyError("");
      saveProfile({ emailVerified: true });
      toast.success("Email verified successfully!");
    } else {
      setVerifyError("Invalid code. Please try again.");
    }
  }

  function handleResendCode() {
    const code = generateCode();
    setGeneratedCode(code);
    setVerifyCodeInput("");
    setVerifyError("");
    toast.success(`Verification code resent to ${contactEmail}`);
  }

  function handleSetupTotp() {
    const secret = generateTotpSecret();
    setTotpSecret(secret);
    setTotpCodeInput("");
    setTotpCodeError("");
    setTotpSetupStep("setup");
  }

  function handleActivateTotp() {
    if (!/^\d{6}$/.test(totpCodeInput)) {
      setTotpCodeError(
        "Please enter a valid 6-digit code from your authenticator app.",
      );
      return;
    }
    setTotpSetupStep("enabled");
    setTwoFaEnabled(true);
    setTotpCodeError("");
    saveProfile({
      totpSetupStep: "enabled",
      totpSecret: totpSecret,
      twoFAEnabled: true,
      twoFAMethod: "app",
    });
    toast.success("Authenticator 2FA activated successfully!");
  }

  function handleDisableTotp() {
    setTotpSetupStep("idle");
    setTotpSecret("");
    setTotpCodeInput("");
    setTwoFaEnabled(false);
    saveProfile({
      totpSetupStep: "idle",
      totpSecret: "",
      twoFAEnabled: false,
    });
    toast.success("Authenticator 2FA has been disabled.");
  }

  const avatarInitials =
    personal.firstName && personal.lastName
      ? `${personal.firstName[0]}${personal.lastName[0]}`.toUpperCase()
      : personal.fullName
        ? personal.fullName
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "--";

  const totpQrUrl = totpSecret
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/TRUPTAR%20Bank?secret=${totpSecret}%26issuer=TRUPTARBank`
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100">
      {/* Page Header */}
      <div className="bg-bank-navy text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-3xl font-bold mb-1">My Profile</h1>
          <p className="text-white/60 text-sm">
            Manage your identity, preferences, and security settings
          </p>
          <div className="mt-2 h-5">
            {syncStatus === "loading" && (
              <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
                <Loader2 className="w-3 h-3 animate-spin" />
                Loading your profile…
              </span>
            )}
            {syncStatus === "saving" && (
              <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving to server…
              </span>
            )}
            {syncStatus === "synced" && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                Profile synced
              </span>
            )}
            {syncStatus === "error" && (
              <span className="inline-flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="w-3 h-3" />
                Sync failed — changes saved locally
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col lg:flex-row gap-6"
        >
          {/* Sidebar Nav */}
          <aside className="lg:w-64 shrink-0">
            <Card className="border border-slate-200 shadow-sm sticky top-20">
              <CardContent className="p-2">
                <TabsList className="flex flex-row lg:flex-col h-auto gap-1 bg-transparent p-0 w-full overflow-x-auto lg:overflow-x-visible">
                  {SECTION_TABS.map(({ value, label, icon: Icon }) => (
                    <TabsTrigger
                      key={value}
                      value={value}
                      className="w-full justify-start gap-2 px-3 py-2.5 text-sm font-medium rounded-lg text-left data-[state=active]:bg-bank-navy data-[state=active]:text-white data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:bg-slate-100 transition-colors whitespace-nowrap"
                      data-ocid={`profile.${value}.tab`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="hidden lg:inline">{label}</span>
                      <span className="inline lg:hidden text-xs">{label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* 1. OVERVIEW */}
            <TabsContent value="overview" className="mt-0">
              <div className="space-y-6">
                <Card
                  className="border border-slate-200 shadow-sm overflow-hidden"
                  data-ocid="profile.overview.card"
                >
                  <div className="bg-gradient-to-r from-bank-navy via-bank-navy/90 to-bank-navy/80 h-28 relative">
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)",
                      }}
                    />
                  </div>
                  <CardContent className="p-6 pt-0 relative">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-14 mb-6">
                      <div className="w-24 h-24 rounded-full bg-bank-gold border-4 border-white shadow-lg flex items-center justify-center text-bank-navy font-display font-bold text-2xl shrink-0">
                        {avatarInitials}
                      </div>
                      <div className="text-center sm:text-left pb-1">
                        <h2 className="font-display text-2xl font-bold text-bank-navy">
                          {personal.fullName || (
                            <span className="text-slate-400 font-normal text-lg">
                              No name set
                            </span>
                          )}
                        </h2>
                        <p className="text-slate-500 text-sm">
                          {username ? (
                            `@${username}`
                          ) : (
                            <span className="text-slate-400">
                              No username set
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {[
                        { label: "Full Name", value: personal.fullName || "—" },
                        {
                          label: "Username",
                          value: username ? `@${username}` : "—",
                        },
                        {
                          label: "Account Number",
                          value: accountNumber ?? "Generating...",
                          mono: true,
                        },
                        { label: "Account Type", value: "Personal" },
                        { label: "Country", value: personal.country || "—" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="p-3 rounded-lg bg-slate-50 border border-slate-100"
                        >
                          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                            {item.label}
                          </p>
                          <p
                            className={`font-semibold text-bank-navy ${item.mono ? "font-mono" : ""}`}
                          >
                            {item.value}
                          </p>
                        </div>
                      ))}
                      {/* Status badges cell */}
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">
                          Status
                        </p>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                            <span className="text-sm font-medium text-emerald-700">
                              Account: Active
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full inline-block ${emailVerified ? "bg-emerald-500" : "bg-amber-400"}`}
                            />
                            <span
                              className={`text-sm font-medium ${emailVerified ? "text-emerald-700" : "text-amber-700"}`}
                            >
                              Email: {emailVerified ? "Verified" : "Pending"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Button
                        className="bg-bank-navy text-white hover:bg-bank-navy/90"
                        onClick={() => setActiveTab("personal")}
                        data-ocid="profile.edit_button"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="border-bank-navy text-bank-navy hover:bg-bank-navy/5"
                        onClick={() => setActiveTab("kyc")}
                        data-ocid="profile.verify.button"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Verify Account
                      </Button>
                      <Button
                        variant="outline"
                        className="border-bank-gold text-bank-navy hover:bg-bank-gold/10"
                        onClick={() => setActiveTab("username")}
                        data-ocid="profile.change_username.button"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Change Username
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Total Accounts", value: "1" },
                    { label: "Active Cards", value: "0" },
                    {
                      label: "Pending Verifications",
                      value: emailVerified ? "0" : "1",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="text-center p-4 rounded-lg bg-white border border-slate-200 shadow-sm"
                    >
                      <p className="font-display text-2xl font-bold text-bank-navy">
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* 2. PERSONAL INFO */}
            <TabsContent value="personal" className="mt-0">
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 pb-4">
                  <CardTitle className="font-display text-bank-navy">
                    Personal Information
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    Update your identity details. Changes will be reviewed for
                    compliance.
                  </p>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  {personal.personalSaved && (
                    <div
                      className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm"
                      data-ocid="personal_info.save.success_state"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      Personal information saved successfully.
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="e.g. Jane Smith"
                      value={personal.fullName}
                      onChange={(e) =>
                        setPersonal({
                          ...personal,
                          fullName: e.target.value,
                          personalSaved: false,
                        })
                      }
                      data-ocid="personal_info.fullname.input"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="First name"
                        value={personal.firstName}
                        onChange={(e) =>
                          setPersonal({
                            ...personal,
                            firstName: e.target.value,
                            personalSaved: false,
                          })
                        }
                        data-ocid="personal_info.firstname.input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        value={personal.lastName}
                        onChange={(e) =>
                          setPersonal({
                            ...personal,
                            lastName: e.target.value,
                            personalSaved: false,
                          })
                        }
                        data-ocid="personal_info.lastname.input"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={personal.dob}
                      onChange={(e) =>
                        setPersonal({
                          ...personal,
                          dob: e.target.value,
                          personalSaved: false,
                        })
                      }
                      data-ocid="personal_info.dob.input"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={personal.gender}
                      onValueChange={(v) =>
                        setPersonal({
                          ...personal,
                          gender: v,
                          personalSaved: false,
                        })
                      }
                    >
                      <SelectTrigger
                        id="gender"
                        data-ocid="personal_info.gender.select"
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Prefer not to say">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="countryResidence">
                      Country of Residence
                    </Label>
                    <Select
                      value={personal.country}
                      onValueChange={(v) =>
                        setPersonal({
                          ...personal,
                          country: v,
                          personalSaved: false,
                        })
                      }
                    >
                      <SelectTrigger
                        id="countryResidence"
                        data-ocid="personal_info.country.select"
                      >
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Afghanistan",
                          "Albania",
                          "Algeria",
                          "Argentina",
                          "Australia",
                          "Austria",
                          "Bangladesh",
                          "Belgium",
                          "Brazil",
                          "Canada",
                          "Chile",
                          "China",
                          "Colombia",
                          "Czechia",
                          "Denmark",
                          "Egypt",
                          "Ethiopia",
                          "Finland",
                          "France",
                          "Germany",
                          "Ghana",
                          "Greece",
                          "Hungary",
                          "India",
                          "Indonesia",
                          "Iran",
                          "Iraq",
                          "Ireland",
                          "Israel",
                          "Italy",
                          "Japan",
                          "Jordan",
                          "Kenya",
                          "Malaysia",
                          "Mexico",
                          "Morocco",
                          "Netherlands",
                          "New Zealand",
                          "Nigeria",
                          "Norway",
                          "Pakistan",
                          "Peru",
                          "Philippines",
                          "Poland",
                          "Portugal",
                          "Romania",
                          "Russia",
                          "Saudi Arabia",
                          "Senegal",
                          "Singapore",
                          "South Africa",
                          "South Korea",
                          "Spain",
                          "Sweden",
                          "Switzerland",
                          "Tanzania",
                          "Thailand",
                          "Turkey",
                          "Uganda",
                          "Ukraine",
                          "United Arab Emirates",
                          "United Kingdom",
                          "United States",
                          "Vietnam",
                        ].map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Your city"
                      value={personal.city}
                      onChange={(e) =>
                        setPersonal({
                          ...personal,
                          city: e.target.value,
                          personalSaved: false,
                        })
                      }
                      data-ocid="personal_info.city.input"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="address">Residential Address</Label>
                    <Textarea
                      id="address"
                      rows={3}
                      placeholder="Your full residential address"
                      value={personal.address}
                      onChange={(e) =>
                        setPersonal({
                          ...personal,
                          address: e.target.value,
                          personalSaved: false,
                        })
                      }
                      data-ocid="personal_info.address.textarea"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="postal">Postal Code</Label>
                    <Input
                      id="postal"
                      placeholder="Postal / ZIP code"
                      value={personal.postal}
                      onChange={(e) =>
                        setPersonal({
                          ...personal,
                          postal: e.target.value,
                          personalSaved: false,
                        })
                      }
                      className="max-w-xs"
                      data-ocid="personal_info.postal.input"
                    />
                  </div>

                  <Button
                    className="bg-bank-navy text-white hover:bg-bank-navy/90"
                    onClick={() => {
                      setPersonal((p) => ({ ...p, personalSaved: true }));
                      saveProfile({
                        personalInfo: {
                          firstName: personal.firstName,
                          lastName: personal.lastName,
                          fullName: personal.fullName,
                          dob: personal.dob,
                          gender: personal.gender,
                          country: personal.country,
                          city: personal.city,
                          address: personal.address,
                          postalCode: personal.postal,
                        },
                      });
                      toast.success("Personal information saved successfully");
                    }}
                    data-ocid="personal_info.save.submit_button"
                  >
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 3. CONTACT */}
            <TabsContent value="contact" className="mt-0">
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 pb-4">
                  <CardTitle className="font-display text-bank-navy">
                    Contact Information
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    Manage your email and phone number for account
                    communications.
                  </p>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Email Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="contact-email">Email Address</Label>
                      {emailVerified ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                          ✓ Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                          ✗ Not Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="your@email.com"
                        value={contactEmail}
                        onChange={(e) => {
                          setContactEmail(e.target.value);
                          if (emailVerified) {
                            setEmailVerified(false);
                            setVerifyStep("idle");
                          }
                        }}
                        className="flex-1"
                        data-ocid="profile.contact.email.input"
                      />
                      {!emailVerified && verifyStep === "idle" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-bank-gold text-bank-navy shrink-0 hover:bg-bank-gold/10"
                          onClick={handleSendVerificationCode}
                          data-ocid="email_verification.send_button"
                        >
                          Send Verification Code
                        </Button>
                      )}
                    </div>

                    {/* Loading state */}
                    {verifyStep === "loading" && (
                      <div
                        className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-sm"
                        data-ocid="email_verification.loading_state"
                      >
                        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                        Sending verification code to {contactEmail}...
                      </div>
                    )}

                    {/* Code input form */}
                    {verifyStep === "sent" && (
                      <div className="mt-3 p-4 rounded-lg bg-blue-50 border border-blue-100 space-y-3">
                        <p className="text-sm text-blue-700 font-medium">
                          A 6-digit verification code was sent to{" "}
                          <span className="font-semibold">{contactEmail}</span>.
                          Enter it below to verify your email.
                        </p>
                        <div className="space-y-1.5">
                          <Label htmlFor="verify-code">Verification Code</Label>
                          <Input
                            id="verify-code"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="Enter 6-digit code"
                            value={verifyCodeInput}
                            onChange={(e) => {
                              setVerifyCodeInput(
                                e.target.value.replace(/\D/g, "").slice(0, 6),
                              );
                              setVerifyError("");
                            }}
                            className="max-w-xs font-mono text-lg tracking-widest"
                            data-ocid="email_verification.code.input"
                          />
                        </div>
                        {verifyError && (
                          <div
                            className="flex items-center gap-2 text-sm text-red-600"
                            data-ocid="email_verification.error_state"
                          >
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {verifyError}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-bank-navy text-white hover:bg-bank-navy/90"
                            onClick={handleVerifyEmail}
                            data-ocid="email_verification.verify.submit_button"
                          >
                            Verify Email
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-300 text-slate-600"
                            onClick={handleResendCode}
                            data-ocid="email_verification.resend.button"
                          >
                            Resend Code
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Verified success */}
                    {verifyStep === "verified" && (
                      <div
                        className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm"
                        data-ocid="email_verification.success_state"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        Email verified successfully! Your email address is now
                        confirmed.
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <Label>Phone Number</Label>
                    <div className="flex gap-2">
                      <Select
                        value={countryCode}
                        onValueChange={setCountryCode}
                      >
                        <SelectTrigger
                          className="w-44 shrink-0"
                          data-ocid="profile.contact.country_code.select"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            { code: "+234", country: "Nigeria" },
                            { code: "+1", country: "United States" },
                            { code: "+44", country: "United Kingdom" },
                            { code: "+91", country: "India" },
                            { code: "+27", country: "South Africa" },
                            { code: "+233", country: "Ghana" },
                            { code: "+254", country: "Kenya" },
                            { code: "+55", country: "Brazil" },
                            { code: "+86", country: "China" },
                            { code: "+33", country: "France" },
                            { code: "+49", country: "Germany" },
                            { code: "+39", country: "Italy" },
                            { code: "+81", country: "Japan" },
                            { code: "+52", country: "Mexico" },
                            { code: "+31", country: "Netherlands" },
                            { code: "+7", country: "Russia" },
                            { code: "+34", country: "Spain" },
                            { code: "+46", country: "Sweden" },
                            { code: "+971", country: "UAE" },
                            { code: "+61", country: "Australia" },
                          ].map(({ code, country }) => (
                            <SelectItem key={code} value={code}>
                              {code} {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="tel"
                        placeholder="Local phone number"
                        value={localPhone}
                        onChange={(e) => setLocalPhone(e.target.value)}
                        className="flex-1"
                        data-ocid="profile.contact.phone.input"
                      />
                    </div>
                    {localPhone && (
                      <p className="text-xs text-slate-500">
                        Full number: {countryCode} {localPhone}
                      </p>
                    )}
                  </div>

                  <Button
                    className="bg-bank-navy text-white hover:bg-bank-navy/90"
                    onClick={() => {
                      saveProfile({
                        contactInfo: {
                          email: contactEmail,
                          phone: localPhone,
                          countryCode: countryCode,
                        },
                      });
                      toast.success("Contact information updated successfully");
                    }}
                    data-ocid="profile.contact.save_button"
                  >
                    Update Contact Info
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 4. USERNAME */}
            <TabsContent value="username" className="mt-0">
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 pb-4">
                  <CardTitle className="font-display text-bank-navy">
                    Username Settings
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    Your username is used for profile identification and peer
                    transfers.
                  </p>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Current username display */}
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-bank-navy/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-bank-navy" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Current username</p>
                      <p className="font-mono text-base font-semibold text-bank-navy">
                        {username ? (
                          `@${username}`
                        ) : (
                          <span className="text-slate-400 font-normal">
                            No username set
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {usernameSaved && (
                    <div
                      className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm"
                      data-ocid="username.save.success_state"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      Username updated successfully to{" "}
                      <span className="font-mono font-semibold">
                        @{username}
                      </span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="desiredUsername">Desired Username</Label>
                    <div className="flex gap-2">
                      <Input
                        id="desiredUsername"
                        placeholder="4–20 characters, letters and numbers only"
                        value={newUsername}
                        onChange={(e) => {
                          setNewUsername(e.target.value);
                          setUsernameAvailable(null);
                          setUsernameSaved(false);
                        }}
                        className={
                          usernameAvailable === true
                            ? "border-emerald-400 focus-visible:ring-emerald-300"
                            : usernameAvailable === false
                              ? "border-destructive focus-visible:ring-destructive/30"
                              : ""
                        }
                        data-ocid="username.desired.input"
                      />
                      <Button
                        variant="outline"
                        disabled={newUsername.length < 4 || usernameChecking}
                        onClick={handleUsernameCheck}
                        className="border-bank-navy text-bank-navy hover:bg-bank-navy hover:text-white shrink-0"
                        data-ocid="username.check_availability.button"
                      >
                        {usernameChecking ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Checking...
                          </>
                        ) : (
                          "Check Availability"
                        )}
                      </Button>
                    </div>

                    {usernameAvailable === true && (
                      <div
                        className="flex items-center gap-2 text-sm text-emerald-600"
                        data-ocid="username.availability.success_state"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Username{" "}
                        <span className="font-mono font-semibold">
                          @{newUsername}
                        </span>{" "}
                        is available!
                      </div>
                    )}
                    {usernameAvailable === false && (
                      <div
                        className="flex items-center gap-2 text-sm text-red-600"
                        data-ocid="username.availability.error_state"
                      >
                        <AlertCircle className="h-4 w-4" />
                        This username is unavailable or invalid.
                      </div>
                    )}
                  </div>

                  {/* Rules */}
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      Username Rules
                    </p>
                    {[
                      {
                        rule: "Minimum 4 characters",
                        ok: newUsername.length >= 4,
                      },
                      {
                        rule: "Maximum 20 characters",
                        ok: newUsername.length <= 20 && newUsername.length > 0,
                      },
                      {
                        rule: "Only letters and numbers (no spaces or symbols)",
                        ok: /^[a-zA-Z0-9]+$/.test(newUsername),
                      },
                    ].map(({ rule, ok }) => (
                      <div
                        key={rule}
                        className="flex items-center gap-2 text-sm"
                      >
                        {newUsername.length === 0 ? (
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                        ) : ok ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                        )}
                        <span
                          className={
                            newUsername.length === 0
                              ? "text-slate-500"
                              : ok
                                ? "text-emerald-600"
                                : "text-red-600"
                          }
                        >
                          {rule}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="bg-bank-navy text-white hover:bg-bank-navy/90"
                    disabled={usernameAvailable !== true}
                    onClick={() => {
                      setUsername(newUsername);
                      saveProfile({ username: newUsername });
                      setNewUsername("");
                      setUsernameAvailable(null);
                      setUsernameSaved(true);
                      toast.success(`Username set to @${newUsername}`);
                    }}
                    data-ocid="username.save.submit_button"
                  >
                    Save Username
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 5. KYC */}
            <TabsContent value="kyc" className="mt-0">
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="font-display text-bank-navy">
                    Identity Verification (KYC)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div
                    className="flex items-center gap-2"
                    data-ocid="profile.kyc.status.panel"
                  >
                    <p className="text-sm font-medium text-slate-700">
                      Verification Status:
                    </p>
                    {kycStatus === "form" && (
                      <Badge className="bg-slate-100 text-slate-600 border-0">
                        Not Submitted
                      </Badge>
                    )}
                    {kycStatus === "pending" && (
                      <Badge className="bg-amber-100 text-amber-700 border-0">
                        Pending Review
                      </Badge>
                    )}
                    {kycStatus === "approved" && (
                      <Badge className="bg-emerald-100 text-emerald-700 border-0">
                        Approved
                      </Badge>
                    )}
                    {kycStatus === "rejected" && (
                      <Badge className="bg-red-100 text-red-700 border-0">
                        Rejected
                      </Badge>
                    )}
                  </div>

                  {kycStatus === "pending" && (
                    <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                      Your verification is under review. We'll notify you once
                      the process is complete.
                    </div>
                  )}
                  {kycStatus === "approved" && (
                    <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
                      Your identity has been successfully verified.
                    </div>
                  )}
                  {kycStatus === "rejected" && (
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm space-y-2">
                      <p>
                        Your verification was rejected. Please resubmit with
                        correct documents.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-700"
                        onClick={() => setKycStatus("form")}
                      >
                        Resubmit
                      </Button>
                    </div>
                  )}

                  {kycStatus === "form" && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label>Full Name (from profile)</Label>
                          <Input
                            value={personal.fullName}
                            readOnly
                            placeholder="Set in Personal Info tab"
                            className="bg-slate-50"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Country</Label>
                          <Select
                            value={kycCountry}
                            onValueChange={setKycCountry}
                          >
                            <SelectTrigger data-ocid="profile.kyc.country.select">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "Nigeria",
                                "United States",
                                "United Kingdom",
                                "Ghana",
                                "Kenya",
                                "South Africa",
                                "India",
                                "Canada",
                                "Australia",
                                "Germany",
                                "France",
                                "Brazil",
                                "Other",
                              ].map((c) => (
                                <SelectItem key={c} value={c}>
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label>Date of Birth</Label>
                        <Input
                          type="date"
                          value={kycDob}
                          onChange={(e) => setKycDob(e.target.value)}
                          data-ocid="profile.kyc.dob.input"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label>{getGovIdLabel(kycCountry)}</Label>
                        <Input
                          type="text"
                          placeholder={`Enter your ${getGovIdLabel(kycCountry)}`}
                          value={kycGovId}
                          onChange={(e) => setKycGovId(e.target.value)}
                          data-ocid="profile.kyc.gov_id.input"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label>ID Type</Label>
                        <Select value={kycIdType} onValueChange={setKycIdType}>
                          <SelectTrigger data-ocid="profile.kyc.id_type.select">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Passport">Passport</SelectItem>
                            <SelectItem value="National ID">
                              National ID
                            </SelectItem>
                            <SelectItem value="Driver's License">
                              Driver's License
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label>Upload ID Photo</Label>
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 hover:border-bank-gold/50 transition-colors">
                          <label
                            htmlFor="kyc-id-upload"
                            className="flex flex-col items-center gap-2 cursor-pointer"
                            data-ocid="profile.kyc.id_upload.upload_button"
                          >
                            <Upload className="h-8 w-8 text-slate-400" />
                            <span className="text-sm font-medium text-slate-600">
                              {kycIdFile
                                ? kycIdFile.name
                                : "Click to upload your ID"}
                            </span>
                            <span className="text-xs text-slate-400">
                              JPG, PNG, PDF • Max 5MB
                            </span>
                          </label>
                          <input
                            id="kyc-id-upload"
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            className="sr-only"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  toast.error("File size exceeds 5MB limit");
                                  return;
                                }
                                setKycIdFile(file);
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label>
                          Selfie Verification{" "}
                          <span className="text-slate-400 font-normal">
                            (Optional)
                          </span>
                        </Label>
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 hover:border-bank-gold/50 transition-colors">
                          <label
                            htmlFor="kyc-selfie-upload"
                            className="flex flex-col items-center gap-2 cursor-pointer"
                            data-ocid="profile.kyc.selfie_upload.upload_button"
                          >
                            <Upload className="h-8 w-8 text-slate-400" />
                            <span className="text-sm font-medium text-slate-600">
                              {kycSelfie
                                ? kycSelfie.name
                                : "Upload Selfie Photo"}
                            </span>
                            <span className="text-xs text-slate-400">
                              JPG, PNG • Max 5MB
                            </span>
                          </label>
                          <input
                            id="kyc-selfie-upload"
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            className="sr-only"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  toast.error("File size exceeds 5MB limit");
                                  return;
                                }
                                setKycSelfie(file);
                              }
                            }}
                          />
                        </div>
                      </div>

                      <Button
                        className="w-full bg-bank-navy text-white hover:bg-bank-navy/90"
                        onClick={() => {
                          if (!kycDob || !kycGovId || !kycIdFile) {
                            toast.error(
                              "Please fill all required fields and upload your ID",
                            );
                            return;
                          }
                          setKycStatus("pending");
                          saveProfile({
                            kycData: {
                              country: kycCountry,
                              dob: kycDob,
                              idNumber: kycGovId,
                              idType: kycIdType,
                              kycStatus: "pending",
                            },
                          });
                          toast.success(
                            "Verification submitted. Under review.",
                          );
                        }}
                        data-ocid="profile.kyc.submit.button"
                      >
                        Submit Verification
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 6. SECURITY */}
            <TabsContent value="security" className="mt-0">
              <div className="space-y-4">
                {/* Change Password */}
                <Card className="border border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-display text-bank-navy text-lg">
                      Change Password
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="currentPw">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPw"
                          type={showCurrentPw ? "text" : "password"}
                          placeholder="••••••••"
                          className="pr-10"
                          data-ocid="profile.security.current_pw.input"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPw(!showCurrentPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showCurrentPw ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="newPw">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPw"
                          type={showNewPw ? "text" : "password"}
                          placeholder="••••••••"
                          className="pr-10"
                          data-ocid="profile.security.new_pw.input"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPw(!showNewPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showNewPw ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPw">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPw"
                          type={showConfirmPw ? "text" : "password"}
                          placeholder="••••••••"
                          className="pr-10"
                          data-ocid="profile.security.confirm_pw.input"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPw(!showConfirmPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPw ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <Button
                      className="bg-bank-navy text-white hover:bg-bank-navy/90"
                      onClick={() =>
                        toast.success("Password updated successfully")
                      }
                      data-ocid="profile.security.update_pw.button"
                    >
                      Update Password
                    </Button>
                  </CardContent>
                </Card>

                {/* 2FA */}
                <Card className="border border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-display text-bank-navy text-lg">
                      Two-Factor Authentication
                    </CardTitle>
                    <p className="text-sm text-slate-500 mt-1">
                      Add an extra layer of security to your account
                    </p>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Method selection */}
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-3">
                        Authentication Method
                      </p>
                      <RadioGroup
                        value={twoFaMethod}
                        onValueChange={(v) =>
                          setTwoFaMethod(v as "email" | "app")
                        }
                        className="space-y-2"
                      >
                        <label
                          htmlFor="2fa-email"
                          className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                            twoFaMethod === "email"
                              ? "border-bank-navy bg-bank-navy/5"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <RadioGroupItem
                            value="email"
                            id="2fa-email"
                            className="mt-0.5 shrink-0"
                            data-ocid="profile.security.2fa_email.radio"
                          />
                          <div>
                            <p className="font-medium text-bank-navy text-sm">
                              Email Authentication
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Receive a code via email when signing in
                            </p>
                          </div>
                        </label>
                        <label
                          htmlFor="2fa-app"
                          className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                            twoFaMethod === "app"
                              ? "border-bank-navy bg-bank-navy/5"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <RadioGroupItem
                            value="app"
                            id="2fa-app"
                            className="mt-0.5 shrink-0"
                            data-ocid="profile.security.2fa_app.radio"
                          />
                          <div>
                            <p className="font-medium text-bank-navy text-sm">
                              Authenticator App
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Use Google Authenticator, Authy, or any TOTP app
                            </p>
                          </div>
                        </label>
                      </RadioGroup>
                    </div>

                    {/* Email 2FA section */}
                    {twoFaMethod === "email" && (
                      <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              Email 2FA Status:
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {emailTwoFaEnabled
                                ? "You'll receive a code at your email when logging in."
                                : "Enable to receive login verification codes by email."}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            {emailTwoFaEnabled ? (
                              <Badge className="bg-emerald-100 text-emerald-700 border-0">
                                Enabled
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700 border-0">
                                Disabled
                              </Badge>
                            )}
                            <Switch
                              checked={emailTwoFaEnabled}
                              onCheckedChange={(checked) => {
                                setEmailTwoFaEnabled(checked);
                                saveProfile({
                                  emailTwoFAEnabled: checked,
                                  twoFAEnabled: checked,
                                  twoFAMethod: "email",
                                });
                                toast.success(
                                  checked
                                    ? "Email 2FA enabled"
                                    : "Email 2FA disabled",
                                );
                              }}
                              data-ocid="profile.security.email_2fa.switch"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Authenticator App TOTP section */}
                    {twoFaMethod === "app" && (
                      <div className="space-y-4">
                        {totpSetupStep === "idle" && (
                          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-slate-700">
                                  Authenticator App Status:
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  Generate a secret key and scan with your
                                  authenticator app.
                                </p>
                              </div>
                              <Badge className="bg-red-100 text-red-700 border-0">
                                Not Set Up
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              className="mt-3 bg-bank-navy text-white hover:bg-bank-navy/90"
                              onClick={handleSetupTotp}
                              data-ocid="totp.setup.button"
                            >
                              <QrCode className="h-4 w-4 mr-2" />
                              Set Up Authenticator App
                            </Button>
                          </div>
                        )}

                        {totpSetupStep === "setup" && (
                          <div className="space-y-5 p-5 rounded-xl border-2 border-bank-navy/20 bg-bank-navy/5">
                            <div>
                              <p className="text-sm font-semibold text-bank-navy mb-1">
                                Step 1 — Scan QR Code or Enter Secret Key
                              </p>
                              <p className="text-xs text-slate-600">
                                Scan this QR code with Google Authenticator,
                                Authy, or any TOTP app. Then enter the 6-digit
                                code from your app to confirm setup.
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                              {/* QR Code */}
                              <div className="flex flex-col items-center gap-2">
                                <div
                                  className="w-[200px] h-[200px] rounded-lg border-2 border-slate-200 bg-white overflow-hidden flex items-center justify-center"
                                  data-ocid="totp.qr_code.panel"
                                >
                                  <img
                                    src={totpQrUrl}
                                    alt="TOTP QR Code"
                                    width={200}
                                    height={200}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <p className="text-xs text-slate-500 text-center">
                                  Scan with your authenticator app
                                </p>
                              </div>

                              {/* Secret key */}
                              <div className="flex-1 space-y-3">
                                <div>
                                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                                    Or enter this key manually:
                                  </p>
                                  <div className="flex gap-2 items-center">
                                    <div
                                      className="flex-1 px-3 py-2.5 rounded-lg bg-white border border-slate-200 font-mono text-sm tracking-widest text-bank-navy font-bold select-all break-all"
                                      data-ocid="totp.secret_input"
                                    >
                                      {totpSecret.match(/.{1,4}/g)?.join(" ")}
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-slate-300 shrink-0"
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          totpSecret,
                                        );
                                        toast.success(
                                          "Secret key copied to clipboard",
                                        );
                                      }}
                                      data-ocid="totp.copy_secret.button"
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-1">
                                    Keep this key safe and secret. Don't share
                                    it with anyone.
                                  </p>
                                </div>

                                <div className="pt-2 border-t border-slate-200">
                                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                                    Account: TRUPTAR Bank
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    Type: Time-based (TOTP)
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-slate-200">
                              <p className="text-sm font-semibold text-bank-navy">
                                Step 2 — Enter Code from App
                              </p>
                              <Label htmlFor="totp-code">
                                6-digit code from your authenticator app
                              </Label>
                              <Input
                                id="totp-code"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                placeholder="000000"
                                value={totpCodeInput}
                                onChange={(e) => {
                                  setTotpCodeInput(
                                    e.target.value
                                      .replace(/\D/g, "")
                                      .slice(0, 6),
                                  );
                                  setTotpCodeError("");
                                }}
                                className="max-w-xs font-mono text-lg tracking-widest"
                                data-ocid="totp.code.input"
                              />
                              {totpCodeError && (
                                <div
                                  className="flex items-center gap-2 text-sm text-red-600"
                                  data-ocid="totp.error_state"
                                >
                                  <AlertCircle className="h-4 w-4 shrink-0" />
                                  {totpCodeError}
                                </div>
                              )}
                              <div className="flex gap-2 pt-1">
                                <Button
                                  className="bg-bank-navy text-white hover:bg-bank-navy/90"
                                  onClick={handleActivateTotp}
                                  data-ocid="totp.activate.button"
                                >
                                  Activate 2FA
                                </Button>
                                <Button
                                  variant="outline"
                                  className="border-slate-300 text-slate-600"
                                  onClick={() => {
                                    setTotpSetupStep("idle");
                                    setTotpCodeInput("");
                                    setTotpCodeError("");
                                  }}
                                  data-ocid="totp.cancel.button"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {totpSetupStep === "enabled" && (
                          <div
                            className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 space-y-3"
                            data-ocid="totp.success_state"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                                <div>
                                  <p className="text-sm font-semibold text-emerald-800">
                                    Authenticator App 2FA is Active
                                  </p>
                                  <p className="text-xs text-emerald-700 mt-0.5">
                                    Your account is protected with TOTP
                                    authentication.
                                  </p>
                                </div>
                              </div>
                              <Badge className="bg-emerald-600 text-white border-0">
                                Enabled
                              </Badge>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              onClick={handleDisableTotp}
                              data-ocid="totp.disable.button"
                            >
                              Disable Authenticator 2FA
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Active Sessions */}
                <Card className="border border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-display text-bank-navy text-lg">
                      Active Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-3">
                    {sessions.length === 0 ? (
                      <p
                        className="text-sm text-slate-500"
                        data-ocid="profile.sessions.empty_state"
                      >
                        No active sessions.
                      </p>
                    ) : (
                      sessions.map((s, i) => (
                        <div
                          key={s.device}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100"
                        >
                          <div className="flex items-center gap-3">
                            <Monitor className="h-5 w-5 text-bank-navy shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-slate-800">
                                {s.device}
                              </p>
                              <p className="text-xs text-slate-500">
                                {s.location} · {s.lastActive}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50 text-xs"
                            onClick={() => revokeSession(i)}
                            data-ocid={`profile.sessions.delete_button.${i + 1}`}
                          >
                            Revoke
                          </Button>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 7. DOCUMENTS */}
            <TabsContent value="documents" className="mt-0">
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 pb-4">
                  <CardTitle className="font-display text-bank-navy">
                    Document Management
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    Your uploaded verification documents are listed below.
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  {documents.length === 0 ? (
                    <div
                      className="py-12 text-center text-slate-500 text-sm"
                      data-ocid="profile.documents.empty_state"
                    >
                      No documents uploaded yet. Complete KYC verification to
                      upload documents.
                    </div>
                  ) : (
                    <div
                      className="space-y-3"
                      data-ocid="profile.documents.list"
                    >
                      {documents.map((doc, idx) => (
                        <div
                          key={doc.name}
                          className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors"
                          data-ocid={`profile.documents.item.${idx + 1}`}
                        >
                          <div className="w-10 h-10 rounded-lg bg-bank-navy/10 flex items-center justify-center shrink-0">
                            <FileText className="h-5 w-5 text-bank-navy" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-bank-navy text-sm truncate">
                              {doc.name}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {doc.type} · Uploaded {doc.uploadDate}
                            </p>
                          </div>
                          {doc.status === "Verified" && (
                            <Badge className="bg-emerald-100 text-emerald-700 border-0 shrink-0">
                              Verified
                            </Badge>
                          )}
                          {doc.status === "Pending" && (
                            <Badge className="bg-amber-100 text-amber-700 border-0 shrink-0">
                              Pending
                            </Badge>
                          )}
                          {doc.status === "Rejected" && (
                            <Badge className="bg-red-100 text-red-700 border-0 shrink-0">
                              Rejected
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 8. PREFERENCES */}
            <TabsContent value="preferences" className="mt-0">
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 pb-4">
                  <CardTitle className="font-display text-bank-navy">
                    Account Preferences
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    Manage notification settings and interface preferences.
                  </p>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-700">
                      Email Notifications
                    </p>
                    {[
                      {
                        id: "notif-tx",
                        label: "Transaction Alerts",
                        desc: "Receive alerts for account debits and credits",
                        checked: notifTransactions,
                        set: setNotifTransactions,
                        ocid: "preferences.notif_transactions.checkbox",
                      },
                      {
                        id: "notif-sec",
                        label: "Security Alerts",
                        desc: "Login attempts, password changes, 2FA events",
                        checked: notifSecurity,
                        set: setNotifSecurity,
                        ocid: "preferences.notif_security.checkbox",
                      },
                      {
                        id: "notif-promo",
                        label: "Promotions",
                        desc: "Special offers and banking product updates",
                        checked: notifPromo,
                        set: setNotifPromo,
                        ocid: "preferences.notif_promo.checkbox",
                      },
                    ].map(({ id, label, desc, checked, set, ocid }) => (
                      <div
                        key={id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50"
                      >
                        <Checkbox
                          id={id}
                          checked={checked}
                          onCheckedChange={(v) => set(v === true)}
                          data-ocid={ocid}
                        />
                        <label htmlFor={id} className="cursor-pointer flex-1">
                          <p className="text-sm font-medium text-slate-800">
                            {label}
                          </p>
                          <p className="text-xs text-slate-500">{desc}</p>
                        </label>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="language">Language Preference</Label>
                    <Select
                      value={prefLanguage}
                      onValueChange={setPrefLanguage}
                    >
                      <SelectTrigger
                        id="language"
                        className="max-w-xs"
                        data-ocid="preferences.language.select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="bg-bank-navy text-white hover:bg-bank-navy/90"
                    onClick={() => {
                      saveProfile({
                        preferences: {
                          notifTransactions,
                          notifSecurity,
                          notifPromo,
                          language: prefLanguage,
                        },
                      });
                      toast.success("Preferences saved successfully");
                    }}
                    data-ocid="preferences.save.submit_button"
                  >
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 9. ACTIVITY LOG */}
            <TabsContent value="activity" className="mt-0">
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 pb-4">
                  <CardTitle className="font-display text-bank-navy">
                    Activity Log
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    Recent actions performed on your account.
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  {activityLogs.length === 0 ? (
                    <div
                      className="py-12 text-center text-slate-500 text-sm"
                      data-ocid="profile.activity.empty_state"
                    >
                      No activity recorded yet. Actions on your account will
                      appear here.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table data-ocid="profile.activity.table">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Device</TableHead>
                            <TableHead>IP Address</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activityLogs.map((log, idx) => (
                            <TableRow
                              key={`${log.date}-${log.action}-${idx}`}
                              className={
                                log.action.toLowerCase().includes("fail")
                                  ? "bg-red-50"
                                  : ""
                              }
                              data-ocid={`profile.activity.row.${idx + 1}`}
                            >
                              <TableCell className="text-xs text-slate-600 whitespace-nowrap">
                                {log.date}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`text-sm font-medium ${
                                    log.action.toLowerCase().includes("fail")
                                      ? "text-red-600"
                                      : "text-slate-800"
                                  }`}
                                >
                                  {log.action}
                                </span>
                              </TableCell>
                              <TableCell className="text-xs text-slate-600">
                                {log.device}
                              </TableCell>
                              <TableCell className="text-xs font-mono text-slate-600">
                                {log.ip}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 py-6 px-4">
        <div className="max-w-7xl mx-auto text-center text-xs text-slate-400">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-slate-600"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
