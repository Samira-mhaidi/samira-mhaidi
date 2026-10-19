/*
 * Back-office Samira Mhaidi.
 * Mode Supabase : connexion par Supabase Auth (rôle admin), contenu, demandes,
 * statistiques et médias enregistrés dans Supabase via SM (store.js).
 * Mode démo : tout est enregistré dans le navigateur ; les statistiques « Démo »
 * sont générées pour illustrer le tableau de bord.
 */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = SM.esc;
  const LIVE = SM.mode === "supabase";
  let D;
  const state = { range: 30, source: LIVE ? "real" : "demo", leadStatus: "all", leadType: "", leadQ: "", visitors: "all", media: { collection: "", category: "", catalogue: "", kind: "" }, uploadTo: { collection: "", category: "", catalogue: "" } };
  let after = [];

  const ASSETS = ["hero-porte-doree.jpg", "portrait-samira.jpg", "look-emeraude-defile.jpg", "look-majorelle-defile.jpg", "detail-rose-poudre.jpg", "detail-dentelle-citron.jpg", "look-ivoire-or.jpg", "look-menthe-brocart.jpg", "look-bleu-roi.jpg", "look-corail-or.jpg", "look-corail-profil.jpg", "look-leopard.jpg", "look-ciel-porte-doree.jpg", "look-rose-nuit.jpg", "look-lanterne.jpg", "look-lanterne-aqua.jpg", "look-citron-lame.jpg", "look-citron-lame-pied.jpg", "look-ivoire-brun.jpg", "look-fuchsia.jpg", "look-turquoise-moucharabieh.jpg", "look-rose-sequins.jpg", "look-sable-fleuri.jpg", "runway-ivoire-or.jpg", "runway-jardin-fleuri.jpg", "runway-emeraude.jpg", "runway-pourpre.jpg", "runway-cape-ivoire.jpg", "runway-bleu-or.jpg", "event-photocall-ancmm.jpg", "event-conference.jpg", "event-conference-parole.jpg", "event-intervention.jpg", "event-invitees-caftan.jpg"].map((f) => "assets/img/" + f);

  const ic = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const I = {
    dash: ic('<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>'),
    users: ic('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.8c1.6.8 2.6 2.6 3 5.2"/>'),
    inbox: ic('<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1.5 2.5h5L16 13h5"/>'),
    coll: ic('<path d="M12 3c-2 2.5-5 3-5 3l1 15h8l1-15s-3-.5-5-3z"/><path d="M9.5 10h5"/>'),
    book: ic('<path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/>'),
    image: ic('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M3 18l6-5 4 3 3-2 5 4"/>'),
    cal: ic('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    text: ic('<path d="M4 6h16M4 12h10M4 18h13"/>'),
    plug: ic('<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0z"/><path d="M12 18v4"/>'),
    gear: ic('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
    ext: ic('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
    out: ic('<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H4"/>'),
    plus: ic('<path d="M12 5v14M5 12h14"/>'),
    x: ic('<path d="M6 6l12 12M18 6L6 18"/>'),
    up: ic('<path d="M12 19V5M6 11l6-6 6 6"/>'),
    down: ic('<path d="M12 5v14M6 13l6 6 6-6"/>'),
    trash: ic('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
    dl: ic('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'),
    upl: ic('<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>'),
    video: ic('<rect x="3" y="5" width="13" height="14" rx="2"/><path d="M16 10l5-3v10l-5-3z"/>'),
    table: ic('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16"/>'),
    chart: ic('<path d="M4 19h16M7 16l4-5 3 3 5-7"/>'),
    menu: ic('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    mail: ic('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3z"/></svg>'
  };

  /* ---------- utilitaires ---------- */
  const fmtN = (n) => new Intl.NumberFormat("fr-FR").format(Math.round(n || 0));
  const fmtP = (n) => (isFinite(n) ? (n * 100).toLocaleString("fr-FR", { maximumFractionDigits: 1 }) + " %" : "—");
  const fmtD = (t, o) => new Intl.DateTimeFormat("fr-FR", o || { day: "numeric", month: "short" }).format(new Date(t));
  const fmtDT = (t) => new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(t));
  const DAY = 864e5;
  const dayKey = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
  const getPath = (o, p) => p.split(".").reduce((a, k) => (a == null ? a : a[k]), o);
  const setPath = (o, p, v) => { const ks = p.split("."); const last = ks.pop(); const t = ks.reduce((a, k) => (a[k] == null ? (a[k] = {}) : a[k]), o); t[last] = v; };
  const catName = (id) => (D.categories.find((c) => c.id === id) || {}).name || "";

  function toast(msg) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
    t.innerHTML = `<i></i>${esc(msg)}`;
    t.classList.add("is-on");
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("is-on"), 1800);
  }
  function save(msg) { SM.saveData(D); toast(msg || "Modifications enregistrées"); }
  const errMsg = (e) => (e && (e.message || e.error_description)) || "erreur inconnue";
  SM.onSaveError = (e) => toast("Échec de l'enregistrement en ligne : " + errMsg(e) + ". Réessayez.");
  window.addEventListener("beforeunload", (e) => { if (SM.hasPending()) { SM.flush(); e.preventDefault(); e.returnValue = ""; } });
  function download(name, content, type) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type: type || "text/plain" }));
    a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  /* ---------- infobulle ---------- */
  const tip = document.createElement("div");
  tip.className = "tip";
  const showTip = (html, x, y) => { tip.innerHTML = html; tip.style.left = x + "px"; tip.style.top = y + "px"; tip.classList.add("is-on"); };
  const hideTip = () => tip.classList.remove("is-on");
  document.addEventListener("mousemove", (e) => {
    const t = e.target.closest && e.target.closest("[data-tip]");
    if (t) showTip(t.dataset.tip, e.clientX, e.clientY);
    else if (!e.target.closest || !e.target.closest(".chart-plot")) hideTip();
  });

  /* =========================================================
     STATISTIQUES
     ========================================================= */
  function rng(seed) { return function () { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function pick(r, weights) { const tot = weights.reduce((a, w) => a + w[1], 0); let x = r() * tot; for (const w of weights) { if ((x -= w[1]) <= 0) return w[0]; } return weights[0][0]; }
  let demoCache = null;
  function demoSessions() {
    if (demoCache) return demoCache;
    const r = rng(20261002);
    const out = [], pool = [];
    const today = dayKey(Date.now());
    const looks = SM.allLooks(D).filter((l) => l.image).map((l) => l.name);
    const pagesW = [["index.html", 10], ["collections.html", 5.5], ["collection.html", 5], ["maison.html", 2.5], ["evenements.html", 1.5], ["contact.html", 3]];
    for (let d = 89; d >= 0; d--) {
      const day = today - d * DAY;
      const dow = new Date(day).getDay();
      let n = 34 + (89 - d) * 0.25;
      if (dow === 0 || dow === 6) n *= 1.25;
      if (d >= 10 && d <= 13) n *= 1.9; // campagne Instagram
      n = Math.round(n * (0.78 + r() * 0.44));
      for (let i = 0; i < n; i++) {
        const src = d >= 10 && d <= 13 && r() < 0.5 ? "instagram" : pick(r, [["instagram", 36], ["direct", 21], ["google", 18], ["facebook", 12], ["tiktok", 7], ["whatsapp", 6]]);
        const device = pick(r, [["mobile", 72], ["ordinateur", 22], ["tablette", 6]]);
        const consent = pick(r, [["accept", 60], ["refuse", 22], ["custom", 18]]);
        const analytics = consent === "accept" || (consent === "custom" && r() < 0.7);
        let vid = null;
        if (analytics) { if (pool.length && r() < 0.24) vid = pool[Math.floor(r() * pool.length)]; else { vid = "v-" + Math.floor(r() * 1e9).toString(36); pool.push(vid); } }
        const np = 1 + Math.min(6, Math.floor(-Math.log(1 - r()) / 0.6));
        const pages = [src === "instagram" && r() < 0.35 ? "collection.html" : r() < 0.8 ? "index.html" : "collections.html"];
        for (let k = 1; k < np; k++) pages.push(pick(r, pagesW));
        const sawContact = pages.includes("contact.html");
        const formStart = r() < (sawContact ? 0.38 : 0.025);
        const formSubmit = formStart && r() < 0.47;
        const lv = Math.floor(r() * (pages.includes("collection.html") ? 4 : 1.6));
        const hour = 9 + Math.floor(r() * 14);
        out.push({
          sid: "d" + d + "-" + i, vid, t: day + hour * 36e5 + Math.floor(r() * 36e5), src, device, consent, analytics,
          pages: analytics ? pages : [], formStart: analytics && formStart, formSubmit: analytics && formSubmit, abandonFields: formStart && !formSubmit ? ["name", "email", "phone", "type", "message"].slice(0, 1 + Math.floor(r() * 4)) : [],
          looks: analytics ? Array.from({ length: lv }, () => looks[Math.floor(r() * looks.length)]) : [], wa: r() < 0.05, demo: true
        });
      }
    }
    demoCache = out;
    return out;
  }
  function realSessions() {
    const by = {};
    SM.getEvents().forEach((e) => {
      const s = by[e.sid] || (by[e.sid] = { sid: e.sid, vid: null, t: e.t, src: e.src, device: e.device, consent: null, analytics: false, pages: [], formStart: false, formSubmit: false, abandonFields: [], looks: [], wa: false });
      s.t = Math.min(s.t, e.t);
      if (e.vid) { s.vid = e.vid; s.analytics = true; }
      if (e.type === "pageview") { s.pages.push(e.page); s.analytics = true; }
      if (e.type === "consent") { s.consent = e.data.choice; if (e.data.analytics) s.analytics = true; }
      if (e.type === "form_start") s.formStart = true;
      if (e.type === "form_submit" && e.data.form === "contact") s.formSubmit = true;
      if (e.type === "form_abandon") s.abandonFields = e.data.fields || [];
      if (e.type === "look_view") s.looks.push(e.data.look);
      if (e.type === "click_whatsapp") s.wa = true;
    });
    return Object.values(by).sort((a, b) => b.t - a.t);
  }
  function sessionsIn(from, to) {
    const all = (state.source === "demo" ? demoSessions() : []).concat(realSessions());
    return all.filter((s) => s.t >= from && s.t < to).sort((a, b) => b.t - a.t);
  }
  function stats(days) {
    const to = dayKey(Date.now()) + DAY, from = to - days * DAY;
    const cur = sessionsIn(from, to), prev = sessionsIn(from - days * DAY, from);
    const calc = (list) => {
      const vids = new Set(list.map((s) => s.vid || s.sid));
      const decided = list.filter((s) => s.consent);
      const starts = list.filter((s) => s.formStart).length, submits = list.filter((s) => s.formSubmit).length;
      return {
        sessions: list.length, visitors: vids.size, pageviews: list.reduce((a, s) => a + s.pages.length, 0),
        consentRate: decided.length ? decided.filter((s) => s.analytics).length / decided.length : NaN,
        starts, submits, conv: list.length ? submits / list.length : NaN, wa: list.filter((s) => s.wa).length
      };
    };
    const count = (list, f) => { const m = {}; list.forEach((s) => [].concat(f(s)).forEach((k) => { if (k) m[k] = (m[k] || 0) + 1; })); return Object.entries(m).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value); };
    const byDay = [];
    for (let t = from; t < to; t += DAY) byDay.push({ t, value: 0 });
    cur.forEach((s) => { const i = Math.floor((dayKey(s.t) - from) / DAY); if (byDay[i]) byDay[i].value++; });
    const PAGE = { "index.html": "Accueil", "collections.html": "Collections", "collection.html": "Fiche collection", "maison.html": "La Maison", "evenements.html": "Événements", "contact.html": "Contact", "confidentialite.html": "Confidentialité" };
    return {
      cur: calc(cur), prev: prev.length ? calc(prev) : null, list: cur, byDay,
      sources: count(cur, (s) => s.src), devices: count(cur, (s) => s.device),
      pages: count(cur, (s) => s.pages.map((p) => PAGE[p] || p)),
      looks: count(cur, (s) => s.looks),
      consent: [{ label: "Tout accepté", value: cur.filter((s) => s.consent === "accept").length }, { label: "Personnalisé", value: cur.filter((s) => s.consent === "custom").length }, { label: "Refusé", value: cur.filter((s) => s.consent === "refuse").length }]
    };
  }

  /* ---------- graphiques ---------- */
  function lineChart(points, unit) {
    const id = "c" + Math.random().toString(36).slice(2, 7);
    const W = 760, H = 240, L = 40, R = 14, T = 14, B = 30;
    const max = Math.max(1, ...points.map((p) => p.value));
    const step = Math.pow(10, Math.floor(Math.log10(max))) * (max / Math.pow(10, Math.floor(Math.log10(max))) > 5 ? 2 : 1);
    const top = Math.ceil(max / step) * step || 1;
    const x = (i) => L + (points.length < 2 ? 0 : (i / (points.length - 1)) * (W - L - R));
    const y = (v) => T + (1 - v / top) * (H - T - B);
    const line = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join("");
    const area = `${line}L${x(points.length - 1).toFixed(1)},${y(0)}L${x(0)},${y(0)}Z`;
    const grid = [0, 0.25, 0.5, 0.75, 1].map((f) => `<line class="grid-line" x1="${L}" x2="${W - R}" y1="${y(top * f)}" y2="${y(top * f)}"/><text class="axis-text" x="${L - 8}" y="${y(top * f) + 3}" text-anchor="end">${fmtN(top * f)}</text>`).join("");
    const every = Math.max(1, Math.ceil(points.length / 6));
    const xl = points.map((p, i) => (i % every === 0 || i === points.length - 1) && (i === points.length - 1 || points.length - 1 - i >= every / 2) ? `<text class="axis-text" x="${x(i)}" y="${H - 8}" text-anchor="middle">${fmtD(p.t)}</text>` : "").join("");
    after.push(() => {
      const el = document.getElementById(id); if (!el) return;
      const svg = $("svg", el), cross = $(".cross", el), dot = $(".dot", el);
      svg.addEventListener("mousemove", (e) => {
        const r = svg.getBoundingClientRect();
        const sx = ((e.clientX - r.left) / r.width) * W;
        const i = Math.max(0, Math.min(points.length - 1, Math.round(((sx - L) / (W - L - R)) * (points.length - 1))));
        cross.setAttribute("x1", x(i)); cross.setAttribute("x2", x(i));
        dot.setAttribute("cx", x(i)); dot.setAttribute("cy", y(points[i].value));
        el.classList.add("is-hover");
        showTip(`${fmtD(points[i].t, { weekday: "short", day: "numeric", month: "long" })}<br><b>${fmtN(points[i].value)}</b> ${unit}`, r.left + (x(i) / W) * r.width, r.top + (y(points[i].value) / H) * r.height);
      });
      svg.addEventListener("mouseleave", () => { el.classList.remove("is-hover"); hideTip(); });
    });
    return `<div class="chart" id="${id}"><div class="chart-plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Évolution des ${unit} par jour">${grid}<path class="area" d="${area}"/><path class="line" d="${line}"/><line class="cross" x1="0" x2="0" y1="${T}" y2="${H - B}"/><circle class="dot" r="5" cx="0" cy="0"/>${xl}</svg></div>
      <div class="chart-table tbl-wrap"><table class="tbl"><thead><tr><th>Date</th><th class="num">${esc(unit)}</th></tr></thead><tbody>${points.slice().reverse().map((p) => `<tr><td>${fmtD(p.t, { weekday: "short", day: "numeric", month: "short" })}</td><td class="num">${fmtN(p.value)}</td></tr>`).join("")}</tbody></table></div></div>`;
  }
  function bars(items, opts) {
    opts = opts || {};
    const total = opts.total || items.reduce((a, b) => a + b.value, 0) || 1;
    const max = Math.max(1, ...items.map((i) => i.value));
    if (!items.length) return `<div class="empty">Pas encore de données sur la période.</div>`;
    return `<div class="bars ${opts.cls || ""}">${items.slice(0, opts.limit || 8).map((i) => `<div class="bar" data-tip="${esc(esc(i.label))} : <b>${fmtN(i.value)}</b> ${esc(opts.unit || "")} (${fmtP(i.value / total)})"><span class="bar__label">${esc(i.label)}</span><div class="bar__track"><div class="bar__fill" style="width:${(i.value / max) * 100}%"></div></div><span class="bar__val">${opts.pct === false ? fmtN(i.value) : `${fmtN(i.value)} <small>${fmtP(i.value / total)}</small>`}</span></div>`).join("")}</div>`;
  }
  function delta(cur, prev, inverse) {
    if (prev == null || !isFinite(prev) || prev === 0 || !isFinite(cur)) return `<span class="kpi__delta">&nbsp;</span>`;
    const d = (cur - prev) / prev;
    const good = inverse ? d < 0 : d > 0;
    return `<span class="kpi__delta"><b class="${good ? "up" : "down"}">${d > 0 ? "▲" : "▼"} ${fmtP(Math.abs(d))}</b> vs période précédente</span>`;
  }
  const kpi = (label, value, d, tipText) => `<div class="kpi"${tipText ? ` data-tip="${esc(tipText)}"` : ""}><div class="kpi__label">${esc(label)}</div><div class="kpi__value">${value}</div>${d || ""}</div>`;

  /* =========================================================
     DEMANDES (formulaires)
     ========================================================= */
  function demoLeads() {
    let l = null;
    try { l = JSON.parse(localStorage.getItem("sm_demo_leads")); } catch (e) {}
    if (l) return l;
    const r = rng(77);
    const names = ["Salma Bennani", "Ghita El Alaoui", "Nadia Lahlou", "Kenza Amrani", "Meryem Tazi", "Imane Rachidi", "Houda Kettani", "Sofia Mernissi", "Yasmine Chraibi", "Lina Zniber", "Rania Ouazzani", "Amal Fassi", "Rédaction magazine mode", "Organisation salon du mariage"];
    const types = [["rdv", "Rendez-vous à l'atelier"], ["commande", "Commande sur mesure"], ["mariee", "Tenue de mariage ou de cérémonie"], ["avant-premiere", "Avant-première collection 2026"], ["presse", "Presse & partenariats"]];
    const looks = SM.allLooks(D).filter((x) => x.image);
    const msgs = ["Bonjour, je me marie en juin et je cherche une takchita dans les tons ivoire et or. Serait-il possible de venir à l'atelier un samedi ?", "Bonsoir, j'ai vu ce modèle sur Instagram, est-il possible de le réaliser dans une autre couleur ?", "Je souhaiterais prendre rendez-vous pour une tenue de fiançailles, idéalement la semaine prochaine.", "Bonjour, quels sont les délais pour un caftan sur mesure ? J'habite à Paris, faites-vous des expéditions ?", "Nous préparons un dossier sur la création marocaine et aimerions interviewer Samira Mhaidi.", "Bonjour, je voudrais être informée de la sortie de la prochaine collection."];
    l = names.map((n, i) => {
      const t = types[n.startsWith("Rédaction") ? 4 : n.startsWith("Organisation") ? 4 : Math.floor(r() * 4)];
      const lk = r() < 0.6 ? looks[Math.floor(r() * looks.length)] : null;
      return { id: "demo-" + i, demo: true, t: Date.now() - Math.floor(r() * 28 * DAY) - i * 36e5, form: "contact", name: n, email: SM.slugify(n).replace(/-/g, ".") + "@example.com", phone: "+212 6 " + String(10 + Math.floor(r() * 89)) + " " + String(10 + Math.floor(r() * 89)) + " " + String(10 + Math.floor(r() * 89)) + " " + String(10 + Math.floor(r() * 89)), type: t[0], typeLabel: t[1], look: lk ? lk.name + " — " + lk.collectionName : "", message: msgs[t[0] === "presse" ? 4 : t[0] === "avant-premiere" ? 5 : Math.floor(r() * 4)], status: i < 4 ? "nouveau" : i < 8 ? "en cours" : "traité", src: pick(r, [["instagram", 5], ["google", 2], ["direct", 2], ["facebook", 1]]), device: r() < 0.7 ? "mobile" : "ordinateur" };
    }).sort((a, b) => b.t - a.t);
    localStorage.setItem("sm_demo_leads", JSON.stringify(l));
    return l;
  }
  function allLeads() { return SM.getLeads().concat(state.source === "demo" ? demoLeads() : []).sort((a, b) => b.t - a.t); }
  function updateLead(lead, patch) {
    if (lead.demo) { const l = demoLeads(); const x = l.find((y) => y.id === lead.id); Object.assign(x, patch); localStorage.setItem("sm_demo_leads", JSON.stringify(l)); }
    else return SM.updateLead(lead.id, patch).catch((e) => toast("Mise à jour impossible : " + errMsg(e)));
  }
  function deleteLead(lead) {
    if (lead.demo) localStorage.setItem("sm_demo_leads", JSON.stringify(demoLeads().filter((y) => y.id !== lead.id)));
    else return SM.deleteLead(lead.id).catch((e) => toast("Suppression impossible : " + errMsg(e)));
  }
  const statusPill = (s) => `<span class="pill ${s === "nouveau" ? "pill--gold" : s === "en cours" ? "pill--info" : "pill--ok"}">${esc(s)}</span>`;
  const newCount = () => allLeads().filter((l) => l.status === "nouveau").length;

  /* =========================================================
     MÉDIAS : sélecteur et import
     ========================================================= */
  function thumb(ref, emptyLabel) {
    const u = SM.url(ref);
    if (!u) return `<div class="thumb is-empty"><span class="thumb__empty">${esc(emptyLabel || "Vide — bloc annoté sur le site")}</span></div>`;
    const type = (D.media.find((m) => m.ref === ref) || {}).type || "";
    if (/pdf/.test(type) || /\.pdf(\?|$)/i.test(ref)) return `<div class="thumb"><span class="thumb__pdf">PDF</span></div>`;
    if (SM.isVideo(ref, type)) return `<div class="thumb"><video src="${esc(u)}" muted loop playsinline preload="metadata"></video><span class="thumb__kind pill pill--plain">vidéo</span></div>`;
    return `<div class="thumb"><img src="${esc(u)}" alt="" loading="lazy"></div>`;
  }
  function slot(label, path, kind) {
    const ref = getPath(D, path) || "";
    return `<div class="slot"><span>${esc(label)}</span><button type="button" data-pick="${esc(path)}" data-kind="${kind || "image"}" title="Changer">${thumb(ref, kind === "video" ? "Vidéo à intégrer" : kind === "pdf" ? "PDF à fournir" : "Photo à fournir")}</button></div>`;
  }
  async function importFiles(files, meta) {
    const refs = [];
    for (const f of files) {
      const isVid = /^video\//.test(f.type), isPdf = f.type === "application/pdf";
      if (!/^image\//.test(f.type) && !isVid && !isPdf) { toast(`Format non pris en charge : ${f.name}`); continue; }
      /* Vidéos : jamais sur Supabase (quota de trafic du plan gratuit). Elles s'ajoutent par lien. */
      if (isVid && LIVE) { toast(`${f.name} : les vidéos s'ajoutent par lien (hébergement externe), pas par import.`); continue; }
      if (isVid && f.size > 80 * 1024 * 1024) { toast(`${f.name} dépasse 80 Mo : compressez la vidéo avant import.`); continue; }
      if (isPdf && f.size > 15 * 1024 * 1024) { toast(`${f.name} dépasse 15 Mo : compressez le PDF avant import.`); continue; }
      const blob = isVid || isPdf ? f : await SM.compressImage(f);
      try {
        const ref = await SM.putFile(blob, { name: f.name });
        D.media.unshift(Object.assign({ id: SM.uid("m"), ref, name: f.name, type: blob.type || f.type, size: blob.size, t: Date.now() }, meta || {}));
        refs.push(ref);
      } catch (e) { toast(LIVE ? `Envoi de ${f.name} impossible : ${errMsg(e)}` : "Stockage du navigateur indisponible (navigation privée ?)"); }
    }
    if (refs.length) save(refs.length > 1 ? `${refs.length} fichiers importés` : "Fichier importé");
    return refs;
  }
  function picker(path, kind, onDone) {
    const accept = kind === "video" ? "video/mp4,video/webm,video/quicktime" : kind === "pdf" ? "application/pdf" : "image/*";
    const library = kind === "image" ? ASSETS.map((ref) => ({ ref, name: ref.split("/").pop() })).concat(D.media.filter((m) => /image/.test(m.type))) : D.media.filter((m) => (kind === "video" ? /video/.test(m.type) : /pdf/.test(m.type)));
    const cur = getPath(D, path) || "";
    const noUpload = LIVE && kind === "video";
    sheet(`Choisir ${kind === "video" ? "une vidéo" : kind === "pdf" ? "un PDF" : "une image"}`, `
      ${noUpload ? `<div class="note note--gold"><b>Vidéos : ajout par lien uniquement.</b> Pour ne pas épuiser le quota gratuit de Supabase, les vidéos sont hébergées à part (Cloudinary, Vimeo, Cloudflare R2…). Collez ci-dessous le lien direct du fichier MP4.</div>` : `<div class="dropzone" data-drop><b>Glissez un fichier ici</b> ou <label class="btn-a btn-a--sm" style="margin-left:6px">Parcourir<input type="file" accept="${accept}" hidden data-file></label>
        <div style="margin-top:8px;font-size:12px;color:var(--muted)">${kind === "video" ? "MP4 H.264 conseillé, moins de 15 Mo pour un survol, moins de 40 Mo pour un film." : kind === "pdf" ? "PDF, moins de 15 Mo." : "JPEG, PNG ou WebP. Converti automatiquement en WebP, 1800 px maximum."}</div></div>`}
      <label class="fld"><span>${noUpload ? "Lien de la vidéo" : "Ou coller un lien"}</span><input type="url" placeholder="https://… (fichier MP4 ou image)" data-url value="${/^https?:/.test(cur) ? esc(cur) : ""}"><small>MP4 H.264 conseillé : moins de 3 Mo pour un survol, moins de 8 Mo pour la vidéo d'ouverture.</small></label>
      ${library.length ? `<div class="media-grid">${library.map((m) => `<div class="media-tile is-pick" data-choose="${esc(m.ref)}" tabindex="0">${thumb(m.ref)}<span class="media-tile__name">${esc(m.name)}</span></div>`).join("")}</div>` : `<div class="empty">Aucun fichier de ce type dans la médiathèque.</div>`}
    `, `<button class="btn-a btn-a--danger" data-clear>Retirer (bloc vide annoté)</button><button class="btn-a" data-close>Annuler</button><button class="btn-a btn-a--dark" data-ok-url>Valider le lien</button>`, true);
    const sh = $(".sheet");
    const done = (ref) => { setPath(D, path, ref); save(ref ? "Média mis à jour" : "Média retiré : le site affiche un bloc annoté"); closeSheet(); if (onDone) onDone(); else route(); };
    sh.addEventListener("click", (e) => {
      const c = e.target.closest("[data-choose]"); if (c) done(c.dataset.choose);
      if (e.target.closest("[data-clear]")) done("");
      if (e.target.closest("[data-ok-url]")) { const v = $("[data-url]", sh).value.trim(); if (v) done(v); }
    });
    sh.addEventListener("keydown", (e) => { const c = e.target.closest("[data-choose]"); if (c && e.key === "Enter") done(c.dataset.choose); });
    const handle = async (files) => { const refs = await importFiles(Array.from(files)); if (refs[0]) done(refs[0]); };
    const fileInput = $("[data-file]", sh);
    if (fileInput) fileInput.addEventListener("change", (e) => handle(e.target.files));
    bindDrop($("[data-drop]", sh), handle);
  }
  function bindDrop(el, cb) {
    if (!el) return;
    ["dragenter", "dragover"].forEach((t) => el.addEventListener(t, (e) => { e.preventDefault(); el.classList.add("is-over"); }));
    ["dragleave", "drop"].forEach((t) => el.addEventListener(t, (e) => { e.preventDefault(); el.classList.remove("is-over"); }));
    el.addEventListener("drop", (e) => cb(e.dataTransfer.files));
  }

  /* ---------- panneau latéral ---------- */
  function sheet(title, body, foot, wide) {
    closeSheet();
    document.body.insertAdjacentHTML("beforeend", `<div class="sheet is-on${wide ? " sheet--wide" : ""}"><div class="sheet__veil" data-close></div><div class="sheet__panel" role="dialog" aria-modal="true"><div class="sheet__head"><h2>${esc(title)}</h2><button class="icon-btn" data-close aria-label="Fermer">${I.x}</button></div><div class="sheet__body">${body}</div>${foot ? `<div class="sheet__foot">${foot}</div>` : ""}</div></div>`);
    const sh = $(".sheet");
    sh.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeSheet(); });
    return sh;
  }
  function closeSheet() { const s = $(".sheet"); if (s) s.remove(); }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSheet(); });

  /* =========================================================
     CONNEXION
     ========================================================= */
  function renderLogin() {
    document.body.innerHTML = `<div class="login">
      <div class="login__visual"><div class="login__quote"><span>Back-office</span><b>SAMIRA MHAIDI</b></div></div>
      <div class="login__form"><form class="login__box" novalidate>
        <img src="../assets/img/logo-sm-cercle.png" alt="">
        <h1>Espace administration</h1>
        <p>Gérez les collections, les médias, les demandes et les statistiques du site.</p>
        <div class="login__err" role="alert">E-mail ou mot de passe incorrect.</div>
        <div style="display:grid;gap:14px">
          <label class="fld"><span>E-mail</span><input type="email" name="email" autocomplete="username" required></label>
          <label class="fld"><span>Mot de passe</span><input type="password" name="password" autocomplete="current-password" required></label>
          <button class="btn-a btn-a--dark btn-a--full" type="submit">Se connecter</button>
          ${LIVE ? "" : `<button class="btn-a btn-a--full" type="button" data-demo>Remplir l'accès démo</button>`}
        </div>
        ${LIVE ? "" : `<div class="demo-note"><b>Mode démo.</b> Les données sont enregistrées dans ce navigateur uniquement. En production, l'authentification et les données passent par Supabase.</div>`}
      </form></div></div>`;
    const f = $("form");
    const demo = $("[data-demo]");
    if (demo) demo.addEventListener("click", () => { const a = SM.getAccount(); f.email.value = a.email; f.password.value = a.password; });
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = $("[type=submit]", f), err = $(".login__err");
      btn.disabled = true; err.classList.remove("is-on");
      const ok = await SM.login(f.email.value, f.password.value);
      btn.disabled = false;
      if (ok) { await loadRemote(); renderApp(); }
      else { err.textContent = SM.lastLoginError; err.classList.add("is-on"); }
    });
  }

  /* Mode Supabase : charge demandes et statistiques, publie le contenu initial si la base est vide. */
  async function loadRemote() {
    if (!LIVE) return;
    try { await Promise.all([SM.loadLeads(), SM.loadEvents(185)]); }
    catch (e) { toast("Chargement des demandes ou statistiques impossible : " + errMsg(e)); }
    if (SM.contentMissing) {
      SM.saveData(D);
      if (await SM.flush()) { SM.contentMissing = false; toast("Contenu initial publié en ligne"); }
    }
  }

  /* =========================================================
     STRUCTURE
     ========================================================= */
  const NAV = [
    { g: "Pilotage" }, { id: "dashboard", label: "Tableau de bord", icon: "dash" }, { id: "visiteurs", label: "Visiteurs", icon: "users" }, { id: "demandes", label: "Demandes", icon: "inbox", count: true },
    { g: "Contenu" }, { id: "collections", label: "Collections", icon: "coll" }, { id: "catalogues", label: "Catalogues & catégories", icon: "book" }, { id: "medias", label: "Médiathèque", icon: "image" }, { id: "evenements", label: "Événements", icon: "cal" }, { id: "contenu", label: "Textes & bandeau", icon: "text" },
    { g: "Réglages" }, { id: "integrations", label: "Intégrations", icon: "plug" }, { id: "parametres", label: "Paramètres", icon: "gear" }
  ];
  function renderApp() {
    document.body.innerHTML = `<div class="app">
      <aside class="side"><div class="side__brand"><img src="../assets/img/logo-sm-cercle.png" alt=""><div><b>SAMIRA MHAIDI</b><small>Back-office</small></div></div>
        <nav>${NAV.map((n) => n.g ? `<div class="side__group">${n.g}</div>` : `<a class="nav" href="#/${n.id}" data-nav="${n.id}">${I[n.icon]}<span>${n.label}</span>${n.count ? `<span class="count" data-newcount></span>` : ""}</a>`).join("")}</nav>
        <div class="side__foot"><a class="nav" href="../index.html" target="_blank">${I.ext}<span>Voir le site</span></a><a class="nav" href="#" data-logout>${I.out}<span>Déconnexion</span></a>
        <div class="side__demo">${LIVE ? `<b>En ligne</b> · ${esc(SM.getAccount().email)}` : "<b>Mode démo</b> · données locales à ce navigateur"}</div></div>
      </aside>
      <div class="main"><header class="top"><button class="burger" aria-label="Menu" data-burger>${I.menu}</button><div><h1 data-title></h1><div class="top__sub" data-sub></div></div><div class="top__tools" data-tools></div></header><div class="view" data-view></div></div>
    </div>`;
    document.body.appendChild(tip);
    $("[data-logout]").addEventListener("click", async (e) => { e.preventDefault(); await SM.flush(); await SM.logout(); location.hash = ""; renderLogin(); });
    $("[data-burger]").addEventListener("click", () => $(".side").classList.toggle("is-open"));
    bindViewEvents();
    window.onhashchange = route;
    if (!location.hash) location.hash = "#/dashboard"; else route();
  }
  function route() {
    const [, view = "dashboard", arg] = location.hash.split("/");
    $$("[data-nav]").forEach((a) => a.classList.toggle("is-on", a.dataset.nav === view));
    $(".side").classList.remove("is-open");
    const nc = newCount(); const b = $("[data-newcount]"); if (b) { b.textContent = nc; b.style.display = nc ? "" : "none"; }
    after = [];
    const v = VIEWS[view] || VIEWS.dashboard;
    const out = v(arg);
    $("[data-title]").textContent = out.title;
    $("[data-sub]").innerHTML = out.sub || "";
    $("[data-tools]").innerHTML = out.tools || "";
    $("[data-view]").innerHTML = out.html;
    after.forEach((f) => f());
    window.scrollTo(0, 0);
  }
  function rerender() { const y = scrollY; route(); window.scrollTo(0, y); }

  const rangeTools = () => `<div class="seg" role="group" aria-label="Période">${[[7, "7 j"], [30, "30 j"], [90, "90 j"]].map(([d, l]) => `<button data-range="${d}" class="${state.range === d ? "is-on" : ""}">${l}</button>`).join("")}</div>
    ${LIVE ? "" : `<div class="seg" role="group" aria-label="Source des données"><button data-source="demo" class="${state.source === "demo" ? "is-on" : ""}" data-tip="Données simulées + visites réelles de ce navigateur">Démo</button><button data-source="real" class="${state.source === "real" ? "is-on" : ""}" data-tip="Uniquement les visites mesurées dans ce navigateur">Ce navigateur</button></div>`}`;

  /* ---------- liaison générique des champs ---------- */
  let viewEventsBound = false;
  function bindViewEvents() {
    if (viewEventsBound) return;
    viewEventsBound = true;
    const view = () => $("[data-view]");
    const apply = (el) => {
      const k = el.dataset.k; if (!k) return;
      let v = el.type === "checkbox" ? el.checked : el.value;
      const t = el.dataset.type;
      if (t === "list") v = String(v).split(",").map((s) => s.trim()).filter(Boolean);
      if (t === "paras") v = String(v).split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
      if (t === "num") v = Number(v) || 0;
      setPath(D, k, v);
      if (el.dataset.slugFrom !== undefined) { /* champ slug manuel */ }
      save();
      if (el.dataset.rerender !== undefined) rerender();
    };
    document.addEventListener("change", (e) => { if (view() && view().contains(e.target)) apply(e.target); });
    document.addEventListener("click", (e) => {
      const r = e.target.closest("[data-range]"); if (r) { state.range = Number(r.dataset.range); rerender(); return; }
      const s = e.target.closest("[data-source]"); if (s) { state.source = s.dataset.source; rerender(); return; }
      const p = e.target.closest("[data-pick]"); if (p && !$(".sheet")) { picker(p.dataset.pick, p.dataset.kind || "image"); return; }
      const tv = e.target.closest("[data-table-toggle]"); if (tv) { const c = tv.closest(".card"); c.classList.toggle("show-table"); tv.innerHTML = c.classList.contains("show-table") ? `${I.chart} Graphique` : `${I.table} Tableau`; }
    });
  }

  /* =========================================================
     VUES
     ========================================================= */
  const VIEWS = {};

  VIEWS.dashboard = function () {
    const st = stats(state.range), c = st.cur, p = st.prev || {};
    const leads = allLeads().slice(0, 5);
    const funnel = [{ label: "Visites", value: c.sessions }, { label: "Ont vu une collection", value: st.list.filter((s) => s.pages.some((x) => /collection/.test(x))).length }, { label: "Ont ouvert un look", value: st.list.filter((s) => s.looks.length).length }, { label: "Ont commencé le formulaire", value: c.starts }, { label: "Ont envoyé une demande", value: c.submits }];
    return {
      title: "Tableau de bord", sub: `${state.range} derniers jours · ${LIVE ? "visiteurs ayant accepté la mesure d'audience" : state.source === "demo" ? "données de démonstration" : "visites mesurées dans ce navigateur"}`, tools: rangeTools(),
      html: `
      <div class="kpis">
        ${kpi("Visiteurs uniques", fmtN(c.visitors), delta(c.visitors, p.visitors), "Identifiés par le cookie sm_vid (après accord). Les refus comptent chacun pour un visiteur.")}
        ${kpi("Visites", fmtN(c.sessions), delta(c.sessions, p.sessions))}
        ${kpi("Pages vues", fmtN(c.pageviews), delta(c.pageviews, p.pageviews), "Visiteurs ayant accepté la mesure d'audience uniquement.")}
        ${kpi("Accord cookies", fmtP(c.consentRate), delta(c.consentRate, p.consentRate), "Part des visiteurs qui acceptent la mesure d'audience.")}
        ${kpi("Formulaires commencés", fmtN(c.starts), delta(c.starts, p.starts), "Visiteurs ayant cliqué dans le formulaire de contact.")}
        ${kpi("Demandes envoyées", fmtN(c.submits), delta(c.submits, p.submits))}
        ${kpi("Taux de conversion", fmtP(c.conv), delta(c.conv, p.conv), "Demandes envoyées / visites.")}
      </div>
      <div class="grid g-2-1">
        <div class="card"><div class="card__head"><h2>Visites par jour</h2><div class="tools"><button class="btn-a btn-a--sm btn-a--ghost" data-table-toggle>${I.table} Tableau</button></div></div><div class="card__body">${lineChart(st.byDay, "visites")}</div></div>
        <div class="card"><div class="card__head"><h2>Parcours vers la demande</h2><p>De la visite à l'envoi du formulaire.</p></div><div class="card__body">${bars(funnel, { cls: "funnel", total: c.sessions || 1, unit: "visites" })}</div></div>
      </div>
      <div class="grid g3">
        <div class="card"><div class="card__head"><h2>Sources de trafic</h2></div><div class="card__body">${bars(st.sources, { unit: "visites" })}</div></div>
        <div class="card"><div class="card__head"><h2>Appareils</h2></div><div class="card__body">${bars(st.devices, { unit: "visites" })}</div></div>
        <div class="card"><div class="card__head"><h2>Choix cookies</h2><p>Sur le bandeau de consentement.</p></div><div class="card__body">${bars(st.consent, { unit: "visites" })}</div></div>
      </div>
      <div class="grid g3">
        <div class="card"><div class="card__head"><h2>Pages les plus vues</h2></div><div class="card__body">${bars(st.pages, { unit: "vues" })}</div></div>
        <div class="card"><div class="card__head"><h2>Looks les plus consultés</h2></div><div class="card__body">${bars(st.looks, { unit: "ouvertures", limit: 6 })}</div></div>
        <div class="card"><div class="card__head"><h2>Dernières demandes</h2><div class="tools"><a class="btn-a btn-a--sm" href="#/demandes">Tout voir</a></div></div>
          ${leads.length ? `<div class="tbl-wrap"><table class="tbl"><tbody>${leads.map((l) => `<tr class="is-click" data-lead="${esc(l.id)}"><td><b>${esc(l.name || l.email)}</b><br><span class="mono">${esc(l.typeLabel || l.type)}</span></td><td class="num">${statusPill(l.status)}<br><span class="mono">${fmtD(l.t)}</span></td></tr>`).join("")}</tbody></table></div>` : `<div class="empty">Aucune demande pour l'instant.</div>`}
        </div>
      </div>
      ${state.source === "real" && !st.list.length ? `<div class="note note--gold">${LIVE ? "<b>Aucune visite mesurée sur la période.</b> Les visites apparaissent ici dès que des visiteurs acceptent la mesure d'audience sur le site en ligne." : "<b>Aucune visite mesurée dans ce navigateur.</b> Ouvrez le site, acceptez les cookies et naviguez : les visites apparaîtront ici."}</div>` : ""}`
    };
  };

  VIEWS.visiteurs = function () {
    const st = stats(state.range);
    const f = state.visitors;
    const list = st.list.filter((s) => f === "all" || (f === "form" && s.formStart) || (f === "sent" && s.formSubmit) || (f === "refuse" && s.consent === "refuse"));
    const abandons = st.list.filter((s) => s.formStart && !s.formSubmit);
    const fieldCount = {};
    abandons.forEach((s) => s.abandonFields.forEach((k) => (fieldCount[k] = (fieldCount[k] || 0) + 1)));
    const FIELD = { name: "Nom", email: "E-mail", phone: "Téléphone", type: "Type de demande", look: "Modèle", date: "Date", message: "Message", consent: "Case d'accord", newsletter: "Newsletter" };
    return {
      title: "Visiteurs", sub: `${fmtN(st.list.length)} visites sur ${state.range} jours · ${fmtN(st.cur.visitors)} visiteurs uniques`, tools: rangeTools(),
      html: `
      <div class="kpis">
        ${kpi("Ont touché le formulaire", fmtN(st.cur.starts), "", "Visiteurs ayant cliqué dans au moins un champ.")}
        ${kpi("Ont envoyé", fmtN(st.cur.submits))}
        ${kpi("Ont abandonné", fmtN(abandons.length), "", "Ont commencé le formulaire sans l'envoyer.")}
        ${kpi("Clics WhatsApp", fmtN(st.cur.wa))}
      </div>
      <div class="grid g-2-1">
        <div class="card"><div class="card__head"><h2>Journal des visites</h2>
          <div class="tools"><div class="seg">${[["all", "Toutes"], ["form", "Formulaire touché"], ["sent", "Demande envoyée"], ["refuse", "Cookies refusés"]].map(([k, l]) => `<button data-vf="${k}" class="${f === k ? "is-on" : ""}">${l}</button>`).join("")}</div></div>
          <p>Identifiant anonyme (cookie <code>sm_vid</code>), aucune donnée nominative. Les visiteurs qui refusent les cookies apparaissent sans identifiant ni parcours.</p></div>
          <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Date</th><th>Visiteur</th><th>Source</th><th>Appareil</th><th>Parcours</th><th>Cookies</th><th>Formulaire</th></tr></thead><tbody>
          ${list.slice(0, 150).map((s) => `<tr><td>${fmtDT(s.t)}</td><td class="mono">${s.vid ? "#" + esc(s.vid.slice(-6)) : "—"}</td><td style="text-transform:capitalize">${esc(s.src)}</td><td style="text-transform:capitalize">${esc(s.device)}</td>
            <td style="max-width:260px"><span class="mono">${s.pages.length ? esc(s.pages.map((p) => p.replace(".html", "")).join(" › ")) : "non mesuré"}</span>${s.looks.length ? `<br><span class="mono">${s.looks.length} look(s) ouvert(s)</span>` : ""}</td>
            <td>${s.consent === "accept" ? '<span class="pill pill--ok">accepté</span>' : s.consent === "custom" ? '<span class="pill pill--info">personnalisé</span>' : s.consent === "refuse" ? '<span class="pill pill--bad">refusé</span>' : '<span class="pill">—</span>'}</td>
            <td>${s.formSubmit ? '<span class="pill pill--ok">envoyé</span>' : s.formStart ? '<span class="pill pill--warn">abandonné</span>' : ""}</td></tr>`).join("") || `<tr><td colspan="7" class="empty">Aucune visite sur cette période.</td></tr>`}
          </tbody></table></div>
          ${list.length > 150 ? `<div class="card__body" style="color:var(--muted)">150 visites les plus récentes affichées sur ${fmtN(list.length)}.</div>` : ""}
        </div>
        <div class="card"><div class="card__head"><h2>Champs remplis avant abandon</h2><p>Où les visiteuses s'arrêtent dans le formulaire (le contenu saisi n'est jamais enregistré).</p></div><div class="card__body">${bars(Object.entries(fieldCount).map(([k, v]) => ({ label: FIELD[k] || k, value: v })).sort((a, b) => b.value - a.value), { total: abandons.length || 1, unit: "abandons" })}</div></div>
      </div>`
    };
  };

  VIEWS.demandes = function () {
    let leads = allLeads();
    const counts = { all: leads.length, nouveau: 0, "en cours": 0, "traité": 0 };
    leads.forEach((l) => (counts[l.status] = (counts[l.status] || 0) + 1));
    if (state.leadStatus !== "all") leads = leads.filter((l) => l.status === state.leadStatus);
    if (state.leadType) leads = leads.filter((l) => l.type === state.leadType);
    if (state.leadQ) { const q = state.leadQ.toLowerCase(); leads = leads.filter((l) => [l.name, l.email, l.phone, l.look, l.message].join(" ").toLowerCase().includes(q)); }
    const types = [["", "Tous les types"], ["rdv", "Rendez-vous"], ["commande", "Commande sur mesure"], ["mariee", "Mariage / cérémonie"], ["avant-premiere", "Avant-première"], ["presse", "Presse"], ["newsletter", "Newsletter"], ["autre", "Autre"]];
    return {
      title: "Demandes", sub: "Formulaire de contact et inscriptions à la newsletter",
      tools: `${LIVE ? `<button class="btn-a" data-reload-leads>↻ Actualiser</button>` : `<div class="seg" role="group" aria-label="Source"><button data-source="demo" class="${state.source === "demo" ? "is-on" : ""}">Avec démo</button><button data-source="real" class="${state.source === "real" ? "is-on" : ""}">Réelles uniquement</button></div>`}<button class="btn-a" data-export-leads>${I.dl} Export CSV</button>`,
      html: `
      <div class="card"><div class="card__head">
        <div class="seg">${[["all", "Toutes"], ["nouveau", "Nouvelles"], ["en cours", "En cours"], ["traité", "Traitées"]].map(([k, l]) => `<button data-ls="${k}" class="${state.leadStatus === k ? "is-on" : ""}">${l} (${counts[k] || 0})</button>`).join("")}</div>
        <div class="tools"><select class="inp" style="width:auto" data-lt>${types.map(([k, l]) => `<option value="${k}" ${state.leadType === k ? "selected" : ""}>${l}</option>`).join("")}</select><input class="inp" style="width:200px" type="search" placeholder="Rechercher…" value="${esc(state.leadQ)}" data-lq></div>
      </div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Reçue le</th><th>Nom</th><th>Contact</th><th>Demande</th><th>Modèle</th><th>Source</th><th>Statut</th></tr></thead><tbody>
      ${leads.map((l) => `<tr class="is-click" data-lead="${esc(l.id)}"><td>${fmtDT(l.t)}</td><td><b>${esc(l.name || "—")}</b>${l.demo ? ' <span class="pill pill--plain" style="height:18px;font-size:10px">démo</span>' : ""}</td><td>${esc(l.email || "")}<br><span class="mono">${esc(l.phone || "")}</span></td><td>${esc(l.typeLabel || l.type)}</td><td>${esc(l.look || "—")}</td><td style="text-transform:capitalize">${esc(l.src || "")}</td><td>${statusPill(l.status)}</td></tr>`).join("") || `<tr><td colspan="7" class="empty">Aucune demande. Envoyez le formulaire de la page Contact pour tester.</td></tr>`}
      </tbody></table></div></div>
      ${LIVE ? `<div class="note">Les demandes du site sont enregistrées dans Supabase. Cliquez sur « Actualiser » pour voir les plus récentes.</div>` : `<div class="note"><b>Mode démo :</b> les demandes envoyées depuis le site sont enregistrées dans le navigateur où elles ont été saisies.</div>`}`
    };
  };
  function openLead(id) {
    const l = allLeads().find((x) => x.id === id); if (!l) return;
    const phone = (l.phone || "").replace(/[^\d]/g, "").replace(/^0/, "212");
    sheet(l.name || l.email, `
      <div style="display:flex;gap:8px;flex-wrap:wrap">${statusPill(l.status)}<span class="pill pill--plain">${esc(l.typeLabel || l.type)}</span>${l.demo ? '<span class="pill pill--plain">démo</span>' : ""}</div>
      <dl class="kv"><dt>Reçue le</dt><dd>${fmtDT(l.t)}</dd><dt>E-mail</dt><dd>${esc(l.email || "—")}</dd><dt>Téléphone</dt><dd>${esc(l.phone || "—")}</dd><dt>Modèle</dt><dd>${esc(l.look || "—")}</dd><dt>Date souhaitée</dt><dd>${esc(l.date || "—")}</dd><dt>Newsletter</dt><dd>${l.newsletter ? "Oui" : "Non"}</dd><dt>Source</dt><dd style="text-transform:capitalize">${esc(l.src || "—")} · ${esc(l.device || "")}</dd></dl>
      ${l.message ? `<div class="msg">${esc(l.message)}</div>` : ""}
      <label class="fld"><span>Statut</span><select data-lead-status>${["nouveau", "en cours", "traité"].map((s) => `<option ${l.status === s ? "selected" : ""}>${s}</option>`).join("")}</select></label>
      <label class="fld"><span>Note interne</span><textarea data-lead-note placeholder="Ex. : RDV fixé samedi 10h, essayage n°1…">${esc(l.note || "")}</textarea></label>`,
      `<button class="btn-a btn-a--danger" data-lead-del>${I.trash} Supprimer</button>${l.email ? `<a class="btn-a" href="mailto:${esc(l.email)}?subject=${encodeURIComponent("Votre demande — Maison Samira Mhaidi")}">${I.mail} Répondre</a>` : ""}${phone ? `<a class="btn-a btn-a--gold" target="_blank" rel="noopener" href="https://wa.me/${phone}">${I.wa} WhatsApp</a>` : ""}`);
    const sh = $(".sheet");
    $("[data-lead-status]", sh).addEventListener("change", async (e) => { await updateLead(l, { status: e.target.value }); toast("Statut mis à jour"); rerender(); });
    $("[data-lead-note]", sh).addEventListener("change", async (e) => { await updateLead(l, { note: e.target.value }); toast("Note enregistrée"); });
    $("[data-lead-del]", sh).addEventListener("click", async () => { if (confirm("Supprimer définitivement cette demande ?")) { await deleteLead(l); closeSheet(); rerender(); toast("Demande supprimée"); } });
    if (l.status === "nouveau") { $("[data-lead-status]", sh).value = "en cours"; Promise.resolve(updateLead(l, { status: "en cours" })).then(rerender); }
  }
  document.addEventListener("click", (e) => {
    const r = e.target.closest("[data-lead]"); if (r) openLead(r.dataset.lead);
    const ls = e.target.closest("[data-ls]"); if (ls) { state.leadStatus = ls.dataset.ls; rerender(); }
    const vf = e.target.closest("[data-vf]"); if (vf) { state.visitors = vf.dataset.vf; rerender(); }
    if (e.target.closest("[data-reload-leads]")) SM.loadLeads().then(() => { rerender(); toast("Demandes actualisées"); }).catch((err) => toast("Actualisation impossible : " + errMsg(err)));
    if (e.target.closest("[data-export-leads]")) {
      const rows = allLeads();
      const cols = ["t", "name", "email", "phone", "typeLabel", "look", "date", "message", "status", "src", "device", "newsletter", "note"];
      const head = ["Date", "Nom", "E-mail", "Téléphone", "Demande", "Modèle", "Date souhaitée", "Message", "Statut", "Source", "Appareil", "Newsletter", "Note"];
      const csv = [head].concat(rows.map((l) => cols.map((c) => c === "t" ? new Date(l.t).toLocaleString("fr-FR") : l[c] == null ? "" : String(l[c])))).map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";")).join("\r\n");
      download(`demandes-samira-mhaidi-${new Date().toISOString().slice(0, 10)}.csv`, "﻿" + csv, "text/csv");
    }
  });
  document.addEventListener("change", (e) => {
    if (e.target.matches("[data-lt]")) { state.leadType = e.target.value; rerender(); }
  });
  document.addEventListener("input", (e) => {
    if (e.target.matches("[data-lq]")) { state.leadQ = e.target.value; clearTimeout(e.target._h); e.target._h = setTimeout(() => { rerender(); const i = $("[data-lq]"); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }, 300); }
  });

  /* ---------- collections ---------- */
  const STATUS = { published: ["Publiée", "pill--ok"], upcoming: ["Bientôt", "pill--gold"], draft: ["Brouillon", ""] };
  VIEWS.collections = function (id) {
    if (id) return collectionEditor(id);
    const cols = D.collections.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
    return {
      title: "Collections", sub: `${cols.length} collections · ${SM.allLooks(D).length} looks`,
      tools: `<a class="btn-a" href="../collections.html" target="_blank">${I.ext} Voir la page</a>`,
      html: `<div class="coll-cards">${cols.map((c) => `<a class="card coll-card" href="#/collections/${c.id}"><div class="coll-card__img">${c.cover ? `<img src="${esc(SM.url(c.cover))}" alt="">` : thumb("", "Visuel de couverture à fournir")}<span class="pill ${STATUS[c.status][1]}">${STATUS[c.status][0]}</span></div><div class="coll-card__body"><b>${esc(c.name)}</b><span>${esc(c.season)} · ${esc(c.year)} · ${c.looks.length} looks${c.looks.filter((l) => !l.image).length ? ` · <span style="color:var(--gold-deep)">${c.looks.filter((l) => !l.image).length} photo(s) à fournir</span>` : ""}</span></div></a>`).join("")}
        <button class="card coll-card coll-card--new" data-new-coll>${I.plus}<span>Nouvelle collection</span></button></div>`
    };
  };
  function collectionEditor(id) {
    const ci = D.collections.findIndex((c) => c.id === id);
    if (ci < 0) { location.hash = "#/collections"; return { title: "", html: "" }; }
    const c = D.collections[ci], P = `collections.${ci}`;
    return {
      title: c.name, sub: `<a href="#/collections">Collections</a> › ${esc(c.name)}`,
      tools: `<a class="btn-a" href="../collection.html?c=${esc(c.slug)}" target="_blank">${I.ext} Voir sur le site</a><button class="btn-a btn-a--danger" data-del-coll="${ci}">${I.trash} Supprimer</button>`,
      html: `
      <div class="grid g-2-1">
        <div class="card"><div class="card__head"><h2>Informations</h2></div><div class="card__body form-grid">
          <label class="fld"><span>Nom</span><input type="text" data-k="${P}.name" value="${esc(c.name)}" data-rerender></label>
          <label class="fld"><span>Adresse (slug)</span><input type="text" data-k="${P}.slug" value="${esc(c.slug)}"><small>collection.html?c=${esc(c.slug)}</small></label>
          <label class="fld"><span>Année</span><input type="text" data-k="${P}.year" value="${esc(c.year)}"></label>
          <label class="fld"><span>Saison / type</span><input type="text" data-k="${P}.season" value="${esc(c.season)}"></label>
          <label class="fld"><span>Statut</span><select data-k="${P}.status" data-rerender>${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${c.status === k ? "selected" : ""}>${v[0]}</option>`).join("")}</select><small>« Bientôt » : visible avec un bloc d'annonce. « Brouillon » : masquée du site.</small></label>
          <label class="fld"><span>Catégorie principale</span><select data-k="${P}.categoryId"><option value="">—</option>${D.categories.map((k) => `<option value="${k.id}" ${c.categoryId === k.id ? "selected" : ""}>${esc(k.name)}</option>`).join("")}</select></label>
          <label class="fld"><span>Ordre d'affichage</span><input type="number" data-type="num" data-k="${P}.order" value="${c.order || 0}"></label>
          <label class="fld full"><span>Accroche (cartes et menu)</span><textarea data-k="${P}.teaser" rows="2">${esc(c.teaser)}</textarea></label>
          <label class="fld full"><span>Récit de la collection</span><textarea data-k="${P}.story" rows="4">${esc(c.story)}</textarea></label>
        </div></div>
        <div class="card"><div class="card__head"><h2>Visuels de la collection</h2><p>Un emplacement vide affiche sur le site un bloc annoté décrivant le visuel attendu.</p></div><div class="card__body" style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          ${slot("Couverture", P + ".cover", "image")}${slot("Film / vidéo hero", P + ".heroVideo", "video")}
          <label class="fld" style="grid-column:1/-1"><span>Consigne si couverture absente</span><textarea data-k="${P}.coverBrief" rows="2">${esc(c.coverBrief || "")}</textarea></label>
          <label class="fld" style="grid-column:1/-1"><span>Consigne si vidéo absente</span><textarea data-k="${P}.heroVideoBrief" rows="2">${esc(c.heroVideoBrief || "")}</textarea></label>
        </div></div>
      </div>
      <div class="card"><div class="card__head"><h2>Looks (${c.looks.length})</h2><p>Photo principale, image affichée au survol, vidéo jouée au survol. Cliquez sur une vignette pour la remplacer.</p><div class="tools"><button class="btn-a btn-a--dark" data-add-look="${ci}">${I.plus} Ajouter un look</button></div></div>
        ${c.looks.map((l, li) => { const L = `${P}.looks.${li}`; return `<div class="look-row">
          ${slot("Photo", L + ".image", "image")}${slot("Survol (image)", L + ".hoverImage", "image")}${slot("Survol (vidéo)", L + ".video", "video")}
          <div class="look-row__fields">
            <label class="fld"><span>Nom du look</span><input type="text" data-k="${L}.name" value="${esc(l.name)}"></label>
            <label class="fld"><span>Catégorie</span><select data-k="${L}.categoryId"><option value="">—</option>${D.categories.map((k) => `<option value="${k.id}" ${l.categoryId === k.id ? "selected" : ""}>${esc(k.name)}</option>`).join("")}</select></label>
            <label class="fld full"><span>Description</span><textarea rows="2" data-k="${L}.description">${esc(l.description || "")}</textarea></label>
            <label class="fld"><span>Détails (séparés par des virgules)</span><input type="text" data-type="list" data-k="${L}.details" value="${esc((l.details || []).join(", "))}"></label>
            <label class="fld"><span>Consigne photo (si vide)</span><input type="text" data-k="${L}.brief" value="${esc(l.brief || "")}"></label>
            <label class="switch"><input type="checkbox" data-k="${L}.featured" ${l.featured ? "checked" : ""}> Pièce signature (accueil)</label>
          </div>
          <div class="look-row__actions"><button class="icon-btn" data-move-look="${ci}:${li}:-1" title="Monter" ${li === 0 ? "disabled" : ""}>${I.up}</button><button class="icon-btn" data-move-look="${ci}:${li}:1" title="Descendre" ${li === c.looks.length - 1 ? "disabled" : ""}>${I.down}</button><button class="icon-btn" data-del-look="${ci}:${li}" title="Supprimer">${I.trash}</button></div>
        </div>`; }).join("") || `<div class="empty">Aucun look. Ajoutez le premier.</div>`}
      </div>`
    };
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-new-coll]")) {
      const id = SM.uid("col");
      D.collections.push({ id, slug: "nouvelle-collection-" + id.slice(-4), name: "Nouvelle collection", year: String(new Date().getFullYear()), season: "Collection", status: "draft", order: D.collections.length, categoryId: "", cover: "", coverBrief: "Visuel de couverture à fournir.", heroVideo: "", heroVideoBrief: "Vidéo de la collection à fournir.", teaser: "", story: "", looks: [] });
      save("Collection créée (brouillon)"); location.hash = "#/collections/" + id;
    }
    const dc = e.target.closest("[data-del-coll]");
    if (dc && confirm("Supprimer cette collection et tous ses looks ?")) { D.collections.splice(Number(dc.dataset.delColl), 1); save("Collection supprimée"); location.hash = "#/collections"; }
    const al = e.target.closest("[data-add-look]");
    if (al) { const c = D.collections[Number(al.dataset.addLook)]; c.looks.push({ id: SM.uid("lk"), name: "Look " + String(c.looks.length + 1).padStart(2, "0"), image: "", hoverImage: "", video: "", brief: "Photo studio pleine silhouette, format 2:3.", categoryId: c.categoryId || "", description: "", details: [] }); save("Look ajouté"); rerender(); }
    const ml = e.target.closest("[data-move-look]");
    if (ml) { const [ci, li, d] = ml.dataset.moveLook.split(":").map(Number); const arr = D.collections[ci].looks; const [x] = arr.splice(li, 1); arr.splice(li + d, 0, x); save("Ordre mis à jour"); rerender(); }
    const dl = e.target.closest("[data-del-look]");
    if (dl && confirm("Supprimer ce look ?")) { const [ci, li] = dl.dataset.delLook.split(":").map(Number); const lid = D.collections[ci].looks[li].id; D.collections[ci].looks.splice(li, 1); D.catalogues.forEach((k) => (k.lookIds = k.lookIds.filter((x) => x !== lid))); save("Look supprimé"); rerender(); }
  });

  /* ---------- catalogues & catégories ---------- */
  VIEWS.catalogues = function () {
    const looks = SM.allLooks(D);
    return {
      title: "Catalogues & catégories", sub: "Organisez les pièces par type (catégories) et par sélection (catalogues)",
      html: `
      <div class="card"><div class="card__head"><h2>Catégories</h2><p>Utilisées pour filtrer les pièces sur la page Collections.</p><div class="tools"><button class="btn-a btn-a--dark" data-add-cat>${I.plus} Ajouter</button></div></div>
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th style="width:220px">Nom</th><th>Description</th><th class="num">Pièces</th><th></th></tr></thead><tbody>
        ${D.categories.map((k, i) => `<tr><td><input class="inp" data-k="categories.${i}.name" value="${esc(k.name)}"></td><td><input class="inp" data-k="categories.${i}.description" value="${esc(k.description)}"></td><td class="num">${looks.filter((l) => l.categoryId === k.id).length}</td><td class="num"><button class="icon-btn" data-del-cat="${i}" title="Supprimer">${I.trash}</button></td></tr>`).join("")}
        </tbody></table></div></div>
      ${D.catalogues.map((k, i) => `<div class="card"><div class="card__head"><h2>${esc(k.name)}</h2><span class="pill pill--plain">${k.lookIds.length} pièces</span><div class="tools"><a class="btn-a btn-a--sm" href="../collection.html?catalogue=${esc(k.slug)}" target="_blank">${I.ext} Voir</a><button class="btn-a btn-a--sm btn-a--danger" data-del-catalogue="${i}">${I.trash}</button></div></div>
        <div class="card__body" style="display:grid;gap:18px">
          <div style="display:grid;grid-template-columns:minmax(0,1fr) 120px;gap:18px">
            <div class="form-grid"><label class="fld"><span>Nom</span><input type="text" data-k="catalogues.${i}.name" value="${esc(k.name)}" data-rerender></label><label class="fld"><span>Slug</span><input type="text" data-k="catalogues.${i}.slug" value="${esc(k.slug)}"></label>
            <label class="fld full"><span>Description</span><textarea rows="2" data-k="catalogues.${i}.description">${esc(k.description)}</textarea></label></div>
            ${slot("PDF téléchargeable", `catalogues.${i}.pdf`, "pdf")}
          </div>
          <div class="chk-grid">${looks.map((l) => `<label class="chk-tile"><input type="checkbox" data-cat-look="${i}" value="${esc(l.id)}" ${k.lookIds.includes(l.id) ? "checked" : ""}>${thumb(l.image)}<small>${esc(l.name)}</small></label>`).join("")}</div>
        </div></div>`).join("")}
      <button class="btn-a btn-a--dark" style="justify-self:start" data-add-catalogue>${I.plus} Nouveau catalogue</button>`
    };
  };
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-add-cat]")) { D.categories.push({ id: SM.uid("cat"), name: "Nouvelle catégorie", slug: "", description: "" }); save(); rerender(); }
    const dc = e.target.closest("[data-del-cat]"); if (dc && confirm("Supprimer cette catégorie ? Les pièces associées n'auront plus de catégorie.")) { const [k] = D.categories.splice(Number(dc.dataset.delCat), 1); SM.allLooks(D); D.collections.forEach((c) => c.looks.forEach((l) => { if (l.categoryId === k.id) l.categoryId = ""; })); save(); rerender(); }
    if (e.target.closest("[data-add-catalogue]")) { D.catalogues.push({ id: SM.uid("cat"), slug: "catalogue-" + Date.now().toString(36).slice(-4), name: "Nouveau catalogue", description: "", pdf: "", pdfBrief: "PDF à fournir.", lookIds: [] }); save(); rerender(); }
    const dk = e.target.closest("[data-del-catalogue]"); if (dk && confirm("Supprimer ce catalogue ?")) { D.catalogues.splice(Number(dk.dataset.delCatalogue), 1); save(); rerender(); }
  });
  document.addEventListener("change", (e) => {
    const c = e.target.closest("[data-cat-look]"); if (!c) return;
    const k = D.catalogues[Number(c.dataset.catLook)];
    k.lookIds = c.checked ? k.lookIds.concat(c.value) : k.lookIds.filter((x) => x !== c.value);
    save(c.checked ? "Pièce ajoutée au catalogue" : "Pièce retirée du catalogue");
    const pill = c.closest(".card").querySelector(".card__head .pill"); if (pill) pill.textContent = k.lookIds.length + " pièces";
  });
  document.addEventListener("change", (e) => {
    if (e.target.matches('[data-k^="categories."][data-k$=".name"]')) { const i = Number(e.target.dataset.k.split(".")[1]); D.categories[i].slug = SM.slugify(e.target.value); SM.saveData(D); }
  });

  /* ---------- médiathèque ---------- */
  VIEWS.medias = function () {
    const f = state.media, u = state.uploadTo;
    const cat = D.catalogues.find((k) => k.id === f.catalogue);
    const rows = [];
    D.collections.forEach((c, ci) => c.looks.forEach((l, li) => rows.push({ c, ci, l, li })));
    const sel = rows.filter(({ c, l }) => (!f.collection || c.id === f.collection) && (!f.category || l.categoryId === f.category) && (!cat || cat.lookIds.includes(l.id)) && (!f.kind || (f.kind === "missing-img" && !l.image) || (f.kind === "missing-video" && !l.video) || (f.kind === "video" && l.video)));
    const missingImg = rows.filter((r) => !r.l.image).length, missingVid = rows.filter((r) => !r.l.video).length;
    const opt = (list, v, all) => `<option value="">${all}</option>` + list.map((x) => `<option value="${x.id}" ${v === x.id ? "selected" : ""}>${esc(x.name)}</option>`).join("");
    const uploads = D.media.filter((m) => (!u.collection || m.collectionId === u.collection) && (!u.category || m.categoryId === u.category) && (!u.catalogue || m.catalogueId === u.catalogue));
    return {
      title: "Médiathèque", sub: `${rows.length} looks · ${missingImg} photo(s) et ${missingVid} vidéo(s) de survol à fournir · ${D.media.length} fichier(s) importé(s)`,
      html: `
      <div class="card"><div class="card__head"><h2>Visuels des looks</h2><p>Filtrez par collection, catégorie ou catalogue, puis cliquez sur une vignette pour remplacer la photo, l'image de survol ou la vidéo de survol.</p></div>
        <div class="card__body" style="display:grid;gap:18px">
          <div class="filters-row">
            <label class="fld"><span>Collection</span><select data-mf="collection">${opt(D.collections, f.collection, "Toutes")}</select></label>
            <label class="fld"><span>Catégorie</span><select data-mf="category">${opt(D.categories, f.category, "Toutes")}</select></label>
            <label class="fld"><span>Catalogue</span><select data-mf="catalogue">${opt(D.catalogues, f.catalogue, "Tous")}</select></label>
            <label class="fld"><span>Afficher</span><select data-mf="kind"><option value="">Tous les looks</option><option value="missing-img" ${f.kind === "missing-img" ? "selected" : ""}>Photo manquante</option><option value="missing-video" ${f.kind === "missing-video" ? "selected" : ""}>Vidéo de survol manquante</option><option value="video" ${f.kind === "video" ? "selected" : ""}>Avec vidéo</option></select></label>
          </div>
          <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Look</th><th style="width:96px">Photo</th><th style="width:96px">Survol image</th><th style="width:96px">Survol vidéo</th></tr></thead><tbody>
          ${sel.map(({ c, ci, l, li }) => { const L = `collections.${ci}.looks.${li}`; return `<tr><td><b>${esc(l.name)}</b><br><span class="mono">${esc(c.name)}${l.categoryId ? " · " + esc(catName(l.categoryId)) : ""}</span></td><td>${slot("", L + ".image")}</td><td>${slot("", L + ".hoverImage")}</td><td>${slot("", L + ".video", "video")}</td></tr>`; }).join("") || `<tr><td colspan="4" class="empty">Aucun look pour ces filtres.</td></tr>`}
          </tbody></table></div>
        </div></div>
      <div class="card"><div class="card__head"><h2>Fichiers importés</h2><p>Images, vidéos et PDF ajoutés depuis le back-office, rangés par collection, catégorie et catalogue.</p></div>
        <div class="card__body" style="display:grid;gap:18px">
          <div class="filters-row">
            <label class="fld"><span>Ranger dans la collection</span><select data-uf="collection">${opt(D.collections, u.collection, "—")}</select></label>
            <label class="fld"><span>Catégorie</span><select data-uf="category">${opt(D.categories, u.category, "—")}</select></label>
            <label class="fld"><span>Catalogue</span><select data-uf="catalogue">${opt(D.catalogues, u.catalogue, "—")}</select></label>
          </div>
          <div class="dropzone" data-drop-lib><b>Glissez vos ${LIVE ? "images ou PDF" : "images, vidéos ou PDF"} ici</b> ou <label class="btn-a btn-a--sm" style="margin-left:6px">Parcourir<input type="file" multiple accept="${LIVE ? "image/*,application/pdf" : "image/*,video/*,application/pdf"}" hidden data-lib-file></label><div style="margin-top:6px;font-size:12px;color:var(--muted)">Les fichiers sont rangés selon les choix ci-dessus. ${LIVE ? "Images converties en WebP (1800 px max) et stockées en ligne. Les vidéos s'ajoutent par lien, depuis chaque emplacement vidéo." : "Mode démo : stockés dans ce navigateur."}</div></div>
          ${uploads.length ? `<div class="media-grid">${uploads.map((m) => `<div class="media-tile">${thumb(m.ref)}<div class="media-tile__acts"><button class="icon-btn" data-del-media="${esc(m.id)}" title="Supprimer">${I.trash}</button></div><span class="media-tile__name">${esc(m.name)}</span><span class="media-tile__meta">${[D.collections.find((c) => c.id === m.collectionId), D.categories.find((c) => c.id === m.categoryId), D.catalogues.find((c) => c.id === m.catalogueId)].filter(Boolean).map((x) => esc(x.name)).join(" · ") || "Non rangé"} · ${Math.round(m.size / 1024)} Ko</span></div>`).join("")}</div>` : `<div class="empty">Aucun fichier importé${u.collection || u.category || u.catalogue ? " dans ce rangement" : ""}.</div>`}
        </div></div>`
    };
  };
  document.addEventListener("change", async (e) => {
    const mf = e.target.closest("[data-mf]"); if (mf) { state.media[mf.dataset.mf] = mf.value; rerender(); }
    const uf = e.target.closest("[data-uf]"); if (uf) { state.uploadTo[uf.dataset.uf] = uf.value; rerender(); }
    if (e.target.matches("[data-lib-file]")) { await importFiles(Array.from(e.target.files), { collectionId: state.uploadTo.collection, categoryId: state.uploadTo.category, catalogueId: state.uploadTo.catalogue }); rerender(); }
  });
  document.addEventListener("click", async (e) => {
    const d = e.target.closest("[data-del-media]");
    if (d && confirm("Supprimer ce fichier ? Les emplacements qui l'utilisent afficheront un bloc vide annoté.")) {
      const m = D.media.find((x) => x.id === d.dataset.delMedia);
      try { await SM.deleteFile(m.ref); } catch (err) { toast("Suppression impossible : " + errMsg(err)); return; }
      D.media = D.media.filter((x) => x !== m);
      const scrub = (o) => { Object.keys(o).forEach((k) => { if (o[k] === m.ref) o[k] = ""; else if (o[k] && typeof o[k] === "object") scrub(o[k]); }); };
      scrub(D); save("Fichier supprimé"); rerender();
    }
  });
  const libObserver = new MutationObserver(() => { const z = $("[data-drop-lib]"); if (z && !z._b) { z._b = true; bindDrop(z, async (files) => { await importFiles(Array.from(files), { collectionId: state.uploadTo.collection, categoryId: state.uploadTo.category, catalogueId: state.uploadTo.catalogue }); rerender(); }); } });
  libObserver.observe(document.documentElement, { childList: true, subtree: true });

  /* ---------- événements ---------- */
  VIEWS.evenements = function () {
    return {
      title: "Événements", sub: `${D.events.length} événements`, tools: `<a class="btn-a" href="../evenements.html" target="_blank">${I.ext} Voir la page</a><button class="btn-a btn-a--dark" data-add-event>${I.plus} Ajouter</button>`,
      html: `<div class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th style="width:90px">Visuel</th><th>Titre</th><th>Type</th><th>Date</th><th>Lieu</th><th></th></tr></thead><tbody>
      ${D.events.map((ev, i) => `<tr><td style="width:90px">${slot("", `events.${i}.cover`)}</td><td><input class="inp" data-k="events.${i}.title" value="${esc(ev.title)}"><textarea class="inp" style="height:auto;margin-top:6px;padding:8px 12px" rows="2" data-k="events.${i}.text">${esc(ev.text || "")}</textarea></td><td><input class="inp" data-k="events.${i}.type" value="${esc(ev.type)}"></td><td><input class="inp" data-k="events.${i}.dateLabel" value="${esc(ev.dateLabel || "")}" placeholder="ex. 12 mars 2026"></td><td><input class="inp" data-k="events.${i}.place" value="${esc(ev.place || "")}"></td>
        <td><div style="display:grid;gap:6px">${slot("Vidéo", `events.${i}.video`, "video")}<button class="icon-btn" data-del-event="${i}" title="Supprimer">${I.trash}</button></div></td></tr>`).join("")}
      </tbody></table></div></div>`
    };
  };
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-add-event]")) { D.events.unshift({ id: SM.uid("ev"), title: "Nouvel événement", type: "Défilé", date: "", dateLabel: "Date à confirmer", place: "", cover: "", brief: "Photo de l'événement à fournir.", text: "", gallery: [] }); save("Événement ajouté"); rerender(); }
    const d = e.target.closest("[data-del-event]"); if (d && confirm("Supprimer cet événement ?")) { D.events.splice(Number(d.dataset.delEvent), 1); save(); rerender(); }
  });

  /* ---------- textes & bandeau ---------- */
  VIEWS.contenu = function () {
    const S = D.settings;
    const msgs = S.announcement.messages;
    return {
      title: "Textes & bandeau", sub: "Bandeau d'annonce, ouverture, chapitres, savoir-faire, coordonnées",
      tools: `<a class="btn-a" href="../index.html" target="_blank">${I.ext} Voir l'accueil</a>`,
      html: `
      <div class="grid g2">
        <div class="card"><div class="card__head"><h2>Bandeau d'annonce</h2><p>Message défilant affiché au-dessus du menu, sur toutes les pages.</p></div><div class="card__body" style="display:grid;gap:14px">
          <div style="display:flex;gap:18px;align-items:end;flex-wrap:wrap"><label class="switch"><input type="checkbox" data-k="settings.announcement.enabled" ${S.announcement.enabled ? "checked" : ""}> Afficher le bandeau</label>
          <label class="fld" style="width:200px"><span>Durée d'un tour (s)</span><input type="number" min="10" max="120" data-type="num" data-k="settings.announcement.speed" value="${S.announcement.speed}"></label></div>
          <div class="list-edit">${msgs.map((m, i) => `<div class="list-edit__row"><input class="inp" data-k="settings.announcement.messages.${i}" value="${esc(m)}"><button class="icon-btn" data-msg-move="${i}:-1" ${i === 0 ? "disabled" : ""}>${I.up}</button><button class="icon-btn" data-msg-move="${i}:1" ${i === msgs.length - 1 ? "disabled" : ""}>${I.down}</button><button class="icon-btn" data-msg-del="${i}">${I.trash}</button></div>`).join("")}</div>
          <button class="btn-a" style="justify-self:start" data-msg-add>${I.plus} Ajouter un message</button>
        </div></div>
        <div class="card"><div class="card__head"><h2>Ouverture de l'accueil</h2><p>Vidéo plein écran et texte centré.</p></div><div class="card__body form-grid">
          <div class="full" style="display:grid;grid-template-columns:repeat(3,110px);gap:14px">${slot("Vidéo", "settings.hero.video", "video")}${slot("Image (si pas de vidéo)", "settings.hero.poster", "image")}</div>
          <label class="fld"><span>Sur-titre</span><input type="text" data-k="settings.hero.eyebrow" value="${esc(S.hero.eyebrow)}"></label>
          <label class="fld"><span>Titre</span><input type="text" data-k="settings.hero.title" value="${esc(S.hero.title)}"></label>
          <label class="fld full"><span>Sous-titre</span><textarea rows="2" data-k="settings.hero.subtitle">${esc(S.hero.subtitle)}</textarea></label>
          <label class="fld"><span>Bouton</span><input type="text" data-k="settings.hero.cta" value="${esc(S.hero.cta)}"></label>
          <label class="fld"><span>Lien du bouton</span><input type="text" data-k="settings.hero.ctaLink" value="${esc(S.hero.ctaLink)}"></label>
          <label class="fld full"><span>Consigne vidéo (affichée tant qu'elle manque)</span><textarea rows="2" data-k="settings.hero.brief">${esc(S.hero.brief)}</textarea></label>
        </div></div>
      </div>
      <div class="card"><div class="card__head"><h2>Barre de chapitres de l'accueil</h2><p>Libellé et phrase d'explication de chaque section, affichés dans la barre de progression.</p></div><div class="card__body" style="display:grid;gap:10px">
        ${S.chapters.map((c, i) => `<div style="display:grid;grid-template-columns:40px 220px minmax(0,1fr);gap:10px;align-items:center"><span class="pill pill--gold pill--plain">${String(i + 1).padStart(2, "0")}</span><input class="inp" data-k="settings.chapters.${i}.label" value="${esc(c.label)}"><input class="inp" data-k="settings.chapters.${i}.text" value="${esc(c.text)}"></div>`).join("")}
      </div></div>
      <div class="card"><div class="card__head"><h2>Savoir-faire</h2><p>Étapes affichées avec une image fixe qui change au défilement.</p></div>
        ${S.savoirFaire.map((s, i) => `<div class="look-row" style="grid-template-columns:92px minmax(0,1fr)">${slot("Image", `settings.savoirFaire.${i}.image`)}<div class="look-row__fields"><label class="fld"><span>Titre</span><input type="text" data-k="settings.savoirFaire.${i}.title" value="${esc(s.title)}"></label><label class="fld"><span>Consigne si image absente</span><input type="text" data-k="settings.savoirFaire.${i}.brief" value="${esc(s.brief || "")}"></label><label class="fld full"><span>Texte</span><textarea rows="2" data-k="settings.savoirFaire.${i}.text">${esc(s.text)}</textarea></label></div></div>`).join("")}
      </div>
      <div class="grid g2">
        <div class="card"><div class="card__head"><h2>Coordonnées & réseaux</h2></div><div class="card__body form-grid">
          <label class="fld"><span>Téléphone</span><input type="text" data-k="settings.phone" value="${esc(S.phone)}"></label>
          <label class="fld"><span>WhatsApp (format international, chiffres)</span><input type="text" data-k="settings.whatsapp" value="${esc(S.whatsapp)}"></label>
          <label class="fld"><span>E-mail</span><input type="email" data-k="settings.email" value="${esc(S.email)}"></label>
          <label class="fld"><span>Horaires</span><input type="text" data-k="settings.hours" value="${esc(S.hours)}"></label>
          <label class="fld"><span>Adresse</span><input type="text" data-k="settings.address" value="${esc(S.address)}"></label>
          <label class="fld"><span>Ville</span><input type="text" data-k="settings.city" value="${esc(S.city)}"></label>
          <label class="fld full"><span>Recherche Google Maps</span><input type="text" data-k="settings.mapsQuery" value="${esc(S.mapsQuery)}"></label>
          ${["instagram", "facebook", "tiktok", "linkedin"].map((k) => `<label class="fld"><span>${k}</span><input type="url" placeholder="https://…" data-k="settings.socials.${k}" value="${esc(S.socials[k] || "")}"></label>`).join("")}
        </div></div>
        <div class="card"><div class="card__head"><h2>Biographie</h2></div><div class="card__body form-grid">
          <div class="full" style="width:110px">${slot("Portrait", "settings.biography.portrait")}</div>
          <label class="fld full"><span>Texte court (accueil)</span><textarea rows="3" data-k="settings.biography.short">${esc(S.biography.short)}</textarea></label>
          <label class="fld full"><span>Texte long (page La Maison), une ligne vide entre les paragraphes</span><textarea rows="10" data-type="paras" data-k="settings.biography.long">${esc(S.biography.long.join("\n\n"))}</textarea></label>
        </div></div>
      </div>
      <div class="card"><div class="card__head"><h2>Repères (frise chronologique)</h2><div class="tools"><button class="btn-a btn-a--sm" data-tl-add>${I.plus} Ajouter</button></div></div><div class="card__body" style="display:grid;gap:8px">
        ${S.timeline.map((t, i) => `<div style="display:grid;grid-template-columns:90px 240px minmax(0,1fr) auto;gap:8px"><input class="inp" data-k="settings.timeline.${i}.year" value="${esc(t.year)}"><input class="inp" data-k="settings.timeline.${i}.title" value="${esc(t.title)}"><input class="inp" data-k="settings.timeline.${i}.text" value="${esc(t.text)}"><button class="icon-btn" data-tl-del="${i}">${I.trash}</button></div>`).join("")}
      </div></div>`
    };
  };
  document.addEventListener("click", (e) => {
    const S = D && D.settings; if (!S) return;
    if (e.target.closest("[data-msg-add]")) { S.announcement.messages.push("Nouveau message"); save(); rerender(); }
    const mm = e.target.closest("[data-msg-move]"); if (mm) { const [i, d] = mm.dataset.msgMove.split(":").map(Number); const a = S.announcement.messages; const [x] = a.splice(i, 1); a.splice(i + d, 0, x); save(); rerender(); }
    const md = e.target.closest("[data-msg-del]"); if (md) { S.announcement.messages.splice(Number(md.dataset.msgDel), 1); save(); rerender(); }
    if (e.target.closest("[data-tl-add]")) { S.timeline.push({ year: "", title: "Nouveau repère", text: "" }); save(); rerender(); }
    const td = e.target.closest("[data-tl-del]"); if (td) { S.timeline.splice(Number(td.dataset.tlDel), 1); save(); rerender(); }
  });

  /* ---------- intégrations ---------- */
  VIEWS.integrations = function () {
    const it = D.integrations;
    const st = (v, re) => !v ? '<span class="pill">Non configuré</span>' : re.test(v) ? '<span class="pill pill--ok">Prêt</span>' : '<span class="pill pill--warn">Format à vérifier</span>';
    const row = (logo, bg, title, desc, key, ph, re, extra) => `<div class="integ"><div class="integ__logo" style="background:${bg}">${logo}</div><div class="integ__body"><h3>${title}</h3><p>${desc}</p><input class="inp" data-k="integrations.${key}" value="${esc(it[key] || "")}" placeholder="${ph}" data-rerender>${extra || ""}</div><div>${st(it[key], re)}</div></div>`;
    return {
      title: "Intégrations", sub: "Mesure d'audience, publicité et base de données",
      html: `
      <div class="note note--gold"><b>Respect du consentement :</b> Google Analytics et Google Tag Manager ne se chargent qu'après accord pour la « mesure d'audience » ; Meta Pixel et TikTok seulement après accord « marketing ». Sans identifiant renseigné, rien n'est chargé.</div>
      <div class="card"><div class="card__head"><h2>Mesure d'audience & publicité</h2></div>
        ${row("GA4", "#e37400", "Google Analytics 4", "Identifiant de mesure du flux Web (Admin › Flux de données).", "ga4", "G-XXXXXXXXXX", /^G-[A-Z0-9]{6,12}$/)}
        ${row("GTM", "#246fdb", "Google Tag Manager", "Facultatif : à utiliser à la place de GA4 si l'agence gère les balises dans GTM.", "gtm", "GTM-XXXXXXX", /^GTM-[A-Z0-9]{5,9}$/)}
        ${row("META", "#0866ff", "Meta Pixel (Facebook & Instagram)", "Identifiant du pixel dans le Gestionnaire d'événements Meta.", "metaPixel", "123456789012345", /^\d{15,16}$/)}
        ${row("TT", "#111", "TikTok Pixel", "Identifiant du pixel dans TikTok Ads Manager (Événements).", "tiktokPixel", "CXXXXXXXXXXXXXXXXXXX", /^[A-Z0-9]{15,25}$/)}
      </div>
      <div class="card"><div class="card__head"><h2>Événements envoyés</h2><p>Conversions transmises automatiquement aux outils autorisés.</p></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Action sur le site</th><th>Statistiques internes</th><th>GA4 / GTM</th><th>Meta Pixel</th><th>TikTok</th></tr></thead><tbody>
        <tr><td>Page vue</td><td class="mono">pageview</td><td class="mono">page_view (auto)</td><td class="mono">PageView</td><td class="mono">page</td></tr>
        <tr><td>Ouverture d'un look</td><td class="mono">look_view</td><td class="mono">view_item</td><td class="mono">ViewContent</td><td class="mono">ViewContent</td></tr>
        <tr><td>Clic dans le formulaire</td><td class="mono">form_start</td><td class="mono">form_start</td><td class="mono">—</td><td class="mono">—</td></tr>
        <tr><td>Envoi du formulaire / newsletter</td><td class="mono">form_submit</td><td class="mono">generate_lead</td><td class="mono">Lead</td><td class="mono">SubmitForm</td></tr>
        <tr><td>Clic WhatsApp</td><td class="mono">click_whatsapp</td><td class="mono">contact_whatsapp</td><td class="mono">Contact</td><td class="mono">Contact</td></tr>
      </tbody></table></div></div>
      <div class="card"><div class="card__head"><h2>Formulaires & base de données</h2></div>
        <div class="integ"><div class="integ__logo" style="background:#3ecf8e">SB</div><div class="integ__body"><h3>Supabase</h3><p>Contenu du site, demandes, statistiques, images et accès au back-office. Le projet est défini dans <code>assets/js/config.js</code> ; le schéma est dans <code>docs/supabase-schema.sql</code>.</p>${LIVE ? `<p class="mono">${esc((window.SM_CONFIG || {}).supabaseUrl || "")}</p>` : ""}</div><div>${LIVE ? '<span class="pill pill--ok">Connecté</span>' : '<span class="pill">Mode démo</span>'}</div></div>
        <div class="integ"><div class="integ__logo" style="background:#00a8a3">NTL</div><div class="integ__body"><h3>Netlify Forms</h3><p>Copie facultative des demandes vers Netlify (onglet Forms). Désactivée par défaut : les demandes sont déjà enregistrées dans Supabase, et les données personnelles ne doivent pas être dupliquées sur Netlify.</p><label class="switch"><input type="checkbox" data-k="integrations.netlifyForms" ${it.netlifyForms ? "checked" : ""}> Envoyer aussi à Netlify Forms</label></div><div>${it.netlifyForms ? '<span class="pill pill--ok">Actif</span>' : '<span class="pill">Désactivé</span>'}</div></div>
      </div>
      ${LIVE ? `<div class="note">Les identifiants ci-dessus sont enregistrés en ligne et s'appliquent à tous les visiteurs du site.</div>` : `<div class="note"><b>Mode démo :</b> les identifiants saisis ici sont enregistrés dans ce navigateur et ne s'appliquent qu'à lui.</div>`}`
    };
  };

  /* ---------- paramètres ---------- */
  VIEWS.parametres = function () {
    const a = SM.getAccount();
    const evs = SM.getEvents().length, leads = SM.getLeads().length;
    return {
      title: "Paramètres", sub: LIVE ? "Compte, sauvegardes et maintenance" : "Compte, sauvegardes et données de démonstration",
      html: `
      <div class="grid g2">
        <div class="card"><div class="card__head"><h2>Compte administrateur</h2><p>${LIVE ? "Compte Supabase. Pour ajouter ou retirer un administrateur : tableau de bord Supabase (Authentication et table user_roles)." : "Mode démo : un seul compte, stocké dans ce navigateur."}</p></div><div class="card__body" style="display:grid;gap:14px">
          <label class="fld"><span>E-mail</span><input type="email" id="acc-email" value="${esc(a.email)}" ${LIVE ? "readonly" : ""}></label>
          <label class="fld"><span>Nouveau mot de passe</span><input type="password" id="acc-pass" placeholder="8 caractères minimum" autocomplete="new-password"></label>
          <button class="btn-a btn-a--dark" style="justify-self:start" data-save-account>Enregistrer</button>
        </div></div>
        <div class="card"><div class="card__head"><h2>Sauvegarde</h2><p>Exportez tout le contenu (collections, textes, demandes, statistiques) en JSON pour l'archiver ou le transmettre à l'équipe technique.</p></div><div class="card__body" style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn-a" data-export-json>${I.dl} Exporter (JSON)</button>
          <label class="btn-a">${I.upl} Importer (JSON)<input type="file" accept="application/json" hidden data-import-json></label>
        </div></div>
      </div>
      <div class="card"><div class="card__head"><h2>${LIVE ? "Maintenance" : "Données de démonstration"}</h2></div>
        <div class="integ"><div class="integ__logo" style="background:var(--gold)">↺</div><div class="integ__body"><h3>Réinitialiser le contenu</h3><p>Rétablit collections, textes et réglages d'origine${LIVE ? " <b>sur le site en ligne</b>. Exportez une sauvegarde avant" : ". Les fichiers importés restent dans la médiathèque"}.</p></div><button class="btn-a btn-a--danger" data-reset-content>Réinitialiser</button></div>
        <div class="integ"><div class="integ__logo" style="background:#85766a">${evs}</div><div class="integ__body"><h3>Effacer les statistiques</h3><p>${fmtN(evs)} événements ${LIVE ? "chargés (6 derniers mois). Efface toutes les statistiques enregistrées" : "mesurés dans ce navigateur"}.</p></div><button class="btn-a btn-a--danger" data-clear-stats>Effacer</button></div>
        ${LIVE ? "" : `<div class="integ"><div class="integ__logo" style="background:#85766a">${leads}</div><div class="integ__body"><h3>Demandes reçues dans ce navigateur</h3><p>Les demandes de démonstration sont régénérées automatiquement.</p></div><button class="btn-a btn-a--danger" data-clear-leads>Effacer</button></div>`}
      </div>`
    };
  };
  document.addEventListener("click", async (e) => {
    if (e.target.closest("[data-save-account]")) {
      const email = $("#acc-email").value.trim(), pass = $("#acc-pass").value;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast("E-mail invalide");
      if (pass && pass.length < 8) return toast("Mot de passe : 8 caractères minimum");
      if (LIVE && !pass) return toast("Saisissez un nouveau mot de passe");
      try { await SM.setAccount({ email, password: pass || SM.getAccount().password }); $("#acc-pass").value = ""; toast(LIVE ? "Mot de passe modifié" : "Compte mis à jour"); }
      catch (err) { toast("Modification impossible : " + errMsg(err)); }
    }
    if (e.target.closest("[data-export-json]")) download(`samira-mhaidi-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(SM.exportAll(), null, 2), "application/json");
    if (e.target.closest("[data-reset-content]") && confirm(LIVE ? "Rétablir tout le contenu d'origine sur le site en ligne ? Les modifications faites dans le back-office seront perdues." : "Rétablir tout le contenu d'origine ?")) { SM.resetData(); D = SM.getData(); demoCache = null; toast("Contenu réinitialisé"); rerender(); }
    if (e.target.closest("[data-clear-stats]") && confirm(LIVE ? "Effacer définitivement toutes les statistiques enregistrées ?" : "Effacer les statistiques mesurées dans ce navigateur ?")) {
      try { await SM.clearEvents(); toast("Statistiques effacées"); rerender(); } catch (err) { toast("Effacement impossible : " + errMsg(err)); }
    }
    if (e.target.closest("[data-clear-leads]") && confirm("Effacer les demandes reçues dans ce navigateur ?")) { SM.saveLeads([]); localStorage.removeItem("sm_demo_leads"); toast("Demandes effacées"); rerender(); }
  });
  document.addEventListener("change", (e) => {
    if (!e.target.matches("[data-import-json]")) return;
    const f = e.target.files[0]; if (!f) return;
    f.text().then((txt) => { try { const o = JSON.parse(txt); SM.importAll(o); D = SM.getData(); toast("Sauvegarde importée"); rerender(); } catch (err) { toast("Fichier JSON invalide"); } });
  });

  /* ---------- démarrage ---------- */
  async function boot() {
    await SM.ready({ fresh: true });
    /* Ne jamais éditer (et donc écraser) le contenu en ligne s'il n'a pas pu être lu. */
    if (LIVE && SM.contentError) {
      document.body.innerHTML = `<div class="login"><div class="login__form"><div class="login__box"><img src="../assets/img/logo-sm-cercle.png" alt=""><h1>${SM.contentError.status === 404 ? "Base de données à installer" : "Connexion impossible"}</h1><p>${SM.contentError.status === 404 ? "La base Supabase n'est pas encore installée : exécutez le fichier <code>docs/supabase-schema.sql</code> dans Supabase (SQL Editor), puis rechargez cette page." : `Le contenu du site n'a pas pu être chargé depuis Supabase (${esc(errMsg(SM.contentError))}). Vérifiez votre connexion internet puis réessayez.`}</p><button class="btn-a btn-a--dark btn-a--full" onclick="location.reload()">Réessayer</button></div></div></div>`;
      return;
    }
    D = SM.getData();
    if (await SM.checkSession()) { await loadRemote(); renderApp(); } else renderLogin();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
