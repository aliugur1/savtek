/**
 * Soft Delete Utility
 * Instead of permanently deleting items, marks them as deleted
 */

/**
 * Soft delete an item (mark as deleted)
 */
export function softDeleteItem(storageKey, itemId) {
  const items = JSON.parse(localStorage.getItem(storageKey) || "[]");
  const itemIndex = items.findIndex(
    (item) => String(item.id) === String(itemId)
  );

  if (itemIndex === -1) {
    return null;
  }

  const item = items[itemIndex];
  const updatedItem = {
    ...item,
    isDeleted: true,
    deletedAt: new Date().toISOString(),
    deletedBy: getCurrentAdmin(),
  };

  items[itemIndex] = updatedItem;
  localStorage.setItem(storageKey, JSON.stringify(items));

  return updatedItem;
}

/**
 * Restore a soft-deleted item
 */
export function restoreItem(storageKey, itemId) {
  const items = JSON.parse(localStorage.getItem(storageKey) || "[]");
  const itemIndex = items.findIndex(
    (item) => String(item.id) === String(itemId)
  );

  if (itemIndex === -1) {
    return null;
  }

  const item = items[itemIndex];
  const updatedItem = {
    ...item,
    isDeleted: false,
    deletedAt: null,
    deletedBy: null,
    restoredAt: new Date().toISOString(),
  };

  items[itemIndex] = updatedItem;
  localStorage.setItem(storageKey, JSON.stringify(items));

  return updatedItem;
}

/**
 * Permanently delete an item (hard delete)
 */
export function hardDeleteItem(storageKey, itemId) {
  const items = JSON.parse(localStorage.getItem(storageKey) || "[]");
  const filteredItems = items.filter(
    (item) => String(item.id) !== String(itemId)
  );
  localStorage.setItem(storageKey, JSON.stringify(filteredItems));
  return true;
}

/**
 * Get all items (excluding deleted)
 */
export function getActiveItems(storageKey) {
  const items = JSON.parse(localStorage.getItem(storageKey) || "[]");
  return items.filter((item) => !item.isDeleted);
}

/**
 * Get all items (including deleted)
 */
export function getAllItems(storageKey) {
  return JSON.parse(localStorage.getItem(storageKey) || "[]");
}

/**
 * Get only deleted items
 */
export function getDeletedItems(storageKey) {
  const items = JSON.parse(localStorage.getItem(storageKey) || "[]");
  return items.filter((item) => item.isDeleted === true);
}

/**
 * Get current admin user
 */
function getCurrentAdmin() {
  const adminData = localStorage.getItem("savtek-admin");
  if (adminData) {
    try {
      const parsed = JSON.parse(adminData);
      return parsed.username || "admin";
    } catch {
      return "admin";
    }
  }
  return localStorage.getItem("isAdmin") === "true" ? "admin" : null;
}

/**
 * Clean up old deleted items (permanently delete after X days)
 */
export function cleanupOldDeletedItems(storageKey, days = 30) {
  const items = getAllItems(storageKey);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const activeItems = items.filter((item) => {
    if (!item.isDeleted) return true;
    if (item.deletedAt && new Date(item.deletedAt) > cutoffDate) return true;
    return false; // Item is deleted and older than cutoff
  });

  localStorage.setItem(storageKey, JSON.stringify(activeItems));
  return items.length - activeItems.length; // Return count of permanently deleted items
}
