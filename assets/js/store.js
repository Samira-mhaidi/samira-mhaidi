/*
 * SM Store : couche de données partagée par le site et le back-office.
 *
 * Deux modes, choisis par assets/js/config.js :
 *
 * Mode Supabase (production, V2)
 *   - contenu (collections, looks, réglages)  -> table site_content (une ligne JSON),
 *     lue une fois par visite puis gardée 10 min dans sessionStorage
 *   - fichiers importés (images WebP, PDF)     -> Storage, bucket "media" (pas de vidéos)
 *   - statistiques (événements anonymes)       -> table events_log (après accord cookies)
 *   - formulaires reçus (leads)                -> table leads
 *   - accès back-office                        -> Supabase Auth + rôle admin (user_roles)
 *   Si Supabase ne répond pas, le site s'affiche avec le contenu de seed.js.
 *
 * Mode démo (sans configuration, ou ?demo=1)
 *   - tout est stocké dans le navigateur (localStorage et IndexedDB), comme en V1.
 *
 * Dans les deux modes : consentement dans le cookie "sm_consent",
 * identifiant visiteur dans le cookie "sm_vid" (uniquement après accord).
 */
(function () {
  const KEYS = { data: "sm_data", events: "sm_events", leads: "sm_leads", auth: "sm_admin_session", account: "sm_admin_account", content: "sm_content" };
  const MAX_EVENTS = 4000;
  const CONSENT_DAYS = 180;
  const CONTENT_TTL = 10 * 60 * 1000;

  const SM = (window.SM = window.SM || {});
  SM.base = SM.base || "";
  SM.mediaUrls = {};

  /* ---------- utilitaires ---------- */
  const safe = (fn, fallback) => { try { return fn(); } catch (e) { return fallback; } };
  const readJSON = (k, fb) => safe(() => { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; }, fb);
  const writeJSON = (k, v) => safe(() => { localStorage.setItem(k, JSON.stringify(v)); return true; }, false);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const nul = (v) => (v === "" || v === undefined ? null : v);
  SM.uid = (p) => (p || "id") + "-" + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
  SM.slugify = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  SM.esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- mode ---------- */
  const CFG = window.SM_CONFIG || {};
  const forceDemo = safe(() => {
    const q = new URLSearchParams(location.search).get("demo");
    if (q === "1") sessionStorage.setItem("sm_force_demo", "1");
    if (q === "0") sessionStorage.removeItem("sm_force_demo");
    return sessionStorage.getItem("sm_force_demo") === "1";
  }, false);
  const live = !!(CFG.supabaseUrl && CFG.supabaseKey) && !forceDemo;
  SM.mode = live ? "supabase" : "demo";
  const API = live ? CFG.supabaseUrl.replace(/\/$/, "") : "";
  const BUCKET = CFG.mediaBucket || "media";
  /* Client complet (authentification, stockage) : chargé uniquement par le back-office. */
  const sb = live && window.supabase && window.supabase.createClient
    ? window.supabase.createClient(API, CFG.supabaseKey, { auth: { persistSession: true, autoRefreshToken: true, storageKey: "sm-admin-auth" } })
    : null;
  SM.sb = sb;

  /* Appel REST léger pour le site public (pas de bibliothèque à télécharger). */
  function rest(path, opts) {
    opts = opts || {};
    return fetch(API + "/rest/v1/" + path, {
      method: opts.method || "GET",
      headers: Object.assign({ apikey: CFG.supabaseKey, "Content-Type": "application/json" }, opts.headers || {}),
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      keepalive: !!opts.keepalive
    });
  }

  /* ---------- contenu ---------- */
  let remote = null;
  SM.contentMissing = false;
  SM.contentError = null;

  /* Complète un contenu enregistré avec les rubriques ajoutées depuis dans seed.js. */
  function complete(d) {
    const seed = window.SM_SEED;
    Object.keys(seed).forEach((k) => { if (d[k] === undefined) d[k] = clone(seed[k]); });
    ["settings", "integrations"].forEach((k) => Object.keys(seed[k]).forEach((s) => { if (d[k][s] === undefined) d[k][s] = clone(seed[k][s]); }));
    return d;
  }

  /* À appeler (await) avant getData(). opts.fresh : ignorer le cache de session (back-office). */
  SM.ready = async function (opts) {
    opts = opts || {};
    await SM.loadFiles();
    if (!live) return;
    if (!opts.fresh) {
      const c = safe(() => JSON.parse(sessionStorage.getItem(KEYS.content)), null);
      if (c && c.data && Date.now() - c.t < CONTENT_TTL) { remote = c.data; return; }
    }
    try {
      const r = await rest("site_content?id=eq.1&select=data");
      if (!r.ok) { const e = new Error("HTTP " + r.status); e.status = r.status; throw e; }
      const rows = await r.json();
      if (rows[0] && rows[0].data) {
        remote = rows[0].data;
        safe(() => sessionStorage.setItem(KEYS.content, JSON.stringify({ t: Date.now(), data: remote })));
      } else SM.contentMissing = true;
    } catch (e) { SM.contentError = e; }
  };

  SM.getData = function () {
    if (live) return complete(clone(remote || window.SM_SEED));
    const stored = readJSON(KEYS.data, null);
    if (stored && stored.version === window.SM_SEED.version) return stored;
    return clone(window.SM_SEED);
  };

  /* Mode Supabase : enregistrement groupé (700 ms après la dernière modification). */
  let pending = null, saveTimer = null;
  SM.onSaveError = null;
  SM.saveData = function (data) {
    data.updatedAt = new Date().toISOString();
    if (!live) return writeJSON(KEYS.data, data);
    remote = data; pending = data;
    clearTimeout(saveTimer); saveTimer = setTimeout(SM.flush, 700);
    return true;
  };
  SM.hasPending = () => !!pending;
  SM.flush = async function () {
    clearTimeout(saveTimer);
    if (!live || !pending) return true;
    if (!sb) return false;
    const body = pending; pending = null;
    const { error } = await sb.from("site_content").upsert({ id: 1, data: body, updated_at: new Date().toISOString() });
    if (error) {
      if (!pending) pending = body;
      if (SM.onSaveError) SM.onSaveError(error);
      return false;
    }
    safe(() => sessionStorage.removeItem(KEYS.content));
    return true;
  };
  SM.resetData = function () {
    if (live) { remote = clone(window.SM_SEED); SM.saveData(remote); return; }
    safe(() => localStorage.removeItem(KEYS.data));
  };

  SM.findCollection = (data, slug) => data.collections.find((c) => c.slug === slug || c.id === slug);
  SM.allLooks = function (data) {
    const out = [];
    data.collections.forEach((c) => (c.looks || []).forEach((l) => out.push(Object.assign({ collectionId: c.id, collectionName: c.name, collectionSlug: c.slug, collectionStatus: c.status }, l))));
    return out;
  };
  SM.publishedCollections = (data) => data.collections.filter((c) => c.status !== "draft").sort((a, b) => (a.order || 0) - (b.order || 0));

  /* ---------- médias ---------- */
  function idb() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject(new Error("IndexedDB indisponible"));
      const req = indexedDB.open("sm_media", 1);
      req.onupgradeneeded = () => req.result.createObjectStore("files", { keyPath: "id" });
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  async function tx(mode, fn) {
    const db = await idb();
    return new Promise((resolve, reject) => {
      const t = db.transaction("files", mode);
      const store = t.objectStore("files");
      const r = fn(store);
      t.oncomplete = () => resolve(r && r.result !== undefined ? r.result : r);
      t.onerror = () => reject(t.error);
    });
  }
  SM.publicUrl = (path) => API + "/storage/v1/object/public/" + BUCKET + "/" + path;
  SM.putFile = async function (blob, meta) {
    if (live) {
      if (!sb) throw new Error("Supabase indisponible");
      const ext = ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif", "application/pdf": "pdf" })[blob.type] || "bin";
      const d = new Date();
      const name = SM.slugify(String((meta && meta.name) || "fichier").replace(/\.[^.]+$/, "")).slice(0, 40) || "fichier";
      const path = `uploads/${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${name}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      /* Cache d'un an : les navigateurs et le CDN de Supabase ne retéléchargent pas l'image. */
      const { error } = await sb.storage.from(BUCKET).upload(path, blob, { cacheControl: "31536000", contentType: blob.type, upsert: false });
      if (error) throw error;
      return SM.publicUrl(path);
    }
    const id = SM.uid("m");
    await tx("readwrite", (s) => s.put({ id, blob, type: blob.type, name: meta && meta.name, size: blob.size }));
    SM.mediaUrls[id] = URL.createObjectURL(blob);
    return "idb:" + id;
  };
  SM.deleteFile = async function (ref) {
    if (!ref) return;
    if (live) {
      const prefix = SM.publicUrl("");
      if (ref.startsWith(prefix) && sb) {
        const { error } = await sb.storage.from(BUCKET).remove([ref.slice(prefix.length)]);
        if (error) throw error;
      }
      return;
    }
    if (!ref.startsWith("idb:")) return;
    const id = ref.slice(4);
    await tx("readwrite", (s) => s.delete(id));
    if (SM.mediaUrls[id]) URL.revokeObjectURL(SM.mediaUrls[id]);
    delete SM.mediaUrls[id];
  };
  SM.loadFiles = async function () {
    if (live) return;
    try {
      const all = await tx("readonly", (s) => s.getAll());
      (all || []).forEach((f) => { if (!SM.mediaUrls[f.id]) SM.mediaUrls[f.id] = URL.createObjectURL(f.blob); });
    } catch (e) { /* navigation privée : pas de médias importés */ }
  };
  SM.url = function (ref) {
    if (!ref) return "";
    if (ref.startsWith("idb:")) return SM.mediaUrls[ref.slice(4)] || "";
    if (/^(https?:|data:|blob:|\/)/.test(ref)) return ref;
    return SM.base + ref;
  };
  SM.isVideo = (ref, type) => /video/.test(type || "") || /\.(mp4|webm|mov)(\?|$)/i.test(ref || "");

  /* Redimensionne une image importée (1800 px max) et la convertit en WebP
     (repli JPEG/PNG si le navigateur ne sait pas encoder le WebP).
     Garde l'original s'il est déjà plus léger. */
  SM.compressImage = function (file, max = 1800, quality = 0.82) {
    return new Promise((resolve) => {
      if (!/^image\/(jpeg|png|webp)/.test(file.type)) return resolve(file);
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(img.src);
        const fallback = file.type === "image/png" ? "image/png" : "image/jpeg";
        const pick = (b) => resolve(b && (b.size < file.size || k < 1) ? b : file);
        c.toBlob((b) => {
          if (b && b.type === "image/webp") return pick(b);
          c.toBlob(pick, fallback, quality);
        }, "image/webp", quality);
      };
      img.onerror = () => resolve(file);
      img.src = URL.createObjectURL(file);
    });
  };

  /* ---------- cookies & consentement ---------- */
  SM.cookie = {
    get(name) { const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)")); return m ? decodeURIComponent(m[1]) : null; },
    set(name, value, days) {
      const d = new Date(Date.now() + days * 864e5).toUTCString();
      const secure = location.protocol === "https:" ? "; Secure" : "";
      document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + d + "; path=/; SameSite=Lax" + secure;
    },
    del(name) { document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"; }
  };
  SM.getConsent = () => safe(() => JSON.parse(SM.cookie.get("sm_consent")), null);
  SM.setConsent = function (c) {
    const value = { analytics: !!c.analytics, marketing: !!c.marketing, t: Date.now(), v: 1 };
    SM.cookie.set("sm_consent", JSON.stringify(value), CONSENT_DAYS);
    if (!value.analytics) SM.cookie.del("sm_vid");
    SM.track("consent", { choice: c.choice || (value.analytics && value.marketing ? "accept" : !value.analytics && !value.marketing ? "refuse" : "custom"), analytics: value.analytics, marketing: value.marketing }, true);
    return value;
  };

  /* ---------- statistiques ---------- */
  function visitorId() {
    const c = SM.getConsent();
    if (!c || !c.analytics) return null;
    let v = SM.cookie.get("sm_vid");
    if (!v) { v = SM.uid("v"); SM.cookie.set("sm_vid", v, 395); }
    return v;
  }
  function sessionId() {
    return safe(() => {
      let s = sessionStorage.getItem("sm_sid");
      if (!s) { s = SM.uid("s"); sessionStorage.setItem("sm_sid", s); }
      return s;
    }, "s-nostore");
  }
  function source() {
    return safe(() => {
      let src = sessionStorage.getItem("sm_src");
      if (src) return src;
      const q = new URLSearchParams(location.search);
      if (q.get("utm_source")) src = q.get("utm_source").toLowerCase();
      else if (q.get("fbclid")) src = "facebook";
      else if (q.get("gclid")) src = "google ads";
      else if (document.referrer && !document.referrer.includes(location.host)) {
        const h = new URL(document.referrer).hostname.replace(/^www\./, "");
        src = /google\./.test(h) ? "google" : /instagram/.test(h) ? "instagram" : /facebook|fb\./.test(h) ? "facebook" : /tiktok/.test(h) ? "tiktok" : h;
      } else src = "direct";
      sessionStorage.setItem("sm_src", src);
      return src;
    }, "direct");
  }
  function device() {
    const w = Math.min(screen.width, window.innerWidth || screen.width);
    return w < 640 ? "mobile" : w < 1024 ? "tablette" : "ordinateur";
  }
  /* essential = true : enregistré même sans accord (choix de consentement uniquement, sans identifiant). */
  SM.track = function (type, data, essential) {
    const c = SM.getConsent();
    if (!essential && (!c || !c.analytics)) return;
    const ev = {
      t: Date.now(), type, data: data || {},
      vid: essential ? null : visitorId(), sid: sessionId(),
      page: location.pathname.split("/").pop() || "index.html",
      src: source(), device: device(), lang: (navigator.language || "fr").slice(0, 2)
    };
    if (live) {
      if (!/^https?:/.test(location.protocol)) return;
      rest("events_log", {
        method: "POST", headers: { Prefer: "return=minimal" }, keepalive: true,
        body: { type: String(type).slice(0, 40), visitor_id: ev.vid, session_id: ev.sid, page: ev.page.slice(0, 120), source: String(ev.src).slice(0, 80), device: ev.device, lang: ev.lang, data: ev.data }
      }).catch(() => {});
      return;
    }
    const events = readJSON(KEYS.events, []);
    events.push(ev);
    if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS);
    writeJSON(KEYS.events, events);
  };
  let remoteEvents = [];
  SM.getEvents = () => (live ? remoteEvents : readJSON(KEYS.events, []));
  /* Back-office (mode Supabase) : charge les statistiques des `days` derniers jours. */
  SM.loadEvents = async function (days) {
    if (!live || !sb) return;
    const since = new Date(Date.now() - days * 864e5).toISOString();
    const out = [], PAGE = 1000;
    for (let from = 0; from < 200000; from += PAGE) {
      const { data, error } = await sb.from("events_log").select("created_at,type,visitor_id,session_id,page,source,device,lang,data").gte("created_at", since).order("created_at", { ascending: true }).range(from, from + PAGE - 1);
      if (error) throw error;
      data.forEach((r) => out.push({ t: Date.parse(r.created_at), type: r.type, data: r.data || {}, vid: r.visitor_id, sid: r.session_id, page: r.page, src: r.source, device: r.device, lang: r.lang }));
      if (data.length < PAGE) break;
    }
    remoteEvents = out;
  };
  SM.clearEvents = async function () {
    if (!live) return writeJSON(KEYS.events, []);
    const { error } = await sb.from("events_log").delete().gte("id", 0);
    if (error) throw error;
    remoteEvents = [];
  };

  /* ---------- formulaires reçus ---------- */
  let remoteLeads = [];
  const fromRow = (r) => ({ id: r.id, t: Date.parse(r.created_at), form: r.form, name: r.name || "", email: r.email || "", phone: r.phone || "", type: r.type || "", typeLabel: r.type_label || "", look: r.look || "", date: r.wish_date || "", message: r.message || "", newsletter: !!r.newsletter, status: r.status, note: r.note || "", vid: r.visitor_id, src: r.source || "", device: r.device || "" });
  SM.getLeads = () => (live ? remoteLeads : readJSON(KEYS.leads, []));
  SM.saveLeads = (l) => (live ? false : writeJSON(KEYS.leads, l));
  /* Enregistre une demande. Renvoie la demande, ou null si l'envoi a échoué. */
  SM.addLead = async function (lead) {
    const rec = Object.assign({ id: SM.uid("lead"), t: Date.now(), status: "nouveau", vid: SM.cookie.get("sm_vid"), src: source(), device: device() }, lead);
    if (!live) {
      const leads = SM.getLeads();
      leads.unshift(rec);
      SM.saveLeads(leads);
      return rec;
    }
    try {
      const r = await rest("leads", {
        method: "POST", headers: { Prefer: "return=minimal" },
        body: { form: rec.form || "contact", name: nul(rec.name), email: nul(rec.email), phone: nul(rec.phone), type: nul(rec.type), type_label: nul(rec.typeLabel), look: nul(rec.look), wish_date: nul(rec.date), message: nul(rec.message), newsletter: !!rec.newsletter, visitor_id: nul(rec.vid), source: nul(rec.src), device: nul(rec.device) }
      });
      return r.ok ? rec : null;
    } catch (e) { return null; }
  };
  /* Back-office (mode Supabase) : charge les 2 000 demandes les plus récentes. */
  SM.loadLeads = async function () {
    if (!live || !sb) return;
    const { data, error } = await sb.from("leads").select("*").order("created_at", { ascending: false }).limit(2000);
    if (error) throw error;
    remoteLeads = data.map(fromRow);
  };
  SM.updateLead = async function (id, patch) {
    if (!live) { const l = SM.getLeads(); const x = l.find((y) => y.id === id); if (x) Object.assign(x, patch); SM.saveLeads(l); return; }
    const row = {};
    if ("status" in patch) row.status = patch.status;
    if ("note" in patch) row.note = nul(patch.note);
    const { error } = await sb.from("leads").update(row).eq("id", id);
    if (error) throw error;
    const x = remoteLeads.find((y) => y.id === id); if (x) Object.assign(x, patch);
  };
  SM.deleteLead = async function (id) {
    if (!live) { SM.saveLeads(SM.getLeads().filter((y) => y.id !== id)); return; }
    const { error } = await sb.from("leads").delete().eq("id", id);
    if (error) throw error;
    remoteLeads = remoteLeads.filter((y) => y.id !== id);
  };

  /* ---------- accès back-office ---------- */
  const DEMO_ACCOUNT = { email: "demo@samiramhaidi.ma", password: "Caftan2026" };
  SM.demoAccount = live ? null : DEMO_ACCOUNT;
  let liveSession = null;
  SM.lastLoginError = "";
  async function isAdmin(user) {
    const { data, error } = await sb.rpc("has_role", { _user_id: user.id, _role: "admin" });
    return !error && data === true;
  }
  SM.getAccount = () => (live ? { email: liveSession ? liveSession.email : "" } : readJSON(KEYS.account, DEMO_ACCOUNT));
  SM.setAccount = async function (a) {
    if (!live) return writeJSON(KEYS.account, a);
    if (!a.password) return true;
    const { error } = await sb.auth.updateUser({ password: a.password });
    if (error) throw error;
    return true;
  };
  SM.login = async function (email, password) {
    SM.lastLoginError = "E-mail ou mot de passe incorrect.";
    if (!live) {
      const acc = SM.getAccount();
      const ok = String(email).trim().toLowerCase() === acc.email.toLowerCase() && password === acc.password;
      if (ok) safe(() => sessionStorage.setItem(KEYS.auth, JSON.stringify({ email: acc.email, t: Date.now() })));
      return ok;
    }
    if (!sb) { SM.lastLoginError = "Connexion à Supabase impossible. Vérifiez votre connexion internet."; return false; }
    const { data, error } = await sb.auth.signInWithPassword({ email: String(email).trim(), password });
    if (error || !data.user) return false;
    if (!(await isAdmin(data.user))) {
      await sb.auth.signOut();
      SM.lastLoginError = "Ce compte n'a pas accès au back-office.";
      return false;
    }
    liveSession = { email: data.user.email, t: Date.now() };
    return true;
  };
  /* Vérifie au démarrage du back-office si une session admin est ouverte. */
  SM.checkSession = async function () {
    if (!live) return SM.session();
    if (!sb) return null;
    const { data } = await sb.auth.getSession();
    const user = data && data.session && data.session.user;
    liveSession = user && (await isAdmin(user)) ? { email: user.email, t: Date.now() } : null;
    return liveSession;
  };
  SM.logout = async function () {
    if (!live) return safe(() => sessionStorage.removeItem(KEYS.auth));
    liveSession = null;
    if (sb) await sb.auth.signOut();
  };
  SM.session = () => (live ? liveSession : safe(() => JSON.parse(sessionStorage.getItem(KEYS.auth)), null));

  /* ---------- sauvegarde complète (export / import JSON) ---------- */
  SM.exportAll = () => ({ exportedAt: new Date().toISOString(), mode: SM.mode, data: SM.getData(), leads: SM.getLeads(), events: SM.getEvents() });
  /* En mode Supabase, seul le contenu est réimporté (les demandes et statistiques restent en base). */
  SM.importAll = function (obj) {
    if (obj.data) SM.saveData(obj.data);
    if (live) return;
    if (obj.leads) SM.saveLeads(obj.leads);
    if (obj.events) writeJSON(KEYS.events, obj.events);
  };
})();
