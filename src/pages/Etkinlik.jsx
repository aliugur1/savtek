import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEOMeta from "../components/SEOMeta";
import { getEvents } from "../lib/dataService";
import "../styles/etkinlik.css";

const readTeamPanelEvents = () => {
  const teamEvents = [];
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("savtek-team-panel:"))
      .forEach((key) => {
        const parsed = JSON.parse(localStorage.getItem(key) || "{}");
        const teamName = parsed?.team?.name || "Takım";
        const teamSlug = parsed?.team?.slug || "takim";
        (parsed?.events || []).forEach((ev) => {
          teamEvents.push({
            id: `team-${teamSlug}-${ev.id || ""}`,
            slug: `takim-${teamSlug}-${ev.id || ""}`,
            title: ev.title,
            category: "Takım Etkinliği",
            date: ev.date || "",
            excerpt: ev.description || "",
            image: "/hero-anka.png",
            location: ev.location || "",
            teamName,
            isTeamEvent: true,
          });
        });
      });
  } catch { /* ignore */ }
  return teamEvents;
};

function Etkinlik() {
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents().then((base) => {
      const team = readTeamPanelEvents();
      setEvents([...team, ...base]);
    });
  }, []);

  const categories = useMemo(
    () => ["Tümü", ...new Set(events.map((e) => e.category))],
    [events]
  );

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
                      {event.isTeamEvent && (
                        <div className="team-event-badge">Takım Etkinliği</div>
                      )}
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
                      {event.isTeamEvent && event.teamName && (
                        <div className="team-event-team">{event.teamName}</div>
                      )}
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
