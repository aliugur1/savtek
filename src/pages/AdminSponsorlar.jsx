import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/admin.css";

function AdminSponsorlar() {
  const [sponsorlar, setSponsorlar] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load sponsors from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("sponsorlar");
    if (stored) {
      setSponsorlar(JSON.parse(stored));
    } else {
      // Dummy data
      const dummyData = [
        {
          id: "1",
          name: "ASELSAN",
          logo: "/aselsan.png",
          website: "https://www.aselsan.com.tr",
          instagram: "https://www.instagram.com/aselsan",
          linkedin: "https://www.linkedin.com/company/aselsan",
          order: 1,
        },
        {
          id: "2",
          name: "HAVELSAN",
          logo: "/havelsan.png",
          website: "https://www.havelsan.com.tr",
          instagram: "https://www.instagram.com/havelsan",
          linkedin: "https://www.linkedin.com/company/havelsan",
          order: 2,
        },
      ];
      setSponsorlar(dummyData);
      localStorage.setItem("sponsorlar", JSON.stringify(dummyData));
    }
  }, []);

  // Delete sponsor
  const handleDelete = (id) => {
    if (window.confirm("Bu sponsoru silmek istediğinizden emin misiniz?")) {
      const updated = sponsorlar.filter((s) => String(s.id) !== String(id));
      setSponsorlar(updated);
      localStorage.setItem("sponsorlar", JSON.stringify(updated));
    }
  };

  // Filter
  const filteredSponsorlar = sponsorlar.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h1>Sponsor Yönetimi</h1>
          <p className="admin-subtitle">
            Sponsorları görüntüle, düzenle veya yeni sponsor ekle
          </p>
        </div>
        <Link to="/admin/sponsorlar/yeni" className="btn-primary">
          + Yeni Sponsor Ekle
        </Link>
      </div>

      {/* STATS */}
      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
      >
        <div className="stat-card">
          <span className="stat-label">Toplam Sponsor</span>
          <span className="stat-value">{sponsorlar.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Gösterilen</span>
          <span className="stat-value">{filteredSponsorlar.length}</span>
        </div>
      </div>

      {/* SEARCH */}
      <div className="admin-filters">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="🔍 Sponsor ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* TABLE */}
      {filteredSponsorlar.length > 0 ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>SIRA</th>
                <th style={{ width: "120px" }}>LOGO</th>
                <th>SPONSOR ADI</th>
                <th>WEBSİTE</th>
                <th style={{ width: "150px" }}>SOSYAL MEDYA</th>
                <th style={{ width: "150px" }}>İŞLEMLER</th>
              </tr>
            </thead>
            <tbody>
              {filteredSponsorlar.map((sponsor) => (
                <tr key={sponsor.id}>
                  <td>
                    <span className="order-badge">{sponsor.order || "-"}</span>
                  </td>
                  <td>
                    <div
                      className="table-image"
                      style={{ height: "60px", background: "#fff" }}
                    >
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        style={{ objectFit: "contain", padding: "8px" }}
                      />
                    </div>
                  </td>
                  <td>
                    <strong>{sponsor.name}</strong>
                  </td>
                  <td>
                    {sponsor.website && (
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#0066cc", fontSize: "13px" }}
                      >
                        🔗{" "}
                        {sponsor.website
                          .replace("https://", "")
                          .substring(0, 30)}
                        ...
                      </a>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {sponsor.instagram && (
                        <a
                          href={sponsor.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Instagram"
                          style={{ fontSize: "18px" }}
                        >
                          📷
                        </a>
                      )}
                      {sponsor.linkedin && (
                        <a
                          href={sponsor.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="LinkedIn"
                          style={{ fontSize: "18px" }}
                        >
                          💼
                        </a>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link
                        to={`/admin/sponsorlar/duzenle/${sponsor.id}`}
                        className="btn-edit"
                        title="Düzenle"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(sponsor.id)}
                        className="btn-delete"
                        title="Sil"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>
            {searchTerm
              ? "Arama kriterlerine uygun sponsor bulunamadı"
              : "Henüz sponsor eklenmemiş"}
          </p>
          <Link to="/admin/sponsorlar/yeni" className="btn-primary">
            İlk Sponsoru Ekle
          </Link>
        </div>
      )}
    </div>
  );
}

export default AdminSponsorlar;
