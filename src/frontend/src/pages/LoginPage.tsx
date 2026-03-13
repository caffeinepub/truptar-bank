import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Building2, Shield } from "lucide-react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();

  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  useEffect(() => {
    if (isLoggedIn) {
      void navigate({ to: "/dashboard" });
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-16 px-4">
      <Card
        className="w-full max-w-md border-border shadow-lg"
        data-ocid="login.card"
      >
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-bank-navy rounded-2xl flex items-center justify-center">
              <Building2 className="h-8 w-8 text-bank-gold" />
            </div>
          </div>
          <CardTitle className="font-display text-2xl text-bank-navy">
            Online Banking
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Sign in to access your TRUPTAR Bank account
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-bank-navy/5 rounded-lg p-4 flex items-start gap-3">
            <Shield className="h-5 w-5 text-bank-navy mt-0.5 shrink-0" />
            <p className="text-sm text-bank-navy/80">
              TRUPTAR Bank uses Internet Identity for secure, password-free
              authentication powered by cryptographic keys.
            </p>
          </div>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full bg-bank-navy text-white hover:bg-bank-navy/90 font-semibold"
            data-ocid="login.submit.button"
          >
            {isLoggingIn ? "Connecting..." : "Sign In with Internet Identity"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Your credentials are never shared with TRUPTAR Bank. Secured by the
            Internet Computer.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
