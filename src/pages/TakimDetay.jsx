import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SEOMeta from "../components/SEOMeta";
import { getActiveItems } from "../utils/softDelete";
import "../styles/takim-detay.css";

function TakimDetay() {
  const { slug } = useParams();
  const [takim, setTakim] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // localStorage'dan takımı yükle
  useEffect(() => {
    // Sadece aktif (silinmemiş) takımları kontrol et
    const takimlar = getActiveItems("takimlar");
    const bulunanTakim = takimlar.find((t) => t.slug === slug);

    if (bulunanTakim) {
      setTakim(bulunanTakim);
    }
  }, [slug]);

  // Lightbox fonksiyonları
  const openLightbox = (index) => {
    setCurrentImage(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const nextImage = () => {
    if (takim?.gallery) {
      setCurrentImage((prev) => (prev + 1) % takim.gallery.length);
    }
  };

  const prevImage = () => {
    if (takim?.gallery) {
      setCurrentImage(
        (prev) => (prev - 1 + takim.gallery.length) % takim.gallery.length
      );
    }
  };

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
  }, [lightboxOpen, takim]);

  // Takım bulunamadıysa
  if (!takim) {
    return (
      <>
        <SEOMeta
          title="Takım Bulunamadı | SAVTEK"
          description="Aradığınız takım bulunamadı."
        />
        <div className="takim-not-found">
          <div className="container">
            <h1>Takım Bulunamadı</h1>
            <p>Aradığınız takım sayfası mevcut değil.</p>
            <Link to="/takimlar" className="btn-primary">
              ← Takımlara Dön
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOMeta
        title={`${takim.name} | SAVTEK`}
        description={
          takim.shortDescription ||
          takim.description ||
          `${takim.name} takımı hakkında bilgiler`
        }
        image={takim.image || "/logo.png"}
        url={typeof window !== "undefined" ? window.location.href : ""}
      />
      <main className="takim-detay-page">
        {/* BREADCRUMB */}
        <div className="breadcrumb">
          <div className="container">
            <Link to="/">Anasayfa</Link>
            <span> / </span>
            <Link to="/takimlar">Takımlar</Link>
            <span> / </span>
            <span>{takim.name}</span>
          </div>
        </div>

        {/* HERO */}
        <section className="takim-hero">
          <div className="container">
            <span className="takim-category">
              {takim.area || takim.category}
            </span>
            <h1>{takim.name}</h1>
          </div>
        </section>

        {/* GÖRSEL */}
        <section className="takim-image-section">
          <div className="container">
            <div className="takim-main-image">
              <img src={takim.image} alt={takim.name} />
            </div>
          </div>
        </section>

        {/* HAKKINDA */}
        {takim.description && (
          <section className="takim-about">
            <div className="container">
              <h2>Takım Hakkında</h2>
              <p className="lead">{takim.description}</p>
            </div>
          </section>
        )}

        {/* EKİP ÜYELERİ */}
        {takim.members && takim.members.length > 0 && (
          <section className="takim-ekip">
            <div className="container">
              <h2>Ekip Üyelerimiz</h2>
              <div className="ekip-grid">
                {takim.members.map((member, index) => (
                  <div key={index} className="ekip-card">
                    <div className="ekip-photo">
                      <img
                        src={member.photo || "/logo.png"}
                        alt={member.name}
                        loading="lazy"
                      />
                    </div>
                    <h4>{member.name}</h4>
                    <span className="ekip-role">{member.role}</span>
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ekip-linkedin"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.8-3-1.8 0-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.4-.9 1.6-1.8 3.3-1.8 3.6 0 4.3 2.4 4.3 5.4v6.2zM5.3 7.4c-1.2 0-2.1-.9-2.1-2.1s.9-2.1 2.1-2.1 2.1.9 2.1 2.1-.9 2.1-2.1 2.1zM7 20.4H3.5V9H7v11.4z" />
                        </svg>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* BAŞARILAR & TEKNOLOJİLER */}
        {((takim.achievements && takim.achievements.length > 0) ||
          (takim.technologies && takim.technologies.length > 0)) && (
          <section className="takim-details">
            <div className="container">
              <div className="details-grid">
                {takim.achievements && takim.achievements.length > 0 && (
                  <div className="detail-column">
                    <h3>Projeler & Başarılar</h3>
                    <ul className="achievement-list">
                      {takim.achievements.map((achievement, index) => (
                        <li key={index}>
                          <span className="check-icon">✓</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {takim.technologies && takim.technologies.length > 0 && (
                  <div className="detail-column">
                    <h3>Kullanılan Teknolojiler</h3>
                    <div className="tech-tags">
                      {takim.technologies.map((tech, index) => (
                        <span key={index} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* GALERİ */}
        {takim.gallery && takim.gallery.length > 0 && (
          <section className="takim-galeri">
            <div className="container">
              <h2>Galeri</h2>
              <div className="galeri-grid">
                {takim.gallery.slice(0, 6).map((img, index) => (
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
              {takim.gallery.length > 6 && (
                <button
                  className="view-all-btn"
                  onClick={() => openLightbox(0)}
                >
                  Tümünü Gör ({takim.gallery.length} Fotoğraf)
                </button>
              )}
            </div>
          </section>
        )}

        {/* SPONSORLAR */}
        {takim.sponsors && takim.sponsors.length > 0 && (
          <section className="takim-sponsors">
            <div className="container">
              <h2>Takım Sponsorlarımız</h2>
              <p className="sponsors-subtitle">
                Projelerimize değerli destekleri için teşekkür ederiz
              </p>
              <div className="sponsors-grid">
                {takim.sponsors.map((sponsor, index) => (
                  <div key={index} className="sponsor-item">
                    <div className="sponsor-logo-wrapper">
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="sponsor-logo"
                        loading="lazy"
                      />
                      <div className="sponsor-hover-overlay">
                        {sponsor.instagram && (
                          <a
                            href={sponsor.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sponsor-social-link"
                            aria-label={`${sponsor.name} Instagram`}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                          </a>
                        )}
                        {sponsor.linkedin && (
                          <a
                            href={sponsor.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sponsor-social-link"
                            aria-label={`${sponsor.name} LinkedIn`}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.8-3-1.8 0-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.4-.9 1.6-1.8 3.3-1.8 3.6 0 4.3 2.4 4.3 5.4v6.2zM5.3 7.4c-1.2 0-2.1-.9-2.1-2.1s.9-2.1 2.1-2.1 2.1.9 2.1 2.1-.9 2.1-2.1 2.1zM7 20.4H3.5V9H7v11.4z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                    <span className="sponsor-name">{sponsor.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* LIGHTBOX */}
        {lightboxOpen && takim.gallery && (
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
                src={takim.gallery[currentImage]}
                alt={`Fotoğraf ${currentImage + 1}`}
              />
              <div className="lightbox-counter">
                {currentImage + 1} / {takim.gallery.length}
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

        {/* CTA */}
        <section className="takim-cta">
          <div className="container">
            <h2>Takıma Katılmak İster Misin?</h2>
            <p>
              SAVTEK takımlarına katılarak projelerimizde yer alabilir,
              mühendislik deneyimi kazanabilirsin.
            </p>
            <div className="cta-buttons">
              <Link to="/#iletisim" className="btn-primary">
                Bize Ulaş
              </Link>
              <Link to="/takimlar" className="btn-outline">
                Diğer Takımlar
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default TakimDetay;
