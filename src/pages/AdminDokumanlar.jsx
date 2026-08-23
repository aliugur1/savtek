import { useEffect, useMemo, useState } from "react";
import "../styles/admin.css";

function AdminDokumanlar() {
  const [documents, setDocuments] = useState([]);
  const [draft, setDraft] = useState({ title: "", year: String(new Date().getFullYear()) });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("dokumanlar");
      if (raw) setDocuments(JSON.parse(raw));
    } catch {
      setDocuments([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("dokumanlar", JSON.stringify(documents));
    } catch {
      // ignore
    }
  }, [documents]);

  const docsByYear = useMemo(() => {
    const map = new Map();
    (documents || []).forEach((d) => {
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

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!draft.title.trim()) {
      setError("Doküman başlığı gerekli.");
      return;
    }

    if (!file) {
      setError("PDF dosyası seçin.");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Sadece PDF yüklenebilir.");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError("PDF çok büyük. 3MB altı deneyin.");
      return;
    }

    const readAsDataUrl = (f) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("read_failed"));
        reader.readAsDataURL(f);
      });

    try {
      const dataUrl = await readAsDataUrl(file);
      const newDoc = {
        id: "d-" + Date.now() + "-" + Math.random().toString(16).slice(2),
        title: draft.title.trim(),
        year: String(draft.year || new Date().getFullYear()),
        fileName: file.name,
        mime: file.type,
        size: file.size,
        dataUrl,
        createdAt: new Date().toISOString(),
      };

      setDocuments((prev) => [newDoc, ...(prev || [])]);
      setDraft({ title: "", year: String(new Date().getFullYear()) });
      setFile(null);
      e.target?.reset?.();
    } catch {
      setError("Dosya okunamadı.");
    }
  };

  const remove = (id) => {
    if (!window.confirm("Dokümanı silmek istiyor musunuz?")) return;
    setDocuments((prev) => (prev || []).filter((d) => d.id !== id));
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Dokümanlar</h1>
          <p className="admin-subtitle">Takım belgelerini buradan yükleyip yönetebilirsiniz</p>
        </div>
      </div>

      <div className="content-card" style={{ marginBottom: 20 }}>
        <h3>PDF Yükle</h3>
        <form onSubmit={submit} className="admin-form" style={{ marginTop: 14 }}>
          <div className="form-grid">
            <div className="form-group">
              <label>Doküman başlığı</label>
              <input
                value={draft.title}
                onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label>Yıl</label>
              <input
                type="number"
                min="2000"
                max="2100"
                value={draft.year}
                onChange={(e) => setDraft((p) => ({ ...p, year: e.target.value }))}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>PDF dosyası</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  setError("");
                  setFile(e.target.files?.[0] || null);
                }}
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary">
            Yükle
          </button>
        </form>
      </div>

      <div className="content-card">
        <h3>Yüklenen Belgeler</h3>

        {(documents || []).length === 0 ? (
          <p style={{ marginTop: 12, color: "#666" }}>Henüz doküman yok.</p>
        ) : (
          <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
            {docsByYear.map((group) => (
              <div key={group.year} className="admin-table-container">
                <div style={{ padding: "12px 14px", fontWeight: 800 }}>{group.year}</div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Başlık</th>
                      <th>Dosya</th>
                      <th>Boyut</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.docs.map((d) => (
                      <tr key={d.id}>
                        <td>{d.title}</td>
                        <td>{d.fileName}</td>
                        <td>{Math.round((d.size || 0) / 1024)} KB</td>
                        <td style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          <a
                            className="btn-secondary"
                            href={d.dataUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Görüntüle
                          </a>
                          <a className="btn-secondary" href={d.dataUrl} download={d.fileName || "dokuman.pdf"}>
                            İndir
                          </a>
                          <button className="btn-secondary" onClick={() => remove(d.id)} type="button" style={{ background: "#ef4444", color: "#fff" }}>
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDokumanlar;
