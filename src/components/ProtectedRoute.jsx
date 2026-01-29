import { Navigate } from "react-router-dom";
/** Admin yetkisi kontrolü
 * localStorage'dan admin bilgilerini kontrol eder*/
function isAuthenticated() {
  try {
    // İki farklı key'i kontrol et (compatibility için)
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const adminToken = localStorage.getItem("adminToken");
    // Alternatif: JSON parse ile daha karmaşık kontrol
    const adminData = localStorage.getItem("savtek-admin");
    if (adminData) {
      const parsed = JSON.parse(adminData);
      return !!parsed?.token;
    }
    // Basit kontrol: isAdmin flag veya token varlığı
    return isAdmin || !!adminToken;
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
}
/**Protected Route Component
 * Admin sayfalarını korur, yetkisiz erişimde login'e yönlendirir */
export default function ProtectedRoute({ children }) {
  const authorized = isAuthenticated();
  // Yetkisiz ise login sayfasına yönlendir
  if (!authorized) {
    return <Navigate to="/admin/login" replace />;
  }
  // Yetkili ise children'ı render et
  return children;
}
