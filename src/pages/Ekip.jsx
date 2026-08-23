import { useState, useEffect } from "react";
import Sponsors from "../components/Sponsors";
import SEOMeta from "../components/SEOMeta";
import { getEkip, getSettings } from "../lib/dataService";
import "../styles/ekip.css";

function Ekip() {
  const [ekipUyeleri, setEkipUyeleri] = useState([]);
  const [settings, setSettings] = useState({ altYonetimCount: 20 });

  useEffect(() => {
    getEkip().then(setEkipUyeleri);
    getSettings().then(setSettings);
  }, []);

  // Filter by category
  const yonetim = ekipUyeleri
    .filter((u) => u.category === "Yönetim")
    .sort((a, b) => (a.order || 999) - (b.order || 999));

  const koordinatorler = ekipUyeleri
    .filter((u) => u.category === "Koordinatörlük")
    .sort((a, b) => (a.order || 999) - (b.order || 999));

  // Group coordinators by coordination title
  const koordinatorlukGroups = koordinatorler.reduce((acc, member) => {
    const title = member.coordinationTitle || "Diğer Koordinatörler";
    if (!acc[title]) {
      acc[title] = [];
    }
    acc[title].push(member);
    return acc;
  }, {});

  // Calculate counts (excluding volunteers from display)
  const displayedCount = yonetim.length + koordinatorler.length;

  // Social media icon components
  const LinkedInIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.8-3-1.8 0-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.4-.9 1.6-1.8 3.3-1.8 3.6 0 4.3 2.4 4.3 5.4v6.2zM5.3 7.4c-1.2 0-2.1-.9-2.1-2.1s.9-2.1 2.1-2.1 2.1.9 2.1 2.1-.9 2.1-2.1 2.1zM7 20.4H3.5V9H7v11.4z" />
    </svg>
  );

  const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );

  return (
    <>
      <SEOMeta
        title="Ekip | SAVTEK"
        description="SAVTEK yönetim ekibi ve koordinatörler. Topluluğumuzu yöneten, vizyonunu belirleyen liderlik kadrosu."
        image="/logo.png"
        url={typeof window !== "undefined" ? window.location.href : ""}
      />
      <main className="ekip-page">
        {/* HERO */}
        <section className="ekip-hero">
          <div className="container">
            <span className="section-label">EKİP</span>
            <h1>Yönetim Ekibimiz</h1>
            <p className="hero-subtitle">
              SAVTEK'i yöneten, vizyonunu belirleyen ve topluluğun büyümesini
              sağlayan liderlik kadrosu.
            </p>
          </div>
        </section>

        {/* BAŞKAN & BAŞKAN YARDIMCISI (Başlıksız, vurgulu) */}
        {yonetim.length > 0 && (
          <section className="baskanlik">
            <div className="container">
              <div className="baskanlik-grid">
                {yonetim.map((person) => (
                  <div key={person.id} className="leader-card">
                    <div className="leader-image">
                      <img
                        src={person.photo}
                        alt={person.name}
                        loading="lazy"
                      />
                      <div className="leader-socials">
                        {person.linkedin && (
                          <a
                            href={person.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${person.name} LinkedIn`}
                          >
                            <LinkedInIcon />
                          </a>
                        )}
                        {person.instagram && (
                          <a
                            href={person.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${person.name} Instagram`}
                          >
                            <InstagramIcon />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="leader-info">
                      <h3>{person.name}</h3>
                      <p className="leader-role">{person.role}</p>
                      <p className="leader-department">{person.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* KOORDİNATÖRLÜKLER */}
        {koordinatorler.length > 0 && (
          <section className="koordinatorlukler">
            <div className="container">
              {Object.entries(koordinatorlukGroups).map(([title, members]) => (
                <div key={title} className="koordinatorluk-section">
                  <h2 className="koordinatorluk-title">{title}</h2>
                  <div className="koordinator-grid">
                    {members.map((member) => (
                      <div key={member.id} className="koordinator-card">
                        <div className="koordinator-image-placeholder">
                          <img
                            src={member.photo || "/baskan.png"}
                            alt={member.name}
                            loading="lazy"
                          />
                          <div className="koordinator-socials">
                            {member.linkedin && (
                              <a
                                href={member.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${member.name} LinkedIn`}
                              >
                                <LinkedInIcon />
                              </a>
                            )}
                            {member.instagram && (
                              <a
                                href={member.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${member.name} Instagram`}
                              >
                                <InstagramIcon />
                              </a>
                            )}
                          </div>
                        </div>
                        <h3>{member.name}</h3>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#666",
                            marginTop: "4px",
                          }}
                        >
                          {member.role}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ALT YÖNETİM NOTE */}
        <section className="alt-yonetim-note">
          <div className="container">
            <p>
              Ekibimiz, toplamda <strong>{displayedCount} kişiden</strong>{" "}
              oluşmaktadır.
              <br />
              Alt yönetim <strong>
                +{settings.altYonetimCount} kişi
              </strong> ve <strong>topluluğumuzun gönüllüleri</strong>{" "}
              tarafından desteklenmektedir.
            </p>
          </div>
        </section>

        {/* SPONSORLAR */}
        <Sponsors showHeader={false} />
      </main>
    </>
  );
}

export default Ekip;
