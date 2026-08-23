import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAnnouncementById, saveAnnouncement } from "../lib/dataService";
import "../styles/admin.css";

function AdminDuyuruForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ title: "", content: "", type: "info", active: true, pinned: false, expiresAt: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    getAnnouncementById(id).then(item => {
      if (item) setForm({
        title: item.title ?? "",
        content: item.content ?? "",
        type: item.type ?? "info",
        active: item.active ?? true,
        pinned: item.pinned ?? false,
        expiresAt: item.expiresAt ? item.expiresAt.slice(0, 16) : "",
      });
    });
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Başlık zorunludur."); return; }
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, expiresAt: form.expiresAt || null };
      await saveAnnouncement(isEdit ? { ...payload, id } : payload);
      navigate("/admin/duyurular");
    } catch (err) {
      setError("Kaydetme hatası: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>{isEdit ? "Duyuru Düzenle" : "Yeni Duyuru"}</h1>
          <p className="admin-subtitle">Duyuru bilgilerini girin</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <div className="form-error-banner">{error}</div>}

        <div className="form-group">
          <label className="form-label">Başlık *</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} className="form-input" placeholder="Duyuru başlığı" required />
        </div>

        <div className="form-group">
          <label className="form-label">İçerik</label>
          <textarea name="content" value={form.content} onChange={handleChange} className="form-input" rows={4} placeholder="Duyuru detayı..." />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Tür</label>
            <select name="type" value={form.type} onChange={handleChange} className="form-input">
              <option value="info">Bilgi</option>
              <option value="warning">Uyarı</option>
              <option value="success">Haber</option>
              <option value="error">Önemli</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Bitiş Tarihi (opsiyonel)</label>
            <input type="datetime-local" name="expiresAt" value={form.expiresAt} onChange={handleChange} className="form-input" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 24, marginTop: 4 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
            <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
            <span>Aktif (sitede göster)</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
            <input type="checkbox" name="pinned" checked={form.pinned} onChange={handleChange} />
            <span>Sabitle (üstte göster)</span>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate("/admin/duyurular")}>İptal</button>
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Kaydediliyor..." : isEdit ? "Güncelle" : "Ekle"}</button>
        </div>
      </form>
    </div>
  );
}

export default AdminDuyuruForm;
