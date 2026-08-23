import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getActiveItems,
  softDeleteItem,
  getDeletedItems,
  restoreItem,
} from "../utils/softDelete";
import { createLog } from "../utils/adminLogger";
import { bulkDelete, bulkToggleFeature } from "../utils/bulkOperations";
import { getTeams } from "../lib/dataService";
import "../styles/admin.css";

function AdminTakimlar() {
  const [takimlar, setTakimlar] = useState([]);
  const [deletedTeams, setDeletedTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tümü");
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectMode, setSelectMode] = useState(false);

  const refreshLists = async () => {
    const [active, deleted] = await Promise.all([
      getActiveItems("takimlar"),
      getDeletedItems("takimlar"),
    ]);
    setTakimlar(active.sort((a, b) => (a.order || 999) - (b.order || 999)));
    setDeletedTeams(deleted);
  };

  useEffect(() => { refreshLists(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bu takımı silmek istediğinizden emin misiniz? (Geri alınabilir)")) {
      await softDeleteItem("takimlar", id);
      createLog("delete", "takim", id);
      refreshLists();
    }
  };

  const _handleRestore = async (id) => {
    await restoreItem("takimlar", id);
    createLog("restore", "takim", id);
    refreshLists();
  };

  // Bulk operations
  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    if (window.confirm(`${selectedItems.length} takımı silmek istediğinizden emin misiniz?`)) {
      await bulkDelete("takimlar", selectedItems);
      selectedItems.forEach(id => createLog("delete", "takim", id));
      setSelectedItems([]);
      setSelectMode(false);
      refreshLists();
    }
  };

  const handleBulkToggleFeatured = async () => {
    if (selectedItems.length === 0) return;
    await bulkToggleFeature("takimlar", selectedItems, "featured");
    selectedItems.forEach(id => createLog("update", "takim", id, { field: "featured" }));
    setSelectedItems([]);
    setSelectMode(false);
    refreshLists();
  };

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter
  const filteredTakimlar = takimlar.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "Tümü" || t.badge === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filters = ["Tümü", "Aktif Takım", "Askıdaki Takımlar"];
  const stats = {
    total: takimlar.length,
    active: takimlar.filter((t) => t.badge === "Aktif Takım").length,
    featured: takimlar.filter((t) => t.featured).length,
    filtered: filteredTakimlar.length,
  };

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h1>Takım Yönetimi</h1>
          <p className="admin-subtitle">
            Aktif: {takimlar.length} | Silinen: {deletedTeams.length}
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => setShowDeleted(!showDeleted)}
            className="btn-secondary"
            style={{ padding: "10px 20px" }}
          >
            {showDeleted ? "✅ Aktifleri Göster" : "🗑️ Silinenleri Göster"}
          </button>
          {!showDeleted && (
            <>
              <button
                onClick={() => {
                  setSelectMode(!selectMode);
                  setSelectedItems([]);
                }}
                className="btn-secondary"
                style={{ padding: "10px 20px" }}
              >
                {selectMode ? "❌ Seçimi İptal" : "☑️ Toplu İşlem"}
              </button>
              {selectMode && selectedItems.length > 0 && (
                <>
                  <button
                    onClick={handleBulkDelete}
                    className="btn-secondary"
                    style={{
                      padding: "10px 20px",
                      background: "#ef4444",
                      color: "#fff",
                    }}
                  >
                    🗑️ Seçilenleri Sil ({selectedItems.length})
                  </button>
                  <button
                    onClick={handleBulkToggleFeatured}
                    className="btn-secondary"
                    style={{ padding: "10px 20px" }}
                  >
                    ⭐ Öne Çıkar ({selectedItems.length})
                  </button>
                </>
              )}
            </>
          )}
          <Link to="/admin/takimlar/yeni" className="btn-primary">
            + Yeni Takım Ekle
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Toplam</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Aktif</span>
          <span className="stat-value">{stats.active}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Anasayfada</span>
          <span className="stat-value">{stats.featured}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Gösterilen</span>
          <span className="stat-value">{stats.filtered}</span>
        </div>
      </div>

      {/* FILTERS */}
      <div className="admin-filters">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="🔍 Takım ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-pills">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-pill ${
                filterStatus === filter ? "active" : ""
              }`}
              onClick={() => setFilterStatus(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      {filteredTakimlar.length > 0 ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                {selectMode && (
                  <th style={{ width: "50px" }}>
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length === filteredTakimlar.length &&
                        filteredTakimlar.length > 0
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(
                            filteredTakimlar.map((t) => String(t.id))
                          );
                        } else {
                          setSelectedItems([]);
                        }
                      }}
                    />
                  </th>
                )}
                <th style={{ width: "60px" }}>SIRA</th>
                <th style={{ width: "80px" }}>GÖRSEL</th>
                <th>TAKIM ADI</th>
                <th>ALAN</th>
                <th style={{ width: "150px" }}>DURUM</th>
                <th style={{ width: "120px" }}>ANASAYFA</th>
                <th style={{ width: "150px" }}>İŞLEMLER</th>
              </tr>
            </thead>
            <tbody>
              {filteredTakimlar.map((takim) => (
                <tr key={takim.id}>
                  {selectMode && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(String(takim.id))}
                        onChange={() => toggleSelectItem(String(takim.id))}
                      />
                    </td>
                  )}
                  <td>
                    <span className="order-badge">{takim.order || "-"}</span>
                  </td>
                  <td>
                    <div className="table-image">
                      <img src={takim.image} alt={takim.name} />
                    </div>
                  </td>
                  <td>
                    <strong>{takim.name}</strong>
                  </td>
                  <td>{takim.area}</td>
                  <td>
                    <span
                      className={`badge ${
                        takim.badge === "Aktif Takım"
                          ? "badge-success"
                          : "badge-warning"
                      }`}
                    >
                      {takim.badge}
                    </span>
                  </td>
                  <td>
                    {takim.featured ? (
                      <span className="featured-yes">⭐ Evet</span>
                    ) : (
                      <span className="featured-no">-</span>
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link
                        to={`/admin/takimlar/duzenle/${takim.id}`}
                        className="btn-edit"
                        title="Düzenle"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(takim.id)}
                        className="btn-delete"
                        title="Sil"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>
            {searchTerm || filterStatus !== "Tümü"
              ? "Arama kriterlerine uygun takım bulunamadı"
              : "Henüz takım eklenmemiş"}
          </p>
          <Link to="/admin/takimlar/yeni" className="btn-primary">
            İlk Takımı Ekle
          </Link>
        </div>
      )}
    </div>
  );
}

export default AdminTakimlar;
