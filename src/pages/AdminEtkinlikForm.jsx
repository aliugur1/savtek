import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { createLog } from "../utils/adminLogger";
import "../styles/admin.css";

function AdminEtkinlikForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Seminer",
    date: "",
    time: "",
    location: "",
    locationLink: "",
    excerpt: "",
    description: "",
    image: "/hero-anka.png",
    mainImage: "/hero-anka.png",
    speakers: [],
    program: [],
    gallery: [],
  });

  const [speakerForm, setSpeakerForm] = useState({
    name: "",
    title: "",
    company: "",
    photo: "",
    linkedin: "",
  });

  const [programForm, setProgramForm] = useState({
    time: "",
    activity: "",
  });

  // Load event data if editing
  useEffect(() => {
    if (isEdit) {
      if (import.meta.env.DEV) {
        console.log("Editing event with ID:", id);
      }
      const stored = localStorage.getItem("etkinlikler");
      if (stored) {
        const events = JSON.parse(stored);
        if (import.meta.env.DEV) {
          console.log("All events:", events);
        }
        const event = events.find((e) => String(e.id) === String(id));
        if (import.meta.env.DEV) {
          console.log("Found event:", event);
        }
        if (event) {
          // Ensure all fields have defined values
          // eslint-disable-next-line react-hooks/exhaustive-deps
          setFormData({
            id: event.id,
            title: event.title || "",
            slug: event.slug || "",
            category: event.category || "Seminer",
            date: event.date || "",
            time: event.time || "",
            location: event.location || "",
            locationLink: event.locationLink || "",
            excerpt: event.excerpt || "",
            description: event.description || "",
            image: event.image || "/hero-anka.png",
            mainImage: event.mainImage || "/hero-anka.png",
            speakers: Array.isArray(event.speakers) ? event.speakers : [],
            program: Array.isArray(event.program) ? event.program : [],
            gallery: Array.isArray(event.gallery) ? event.gallery : [],
          });
          if (import.meta.env.DEV) {
            console.log("FormData set successfully");
          }
        } else {
          if (import.meta.env.DEV) {
            console.error("Event not found with ID:", id);
          }
        }
      } else {
        if (import.meta.env.DEV) {
          console.error("No events in localStorage");
        }
      }
    }
  }, [id, isEdit]);

  // Generate slug from title
  const generateSlug = (title) => {
    return title
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

    // Auto-generate slug when title changes
    if (name === "title" && !isEdit) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  };

  // Add speaker
  const addSpeaker = () => {
    if (speakerForm.name && speakerForm.title && speakerForm.company) {
      setFormData((prev) => ({
        ...prev,
        speakers: [...prev.speakers, { ...speakerForm }],
      }));
      setSpeakerForm({
        name: "",
        title: "",
        company: "",
        photo: "",
        linkedin: "",
      });
    }
  };

  // Remove speaker
  const removeSpeaker = (index) => {
    setFormData((prev) => ({
      ...prev,
      speakers: prev.speakers.filter((_, i) => i !== index),
    }));
  };

  // Add program item
  const addProgram = () => {
    if (programForm.time && programForm.activity) {
      setFormData((prev) => ({
        ...prev,
        program: [...prev.program, { ...programForm }],
      }));
      setProgramForm({ time: "", activity: "" });
    }
  };

  // Remove program item
  const removeProgram = (index) => {
    setFormData((prev) => ({
      ...prev,
      program: prev.program.filter((_, i) => i !== index),
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

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    const stored = localStorage.getItem("etkinlikler");
    let events = stored ? JSON.parse(stored) : [];

    if (isEdit) {
      // Update existing event - compare as string
      const oldEvent = events.find((e) => String(e.id) === String(id));
      events = events.map((e) => (String(e.id) === String(id) ? formData : e));

      // Log update action
      createLog("update", "etkinlik", id, {
        before: oldEvent,
        after: formData,
      });
    } else {
      // Add new event - use string ID
      const newEvent = {
        ...formData,
        id: String(Date.now()), // String ID for consistency
      };
      events.push(newEvent);

      // Log create action
      createLog("create", "etkinlik", newEvent.id, {
        new: newEvent,
      });
    }

    localStorage.setItem("etkinlikler", JSON.stringify(events));
    navigate("/admin/etkinlikler");
  };

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h1>{isEdit ? "Etkinliği Düzenle" : "Yeni Etkinlik"}</h1>
          <p className="admin-subtitle">
            Etkinlik bilgilerini girin ve kaydedin
          </p>
        </div>
        <Link to="/admin/etkinlikler" className="btn-secondary">
          ← Geri Dön
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {/* TEMEL BİLGİLER */}
        <div className="form-section">
          <h3>Temel Bilgiler</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="title">Etkinlik Başlığı *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                required
                placeholder="TG25 - Teknoloji Günü 2025"
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
                placeholder="tg25-teknoloji-gunu"
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
                <option value="Seminer">Seminer</option>
                <option value="Workshop">Workshop</option>
                <option value="TEKNOFEST">TEKNOFEST</option>
                <option value="Teknik Gezi">Teknik Gezi</option>
                <option value="Blog">Blog</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Tarih *</label>
              <input
                type="text"
                id="date"
                name="date"
                value={formData.date || ""}
                onChange={handleChange}
                required
                placeholder="13 Aralık 2025"
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Saat</label>
              <input
                type="text"
                id="time"
                name="time"
                value={formData.time || ""}
                onChange={handleChange}
                placeholder="10:30 - 15:00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Konum</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location || ""}
                onChange={handleChange}
                placeholder="KTO Karatay Üniversitesi"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="locationLink">Konum Linki (Google Maps)</label>
              <input
                type="url"
                id="locationLink"
                name="locationLink"
                value={formData.locationLink || ""}
                onChange={handleChange}
                placeholder="https://maps.app.goo.gl/..."
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="excerpt">Kısa Açıklama *</label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt || ""}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Liste sayfasında görünecek kısa açıklama..."
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Detaylı Açıklama *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Etkinlik hakkında detaylı bilgi..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Liste Görseli URL *</label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image || ""}
                onChange={handleChange}
                required
                placeholder="/hero-anka.png"
              />
            </div>

            <div className="form-group">
              <label htmlFor="mainImage">Ana Görsel URL *</label>
              <input
                type="text"
                id="mainImage"
                name="mainImage"
                value={formData.mainImage || ""}
                onChange={handleChange}
                required
                placeholder="/tg25.png"
              />
            </div>
          </div>
        </div>

        {/* KONUŞMACILAR */}
        <div className="form-section">
          <h3>Konuşmacılar</h3>

          {formData.speakers.length > 0 && (
            <div className="items-list">
              {formData.speakers.map((speaker, index) => (
                <div key={index} className="item-card">
                  <div>
                    <strong>{speaker.name}</strong>
                    <p>
                      {speaker.title || speaker.role || "Konuşmacı"}{" "}
                      {speaker.company ? `- ${speaker.company}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSpeaker(index)}
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
                value={speakerForm.name}
                onChange={(e) =>
                  setSpeakerForm({ ...speakerForm, name: e.target.value })
                }
                placeholder="İsim"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                value={speakerForm.title}
                onChange={(e) =>
                  setSpeakerForm({ ...speakerForm, title: e.target.value })
                }
                placeholder="Ünvan"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                value={speakerForm.company}
                onChange={(e) =>
                  setSpeakerForm({ ...speakerForm, company: e.target.value })
                }
                placeholder="Şirket"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                value={speakerForm.photo}
                onChange={(e) =>
                  setSpeakerForm({ ...speakerForm, photo: e.target.value })
                }
                placeholder="Fotoğraf URL"
              />
            </div>
            <div className="form-group">
              <input
                type="url"
                value={speakerForm.linkedin}
                onChange={(e) =>
                  setSpeakerForm({ ...speakerForm, linkedin: e.target.value })
                }
                placeholder="LinkedIn URL"
              />
            </div>
            <div className="form-group">
              <button type="button" onClick={addSpeaker} className="btn-add">
                + Konuşmacı Ekle
              </button>
            </div>
          </div>
        </div>

        {/* PROGRAM */}
        <div className="form-section">
          <h3>Program</h3>

          {formData.program.length > 0 && (
            <div className="items-list">
              {formData.program.map((item, index) => (
                <div key={index} className="item-card">
                  <div>
                    <strong>{item.time}</strong>
                    <p>{item.activity}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProgram(index)}
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
                value={programForm.time}
                onChange={(e) =>
                  setProgramForm({ ...programForm, time: e.target.value })
                }
                placeholder="Saat (örn: 10:30 - 11:00)"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                value={programForm.activity}
                onChange={(e) =>
                  setProgramForm({ ...programForm, activity: e.target.value })
                }
                placeholder="Aktivite"
              />
            </div>
            <div className="form-group">
              <button type="button" onClick={addProgram} className="btn-add">
                + Program Ekle
              </button>
            </div>
          </div>
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
          <Link to="/admin/etkinlikler" className="btn-secondary">
            İptal
          </Link>
          <button type="submit" className="btn-primary">
            {isEdit ? "Değişiklikleri Kaydet" : "Etkinlik Oluştur"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminEtkinlikForm;
