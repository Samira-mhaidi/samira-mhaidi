/* Samira Mhaidi — interactions et rendu du site (V1). Dépend de seed.js et store.js. */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = SM.esc;
  const params = new URLSearchParams(location.search);
  const page = document.body.dataset.page || "home";
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let data, S;

  /* ---------- icônes ---------- */
  const I = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="4" width="18" height="16"/><circle cx="9" cy="10" r="2"/><path d="M3 18l6-5 4 3 3-2 5 4"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="5" width="13" height="14"/><path d="M16 10l5-3v10l-5-3z"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M15 5l-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M9 5l7 7-7 7"/></svg>',
    chev: '<svg class="chev" viewBox="0 0 10 6" fill="none" stroke="currentColor"><path d="M1 1l4 4 4-4"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="6" y="6" width="12" height="12"/><rect x="6" y="6" width="12" height="12" transform="rotate(45 12 12)"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8V6.5c0-.8.2-1.2 1.4-1.2H17V2h-2.6C11.3 2 10.5 3.6 10.5 6.2V8H8v3.3h2.5V22H14V11.3h2.7L17 8z"/></svg>',
    in: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 9h3v12H3zm6 0h2.9v1.7c.4-.8 1.4-1.9 3.3-1.9 3.2 0 3.8 2.1 3.8 4.8V21h-3v-6.6c0-1.6 0-3.5-2.1-3.5S12 12.6 12 14.3V21H9z"/></svg>',
    tt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 2c.3 2.2 1.6 3.7 3.8 3.9v3.2a7 7 0 0 1-3.8-1.2v6.6A6.5 6.5 0 1 1 10 8v3.3a3.2 3.2 0 1 0 3.2 3.2V2z"/></svg>'
  };

  /* ---------- briques HTML ---------- */
  function ph(kind, title, brief, dark) {
    const icon = kind === "video" ? I.video : kind === "pdf" ? I.doc : I.image;
    return `<div class="ph${dark ? " ph--dark" : ""}" role="img" aria-label="${esc(title)}"><div class="ph__inner"><span class="ph__icon">${icon}</span><strong class="ph__title">${esc(title)}</strong>${brief ? `<p class="ph__text">${esc(brief)}</p>` : ""}</div></div>`;
  }
  function badge(kind, title, brief) {
    return `<div class="ph-badge">${kind === "video" ? I.video : I.image}<div><b>${esc(title)}</b>${esc(brief || "")}</div></div>`;
  }
  function media(ref, alt, cls, extra) {
    const u = SM.url(ref);
    if (!u) return "";
    if (SM.isVideo(ref)) return `<video class="${cls || ""}" src="${esc(u)}" muted loop playsinline autoplay ${extra || ""}></video>`;
    return `<img class="${cls || ""}" src="${esc(u)}" alt="${esc(alt || "")}" loading="lazy" decoding="async" ${extra || ""}>`;
  }
  function btn(label, href, mod, attrs) {
    return `<a class="btn ${mod || ""}" href="${esc(href)}" ${attrs || ""}><span class="fill"></span>${esc(label)}</a>`;
  }
  const catName = (id) => (data.categories.find((c) => c.id === id) || {}).name || "";
  const waLink = (text) => `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(text || "Bonjour, je souhaite prendre rendez-vous avec la Maison Samira Mhaidi.")}`;

  function lookCard(l, i, opts) {
    opts = opts || {};
    const img = SM.url(l.image), alt = SM.url(l.hoverImage), vid = SM.url(l.video);
    const cls = ["look", alt && !vid ? "has-alt" : "", vid ? "has-video" : "", opts.cls || ""].join(" ");
    let m;
    if (!img) m = ph("image", "Photo à fournir", l.brief || "Photo du look, format portrait 2:3, 1600 px minimum.");
    else {
      m = `<img class="look__main" src="${esc(img)}" alt="${esc(l.name)}" loading="lazy" decoding="async">`;
      if (alt && !vid) m += `<img class="look__alt" src="${esc(alt)}" alt="" loading="lazy" decoding="async">`;
      if (vid) m += `<video data-src="${esc(vid)}" muted loop playsinline preload="none"></video>`;
    }
    const tag = !img ? "" : vid ? `<span class="look__tag look__tag--video">Vidéo</span>` : !alt ? `<span class="look__tag look__tag--video">Vidéo au survol : à intégrer</span>` : "";
    const sub = opts.meta === "collection" ? (l.collectionName || "") : catName(l.categoryId);
    return `<button type="button" class="${cls}" data-look="${esc(l.id)}" data-cat="${esc(l.categoryId || "")}" data-cursor="Voir">
      <div class="look__media">${m}${tag}${finePointer ? "" : '<span class="look__view">Voir</span>'}</div>
      <div class="look__info"><div><span class="look__num">${String(i + 1).padStart(2, "0")}</span> <span class="look__name">${esc(l.name)}</span></div><span class="look__meta">${esc(sub)}</span></div>
    </button>`;
  }

  function sectionHead(num, eyebrow, title, text, center) {
    return `<div class="s-head${center ? " s-head--center" : ""}">
      <div class="reveal"><div class="s-head__num eyebrow">${num ? esc(num) + " — " : ""}${esc(eyebrow)}</div><h2 class="title">${title}</h2></div>
      ${text ? `<p class="lead reveal reveal-d1">${esc(text)}</p>` : ""}
    </div>`;
  }

  function rail(cardsHtml) {
    return `<div class="rail" data-rail><div class="rail__track">${cardsHtml}</div>
      <div class="wrap"><div class="rail__bar"><div class="rail__line"><i></i></div><div class="rail__btns">
      <button class="rail__btn" data-dir="-1" aria-label="Précédent">${I.left}</button><button class="rail__btn" data-dir="1" aria-label="Suivant">${I.right}</button></div></div></div></div>`;
  }

  /* ---------- bandeau + header + menus ---------- */
  function renderChrome() {
    const a = S.announcement || {};
    let bar = "";
    if (a.enabled && a.messages && a.messages.length) {
      const items = a.messages.map((m) => `<span class="announce__item">${esc(m)}</span>`).join("");
      const half = items.repeat(3);
      bar = `<div class="announce" role="region" aria-label="Annonce"><div class="announce__track" style="--marquee-dur:${Number(a.speed) || 38}s"><div>${half}</div><div aria-hidden="true">${half}</div></div></div>`;
    } else document.documentElement.style.setProperty("--bar-h", "0px");

    const cols = SM.publishedCollections(data);
    const cur = (p) => (page === p ? " is-current" : "");
    const firstImg = (cols.find((c) => c.cover) || {}).cover;
    const top = document.createElement("div");
    top.className = "site-top";
    top.innerHTML = `${bar}
    <header class="hdr"><div class="wrap hdr__inner">
      <nav class="hdr__nav" aria-label="Navigation principale">
        <button class="hdr__burger" aria-label="Ouvrir le menu" data-mnav-open><span></span></button>
        <a class="hdr__link${cur("collections")}${cur("collection")}" href="collections.html" data-mega="collections" aria-expanded="false" aria-haspopup="true">Collections ${I.chev}</a>
        <a class="hdr__link${cur("maison")}" href="maison.html">La Maison</a>
        <a class="hdr__link" href="index.html#savoir-faire">Savoir-faire</a>
      </nav>
      <a class="hdr__logo" href="index.html" aria-label="${esc(S.brand)} — accueil"><span class="display">${esc(S.brand)}</span><small>${esc(S.tagline)}</small></a>
      <nav class="hdr__nav hdr__nav--right" aria-label="Navigation secondaire">
        <a class="hdr__link${cur("evenements")}" href="evenements.html">Événements</a>
        <a class="hdr__link${cur("contact")}" href="contact.html">Contact</a>
        <a class="hdr__link hdr__rdv" href="contact.html?type=rdv">Rendez-vous</a>
        <a class="hdr__link keep" href="${waLink()}" target="_blank" rel="noopener" aria-label="WhatsApp" data-track="whatsapp">${I.wa.replace("<svg", '<svg class="hdr__icon"')}</a>
      </nav>
    </div>
    <div class="mega" id="mega-collections" aria-hidden="true"><div class="wrap mega__inner">
      <div class="mega__col"><h4 class="eyebrow muted">Collections</h4><ul>${cols.map((c) => `<li><a href="${c.status === "upcoming" ? "collections.html" : "collection.html?c=" + c.slug}" data-img="${esc(SM.url(c.cover))}" class="${c.status === "upcoming" ? "is-soon" : ""}">${esc(c.name)} <small>${esc(c.year)}${c.status === "upcoming" ? " · bientôt" : ""}</small></a></li>`).join("")}</ul></div>
      <div class="mega__col"><h4 class="eyebrow muted">Catégories</h4><ul>${data.categories.map((c) => `<li><a href="collections.html?cat=${c.slug}#pieces">${esc(c.name)}</a></li>`).join("")}</ul></div>
      <div class="mega__col"><h4 class="eyebrow muted">Catalogues</h4><ul>${data.catalogues.map((c) => `<li><a href="collection.html?catalogue=${c.slug}">${esc(c.name)}</a></li>`).join("")}<li><a href="contact.html?type=rdv">Rendez-vous privé</a></li></ul></div>
      <figure class="mega__preview">${cols.filter((c) => c.cover).map((c, i) => `<img src="${esc(SM.url(c.cover))}" alt="" class="${i === 0 ? "is-on" : ""}" data-src="${esc(SM.url(c.cover))}">`).join("")}${firstImg ? "" : ph("image", "Visuel à fournir", "")}<figcaption class="eyebrow">Haute Couture</figcaption></figure>
    </div></div>
    </header>`;
    document.body.prepend(top);
    document.body.insertAdjacentHTML("afterbegin", '<div class="mega-veil"></div><a class="skip" href="#main">Aller au contenu</a>');

    // menu mobile
    document.body.insertAdjacentHTML("beforeend", `<nav class="mnav" aria-label="Menu" aria-hidden="true">
      <div class="mnav__top"><span class="display" style="font-size:20px;letter-spacing:.14em">${esc(S.brand)}</span><button class="mnav__close" data-mnav-close aria-label="Fermer">×</button></div>
      <ul>
        <li><a href="index.html"><small>01</small>Accueil</a></li>
        <li><a href="collections.html"><small>02</small>Collections</a></li>
        <li><a href="maison.html"><small>03</small>La Maison</a></li>
        <li><a href="index.html#savoir-faire"><small>04</small>Savoir-faire</a></li>
        <li><a href="evenements.html"><small>05</small>Événements</a></li>
        <li><a href="contact.html"><small>06</small>Contact & rendez-vous</a></li>
      </ul>
      <div class="mnav__foot"><div class="zel"></div><a href="tel:${esc(S.phone.replace(/\s/g, ""))}">${esc(S.phone)}</a><a href="mailto:${esc(S.email)}">${esc(S.email)}</a><span>${esc(S.address)}, ${esc(S.city)}</span></div>
    </nav>`);

    // pied de page
    const so = S.socials || {};
    const social = (k, label) => `<a href="${esc(so[k] || "#")}" ${so[k] ? 'target="_blank" rel="noopener"' : `title="Lien ${label} à renseigner dans le back-office"`} aria-label="${label}">${I[k === "instagram" ? "ig" : k === "facebook" ? "fb" : k === "linkedin" ? "in" : "tt"]}</a>`;
    document.body.insertAdjacentHTML("beforeend", `<footer class="footer"><div class="footer__zel"></div><div class="wrap">
      <div class="footer__top">
        <div class="footer__brand"><img src="assets/img/logo-sm-cercle.png" alt="Logo Samira Mhaidi" width="108" height="110"><p>Haute couture marocaine, pièces uniques réalisées à la main dans notre atelier de Casablanca.</p></div>
        <div><h4 class="eyebrow">La Maison</h4><ul><li><a href="maison.html">Samira Mhaidi</a></li><li><a href="index.html#savoir-faire">Savoir-faire</a></li><li><a href="evenements.html">Événements</a></li><li><a href="contact.html">Contact</a></li></ul></div>
        <div><h4 class="eyebrow">Collections</h4><ul>${cols.map((c) => `<li><a href="${c.status === "upcoming" ? "collections.html" : "collection.html?c=" + c.slug}">${esc(c.name)}</a></li>`).join("")}</ul></div>
        <div class="footer__news"><h4 class="eyebrow">La lettre de la Maison</h4><p>Nouvelles collections, défilés et invitations privées.</p>
          <form class="news" data-newsletter novalidate><label class="sr-only" for="news-email">Adresse e-mail</label><input id="news-email" type="email" name="email" placeholder="Votre adresse e-mail" required><button type="submit">S'inscrire</button></form>
          <div class="socials">${social("instagram", "Instagram")}${social("facebook", "Facebook")}${social("tiktok", "TikTok")}${social("linkedin", "LinkedIn")}</div>
        </div>
      </div>
      <div class="footer__word gold-text">${esc(S.brand)}</div>
      <div class="footer__bottom"><span>© ${new Date().getFullYear()} ${esc(S.brand)} · ${esc(S.address)}, ${esc(S.city)}</span>
        <nav><a href="confidentialite.html">Confidentialité</a><a href="#" data-cookie-open>Gestion des cookies</a><a href="admin/">Espace administration</a></nav></div>
    </div></footer>`);

    // WhatsApp, panneau look, curseur, bandeau cookies
    document.body.insertAdjacentHTML("beforeend", `
      <a class="wa" href="${waLink()}" target="_blank" rel="noopener" data-track="whatsapp" aria-label="Écrire sur WhatsApp">${I.wa}<span>Écrire à l'atelier</span></a>
      <div class="drawer" aria-hidden="true"><div class="drawer__veil" data-drawer-close></div><div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Détail du look"><div class="drawer__media"></div><div class="drawer__body"></div></div></div>
      <div class="cursor"><b>Voir</b></div>
      <div class="cookie" role="dialog" aria-live="polite" aria-label="Cookies">
        <h3>Votre confidentialité</h3>
        <p>Nous utilisons des cookies pour mesurer l'audience du site et, avec votre accord, pour vous proposer des contenus adaptés sur les réseaux sociaux. <a href="confidentialite.html">En savoir plus</a></p>
        <div class="cookie__prefs">
          <label class="toggle"><span>Cookies nécessaires<small>Fonctionnement du site, mémorisation de vos choix.</small></span><input type="checkbox" checked disabled></label>
          <label class="toggle"><span>Mesure d'audience<small>Statistiques de visite (Google Analytics, statistiques internes).</small></span><input type="checkbox" data-consent="analytics"></label>
          <label class="toggle"><span>Marketing<small>Meta Pixel, TikTok : mesure des campagnes publicitaires.</small></span><input type="checkbox" data-consent="marketing"></label>
        </div>
        <div class="cookie__btns">
          <button class="btn" data-cookie="refuse"><span class="fill"></span>Refuser</button>
          <button class="btn btn--solid" data-cookie="accept"><span class="fill"></span>Tout accepter</button>
          <button class="cookie__more" data-cookie="custom">Personnaliser</button>
        </div>
      </div>`);
  }

  /* ---------- PAGES ---------- */
  function renderHome() {
    S.chapters.forEach((c) => { const sec = document.getElementById(c.id); if (sec) { sec.dataset.chapter = c.label; sec.dataset.chapterText = c.text; } });
    const h = S.hero;
    const words = h.title.split(" ");
    const l1 = words.length > 1 ? words.slice(0, -1).join(" ") : h.title, l2 = words.length > 1 ? words[words.length - 1] : "";
    $("[data-bind=hero]").innerHTML = `
      <div class="hero__media">${h.video ? media(h.video, "", "", `poster="${esc(SM.url(h.poster))}"`) : h.poster ? `<img src="${esc(SM.url(h.poster))}" alt="Caftan Samira Mhaidi devant une porte dorée" fetchpriority="high">` : ph("video", "Vidéo d'ouverture à intégrer", h.brief, true)}</div>
      <div class="hero__shade"></div><div class="hero__frame"></div>
      <div class="hero__content">
        <svg class="hero__arch" viewBox="0 0 400 560" fill="none" stroke="#e3c77a" stroke-width="1" aria-hidden="true"><path d="M30 560V260C30 140 110 60 200 26c90 34 170 114 170 234v300"/><path d="M52 560V266C52 160 122 88 200 56c78 32 148 104 148 210v294" opacity=".5"/></svg>
        <p class="hero__eyebrow eyebrow">${esc(h.eyebrow)}</p>
        <h1 class="display hero__title"><span class="line"><span>${esc(l1)}</span></span>${l2 ? `<span class="line"><span>${esc(l2)}</span></span>` : ""}</h1>
        <p class="hero__sub">${esc(h.subtitle)}</p>
        <div class="hero__cta">${btn(h.cta, h.ctaLink, "btn--light")}</div>
      </div>
      ${h.video ? "" : badge("video", "Vidéo hero à intégrer", h.brief)}
      <div class="hero__scroll"><span>Défiler</span><i></i></div>`;

    // 01 collection
    const looks = SM.allLooks(data).filter((l) => l.collectionStatus === "published");
    const featured = looks.filter((l) => l.featured);
    const sel = (featured.length >= 4 ? featured : looks).slice(0, 10);
    const latest = SM.publishedCollections(data).find((c) => c.status === "published");
    const upcoming = data.collections.find((c) => c.status === "upcoming");
    $("[data-bind=collection]").innerHTML = `
      <div class="wrap">${sectionHead("01", S.chapters[0].label, "Les pièces <em>signature</em>", "Une sélection des créations de la Maison. Survolez un look pour l'animer, cliquez pour le découvrir en détail.")}</div>
      ${rail(sel.map((l, i) => lookCard(l, i, { meta: "collection" })).join(""))}
      ${latest ? `<div class="wrap" style="margin-top:clamp(80px,10vw,150px)"><div class="split">
        <div class="split__media mask">${latest.cover ? media(latest.cover, latest.name) : ph("image", "Visuel de collection à fournir", latest.coverBrief)}</div>
        <div class="split__text reveal"><span class="eyebrow muted">${esc(latest.season)} · ${esc(latest.year)}</span><h3 class="title">${esc(latest.name)}</h3><p class="lead">${esc(latest.story)}</p>
          <div class="split__meta"><span class="chip">${latest.looks.length} looks</span>${latest.categoryId ? `<span class="chip">${esc(catName(latest.categoryId))}</span>` : ""}<span class="chip">Sur mesure</span></div>
          ${btn("Voir la collection", "collection.html?c=" + latest.slug)}
        </div></div></div>` : ""}
      ${upcoming ? `<div class="wrap" style="margin-top:clamp(70px,9vw,130px)"><div class="split split--rev">
        <div class="split__media">${upcoming.cover ? media(upcoming.cover, upcoming.name) : ph("image", "Visuel de campagne à fournir", upcoming.coverBrief)}</div>
        <div class="split__text reveal"><span class="eyebrow" style="color:var(--gold)">Bientôt · ${esc(upcoming.year)}</span><h3 class="title">${esc(upcoming.name)}</h3><p class="lead">${esc(upcoming.teaser)}</p>${btn("Être informée en avant-première", "contact.html?type=avant-premiere", "btn--gold")}</div>
      </div></div>` : ""}`;

    // 02 défilé
    const ame = data.collections.find((c) => c.id === "col-ame") || latest || {};
    const runway = (ame.looks || []).slice(2, 6);
    $("[data-bind=defile]").innerHTML = `<div class="wrap">
      ${sectionHead("02", S.chapters[1].label, `${esc(ame.name || "")} <em>en mouvement</em>`, "Le défilé, tel qu'il a été présenté sur le podium.")}
      <div class="film reveal">${ame.heroVideo ? `${media(ame.heroVideo, "", "", 'preload="none"')}` : ph("video", "Film du défilé à intégrer", ame.heroVideoBrief || "Vidéo du défilé, 16:9.", true)}</div>
      <div class="film-strip">${runway.map((l, i) => lookCard(l, i + 2)).join("")}</div>
    </div>`;

    // 03 savoir-faire
    const sf = S.savoirFaire || [];
    $("[data-bind=savoir-faire]").innerHTML = `<div class="wrap">
      ${sectionHead("03", S.chapters[2].label, "Les gestes <em>de l'atelier</em>", "Chaque caftan demande des centaines d'heures de travail à la main. Voici les savoir-faire qui font une pièce Samira Mhaidi.")}
      <div class="sf"><div class="sf__visual"><div class="arch-mask">${sf.map((s, i) => `<figure class="${i === 0 ? "is-on" : ""}" data-sf-img="${i}">${s.image ? media(s.image, s.title) : ph("image", "Visuel à fournir", s.brief)}</figure>`).join("")}</div></div>
      <div class="sf__steps">${sf.map((s, i) => `<article class="sf__step${i === 0 ? " is-on" : ""}" data-sf="${i}"><span class="eyebrow" style="color:var(--gold)">${String(i + 1).padStart(2, "0")} / ${String(sf.length).padStart(2, "0")}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></article>`).join("")}</div></div>
    </div>`;

    // 04 maison
    const b = S.biography;
    $("[data-bind=maison]").innerHTML = `<div class="wrap">
      <div class="maison"><div class="arch-img mask">${media(b.portrait, "Portrait de Samira Mhaidi")}</div>
        <div class="reveal"><div class="s-head__num eyebrow">04 — ${esc(S.chapters[3].label)}</div><h2 class="title">Samira <em>Mhaidi</em></h2>
          <p class="lead" style="margin:26px 0 0">${esc(b.short)}</p>
          <div class="maison__sign"><span class="script">Samira Mhaidi</span><span class="eyebrow muted">Directrice artistique</span></div>
          <div style="margin-top:36px">${btn("Découvrir la Maison", "maison.html")}</div>
        </div></div>
      ${timeline()}
    </div>`;

    // 05 événements
    $("[data-bind=evenements]").innerHTML = `<div class="wrap">
      ${sectionHead("05", S.chapters[4].label, "Sur les podiums <em>et au-delà</em>", "Défilés, expositions et rencontres : la Maison s'engage pour la création marocaine.")}
      <div class="events">${data.events.slice(0, 4).map(eventCard).join("")}</div>
      <div style="text-align:center;margin-top:56px">${btn("Tous les événements", "evenements.html")}</div>
    </div>`;

    // 06 rendez-vous
    $("[data-bind=rendez-vous]").innerHTML = rdvBlock("06 — " + S.chapters[5].label);
  }

  function timeline() {
    return `<div class="timeline" data-timeline><div class="timeline__line"><i></i></div><ol class="timeline__list">${S.timeline.map((t, i) => `<li class="timeline__item reveal reveal-d${(i % 3) + 1}"><span class="timeline__year">${esc(t.year)}</span><h4>${esc(t.title)}</h4><p>${esc(t.text)}</p></li>`).join("")}</ol></div>`;
  }
  function eventCard(e) {
    const hasImg = e.cover || e.video;
    return `<a class="event reveal${hasImg ? "" : " event--ph"}" href="evenements.html#${esc(e.id)}" data-cursor="Voir">
      ${e.video ? media(e.video, e.title) : e.cover ? media(e.cover, e.title) : ph("video", e.type === "Film" ? "Film à intégrer" : "Visuel à fournir", e.brief, true)}
      <div class="event__body"><span class="eyebrow" style="color:var(--gold-light)">${esc(e.type)} · ${esc(e.dateLabel || e.date)}</span><h3>${esc(e.title)}</h3>${e.text ? `<p>${esc(e.text)}</p>` : ""}</div></a>`;
  }
  function rdvBlock(eyebrow) {
    return `<div class="wrap"><span class="eyebrow" style="color:var(--gold-light)">${esc(eyebrow)}</span>
      <div class="star-divider" style="margin:26px auto">${I.star}</div>
      <h2 class="title">Une consultation <em class="gold-text" style="font-style:italic">privée</em></h2>
      <p>Découvrez les collections à l'atelier, choisissez vos étoffes et imaginez avec Samira Mhaidi la pièce qui vous ressemble.</p>
      <div class="rdv__actions">${btn("Prendre rendez-vous", "contact.html?type=rdv", "btn--gold")}${btn("WhatsApp", waLink(), "btn--light", 'target="_blank" rel="noopener" data-track="whatsapp"')}</div></div>`;
  }

  function renderCollections() {
    const cols = SM.publishedCollections(data);
    $("[data-bind=collections]").innerHTML = cols.map((c, i) => `<article class="split coll-row${i % 2 ? " split--rev" : ""}" id="${esc(c.slug)}">
      <a class="split__media mask" href="${c.status === "upcoming" ? "#" : "collection.html?c=" + c.slug}" data-cursor="Voir">${c.cover ? media(c.cover, c.name) : ph("image", "Visuel à fournir", c.coverBrief)}</a>
      <div class="split__text reveal"><span class="eyebrow ${c.status === "upcoming" ? "" : "muted"}" style="${c.status === "upcoming" ? "color:var(--gold)" : ""}">${c.status === "upcoming" ? "Bientôt" : esc(c.season)} · ${esc(c.year)}</span>
        <h2 class="display">${esc(c.name)}</h2><p class="lead">${esc(c.teaser)}</p>
        <div class="split__meta"><span class="chip">${c.looks.length} looks</span>${c.categoryId ? `<span class="chip">${esc(catName(c.categoryId))}</span>` : ""}</div>
        ${c.status === "upcoming" ? btn("Être informée", "contact.html?type=avant-premiere", "btn--gold") : btn("Voir la collection", "collection.html?c=" + c.slug)}</div>
    </article>`).join("");

    const looks = SM.allLooks(data).filter((l) => l.collectionStatus === "published");
    const activeCat = params.get("cat");
    $("[data-bind=filters]").innerHTML = `<button class="filter${activeCat ? "" : " is-on"}" data-filter="">Toutes les pièces</button>` + data.categories.map((c) => `<button class="filter${activeCat === c.slug ? " is-on" : ""}" data-filter="${c.id}">${esc(c.name)}</button>`).join("");
    $("[data-bind=pieces]").innerHTML = looks.map((l, i) => lookCard(l, i, { meta: "collection" })).join("");
    const apply = (id) => {
      $$("[data-filter]").forEach((b) => b.classList.toggle("is-on", b.dataset.filter === id));
      $$("[data-bind=pieces] .look").forEach((el) => el.classList.toggle("is-hidden", !!id && el.dataset.cat !== id));
    };
    $$("[data-filter]").forEach((b) => b.addEventListener("click", () => apply(b.dataset.filter)));
    if (activeCat) { const c = data.categories.find((x) => x.slug === activeCat); if (c) apply(c.id); }

    const all = SM.allLooks(data);
    $("[data-bind=catalogues]").innerHTML = data.catalogues.map((k) => {
      const imgs = k.lookIds.map((id) => all.find((l) => l.id === id)).filter((l) => l && l.image).slice(0, 2);
      return `<a class="cat-card reveal" href="collection.html?catalogue=${esc(k.slug)}" data-cursor="Voir"><div class="cat-card__imgs">${imgs.map((l) => media(l.image, l.name)).join("")}</div>
        <div class="cat-card__body"><span class="eyebrow muted">Catalogue · ${k.lookIds.length} pièces</span><h3>${esc(k.name)}</h3><p>${esc(k.description)}</p>
        ${k.pdf ? `<span class="chip" style="justify-self:start">PDF disponible</span>` : ph("pdf", "PDF à fournir", k.pdfBrief)}<span class="link-u" style="margin-top:auto">Voir la sélection</span></div></a>`;
    }).join("");
  }

  function renderCollection() {
    const slug = params.get("c"), catSlug = params.get("catalogue");
    let coll, k, title, eyebrow, story, cover, coverBrief, looks, video, videoBrief;
    if (catSlug) {
      k = data.catalogues.find((x) => x.slug === catSlug) || data.catalogues[0];
      const all = SM.allLooks(data);
      looks = k.lookIds.map((id) => all.find((l) => l.id === id)).filter(Boolean);
      title = k.name; eyebrow = "Catalogue · " + looks.length + " pièces"; story = k.description;
      cover = (looks.find((l) => l.image) || {}).image; video = ""; videoBrief = "Vidéo de présentation du catalogue (facultatif).";
    } else {
      coll = SM.findCollection(data, slug) || SM.publishedCollections(data).find((c) => c.status === "published");
      looks = coll.looks; title = coll.name; eyebrow = `${coll.season} · ${coll.year}`; story = coll.story; cover = coll.cover; coverBrief = coll.coverBrief;
      video = coll.heroVideo; videoBrief = coll.heroVideoBrief;
    }
    document.title = `${title} — ${S.brand}`;
    $("[data-bind=page-hero]").innerHTML = `<div class="page-hero__media">${cover ? media(cover, title) : ph("image", "Visuel de collection à fournir", coverBrief, true)}</div>
      <div class="wrap page-hero__content"><span class="eyebrow" style="color:var(--gold-light)">${esc(eyebrow)}</span><h1 class="display">${esc(title)}</h1></div>`;
    $("[data-bind=histoire]").innerHTML = `<div class="wrap"><div class="split">
      <div class="split__text reveal"><div class="s-head__num eyebrow">01 — L'histoire</div><h2 class="title">${esc(title)}</h2><p class="lead" style="margin-top:24px">${esc(story)}</p>
      <div class="split__meta"><span class="chip">${looks.length} looks</span><span class="chip">Pièces uniques</span><span class="chip">Sur mesure</span></div>
      <div style="display:flex;gap:16px;flex-wrap:wrap">${btn("Prendre rendez-vous", "contact.html?type=rdv&look=" + encodeURIComponent(title))}${k ? (k.pdf ? btn("Télécharger le PDF", SM.url(k.pdf), "btn--gold", `download="${esc(SM.slugify(k.name))}.pdf"`) : `<div style="width:100%;max-width:420px;margin-top:8px">${ph("pdf", "PDF à fournir", k.pdfBrief)}</div>`) : ""}</div></div>
      <div class="split__media mask">${looks[1] && looks[1].image ? media(looks[1].image, looks[1].name) : ph("image", "Visuel à fournir", "Photo d'ambiance de la collection.")}</div></div></div>`;
    $("[data-bind=lookbook]").innerHTML = `<div class="wrap">${sectionHead("02", "Lookbook", "Les <em>looks</em>", "Survolez pour animer, cliquez pour découvrir chaque pièce.")}<div class="lookbook">${looks.map((l, i) => lookCard(l, i)).join("")}</div></div>`;
    $("[data-bind=film]").innerHTML = `<div class="wrap">${sectionHead("03", "Le film", "La collection <em>en mouvement</em>", "")}<div class="film reveal">${video ? media(video, "") : ph("video", "Vidéo à intégrer", videoBrief, true)}</div></div>`;
    $("[data-bind=rendez-vous]").innerHTML = rdvBlock("04 — Commander");
    const others = SM.publishedCollections(data).filter((c) => c !== coll && c.status === "published");
    $("[data-bind=autres]").innerHTML = `<div class="wrap">${sectionHead("", "Autres collections", "Poursuivre <em>la découverte</em>", "", true)}<div class="grid-looks" style="grid-template-columns:repeat(${Math.min(3, others.length)},minmax(0,1fr))">${others.slice(0, 3).map((c) => `<a class="look" href="collection.html?c=${c.slug}" data-cursor="Voir"><div class="look__media" style="aspect-ratio:4/5">${c.cover ? `<img class="look__main" src="${esc(SM.url(c.cover))}" alt="${esc(c.name)}" loading="lazy">` : ph("image", "Visuel à fournir", "")}</div><div class="look__info"><span class="look__name">${esc(c.name)}</span><span class="look__meta">${esc(c.year)}</span></div></a>`).join("")}</div></div>`;
  }

  function renderMaison() {
    const b = S.biography;
    $("[data-bind=bio]").innerHTML = `<div class="wrap"><div class="maison">
      <div class="arch-img mask">${media(b.portrait, "Portrait de Samira Mhaidi")}</div>
      <div class="reveal"><div class="s-head__num eyebrow">01 — Parcours</div><h2 class="title">Parcours <em>&amp; carrière</em></h2>
        ${b.long.map((p) => `<p style="margin:22px 0 0">${esc(p)}</p>`).join("")}
        <div class="maison__sign"><span class="script">Samira Mhaidi</span><span class="eyebrow muted">Directrice artistique</span></div></div>
    </div></div>`;
    $("[data-bind=timeline]").innerHTML = `<div class="wrap">${sectionHead("02", "Repères", "Les grandes <em>étapes</em>", "Des podiums de Montréal à Istanbul, le caftan marocain présenté au monde.")}${timeline()}</div>`;
    $("[data-bind=presse]").innerHTML = `<div class="wrap"><div class="split">
      <div class="split__media" style="aspect-ratio:4/3">${ph("pdf", "Dossier de presse à fournir", "PDF du dossier de presse (biographie, visuels HD, contacts presse) téléchargeable depuis cette section.")}</div>
      <div class="split__text reveal"><div class="s-head__num eyebrow">04 — Presse</div><h2 class="title">Dossier <em>de presse</em></h2><p class="lead" style="margin-top:22px">Journalistes, stylistes et organisateurs d'événements : demandez nos visuels haute définition et la biographie officielle.</p>
      <div style="margin-top:30px">${btn("Contact presse", "contact.html?type=presse")}</div></div></div></div>`;
    $("[data-bind=rendez-vous]").innerHTML = rdvBlock("05 — Rendez-vous");
  }

  function renderEvents() {
    $("[data-bind=events-list]").innerHTML = data.events.map((e, i) => `<article class="split${i % 2 ? " split--rev" : ""}" id="${esc(e.id)}" style="margin-bottom:clamp(70px,9vw,130px)">
      <div class="split__media mask" style="aspect-ratio:${e.type === "Film" ? "16/10" : "4/5"}">${e.video ? media(e.video, e.title) : e.cover ? media(e.cover, e.title) : ph("video", e.type === "Film" ? "Film à intégrer" : "Visuel à fournir", e.brief, true)}</div>
      <div class="split__text reveal"><span class="eyebrow muted">${esc(e.type)} · ${esc(e.dateLabel || e.date)}${e.place ? " · " + esc(e.place) : ""}</span><h2 class="title">${esc(e.title)}</h2><p class="lead">${esc(e.text)}</p>
      ${(e.gallery || []).length > 1 ? `<div class="film-strip" style="grid-template-columns:repeat(3,1fr);margin-top:26px">${e.gallery.map((g) => `<div class="look__media" style="aspect-ratio:1">${media(g, e.title)}</div>`).join("")}</div>` : ""}</div>
    </article>`).join("");
    $("[data-bind=timeline]").innerHTML = `<div class="wrap">${sectionHead("", "Podiums", "Défilés <em>internationaux</em>", "", true)}${timeline()}</div>`;
    $("[data-bind=rendez-vous]").innerHTML = rdvBlock("Inviter la Maison");
  }

  function renderContact() {
    $("[data-bind=contact-card]").innerHTML = `<dl class="contact-card reveal">
      <div><dt>Atelier</dt><dd>${esc(S.address)}<br>${esc(S.city)}</dd></div>
      <div><dt>Téléphone</dt><dd><a href="tel:${esc(S.phone.replace(/\s/g, ""))}">${esc(S.phone)}</a></dd></div>
      <div><dt>E-mail</dt><dd><a href="mailto:${esc(S.email)}">${esc(S.email)}</a></dd></div>
      <div><dt>Horaires</dt><dd>${esc(S.hours)}</dd></div>
      <div>${btn("Écrire sur WhatsApp", waLink(), "btn--solid", 'target="_blank" rel="noopener" data-track="whatsapp"')}</div>
    </dl>`;
    const map = $("[data-bind=map]");
    map.innerHTML = `<button class="btn" data-map><span class="fill"></span>Afficher la carte</button>`;
    $("[data-map]", map).addEventListener("click", () => {
      map.innerHTML = `<iframe title="Carte de l'atelier" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${encodeURIComponent(S.mapsQuery)}&output=embed"></iframe>`;
    });
    initContactForm();
  }

  /* ---------- formulaire de contact ---------- */
  function initContactForm() {
    const form = $("form[name=contact]");
    if (!form) return;
    const type = params.get("type"), look = params.get("look");
    const sel = form.elements.type;
    if (type === "rdv") sel.value = "rdv";
    else if (type === "presse") sel.value = "presse";
    else if (type === "avant-premiere") sel.value = "avant-premiere";
    else if (look) sel.value = "commande";
    if (look) form.elements.look.value = look;

    let started = false, sent = false;
    const touched = new Set();
    form.addEventListener("focusin", () => {
      if (!started) { started = true; SM.track("form_start", { form: "contact" }); SM.fire("form_start"); }
    });
    form.addEventListener("change", (e) => { if (e.target.name) touched.add(e.target.name); });
    form.addEventListener("input", (e) => { if (e.target.name) touched.add(e.target.name); });
    window.addEventListener("pagehide", () => { if (started && !sent) SM.track("form_abandon", { form: "contact", fields: Array.from(touched) }); });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = form.elements;
      const errors = {};
      if (!f.name.value.trim()) errors.name = "Indiquez votre nom.";
      if (!f.email.value.trim() && !f.phone.value.trim()) errors.email = "Indiquez un e-mail ou un téléphone.";
      else if (f.email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value)) errors.email = "Adresse e-mail invalide.";
      if (!f.message.value.trim()) errors.message = "Écrivez-nous quelques mots.";
      if (!f.consent.checked) errors.consent = "Merci d'accepter l'utilisation de vos données pour vous répondre.";
      $$(".field", form).forEach((el) => { const n = el.dataset.field; el.classList.toggle("is-error", !!errors[n]); const er = $(".field__err", el); if (er) er.textContent = errors[n] || ""; });
      const cErr = $("[data-err=consent]", form); if (cErr) cErr.textContent = errors.consent || "";
      if (Object.keys(errors).length) { SM.track("form_error", { form: "contact", fields: Object.keys(errors) }); return; }

      const lead = { form: "contact", name: f.name.value.trim(), email: f.email.value.trim(), phone: f.phone.value.trim(), type: sel.value, typeLabel: sel.options[sel.selectedIndex].text, look: f.look.value.trim(), date: f.date ? f.date.value : "", message: f.message.value.trim(), newsletter: f.newsletter.checked };
      const submit = $("[type=submit]", form), note = $(".form__note", form);
      submit.disabled = true;
      const saved = await SM.addLead(lead);
      submit.disabled = false;
      if (!saved) {
        note.innerHTML = `L'envoi n'a pas abouti. Réessayez dans un instant ou écrivez-nous sur <a href="${esc(waLink())}" target="_blank" rel="noopener" style="text-decoration:underline">WhatsApp</a>.`;
        note.style.color = "#a33";
        SM.track("form_error", { form: "contact", fields: ["envoi"] });
        return;
      }
      sent = true;
      SM.track("form_submit", { form: "contact", type: lead.type });
      SM.fire("lead", { type: lead.type });
      if (data.integrations.netlifyForms && /^https?:/.test(location.protocol)) {
        try { await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(form)).toString() }); } catch (err) { /* hors Netlify : la demande reste dans le back-office démo */ }
      }
      form.hidden = true;
      $(".form-ok").classList.add("is-on");
      $(".form-ok").scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function initNewsletter() {
    $$("[data-newsletter]").forEach((f) => f.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = f.email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { f.email.focus(); f.email.setAttribute("aria-invalid", "true"); return; }
      if (!(await SM.addLead({ form: "newsletter", email, type: "newsletter", typeLabel: "Inscription newsletter", newsletter: true }))) {
        f.email.setAttribute("aria-invalid", "true");
        f.email.value = ""; f.email.placeholder = "Échec de l'envoi, réessayez";
        return;
      }
      SM.track("form_submit", { form: "newsletter" });
      SM.fire("lead", { type: "newsletter" });
      if (data.integrations.netlifyForms && /^https?:/.test(location.protocol)) {
        try { await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ "form-name": "newsletter", email }).toString() }); } catch (err) { /* ignore */ }
      }
      f.innerHTML = `<p style="margin:0;padding:12px 0;font-style:italic;color:var(--gold-light)">Merci, votre inscription est enregistrée.</p>`;
    }));
  }

  /* ---------- panneau de détail d'un look ---------- */
  function openLook(id) {
    const l = SM.allLooks(data).find((x) => x.id === id);
    if (!l) return;
    const dr = $(".drawer");
    const imgs = [l.image, l.hoverImage].filter(Boolean);
    const main = l.video ? media(l.video, l.name) : l.image ? media(l.image, l.name) : ph("image", "Photo à fournir", l.brief);
    $(".drawer__media", dr).innerHTML = main + (imgs.length > 1 ? `<div class="drawer__thumbs">${imgs.map((src, i) => `<button class="${i === 0 ? "is-on" : ""}" data-src="${esc(SM.url(src))}" aria-label="Vue ${i + 1}"><img src="${esc(SM.url(src))}" alt=""></button>`).join("")}</div>` : "");
    $(".drawer__body", dr).innerHTML = `<button class="drawer__close" data-drawer-close aria-label="Fermer">×</button>
      <span class="eyebrow muted">${esc(l.collectionName || "")}${catName(l.categoryId) ? " · " + esc(catName(l.categoryId)) : ""}</span>
      <h2>${esc(l.name)}</h2>
      <p class="lead">${esc(l.description || "Description à compléter dans le back-office.")}</p>
      ${(l.details || []).length ? `<div class="chips">${l.details.map((d) => `<span class="chip">${esc(d)}</span>`).join("")}</div>` : ""}
      ${l.video ? "" : `<div style="margin:6px 0 8px">${badge("video", "Vidéo du look à intégrer", "Courte vidéo 5–8 s, mannequin en mouvement, format 2:3.").replace('class="ph-badge"', 'class="ph-badge ph-badge--light"')}</div>`}
      <div class="drawer__actions">
        ${btn("Demander ce modèle", `contact.html?look=${encodeURIComponent(l.name + " — " + (l.collectionName || ""))}`, "btn--solid")}
        ${btn("Échanger sur WhatsApp", waLink(`Bonjour, je suis intéressée par le modèle « ${l.name} » (${l.collectionName || ""}).`), "", 'target="_blank" rel="noopener" data-track="whatsapp"')}
      </div>
      <p class="drawer__note">Pièce réalisée sur mesure à l'atelier de Casablanca. Prix et délai sur demande.</p>`;
    $$(".drawer__thumbs button", dr).forEach((b) => b.addEventListener("click", () => {
      $$(".drawer__thumbs button", dr).forEach((x) => x.classList.toggle("is-on", x === b));
      const im = $(".drawer__media > img", dr); if (im) im.src = b.dataset.src;
    }));
    dr.classList.add("is-open"); dr.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    setTimeout(() => { const c = $(".drawer__close", dr); if (c) c.focus(); }, 300);
    SM.track("look_view", { look: l.name, collection: l.collectionName });
    SM.fire("view_look", { look: l.name });
  }
  function closeLook() {
    const dr = $(".drawer");
    dr.classList.remove("is-open"); dr.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
  }

  /* ---------- comportements ---------- */
  function initHeader() {
    const top = $(".site-top");
    const hasHero = !!$(".hero, .page-hero:not(.page-hero--light)");
    if (!hasHero) document.body.classList.add("no-hero");
    let lastY = scrollY, ticking = false;
    const update = () => {
      const y = scrollY;
      top.classList.toggle("is-solid", y > 40);
      const open = top.classList.contains("is-open");
      if (!open && y > 420 && y > lastY + 4) top.classList.add("is-hidden");
      else if (y < lastY - 4 || y < 420) top.classList.remove("is-hidden");
      document.body.classList.toggle("top-visible", !top.classList.contains("is-hidden"));
      lastY = y; ticking = false;
    };
    addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    update();

    // méga-menu
    const trigger = $("[data-mega]"), mega = $("#mega-collections"), veil = $(".mega-veil");
    let t;
    const open = () => { clearTimeout(t); mega.classList.add("is-open"); veil.classList.add("is-on"); top.classList.add("is-open"); trigger.setAttribute("aria-expanded", "true"); mega.setAttribute("aria-hidden", "false"); };
    const close = () => { t = setTimeout(() => { mega.classList.remove("is-open"); veil.classList.remove("is-on"); top.classList.remove("is-open"); trigger.setAttribute("aria-expanded", "false"); mega.setAttribute("aria-hidden", "true"); }, 160); };
    if (finePointer) {
      trigger.addEventListener("mouseenter", open);
      trigger.addEventListener("mouseleave", close);
      mega.addEventListener("mouseenter", () => clearTimeout(t));
      mega.addEventListener("mouseleave", close);
      $$(".hdr__link:not([data-mega])").forEach((a) => a.addEventListener("mouseenter", () => { clearTimeout(t); t = setTimeout(close, 0); }));
    }
    trigger.addEventListener("keydown", (e) => { if (e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); open(); const a = $("a", mega); if (a) a.focus(); } });
    mega.addEventListener("keydown", (e) => { if (e.key === "Escape") { close(); trigger.focus(); } });
    veil.addEventListener("click", close);
    $$(".mega__col a[data-img]", mega).forEach((a) => a.addEventListener("mouseenter", () => {
      if (!a.dataset.img) return;
      $$(".mega__preview img", mega).forEach((im) => im.classList.toggle("is-on", im.dataset.src === a.dataset.img));
    }));

    // menu mobile
    const mnav = $(".mnav");
    $("[data-mnav-open]").addEventListener("click", () => { mnav.classList.add("is-open"); mnav.setAttribute("aria-hidden", "false"); document.documentElement.style.overflow = "hidden"; });
    const mclose = () => { mnav.classList.remove("is-open"); mnav.setAttribute("aria-hidden", "true"); document.documentElement.style.overflow = ""; };
    $("[data-mnav-close]").addEventListener("click", mclose);
    $$("a", mnav).forEach((a) => a.addEventListener("click", mclose));
  }

  function initChapters() {
    const bar = $(".chapters");
    if (!bar) return;
    const sections = $$("[data-chapter]");
    if (!sections.length) { bar.remove(); return; }
    const list = $(".chapters__list", bar), now = $(".chapters__text", bar), count = $(".chapters__count", bar);
    list.innerHTML = sections.map((s, i) => `<li><a href="#${s.id}" data-to="${s.id}"><b>${String(i + 1).padStart(2, "0")}</b>${esc(s.dataset.chapter)}</a></li>`).join("");
    const prog = $(".chapters__progress i", bar), ticks = $(".chapters__ticks", bar);
    let current = -1, ticking = false;
    const geo = () => {
      const start = sections[0].offsetTop, end = sections[sections.length - 1].offsetTop + sections[sections.length - 1].offsetHeight - innerHeight;
      ticks.innerHTML = sections.map((s) => `<i style="left:${Math.max(0, Math.min(100, ((s.offsetTop - start) / Math.max(1, end - start)) * 100))}%"></i>`).join("");
      return { start, end };
    };
    let g = geo();
    const update = () => {
      const y = scrollY;
      prog.style.transform = `scaleX(${Math.max(0, Math.min(1, (y - g.start) / Math.max(1, g.end - g.start)))})`;
      let idx = 0;
      sections.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * 0.45) idx = i; });
      if (idx !== current) {
        current = idx;
        $$("a", list).forEach((a, i) => a.classList.toggle("is-active", i === idx));
        const active = $$("a", list)[idx];
        if (active) list.scrollTo({ left: active.offsetLeft - 20, behavior: "smooth" });
        now.style.opacity = 0;
        setTimeout(() => { now.textContent = sections[idx].dataset.chapterText || ""; now.style.opacity = 1; }, 200);
        count.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(sections.length).padStart(2, "0")}`;
      }
      ticking = false;
    };
    addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    addEventListener("resize", () => { g = geo(); update(); });
    addEventListener("load", () => { g = geo(); update(); });
    update();
  }

  function initRails() {
    $$("[data-rail]").forEach((r) => {
      const track = $(".rail__track", r), bar = $(".rail__line i", r);
      const upd = () => {
        const max = track.scrollWidth - track.clientWidth;
        const w = Math.max(0.12, track.clientWidth / track.scrollWidth);
        bar.style.width = w * 100 + "%";
        bar.style.transform = `translateX(${max > 0 ? (track.scrollLeft / max) * ((1 - w) / w) * 100 : 0}%)`;
      };
      track.addEventListener("scroll", upd, { passive: true });
      addEventListener("resize", upd); upd();
      $$(".rail__btn", r).forEach((b) => b.addEventListener("click", () => {
        const card = track.firstElementChild; const step = card ? card.getBoundingClientRect().width + 20 : 300;
        track.scrollBy({ left: step * Number(b.dataset.dir), behavior: "smooth" });
      }));
      // glisser à la souris
      let down = false, sx = 0, sl = 0, moved = false;
      track.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; });
      addEventListener("pointermove", (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 5) { moved = true; track.classList.add("is-drag"); } track.scrollLeft = sl - dx; });
      addEventListener("pointerup", () => { if (!down) return; down = false; track.classList.remove("is-drag"); });
      track.addEventListener("click", (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    });
  }

  function initLooks() {
    document.addEventListener("click", (e) => {
      const card = e.target.closest("button.look[data-look]");
      if (card) { openLook(card.dataset.look); return; }
      if (e.target.closest("[data-drawer-close]")) closeLook();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLook(); });
    // vidéo au survol (chargée au premier survol)
    $$(".look.has-video").forEach((card) => {
      const v = $("video", card);
      card.addEventListener("mouseenter", () => { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); });
      card.addEventListener("mouseleave", () => { v.pause(); v.currentTime = 0; });
    });
  }

  function initSavoirFaire() {
    const steps = $$("[data-sf]");
    if (!steps.length) return;
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const i = en.target.dataset.sf;
      steps.forEach((s) => s.classList.toggle("is-on", s === en.target));
      $$("[data-sf-img]").forEach((f) => f.classList.toggle("is-on", f.dataset.sfImg === i));
    }), { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach((s) => io.observe(s));
  }

  function initReveal() {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -12% 0px" });
    $$(".reveal, .mask, [data-timeline]").forEach((el) => io.observe(el));
  }

  function initCursor() {
    if (!finePointer) return;
    const c = $(".cursor"), label = $("b", c);
    let x = 0, y = 0, cx = 0, cy = 0, raf;
    const loop = () => { cx += (x - cx) * 0.2; cy += (y - cy) * 0.2; c.style.transform = `translate(${cx}px,${cy}px)`; raf = requestAnimationFrame(loop); };
    addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; if (!raf) loop(); });
    document.addEventListener("mouseover", (e) => {
      const t = e.target.closest("[data-cursor]");
      c.classList.toggle("is-on", !!t); c.classList.toggle("is-big", !!t);
      if (t) label.textContent = t.dataset.cursor;
    });
  }

  function initTracking() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest("[data-track]");
      if (a) { SM.track("click_" + a.dataset.track, { href: a.getAttribute("href") }); SM.fire(a.dataset.track); }
      const tel = e.target.closest('a[href^="tel:"]'); if (tel) SM.track("click_phone", {});
      const mail = e.target.closest('a[href^="mailto:"]'); if (mail) SM.track("click_email", {});
    });
  }

  /* ---------- cookies & traceurs (GA4, GTM, Meta Pixel, TikTok) ---------- */
  function loadScript(src) { const s = document.createElement("script"); s.async = true; s.src = src; document.head.appendChild(s); }
  let trackersLoaded = {};
  function loadTrackers(consent) {
    const it = data.integrations || {};
    if (!consent) return;
    if (consent.analytics && it.ga4 && !trackersLoaded.ga4) {
      trackersLoaded.ga4 = true;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { dataLayer.push(arguments); };
      gtag("js", new Date());
      gtag("config", it.ga4, { anonymize_ip: true });
      loadScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(it.ga4));
    }
    if (consent.analytics && it.gtm && !trackersLoaded.gtm) {
      trackersLoaded.gtm = true;
      window.dataLayer = window.dataLayer || [];
      dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      loadScript("https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(it.gtm));
    }
    if (consent.marketing && it.metaPixel && !trackersLoaded.meta) {
      trackersLoaded.meta = true;
      /* Code de base Meta Pixel */
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      fbq("init", it.metaPixel);
      fbq("track", "PageView");
    }
    if (consent.marketing && it.tiktokPixel && !trackersLoaded.tt) {
      trackersLoaded.tt = true;
      window.ttq = window.ttq || []; window.ttq.methods = ["page", "track", "identify"];
      ["page", "track"].forEach((m) => { window.ttq[m] = function () { window.ttq.push([m].concat([].slice.call(arguments))); }; });
      loadScript("https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=" + encodeURIComponent(it.tiktokPixel) + "&lib=ttq");
      window.ttq.page();
    }
  }
  /* Événements de conversion envoyés aux outils autorisés. */
  SM.fire = function (name, p) {
    const map = { lead: ["generate_lead", "Lead", "SubmitForm"], whatsapp: ["contact_whatsapp", "Contact", "Contact"], view_look: ["view_item", "ViewContent", "ViewContent"], form_start: ["form_start", null, null] };
    const m = map[name]; if (!m) return;
    try { if (window.gtag && m[0]) gtag("event", m[0], p || {}); } catch (e) {}
    try { if (window.dataLayer && m[0]) dataLayer.push(Object.assign({ event: m[0] }, p || {})); } catch (e) {}
    try { if (window.fbq && m[1]) fbq("track", m[1], p || {}); } catch (e) {}
    try { if (window.ttq && m[2]) ttq.track(m[2], p || {}); } catch (e) {}
  };

  function initCookies() {
    const box = $(".cookie");
    const inputs = $$("[data-consent]", box);
    const show = (custom) => {
      const c = SM.getConsent() || { analytics: false, marketing: false };
      inputs.forEach((i) => (i.checked = !!c[i.dataset.consent]));
      box.classList.toggle("is-custom", !!custom);
      $("[data-cookie=custom]", box).textContent = custom ? "Enregistrer mes choix" : "Personnaliser";
      box.classList.add("is-on");
    };
    const decide = (c) => {
      const first = !SM.getConsent();
      const res = SM.setConsent(c);
      box.classList.remove("is-on");
      loadTrackers(res);
      if (first && res.analytics) SM.track("pageview", { title: document.title });
    };
    box.addEventListener("click", (e) => {
      const b = e.target.closest("[data-cookie]"); if (!b) return;
      const k = b.dataset.cookie;
      if (k === "accept") decide({ analytics: true, marketing: true, choice: "accept" });
      else if (k === "refuse") decide({ analytics: false, marketing: false, choice: "refuse" });
      else if (k === "custom") {
        if (!box.classList.contains("is-custom")) show(true);
        else { const v = {}; inputs.forEach((i) => (v[i.dataset.consent] = i.checked)); v.choice = "custom"; decide(v); }
      }
    });
    document.addEventListener("click", (e) => { if (e.target.closest("[data-cookie-open]")) { e.preventDefault(); show(true); } });
    const c = SM.getConsent();
    if (!c) setTimeout(() => show(false), 1400);
    else loadTrackers(c);
  }

  function initButtons() {
    $$(".btn").forEach((b) => { if (!$(".fill", b)) b.insertAdjacentHTML("afterbegin", '<span class="fill"></span>'); });
  }

  function hideLoader() {
    const l = $(".loader");
    if (!l) return;
    try { sessionStorage.setItem("sm_loaded", "1"); } catch (e) {}
    setTimeout(() => l.classList.add("is-done"), document.documentElement.classList.contains("no-loader") ? 0 : 900);
  }

  /* ---------- démarrage ---------- */
  async function init() {
    await SM.ready();
    data = SM.getData(); S = data.settings;
    renderChrome();
    const pages = { home: renderHome, collections: renderCollections, collection: renderCollection, maison: renderMaison, evenements: renderEvents, contact: renderContact };
    if (pages[page]) pages[page]();
    initButtons(); initHeader(); initChapters(); initRails(); initLooks(); initSavoirFaire(); initReveal(); initCursor(); initTracking(); initNewsletter(); initCookies();
    if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) setTimeout(() => t.scrollIntoView(), 50); }
    SM.track("pageview", { title: document.title });
    hideLoader();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
