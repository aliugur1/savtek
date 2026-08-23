import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getGallery } from "../lib/dataService";
import "../styles/galeri.css";

function Galeri() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    getGallery().then(data => { setPhotos(data); setLoading(false); });
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const handle = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox(i => (i + 1) % photos.length);
      if (e.key === "ArrowLeft") setLightbox(i => (i - 1 + photos.length) % photos.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handle);
    return () => { window.removeEventListener("keydown", handle); document.body.style.overflow = ""; };
  }, [lightbox, photos.length]);

  const current = lightbox !== null ? photos[lightbox] : null;

  return (
    <main className="galeri-page">
      <div className="galeri-header">
        <h1>Medya ve Galeri</h1>
        <p>SAVTEK olarak katıldığımız yarışmalar, atölye çalışmalarımız ve etkinliklerimizden kareler.</p>
      </div>

      {loading ? (
        <div className="galeri-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="galeri-item skeleton" style={{ minHeight: "240px" }} />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <p style={{ textAlign: "center", padding: "60px 0", opacity: 0.5 }}>Henüz fotoğraf eklenmemiş.</p>
      ) : (
        <div className="galeri-grid">
          {photos.map((item, index) => (
            <motion.div
              key={item.id}
              className="galeri-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              onClick={() => setLightbox(index)}
            >
              <img src={item.img} alt={item.title} loading="lazy" />
              <div className="galeri-overlay">
                <h3>{item.title}</h3>
                {item.desc && <p>{item.desc}</p>}
              </div>
              <div className="galeri-zoom-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {current && (
          <motion.div className="lightbox-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}>
            <motion.div className="lightbox-content" initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.88, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Kapat">✕</button>
              <button className="lightbox-nav lightbox-prev" onClick={() => setLightbox(i => (i - 1 + photos.length) % photos.length)} aria-label="Önceki">‹</button>
              <img src={current.img} alt={current.title} className="lightbox-img" />
              <button className="lightbox-nav lightbox-next" onClick={() => setLightbox(i => (i + 1) % photos.length)} aria-label="Sonraki">›</button>
              {(current.title || current.desc) && (
                <div className="lightbox-caption">
                  {current.title && <h3>{current.title}</h3>}
                  {current.desc && <p>{current.desc}</p>}
                </div>
              )}
              <div className="lightbox-counter">{lightbox + 1} / {photos.length}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default Galeri;
