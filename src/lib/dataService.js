import { supabase, hasSupabaseEnv } from "./supabaseClient";

// ─── localStorage helpers ───────────────────────────────────────────────────
function lsGet(key, fallback = []) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
}
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
function lsSoftDelete(key, id) {
  const list = lsGet(key);
  const idx = list.findIndex(i => String(i.id) === String(id));
  if (idx >= 0) { list[idx] = { ...list[idx], isDeleted: true, deletedAt: new Date().toISOString() }; lsSet(key, list); }
}
function lsRestore(key, id) {
  const list = lsGet(key);
  const idx = list.findIndex(i => String(i.id) === String(id));
  if (idx >= 0) { list[idx] = { ...list[idx], isDeleted: false, deletedAt: null }; lsSet(key, list); }
}
function lsSave(key, item) {
  const list = lsGet(key);
  const newItem = { ...item, id: item.id || String(Date.now()) };
  const idx = list.findIndex(i => String(i.id) === String(newItem.id));
  idx >= 0 ? list.splice(idx, 1, newItem) : list.push(newItem);
  lsSet(key, list);
  return newItem;
}

// ─── TEAMS ─────────────────────────────────────────────────────────────────
export async function getTeams({ includeDeleted = false } = {}) {
  if (hasSupabaseEnv) {
    let q = supabase.from("site_teams").select("*").order("sort_order");
    if (!includeDeleted) q = q.eq("deleted", false);
    const { data } = await q;
    return (data || []).map(dbToTeam);
  }
  const all = lsGet("takimlar");
  return includeDeleted ? all : all.filter(t => !t.isDeleted);
}

export async function getTeamBySlug(slug) {
  if (hasSupabaseEnv) {
    const { data } = await supabase.from("site_teams").select("*").eq("slug", slug).eq("deleted", false).maybeSingle();
    return data ? dbToTeam(data) : null;
  }
  return lsGet("takimlar").find(t => t.slug === slug && !t.isDeleted) ?? null;
}

export async function getTeamById(id) {
  if (hasSupabaseEnv) {
    const { data } = await supabase.from("site_teams").select("*").eq("id", id).maybeSingle();
    return data ? dbToTeam(data) : null;
  }
  return lsGet("takimlar").find(t => String(t.id) === String(id)) ?? null;
}

export async function saveTeam(team) {
  if (hasSupabaseEnv) {
    const row = teamToDb(team);
    const { data, error } = team.id
      ? await supabase.from("site_teams").update(row).eq("id", team.id).select().maybeSingle()
      : await supabase.from("site_teams").insert(row).select().maybeSingle();
    if (error) throw error;
    return data ? dbToTeam(data) : null;
  }
  return lsSave("takimlar", team);
}

export async function softDeleteTeam(id) {
  if (hasSupabaseEnv) {
    await supabase.from("site_teams").update({ deleted: true, deleted_at: new Date().toISOString() }).eq("id", id);
    return;
  }
  lsSoftDelete("takimlar", id);
}

export async function restoreTeam(id) {
  if (hasSupabaseEnv) {
    await supabase.from("site_teams").update({ deleted: false, deleted_at: null }).eq("id", id);
    return;
  }
  lsRestore("takimlar", id);
}

export async function bulkSoftDeleteTeams(ids) {
  if (hasSupabaseEnv) {
    await supabase.from("site_teams").update({ deleted: true, deleted_at: new Date().toISOString() }).in("id", ids);
    return;
  }
  ids.forEach(id => lsSoftDelete("takimlar", id));
}

function dbToTeam(r) {
  return { id: r.id, name: r.name, slug: r.slug, area: r.area, image: r.image, badge: r.badge, description: r.description, order: r.sort_order, featured: r.featured, members: r.members ?? [], achievements: r.achievements ?? [], technologies: r.technologies ?? [], gallery: r.gallery ?? [], sponsors: r.sponsors ?? [], isDeleted: r.deleted, deletedAt: r.deleted_at };
}
function teamToDb(a) {
  const row = { name: a.name, slug: a.slug, area: a.area, image: a.image, badge: a.badge, description: a.description, sort_order: a.order, featured: a.featured, members: a.members ?? [], achievements: a.achievements ?? [], technologies: a.technologies ?? [], gallery: a.gallery ?? [], sponsors: a.sponsors ?? [] };
  if (a.id) row.id = a.id;
  return row;
}

// ─── EVENTS ────────────────────────────────────────────────────────────────
export async function getEvents({ includeDeleted = false } = {}) {
  if (hasSupabaseEnv) {
    let q = supabase.from("site_events").select("*").order("created_at", { ascending: false });
    if (!includeDeleted) q = q.eq("deleted", false);
    const { data } = await q;
    return (data || []).map(dbToEvent);
  }
  const all = lsGet("etkinlikler");
  return includeDeleted ? all : all.filter(e => !e.isDeleted);
}

export async function getEventBySlug(slug) {
  if (hasSupabaseEnv) {
    const { data } = await supabase.from("site_events").select("*").eq("slug", slug).eq("deleted", false).maybeSingle();
    return data ? dbToEvent(data) : null;
  }
  return lsGet("etkinlikler").find(e => e.slug === slug && !e.isDeleted) ?? null;
}

export async function getEventById(id) {
  if (hasSupabaseEnv) {
    const { data } = await supabase.from("site_events").select("*").eq("id", id).maybeSingle();
    return data ? dbToEvent(data) : null;
  }
  return lsGet("etkinlikler").find(e => String(e.id) === String(id)) ?? null;
}

export async function saveEvent(event) {
  if (hasSupabaseEnv) {
    const row = eventToDb(event);
    const { data, error } = event.id
      ? await supabase.from("site_events").update(row).eq("id", event.id).select().maybeSingle()
      : await supabase.from("site_events").insert(row).select().maybeSingle();
    if (error) throw error;
    return data ? dbToEvent(data) : null;
  }
  return lsSave("etkinlikler", event);
}

export async function softDeleteEvent(id) {
  if (hasSupabaseEnv) {
    await supabase.from("site_events").update({ deleted: true, deleted_at: new Date().toISOString() }).eq("id", id);
    return;
  }
  lsSoftDelete("etkinlikler", id);
}

export async function restoreEvent(id) {
  if (hasSupabaseEnv) {
    await supabase.from("site_events").update({ deleted: false, deleted_at: null }).eq("id", id);
    return;
  }
  lsRestore("etkinlikler", id);
}

export async function bulkSoftDeleteEvents(ids) {
  if (hasSupabaseEnv) {
    await supabase.from("site_events").update({ deleted: true, deleted_at: new Date().toISOString() }).in("id", ids);
    return;
  }
  ids.forEach(id => lsSoftDelete("etkinlikler", id));
}

function dbToEvent(r) {
  return { id: r.id, title: r.title, slug: r.slug, category: r.category, date: r.date, time: r.time, location: r.location, locationLink: r.location_link, excerpt: r.excerpt, description: r.description, image: r.image, mainImage: r.main_image, speakers: r.speakers ?? [], program: r.program ?? [], gallery: r.gallery ?? [], isDeleted: r.deleted, deletedAt: r.deleted_at };
}
function eventToDb(a) {
  const row = { title: a.title, slug: a.slug, category: a.category, date: a.date, time: a.time, location: a.location, location_link: a.locationLink, excerpt: a.excerpt, description: a.description, image: a.image, main_image: a.mainImage, speakers: a.speakers ?? [], program: a.program ?? [], gallery: a.gallery ?? [] };
  if (a.id) row.id = a.id;
  return row;
}

// ─── EKIP ──────────────────────────────────────────────────────────────────
export async function getEkip({ includeDeleted = false } = {}) {
  if (hasSupabaseEnv) {
    let q = supabase.from("site_ekip").select("*").order("sort_order");
    if (!includeDeleted) q = q.eq("deleted", false);
    const { data } = await q;
    return (data || []).map(dbToEkip);
  }
  const all = lsGet("ekip");
  return includeDeleted ? all : all.filter(m => !m.isDeleted);
}

export async function getEkipById(id) {
  if (hasSupabaseEnv) {
    const { data } = await supabase.from("site_ekip").select("*").eq("id", id).maybeSingle();
    return data ? dbToEkip(data) : null;
  }
  return lsGet("ekip").find(m => String(m.id) === String(id)) ?? null;
}

export async function saveEkipMember(member) {
  if (hasSupabaseEnv) {
    const row = ekipToDb(member);
    const { data, error } = member.id
      ? await supabase.from("site_ekip").update(row).eq("id", member.id).select().maybeSingle()
      : await supabase.from("site_ekip").insert(row).select().maybeSingle();
    if (error) throw error;
    return data ? dbToEkip(data) : null;
  }
  return lsSave("ekip", member);
}

export async function softDeleteEkipMember(id) {
  if (hasSupabaseEnv) {
    await supabase.from("site_ekip").update({ deleted: true, deleted_at: new Date().toISOString() }).eq("id", id);
    return;
  }
  lsSoftDelete("ekip", id);
}

export async function restoreEkipMember(id) {
  if (hasSupabaseEnv) {
    await supabase.from("site_ekip").update({ deleted: false, deleted_at: null }).eq("id", id);
    return;
  }
  lsRestore("ekip", id);
}

function dbToEkip(r) {
  return { id: r.id, name: r.name, role: r.role, coordinationTitle: r.coordination_title, department: r.department, photo: r.photo, instagram: r.instagram, linkedin: r.linkedin, category: r.category, order: r.sort_order, isDeleted: r.deleted, deletedAt: r.deleted_at };
}
function ekipToDb(a) {
  const row = { name: a.name, role: a.role, coordination_title: a.coordinationTitle, department: a.department, photo: a.photo, instagram: a.instagram, linkedin: a.linkedin, category: a.category, sort_order: a.order };
  if (a.id) row.id = a.id;
  return row;
}

// ─── SPONSORS ──────────────────────────────────────────────────────────────
export async function getSponsors({ includeDeleted = false } = {}) {
  if (hasSupabaseEnv) {
    let q = supabase.from("site_sponsors").select("*").order("sort_order");
    if (!includeDeleted) q = q.eq("deleted", false);
    const { data } = await q;
    return (data || []).map(dbToSponsor);
  }
  const all = lsGet("sponsorlar");
  return includeDeleted ? all : all.filter(s => !s.isDeleted);
}

export async function getSponsorById(id) {
  if (hasSupabaseEnv) {
    const { data } = await supabase.from("site_sponsors").select("*").eq("id", id).maybeSingle();
    return data ? dbToSponsor(data) : null;
  }
  return lsGet("sponsorlar").find(s => String(s.id) === String(id)) ?? null;
}

export async function saveSponsor(sponsor) {
  if (hasSupabaseEnv) {
    const row = sponsorToDb(sponsor);
    const { data, error } = sponsor.id
      ? await supabase.from("site_sponsors").update(row).eq("id", sponsor.id).select().maybeSingle()
      : await supabase.from("site_sponsors").insert(row).select().maybeSingle();
    if (error) throw error;
    return data ? dbToSponsor(data) : null;
  }
  return lsSave("sponsorlar", sponsor);
}

export async function softDeleteSponsor(id) {
  if (hasSupabaseEnv) {
    await supabase.from("site_sponsors").update({ deleted: true, deleted_at: new Date().toISOString() }).eq("id", id);
    return;
  }
  lsSoftDelete("sponsorlar", id);
}

export async function restoreSponsor(id) {
  if (hasSupabaseEnv) {
    await supabase.from("site_sponsors").update({ deleted: false, deleted_at: null }).eq("id", id);
    return;
  }
  lsRestore("sponsorlar", id);
}

function dbToSponsor(r) {
  return { id: r.id, name: r.name, logo: r.logo, website: r.website, instagram: r.instagram, linkedin: r.linkedin, order: r.sort_order, isDeleted: r.deleted, deletedAt: r.deleted_at };
}
function sponsorToDb(a) {
  const row = { name: a.name, logo: a.logo, website: a.website, instagram: a.instagram, linkedin: a.linkedin, sort_order: a.order };
  if (a.id) row.id = a.id;
  return row;
}

// ─── GALLERY ───────────────────────────────────────────────────────────────
export async function getGallery({ includeDeleted = false } = {}) {
  if (hasSupabaseEnv) {
    let q = supabase.from("site_gallery").select("*").order("sort_order");
    if (!includeDeleted) q = q.eq("deleted", false);
    const { data } = await q;
    return (data || []).map(dbToGallery);
  }
  const all = lsGet("galeri");
  return includeDeleted ? all : all.filter(g => !g.isDeleted);
}

export async function getGalleryById(id) {
  if (hasSupabaseEnv) {
    const { data } = await supabase.from("site_gallery").select("*").eq("id", id).maybeSingle();
    return data ? dbToGallery(data) : null;
  }
  return lsGet("galeri").find(g => String(g.id) === String(id)) ?? null;
}

export async function saveGalleryItem(item) {
  if (hasSupabaseEnv) {
    const row = galleryToDb(item);
    const { data, error } = item.id
      ? await supabase.from("site_gallery").update(row).eq("id", item.id).select().maybeSingle()
      : await supabase.from("site_gallery").insert(row).select().maybeSingle();
    if (error) throw error;
    return data ? dbToGallery(data) : null;
  }
  return lsSave("galeri", item);
}

export async function softDeleteGalleryItem(id) {
  if (hasSupabaseEnv) {
    await supabase.from("site_gallery").update({ deleted: true, deleted_at: new Date().toISOString() }).eq("id", id);
    return;
  }
  lsSoftDelete("galeri", id);
}

export async function restoreGalleryItem(id) {
  if (hasSupabaseEnv) {
    await supabase.from("site_gallery").update({ deleted: false, deleted_at: null }).eq("id", id);
    return;
  }
  lsRestore("galeri", id);
}

function dbToGallery(r) {
  return { id: r.id, title: r.title, desc: r.desc, img: r.img, category: r.category, order: r.sort_order, isDeleted: r.deleted, deletedAt: r.deleted_at };
}
function galleryToDb(a) {
  const row = { title: a.title, desc: a.desc, img: a.img, category: a.category, sort_order: a.order };
  if (a.id) row.id = a.id;
  return row;
}

// ─── ANNOUNCEMENTS ─────────────────────────────────────────────────────────
export async function getAnnouncements({ includeDeleted = false, activeOnly = false } = {}) {
  if (hasSupabaseEnv) {
    let q = supabase.from("site_announcements").select("*")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });
    if (!includeDeleted) q = q.eq("deleted", false);
    if (activeOnly) q = q.eq("active", true);
    const { data } = await q;
    return (data || []).map(dbToAnnouncement);
  }
  let all = lsGet("duyurular");
  if (!includeDeleted) all = all.filter(a => !a.isDeleted);
  if (activeOnly) all = all.filter(a => a.active);
  return all;
}

export async function getAnnouncementById(id) {
  if (hasSupabaseEnv) {
    const { data } = await supabase.from("site_announcements").select("*").eq("id", id).maybeSingle();
    return data ? dbToAnnouncement(data) : null;
  }
  return lsGet("duyurular").find(a => String(a.id) === String(id)) ?? null;
}

export async function saveAnnouncement(item) {
  if (hasSupabaseEnv) {
    const row = announcementToDb(item);
    const { data, error } = item.id
      ? await supabase.from("site_announcements").update(row).eq("id", item.id).select().maybeSingle()
      : await supabase.from("site_announcements").insert(row).select().maybeSingle();
    if (error) throw error;
    return data ? dbToAnnouncement(data) : null;
  }
  return lsSave("duyurular", item);
}

export async function softDeleteAnnouncement(id) {
  if (hasSupabaseEnv) {
    await supabase.from("site_announcements").update({ deleted: true, deleted_at: new Date().toISOString() }).eq("id", id);
    return;
  }
  lsSoftDelete("duyurular", id);
}

function dbToAnnouncement(r) {
  return { id: r.id, title: r.title, content: r.content, type: r.type, active: r.active, pinned: r.pinned, expiresAt: r.expires_at, isDeleted: r.deleted, deletedAt: r.deleted_at, createdAt: r.created_at };
}
function announcementToDb(a) {
  const row = { title: a.title, content: a.content, type: a.type ?? "info", active: a.active ?? true, pinned: a.pinned ?? false, expires_at: a.expiresAt ?? null };
  if (a.id) row.id = a.id;
  return row;
}

// ─── APPLICATIONS ──────────────────────────────────────────────────────────
export async function getApplications() {
  if (hasSupabaseEnv) {
    const { data } = await supabase.from("site_applications").select("*").order("created_at", { ascending: false });
    return (data || []).map(dbToApplication);
  }
  return lsGet("basvurular");
}

export async function saveApplication(item) {
  if (hasSupabaseEnv) {
    const row = { name: item.name, email: item.email, department: item.department, team_interest: item.teamInterest, motivation: item.motivation };
    const { data, error } = await supabase.from("site_applications").insert(row).select().maybeSingle();
    if (error) throw error;
    return data ? dbToApplication(data) : null;
  }
  const all = lsGet("basvurular");
  const newItem = { ...item, id: Date.now().toString(), status: "beklemede", createdAt: new Date().toISOString() };
  all.unshift(newItem);
  lsSet("basvurular", all);
  return newItem;
}

export async function updateApplicationStatus(id, status, notes = "") {
  if (hasSupabaseEnv) {
    await supabase.from("site_applications").update({ status, notes }).eq("id", id);
    return;
  }
  const all = lsGet("basvurular");
  const idx = all.findIndex(a => String(a.id) === String(id));
  if (idx !== -1) { all[idx].status = status; all[idx].notes = notes; }
  lsSet("basvurular", all);
}

export async function deleteApplication(id) {
  if (hasSupabaseEnv) {
    await supabase.from("site_applications").delete().eq("id", id);
    return;
  }
  lsSet("basvurular", lsGet("basvurular").filter(a => String(a.id) !== String(id)));
}

function dbToApplication(r) {
  return { id: r.id, name: r.name, email: r.email, department: r.department, teamInterest: r.team_interest, motivation: r.motivation, status: r.status ?? "beklemede", notes: r.notes, createdAt: r.created_at };
}

// ─── PROJECTS ──────────────────────────────────────────────────────────────
export async function getProjects({ includeDeleted = false } = {}) {
  if (hasSupabaseEnv) {
    let q = supabase.from("site_projects").select("*")
      .order("featured", { ascending: false })
      .order("sort_order");
    if (!includeDeleted) q = q.eq("deleted", false);
    const { data } = await q;
    return (data || []).map(dbToProject);
  }
  const all = lsGet("projeler");
  return includeDeleted ? all : all.filter(p => !p.isDeleted);
}

export async function getProjectById(id) {
  if (hasSupabaseEnv) {
    const { data } = await supabase.from("site_projects").select("*").eq("id", id).maybeSingle();
    return data ? dbToProject(data) : null;
  }
  return lsGet("projeler").find(p => String(p.id) === String(id)) ?? null;
}

export async function saveProject(item) {
  if (hasSupabaseEnv) {
    const row = projectToDb(item);
    const { data, error } = item.id
      ? await supabase.from("site_projects").update(row).eq("id", item.id).select().maybeSingle()
      : await supabase.from("site_projects").insert(row).select().maybeSingle();
    if (error) throw error;
    return data ? dbToProject(data) : null;
  }
  return lsSave("projeler", item);
}

export async function softDeleteProject(id) {
  if (hasSupabaseEnv) {
    await supabase.from("site_projects").update({ deleted: true, deleted_at: new Date().toISOString() }).eq("id", id);
    return;
  }
  lsSoftDelete("projeler", id);
}

function dbToProject(r) {
  return { id: r.id, title: r.title, slug: r.slug, team: r.team, category: r.category, description: r.description, image: r.image, technologies: r.technologies ?? [], achievements: r.achievements ?? [], links: r.links ?? {}, year: r.year, featured: r.featured, order: r.sort_order, isDeleted: r.deleted, deletedAt: r.deleted_at };
}
function projectToDb(a) {
  const row = { title: a.title, slug: a.slug, team: a.team, category: a.category, description: a.description, image: a.image, technologies: a.technologies ?? [], achievements: a.achievements ?? [], links: a.links ?? {}, year: a.year, featured: a.featured ?? false, sort_order: a.order ?? 999 };
  if (a.id) row.id = a.id;
  return row;
}

// ─── SETTINGS ──────────────────────────────────────────────────────────────
export async function getSettings() {
  const defaults = { altYonetimCount: 20 };
  if (hasSupabaseEnv) {
    const { data } = await supabase.from("site_settings").select("*");
    if (data && data.length > 0) {
      return data.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), defaults);
    }
  }
  return lsGet("siteSettings", defaults);
}

export async function saveSettings(settings) {
  if (hasSupabaseEnv) {
    const upserts = Object.entries(settings).map(([key, value]) => ({ key, value }));
    await supabase.from("site_settings").upsert(upserts);
    return;
  }
  lsSet("siteSettings", settings);
}

// ─── LOGS ──────────────────────────────────────────────────────────────────
export async function createLog(action, entity, entityId, changes = null, userId = "admin") {
  const entry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    action,
    entity,
    entity_id: entityId ? String(entityId) : null,
    user_id: userId,
    changes,
    user_agent: navigator.userAgent,
    created_at: new Date().toISOString(),
  };
  if (hasSupabaseEnv) {
    await supabase.from("site_logs").insert(entry);
    return entry;
  }
  const logs = lsGet("admin-logs", []);
  logs.unshift({ ...entry, entityId, userId, timestamp: entry.created_at, userAgent: entry.user_agent });
  if (logs.length > 1000) logs.splice(1000);
  lsSet("admin-logs", logs);
  return entry;
}

export async function getLogs(filters = {}) {
  if (hasSupabaseEnv) {
    let q = supabase.from("site_logs").select("*").order("created_at", { ascending: false }).limit(1000);
    if (filters.action) q = q.eq("action", filters.action);
    if (filters.entity) q = q.eq("entity", filters.entity);
    const { data } = await q;
    return (data || []).map(r => ({ ...r, entityId: r.entity_id, userId: r.user_id, timestamp: r.created_at, userAgent: r.user_agent }));
  }
  const logs = lsGet("admin-logs", []);
  return logs.filter(log => {
    if (filters.action && log.action !== filters.action) return false;
    if (filters.entity && log.entity !== filters.entity) return false;
    return true;
  });
}
