import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEkip, softDeleteEkipMember } from "../lib/dataService";
import "../styles/admin.css";
import { avatar } from "../lib/avatar";

function AdminEkip() {
  const [ekipUyeleri, setEkipUyeleri] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("Tümü");

  const refresh = () => getEkip().then(setEkipUyeleri);

  useEffect(() => { refresh(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bu üyeyi silmek istediğinizden emin misiniz?")) {
      await softDeleteEkipMember(id);
      refresh();
    }
  };

  // Filter
  const filteredEkip = ekipUyeleri.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === "Tümü" || e.category === filterRole;
    return matchesSearch && matchesFilter;
  });

  const filters = ["Tümü", "Yönetim", "Koordinatörlük", "Gönüllü"];
  const stats = {
    total: ekipUyeleri.length,
    yonetim: ekipUyeleri.filter((e) => e.category === "Yönetim").length,
    koordinator: ekipUyeleri.filter((e) => e.category === "Koordinatörlük")
      .length,
    gonullu: ekipUyeleri.filter((e) => e.category === "Gönüllü").length,
  };

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h1>Ekip Yönetimi</h1>
          <p className="admin-subtitle">
            Ekip üyelerini görüntüle, düzenle veya yeni üye ekle
          </p>
        </div>
        <Link to="/admin/ekip/yeni" className="btn-primary">
          + Yeni Üye Ekle
        </Link>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Toplam</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Yönetim</span>
          <span className="stat-value">{stats.yonetim}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Koordinatör</span>
          <span className="stat-value">{stats.koordinator}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Gönüllü</span>
          <span className="stat-value">{stats.gonullu}</span>
        </div>
      </div>

      {/* FILTERS */}
      <div className="admin-filters">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="🔍 Ekip üyesi ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-pills">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-pill ${filterRole === filter ? "active" : ""}`}
              onClick={() => setFilterRole(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      {filteredEkip.length > 0 ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>SIRA</th>
                <th style={{ width: "80px" }}>FOTOĞRAF</th>
                <th>İSİM</th>
                <th>ROL</th>
                <th>KOORDİNATÖRLÜK</th>
                <th>BÖLÜM</th>
                <th style={{ width: "120px" }}>KATEGORİ</th>
                <th style={{ width: "150px" }}>İŞLEMLER</th>
              </tr>
            </thead>
            <tbody>
              {filteredEkip.map((uye) => (
                <tr key={uye.id}>
                  <td>
                    <span className="order-badge">{uye.order || "-"}</span>
                  </td>
                  <td>
                    <div className="table-image">
                      <img {...avatar(uye.photo)} alt={uye.name} />
                    </div>
                  </td>
                  <td>
                    <strong>{uye.name}</strong>
                  </td>
                  <td>{uye.role}</td>
                  <td>
                    {uye.coordinationTitle ? (
                      <span style={{ fontSize: "13px", color: "#666" }}>
                        {uye.coordinationTitle}
                      </span>
                    ) : (
                      <span style={{ color: "#d1d5db" }}>-</span>
                    )}
                  </td>
                  <td>{uye.department}</td>
                  <td>
                    <span
                      className="badge badge-category"
                      data-category={uye.category}
                    >
                      {uye.category}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link
                        to={`/admin/ekip/duzenle/${uye.id}`}
                        className="btn-edit"
                        title="Düzenle"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(uye.id)}
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
            {searchTerm || filterRole !== "Tümü"
              ? "Arama kriterlerine uygun üye bulunamadı"
              : "Henüz ekip üyesi eklenmemiş"}
          </p>
          <Link to="/admin/ekip/yeni" className="btn-primary">
            İlk Üyeyi Ekle
          </Link>
        </div>
      )}
    </div>
  );
}

export default AdminEkip;
