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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { AdminUserRecord, PendingRequest } from "../backend.d";
import { useActor } from "../hooks/useActor";

type Section =
  | "dashboard"
  | "registered_users"
  | "transaction_requests"
  | "users"
  | "loans"
  | "kyc"
  | "contacts"
  | "transactions"
  | "accounts"
  | "visitors"
  | "settings";

// ─── Mock Data ───────────────────────────────────────────────────────────────

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

// ─── Registered Users ────────────────────────────────────────────────────────

function RegisteredUsers() {
  const { actor } = useActor();
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await (actor as any).adminGetAllUsers();
      setUsers(result);
    } catch {
      toast.error("Failed to load registered users.");
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: load on mount
  useEffect(() => {
    if (actor) void loadUsers();
  }, [actor]);

  const formatPrincipal = (p: { toString(): string }) => {
    const s = p.toString();
    return `${s.slice(0, 10)}...${s.slice(-6)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-bank-navy">
            Registered Users
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            All users who have signed up on TRUPTAR Bank
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadUsers}
          className="gap-2"
          data-ocid="admin.registered_users.secondary_button"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <Card data-ocid="admin.registered_users.card">
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div
              className="p-8 text-center text-muted-foreground"
              data-ocid="admin.registered_users.loading_state"
            >
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div
              className="p-8 text-center text-muted-foreground"
              data-ocid="admin.registered_users.empty_state"
            >
              No users have registered yet.
            </div>
          ) : (
            <Table data-ocid="admin.registered_users.table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-bank-navy font-semibold text-xs">
                    #
                  </TableHead>
                  <TableHead className="text-bank-navy font-semibold text-xs">
                    Principal
                  </TableHead>
                  <TableHead className="text-bank-navy font-semibold text-xs">
                    Account Number
                  </TableHead>
                  <TableHead className="text-bank-navy font-semibold text-xs text-right">
                    Balance
                  </TableHead>
                  <TableHead className="text-bank-navy font-semibold text-xs">
                    Full Name
                  </TableHead>
                  <TableHead className="text-bank-navy font-semibold text-xs">
                    Email
                  </TableHead>
                  <TableHead className="text-bank-navy font-semibold text-xs">
                    KYC Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u, i) => (
                  <TableRow
                    key={u.accountNumber}
                    data-ocid={`admin.registered_users.row.${i + 1}`}
                  >
                    <TableCell className="text-xs text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {formatPrincipal(u.principal)}
                    </TableCell>
                    <TableCell className="font-mono text-sm font-semibold text-bank-navy">
                      {u.accountNumber}
                    </TableCell>
                    <TableCell className="text-sm font-bold text-right text-bank-gold">
                      $
                      {u.balance.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-sm">
                      {u.profile?.personalInfo?.fullName || (
                        <span className="text-muted-foreground italic text-xs">
                          No profile yet
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {u.profile?.contactInfo?.email || (
                        <span className="italic text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {u.profile?.kycData?.kycStatus ? (
                        <Badge
                          className={`text-xs ${
                            u.profile.kycData.kycStatus === "approved"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : u.profile.kycData.kycStatus === "pending"
                                ? "bg-amber-100 text-amber-700 border-amber-200"
                                : "bg-red-100 text-red-700 border-red-200"
                          }`}
                        >
                          {u.profile.kycData.kycStatus.charAt(0).toUpperCase() +
                            u.profile.kycData.kycStatus.slice(1)}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Not submitted
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Transaction Requests ─────────────────────────────────────────────────────

function TransactionRequests() {
  const { actor } = useActor();
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const loadRequests = async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await (actor as any).adminGetPendingRequests();
      setRequests(result);
    } catch {
      toast.error("Failed to load transaction requests.");
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: load on mount
  useEffect(() => {
    if (actor) void loadRequests();
  }, [actor]);

  const handleConfirm = async (requestId: string, approve: boolean) => {
    if (!actor) return;
    setProcessing(requestId);
    try {
      await (actor as any).adminConfirmRequest(requestId, approve);
      toast.success(
        approve
          ? "Request approved and applied to account."
          : "Request rejected.",
      );
      await loadRequests();
    } catch {
      toast.error("Action failed. Please try again.");
    } finally {
      setProcessing(null);
    }
  };

  const formatPrincipal = (p: { toString(): string }) => {
    const s = p.toString();
    return `${s.slice(0, 10)}...${s.slice(-6)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-bank-navy">
            Transaction Requests
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Approve or reject all deposit and withdrawal requests
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadRequests}
          className="gap-2"
          data-ocid="admin.transaction_requests.secondary_button"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <Badge
            key={f}
            variant="outline"
            className="capitalize cursor-default"
          >
            {f === "all"
              ? `All (${requests.length})`
              : `${f} (${requests.filter((r) => r.status.__kind__ === f).length})`}
          </Badge>
        ))}
      </div>

      <Card data-ocid="admin.transaction_requests.card">
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div
              className="p-8 text-center text-muted-foreground"
              data-ocid="admin.transaction_requests.loading_state"
            >
              Loading requests...
            </div>
          ) : requests.length === 0 ? (
            <div
              className="p-8 text-center text-muted-foreground"
              data-ocid="admin.transaction_requests.empty_state"
            >
              No transaction requests yet.
            </div>
          ) : (
            <Table data-ocid="admin.transaction_requests.table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-bank-navy font-semibold text-xs">
                    Request ID
                  </TableHead>
                  <TableHead className="text-bank-navy font-semibold text-xs">
                    User
                  </TableHead>
                  <TableHead className="text-bank-navy font-semibold text-xs">
                    Type
                  </TableHead>
                  <TableHead className="text-bank-navy font-semibold text-xs text-right">
                    Amount
                  </TableHead>
                  <TableHead className="text-bank-navy font-semibold text-xs">
                    Description
                  </TableHead>
                  <TableHead className="text-bank-navy font-semibold text-xs">
                    Date
                  </TableHead>
                  <TableHead className="text-bank-navy font-semibold text-xs">
                    Status
                  </TableHead>
                  <TableHead className="text-bank-navy font-semibold text-xs">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req, i) => (
                  <TableRow
                    key={req.requestId}
                    data-ocid={`admin.transaction_requests.row.${i + 1}`}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {req.requestId.slice(0, 12)}...
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {formatPrincipal(req.owner)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-xs ${req.requestType.__kind__ === "deposit" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-blue-100 text-blue-700 border-blue-200"}`}
                      >
                        {req.requestType.__kind__ === "deposit"
                          ? "Deposit"
                          : "Withdrawal"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-bold text-right text-bank-gold">
                      $
                      {req.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[140px] truncate">
                      {req.description}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {req.date}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-xs ${
                          req.status.__kind__ === "pending"
                            ? "bg-amber-100 text-amber-700 border-amber-200"
                            : req.status.__kind__ === "approved"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : "bg-red-100 text-red-700 border-red-200"
                        }`}
                      >
                        {req.status.__kind__ === "pending"
                          ? "Pending"
                          : req.status.__kind__ === "approved"
                            ? "Approved"
                            : "Rejected"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {req.status.__kind__ === "pending" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                            disabled={processing === req.requestId}
                            onClick={() => handleConfirm(req.requestId, true)}
                            data-ocid={`admin.transaction_requests.confirm_button.${i + 1}`}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {processing === req.requestId ? "..." : "Approve"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-red-200 text-red-700 hover:bg-red-50"
                            disabled={processing === req.requestId}
                            onClick={() => handleConfirm(req.requestId, false)}
                            data-ocid={`admin.transaction_requests.delete_button.${i + 1}`}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Processed
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function DashboardOverview({
  setSection,
}: { setSection: (s: Section) => void }) {
  const { actor } = useActor();
  const [allUsers, setAllUsers] = useState<AdminUserRecord[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    setLoading(true);
    Promise.all([
      (actor as any).adminGetAllUsers() as Promise<AdminUserRecord[]>,
      (actor as any).adminGetPendingRequests() as Promise<PendingRequest[]>,
    ])
      .then(([users, requests]) => {
        setAllUsers(users);
        setPendingRequests(requests);
      })
      .catch(() => toast.error("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, [actor]);

  const today = new Date().toISOString().slice(0, 10);
  const totalUsers = allUsers.length;
  const pendingCount = pendingRequests.filter(
    (r) => r.status.__kind__ === "pending",
  ).length;
  const activeAccounts = allUsers.filter((u) => u.balance > 0).length;
  const transactionsToday = pendingRequests.filter((r) =>
    r.date.startsWith(today),
  ).length;

  const kpis = [
    {
      label: "Total Users",
      value: loading ? "—" : totalUsers.toLocaleString(),
      icon: Users,
      trend: "Registered accounts",
      color: "text-bank-navy",
    },
    {
      label: "Pending Requests",
      value: loading ? "—" : pendingCount.toLocaleString(),
      icon: AlertTriangle,
      trend: "Needs attention",
      color: "text-amber-600",
    },
    {
      label: "Active Accounts",
      value: loading ? "—" : activeAccounts.toLocaleString(),
      trend:
        totalUsers > 0
          ? `${Math.round((activeAccounts / totalUsers) * 100)}% of users`
          : "—",
      icon: CheckCircle,
      color: "text-emerald-600",
    },
    {
      label: "Transactions Today",
      value: loading ? "—" : transactionsToday.toLocaleString(),
      icon: Activity,
      trend: "Requests submitted today",
      color: "text-blue-600",
    },
  ];

  const recentActivity = [...pendingRequests]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-bank-navy">
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back, Admin. Here&apos;s what&apos;s happening on TRUPTAR
          Bank.
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
            {loading ? (
              <p
                className="text-sm text-muted-foreground py-4 text-center"
                data-ocid="admin.activity.loading_state"
              >
                Loading activity...
              </p>
            ) : recentActivity.length === 0 ? (
              <p
                className="text-sm text-muted-foreground py-8 text-center"
                data-ocid="admin.activity.empty_state"
              >
                No activity yet. Transactions will appear here once customers
                make requests.
              </p>
            ) : (
              recentActivity.map((req, i) => (
                <div
                  key={req.requestId}
                  className="flex items-start gap-3 py-2 border-b border-border last:border-0"
                  data-ocid={
                    `admin.activity.item.${i + 1}` as `admin.activity.item.${1}`
                  }
                >
                  <div className="w-6 h-6 rounded-full bg-bank-navy/5 flex items-center justify-center mt-0.5 shrink-0">
                    <Activity className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-snug">
                      {req.requestType.__kind__ === "deposit"
                        ? "Deposit"
                        : "Withdrawal"}{" "}
                      request of $
                      {req.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      — {req.description || "No description"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {req.date}
                    </p>
                  </div>
                  <Badge
                    className={`text-xs shrink-0 ${
                      req.status.__kind__ === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : req.status.__kind__ === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {req.status.__kind__}
                  </Badge>
                </div>
              ))
            )}
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
                label: "Transaction Requests",
                section: "transaction_requests" as Section,
                icon: Activity,
              },
              {
                label: "Registered Users",
                section: "registered_users" as Section,
                icon: Users,
              },
              {
                label: "KYC Verification",
                section: "kyc" as Section,
                icon: UserCheck,
              },
              {
                label: "Loan Applications",
                section: "loans" as Section,
                icon: CreditCard,
              },
              {
                label: "Contact Requests",
                section: "contacts" as Section,
                icon: MessageSquare,
              },
              {
                label: "System Settings",
                section: "settings" as Section,
                icon: Settings,
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
  const { actor } = useActor();
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    if (!actor) return;
    setLoading(true);
    (actor as any)
      .adminGetAllUsers()
      .then((result: AdminUserRecord[]) => setUsers(result))
      .catch(() => toast.error("Failed to load users."))
      .finally(() => setLoading(false));
  }, [actor]);

  const filtered = users.filter((u) => {
    const name = u.profile?.personalInfo?.fullName?.toLowerCase() || "";
    return (
      name.includes(search.toLowerCase()) ||
      u.accountNumber.includes(search) ||
      u.principal.toString().includes(search)
    );
  });

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const formatPrincipal = (p: { toString(): string }) => {
    const s = p.toString();
    return `${s.slice(0, 10)}...${s.slice(-6)}`;
  };

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
          placeholder="Search by name, account, or principal..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
          data-ocid="admin.users.search_input"
        />
      </div>

      {loading ? (
        <div
          className="p-8 text-center text-muted-foreground"
          data-ocid="admin.users.loading_state"
        >
          Loading users...
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="p-8 text-center text-muted-foreground"
          data-ocid="admin.users.empty_state"
        >
          {users.length === 0
            ? "No users have registered yet."
            : "No users match your search."}
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-bank-navy/5">
                  <TableHead>#</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Account #</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>KYC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((u, i) => (
                  <TableRow
                    key={u.accountNumber}
                    data-ocid={
                      `admin.users.item.${i + 1}` as `admin.users.item.${1}`
                    }
                  >
                    <TableCell className="text-xs text-muted-foreground">
                      {(page - 1) * perPage + i + 1}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {formatPrincipal(u.principal)}
                    </TableCell>
                    <TableCell className="font-mono text-sm font-semibold text-bank-navy">
                      {u.accountNumber}
                    </TableCell>
                    <TableCell className="text-sm">
                      {u.profile?.personalInfo?.fullName || (
                        <span className="text-muted-foreground italic text-xs">
                          No profile
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {u.profile?.contactInfo?.email || (
                        <span className="italic text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm font-bold text-right text-bank-gold">
                      $
                      {u.balance.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
                      {u.profile?.kycData?.kycStatus ? (
                        <StatusBadge
                          status={
                            u.profile.kycData.kycStatus
                              .charAt(0)
                              .toUpperCase() +
                            u.profile.kycData.kycStatus.slice(1)
                          }
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Not submitted
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

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
        </>
      )}
    </div>
  );
}

function LoanApplications() {
  const { actor } = useActor();
  const [loans, setLoans] = useState<
    { fullName: string; email: string; loanType: string; amount: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");

  useEffect(() => {
    if (!actor) return;
    setLoading(true);
    (actor as any)
      .getLoanApplications()
      .then(
        (
          result: {
            fullName: string;
            email: string;
            loanType: string;
            amount: number;
          }[],
        ) => setLoans(result),
      )
      .catch(() => toast.error("Failed to load loan applications."))
      .finally(() => setLoading(false));
  }, [actor]);

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
          {["All"].map((t) => (
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

      {loading ? (
        <div
          className="p-8 text-center text-muted-foreground"
          data-ocid="admin.loans.loading_state"
        >
          Loading loan applications...
        </div>
      ) : loans.length === 0 ? (
        <div
          className="p-8 text-center text-muted-foreground"
          data-ocid="admin.loans.empty_state"
        >
          No loan applications have been submitted yet.
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-bank-navy/5">
                <TableHead>#</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Loan Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((l, i) => (
                <TableRow
                  key={`${l.email}-${l.loanType}`}
                  data-ocid={
                    `admin.loans.item.${i + 1}` as `admin.loans.item.${1}`
                  }
                >
                  <TableCell className="text-xs text-muted-foreground">
                    {i + 1}
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {l.fullName}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {l.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {l.loanType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-right text-bank-gold">
                    $
                    {l.amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function KYCVerification() {
  const { actor } = useActor();
  const [kycUsers, setKycUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    setLoading(true);
    (actor as any)
      .adminGetAllUsers()
      .then((result: AdminUserRecord[]) => {
        const withKyc = result.filter(
          (u) =>
            u.profile?.kycData?.kycStatus &&
            u.profile.kycData.kycStatus !== "form",
        );
        setKycUsers(withKyc);
      })
      .catch(() => toast.error("Failed to load KYC data."))
      .finally(() => setLoading(false));
  }, [actor]);

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

      {loading ? (
        <div
          className="p-8 text-center text-muted-foreground"
          data-ocid="admin.kyc.loading_state"
        >
          Loading KYC submissions...
        </div>
      ) : kycUsers.length === 0 ? (
        <div
          className="p-8 text-center text-muted-foreground"
          data-ocid="admin.kyc.empty_state"
        >
          No KYC submissions have been made yet.
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-bank-navy/5">
                <TableHead>#</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Account #</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>ID Type</TableHead>
                <TableHead>KYC Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kycUsers.map((u, i) => (
                <TableRow
                  key={u.accountNumber}
                  data-ocid={`admin.kyc.item.${i + 1}` as `admin.kyc.item.${1}`}
                >
                  <TableCell className="text-xs text-muted-foreground">
                    {i + 1}
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {u.profile?.personalInfo?.fullName || (
                      <span className="italic text-muted-foreground text-xs">
                        No name
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {u.accountNumber}
                  </TableCell>
                  <TableCell className="text-sm">
                    {u.profile?.kycData?.country || "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {u.profile?.kycData?.idType || "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={
                        (u.profile?.kycData?.kycStatus || "")
                          .charAt(0)
                          .toUpperCase() +
                        (u.profile?.kycData?.kycStatus || "").slice(1)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function ContactRequests() {
  const { actor } = useActor();
  const [contacts, setContacts] = useState<
    { name: string; email: string; message: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    setLoading(true);
    (actor as any)
      .getContactForms()
      .then((result: { name: string; email: string; message: string }[]) =>
        setContacts(result),
      )
      .catch(() => toast.error("Failed to load contact forms."))
      .finally(() => setLoading(false));
  }, [actor]);

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

      {loading ? (
        <div
          className="p-8 text-center text-muted-foreground"
          data-ocid="admin.contacts.loading_state"
        >
          Loading contact requests...
        </div>
      ) : contacts.length === 0 ? (
        <div
          className="p-8 text-center text-muted-foreground"
          data-ocid="admin.contacts.empty_state"
        >
          No contact forms have been submitted yet.
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-bank-navy/5">
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((c, i) => (
                <TableRow
                  key={`${c.email}-${c.name}`}
                  data-ocid={
                    `admin.contacts.item.${i + 1}` as `admin.contacts.item.${1}`
                  }
                >
                  <TableCell className="text-xs text-muted-foreground">
                    {i + 1}
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {c.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {c.email}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                    {c.message}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function TransactionMonitor() {
  const { actor } = useActor();
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    if (!actor) return;
    setLoading(true);
    (actor as any)
      .adminGetPendingRequests()
      .then((result: PendingRequest[]) => setRequests(result))
      .catch(() => toast.error("Failed to load transactions."))
      .finally(() => setLoading(false));
  }, [actor]);

  const filtered = requests.filter(
    (r) =>
      typeFilter === "All" ||
      r.requestType.__kind__ === typeFilter.toLowerCase(),
  );

  const formatPrincipal = (p: { toString(): string }) => {
    const s = p.toString();
    return `${s.slice(0, 10)}...${s.slice(-6)}`;
  };

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

      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Requests",
            value: loading ? "—" : requests.length.toString(),
            color: "text-bank-navy",
          },
          {
            label: "Pending",
            value: loading
              ? "—"
              : requests
                  .filter((r) => r.status.__kind__ === "pending")
                  .length.toString(),
            color: "text-amber-600",
          },
          {
            label: "Approved",
            value: loading
              ? "—"
              : requests
                  .filter((r) => r.status.__kind__ === "approved")
                  .length.toString(),
            color: "text-emerald-600",
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

      <div className="flex gap-3">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44" data-ocid="admin.transactions.select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["All", "Deposit", "Withdrawal"].map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div
          className="p-8 text-center text-muted-foreground"
          data-ocid="admin.transactions.loading_state"
        >
          Loading transactions...
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="p-8 text-center text-muted-foreground"
          data-ocid="admin.transactions.empty_state"
        >
          No transactions found.
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-bank-navy/5">
                <TableHead>Request ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t, i) => (
                <TableRow
                  key={t.requestId}
                  data-ocid={
                    `admin.transactions.item.${i + 1}` as `admin.transactions.item.${1}`
                  }
                >
                  <TableCell className="text-sm font-mono text-muted-foreground">
                    {t.requestId.slice(0, 12)}...
                  </TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">
                    {formatPrincipal(t.owner)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {t.requestType.__kind__ === "deposit"
                        ? "Deposit"
                        : "Withdrawal"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-right text-bank-gold">
                    $
                    {t.amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[140px] truncate">
                    {t.description}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {t.date}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={
                        t.status.__kind__.charAt(0).toUpperCase() +
                        t.status.__kind__.slice(1)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function AccountRequests() {
  const { actor } = useActor();
  const [requests, setRequests] = useState<
    { fullName: string; email: string; accountType: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    setLoading(true);
    (actor as any)
      .getAccountApplications()
      .then(
        (result: { fullName: string; email: string; accountType: string }[]) =>
          setRequests(result),
      )
      .catch(() => toast.error("Failed to load account applications."))
      .finally(() => setLoading(false));
  }, [actor]);

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

      {loading ? (
        <div
          className="p-8 text-center text-muted-foreground"
          data-ocid="admin.accounts.loading_state"
        >
          Loading account requests...
        </div>
      ) : requests.length === 0 ? (
        <div
          className="p-8 text-center text-muted-foreground"
          data-ocid="admin.accounts.empty_state"
        >
          No account opening requests have been submitted.
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-bank-navy/5">
                <TableHead>#</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Account Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r, i) => (
                <TableRow
                  key={`${r.email}-${r.accountType}`}
                  data-ocid={
                    `admin.accounts.item.${i + 1}` as `admin.accounts.item.${1}`
                  }
                >
                  <TableCell className="text-xs text-muted-foreground">
                    {i + 1}
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {r.fullName}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {r.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs capitalize">
                      {r.accountType}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function SiteVisitors() {
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Visits", value: "0", icon: TrendingUp },
          { label: "This Week", value: "0", icon: BarChart3 },
          { label: "This Month", value: "0", icon: Globe },
          { label: "Total Visitors", value: "0", icon: Activity },
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

      <Card
        className="border border-border"
        data-ocid="admin.visitors.empty_state"
      >
        <CardContent className="p-12 text-center">
          <Globe className="h-12 w-12 text-bank-navy/20 mx-auto mb-4" />
          <h3 className="font-semibold text-bank-navy mb-2">
            Visitor Tracking Not Yet Configured
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Visitor tracking is not yet configured. No visitor data has been
            collected since the site launched. Analytics will appear here once a
            visitor tracking service is integrated.
          </p>
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
    { section: "registered_users", label: "Registered Users", icon: Users },
    {
      section: "transaction_requests",
      label: "Transaction Requests",
      icon: Activity,
    },
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
          {section === "registered_users" && <RegisteredUsers />}
          {section === "transaction_requests" && <TransactionRequests />}
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
