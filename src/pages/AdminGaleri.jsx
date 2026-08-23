import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getGallery, softDeleteGalleryItem } from "../lib/dataService";
import "../styles/admin.css";

function AdminGaleri() {
  const [photos, setPhotos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const refresh = () => getGallery().then(setPhotos);
  useEffect(() => { refresh(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bu fotoğrafı silmek istediğinizden emin misiniz?")) {
      await softDeleteGalleryItem(id);
      refresh();
    }
  };

  const categories = [...new Set(photos.map(p => p.category).filter(Boolean))];

  const filtered = photos.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.desc?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = !filterCategory || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Galeri Yönetimi</h1>
          <p className="admin-subtitle">Fotoğrafları görüntüle, düzenle veya yeni fotoğraf ekle</p>
        </div>
        <Link to="/admin/galeri/yeni" className="btn-primary">
          + Yeni Fotoğraf Ekle
        </Link>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="stat-card">
          <span className="stat-label">Toplam Fotoğraf</span>
          <span className="stat-value">{photos.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Kategori</span>
          <span className="stat-value">{categories.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Gösterilen</span>
          <span className="stat-value">{filtered.length}</span>
        </div>
      </div>

      <div className="admin-filters">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="🔍 Fotoğraf ara..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        {categories.length > 0 && (
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="search-input"
            style={{ maxWidth: "200px" }}
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      {filtered.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
          marginTop: "8px"
        }}>
          {filtered.map(photo => (
            <div key={photo.id} style={{
              background: "var(--card-bg, #fff)",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid var(--border-color, #e5e5e5)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
            }}>
              <div style={{ position: "relative", height: "160px", background: "#f0f0f0" }}>
                <img
                  src={photo.img}
                  alt={photo.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={e => { e.target.style.display = "none"; }}
                />
                {photo.category && (
                  <span style={{
                    position: "absolute", top: "8px", left: "8px",
                    background: "rgba(255,140,0,0.9)", color: "#fff",
                    fontSize: "11px", fontWeight: "700", padding: "3px 8px",
                    borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.5px"
                  }}>
                    {photo.category}
                  </span>
                )}
              </div>
              <div style={{ padding: "12px 14px" }}>
                <p style={{ fontWeight: "600", fontSize: "14px", marginBottom: "4px", color: "var(--text-main, #222)" }}>
                  {photo.title || "Başlıksız"}
                </p>
                {photo.desc && (
                  <p style={{ fontSize: "12px", color: "var(--text-main, #222)", opacity: 0.6, lineHeight: "1.4" }}>
                    {photo.desc.length > 60 ? photo.desc.slice(0, 60) + "…" : photo.desc}
                  </p>
                )}
                <div className="table-actions" style={{ marginTop: "10px" }}>
                  <Link to={`/admin/galeri/duzenle/${photo.id}`} className="btn-edit" title="Düzenle">✏️</Link>
                  <button onClick={() => handleDelete(photo.id)} className="btn-delete" title="Sil">🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>{searchTerm || filterCategory ? "Kriterlere uygun fotoğraf bulunamadı" : "Henüz fotoğraf eklenmemiş"}</p>
          <Link to="/admin/galeri/yeni" className="btn-primary">İlk Fotoğrafı Ekle</Link>
        </div>
      )}
    </div>
  );
}

export default AdminGaleri;
