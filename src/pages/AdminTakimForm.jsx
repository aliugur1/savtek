import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getTeamById, saveTeam } from "../lib/dataService";
import "../styles/admin.css";

function AdminTakimForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    area: "",
    image: "/hero-anka.png",
    badge: "Aktif Takım",
    description: "",
    order: 999,
    featured: false,
    members: [],
    achievements: [],
    technologies: [],
    gallery: [],
    sponsors: [],
  });

  const [memberForm, setMemberForm] = useState({
    name: "",
    role: "",
    photo: "",
    linkedin: "",
  });

  const [sponsorForm, setSponsorForm] = useState({
    name: "",
    logo: "",
    instagram: "",
    linkedin: "",
  });

  useEffect(() => {
    if (!isEdit) return;
    getTeamById(id).then(team => {
      if (team) setFormData({ ...team, members: team.members ?? [], achievements: team.achievements ?? [], technologies: team.technologies ?? [], gallery: team.gallery ?? [], sponsors: team.sponsors ?? [] });
    });
  }, [id, isEdit]);

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Auto-generate slug when name changes
    if (name === "name" && !isEdit) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  };

  // Add member
  const addMember = () => {
    if (memberForm.name && memberForm.role) {
      setFormData((prev) => ({
        ...prev,
        members: [...prev.members, { ...memberForm }],
      }));
      setMemberForm({ name: "", role: "", photo: "", linkedin: "" });
    }
  };

  // Remove member
  const removeMember = (index) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
  };

  // Add sponsor
  const addSponsor = () => {
    if (sponsorForm.name && sponsorForm.logo) {
      setFormData((prev) => ({
        ...prev,
        sponsors: [...prev.sponsors, { ...sponsorForm }],
      }));
      setSponsorForm({ name: "", logo: "", instagram: "", linkedin: "" });
    }
  };

  // Remove sponsor
  const removeSponsor = (index) => {
    setFormData((prev) => ({
      ...prev,
      sponsors: prev.sponsors.filter((_, i) => i !== index),
    }));
  };

  // Add achievement
  const addAchievement = () => {
    const achievement = prompt("Başarı girin:");
    if (achievement) {
      setFormData((prev) => ({
        ...prev,
        achievements: [...prev.achievements, achievement],
      }));
    }
  };

  // Remove achievement
  const removeAchievement = (index) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  // Add technology
  const addTechnology = () => {
    const tech = prompt("Teknoloji girin:");
    if (tech) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, tech],
      }));
    }
  };

  // Remove technology
  const removeTechnology = (index) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  // Add gallery image
  const addGalleryImage = () => {
    const url = prompt("Görsel URL'sini girin:");
    if (url) {
      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, url],
      }));
    }
  };

  // Remove gallery image
  const removeGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveTeam(formData);
    navigate("/admin/takimlar");
  };

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h1>{isEdit ? "Takımı Düzenle" : "Yeni Takım"}</h1>
          <p className="admin-subtitle">Takım bilgilerini girin ve kaydedin</p>
        </div>
        <Link to="/admin/takimlar" className="btn-secondary">
          ← Geri Dön
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {/* TEMEL BİLGİLER */}
        <div className="form-section">
          <h3>Temel Bilgiler</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="name">Takım Adı *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                required
                placeholder="Altay Roket Takımı"
              />
            </div>

            <div className="form-group">
              <label htmlFor="slug">URL (Slug) *</label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug || ""}
                onChange={handleChange}
                required
                placeholder="altay-roket-takimi"
              />
            </div>

            <div className="form-group">
              <label htmlFor="area">Çalışma Alanı *</label>
              <input
                type="text"
                id="area"
                name="area"
                value={formData.area || ""}
                onChange={handleChange}
                required
                placeholder="TEKNOFEST - Roket Yarışmaları"
              />
            </div>

            <div className="form-group">
              <label htmlFor="badge">Durum *</label>
              <select
                id="badge"
                name="badge"
                value={formData.badge || ""}
                onChange={handleChange}
                required
              >
                <option value="Aktif Takım">Aktif Takım</option>
                <option value="Takım Adı Belirlenecek">
                  Takım Adı Belirlenecek
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="order">Sıra Numarası</label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order || ""}
                onChange={handleChange}
                placeholder="999"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="image">Takım Görseli URL *</label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image || ""}
                onChange={handleChange}
                required
                placeholder="/logo.png"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Açıklama *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Takım hakkında detaylı bilgi..."
              />
            </div>

            <div className="form-group full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                Anasayfada öne çıkar
              </label>
            </div>
          </div>
        </div>

        {/* EKİP ÜYELERİ */}
        <div className="form-section">
          <h3>Ekip Üyeleri</h3>

          {formData.members.length > 0 && (
            <div className="items-list">
              {formData.members.map((member, index) => (
                <div key={index} className="item-card">
                  <div>
                    <strong>{member.name}</strong>
                    <p>{member.role}</p>
                    {member.linkedin && (
                      <span style={{ fontSize: "12px", color: "#666" }}>
                        🔗 LinkedIn
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    className="btn-remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <input
                type="text"
                value={memberForm.name}
                onChange={(e) =>
                  setMemberForm({ ...memberForm, name: e.target.value })
                }
                placeholder="İsim"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                value={memberForm.role}
                onChange={(e) =>
                  setMemberForm({ ...memberForm, role: e.target.value })
                }
                placeholder="Rol (örn: Takım Lideri)"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                value={memberForm.photo}
                onChange={(e) =>
                  setMemberForm({ ...memberForm, photo: e.target.value })
                }
                placeholder="Fotoğraf URL (opsiyonel)"
              />
            </div>
            <div className="form-group">
              <input
                type="url"
                value={memberForm.linkedin}
                onChange={(e) =>
                  setMemberForm({ ...memberForm, linkedin: e.target.value })
                }
                placeholder="LinkedIn URL (opsiyonel)"
              />
            </div>
            <div className="form-group">
              <button type="button" onClick={addMember} className="btn-add">
                + Üye Ekle
              </button>
            </div>
          </div>
        </div>

        {/* SPONSORLAR */}
        <div className="form-section">
          <h3>Takım Sponsorları</h3>

          {formData.sponsors.length > 0 && (
            <div className="items-list">
              {formData.sponsors.map((sponsor, index) => (
                <div key={index} className="item-card">
                  <div>
                    <strong>{sponsor.name}</strong>
                    <p style={{ fontSize: "12px", color: "#666" }}>
                      Logo: {sponsor.logo}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSponsor(index)}
                    className="btn-remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <input
                type="text"
                value={sponsorForm.name}
                onChange={(e) =>
                  setSponsorForm({ ...sponsorForm, name: e.target.value })
                }
                placeholder="Sponsor Adı"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                value={sponsorForm.logo}
                onChange={(e) =>
                  setSponsorForm({ ...sponsorForm, logo: e.target.value })
                }
                placeholder="Logo URL"
              />
            </div>
            <div className="form-group">
              <input
                type="url"
                value={sponsorForm.instagram}
                onChange={(e) =>
                  setSponsorForm({ ...sponsorForm, instagram: e.target.value })
                }
                placeholder="Instagram URL (opsiyonel)"
              />
            </div>
            <div className="form-group">
              <input
                type="url"
                value={sponsorForm.linkedin}
                onChange={(e) =>
                  setSponsorForm({ ...sponsorForm, linkedin: e.target.value })
                }
                placeholder="LinkedIn URL (opsiyonel)"
              />
            </div>
            <div className="form-group">
              <button type="button" onClick={addSponsor} className="btn-add">
                + Sponsor Ekle
              </button>
            </div>
          </div>
        </div>

        {/* BAŞARILAR */}
        <div className="form-section">
          <h3>Başarılar</h3>

          {formData.achievements.length > 0 && (
            <div className="items-list">
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="item-card">
                  <p>{achievement}</p>
                  <button
                    type="button"
                    onClick={() => removeAchievement(index)}
                    className="btn-remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button type="button" onClick={addAchievement} className="btn-add">
            + Başarı Ekle
          </button>
        </div>

        {/* TEKNOLOJİLER */}
        <div className="form-section">
          <h3>Kullanılan Teknolojiler</h3>

          {formData.technologies.length > 0 && (
            <div className="items-list">
              {formData.technologies.map((tech, index) => (
                <div key={index} className="item-card">
                  <p>{tech}</p>
                  <button
                    type="button"
                    onClick={() => removeTechnology(index)}
                    className="btn-remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button type="button" onClick={addTechnology} className="btn-add">
            + Teknoloji Ekle
          </button>
        </div>

        {/* GALERİ */}
        <div className="form-section">
          <h3>Galeri</h3>

          {formData.gallery.length > 0 && (
            <div className="gallery-grid">
              {formData.gallery.map((img, index) => (
                <div key={index} className="gallery-item">
                  <img src={img} alt={`Galeri ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="btn-remove-overlay"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button type="button" onClick={addGalleryImage} className="btn-add">
            + Görsel Ekle
          </button>
        </div>

        {/* SUBMIT */}
        <div className="form-actions">
          <Link to="/admin/takimlar" className="btn-secondary">
            İptal
          </Link>
          <button type="submit" className="btn-primary">
            {isEdit ? "Değişiklikleri Kaydet" : "Takım Oluştur"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminTakimForm;
