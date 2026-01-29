import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../styles/admin.css";

function AdminEkipForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    coordinationTitle: "", // Koordinatörlük adı (örn: "Sosyal Medya Koordinatörlüğü")
    department: "",
    photo: "/baskan.png",
    instagram: "",
    linkedin: "",
    category: "Yönetim",
    order: 999,
  });

  // Load member data if editing
  useEffect(() => {
    if (isEdit) {
      const stored = localStorage.getItem("ekip");
      if (stored) {
        const members = JSON.parse(stored);
        const member = members.find((m) => String(m.id) === String(id));
        if (member) {
          // Ensure all fields have defined values
          setFormData({
            id: member.id,
            name: member.name || "",
            role: member.role || "",
            coordinationTitle: member.coordinationTitle || "",
            department: member.department || "",
            photo: member.photo || "/baskan.png",
            instagram: member.instagram || "",
            linkedin: member.linkedin || "",
            category: member.category || "Yönetim",
            order: member.order || 999,
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

    const stored = localStorage.getItem("ekip");
    let members = stored ? JSON.parse(stored) : [];

    if (isEdit) {
      // Update existing member
      members = members.map((m) =>
        String(m.id) === String(id) ? formData : m
      );
    } else {
      // Add new member
      const newMember = {
        ...formData,
        id: String(Date.now()),
      };
      members.push(newMember);
    }

    localStorage.setItem("ekip", JSON.stringify(members));
    navigate("/admin/ekip");
  };

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h1>{isEdit ? "Üyeyi Düzenle" : "Yeni Üye"}</h1>
          <p className="admin-subtitle">
            Ekip üyesi bilgilerini girin ve kaydedin
          </p>
        </div>
        <Link to="/admin/ekip" className="btn-secondary">
          ← Geri Dön
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {/* TEMEL BİLGİLER */}
        <div className="form-section">
          <h3>Temel Bilgiler</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="name">İsim Soyisim *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                required
                placeholder="Süleyman Arda CAN"
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Rol / Görev *</label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role || ""}
                onChange={handleChange}
                required
                placeholder="Topluluk Başkanı"
              />
            </div>

            <div className="form-group">
              <label htmlFor="coordinationTitle">
                Koordinatörlük Adı (sadece Koordinatörlük için)
              </label>
              <input
                type="text"
                id="coordinationTitle"
                name="coordinationTitle"
                value={formData.coordinationTitle || ""}
                onChange={handleChange}
                placeholder="Sosyal Medya Koordinatörlüğü"
              />
              <small
                style={{
                  fontSize: "12px",
                  color: "#666",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                Koordinatörlük kategorisi seçiliyse bu alan doldurulmalı
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="department">Bölüm *</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department || ""}
                onChange={handleChange}
                required
                placeholder="Elektrik-Elektronik Mühendisliği"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Kategori *</label>
              <select
                id="category"
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
                required
              >
                <option value="Yönetim">Yönetim</option>
                <option value="Koordinatörlük">Koordinatörlük</option>
                <option value="Gönüllü">Gönüllü</option>
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
              <label htmlFor="photo">Fotoğraf URL *</label>
              <input
                type="text"
                id="photo"
                name="photo"
                value={formData.photo || ""}
                onChange={handleChange}
                required
                placeholder="/baskan.png"
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
                placeholder="https://www.instagram.com/..."
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
                placeholder="https://www.linkedin.com/in/..."
              />
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="form-actions">
          <Link to="/admin/ekip" className="btn-secondary">
            İptal
          </Link>
          <button type="submit" className="btn-primary">
            {isEdit ? "Değişiklikleri Kaydet" : "Üye Oluştur"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminEkipForm;
