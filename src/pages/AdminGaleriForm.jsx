import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGalleryById, saveGalleryItem } from "../lib/dataService";
import "../styles/admin.css";

const CATEGORIES = ["Yarışma", "Atölye", "Etkinlik", "Eğitim", "Toplantı", "Diğer"];

function AdminGaleriForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    img: "",
    category: "",
    order: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    getGalleryById(id).then(item => {
      if (item) setFormData({
        title: item.title || "",
        desc: item.desc || "",
        img: item.img || "",
        category: item.category || "",
        order: item.order ?? 0,
      });
    });
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === "order" ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.img.trim()) { setError("Fotoğraf URL'si zorunludur."); return; }
    setSaving(true);
    setError("");
    try {
      await saveGalleryItem(isEdit ? { ...formData, id } : formData);
      navigate("/admin/galeri");
    } catch (err) {
      setError("Kaydetme sırasında hata oluştu: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>{isEdit ? "Fotoğraf Düzenle" : "Yeni Fotoğraf Ekle"}</h1>
          <p className="admin-subtitle">Galeri fotoğraf bilgilerini girin</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <div className="form-error-banner">{error}</div>}

        <div className="form-group">
          <label className="form-label">Başlık</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="TEKNOFEST 2024"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Açıklama</label>
          <textarea
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            placeholder="Fotoğraf hakkında kısa açıklama..."
            className="form-input"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Fotoğraf URL'si <span style={{ color: "#e53e3e" }}>*</span></label>
          <input
            type="url"
            name="img"
            value={formData.img}
            onChange={handleChange}
            placeholder="https://..."
            className="form-input"
            required
          />
          {formData.img && (
            <div style={{ marginTop: "10px", borderRadius: "8px", overflow: "hidden", maxHeight: "200px" }}>
              <img
                src={formData.img}
                alt="Önizleme"
                style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
                onError={e => { e.target.style.display = "none"; }}
              />
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Kategori</label>
            <select name="category" value={formData.category} onChange={handleChange} className="form-input">
              <option value="">Kategori Seç</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Sıra</label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min={0}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate("/admin/galeri")}>
            İptal
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Kaydediliyor..." : isEdit ? "Güncelle" : "Ekle"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminGaleriForm;
