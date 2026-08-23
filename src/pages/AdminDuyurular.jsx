import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAnnouncements, softDeleteAnnouncement, saveAnnouncement } from "../lib/dataService";
import "../styles/admin.css";

const TYPE_LABELS = { info: "Bilgi", warning: "Uyarı", success: "Haber", error: "Önemli" };
const TYPE_COLORS = { info: "#3b82f6", warning: "#f59e0b", success: "#22c55e", error: "#ef4444" };

function AdminDuyurular() {
  const [items, setItems] = useState([]);

  const refresh = () => getAnnouncements({ includeDeleted: false }).then(setItems);
  useEffect(() => { refresh(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bu duyuruyu silmek istediğinizden emin misiniz?")) {
      await softDeleteAnnouncement(id);
      refresh();
    }
  };

  const toggleActive = async (item) => {
    await saveAnnouncement({ ...item, active: !item.active });
    refresh();
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Duyurular</h1>
          <p className="admin-subtitle">Aktif duyuruları yönet, yeni duyuru ekle</p>
        </div>
        <Link to="/admin/duyurular/yeni" className="btn-primary">+ Yeni Duyuru</Link>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="stat-card"><span className="stat-label">Toplam</span><span className="stat-value">{items.length}</span></div>
        <div className="stat-card"><span className="stat-label">Aktif</span><span className="stat-value">{items.filter(a => a.active).length}</span></div>
        <div className="stat-card"><span className="stat-label">Sabitlenmiş</span><span className="stat-value">{items.filter(a => a.pinned).length}</span></div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <p>Henüz duyuru eklenmemiş</p>
          <Link to="/admin/duyurular/yeni" className="btn-primary">İlk Duyuruyu Ekle</Link>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Başlık</th>
                <th>Tür</th>
                <th>Durum</th>
                <th>Sabitlenmiş</th>
                <th>Tarih</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td><strong>{item.title}</strong>{item.content && <div style={{ fontSize: "12px", opacity: 0.6, marginTop: 2 }}>{item.content.slice(0, 60)}{item.content.length > 60 ? "…" : ""}</div>}</td>
                  <td><span style={{ background: TYPE_COLORS[item.type] + "22", color: TYPE_COLORS[item.type], padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{TYPE_LABELS[item.type] ?? item.type}</span></td>
                  <td>
                    <button
                      onClick={() => toggleActive(item)}
                      style={{ background: item.active ? "#dcfce7" : "#f3f4f6", color: item.active ? "#166534" : "#6b7280", border: "none", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                    >
                      {item.active ? "Aktif" : "Pasif"}
                    </button>
                  </td>
                  <td style={{ textAlign: "center" }}>{item.pinned ? "📌" : "—"}</td>
                  <td style={{ fontSize: 13, opacity: 0.6 }}>{new Date(item.createdAt).toLocaleDateString("tr-TR")}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/admin/duyurular/duzenle/${item.id}`} className="btn-edit">✏️</Link>
                      <button onClick={() => handleDelete(item.id)} className="btn-delete">🗑️</button>
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

export default AdminDuyurular;
