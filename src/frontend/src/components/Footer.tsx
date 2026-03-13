import { Link } from "@tanstack/react-router";
import { Building2, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-bank-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-6 w-6 text-bank-gold" />
              <span className="font-display text-lg font-bold">
                TRUPTAR Bank
              </span>
            </div>
            <p className="text-white/60 text-sm">
              Banking Built for the Community since 1998.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-bank-gold mb-3 text-sm uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link
                  to="/services"
                  className="hover:text-bank-gold transition-colors"
                  data-ocid="footer.services.link"
                >
                  Personal Banking
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-bank-gold transition-colors"
                  data-ocid="footer.business.link"
                >
                  Business Banking
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-bank-gold transition-colors"
                  data-ocid="footer.loans.link"
                >
                  Loans
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-bank-gold transition-colors"
                  data-ocid="footer.digital.link"
                >
                  Digital Banking
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-bank-gold mb-3 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
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
          <div>
            <h4 className="font-semibold text-bank-gold mb-3 text-sm uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-bank-gold" />
                <a
                  href="tel:+14026270793"
                  className="hover:text-bank-gold transition-colors"
                >
                  +1 (402) 627-0793
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-bank-gold" />
                <a
                  href="mailto:ikehsopuruchukwu@gmail.com"
                  className="hover:text-bank-gold transition-colors text-xs"
                >
                  ikehsopuruchukwu@gmail.com
                </a>
              </li>
            </ul>
            <div className="mt-4 text-xs text-white/50 space-y-1">
              <div>
                <Link
                  to="/privacy"
                  className="hover:text-bank-gold transition-colors"
                  data-ocid="footer.privacy.link"
                >
                  Privacy Policy
                </Link>
              </div>
              <div>
                <Link
                  to="/terms"
                  className="hover:text-bank-gold transition-colors"
                  data-ocid="footer.terms.link"
                >
                  Terms of Service
                </Link>
              </div>
              <div>
                <Link
                  to="/security"
                  className="hover:text-bank-gold transition-colors"
                  data-ocid="footer.security.link"
                >
                  Security
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} TRUPTAR Bank. All rights reserved.
          FDIC Insured.
        </div>
      </div>
    </footer>
  );
}
