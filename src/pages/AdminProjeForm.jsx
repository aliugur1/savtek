import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById, saveProject } from "../lib/dataService";
import "../styles/admin.css";

const CATEGORIES = ["Hava Araçları", "Roket", "Otonom Sistemler", "Robotik", "Yazılım", "Elektronik", "Diğer"];

function AdminProjeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "", slug: "", team: "", category: "", description: "", image: "",
    technologies: "", achievements: "", github: "", demo: "",
    year: new Date().getFullYear().toString(), featured: false, order: 999,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    getProjectById(id).then(p => {
      if (p) setForm({
        title: p.title ?? "", slug: p.slug ?? "", team: p.team ?? "",
        category: p.category ?? "", description: p.description ?? "", image: p.image ?? "",
        technologies: (p.technologies ?? []).join(", "),
        achievements: (p.achievements ?? []).join("\n"),
        github: p.links?.github ?? "", demo: p.links?.demo ?? "",
        year: p.year ?? new Date().getFullYear().toString(),
        featured: p.featured ?? false, order: p.order ?? 999,
      });
    });
  }, [id, isEdit]);

  const slugify = (s) => s.toLowerCase()
    .replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c")
    .replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: type === "checkbox" ? checked : (name === "order" ? Number(value) : value) };
      if (name === "title" && !isEdit) next.slug = slugify(value);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Başlık zorunludur."); return; }
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: form.title, slug: form.slug || slugify(form.title),
        team: form.team, category: form.category, description: form.description,
        image: form.image,
        technologies: form.technologies.split(",").map(t => t.trim()).filter(Boolean),
        achievements: form.achievements.split("\n").map(a => a.trim()).filter(Boolean),
        links: { github: form.github || null, demo: form.demo || null },
        year: form.year, featured: form.featured, order: form.order,
      };
      await saveProject(isEdit ? { ...payload, id } : payload);
      navigate("/admin/projeler");
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
          <h1>{isEdit ? "Proje Düzenle" : "Yeni Proje"}</h1>
          <p className="admin-subtitle">Proje vitrin bilgilerini girin</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <div className="form-error-banner">{error}</div>}

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Proje Adı *</label>
            <input name="title" value={form.title} onChange={handleChange} className="form-input" placeholder="TEKNOFEST İHA Projesi" required />
          </div>
          <div className="form-group">
            <label className="form-label">Slug (URL)</label>
            <input name="slug" value={form.slug} onChange={handleChange} className="form-input" placeholder="teknofest-iha-projesi" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Takım</label>
            <input name="team" value={form.team} onChange={handleChange} className="form-input" placeholder="İHA Takımı" />
          </div>
          <div className="form-group">
            <label className="form-label">Kategori</label>
            <select name="category" value={form.category} onChange={handleChange} className="form-input">
              <option value="">Kategori Seç</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Açıklama</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="form-input" rows={4} placeholder="Projenin kısa açıklaması..." />
        </div>

        <div className="form-group">
          <label className="form-label">Kapak Görseli URL</label>
          <input type="url" name="image" value={form.image} onChange={handleChange} className="form-input" placeholder="https://..." />
          {form.image && (
            <div style={{ marginTop: 8, borderRadius: 8, overflow: "hidden", maxHeight: 160 }}>
              <img src={form.image} alt="Önizleme" style={{ width: "100%", maxHeight: 160, objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Teknolojiler (virgülle ayır)</label>
          <input name="technologies" value={form.technologies} onChange={handleChange} className="form-input" placeholder="Python, ROS2, ArduPilot, C++" />
        </div>

        <div className="form-group">
          <label className="form-label">Başarılar (her satıra bir tane)</label>
          <textarea name="achievements" value={form.achievements} onChange={handleChange} className="form-input" rows={3} placeholder="TEKNOFEST 2024 1. Lik&#10;TÜBİTAK Finalist" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">GitHub URL</label>
            <input type="url" name="github" value={form.github} onChange={handleChange} className="form-input" placeholder="https://github.com/..." />
          </div>
          <div className="form-group">
            <label className="form-label">Demo URL</label>
            <input type="url" name="demo" value={form.demo} onChange={handleChange} className="form-input" placeholder="https://..." />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Yıl</label>
            <input name="year" value={form.year} onChange={handleChange} className="form-input" placeholder="2024" />
          </div>
          <div className="form-group">
            <label className="form-label">Sıra</label>
            <input type="number" name="order" value={form.order} onChange={handleChange} className="form-input" min={0} />
          </div>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, marginTop: 4 }}>
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
          <span>⭐ Öne çıkarılan proje olarak işaretle</span>
        </label>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate("/admin/projeler")}>İptal</button>
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Kaydediliyor..." : isEdit ? "Güncelle" : "Ekle"}</button>
        </div>
      </form>
    </div>
  );
}

export default AdminProjeForm;
