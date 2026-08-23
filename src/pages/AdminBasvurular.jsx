import { useState, useEffect } from "react";
import { getApplications, updateApplicationStatus, deleteApplication } from "../lib/dataService";
import "../styles/admin.css";

const STATUS_OPTIONS = ["beklemede", "incelendi", "kabul edildi", "reddedildi"];
const STATUS_COLORS = { beklemede: "#f59e0b", incelendi: "#3b82f6", "kabul edildi": "#22c55e", "reddedildi": "#ef4444" };

function AdminBasvurular() {
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [expanded, setExpanded] = useState(null);

  const refresh = () => getApplications().then(setApplications);
  useEffect(() => { refresh(); }, []);

  const handleStatus = async (id, status) => {
    const notes = applications.find(a => a.id === id)?.notes ?? "";
    await updateApplicationStatus(id, status, notes);
    refresh();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu başvuruyu kalıcı olarak silmek istediğinizden emin misiniz?")) {
      await deleteApplication(id);
      refresh();
    }
  };

  const filtered = filterStatus ? applications.filter(a => a.status === filterStatus) : applications;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Üyelik Başvuruları</h1>
          <p className="admin-subtitle">Gelen başvuruları incele ve durumlarını güncelle</p>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        {STATUS_OPTIONS.map(s => (
          <div key={s} className="stat-card" style={{ cursor: "pointer", border: filterStatus === s ? "2px solid var(--primary)" : "none" }} onClick={() => setFilterStatus(filterStatus === s ? "" : s)}>
            <span className="stat-label" style={{ textTransform: "capitalize" }}>{s}</span>
            <span className="stat-value">{applications.filter(a => a.status === s).length}</span>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><p>{filterStatus ? "Bu durumda başvuru yok" : "Henüz başvuru gelmemiş"}</p></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
          {filtered.map(app => (
            <div key={app.id} style={{ background: "var(--card-bg)", borderRadius: 12, border: "1px solid var(--border-color)", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ fontWeight: 700, marginBottom: 2 }}>{app.name}</p>
                  <p style={{ fontSize: 13, opacity: 0.6 }}>{app.email}{app.department ? ` · ${app.department}` : ""}{app.teamInterest ? ` · ${app.teamInterest}` : ""}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <select
                    value={app.status}
                    onChange={e => handleStatus(app.id, e.target.value)}
                    style={{ padding: "5px 10px", borderRadius: 20, border: `2px solid ${STATUS_COLORS[app.status] ?? "#ccc"}`, background: "transparent", color: STATUS_COLORS[app.status] ?? "inherit", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <span style={{ fontSize: 12, opacity: 0.45 }}>{new Date(app.createdAt).toLocaleDateString("tr-TR")}</span>
                  {app.motivation && (
                    <button onClick={() => setExpanded(expanded === app.id ? null : app.id)} style={{ background: "var(--bg-soft)", border: "1px solid var(--border-color)", borderRadius: 8, padding: "4px 10px", fontSize: 12, cursor: "pointer", color: "var(--text-main)" }}>
                      {expanded === app.id ? "▲ Gizle" : "▼ Motivasyon"}
                    </button>
                  )}
                  <button onClick={() => handleDelete(app.id)} className="btn-delete" title="Sil">🗑️</button>
                </div>
              </div>
              {expanded === app.id && app.motivation && (
                <div style={{ padding: "0 20px 16px", borderTop: "1px solid var(--border-color)", paddingTop: 14 }}>
                  <p style={{ fontSize: 14, lineHeight: 1.65, opacity: 0.8 }}>{app.motivation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminBasvurular;
