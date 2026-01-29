import { useState } from "react";
import Sponsors from "../components/Sponsors";
import SEOMeta from "../components/SEOMeta";
import "../styles/tg.css";

function TG() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // GALERİ FOTOĞRAFLARI (Dummy Data - 12 fotoğraf)
  const galleryImages = [
    "/tg25.png",
    "/hero-anka.png",
    "/logo.png",
    "/tg25.png",
    "/hero-anka.png",
    "/logo.png",
    "/tg25.png",
    "/hero-anka.png",
    "/logo.png",
    "/tg25.png",
    "/hero-anka.png",
    "/logo.png",
  ];

  // KONUŞMACILAR
  const speakers = [
    {
      id: 1,
      name: "Bekir Şahin",
      title: "Üretim Planlama Lideri",
      company: "ASELSAN",
      photo: "/bekir-sahin.jpg",
      linkedin: "https://www.linkedin.com/in/bekir-%C5%9Fahin-6a0189130/",
    },
    {
      id: 2,
      name: "Ayşe Yıldız Çevik",
      title: "Proje Mühendisi",
      company: "HAVELSAN",
      photo: "/ayse-yildiz-cevik.jpg",
      linkedin: "https://www.linkedin.com/in/ayseyildiz/",
    },
    {
      id: 3,
      name: "Ali Çağlar Şentürk",
      title: "Kalite Profesyoneli",
      company: "SIEMENS",
      photo: "/ali-caglar-senturk.jpg",
      linkedin: "https://www.linkedin.com/in/ali-caglar-senturk-10a014b5/",
    },
  ];

  // PROGRAM
  const program = [
    { time: "10:30 - 11:00", activity: "Açılış ve Hoş Geldiniz" },
    { time: "11:00 - 11:45", activity: "ASELSAN - Savunma Sanayi ve Kariyer" },
    {
      time: "11:45 - 12:30",
      activity: "HAVELSAN - Proje Yönetimi Deneyimleri",
    },
    { time: "12:30 - 13:15", activity: "Öğle Arası" },
    {
      time: "13:15 - 14:00",
      activity: "SIEMENS - Endüstri 4.0 ve Kalite Süreçleri",
    },
    { time: "14:00 - 15:00", activity: "Soru-Cevap ve Networking" },
  ];

  // LIGHTBOX FONKSİYONLARI
  const openLightbox = (index) => {
    setCurrentImage(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  // KEYBOARD NAVİGASYON
  const handleKeyDown = (e) => {
    if (!lightboxOpen) return;
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") closeLightbox();
  };

  return (
    <>
      <SEOMeta
        title="Teknoloji Günü 2025 | SAVTEK"
        description="TG25 - Teknoloji Günü 2025. ASELSAN, HAVELSAN ve SIEMENS temsilcilerinin katılımıyla düzenlenen savunma teknolojileri etkinliği."
        image="/tg25.png"
        url={typeof window !== "undefined" ? window.location.href : ""}
      />
      <main className="tg25-page" onKeyDown={handleKeyDown} tabIndex={0}>
        {/* HERO - AFİŞ */}
        <section className="tg25-hero">
          <div className="hero-poster">
            <img src="/tg25.png" alt="Teknoloji Günü 2025" />
          </div>
        </section>

        {/* SPONSORLAR */}
        <Sponsors showHeader={false} />

        {/* ETKİNLİK BİLGİSİ */}
        <section className="event-info">
          <div className="container">
            <div className="info-grid">
              <div className="info-card">
                <span className="info-icon">📅</span>
                <h3>Tarih & Saat</h3>
                <p>13 Aralık 2025</p>
                <p className="highlight">10:30 - 15:00</p>
              </div>
              <a
                href="https://maps.app.goo.gl/zm9TxHnWS8vsUGR7A"
                target="_blank"
                rel="noopener noreferrer"
                className="info-card info-card-link"
              >
                <span className="info-icon">📍</span>
                <h3>Konum</h3>
                <p>Konya Teknik Üniversitesi</p>
                <p className="highlight">G-241 Konferans Salonu</p>
              </a>
              <div className="info-card">
                <span className="info-icon">🎯</span>
                <h3>Katılım</h3>
                <p>Ücretsiz</p>
                <p className="highlight">Kayıt Gereklidir</p>
              </div>
            </div>
          </div>
        </section>

        {/* KONUŞMACILAR */}
        <section className="speakers-section" id="konusmacilar">
          <div className="container">
            <h2 className="section-title">Konuşmacılar</h2>
            <div className="speakers-grid">
              {speakers.map((speaker) => (
                <div key={speaker.id} className="speaker-card">
                  <div className="speaker-image">
                    <img
                      src={speaker.photo}
                      alt={speaker.name}
                      loading="lazy"
                    />
                    <div className="company-badge">{speaker.company}</div>
                  </div>
                  <div className="speaker-info">
                    <h3>{speaker.name}</h3>
                    <p className="speaker-title">{speaker.title}</p>
                    <a
                      href={speaker.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="linkedin-link"
                      aria-label={`${speaker.name} LinkedIn profili`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.8-3-1.8 0-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.4-.9 1.6-1.8 3.3-1.8 3.6 0 4.3 2.4 4.3 5.4v6.2zM5.3 7.4c-1.2 0-2.1-.9-2.1-2.1s.9-2.1 2.1-2.1 2.1.9 2.1 2.1-.9 2.1-2.1 2.1zM7 20.4H3.5V9H7v11.4z" />
                      </svg>
                      LinkedIn
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROGRAM */}
        <section className="program-section" id="program">
          <div className="container">
            <h2 className="section-title">Program</h2>
            <div className="program-timeline">
              {program.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-time">{item.time}</div>
                  <div className="timeline-activity">{item.activity}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALERİ */}
        <section className="gallery-section" id="galeri">
          <div className="container">
            <h2 className="section-title">Galeri</h2>
            <div className="gallery-grid">
              {galleryImages.slice(0, 6).map((img, index) => (
                <div
                  key={index}
                  className="gallery-item"
                  onClick={() => openLightbox(index)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") openLightbox(index);
                  }}
                  aria-label={`Galeri fotoğrafı ${index + 1}`}
                >
                  <img src={img} alt={`Galeri ${index + 1}`} loading="lazy" />
                  <div className="gallery-overlay">
                    <span className="zoom-icon">🔍</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="view-all-btn" onClick={() => openLightbox(0)}>
              Tümünü Gör ({galleryImages.length} Fotoğraf)
            </button>
          </div>
        </section>

        {/* LIGHTBOX */}
        {lightboxOpen && (
          <div className="lightbox-overlay" onClick={closeLightbox}>
            <button
              className="lightbox-close"
              onClick={closeLightbox}
              aria-label="Kapat"
            >
              ✕
            </button>
            <button
              className="lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Önceki fotoğraf"
            >
              ‹
            </button>
            <div
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryImages[currentImage]}
                alt={`Fotoğraf ${currentImage + 1}`}
              />
              <div className="lightbox-counter">
                {currentImage + 1} / {galleryImages.length}
              </div>
            </div>
            <button
              className="lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Sonraki fotoğraf"
            >
              ›
            </button>
          </div>
        )}

        {/* KAYIT BÖLÜMÜ */}
        <section className="registration-section">
          <div className="container">
            <div className="registration-cta">
              <h2>Etkinliğe Katıl</h2>
              <p>
                Teknoloji Günü 2025'e katılmak için formu doldurun. Etkinlik
                detayları ve QR kod e-posta adresinize gönderilecektir.
              </p>
              <a
                href="https://forms.gle/kUJddx64xapuK3tw6"
                target="_blank"
                rel="noopener noreferrer"
                className="register-btn"
              >
                Kayıt Formu
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default TG;
