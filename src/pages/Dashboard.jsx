import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTeams: 0,
    activeTeams: 0,
    featuredTeams: 0,
    totalEvents: 0,
    totalMembers: 0,
    totalSponsors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verileri yükle
    setTimeout(() => {
      const takimlar = JSON.parse(localStorage.getItem("takimlar") || "[]");
      const etkinlikler = JSON.parse(
        localStorage.getItem("etkinlikler") || "[]"
      );
      const sponsorlar = JSON.parse(localStorage.getItem("sponsorlar") || "[]");

      // Takımlardan üye sayısını hesapla
      let totalMembers = 0;
      takimlar.forEach((takim) => {
        if (takim.members && Array.isArray(takim.members)) {
          totalMembers += takim.members.length;
        }
      });

      setStats({
        totalTeams: takimlar.length,
        activeTeams: takimlar.filter((t) => t.badge === "Aktif Takım").length,
        featuredTeams: takimlar.filter((t) => t.featured).length,
        totalEvents: etkinlikler.length,
        totalMembers: totalMembers,
        totalSponsors: sponsorlar.length,
      });

      setLoading(false);
    }, 300);
  }, []);

  const statCards = [
    {
      icon: "🚀",
      number: stats.totalTeams,
      label: "Toplam Takım",
      detail: `${stats.activeTeams} aktif, ${stats.featuredTeams} anasayfada`,
      color: "orange",
    },
    {
      icon: "📅",
      number: stats.totalEvents,
      label: "Toplam Etkinlik",
      detail: "Tüm etkinlikler",
      color: "blue",
    },
    {
      icon: "👥",
      number: stats.totalMembers,
      label: "Takım Üyeleri",
      detail: "Tüm takımlarda",
      color: "green",
    },
    {
      icon: "🤝",
      number: stats.totalSponsors,
      label: "Sponsorlar",
      detail: "Destekçilerimiz",
      color: "purple",
    },
  ];

  const quickActions = [
    {
      icon: "🚀",
      label: "Yeni Takım Ekle",
      path: "/admin/takimlar/yeni",
    },
    {
      icon: "📅",
      label: "Yeni Etkinlik Ekle",
      path: "/admin/etkinlikler/yeni",
    },
    {
      icon: "👥",
      label: "Ekip Düzenle",
      path: "/admin/ekip",
    },
    {
      icon: "🤝",
      label: "Sponsor Ekle",
      path: "/admin/sponsorlar/yeni",
    },
  ];

  return (
    <div className="admin-page">
      <div className="dashboard-welcome">
        <h2>Hoş Geldiniz! 👋</h2>
        <p>SAVTEK Admin Paneline hoş geldiniz. İşte genel bakış:</p>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>İstatistikler yükleniyor...</p>
        </div>
      ) : (
        <>
          {/* İSTATİSTİKLER */}
          <div className="stats-grid">
            {statCards.map((stat, index) => (
              <div key={index} className={`stat-card stat-${stat.color}`}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-info">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-detail">{stat.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* HIZLI İŞLEMLER */}
          <div className="content-card">
            <h3>Hızlı İşlemler</h3>
            <div className="action-grid">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="action-card"
                >
                  <span className="action-icon">{action.icon}</span>
                  <span className="action-label">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* SON AKTİVİTELER */}
          <div className="content-card">
            <h3>Sistem Durumu</h3>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-icon">🚀</span>
                <div className="activity-content">
                  <strong>{stats.totalTeams} takım</strong> sistemde kayıtlı
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">⭐</span>
                <div className="activity-content">
                  <strong>{stats.featuredTeams} takım</strong> anasayfada
                  gösteriliyor
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">👥</span>
                <div className="activity-content">
                  <strong>{stats.totalMembers} üye</strong> takımlarda aktif
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-icon">📅</span>
                <div className="activity-content">
                  <strong>{stats.totalEvents} etkinlik</strong> kayıtlı
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
