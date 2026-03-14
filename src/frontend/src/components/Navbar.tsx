import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Building2,
  Loader2,
  Menu,
  Shield,
  ShieldCheck,
  User,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/community", label: "Community" },
  { to: "/contact", label: "Contact" },
];

function LoginDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();

  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  useEffect(() => {
    if (isLoggedIn && open) {
      onOpenChange(false);
      void navigate({ to: "/dashboard" });
    }
  }, [isLoggedIn, open, onOpenChange, navigate]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-sm border-border bg-white"
        data-ocid="nav.login.dialog"
      >
        <DialogHeader className="items-center text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-2"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.22 0.08 265), oklch(0.30 0.12 255))",
            }}
          >
            <Building2 className="h-7 w-7 text-bank-gold" />
          </div>
          <DialogTitle className="font-display text-2xl text-foreground">
            Online Banking Login
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            Sign in to access your TRUPTAR Bank account
          </p>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="bg-secondary rounded-xl p-4 flex items-start gap-3">
            <Shield className="h-5 w-5 text-bank-cyan mt-0.5 shrink-0" />
            <p className="text-sm text-foreground/80">
              TRUPTAR Bank uses Internet Identity for secure, password-free
              authentication powered by cryptographic keys.
            </p>
          </div>

          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full font-semibold"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.22 0.08 265), oklch(0.30 0.12 255))",
              color: "white",
            }}
            data-ocid="nav.login.submit.button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Sign In with Internet Identity"
            )}
          </Button>

          <Button
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground"
            onClick={() => onOpenChange(false)}
            data-ocid="nav.login.close.button"
          >
            Cancel
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Your credentials are never shared with TRUPTAR Bank. Secured by the
            Internet Computer.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  function handleBankingClick() {
    if (isLoggedIn) {
      void navigate({ to: "/dashboard" });
    } else {
      setLoginOpen(true);
    }
  }

  return (
    <nav
      className="sticky top-0 z-50 border-b shadow-lg"
      style={{
        background: "oklch(0.18 0.07 265 / 0.92)",
        backdropFilter: "blur(16px)",
        borderColor: "oklch(1 0 0 / 0.08)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2"
            data-ocid="nav.home.link"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.14 75), oklch(0.72 0.18 210))",
              }}
            >
              <Building2 className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-white tracking-wide">
              TRUPTAR Bank
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-white/75 hover:text-white transition-colors text-sm font-medium relative group"
                data-ocid={`nav.${l.label.toLowerCase()}.link`}
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-bank-cyan scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
              </Link>
            ))}
            {isLoggedIn && (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 text-white/75 hover:text-white transition-colors text-sm font-medium relative group"
                  data-ocid="nav.profile.link"
                >
                  <User className="h-4 w-4" />
                  My Profile
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-bank-cyan scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                </Link>
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-white/75 hover:text-white transition-colors text-sm font-medium relative group"
                  data-ocid="nav.admin.link"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-bank-cyan scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                </Link>
              </>
            )}
            <Button
              size="sm"
              className="font-semibold rounded-lg px-5"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.18 210), oklch(0.60 0.20 220))",
                color: "white",
              }}
              onClick={handleBankingClick}
              data-ocid="nav.login.open_modal_button"
            >
              <Zap className="h-3.5 w-3.5 mr-1.5" />
              Online Banking
            </Button>
          </div>

          <button
            type="button"
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            data-ocid="nav.menu.toggle"
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="md:hidden px-4 py-4 flex flex-col gap-3 border-t"
          style={{
            background: "oklch(0.16 0.08 265 / 0.96)",
            borderColor: "oklch(1 0 0 / 0.08)",
          }}
        >
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-white/75 hover:text-white py-1 text-sm font-medium"
              onClick={() => setMenuOpen(false)}
              data-ocid={`nav.mobile.${l.label.toLowerCase()}.link`}
            >
              {l.label}
            </Link>
          ))}
          {isLoggedIn && (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-1.5 text-white/75 hover:text-white py-1 text-sm font-medium"
                onClick={() => setMenuOpen(false)}
                data-ocid="nav.mobile.profile.link"
              >
                <User className="h-4 w-4" />
                My Profile
              </Link>
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-white/75 hover:text-white py-1 text-sm font-medium"
                onClick={() => setMenuOpen(false)}
                data-ocid="nav.mobile.admin.link"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
              </Link>
            </>
          )}
          <Button
            size="sm"
            className="font-semibold w-full mt-2 rounded-lg"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.18 210), oklch(0.60 0.20 220))",
              color: "white",
            }}
            onClick={() => {
              setMenuOpen(false);
              handleBankingClick();
            }}
            data-ocid="nav.mobile.login.open_modal_button"
          >
            <Zap className="h-3.5 w-3.5 mr-1.5" />
            Online Banking
          </Button>
        </div>
      )}

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </nav>
  );
}
