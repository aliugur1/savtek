import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getProjects } from "../lib/dataService";
import "../styles/projeler.css";

function Projeler() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tümü");

  useEffect(() => {
    getProjects().then(data => { setProjects(data); setLoading(false); });
  }, []);

  const categories = ["Tümü", ...new Set(projects.map(p => p.category).filter(Boolean))];
  const filtered = activeCategory === "Tümü" ? projects : projects.filter(p => p.category === activeCategory);

  return (
    <main className="projeler-page">
      <div className="projeler-header">
        <h1>Projeler</h1>
        <p>SAVTEK takımlarının geliştirdiği yarışma projeleri ve AR-GE çalışmaları.</p>
      </div>

      {categories.length > 2 && (
        <div className="projeler-filters">
          {categories.map(c => (
            <button
              key={c}
              className={`projeler-filter-btn ${activeCategory === c ? "active" : ""}`}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="projeler-grid">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="proje-card skeleton" style={{ height: 360 }} />
          ))
        ) : filtered.length === 0 ? (
          <div className="projeler-empty">Henüz proje eklenmemiş.</div>
        ) : (
          filtered.map((p, i) => (
            <motion.div
              key={p.id}
              className="proje-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="proje-card-img">
                {p.image
                  ? <img src={p.image} alt={p.title} loading="lazy" />
                  : <div className="proje-card-img-placeholder">🔬</div>
                }
                {p.featured && <span className="proje-featured-badge">⭐ Öne Çıkan</span>}
              </div>

              <div className="proje-card-body">
                <div className="proje-card-meta">
                  {p.team && <span className="proje-tag">{p.team}</span>}
                  {p.category && <span className="proje-tag">{p.category}</span>}
                  {p.year && <span className="proje-tag">{p.year}</span>}
                </div>

                <h3>{p.title}</h3>
                {p.description && <p>{p.description}</p>}

                {p.technologies?.length > 0 && (
                  <div className="proje-tech-list">
                    {p.technologies.map((t, ti) => <span key={ti} className="proje-tech">{t}</span>)}
                  </div>
                )}

                {(p.links?.github || p.links?.demo) && (
                  <div className="proje-links">
                    {p.links.github && <a href={p.links.github} className="proje-link" target="_blank" rel="noopener noreferrer">GitHub</a>}
                    {p.links.demo && <a href={p.links.demo} className="proje-link" target="_blank" rel="noopener noreferrer">Demo</a>}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </main>
  );
}

export default Projeler;
