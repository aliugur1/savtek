import { useEffect, useMemo, useState } from "react";
import "../styles/panel.css";

function Panel() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem("dokumanlar");
        setDocuments(raw ? JSON.parse(raw) : []);
      } catch {
        setDocuments([]);
      }
    };

    read();
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);

  const docCount = documents?.length || 0;

  const docsByYear = useMemo(() => {
    const docs = documents || [];
    const map = new Map();
    docs.forEach((d) => {
      const y = String(d.year || "");
      if (!map.has(y)) map.set(y, []);
      map.get(y).push(d);
    });
    return Array.from(map.entries())
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      .map(([year, docs]) => ({
        year,
        docs: docs.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")),
      }));
  }, [documents]);

  return (
    <main className="container panel-page">
      <div className="panel-header">
        <div>
          <h1 className="panel-title">Belgeler</h1>
          <p className="panel-subtitle">
            Takım belgelerini buradan görüntüleyebilir ve indirebilirsin.
          </p>
        </div>
      </div>

      <div className="panel-grid">
        <div className="panel-card">
          <div className="panel-card-label">Toplam doküman</div>
          <div className="panel-card-value">{docCount}</div>
        </div>
      </div>

      <div className="panel-shell">
        <div className="panel-body">
          <section>
            <h2 className="panel-section-title">Dokümanlar (PDF)</h2>

            {(documents || []).length === 0 ? (
              <div className="panel-muted">Henüz doküman yok.</div>
            ) : (
              <div className="panel-docs">
                {docsByYear.map((group) => (
                  <div key={group.year} className="panel-doc-year">
                    <div className="panel-doc-year-title">{group.year}</div>
                    <div className="panel-doc-list">
                      {group.docs.map((d) => (
                        <div key={d.id} className="panel-doc-item">
                          <div className="panel-doc-main">
                            <div className="panel-doc-title">{d.title}</div>
                            <div className="panel-doc-meta">
                              {d.fileName} • {Math.round((d.size || 0) / 1024)} KB
                            </div>
                          </div>
                          <div className="panel-doc-actions">
                            <a
                              className="panel-doc-link"
                              href={d.dataUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Görüntüle
                            </a>
                            <a
                              className="panel-doc-link"
                              href={d.dataUrl}
                              download={d.fileName || "dokuman.pdf"}
                            >
                              İndir
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default Panel;
