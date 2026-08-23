import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProjects, softDeleteProject, saveProject } from "../lib/dataService";
import "../styles/admin.css";

function AdminProjeler() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  const refresh = () => getProjects().then(setProjects);
  useEffect(() => { refresh(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bu projeyi silmek istediğinizden emin misiniz?")) {
      await softDeleteProject(id);
      refresh();
    }
  };

  const toggleFeatured = async (project) => {
    await saveProject({ ...project, featured: !project.featured });
    refresh();
  };

  const filtered = projects.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.team?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Projeler</h1>
          <p className="admin-subtitle">Takım projelerini yönet ve vitrine ekle</p>
        </div>
        <Link to="/admin/projeler/yeni" className="btn-primary">+ Yeni Proje</Link>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="stat-card"><span className="stat-label">Toplam</span><span className="stat-value">{projects.length}</span></div>
        <div className="stat-card"><span className="stat-label">Öne Çıkan</span><span className="stat-value">{projects.filter(p => p.featured).length}</span></div>
        <div className="stat-card"><span className="stat-label">Gösterilen</span><span className="stat-value">{filtered.length}</span></div>
      </div>

      <div className="admin-filters">
        <div className="search-wrapper">
          <input type="text" placeholder="🔍 Proje veya takım ara..." value={search} onChange={e => setSearch(e.target.value)} className="search-input" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>{search ? "Sonuç bulunamadı" : "Henüz proje eklenmemiş"}</p>
          <Link to="/admin/projeler/yeni" className="btn-primary">İlk Projeyi Ekle</Link>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr><th>Proje</th><th>Takım</th><th>Kategori</th><th>Yıl</th><th>Öne Çıkan</th><th>İşlem</th></tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {p.image && <img src={p.image} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} onError={e => e.target.style.display = "none"} />}
                      <strong>{p.title}</strong>
                    </div>
                  </td>
                  <td>{p.team ?? "—"}</td>
                  <td>{p.category ?? "—"}</td>
                  <td>{p.year ?? "—"}</td>
                  <td>
                    <button
                      onClick={() => toggleFeatured(p)}
                      title={p.featured ? "Öne çıkarmayı kaldır" : "Öne çıkar"}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18 }}
                    >
                      {p.featured ? "⭐" : "☆"}
                    </button>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/admin/projeler/duzenle/${p.id}`} className="btn-edit">✏️</Link>
                      <button onClick={() => handleDelete(p.id)} className="btn-delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminProjeler;
