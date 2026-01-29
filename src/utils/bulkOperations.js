/**
 * Bulk Operations Utility
 * Perform multiple operations at once
 */

/**
 * Bulk delete items
 */
export function bulkDelete(storageKey, itemIds) {
  const items = JSON.parse(localStorage.getItem(storageKey) || "[]");
  const updatedItems = items.map((item) => {
    if (itemIds.includes(String(item.id))) {
      return {
        ...item,
        isDeleted: true,
        deletedAt: new Date().toISOString(),
      };
    }
    return item;
  });
  localStorage.setItem(storageKey, JSON.stringify(updatedItems));
  return itemIds.length;
}

/**
 * Bulk restore items
 */
export function bulkRestore(storageKey, itemIds) {
  const items = JSON.parse(localStorage.getItem(storageKey) || "[]");
  const updatedItems = items.map((item) => {
    if (itemIds.includes(String(item.id))) {
      return {
        ...item,
        isDeleted: false,
        deletedAt: null,
        restoredAt: new Date().toISOString(),
      };
    }
    return item;
  });
  localStorage.setItem(storageKey, JSON.stringify(updatedItems));
  return itemIds.length;
}

/**
 * Bulk update field
 */
export function bulkUpdateField(storageKey, itemIds, field, value) {
  const items = JSON.parse(localStorage.getItem(storageKey) || "[]");
  const updatedItems = items.map((item) => {
    if (itemIds.includes(String(item.id))) {
      return {
        ...item,
        [field]: value,
      };
    }
    return item;
  });
  localStorage.setItem(storageKey, JSON.stringify(updatedItems));
  return itemIds.length;
}

/**
 * Bulk toggle feature
 */
export function bulkToggleFeature(storageKey, itemIds, field) {
  const items = JSON.parse(localStorage.getItem(storageKey) || "[]");
  const updatedItems = items.map((item) => {
    if (itemIds.includes(String(item.id))) {
      return {
        ...item,
        [field]: !item[field],
      };
    }
    return item;
  });
  localStorage.setItem(storageKey, JSON.stringify(updatedItems));
  return itemIds.length;
}
