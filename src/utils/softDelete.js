import {
  softDeleteTeam, restoreTeam,
  softDeleteEvent, restoreEvent,
  softDeleteEkipMember, restoreEkipMember,
  softDeleteSponsor, restoreSponsor,
  getTeams, getEvents, getEkip, getSponsors,
} from "../lib/dataService";

const KEY_MAP = {
  takimlar:  { softDelete: softDeleteTeam,       restore: restoreTeam,        getAll: getTeams },
  etkinlikler: { softDelete: softDeleteEvent,    restore: restoreEvent,       getAll: getEvents },
  ekip:      { softDelete: softDeleteEkipMember, restore: restoreEkipMember,  getAll: getEkip },
  sponsorlar: { softDelete: softDeleteSponsor,   restore: restoreSponsor,     getAll: getSponsors },
};

export async function softDeleteItem(storageKey, itemId) {
  const ops = KEY_MAP[storageKey];
  if (ops) return ops.softDelete(itemId);
}

export async function restoreItem(storageKey, itemId) {
  const ops = KEY_MAP[storageKey];
  if (ops) return ops.restore(itemId);
}

export async function getActiveItems(storageKey) {
  const ops = KEY_MAP[storageKey];
  if (ops) return ops.getAll({ includeDeleted: false });
  return [];
}

export async function getDeletedItems(storageKey) {
  const ops = KEY_MAP[storageKey];
  if (!ops) return [];
  const all = await ops.getAll({ includeDeleted: true });
  return all.filter(i => i.isDeleted);
}

export async function getAllItems(storageKey) {
  const ops = KEY_MAP[storageKey];
  if (ops) return ops.getAll({ includeDeleted: true });
  return [];
}
