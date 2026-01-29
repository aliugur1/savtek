import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEOMeta from "../components/SEOMeta";
import { getActiveItems } from "../utils/softDelete";
import "../styles/etkinlik.css";

function Etkinlik() {
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState(["Tümü"]);

  // Load events from localStorage (Admin panel integration)
  useEffect(() => {
    const storedEvents = localStorage.getItem("etkinlikler");
    if (storedEvents) {
      // Sadece aktif (silinmemiş) etkinlikleri göster
      const parsedEvents = getActiveItems("etkinlikler");
      setEvents(parsedEvents);

      // Extract unique categories
      const uniqueCategories = [
        "Tümü",
        ...new Set(parsedEvents.map((e) => e.category)),
      ];
      setCategories(uniqueCategories);
    } else {
      // Default dummy data
      const dummyEvents = [
        {
          id: "1",
          title: "TG25 - Teknoloji Günü 2025",
          slug: "tg25-teknoloji-gunu",
          category: "Seminer",
          date: "13 Aralık 2025",
          excerpt:
            "ASELSAN, HAVELSAN ve SIEMENS temsilcilerinin katılımıyla düzenlenen Teknoloji Günü etkinliğimiz. Savunma sanayi ve kariyer fırsatları hakkında bilgilendirme...",
          image: "/hero-anka.png",
          location: "KTO Karatay Üniversitesi",
        },
        {
          id: "2",
          title: "Roket Tasarımında CAD Kullanımı",
          slug: "roket-cad-workshop",
          category: "Workshop",
          date: "15 Kasım 2025",
          excerpt:
            "Roket takımımızın düzenlediği CAD workshop'unda, roket tasarım süreçleri ve kullanılan yazılımlar hakkında uygulamalı eğitim...",
          image: "/hero-anka.png",
          location: "SAVTEK Atölyesi",
        },
        {
          id: "3",
          title: "TEKNOFEST 2025 Hazırlık Kampı",
          slug: "teknofest-2025-kamp",
          category: "TEKNOFEST",
          date: "10 Kasım 2025",
          excerpt:
            "TEKNOFEST yarışmalarına katılacak takımlarımız için yoğun hazırlık kampı. Proje geliştirme, sunum teknikleri ve teknik eğitimler...",
          image: "/hero-anka.png",
          location: "Kampüs",
        },
        {
          id: "4",
          title: "İnsansız Hava Araçları Tanıtımı",
          slug: "iha-tanitim",
          category: "Seminer",
          date: "5 Kasım 2025",
          excerpt:
            "İHA takımımızın hazırladığı tanıtım seminerinde, insansız hava araçları teknolojisi ve proje süreçleri hakkında bilgilendirme yapıldı...",
          image: "/hero-anka.png",
          location: "Konferans Salonu",
        },
        {
          id: "5",
          title: "Arduino ile Robot Kontrolü Workshop'u",
          slug: "arduino-robot-workshop",
          category: "Workshop",
          date: "28 Ekim 2025",
          excerpt:
            "Yeni üyelerimiz için düzenlenen temel seviye Arduino workshop'u. Robot kontrol sistemleri ve sensör kullanımı uygulamaları...",
          image: "/hero-anka.png",
          location: "Laboratuvar",
        },
      ];
      setEvents(dummyEvents);
      localStorage.setItem("etkinlikler", JSON.stringify(dummyEvents));

      const uniqueCategories = [
        "Tümü",
        ...new Set(dummyEvents.map((e) => e.category)),
      ];
      setCategories(uniqueCategories);
    }
  }, []);

  // Filter events by category
  const filteredEvents =
    activeCategory === "Tümü"
      ? events
      : events.filter((event) => event.category === activeCategory);

  return (
    <>
      <SEOMeta
        title="Etkinlikler | SAVTEK"
        description="SAVTEK etkinlikleri: Workshop'lar, seminerler, yarışmalar ve teknik geziler. Güncel etkinliklerimizi keşfedin."
        image="/logo.png"
        url={typeof window !== "undefined" ? window.location.href : ""}
      />
      <main className="etkinlik-page">
        {/* HERO */}
        <section className="etkinlik-hero">
          <div className="container">
            <span className="section-label">ETKİNLİKLER</span>
            <h1>Etkinliklerimiz</h1>
            <p className="hero-subtitle">
              Workshop'lar, seminerler, yarışmalar ve teknik gezilerimiz
              hakkında güncel bilgiler.
            </p>
          </div>
        </section>

        {/* KATEGORİ FİLTRE */}
        <section className="etkinlik-filters">
          <div className="container">
            <div className="category-pills">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-pill ${
                    activeCategory === cat ? "active" : ""
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ETKİNLİK GRID */}
        <section className="etkinlik-grid-section">
          <div className="container">
            {filteredEvents.length > 0 ? (
              <div className="etkinlik-grid">
                {filteredEvents.map((event) => (
                  <article key={event.id} className="etkinlik-card">
                    <Link
                      to={`/etkinlikler/${event.slug}`}
                      className="etkinlik-image"
                    >
                      <img src={event.image} alt={event.title} loading="lazy" />
                      <div className="category-badge">{event.category}</div>
                    </Link>
                    <div className="etkinlik-content">
                      <div className="etkinlik-meta">
                        <span className="etkinlik-date">📅 {event.date}</span>
                        {event.location && (
                          <span className="etkinlik-location">
                            📍 {event.location}
                          </span>
                        )}
                      </div>
                      <Link to={`/etkinlikler/${event.slug}`}>
                        <h3>{event.title}</h3>
                      </Link>
                      <p>{event.excerpt || event.description}</p>
                      <Link
                        to={`/etkinlikler/${event.slug}`}
                        className="read-more"
                      >
                        Detaylı Bilgi →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="no-posts">
                <p>Bu kategoride henüz etkinlik bulunmuyor.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default Etkinlik;
