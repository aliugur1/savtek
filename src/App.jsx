import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense } from "react";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

// Components
import Navbar from "./components/Navbar.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MobileBlocker from "./components/MobileBlocker.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import KVKKConsent from "./components/KVKKConsent.jsx";
import GoogleAnalytics from "./components/GoogleAnalytics.jsx";
import SkipToContent from "./components/SkipToContent.jsx";

// Public Pages
import Anasayfa from "./pages/Anasayfa.jsx";
import Hakkimizda from "./pages/Hakkimizda.jsx";
import Ekip from "./pages/Ekip.jsx";
import Etkinlik from "./pages/Etkinlik.jsx";
import EtkinlikDetay from "./pages/EtkinlikDetay.jsx";
import TG from "./pages/TG.jsx";
import Takimlar from "./pages/Takim.jsx";
import TakimDetay from "./pages/TakimDetay.jsx";
import NotFound from "./pages/NotFound.jsx";
import Gizlilik from "./pages/Gizlilik.jsx";

// Admin Pages
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminTakimlar from "./pages/AdminTakimlar.jsx";
import AdminTakimForm from "./pages/AdminTakimForm.jsx";
import AdminEtkinlikler from "./pages/AdminEtkinlikler.jsx";
import AdminEtkinlikForm from "./pages/AdminEtkinlikForm.jsx";
import AdminEkip from "./pages/AdminEkip.jsx";
import AdminEkipForm from "./pages/AdminEkipForm.jsx";
import AdminSponsorlar from "./pages/AdminSponsorlar.jsx";
import AdminSponsorForm from "./pages/AdminSponsorForm.jsx";
import AdminAyarlar from "./pages/AdminAyarlar.jsx";
import AdminLogs from "./pages/AdminLogs.jsx";

// Page Animation Wrapper
function Page({ children }) {
  return (
    <Suspense
      fallback={<LoadingSpinner fullScreen message="Sayfa yükleniyor..." />}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </Suspense>
  );
}

// Animated Routes
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* PUBLIC ROUTES */}

        {/* Ana Sayfa */}
        <Route
          path="/"
          element={
            <Page>
              <Anasayfa />
            </Page>
          }
        />

        {/* Hakkımızda */}
        <Route
          path="/hakkimizda"
          element={
            <Page>
              <Hakkimizda />
            </Page>
          }
        />

        {/* Ekip */}
        <Route
          path="/ekip"
          element={
            <Page>
              <Ekip />
            </Page>
          }
        />
        <Route
          path="/ekibimiz"
          element={
            <Page>
              <Ekip />
            </Page>
          }
        />

        {/* Etkinlikler */}
        <Route
          path="/etkinlikler"
          element={
            <Page>
              <Etkinlik />
            </Page>
          }
        />
        <Route
          path="/etkinliklerimiz"
          element={
            <Page>
              <Etkinlik />
            </Page>
          }
        />
        <Route
          path="/etkinlikler/:slug"
          element={
            <Page>
              <EtkinlikDetay />
            </Page>
          }
        />

        {/* TG (Teknoloji Günü) */}
        <Route
          path="/tg"
          element={
            <Page>
              <TG />
            </Page>
          }
        />
        <Route
          path="/tg/tg25"
          element={
            <Page>
              <TG />
            </Page>
          }
        />

        {/* Takımlar */}
        <Route
          path="/takimlar"
          element={
            <Page>
              <Takimlar />
            </Page>
          }
        />
        <Route
          path="/takimlarimiz"
          element={
            <Page>
              <Takimlar />
            </Page>
          }
        />
        <Route
          path="/takimlar/:slug"
          element={
            <Page>
              <TakimDetay />
            </Page>
          }
        />
        <Route
          path="/gizlilik"
          element={
            <Page>
              <Gizlilik />
            </Page>
          }
        />

        {/* ADMIN ROUTES */}

        {/* Admin Login - Mobile Blocked */}
        <Route
          path="/admin/login"
          element={
            <MobileBlocker>
              <Page>
                <Login />
              </Page>
            </MobileBlocker>
          }
        />

        {/* Admin Panel - Protected & Mobile Blocked */}
        <Route
          path="/admin"
          element={
            <MobileBlocker>
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            </MobileBlocker>
          }
        >
          {/* Dashboard - Index Route */}
          <Route index element={<Dashboard />} />

          {/* Takımlar */}
          <Route path="takimlar" element={<AdminTakimlar />} />
          <Route path="takimlar/yeni" element={<AdminTakimForm />} />
          <Route path="takimlar/duzenle/:id" element={<AdminTakimForm />} />

          {/* Etkinlikler */}
          <Route path="etkinlikler" element={<AdminEtkinlikler />} />
          <Route path="etkinlikler/yeni" element={<AdminEtkinlikForm />} />
          <Route
            path="etkinlikler/duzenle/:id"
            element={<AdminEtkinlikForm />}
          />

          {/* Ekip */}
          <Route path="ekip" element={<AdminEkip />} />
          <Route path="ekip/yeni" element={<AdminEkipForm />} />
          <Route path="ekip/duzenle/:id" element={<AdminEkipForm />} />

          {/* Sponsorlar */}
          <Route path="sponsorlar" element={<AdminSponsorlar />} />
          <Route path="sponsorlar/yeni" element={<AdminSponsorForm />} />
          <Route path="sponsorlar/duzenle/:id" element={<AdminSponsorForm />} />

          {/* Log Kayıtları */}
          <Route path="logs" element={<AdminLogs />} />

          {/* Ayarlar */}
          <Route path="ayarlar" element={<AdminAyarlar />} />
        </Route>

        {/* 404 NOT FOUND */}
        <Route
          path="*"
          element={
            <Page>
              <NotFound />
            </Page>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

// App Content - Layout Controller
function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Skip to Content - Accessibility */}
      {!isAdminPage && <SkipToContent />}

      {/* Navbar - Hide on admin pages */}
      {!isAdminPage && <Navbar />}

      {/* Main Content */}
      <AnimatedRoutes />

      {/* Footer - Hide on admin pages */}
      {!isAdminPage && <Footer />}

      {/* KVKK Consent Banner */}
      {!isAdminPage && <KVKKConsent />}
    </>
  );
}

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <GoogleAnalytics />
        <ScrollToTop />
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
