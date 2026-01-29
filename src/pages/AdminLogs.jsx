import { useState, useEffect } from "react";
import {
  getAllLogs,
  getLogStats,
  exportLogs,
  clearOldLogs,
} from "../utils/adminLogger";
import "../styles/admin.css";

function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    action: "",
    entity: "",
    userId: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadLogs();
    loadStats();
  }, [filters]);

  const loadLogs = () => {
    const filteredLogs = getAllLogs(filters);
    setLogs(filteredLogs);
  };

  const loadStats = () => {
    const logStats = getLogStats();
    setStats(logStats);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      action: "",
      entity: "",
      userId: "",
    });
  };

  const handleExport = () => {
    exportLogs();
  };

  const handleCleanup = () => {
    if (window.confirm("90 günden eski loglar silinecek. Devam edilsin mi?")) {
      const deletedCount = clearOldLogs(90);
      alert(`${deletedCount} eski log silindi.`);
      loadLogs();
      loadStats();
    }
  };

  const getActionIcon = (action) => {
    const icons = {
      create: "➕",
      update: "✏️",
      delete: "🗑️",
      restore: "♻️",
      login: "🔐",
      logout: "🚪",
    };
    return icons[action] || "📝";
  };

  const getActionColor = (action) => {
    const colors = {
      create: "#10b981",
      update: "#3b82f6",
      delete: "#ef4444",
      restore: "#f59e0b",
      login: "#8b5cf6",
      logout: "#6b7280",
    };
    return colors[action] || "#6b7280";
  };

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h1>Admin Log Kayıtları</h1>
          <p className="admin-subtitle">
            Tüm admin işlemlerinin kayıtları ve istatistikleri
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={handleExport} className="btn-secondary">
            📥 Dışa Aktar
          </button>
          <button onClick={handleCleanup} className="btn-secondary">
            🧹 Eski Logları Temizle
          </button>
        </div>
      </div>

      {/* STATS */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Toplam Log</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Son 10 İşlem</span>
            <span className="stat-value">{stats.recent.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Farklı Kullanıcı</span>
            <span className="stat-value">
              {Object.keys(stats.byUser).length}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Farklı Entity</span>
            <span className="stat-value">
              {Object.keys(stats.byEntity).length}
            </span>
          </div>
        </div>
      )}

      {/* FILTERS */}
      <div className="admin-filters">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary"
        >
          {showFilters ? "❌ Filtreleri Gizle" : "🔍 Filtrele"}
        </button>
        {showFilters && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "16px",
              flexWrap: "wrap",
            }}
          >
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange("action", e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            >
              <option value="">Tüm İşlemler</option>
              <option value="create">Oluştur</option>
              <option value="update">Güncelle</option>
              <option value="delete">Sil</option>
              <option value="restore">Geri Getir</option>
              <option value="login">Giriş</option>
            </select>
            <select
              value={filters.entity}
              onChange={(e) => handleFilterChange("entity", e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            >
              <option value="">Tüm Entity'ler</option>
              <option value="etkinlik">Etkinlik</option>
              <option value="takim">Takım</option>
              <option value="ekip">Ekip</option>
              <option value="sponsor">Sponsor</option>
              <option value="system">Sistem</option>
            </select>
            <input
              type="text"
              placeholder="Kullanıcı adı..."
              value={filters.userId}
              onChange={(e) => handleFilterChange("userId", e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            />
            <button onClick={clearFilters} className="btn-secondary">
              Temizle
            </button>
          </div>
        )}
      </div>

      {/* LOGS TABLE */}
      {logs.length > 0 ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>İŞLEM</th>
                <th style={{ width: "120px" }}>ENTITY</th>
                <th style={{ width: "100px" }}>ID</th>
                <th style={{ width: "120px" }}>KULLANICI</th>
                <th style={{ width: "180px" }}>TARİH</th>
                <th>DEĞİŞİKLİKLER</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "4px 12px",
                        borderRadius: "6px",
                        backgroundColor: `${getActionColor(log.action)}20`,
                        color: getActionColor(log.action),
                        fontWeight: "600",
                        fontSize: "13px",
                      }}
                    >
                      {getActionIcon(log.action)} {log.action}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-category">{log.entity}</span>
                  </td>
                  <td>
                    <code style={{ fontSize: "12px", color: "#666" }}>
                      {log.entityId || "-"}
                    </code>
                  </td>
                  <td>{log.userId}</td>
                  <td>
                    {new Date(log.timestamp).toLocaleString("tr-TR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>
                    {log.changes ? (
                      <details style={{ cursor: "pointer" }}>
                        <summary style={{ fontSize: "12px", color: "#666" }}>
                          Detayları Gör
                        </summary>
                        <pre
                          style={{
                            marginTop: "8px",
                            padding: "8px",
                            background: "#f5f5f5",
                            borderRadius: "4px",
                            fontSize: "11px",
                            overflow: "auto",
                            maxHeight: "200px",
                          }}
                        >
                          {JSON.stringify(log.changes, null, 2)}
                        </pre>
                      </details>
                    ) : (
                      <span style={{ color: "#999", fontSize: "12px" }}>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>Log kaydı bulunamadı.</p>
        </div>
      )}
    </div>
  );
}

export default AdminLogs;
