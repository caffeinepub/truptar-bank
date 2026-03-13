import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Building2, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/community", label: "Community" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-bank-navy border-b border-bank-navy/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2"
            data-ocid="nav.home.link"
          >
            <Building2 className="h-7 w-7 text-bank-gold" />
            <span className="font-display text-xl font-bold text-white tracking-wide">
              TRUPTAR Bank
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-white/80 hover:text-bank-gold transition-colors text-sm font-medium"
                data-ocid={`nav.${l.label.toLowerCase()}.link`}
              >
                {l.label}
              </Link>
            ))}
            <Button
              asChild
              size="sm"
              className="bg-bank-gold text-bank-navy hover:bg-bank-gold/90 font-semibold"
              data-ocid="nav.online_banking.button"
            >
              <Link to="/dashboard">Online Banking</Link>
            </Button>
          </div>
          <button
            type="button"
            className="md:hidden text-white"
            onClick={() => setOpen(!open)}
            data-ocid="nav.menu.toggle"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-bank-navy border-t border-white/10 px-4 py-4 flex flex-col gap-3">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-white/80 hover:text-bank-gold py-1 text-sm font-medium"
              onClick={() => setOpen(false)}
              data-ocid={`nav.mobile.${l.label.toLowerCase()}.link`}
            >
              {l.label}
            </Link>
          ))}
          <Button
            asChild
            size="sm"
            className="bg-bank-gold text-bank-navy hover:bg-bank-gold/90 font-semibold w-full mt-2"
            data-ocid="nav.mobile.online_banking.button"
          >
            <Link to="/dashboard" onClick={() => setOpen(false)}>
              Online Banking
            </Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
