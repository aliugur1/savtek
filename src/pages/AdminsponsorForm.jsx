import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../styles/admin.css";

function AdminSponsorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    website: "",
    instagram: "",
    linkedin: "",
    order: 999,
  });

  // Load sponsor data if editing
  useEffect(() => {
    if (isEdit) {
      const stored = localStorage.getItem("sponsorlar");
      if (stored) {
        const sponsors = JSON.parse(stored);
        const sponsor = sponsors.find((s) => String(s.id) === String(id));
        if (sponsor) {
          // Ensure all fields have defined values
          setFormData({
            id: sponsor.id,
            name: sponsor.name || "",
            logo: sponsor.logo || "",
            website: sponsor.website || "",
            instagram: sponsor.instagram || "",
            linkedin: sponsor.linkedin || "",
            order: sponsor.order || 999,
          });
        }
      }
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    const stored = localStorage.getItem("sponsorlar");
    let sponsors = stored ? JSON.parse(stored) : [];

    if (isEdit) {
      // Update existing sponsor
      sponsors = sponsors.map((s) =>
        String(s.id) === String(id) ? formData : s
      );
    } else {
      // Add new sponsor
      const newSponsor = {
        ...formData,
        id: String(Date.now()),
      };
      sponsors.push(newSponsor);
    }

    localStorage.setItem("sponsorlar", JSON.stringify(sponsors));
    navigate("/admin/sponsorlar");
  };

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h1>{isEdit ? "Sponsoru Düzenle" : "Yeni Sponsor"}</h1>
          <p className="admin-subtitle">
            Sponsor bilgilerini girin ve kaydedin
          </p>
        </div>
        <Link to="/admin/sponsorlar" className="btn-secondary">
          ← Geri Dön
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {/* TEMEL BİLGİLER */}
        <div className="form-section">
          <h3>Sponsor Bilgileri</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="name">Sponsor Adı *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                required
                placeholder="ASELSAN"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="logo">Logo URL *</label>
              <input
                type="text"
                id="logo"
                name="logo"
                value={formData.logo || ""}
                onChange={handleChange}
                required
                placeholder="/aselsan.png"
              />
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
              <label htmlFor="website">Website URL</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website || ""}
                onChange={handleChange}
                placeholder="https://www.aselsan.com.tr"
              />
            </div>

            <div className="form-group">
              <label htmlFor="instagram">Instagram URL</label>
              <input
                type="url"
                id="instagram"
                name="instagram"
                value={formData.instagram || ""}
                onChange={handleChange}
                placeholder="https://www.instagram.com/aselsan"
              />
            </div>

            <div className="form-group">
              <label htmlFor="linkedin">LinkedIn URL</label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin || ""}
                onChange={handleChange}
                placeholder="https://www.linkedin.com/company/aselsan"
              />
            </div>
          </div>

          {/* LOGO PREVIEW */}
          {formData.logo && (
            <div style={{ marginTop: "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 600,
                }}
              >
                Logo Önizleme:
              </label>
              <div
                style={{
                  width: "200px",
                  height: "120px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#fff",
                  padding: "16px",
                }}
              >
                <img
                  src={formData.logo}
                  alt="Logo preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* SUBMIT */}
        <div className="form-actions">
          <Link to="/admin/sponsorlar" className="btn-secondary">
            İptal
          </Link>
          <button type="submit" className="btn-primary">
            {isEdit ? "Değişiklikleri Kaydet" : "Sponsor Oluştur"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminSponsorForm;
