import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AboutPage from "./pages/AboutPage";
import AdminPage from "./pages/AdminPage";
import BusinessBankingPage from "./pages/BusinessBankingPage";
import CommunityPage from "./pages/CommunityPage";
import ContactPage from "./pages/ContactPage";
import DashboardPage from "./pages/DashboardPage";
import DigitalBankingPage from "./pages/DigitalBankingPage";
import FAQPage from "./pages/FAQPage";
import HomePage from "./pages/HomePage";
import LoanApplicationPage from "./pages/LoanApplicationPage";
import LoanServicesPage from "./pages/LoanServicesPage";
import LoginPage from "./pages/LoginPage";
import OpenAccountPage from "./pages/OpenAccountPage";
import PersonalBankingPage from "./pages/PersonalBankingPage";
import PrivacyPage from "./pages/PrivacyPage";
import ProfilePage from "./pages/ProfilePage";
import SecurityPage from "./pages/SecurityPage";
import ServicesPage from "./pages/ServicesPage";
import TermsPage from "./pages/TermsPage";

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});
const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services",
  component: ServicesPage,
});
const personalBankingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/personal",
  component: PersonalBankingPage,
});
const businessBankingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/business",
  component: BusinessBankingPage,
});
const loanServicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/loans",
  component: LoanServicesPage,
});
const digitalBankingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/digital",
  component: DigitalBankingPage,
});
const communityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/community",
  component: CommunityPage,
});
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});
const openAccountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/open-account",
  component: OpenAccountPage,
});
const loanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/loan-application",
  component: LoanApplicationPage,
});
const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faq",
  component: FAQPage,
});
const securityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/security",
  component: SecurityPage,
});
const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyPage,
});
const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsPage,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  servicesRoute,
  personalBankingRoute,
  businessBankingRoute,
  loanServicesRoute,
  digitalBankingRoute,
  communityRoute,
  contactRoute,
  openAccountRoute,
  loanRoute,
  faqRoute,
  securityRoute,
  privacyRoute,
  termsRoute,
  loginRoute,
  dashboardRoute,
  profileRoute,
  adminRoute,
]);
