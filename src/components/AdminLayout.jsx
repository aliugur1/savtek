import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import "../styles/admin.css";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Genel Bakış", path: "/admin", icon: "🏠", exact: true },
    { name: "Takımlar", path: "/admin/takimlar", icon: "🚀" },
    { name: "Etkinlikler", path: "/admin/etkinlikler", icon: "📅" },
    { name: "Ekip", path: "/admin/ekip", icon: "👥" },
    { name: "Sponsorlar", path: "/admin/sponsorlar", icon: "🤝" },
    { name: "Log Kayıtları", path: "/admin/logs", icon: "📋" },
    { name: "Ayarlar", path: "/admin/ayarlar", icon: "⚙️" },
  ];

  const handleLogout = () => {
    if (window.confirm("Çıkış yapmak istediğinizden emin misiniz?")) {
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("adminToken");
      navigate("/admin/login");
    }
  };

  // Active link kontrolü - exact match için
  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <img src="/logo.png" alt="SAVTEK" className="sidebar-logo" />
          <h2 className="sidebar-title">SAVTEK</h2>
          <span className="sidebar-subtitle">Admin Panel</span>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={`menu-item ${isActive(item) ? "active" : ""}`}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <span>🚪</span>
          <span>Çıkış Yap</span>
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="admin-main">
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
