import { useState, useEffect } from "react";
import { getAnnouncements } from "../lib/dataService";
import "../styles/announcement.css";

function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState([]);
  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("dismissed_ann") || "[]"); }
    catch { return []; }
  });

  useEffect(() => {
    getAnnouncements({ activeOnly: true }).then(data => {
      const now = new Date();
      setAnnouncements(data.filter(a => !a.expiresAt || new Date(a.expiresAt) > now));
    });
  }, []);

  const dismiss = (id) => {
    const next = [...dismissed, id];
    setDismissed(next);
    try { sessionStorage.setItem("dismissed_ann", JSON.stringify(next)); } catch {}
  };

  const visible = announcements.filter(a => !dismissed.includes(a.id));
  if (!visible.length) return null;

  return (
    <div className="announcement-stack">
      {visible.map(a => (
        <div key={a.id} className={`announcement-bar announcement-${a.type ?? "info"}`}>
          <span className="announcement-text">
            {a.pinned && <span className="announcement-pin">📌</span>}
            <strong>{a.title}</strong>
            {a.content && <span> — {a.content}</span>}
          </span>
          <button className="announcement-close" onClick={() => dismiss(a.id)} aria-label="Kapat">✕</button>
        </div>
      ))}
    </div>
  );
}

export default AnnouncementBanner;
