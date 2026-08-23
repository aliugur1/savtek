import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getActiveItems,
  softDeleteItem,
  getDeletedItems,
  restoreItem,
} from "../utils/softDelete";
import { createLog } from "../utils/adminLogger";
import { bulkDelete } from "../utils/bulkOperations";
import { getEvents } from "../lib/dataService";
import "../styles/admin.css";

function AdminEtkinlikler() {
  const [etkinlikler, setEtkinlikler] = useState([]);
  const [deletedEvents, setDeletedEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Tümü");
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectMode, setSelectMode] = useState(false);

  const refreshLists = async () => {
    const [active, deleted] = await Promise.all([
      getActiveItems("etkinlikler"),
      getDeletedItems("etkinlikler"),
    ]);
    setEtkinlikler(active);
    setDeletedEvents(deleted);
  };

  useEffect(() => { refreshLists(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bu etkinliği silmek istediğinizden emin misiniz? (Geri alınabilir)")) {
      await softDeleteItem("etkinlikler", id);
      createLog("delete", "etkinlik", id);
      refreshLists();
    }
  };

  const handleRestore = async (id) => {
    await restoreItem("etkinlikler", id);
    createLog("restore", "etkinlik", id);
    refreshLists();
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    if (window.confirm(`${selectedItems.length} etkinliği silmek istediğinizden emin misiniz?`)) {
      await bulkDelete("etkinlikler", selectedItems);
      selectedItems.forEach(id => createLog("delete", "etkinlik", id));
      setSelectedItems([]);
      setSelectMode(false);
      refreshLists();
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter events
  const filteredEvents = etkinlikler.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "Tümü" || event.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "Tümü",
    "Seminer",
    "Workshop",
    "TEKNOFEST",
    "Teknik Gezi",
  ];

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h1>Etkinlikler</h1>
          <p className="admin-subtitle">
            Aktif: {etkinlikler.length} | Silinen: {deletedEvents.length}
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
              )}
            </>
          )}
          <Link to="/admin/etkinlikler/yeni" className="btn-primary">
            + Yeni Etkinlik
          </Link>
        </div>
      </div>

      {/* FILTERS */}
      <div className="admin-filters">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="🔍 Etkinlik ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${
                filterCategory === cat ? "active" : ""
              }`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ETKINLIK TABLE - COMPACT STYLE */}
      {showDeleted ? (
        // Deleted events table
        deletedEvents.length > 0 ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>BAŞLIK</th>
                  <th style={{ width: "150px" }}>SİLİNME TARİHİ</th>
                  <th style={{ width: "150px" }}>İŞLEMLER</th>
                </tr>
              </thead>
              <tbody>
                {deletedEvents.map((event) => (
                  <tr key={event.id} style={{ opacity: 0.7 }}>
                    <td>
                      <strong>{event.title}</strong>
                    </td>
                    <td>
                      {event.deletedAt
                        ? new Date(event.deletedAt).toLocaleDateString("tr-TR")
                        : "-"}
                    </td>
                    <td>
                      <button
                        onClick={() => handleRestore(event.id)}
                        className="btn-edit"
                        title="Geri Getir"
                      >
                        ♻️ Geri Getir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>Silinen etkinlik bulunmuyor.</p>
          </div>
        )
      ) : filteredEvents.length > 0 ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                {selectMode && (
                  <th style={{ width: "50px" }}>
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length === filteredEvents.length &&
                        filteredEvents.length > 0
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(
                            filteredEvents.map((e) => String(e.id))
                          );
                        } else {
                          setSelectedItems([]);
                        }
                      }}
                    />
                  </th>
                )}
                <th style={{ width: "80px" }}>GÖRSEL</th>
                <th>BAŞLIK</th>
                <th style={{ width: "120px" }}>KATEGORİ</th>
                <th style={{ width: "150px" }}>TARİH</th>
                <th style={{ width: "200px" }}>KONUM</th>
                <th style={{ width: "150px" }}>İŞLEMLER</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id}>
                  {selectMode && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(String(event.id))}
                        onChange={() => toggleSelectItem(String(event.id))}
                      />
                    </td>
                  )}
                  <td>
                    <div className="table-image">
                      <img src={event.image} alt={event.title} />
                    </div>
                  </td>
                  <td>
                    <div className="table-title">
                      <strong>{event.title}</strong>
                      <span className="table-excerpt">{event.excerpt}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-category">
                      {event.category}
                    </span>
                  </td>
                  <td>{event.date}</td>
                  <td>{event.location}</td>
                  <td>
                    <div className="table-actions">
                      <Link
                        to={`/admin/etkinlikler/duzenle/${event.id}`}
                        className="btn-edit"
                        title="Düzenle"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id)}
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
          <p>Hiç etkinlik bulunamadı.</p>
          <Link to="/admin/etkinlikler/yeni" className="btn-primary">
            İlk Etkinliği Ekle
          </Link>
        </div>
      )}
    </div>
  );
}

export default AdminEtkinlikler;
