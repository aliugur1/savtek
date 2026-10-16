import { useParams, Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import SEOMeta from "../components/SEOMeta";
import { getEventBySlug } from "../lib/dataService";
import "../styles/etkinlik-detay.css";
import { avatar } from "../lib/avatar";

const findTeamPanelEvent = (slug) => {
  try {
    for (const key of Object.keys(localStorage)) {
      if (!key.startsWith("savtek-team-panel:")) continue;
      const parsed = JSON.parse(localStorage.getItem(key) || "{}");
      const teamName = parsed?.team?.name || "Takım";
      const teamSlug = parsed?.team?.slug || "takim";
      for (const ev of (parsed?.events || [])) {
        if (`takim-${teamSlug}-${ev.id || ""}` !== slug) continue;
        return {
          title: ev.title,
          category: "Takım Etkinliği",
          date: ev.date || "",
          location: ev.location || "",
          mainImage: "/hero-anka.png",
          description: ev.description || "",
          teamName,
        };
      }
    }
  } catch { /* ignore */ }
  return null;
};

function EtkinlikDetay() {
  const { slug } = useParams();
  const [etkinlik, setEtkinlik] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    const teamFound = findTeamPanelEvent(slug);
    if (teamFound) {
      setEtkinlik(teamFound);
      setLoading(false);
      return;
    }
    getEventBySlug(slug).then((e) => { setEtkinlik(e); setLoading(false); });
  }, [slug]);

  // Lightbox functions
  const openLightbox = useCallback((index) => {
    setCurrentImage(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const nextImage = useCallback(() => {
    if (etkinlik?.gallery) {
      setCurrentImage((prev) => (prev + 1) % etkinlik.gallery.length);
    }
  }, [etkinlik]);

  const prevImage = useCallback(() => {
    if (etkinlik?.gallery) {
      setCurrentImage(
        (prev) => (prev - 1 + etkinlik.gallery.length) % etkinlik.gallery.length
      );
    }
  }, [etkinlik]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeLightbox, lightboxOpen, nextImage, prevImage]);

  if (loading) return null;

  if (!etkinlik) {
    return (
      <>
        <SEOMeta
          title="Etkinlik Bulunamadı | SAVTEK"
          description="Aradığınız etkinlik bulunamadı."
        />
        <div className="etkinlik-not-found">
          <h1>Etkinlik Bulunamadı</h1>
          <p>Aradığınız etkinlik mevcut değil veya kaldırılmış olabilir.</p>
          <Link to="/etkinlikler" className="btn-primary">
            Etkinliklere Dön
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOMeta
        title={`${etkinlik.title} | SAVTEK`}
        description={
          etkinlik.excerpt || etkinlik.description || "SAVTEK etkinliği"
        }
        image={etkinlik.mainImage || etkinlik.image || "/logo.png"}
        url={typeof window !== "undefined" ? window.location.href : ""}
      />
      <main className="etkinlik-detay-page">
        {/* BREADCRUMB */}
        <section className="breadcrumb">
          <div className="container">
            <Link to="/">Anasayfa</Link>
            <span> / </span>
            <Link to="/etkinlikler">Etkinlikler</Link>
            <span> / </span>
            <span>{etkinlik.title}</span>
          </div>
        </section>

        {/* HERO */}
        <section className="etkinlik-hero">
          <div className="container">
            <span className="etkinlik-category">{etkinlik.category}</span>
            <h1>{etkinlik.title}</h1>
          </div>
        </section>

        {/* ANA GÖRSEL */}
        <section className="etkinlik-image-section">
          <div className="container">
            <div className="etkinlik-main-image">
              <img
                src={etkinlik.mainImage || etkinlik.image}
                alt={etkinlik.title}
              />
            </div>
          </div>
        </section>

        {/* ETKİNLİK BİLGİLERİ */}
        <section className="etkinlik-info">
          <div className="container">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-icon">📅</span>
                <div>
                  <h3>Tarih & Saat</h3>
                  <p>{etkinlik.date}</p>
                  {etkinlik.time && (
                    <p className="highlight">{etkinlik.time}</p>
                  )}
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <h3>Konum</h3>
                  <p>{etkinlik.location || "Belirtilmedi"}</p>
                  {etkinlik.locationLink && etkinlik.locationLink !== "#" && (
                    <a
                      href={etkinlik.locationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="location-link"
                    >
                      Haritada Gör →
                    </a>
                  )}
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">🎯</span>
                <div>
                  <h3>Kategori</h3>
                  <p className="highlight">{etkinlik.category}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DETAYLI AÇIKLAMA */}
        <section className="etkinlik-about">
          <div className="container">
            <h2>Etkinlik Hakkında</h2>
            <p>{etkinlik.description || etkinlik.excerpt}</p>
          </div>
        </section>

        {/* KONUŞMACILAR */}
        {etkinlik.speakers && etkinlik.speakers.length > 0 && (
          <section className="etkinlik-speakers">
            <div className="container">
              <h2>Konuşmacılar</h2>
              <div className="speakers-grid">
                {etkinlik.speakers.map((speaker, index) => (
                  <div key={index} className="speaker-card">
                    <div className="speaker-image">
                      <img
                        {...avatar(speaker.photo)}
                        alt={speaker.name}
                        loading="lazy"
                      />
                      <div className="company-badge">{speaker.company}</div>
                    </div>
                    <div className="speaker-info">
                      <h3>{speaker.name}</h3>
                      <p className="speaker-title">{speaker.title}</p>
                      {speaker.linkedin && (
                        <a
                          href={speaker.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="linkedin-link"
                          aria-label={`${speaker.name} LinkedIn`}
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
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* PROGRAM */}
        {etkinlik.program && etkinlik.program.length > 0 && (
          <section className="etkinlik-program">
            <div className="container">
              <h2>Program</h2>
              <div className="program-timeline">
                {etkinlik.program.map((item, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-time">{item.time}</div>
                    <div className="timeline-activity">{item.activity}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* GALERİ */}
        {etkinlik.gallery && etkinlik.gallery.length > 0 && (
          <section className="etkinlik-galeri">
            <div className="container">
              <h2>Galeri</h2>
              <div className="galeri-grid">
                {etkinlik.gallery.slice(0, 6).map((img, index) => (
                  <div
                    key={index}
                    className="galeri-item"
                    onClick={() => openLightbox(index)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") openLightbox(index);
                    }}
                    aria-label={`Galeri fotoğrafı ${index + 1}`}
                  >
                    <img src={img} alt={`Galeri ${index + 1}`} loading="lazy" />
                    <div className="galeri-overlay">
                      <span className="zoom-icon">🔍</span>
                    </div>
                  </div>
                ))}
              </div>
              {etkinlik.gallery.length > 6 && (
                <button
                  className="view-all-btn"
                  onClick={() => openLightbox(0)}
                >
                  Tümünü Gör ({etkinlik.gallery.length} Fotoğraf)
                </button>
              )}
            </div>
          </section>
        )}

        {/* LIGHTBOX */}
        {lightboxOpen && etkinlik.gallery && (
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
                src={etkinlik.gallery[currentImage]}
                alt={`Fotoğraf ${currentImage + 1}`}
              />
              <div className="lightbox-counter">
                {currentImage + 1} / {etkinlik.gallery.length}
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
      </main>
    </>
  );
}

export default EtkinlikDetay;
