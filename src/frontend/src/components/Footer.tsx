import { Link } from "@tanstack/react-router";
import { Building2, Mail, Phone } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="bg-bank-navy text-white">
      {/* Gradient top border */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.72 0.18 210), oklch(0.78 0.14 75), oklch(0.65 0.18 20))",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.78 0.14 75), oklch(0.72 0.18 210))",
                }}
              >
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold">
                TRUPTAR Bank
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Banking Built for the Community since 1998.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-bank-cyan mb-4 text-xs uppercase tracking-widest">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>
                <Link
                  to="/services"
                  className="hover:text-bank-cyan transition-colors"
                  data-ocid="footer.services.link"
                >
                  Personal Banking
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-bank-cyan transition-colors"
                  data-ocid="footer.business.link"
                >
                  Business Banking
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-bank-cyan transition-colors"
                  data-ocid="footer.loans.link"
                >
                  Loans
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-bank-cyan transition-colors"
                  data-ocid="footer.digital.link"
                >
                  Digital Banking
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-bank-gold mb-4 text-xs uppercase tracking-widest">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>
                <Link
                  to="/about"
                  className="hover:text-bank-gold transition-colors"
                  data-ocid="footer.about.link"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/community"
                  className="hover:text-bank-gold transition-colors"
                  data-ocid="footer.community.link"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-bank-gold transition-colors"
                  data-ocid="footer.faq.link"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-bank-gold transition-colors"
                  data-ocid="footer.contact.link"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-bank-emerald mb-4 text-xs uppercase tracking-widest">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-bank-emerald shrink-0" />
                <a
                  href="tel:+14026270793"
                  className="hover:text-bank-emerald transition-colors"
                >
                  +1 (402) 627-0793
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-bank-emerald shrink-0" />
                <a
                  href="mailto:ikehsopuruchukwu@gmail.com"
                  className="hover:text-bank-emerald transition-colors text-xs"
                >
                  ikehsopuruchukwu@gmail.com
                </a>
              </li>
            </ul>
            <div className="mt-4 text-xs text-white/40 space-y-1.5">
              <div>
                <Link
                  to="/privacy"
                  className="hover:text-white/70 transition-colors"
                  data-ocid="footer.privacy.link"
                >
                  Privacy Policy
                </Link>
              </div>
              <div>
                <Link
                  to="/terms"
                  className="hover:text-white/70 transition-colors"
                  data-ocid="footer.terms.link"
                >
                  Terms of Service
                </Link>
              </div>
              <div>
                <Link
                  to="/security"
                  className="hover:text-white/70 transition-colors"
                  data-ocid="footer.security.link"
                >
                  Security
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-10 pt-6 text-center text-xs text-white/35"
          style={{ borderTop: "1px solid oklch(1 0 0 / 0.08)" }}
        >
          &copy; {year} TRUPTAR Bank. All rights reserved. FDIC Insured.{" "}
          <span className="text-white/25">·</span> Built with{" "}
          <span className="text-bank-rose">&hearts;</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
