/**
 * Admin Log System
 * Tracks all admin actions for audit and security
 */

const LOG_STORAGE_KEY = "admin-logs";
const MAX_LOGS = 1000; // Maximum number of logs to keep

/**
 * Get client IP address (for logging)
 */
function getClientInfo() {
  // In production, this would come from server
  // For now, we'll use a placeholder
  return {
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    // IP would be obtained from server in production
  };
}

/**
 * Create a log entry
 */
export function createLog(action, entity, entityId, changes = null) {
  const adminData = localStorage.getItem("savtek-admin");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!isAdmin && !adminData) {
    console.warn("Admin log: User not authenticated");
    return;
  }

  const userId = adminData
    ? JSON.parse(adminData).username || "admin"
    : "admin";
  const clientInfo = getClientInfo();

  const logEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    action, // "create" | "update" | "delete" | "login" | "logout"
    entity, // "etkinlik" | "takim" | "ekip" | "sponsor"
    entityId,
    userId,
    changes, // Object with before/after values
    timestamp: clientInfo.timestamp,
    userAgent: clientInfo.userAgent,
  };

  // Get existing logs
  const existingLogs = JSON.parse(
    localStorage.getItem(LOG_STORAGE_KEY) || "[]"
  );

  // Add new log
  existingLogs.unshift(logEntry);

  // Keep only last MAX_LOGS entries
  if (existingLogs.length > MAX_LOGS) {
    existingLogs.splice(MAX_LOGS);
  }

  // Save logs
  localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(existingLogs));

  // In production, also send to server
  // sendLogToServer(logEntry);

  return logEntry;
}

/**
 * Get all logs
 */
export function getAllLogs(filters = {}) {
  const logs = JSON.parse(localStorage.getItem(LOG_STORAGE_KEY) || "[]");

  if (!filters || Object.keys(filters).length === 0) {
    return logs;
  }

  // Apply filters
  return logs.filter((log) => {
    if (filters.action && log.action !== filters.action) return false;
    if (filters.entity && log.entity !== filters.entity) return false;
    if (filters.userId && log.userId !== filters.userId) return false;
    if (filters.startDate && log.timestamp < filters.startDate) return false;
    if (filters.endDate && log.timestamp > filters.endDate) return false;
    return true;
  });
}

/**
 * Get logs for a specific entity
 */
export function getEntityLogs(entity, entityId) {
  return getAllLogs({ entity, entityId: entityId });
}

/**
 * Clear old logs (older than specified days)
 */
export function clearOldLogs(days = 90) {
  const logs = getAllLogs();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const filteredLogs = logs.filter(
    (log) => new Date(log.timestamp) > cutoffDate
  );

  localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(filteredLogs));
  return filteredLogs.length;
}

/**
 * Export logs as JSON
 */
export function exportLogs() {
  const logs = getAllLogs();
  const dataStr = JSON.stringify(logs, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `admin-logs-${new Date().toISOString().split("T")[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Get log statistics
 */
export function getLogStats() {
  const logs = getAllLogs();
  const stats = {
    total: logs.length,
    byAction: {},
    byEntity: {},
    byUser: {},
    recent: logs.slice(0, 10),
  };

  logs.forEach((log) => {
    stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;
    stats.byEntity[log.entity] = (stats.byEntity[log.entity] || 0) + 1;
    stats.byUser[log.userId] = (stats.byUser[log.userId] || 0) + 1;
  });

  return stats;
}
