import { useState, useEffect } from "react";
import "../styles/sponsors.css";

export default function Sponsors({ showHeader = true }) {
  const [sponsors, setSponsors] = useState([]);

  // Load sponsors from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("sponsorlar");
    if (stored) {
      const parsedSponsors = JSON.parse(stored);
      // Sort by order
      const sorted = parsedSponsors.sort(
        (a, b) => (a.order || 999) - (b.order || 999)
      );
      setSponsors(sorted);
    } else {
      // Default sponsors if none exist
      const defaultSponsors = [
        {
          id: "1",
          name: "KTÜN",
          logo: "/sponsors/ktun.png",
          website: "https://ktun.edu.tr",
          order: 1,
        },
        {
          id: "2",
          name: "SAVTEK",
          logo: "/sponsors/savtek.png",
          website: "https://savtek.com",
          order: 2,
        },
        {
          id: "3",
          name: "Teknofest",
          logo: "/sponsors/teknofest.png",
          website: "https://teknofest.org",
          order: 3,
        },
      ];
      setSponsors(defaultSponsors);
      localStorage.setItem("sponsorlar", JSON.stringify(defaultSponsors));
    }
  }, []);

  // Smooth infinite scroll için sponsor listesini 3 kere tekrarla
  const extendedSponsors = [...sponsors, ...sponsors, ...sponsors];

  return (
    <section className="sponsors-section">
      <div className="container">
        {/* Header - isteğe bağlı */}
        {showHeader && (
          <div className="section-header">
            <span className="section-label">DESTEKÇİLERİMİZ</span>
            <h2 className="sponsors-title">Sponsorlarımız</h2>
            <p>
              Projelerimize değer katan ve gelişimimize katkıda bulunan değerli
              sponsorlarımıza teşekkür ederiz.
            </p>
          </div>
        )}

        {/* Sponsor Slider */}
        {sponsors.length > 0 ? (
          <div className="sponsors-track-container">
            <div className="sponsors-track">
              {extendedSponsors.map((sponsor, index) => (
                <a
                  key={`${sponsor.id}-${index}`}
                  className="sponsor-item"
                  href={sponsor.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${sponsor.name} web sitesine git`}
                >
                  <img
                    src={sponsor.logo}
                    alt={`${sponsor.name} logo`}
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            <p>Henüz sponsor eklenmemiş.</p>
          </div>
        )}
      </div>
    </section>
  );
}
