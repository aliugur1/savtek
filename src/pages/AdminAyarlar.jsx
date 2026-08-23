import { useState, useEffect } from "react";
import { getSettings, saveSettings } from "../lib/dataService";
import "../styles/admin.css";

function AdminAyarlar() {
  const [settings, setSettings] = useState({
    altYonetimCount: 20,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveSettings(settings);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h1>Site Ayarları</h1>
          <p className="admin-subtitle">Genel site ayarlarını yönetin</p>
        </div>
      </div>

      {/* SUCCESS MESSAGE */}
      {showSuccess && (
        <div className="settings-success">
          <span className="settings-success-icon">✅</span>
          <span className="settings-success-text">
            Ayarlar başarıyla kaydedildi!
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        {/* EKİP AYARLARI */}
        <div className="form-section">
          <h3>Ekip Ayarları</h3>

          <div className="settings-form-group">
            <label htmlFor="altYonetimCount">Alt Yönetim Sayısı</label>
            <input
              type="number"
              id="altYonetimCount"
              name="altYonetimCount"
              value={settings.altYonetimCount}
              onChange={handleChange}
              min="0"
              placeholder="20"
            />
            <small className="settings-help-text">
              Ekip sayfasının altında görünecek alt yönetim sayısı
            </small>
          </div>

          {/* INFO BOX */}
          <div className="settings-info-box">
            <span className="settings-info-icon">ℹ️</span>
            <div className="settings-info-text">
              <strong>Not:</strong> Bu sayı, ekip sayfasının alt kısmında "Alt
              yönetim +X kişi" şeklinde görünecektir. Yönetim ve Koordinatörler
              kategorisindeki kişiler otomatik sayılır, bu alan sadece ek alt
              yönetim sayısı içindir.
            </div>
          </div>

          {/* PREVIEW */}
          <div className="settings-preview">
            <p className="settings-preview-title">
              Önizleme (Ekip sayfası alt kısmı):
            </p>
            <div className="settings-preview-content">
              Ekibimiz, toplamda <strong>X kişiden</strong> oluşmaktadır.
              <br />
              Alt yönetim <strong>
                +{settings.altYonetimCount} kişi
              </strong> ve <strong>topluluğumuzun gönüllüleri</strong>{" "}
              tarafından desteklenmektedir.
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            💾 Ayarları Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminAyarlar;
