import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  CheckCircle,
  ChevronRight,
  CreditCard,
  Download,
  FileText,
  Globe,
  LayoutDashboard,
  MessageSquare,
  RefreshCw,
  Settings,
  Shield,
  TrendingUp,
  User,
  UserCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Section =
  | "dashboard"
  | "users"
  | "loans"
  | "kyc"
  | "contacts"
  | "transactions"
  | "accounts"
  | "visitors"
  | "settings";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const mockUsers = [
  {
    id: 1,
    name: "James Okonkwo",
    account: "5429081142",
    type: "Personal",
    country: "Nigeria",
    status: "Active",
    verified: "Verified",
  },
  {
    id: 2,
    name: "Emily Carter",
    account: "7812304561",
    type: "Business",
    country: "USA",
    status: "Active",
    verified: "Verified",
  },
  {
    id: 3,
    name: "Amara Diallo",
    account: "3301928475",
    type: "Personal",
    country: "Ghana",
    status: "Pending",
    verified: "Pending",
  },
  {
    id: 4,
    name: "Lucas Mendes",
    account: "9923145670",
    type: "Personal",
    country: "Brazil",
    status: "Active",
    verified: "Verified",
  },
  {
    id: 5,
    name: "Priya Sharma",
    account: "6647291830",
    type: "Business",
    country: "India",
    status: "Suspended",
    verified: "Rejected",
  },
  {
    id: 6,
    name: "Oliver Thompson",
    account: "1190384726",
    type: "Personal",
    country: "UK",
    status: "Active",
    verified: "Verified",
  },
  {
    id: 7,
    name: "Fatima Al-Hassan",
    account: "4482039157",
    type: "Personal",
    country: "UAE",
    status: "Pending",
    verified: "Pending",
  },
  {
    id: 8,
    name: "Chen Wei",
    account: "8836512094",
    type: "Business",
    country: "Singapore",
    status: "Active",
    verified: "Verified",
  },
  {
    id: 9,
    name: "Sofia Rossi",
    account: "2271048395",
    type: "Personal",
    country: "Italy",
    status: "Active",
    verified: "Verified",
  },
  {
    id: 10,
    name: "Kwame Asante",
    account: "5563809124",
    type: "Personal",
    country: "Ghana",
    status: "Suspended",
    verified: "Pending",
  },
  {
    id: 11,
    name: "Maria Santos",
    account: "7710293846",
    type: "Business",
    country: "Portugal",
    status: "Active",
    verified: "Verified",
  },
  {
    id: 12,
    name: "Ahmed Khalil",
    account: "3309182475",
    type: "Personal",
    country: "Egypt",
    status: "Pending",
    verified: "Pending",
  },
];

const mockLoans = [
  {
    id: 1,
    name: "James Okonkwo",
    type: "Personal",
    amount: "$15,000",
    purpose: "Home Renovation",
    date: "Mar 1, 2026",
    status: "Pending",
  },
  {
    id: 2,
    name: "Emily Carter",
    type: "Business",
    amount: "$120,000",
    purpose: "Business Expansion",
    date: "Feb 28, 2026",
    status: "Approved",
  },
  {
    id: 3,
    name: "Lucas Mendes",
    type: "Mortgage",
    amount: "$280,000",
    purpose: "Home Purchase",
    date: "Feb 25, 2026",
    status: "Pending",
  },
  {
    id: 4,
    name: "Priya Sharma",
    type: "Auto",
    amount: "$32,000",
    purpose: "Vehicle Purchase",
    date: "Feb 22, 2026",
    status: "Rejected",
  },
  {
    id: 5,
    name: "Oliver Thompson",
    type: "Personal",
    amount: "$8,500",
    purpose: "Education",
    date: "Feb 20, 2026",
    status: "Approved",
  },
  {
    id: 6,
    name: "Fatima Al-Hassan",
    type: "Community",
    amount: "$75,000",
    purpose: "Healthcare Center",
    date: "Feb 18, 2026",
    status: "Pending",
  },
  {
    id: 7,
    name: "Chen Wei",
    type: "Business",
    amount: "$200,000",
    purpose: "Equipment Purchase",
    date: "Feb 15, 2026",
    status: "Approved",
  },
  {
    id: 8,
    name: "Sofia Rossi",
    type: "Personal",
    amount: "$5,000",
    purpose: "Travel",
    date: "Feb 12, 2026",
    status: "Pending",
  },
  {
    id: 9,
    name: "Kwame Asante",
    type: "Mortgage",
    amount: "$350,000",
    purpose: "Property Investment",
    date: "Feb 10, 2026",
    status: "Rejected",
  },
  {
    id: 10,
    name: "Ahmed Khalil",
    type: "Auto",
    amount: "$45,000",
    purpose: "Commercial Vehicle",
    date: "Feb 8, 2026",
    status: "Pending",
  },
  {
    id: 11,
    name: "Maria Santos",
    type: "Community",
    amount: "$50,000",
    purpose: "School Construction",
    date: "Feb 5, 2026",
    status: "Approved",
  },
  {
    id: 12,
    name: "Amara Diallo",
    type: "Personal",
    amount: "$3,200",
    purpose: "Medical Bills",
    date: "Feb 3, 2026",
    status: "Pending",
  },
  {
    id: 13,
    name: "Oliver Thompson",
    type: "Business",
    amount: "$90,000",
    purpose: "Inventory",
    date: "Jan 30, 2026",
    status: "Pending",
  },
  {
    id: 14,
    name: "Priya Sharma",
    type: "Personal",
    amount: "$12,000",
    purpose: "Debt Consolidation",
    date: "Jan 28, 2026",
    status: "Rejected",
  },
  {
    id: 15,
    name: "James Okonkwo",
    type: "Mortgage",
    amount: "$180,000",
    purpose: "Second Home",
    date: "Jan 25, 2026",
    status: "Approved",
  },
];

const mockKYC = [
  {
    id: 1,
    name: "Amara Diallo",
    country: "Ghana",
    idType: "Passport",
    govId: "GH****8821",
    date: "Mar 2, 2026",
    status: "Pending",
  },
  {
    id: 2,
    name: "Fatima Al-Hassan",
    country: "UAE",
    idType: "National ID",
    govId: "AE****3349",
    date: "Feb 28, 2026",
    status: "Pending",
  },
  {
    id: 3,
    name: "Ahmed Khalil",
    country: "Egypt",
    idType: "National ID",
    govId: "EG****7762",
    date: "Feb 25, 2026",
    status: "Pending",
  },
  {
    id: 4,
    name: "Kwame Asante",
    country: "Ghana",
    idType: "Driver's License",
    govId: "DL****1190",
    date: "Feb 20, 2026",
    status: "Rejected",
  },
  {
    id: 5,
    name: "Lucas Mendes",
    country: "Brazil",
    idType: "Passport",
    govId: "BR****5534",
    date: "Feb 18, 2026",
    status: "Approved",
  },
  {
    id: 6,
    name: "Sofia Rossi",
    country: "Italy",
    idType: "Passport",
    govId: "IT****2209",
    date: "Feb 15, 2026",
    status: "Approved",
  },
  {
    id: 7,
    name: "Maria Santos",
    country: "Portugal",
    idType: "National ID",
    govId: "PT****8844",
    date: "Feb 12, 2026",
    status: "Approved",
  },
  {
    id: 8,
    name: "Chen Wei",
    country: "Singapore",
    idType: "Passport",
    govId: "SG****6671",
    date: "Feb 10, 2026",
    status: "Approved",
  },
  {
    id: 9,
    name: "Oliver Thompson",
    country: "UK",
    idType: "National ID",
    govId: "UK****9923",
    date: "Feb 8, 2026",
    status: "Approved",
  },
  {
    id: 10,
    name: "Emily Carter",
    country: "USA",
    idType: "Driver's License",
    govId: "US****3315",
    date: "Feb 5, 2026",
    status: "Approved",
  },
];

const mockContacts = [
  {
    id: 1,
    name: "James Okonkwo",
    email: "james@example.com",
    type: "Contact Form",
    subject: "Account Issue",
    date: "Mar 5, 2026",
    status: "New",
  },
  {
    id: 2,
    name: "Emily Carter",
    email: "emily@example.com",
    type: "Advisory",
    subject: "Business Expansion Plan",
    date: "Mar 4, 2026",
    status: "In Progress",
  },
  {
    id: 3,
    name: "Amara Diallo",
    email: "amara@example.com",
    type: "Contact Form",
    subject: "KYC Verification Help",
    date: "Mar 3, 2026",
    status: "Resolved",
  },
  {
    id: 4,
    name: "Lucas Mendes",
    email: "lucas@example.com",
    type: "Advisory",
    subject: "Mortgage Planning",
    date: "Mar 2, 2026",
    status: "New",
  },
  {
    id: 5,
    name: "Priya Sharma",
    email: "priya@example.com",
    type: "Contact Form",
    subject: "Transaction Dispute",
    date: "Mar 1, 2026",
    status: "In Progress",
  },
  {
    id: 6,
    name: "Oliver Thompson",
    email: "oliver@example.com",
    type: "Contact Form",
    subject: "Card Replacement",
    date: "Feb 28, 2026",
    status: "Resolved",
  },
  {
    id: 7,
    name: "Fatima Al-Hassan",
    email: "fatima@example.com",
    type: "Advisory",
    subject: "Investment Strategy",
    date: "Feb 27, 2026",
    status: "New",
  },
  {
    id: 8,
    name: "Chen Wei",
    email: "chen@example.com",
    type: "Advisory",
    subject: "Business Credit Line",
    date: "Feb 25, 2026",
    status: "Resolved",
  },
  {
    id: 9,
    name: "Sofia Rossi",
    email: "sofia@example.com",
    type: "Contact Form",
    subject: "Online Banking Access",
    date: "Feb 24, 2026",
    status: "New",
  },
  {
    id: 10,
    name: "Kwame Asante",
    email: "kwame@example.com",
    type: "Contact Form",
    subject: "Loan Status Inquiry",
    date: "Feb 22, 2026",
    status: "Resolved",
  },
  {
    id: 11,
    name: "Ahmed Khalil",
    email: "ahmed@example.com",
    type: "Advisory",
    subject: "Savings Plan",
    date: "Feb 20, 2026",
    status: "In Progress",
  },
  {
    id: 12,
    name: "Maria Santos",
    email: "maria@example.com",
    type: "Contact Form",
    subject: "Account Upgrade",
    date: "Feb 18, 2026",
    status: "New",
  },
];

const mockTransactions = [
  {
    id: "TXN-001",
    user: "James Okonkwo",
    type: "Deposit",
    amount: "$5,000",
    date: "Mar 5, 2026",
    status: "Completed",
  },
  {
    id: "TXN-002",
    user: "Emily Carter",
    type: "Transfer",
    amount: "$12,400",
    date: "Mar 5, 2026",
    status: "Completed",
  },
  {
    id: "TXN-003",
    user: "Lucas Mendes",
    type: "Withdrawal",
    amount: "$800",
    date: "Mar 5, 2026",
    status: "Completed",
  },
  {
    id: "TXN-004",
    user: "Priya Sharma",
    type: "Loan Payment",
    amount: "$2,100",
    date: "Mar 4, 2026",
    status: "Failed",
  },
  {
    id: "TXN-005",
    user: "Oliver Thompson",
    type: "Deposit",
    amount: "$3,500",
    date: "Mar 4, 2026",
    status: "Completed",
  },
  {
    id: "TXN-006",
    user: "Fatima Al-Hassan",
    type: "Transfer",
    amount: "$7,200",
    date: "Mar 4, 2026",
    status: "Pending",
  },
  {
    id: "TXN-007",
    user: "Chen Wei",
    type: "Withdrawal",
    amount: "$15,000",
    date: "Mar 3, 2026",
    status: "Completed",
  },
  {
    id: "TXN-008",
    user: "Sofia Rossi",
    type: "Deposit",
    amount: "$1,200",
    date: "Mar 3, 2026",
    status: "Completed",
  },
  {
    id: "TXN-009",
    user: "Kwame Asante",
    type: "Loan Payment",
    amount: "$450",
    date: "Mar 3, 2026",
    status: "Failed",
  },
  {
    id: "TXN-010",
    user: "Ahmed Khalil",
    type: "Transfer",
    amount: "$9,800",
    date: "Mar 2, 2026",
    status: "Completed",
  },
  {
    id: "TXN-011",
    user: "Maria Santos",
    type: "Deposit",
    amount: "$22,000",
    date: "Mar 2, 2026",
    status: "Completed",
  },
  {
    id: "TXN-012",
    user: "Amara Diallo",
    type: "Withdrawal",
    amount: "$300",
    date: "Mar 2, 2026",
    status: "Completed",
  },
  {
    id: "TXN-013",
    user: "James Okonkwo",
    type: "Transfer",
    amount: "$4,500",
    date: "Mar 1, 2026",
    status: "Pending",
  },
  {
    id: "TXN-014",
    user: "Emily Carter",
    type: "Loan Payment",
    amount: "$8,300",
    date: "Mar 1, 2026",
    status: "Completed",
  },
  {
    id: "TXN-015",
    user: "Lucas Mendes",
    type: "Deposit",
    amount: "$6,700",
    date: "Feb 28, 2026",
    status: "Completed",
  },
  {
    id: "TXN-016",
    user: "Oliver Thompson",
    type: "Withdrawal",
    amount: "$1,800",
    date: "Feb 28, 2026",
    status: "Completed",
  },
  {
    id: "TXN-017",
    user: "Chen Wei",
    type: "Transfer",
    amount: "$30,000",
    date: "Feb 27, 2026",
    status: "Completed",
  },
  {
    id: "TXN-018",
    user: "Sofia Rossi",
    type: "Withdrawal",
    amount: "$2,500",
    date: "Feb 27, 2026",
    status: "Failed",
  },
  {
    id: "TXN-019",
    user: "Ahmed Khalil",
    type: "Deposit",
    amount: "$11,000",
    date: "Feb 26, 2026",
    status: "Completed",
  },
  {
    id: "TXN-020",
    user: "Maria Santos",
    type: "Loan Payment",
    amount: "$5,600",
    date: "Feb 26, 2026",
    status: "Completed",
  },
];

const mockAccountRequests = [
  {
    id: 1,
    name: "Grace Adeola",
    type: "Personal Savings",
    date: "Mar 5, 2026",
    documents: "ID + Utility Bill",
    status: "Pending",
  },
  {
    id: 2,
    name: "Ravi Patel",
    type: "Business Checking",
    date: "Mar 4, 2026",
    documents: "CAC + ID",
    status: "Pending",
  },
  {
    id: 3,
    name: "Yuki Tanaka",
    type: "Personal Checking",
    date: "Mar 3, 2026",
    documents: "Passport",
    status: "Approved",
  },
  {
    id: 4,
    name: "Lena Fischer",
    type: "Fixed Deposit",
    date: "Mar 2, 2026",
    documents: "ID + Bank Statement",
    status: "Approved",
  },
  {
    id: 5,
    name: "Carlos Rivera",
    type: "Business Savings",
    date: "Mar 1, 2026",
    documents: "Business License + ID",
    status: "Pending",
  },
  {
    id: 6,
    name: "Nadia Osei",
    type: "Personal Savings",
    date: "Feb 28, 2026",
    documents: "National ID",
    status: "Rejected",
  },
  {
    id: 7,
    name: "Tariq Bashir",
    type: "Personal Checking",
    date: "Feb 27, 2026",
    documents: "Passport + Proof of Address",
    status: "Approved",
  },
  {
    id: 8,
    name: "Isabelle Dupont",
    type: "Fixed Deposit",
    date: "Feb 25, 2026",
    documents: "ID + Employment Letter",
    status: "Pending",
  },
];

const recentActivity = [
  {
    time: "2 min ago",
    event: "New KYC submission from Amara Diallo",
    type: "kyc",
  },
  {
    time: "15 min ago",
    event: "Loan application approved for Chen Wei ($200K)",
    type: "loan",
  },
  {
    time: "32 min ago",
    event: "User James Okonkwo logged in from Nigeria",
    type: "login",
  },
  {
    time: "1 hr ago",
    event: "Transaction TXN-006 pending review ($7,200)",
    type: "transaction",
  },
  {
    time: "1 hr ago",
    event: "Advisory request from Emily Carter",
    type: "contact",
  },
  {
    time: "2 hrs ago",
    event: "Account opening request from Grace Adeola",
    type: "account",
  },
  { time: "3 hrs ago", event: "KYC rejected for Kwame Asante", type: "kyc" },
  {
    time: "4 hrs ago",
    event: "New user registration: Ahmed Khalil (Egypt)",
    type: "login",
  },
  {
    time: "5 hrs ago",
    event: "Loan application received — Lucas Mendes ($280K Mortgage)",
    type: "loan",
  },
  {
    time: "6 hrs ago",
    event: "System maintenance window completed successfully",
    type: "system",
  },
];

const visitorLog = [
  {
    time: "Mar 5, 14:32",
    page: "/services/loans",
    device: "Chrome/Desktop",
    country: "Nigeria",
    ip: "197.210.***.***",
  },
  {
    time: "Mar 5, 14:28",
    page: "/dashboard",
    device: "Safari/iPhone",
    country: "USA",
    ip: "104.28.***.***",
  },
  {
    time: "Mar 5, 14:21",
    page: "/",
    device: "Firefox/Desktop",
    country: "UK",
    ip: "82.37.***.***",
  },
  {
    time: "Mar 5, 14:15",
    page: "/services/personal",
    device: "Chrome/Android",
    country: "Ghana",
    ip: "154.120.***.***",
  },
  {
    time: "Mar 5, 14:09",
    page: "/open-account",
    device: "Edge/Desktop",
    country: "India",
    ip: "49.36.***.***",
  },
  {
    time: "Mar 5, 14:02",
    page: "/about",
    device: "Safari/iPad",
    country: "UAE",
    ip: "5.100.***.***",
  },
  {
    time: "Mar 5, 13:58",
    page: "/contact",
    device: "Chrome/Desktop",
    country: "Brazil",
    ip: "189.28.***.***",
  },
  {
    time: "Mar 5, 13:45",
    page: "/services/business",
    device: "Chrome/Desktop",
    country: "Singapore",
    ip: "103.6.***.***",
  },
];

const topPages = [
  { page: "/", views: 1842, avgTime: "1m 45s", bounce: "28%" },
  { page: "/services/personal", views: 1204, avgTime: "3m 12s", bounce: "22%" },
  { page: "/services/loans", views: 986, avgTime: "4m 05s", bounce: "18%" },
  { page: "/dashboard", views: 874, avgTime: "8m 30s", bounce: "9%" },
  { page: "/open-account", views: 762, avgTime: "5m 18s", bounce: "15%" },
  { page: "/about", views: 541, avgTime: "2m 03s", bounce: "41%" },
  { page: "/contact", views: 398, avgTime: "1m 52s", bounce: "35%" },
  { page: "/services/business", views: 322, avgTime: "3m 48s", bounce: "24%" },
];

const dailyVisits = [
  { day: "Mon", visits: 284 },
  { day: "Tue", visits: 341 },
  { day: "Wed", visits: 318 },
  { day: "Thu", visits: 412 },
  { day: "Fri", visits: 387 },
  { day: "Sat", visits: 220 },
  { day: "Sun", visits: 142 },
];

// ─── Status Badges ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-emerald-100 text-emerald-700",
    Approved: "bg-emerald-100 text-emerald-700",
    Verified: "bg-emerald-100 text-emerald-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Resolved: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    "In Progress": "bg-blue-100 text-blue-700",
    New: "bg-blue-100 text-blue-700",
    "Pending Review": "bg-amber-100 text-amber-700",
    Suspended: "bg-red-100 text-red-700",
    Rejected: "bg-red-100 text-red-700",
    Failed: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
}

function Initials({ name }: { name: string }) {
  const parts = name.split(" ");
  return (
    <div className="w-8 h-8 rounded-full bg-bank-navy/10 text-bank-navy text-xs font-bold flex items-center justify-center shrink-0">
      {parts[0]?.[0]}
      {parts[1]?.[0]}
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function DashboardOverview({
  setSection,
}: { setSection: (s: Section) => void }) {
  const kpis = [
    {
      label: "Total Users",
      value: "1,248",
      icon: Users,
      trend: "+12 this week",
      color: "text-bank-navy",
    },
    {
      label: "Pending Requests",
      value: "23",
      icon: AlertTriangle,
      trend: "Needs attention",
      color: "text-amber-600",
    },
    {
      label: "Active Accounts",
      value: "1,180",
      icon: CheckCircle,
      trend: "94.5% of users",
      color: "text-emerald-600",
    },
    {
      label: "Transactions Today",
      value: "87",
      icon: Activity,
      trend: "$142K volume",
      color: "text-blue-600",
    },
  ];

  const activityIcons: Record<string, React.ReactNode> = {
    kyc: <UserCheck className="h-3.5 w-3.5 text-purple-600" />,
    loan: <CreditCard className="h-3.5 w-3.5 text-blue-600" />,
    login: <User className="h-3.5 w-3.5 text-emerald-600" />,
    transaction: <Activity className="h-3.5 w-3.5 text-amber-600" />,
    contact: <MessageSquare className="h-3.5 w-3.5 text-pink-600" />,
    account: <FileText className="h-3.5 w-3.5 text-teal-600" />,
    system: <Settings className="h-3.5 w-3.5 text-gray-600" />,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-bank-navy">
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back, Admin. Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Card
            key={kpi.label}
            className="border border-border shadow-xs"
            data-ocid={
              `admin.dashboard.card.${i + 1}` as `admin.dashboard.card.${1 | 2 | 3 | 4}`
            }
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${kpi.color}`}>
                    {kpi.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {kpi.trend}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-bank-navy/5 flex items-center justify-center">
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border border-border shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-bank-navy">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((item, i) => (
              <div
                key={item.event}
                className="flex items-start gap-3 py-2 border-b border-border last:border-0"
                data-ocid={
                  `admin.activity.item.${i + 1}` as `admin.activity.item.${1}`
                }
              >
                <div className="w-6 h-6 rounded-full bg-bank-navy/5 flex items-center justify-center mt-0.5 shrink-0">
                  {activityIcons[item.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">
                    {item.event}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                  {item.time}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border border-border shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-bank-navy">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                label: "Review KYC Requests",
                section: "kyc" as Section,
                icon: UserCheck,
                count: 3,
              },
              {
                label: "Approve Loans",
                section: "loans" as Section,
                icon: CreditCard,
                count: 5,
              },
              {
                label: "View Contact Requests",
                section: "contacts" as Section,
                icon: MessageSquare,
                count: 4,
              },
              {
                label: "System Settings",
                section: "settings" as Section,
                icon: Settings,
                count: 0,
              },
            ].map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => setSection(action.section)}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-bank-navy/5 hover:bg-bank-navy/10 transition-colors text-left"
                data-ocid={`admin.quickaction.${action.section}.button`}
              >
                <action.icon className="h-4 w-4 text-bank-navy shrink-0" />
                <span className="text-sm font-medium text-bank-navy flex-1">
                  {action.label}
                </span>
                {action.count > 0 && (
                  <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {action.count}
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-bank-navy/40" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UserManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<(typeof mockUsers)[0] | null>(null);
  const [users, setUsers] = useState(mockUsers);
  const perPage = 10;

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.account.includes(search);
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  function toggleStatus(id: number) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" }
          : u,
      ),
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-display font-bold text-bank-navy">
          User Management
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Manage all registered bank customers.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by name or account..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
          data-ocid="admin.users.search_input"
        />
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40" data-ocid="admin.users.select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["All", "Active", "Suspended", "Pending"].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-bank-navy/5">
              <TableHead>User</TableHead>
              <TableHead>Account #</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((u, i) => (
              <TableRow
                key={u.id}
                data-ocid={
                  `admin.users.item.${i + 1}` as `admin.users.item.${1}`
                }
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Initials name={u.name} />
                    <span className="font-medium text-sm">{u.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground font-mono">
                  {u.account}
                </TableCell>
                <TableCell className="text-sm">{u.type}</TableCell>
                <TableCell className="text-sm">{u.country}</TableCell>
                <TableCell>
                  <StatusBadge status={u.status} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={u.verified} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelected(u)}
                      data-ocid={
                        `admin.users.view_button.${i + 1}` as `admin.users.view_button.${1}`
                      }
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className={
                        u.status === "Active"
                          ? "text-red-600 border-red-200 hover:bg-red-50"
                          : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                      }
                      onClick={() => toggleStatus(u.id)}
                      data-ocid={
                        `admin.users.toggle.${i + 1}` as `admin.users.toggle.${1}`
                      }
                    >
                      {u.status === "Active" ? "Suspend" : "Activate"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {paginated.length} of {filtered.length} users
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            data-ocid="admin.users.pagination_prev"
          >
            Prev
          </Button>
          <span className="text-sm px-3 py-1 bg-bank-navy/5 rounded">
            {page} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            data-ocid="admin.users.pagination_next"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Side panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={() => setSelected(null)}
          />
          <div className="w-80 bg-white shadow-2xl border-l border-border overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-semibold text-bank-navy">User Details</h3>
              <button type="button" onClick={() => setSelected(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-bank-navy text-white text-lg font-bold flex items-center justify-center">
                  {selected.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-semibold text-bank-navy">
                    {selected.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selected.type} Customer
                  </p>
                </div>
              </div>
              {(
                [
                  ["Account Number", selected.account],
                  ["Account Type", selected.type],
                  ["Country", selected.country],
                  ["Status", selected.status],
                  ["Verification", selected.verified],
                ] as [string, string][]
              ).map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between items-center py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm text-muted-foreground">{k}</span>
                  <span className="text-sm font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LoanApplications() {
  const [tab, setTab] = useState("All");
  const [loans, setLoans] = useState(mockLoans);

  const filtered =
    tab === "All" ? loans : loans.filter((l) => l.status === tab);

  function updateLoan(id: number, status: "Approved" | "Rejected") {
    setLoans((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    toast.success(`Loan ${status.toLowerCase()} successfully`);
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-display font-bold text-bank-navy">
          Loan Applications
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Review and manage all loan requests.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          {["All", "Pending", "Approved", "Rejected"].map((t) => (
            <TabsTrigger
              key={t}
              value={t}
              data-ocid={`admin.loans.${t.toLowerCase()}.tab`}
            >
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-bank-navy/5">
              <TableHead>Applicant</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((l, i) => (
              <TableRow
                key={l.id}
                data-ocid={
                  `admin.loans.item.${i + 1}` as `admin.loans.item.${1}`
                }
              >
                <TableCell className="font-medium text-sm">{l.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {l.type}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-sm">
                  {l.amount}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {l.purpose}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {l.date}
                </TableCell>
                <TableCell>
                  <StatusBadge status={l.status} />
                </TableCell>
                <TableCell>
                  {l.status === "Pending" ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => updateLoan(l.id, "Approved")}
                        data-ocid={
                          `admin.loans.approve_button.${i + 1}` as `admin.loans.approve_button.${1}`
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => updateLoan(l.id, "Rejected")}
                        data-ocid={
                          `admin.loans.reject_button.${i + 1}` as `admin.loans.reject_button.${1}`
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function KYCVerification() {
  const [kycItems, setKycItems] = useState(mockKYC);
  const [selected, setSelected] = useState<(typeof mockKYC)[0] | null>(null);

  function updateKYC(id: number, status: "Approved" | "Rejected") {
    setKycItems((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status } : k)),
    );
    setSelected(null);
    toast.success(`KYC ${status.toLowerCase()}`);
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-display font-bold text-bank-navy">
          KYC Verification Requests
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Review and verify customer identity documents.
        </p>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-bank-navy/5">
              <TableHead>Applicant</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>ID Type</TableHead>
              <TableHead>Gov ID</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {kycItems.map((k, i) => (
              <TableRow
                key={k.id}
                data-ocid={`admin.kyc.item.${i + 1}` as `admin.kyc.item.${1}`}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Initials name={k.name} />
                    <span className="font-medium text-sm">{k.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{k.country}</TableCell>
                <TableCell className="text-sm">{k.idType}</TableCell>
                <TableCell className="text-sm font-mono">{k.govId}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {k.date}
                </TableCell>
                <TableCell>
                  <StatusBadge status={k.status} />
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelected(k)}
                    data-ocid={
                      `admin.kyc.view_button.${i + 1}` as `admin.kyc.view_button.${1}`
                    }
                  >
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={() => setSelected(null)}
          />
          <div className="w-96 bg-white shadow-2xl border-l border-border overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-semibold text-bank-navy">KYC Review</h3>
              <button type="button" onClick={() => setSelected(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Initials name={selected.name} />
                <div>
                  <p className="font-semibold">{selected.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selected.country}
                  </p>
                </div>
              </div>
              {(
                [
                  ["ID Type", selected.idType],
                  ["Government ID", selected.govId],
                  ["Submitted", selected.date],
                  ["Current Status", selected.status],
                ] as [string, string][]
              ).map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm text-muted-foreground">{k}</span>
                  <span className="text-sm font-medium">{v}</span>
                </div>
              ))}
              <div className="space-y-2 pt-2">
                <p className="text-sm font-medium text-bank-navy">Documents</p>
                <div className="flex items-center gap-2 p-3 bg-bank-navy/5 rounded-lg">
                  <FileText className="h-4 w-4 text-bank-navy" />
                  <span className="text-sm">{selected.idType} Photo</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    Uploaded
                  </Badge>
                </div>
              </div>
              {selected.status === "Pending" && (
                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => updateKYC(selected.id, "Approved")}
                    data-ocid="admin.kyc.approve_button"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => updateKYC(selected.id, "Rejected")}
                    data-ocid="admin.kyc.reject_button"
                  >
                    <XCircle className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ContactRequests() {
  const [tab, setTab] = useState("All");
  const [contacts, setContacts] = useState(mockContacts);
  const [selected, setSelected] = useState<(typeof mockContacts)[0] | null>(
    null,
  );

  const filtered =
    tab === "All"
      ? contacts
      : tab === "Contact Forms"
        ? contacts.filter((c) => c.type === "Contact Form")
        : contacts.filter((c) => c.type === "Advisory");

  function markResolved(id: number) {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Resolved" } : c)),
    );
    toast.success("Marked as resolved");
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-display font-bold text-bank-navy">
          Contact & Advisory Requests
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Manage all customer inquiries and advisory bookings.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          {["All", "Contact Forms", "Advisory Bookings"].map((t) => (
            <TabsTrigger
              key={t}
              value={t}
              data-ocid={`admin.contacts.${t.toLowerCase().replace(/ /g, "_")}.tab`}
            >
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-bank-navy/5">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c, i) => (
              <TableRow
                key={c.id}
                data-ocid={
                  `admin.contacts.item.${i + 1}` as `admin.contacts.item.${1}`
                }
              >
                <TableCell className="font-medium text-sm">{c.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {c.email}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {c.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{c.subject}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {c.date}
                </TableCell>
                <TableCell>
                  <StatusBadge status={c.status} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelected(c)}
                      data-ocid={
                        `admin.contacts.view_button.${i + 1}` as `admin.contacts.view_button.${1}`
                      }
                    >
                      View
                    </Button>
                    {c.status !== "Resolved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        onClick={() => markResolved(c.id)}
                        data-ocid={
                          `admin.contacts.confirm_button.${i + 1}` as `admin.contacts.confirm_button.${1}`
                        }
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={() => setSelected(null)}
          />
          <div className="w-80 bg-white shadow-2xl border-l border-border overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-semibold text-bank-navy">Request Details</h3>
              <button type="button" onClick={() => setSelected(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {(
                [
                  ["Name", selected.name],
                  ["Email", selected.email],
                  ["Type", selected.type],
                  ["Subject", selected.subject],
                  ["Date", selected.date],
                  ["Status", selected.status],
                ] as [string, string][]
              ).map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm text-muted-foreground">{k}</span>
                  <span className="text-sm font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TransactionMonitor() {
  const [typeFilter, setTypeFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = mockTransactions.filter(
    (t) => typeFilter === "All" || t.type === typeFilter,
  );
  const completed = filtered.filter((t) => t.status === "Completed").length;
  const failed = filtered.filter((t) => t.status === "Failed").length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-display font-bold text-bank-navy">
          Transaction Monitor
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor all banking transactions in real time.
        </p>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Volume", value: "$1.2M", color: "text-bank-navy" },
          {
            label: "Completed",
            value: `${Math.round((completed / filtered.length) * 100)}%`,
            color: "text-emerald-600",
          },
          {
            label: "Failed",
            value: `${Math.round((failed / filtered.length) * 100)}%`,
            color: "text-red-600",
          },
        ].map((s) => (
          <Card key={s.label} className="border border-border">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground">From</Label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-40"
            data-ocid="admin.transactions.search_input"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground">To</Label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-40"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44" data-ocid="admin.transactions.select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["All", "Deposit", "Withdrawal", "Transfer", "Loan Payment"].map(
              (t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-bank-navy/5">
              <TableHead>Transaction ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((t, i) => (
              <TableRow
                key={t.id}
                data-ocid={
                  `admin.transactions.item.${i + 1}` as `admin.transactions.item.${1}`
                }
              >
                <TableCell className="text-sm font-mono text-muted-foreground">
                  {t.id}
                </TableCell>
                <TableCell className="text-sm font-medium">{t.user}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {t.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-semibold">
                  {t.amount}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {t.date}
                </TableCell>
                <TableCell>
                  <StatusBadge status={t.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function AccountRequests() {
  const [requests, setRequests] = useState(mockAccountRequests);

  function updateRequest(id: number, status: "Approved" | "Rejected") {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );
    toast.success(`Account request ${status.toLowerCase()}`);
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-display font-bold text-bank-navy">
          Account Opening Requests
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Review new account applications from prospective customers.
        </p>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-bank-navy/5">
              <TableHead>Applicant</TableHead>
              <TableHead>Account Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((r, i) => (
              <TableRow
                key={r.id}
                data-ocid={
                  `admin.accounts.item.${i + 1}` as `admin.accounts.item.${1}`
                }
              >
                <TableCell className="font-medium text-sm">{r.name}</TableCell>
                <TableCell className="text-sm">{r.type}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {r.date}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {r.documents}
                </TableCell>
                <TableCell>
                  <StatusBadge status={r.status} />
                </TableCell>
                <TableCell>
                  {r.status === "Pending" ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => updateRequest(r.id, "Approved")}
                        data-ocid={
                          `admin.accounts.approve_button.${i + 1}` as `admin.accounts.approve_button.${1}`
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => updateRequest(r.id, "Rejected")}
                        data-ocid={
                          `admin.accounts.reject_button.${i + 1}` as `admin.accounts.reject_button.${1}`
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SiteVisitors() {
  const maxVisits = Math.max(...dailyVisits.map((d) => d.visits));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-bank-navy">
          Site Visitors
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Track traffic and engagement across TRUPTAR Bank website.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Visits", value: "342", icon: TrendingUp },
          { label: "This Week", value: "2,104", icon: BarChart3 },
          { label: "This Month", value: "8,729", icon: Globe },
          { label: "Bounce Rate", value: "34%", icon: Activity },
        ].map((s) => (
          <Card key={s.label} className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className="h-4 w-4 text-bank-navy/60" />
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
              <p className="text-2xl font-bold text-bank-navy">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bar chart */}
      <Card className="border border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-bank-navy">
            Daily Visits — Last 7 Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 h-40">
            {dailyVisits.map((d) => (
              <div
                key={d.day}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <span className="text-xs text-muted-foreground">
                  {d.visits}
                </span>
                <div
                  className="w-full bg-bank-navy/80 rounded-t-sm transition-all"
                  style={{ height: `${(d.visits / maxVisits) * 120}px` }}
                />
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Pages */}
      <Card className="border border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-bank-navy">
            Top Pages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-bank-navy/5">
                  <TableHead>Page</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Avg Time</TableHead>
                  <TableHead>Bounce Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPages.map((p, i) => (
                  <TableRow
                    key={p.page}
                    data-ocid={
                      `admin.visitors.item.${i + 1}` as `admin.visitors.item.${1}`
                    }
                  >
                    <TableCell className="text-sm font-mono">
                      {p.page}
                    </TableCell>
                    <TableCell className="text-sm font-semibold">
                      {p.views.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {p.avgTime}
                    </TableCell>
                    <TableCell className="text-sm">{p.bounce}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Visitor Log */}
      <Card className="border border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-bank-navy">
            Recent Visitor Log
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-bank-navy/5">
                <TableHead>Timestamp</TableHead>
                <TableHead>Page</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitorLog.map((v, i) => (
                <TableRow
                  key={v.time}
                  data-ocid={
                    `admin.visitors.row.${i + 1}` as `admin.visitors.row.${1}`
                  }
                >
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {v.time}
                  </TableCell>
                  <TableCell className="text-xs font-mono">{v.page}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {v.device}
                  </TableCell>
                  <TableCell className="text-xs">{v.country}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {v.ip}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function SystemSettings() {
  const [toggles, setToggles] = useState({
    maintenance: false,
    registrations: true,
    loanApplications: true,
    require2FA: false,
    emailNotifications: true,
  });

  function toggle(key: keyof typeof toggles) {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success("Setting updated");
  }

  const settingsConfig = [
    {
      key: "maintenance" as const,
      label: "Maintenance Mode",
      desc: "Take the site offline for scheduled maintenance",
    },
    {
      key: "registrations" as const,
      label: "New User Registrations Open",
      desc: "Allow new customers to create accounts",
    },
    {
      key: "loanApplications" as const,
      label: "Loan Applications Accepting",
      desc: "Accept new loan applications from customers",
    },
    {
      key: "require2FA" as const,
      label: "Require 2FA for All Users",
      desc: "Force all users to enable two-factor authentication",
    },
    {
      key: "emailNotifications" as const,
      label: "Email Notifications Active",
      desc: "Send email alerts and notifications to customers",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-bank-navy">
          System Settings
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Configure system-wide settings and admin controls.
        </p>
      </div>

      {/* Toggles */}
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-bank-navy">
            Platform Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {settingsConfig.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
              </div>
              <Switch
                checked={toggles[s.key]}
                onCheckedChange={() => toggle(s.key)}
                data-ocid={`admin.settings.${s.key}.switch`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Admin Info */}
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-bank-navy">
            Admin Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            ["Admin Name", "TRUPTAR Admin"],
            ["Email", "ikehsopuruchukwu@gmail.com"],
            ["Last Login", "Mar 5, 2026 — 09:14 AM"],
            ["Role", "Super Administrator"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between py-2 border-b border-border last:border-0"
            >
              <span className="text-sm text-muted-foreground">{k}</span>
              <span className="text-sm font-medium">{v}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border border-red-200 bg-red-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            These actions are irreversible. Proceed with caution.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-100"
              onClick={() => toast.success("Cache cleared successfully")}
              data-ocid="admin.settings.delete_button"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Clear Cache
            </Button>
            <Button
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-100"
              onClick={() => toast.success("Audit log download started")}
              data-ocid="admin.settings.secondary_button"
            >
              <Download className="h-4 w-4 mr-2" /> Download Audit Log
            </Button>
            <Button
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-100"
              onClick={() =>
                toast.success("Announcement broadcast sent to all users")
              }
              data-ocid="admin.settings.primary_button"
            >
              <Bell className="h-4 w-4 mr-2" /> Broadcast Announcement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────

const navItems: { section: Section; label: string; icon: React.ElementType }[] =
  [
    { section: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { section: "users", label: "User Management", icon: Users },
    { section: "loans", label: "Loan Applications", icon: CreditCard },
    { section: "kyc", label: "KYC Verification", icon: UserCheck },
    { section: "contacts", label: "Contact & Advisory", icon: MessageSquare },
    { section: "transactions", label: "Transactions", icon: Activity },
    { section: "accounts", label: "Account Requests", icon: FileText },
    { section: "visitors", label: "Site Visitors", icon: Globe },
    { section: "settings", label: "System Settings", icon: Settings },
  ];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [section, setSection] = useState<Section>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-bank-navy flex flex-col z-40 transition-transform duration-300
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
          <Building2 className="h-7 w-7 text-bank-gold shrink-0" />
          <div>
            <p className="font-display text-white font-bold text-sm leading-tight">
              TRUPTAR Bank
            </p>
            <p className="text-white/50 text-xs">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.section}
              type="button"
              onClick={() => {
                setSection(item.section);
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors
                ${
                  section === item.section
                    ? "bg-white/15 text-white border-r-2 border-bank-gold"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              data-ocid={`admin.nav.${item.section}.link`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-white/30 text-xs">Admin Panel v1.0</p>
          <p className="text-white/20 text-xs mt-0.5">
            TRUPTAR Bank © {new Date().getFullYear()}
          </p>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-border px-6 py-4 flex items-center gap-4">
          <button
            type="button"
            className="lg:hidden p-1 rounded text-muted-foreground hover:text-foreground"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <LayoutDashboard className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-bank-navy">
              {navItems.find((n) => n.section === section)?.label ?? "Admin"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-bank-navy text-white text-xs font-bold flex items-center justify-center">
              AD
            </div>
            <span className="text-sm font-medium text-foreground hidden sm:block">
              Admin
            </span>
          </div>
        </header>

        {/* Section content */}
        <main className="flex-1 p-6 overflow-auto">
          {section === "dashboard" && (
            <DashboardOverview setSection={setSection} />
          )}
          {section === "users" && <UserManagement />}
          {section === "loans" && <LoanApplications />}
          {section === "kyc" && <KYCVerification />}
          {section === "contacts" && <ContactRequests />}
          {section === "transactions" && <TransactionMonitor />}
          {section === "accounts" && <AccountRequests />}
          {section === "visitors" && <SiteVisitors />}
          {section === "settings" && <SystemSettings />}
        </main>
      </div>
    </div>
  );
}
