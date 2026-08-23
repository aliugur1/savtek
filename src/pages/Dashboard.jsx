import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTeams, getEvents, getSponsors } from "../lib/dataService";
import "../styles/admin.css";

const REHBER_SECTIONS = [
  {
    id: "giris",
    baslik: "🔐 Admin Paneline Giriş",
    renk: "#ff9800",
    adimlar: [
      { label: "URL", deger: "savtek.com/admin/login" },
      { label: "E-posta", deger: "Supabase'de kayıtlı admin e-postası (örn: yonetim@savtek.com)" },
      { label: "Şifre", deger: "Supabase Auth'ta belirlenen şifre" },
      { label: "Demo/Yerel mod", deger: "Supabase bağlantısı yoksa: herhangi bir e-posta + .env'deki VITE_ADMIN_PASSWORD değeri" },
    ],
  },
  {
    id: "normal-giris",
    baslik: "👤 Takım Üyesi Girişi (Normal)",
    renk: "#3b82f6",
    adimlar: [
      { label: "URL", deger: "savtek.com/giris" },
      { label: "Kim kullanır?", deger: "Takım kaptanları ve üyeleri — takım paneline (/panel) erişim için" },
      { label: "Kimlik", deger: "Supabase'de oluşturulan takım üyesi hesabı" },
      { label: "Fark", deger: "Bu giriş /panel'e açar, /admin'e değil. Admin panelinin ayrı girişi var." },
    ],
  },
  {
    id: "icerik",
    baslik: "📋 İçerik Nasıl Eklenir?",
    renk: "#22c55e",
    adimlar: [
      { label: "Takım ekle/düzenle", deger: "Sol menü → Takımlar → '+ Yeni Takım' butonuna tıkla. Takım adı, açıklama, alan ve üyeleri gir." },
      { label: "Etkinlik ekle", deger: "Sol menü → Etkinlikler → '+ Yeni Etkinlik'. Tarih, yer, açıklama ve konuşmacıları ekleyebilirsin." },
      { label: "Ekip sayfası", deger: "Sol menü → Ekip → yönetim kurulu ve koordinatörleri ekle/düzenle/sırala." },
      { label: "Galeri fotoğrafı", deger: "Sol menü → Galeri → '+ Yeni Fotoğraf'. Fotoğraf URL'si, başlık ve kategori gir." },
      { label: "Sponsor ekle", deger: "Sol menü → Sponsorlar → logo URL, website ve sosyal medya linklerini gir." },
      { label: "Duyuru yayınla", deger: "Sol menü → Duyurular → '+ Yeni Duyuru'. Aktif yapınca sitede anında görünür." },
      { label: "Proje vitrine ekle", deger: "Sol menü → Projeler → takım, teknolojiler ve başarıları doldur. '⭐ Öne Çıkan' seçince ön plana çıkar." },
      { label: "Başvuruları gör", deger: "Sol menü → Başvurular. Katılmak isteyen öğrencilerin formları burada listelenir. Durumu 'kabul edildi / reddedildi' olarak güncelleyebilirsin." },
    ],
  },
  {
    id: "ipuclari",
    baslik: "💡 Önemli İpuçları",
    renk: "#8b5cf6",
    adimlar: [
      { label: "Silme = geri alınabilir", deger: "Takım, etkinlik vb. silerken kalıcı silinmez — 'soft delete' yapılır. Supabase'den geri alınabilir." },
      { label: "Görsel eklemek", deger: "Fotoğraf URL'si kullan (Google Drive, Imgur, Cloudinary vb.). Sunucuya yükleme yok." },
      { label: "Sıralama", deger: "Her içerikte 'Sıra' alanı var. Küçük sayı → öne gelir (0 en üst, 999 en alt)." },
      { label: "Anasayfa düzeni", deger: "Takımlarda 'Anasayfada Göster' seçeneği, duyurularda 'Aktif' seçeneği anasayfayı etkiler." },
      { label: "Log kayıtları", deger: "Sol menü → Log Kayıtları. Kim ne zaman ne yaptı görülür." },
      { label: "Şifre değiştirme", deger: "Supabase Dashboard → Authentication → Users bölümünden yapılır." },
    ],
  },
];


function Dashboard() {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState(null);
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
    Promise.all([getTeams(), getEvents(), getSponsors()]).then(([takimlar, etkinlikler, sponsorlar]) => {
      const totalMembers = takimlar.reduce((sum, t) => sum + (t.members?.length || 0), 0);
      setStats({
        totalTeams: takimlar.length,
        activeTeams: takimlar.filter(t => t.badge === "Aktif Takım").length,
        featuredTeams: takimlar.filter(t => t.featured).length,
        totalEvents: etkinlikler.length,
        totalMembers,
        totalSponsors: sponsorlar.length,
      });
      setLoading(false);
    });
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

          {/* BAŞKAN REHBERİ */}
          <div className="content-card" style={{ borderTop: "3px solid #ff9800" }}>
            <h3 style={{ marginBottom: 4 }}>📖 Başkan Rehberi</h3>
            <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 16 }}>Paneli ilk kez kullanıyorsan burayı oku. Her bölüme tıklayarak detayları görebilirsin.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {REHBER_SECTIONS.map(sec => (
                <div key={sec.id} style={{ border: "1px solid var(--border-color)", borderRadius: 10, overflow: "hidden" }}>
                  <button
                    onClick={() => setOpenSection(openSection === sec.id ? null : sec.id)}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", gap: 12 }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-main)" }}>{sec.baslik}</span>
                    <span style={{ fontSize: 18, color: sec.renk, flexShrink: 0 }}>{openSection === sec.id ? "▲" : "▼"}</span>
                  </button>
                  {openSection === sec.id && (
                    <div style={{ borderTop: `2px solid ${sec.renk}`, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12, background: "var(--bg-soft)" }}>
                      {sec.adimlar.map((adim, i) => (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 12, alignItems: "start" }}>
                          <span style={{ fontWeight: 700, fontSize: 13, color: sec.renk, paddingTop: 1 }}>{adim.label}</span>
                          <span style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--text-main)", opacity: 0.85 }}>{adim.deger}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
