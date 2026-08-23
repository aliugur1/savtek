import { useState } from "react";
import { motion } from "framer-motion";
import { saveApplication } from "../lib/dataService";
import "../styles/basvuru.css";

const TEAMS = ["İHA / Drone", "Roket", "Otonom Araç", "Yazılım", "Elektronik", "Yönetim & Medya", "Henüz karar vermedim"];
const DEPARTMENTS = ["Bilgisayar Mühendisliği", "Elektrik-Elektronik Mühendisliği", "Makine Mühendisliği", "Havacılık ve Uzay Mühendisliği", "Endüstri Mühendisliği", "Diğer"];

function Basvuru() {
  const [form, setForm] = useState({ name: "", email: "", department: "", teamInterest: "", motivation: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) { setError("Ad ve e-posta zorunludur."); return; }
    setSubmitting(true);
    setError("");
    try {
      await saveApplication(form);
      setSuccess(true);
    } catch (err) {
      setError("Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="basvuru-page">
        <div className="basvuru-form-wrapper">
          <motion.div className="basvuru-success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <h2>✓ Başvurun Alındı!</h2>
            <p>Başvurun ekibimize iletildi. En kısa sürede <strong>{form.email}</strong> adresine geri dönüş yapacağız.</p>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="basvuru-page">
      <div className="basvuru-hero">
        <h1>Bize Katıl</h1>
        <p>SAVTEK bünyesinde yer almak ve takımlarımızda görev almak için aşağıdaki formu doldur. Seni tanımak isteriz!</p>
      </div>

      <div className="basvuru-form-wrapper">
        <motion.form className="basvuru-form" onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="basvuru-form-row">
            <div className="form-group">
              <label>Ad Soyad *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Adın ve soyadın" required />
            </div>
            <div className="form-group">
              <label>E-posta *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="ornek@mail.com" required />
            </div>
          </div>

          <div className="basvuru-form-row">
            <div className="form-group">
              <label>Bölüm</label>
              <select name="department" value={form.department} onChange={handleChange}>
                <option value="">Bölüm seç</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>İlgilendiğin Takım</label>
              <select name="teamInterest" value={form.teamInterest} onChange={handleChange}>
                <option value="">Takım seç</option>
                {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Motivasyon / Kendini Tanıt</label>
            <textarea
              name="motivation"
              value={form.motivation}
              onChange={handleChange}
              placeholder="Neden SAVTEK'e katılmak istiyorsun? Neler yapabilirsin?"
              rows={5}
            />
          </div>

          {error && <p className="basvuru-error">{error}</p>}

          <button type="submit" className="basvuru-submit" disabled={submitting}>
            {submitting ? "Gönderiliyor..." : "Başvuruyu Gönder →"}
          </button>
        </motion.form>
      </div>
    </main>
  );
}

export default Basvuru;
