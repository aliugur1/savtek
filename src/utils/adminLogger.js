import { createLog as dsCreateLog, getLogs as dsGetLogs } from "../lib/dataService";

export async function createLog(action, entity, entityId, changes = null) {
  return dsCreateLog(action, entity, entityId, changes);
}

export async function getAllLogs(filters = {}) {
  return dsGetLogs(filters);
}

export function exportLogs(logs) {
  const dataStr = JSON.stringify(logs, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `admin-logs-${new Date().toISOString().split("T")[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
