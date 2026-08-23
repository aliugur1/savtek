import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./context/AuthProvider.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

// Components (sync — always needed)
import Navbar from "./components/Navbar.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import TeamProtectedRoute from "./components/TeamProtectedRoute.jsx";
import MobileBlocker from "./components/MobileBlocker.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import AnnouncementBanner from "./components/AnnouncementBanner.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import KVKKConsent from "./components/KVKKConsent.jsx";
import GoogleAnalytics from "./components/GoogleAnalytics.jsx";
import SkipToContent from "./components/SkipToContent.jsx";

// Public Pages — lazy loaded
const Anasayfa = lazy(() => import("./pages/Anasayfa.jsx"));
const Hakkimizda = lazy(() => import("./pages/Hakkimizda.jsx"));
const Ekip = lazy(() => import("./pages/Ekip.jsx"));
const Etkinlik = lazy(() => import("./pages/Etkinlik.jsx"));
const EtkinlikDetay = lazy(() => import("./pages/EtkinlikDetay.jsx"));
const TG = lazy(() => import("./pages/TG.jsx"));
const Takimlar = lazy(() => import("./pages/Takim.jsx"));
const TakimDetay = lazy(() => import("./pages/TakimDetay.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const Gizlilik = lazy(() => import("./pages/Gizlilik.jsx"));
const Panel = lazy(() => import("./pages/Panel.jsx"));
const Giris = lazy(() => import("./pages/Giris.jsx"));
const Galeri = lazy(() => import("./pages/Galeri.jsx"));

// Admin Pages — lazy loaded
const Login = lazy(() => import("./pages/Login.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const AdminTakimlar = lazy(() => import("./pages/AdminTakimlar.jsx"));
const AdminTakimForm = lazy(() => import("./pages/AdminTakimForm.jsx"));
const AdminEtkinlikler = lazy(() => import("./pages/AdminEtkinlikler.jsx"));
const AdminEtkinlikForm = lazy(() => import("./pages/AdminEtkinlikForm.jsx"));
const AdminEkip = lazy(() => import("./pages/AdminEkip.jsx"));
const AdminEkipForm = lazy(() => import("./pages/AdminEkipForm.jsx"));
const AdminSponsorlar = lazy(() => import("./pages/AdminSponsorlar.jsx"));
const AdminSponsorForm = lazy(() => import("./pages/AdminsponsorForm.jsx"));
const AdminAyarlar = lazy(() => import("./pages/AdminAyarlar.jsx"));
const AdminLogs = lazy(() => import("./pages/AdminLogs.jsx"));
const AdminDokumanlar = lazy(() => import("./pages/AdminDokumanlar.jsx"));
const AdminGaleri = lazy(() => import("./pages/AdminGaleri.jsx"));
const AdminGaleriForm = lazy(() => import("./pages/AdminGaleriForm.jsx"));
const AdminProjeler = lazy(() => import("./pages/AdminProjeler.jsx"));
const AdminProjeForm = lazy(() => import("./pages/AdminProjeForm.jsx"));
const AdminDuyurular = lazy(() => import("./pages/AdminDuyurular.jsx"));
const AdminDuyuruForm = lazy(() => import("./pages/AdminDuyuruForm.jsx"));
const AdminBasvurular = lazy(() => import("./pages/AdminBasvurular.jsx"));
const Duyurular = lazy(() => import("./pages/Duyurular.jsx"));
const Basvuru = lazy(() => import("./pages/Basvuru.jsx"));
const Projeler = lazy(() => import("./pages/Projeler.jsx"));

function Page({ children }) {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen message="Sayfa yükleniyor..." />}>
      {children}
    </Suspense>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Page><Anasayfa /></Page>} />
        <Route path="/hakkimizda" element={<Page><Hakkimizda /></Page>} />

        <Route path="/ekip" element={<Page><Ekip /></Page>} />
        <Route path="/ekibimiz" element={<Navigate to="/ekip" replace />} />

        <Route path="/etkinlikler" element={<Page><Etkinlik /></Page>} />
        <Route path="/etkinliklerimiz" element={<Navigate to="/etkinlikler" replace />} />
        <Route path="/etkinlikler/:slug" element={<Page><EtkinlikDetay /></Page>} />

        <Route path="/tg" element={<Page><TG /></Page>} />
        <Route path="/tg/tg25" element={<Page><TG /></Page>} />

        <Route path="/takimlar" element={<Page><Takimlar /></Page>} />
        <Route path="/takimlarimiz" element={<Navigate to="/takimlar" replace />} />
        <Route path="/takimlar/:slug" element={<Page><TakimDetay /></Page>} />

        <Route path="/gizlilik" element={<Page><Gizlilik /></Page>} />
        <Route path="/giris" element={<Page><Giris /></Page>} />
        <Route path="/galeri" element={<Page><Galeri /></Page>} />
        <Route path="/duyurular" element={<Page><Duyurular /></Page>} />
        <Route path="/basvuru" element={<Page><Basvuru /></Page>} />
        <Route path="/projeler" element={<Page><Projeler /></Page>} />

        {/* TEAM PANEL */}
        <Route
          path="/panel"
          element={
            <TeamProtectedRoute>
              <Page><Panel /></Page>
            </TeamProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/login"
          element={
            <MobileBlocker>
              <Page><Login /></Page>
            </MobileBlocker>
          }
        />

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
          <Route index element={<Dashboard />} />
          <Route path="takimlar" element={<AdminTakimlar />} />
          <Route path="takimlar/yeni" element={<AdminTakimForm />} />
          <Route path="takimlar/duzenle/:id" element={<AdminTakimForm />} />
          <Route path="etkinlikler" element={<AdminEtkinlikler />} />
          <Route path="etkinlikler/yeni" element={<AdminEtkinlikForm />} />
          <Route path="etkinlikler/duzenle/:id" element={<AdminEtkinlikForm />} />
          <Route path="ekip" element={<AdminEkip />} />
          <Route path="ekip/yeni" element={<AdminEkipForm />} />
          <Route path="ekip/duzenle/:id" element={<AdminEkipForm />} />
          <Route path="sponsorlar" element={<AdminSponsorlar />} />
          <Route path="sponsorlar/yeni" element={<AdminSponsorForm />} />
          <Route path="sponsorlar/duzenle/:id" element={<AdminSponsorForm />} />
          <Route path="galeri" element={<AdminGaleri />} />
          <Route path="galeri/yeni" element={<AdminGaleriForm />} />
          <Route path="galeri/duzenle/:id" element={<AdminGaleriForm />} />
          <Route path="projeler" element={<AdminProjeler />} />
          <Route path="projeler/yeni" element={<AdminProjeForm />} />
          <Route path="projeler/duzenle/:id" element={<AdminProjeForm />} />
          <Route path="duyurular" element={<AdminDuyurular />} />
          <Route path="duyurular/yeni" element={<AdminDuyuruForm />} />
          <Route path="duyurular/duzenle/:id" element={<AdminDuyuruForm />} />
          <Route path="basvurular" element={<AdminBasvurular />} />
          <Route path="dokumanlar" element={<AdminDokumanlar />} />
          <Route path="logs" element={<AdminLogs />} />
          <Route path="ayarlar" element={<AdminAyarlar />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Page><NotFound /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <SkipToContent />}
      {!isAdminPage && <Navbar />}
      {!isAdminPage && <AnnouncementBanner />}
      <AnimatedRoutes />
      {!isAdminPage && <Footer />}
      {!isAdminPage && <KVKKConsent />}
    </>
  );
}

import Preloader from "./components/Preloader.jsx";
import { useState, useEffect } from "react";

function App() {
  const [isPreloading, setIsPreloading] = useState(true);

  // Check if it's the first time the user visits the site in this session
  useEffect(() => {
    const hasPreloaded = sessionStorage.getItem("hasPreloaded");
    if (hasPreloaded) {
      setIsPreloading(false);
    } else {
      sessionStorage.setItem("hasPreloaded", "true");
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        {isPreloading && <Preloader onComplete={() => setIsPreloading(false)} />}
        <Router>
          <GoogleAnalytics />
          <ScrollToTop />
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
