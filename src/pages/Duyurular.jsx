import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAnnouncements } from "../lib/dataService";
import "../styles/duyurular.css";

const TYPE_LABELS = { info: "Bilgi", warning: "Uyarı", success: "Haber", error: "Önemli" };

function Duyurular() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnnouncements({ activeOnly: true }).then(data => {
      const now = new Date();
      setAnnouncements(data.filter(a => !a.expiresAt || new Date(a.expiresAt) > now));
      setLoading(false);
    });
  }, []);

  return (
    <main className="duyurular-page">
      <div className="duyurular-header">
        <h1>Duyurular</h1>
        <p>SAVTEK'ten güncel haberler ve duyurular.</p>
      </div>

      <div className="duyurular-list">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="duyuru-card skeleton" style={{ height: 90 }} />
          ))
        ) : announcements.length === 0 ? (
          <div className="duyurular-empty">Şu an aktif duyuru bulunmuyor.</div>
        ) : (
          announcements.map((a, i) => (
            <motion.div
              key={a.id}
              className={`duyuru-card ${a.type ?? "info"}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="duyuru-card-top">
                <h3>{a.pinned && "📌 "}{a.title}</h3>
                <span className={`duyuru-badge ${a.pinned ? "pinned" : a.type}`}>
                  {a.pinned ? "Sabitlenmiş" : TYPE_LABELS[a.type] ?? "Bilgi"}
                </span>
              </div>
              {a.content && <p>{a.content}</p>}
              <div className="duyuru-card-date">
                {new Date(a.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </main>
  );
}

export default Duyurular;
