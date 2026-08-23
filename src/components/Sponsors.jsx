import { useState, useEffect } from "react";
import { getSponsors } from "../lib/dataService";
import "../styles/sponsors.css";

export default function Sponsors({ showHeader = true }) {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    getSponsors().then(setSponsors);
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
