import { bulkSoftDeleteTeams, bulkSoftDeleteEvents } from "../lib/dataService";
import { softDeleteItem } from "./softDelete";

export async function bulkDelete(storageKey, itemIds) {
  if (storageKey === "takimlar") return bulkSoftDeleteTeams(itemIds);
  if (storageKey === "etkinlikler") return bulkSoftDeleteEvents(itemIds);
  await Promise.all(itemIds.map(id => softDeleteItem(storageKey, id)));
  return itemIds.length;
}

export async function bulkRestore(storageKey, itemIds) {
  const { restoreItem } = await import("./softDelete");
  await Promise.all(itemIds.map(id => restoreItem(storageKey, id)));
  return itemIds.length;
}

export async function bulkToggleFeature(storageKey, itemIds, field) {
  const { getAllItems } = await import("./softDelete");
  const all = await getAllItems(storageKey);
  const targets = new Set(itemIds.map(String));
  for (const item of all) {
    if (targets.has(String(item.id))) {
      const { saveTeam, saveEvent, saveEkipMember, saveSponsor } = await import("../lib/dataService");
      const updated = { ...item, [field]: !item[field] };
      if (storageKey === "takimlar") await saveTeam(updated);
      else if (storageKey === "etkinlikler") await saveEvent(updated);
      else if (storageKey === "ekip") await saveEkipMember(updated);
      else if (storageKey === "sponsorlar") await saveSponsor(updated);
    }
  }
  return itemIds.length;
}
