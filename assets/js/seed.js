/*
 * Données initiales du site Samira Mhaidi (V1 — maquette).
 * Le back-office (/admin) modifie une copie de ces données. En mode démo, la copie
 * est stockée dans le navigateur. En V2, la même structure sera stockée dans Supabase
 * (voir docs/supabase-schema.sql).
 *
 * Champ vide ("") pour une image ou une vidéo = le site affiche un bloc vide annoté
 * qui décrit le visuel attendu (champ "brief").
 */
window.SM_SEED = {
  version: 1,

  settings: {
    brand: "Samira Mhaidi",
    tagline: "Haute Couture Marocaine",
    phone: "+212 6 63 01 52 89",
    whatsapp: "212663015289",
    email: "samira.mhaidi@gmail.com",
    address: "167, boulevard Yacoub El Mansour, 1er étage n°4",
    city: "Casablanca, Maroc",
    mapsQuery: "167 Bd Yacoub El Mansour, Casablanca 20250",
    hours: "Sur rendez-vous · du lundi au samedi",
    socials: { instagram: "", facebook: "", linkedin: "", tiktok: "" },

    announcement: {
      enabled: true,
      speed: 38,
      messages: [
        "Rendez-vous privés ouverts à l'atelier de Casablanca",
        "Créations sur mesure · délai de confection de 8 à 12 semaines",
        "Nouvelle collection Haute Couture 2026 — bientôt dévoilée",
        "Expédition internationale sur demande"
      ]
    },

    hero: {
      eyebrow: "Haute Couture · Casablanca",
      title: "L'Âme du Caftan",
      subtitle: "Des pièces uniques brodées à la main, entre héritage marocain et regard contemporain.",
      cta: "Découvrir la collection",
      ctaLink: "collection.html?c=l-ame-du-caftan",
      video: "",
      poster: "assets/img/hero-porte-doree.jpg",
      brief: "Film d'ouverture 15–20 s en boucle, sans son : défilé ou mouvement de tissu, lumière dorée. MP4 H.264 · 1920×1080 · moins de 8 Mo."
    },

    chapters: [
      { id: "collection", label: "La Collection", text: "Les silhouettes de la saison, look après look." },
      { id: "defile", label: "Le Défilé", text: "La collection en mouvement, sur le podium." },
      { id: "savoir-faire", label: "Savoir-faire", text: "Sfifa, aâkad, randa : les gestes de l'atelier." },
      { id: "maison", label: "La Maison", text: "Samira Mhaidi, créatrice et directrice artistique." },
      { id: "evenements", label: "Événements", text: "Podiums, rencontres et engagements." },
      { id: "rendez-vous", label: "Rendez-vous", text: "Une consultation privée à l'atelier." }
    ],

    savoirFaire: [
      { title: "La sfifa", text: "Ganse tressée à la main qui souligne l'encolure, le devant et les manches. Elle dessine la structure du caftan et en signe la finesse.", image: "assets/img/detail-rose-poudre.jpg" },
      { title: "Les aâkad", text: "Boutons de passementerie noués un à un. Sur une pièce de cérémonie, on en compte plusieurs dizaines, alignés avec précision.", image: "assets/img/detail-dentelle-citron.jpg" },
      { title: "La broderie", text: "Fil d'or, perles, sequins et pierres posés à l'aiguille. Chaque motif floral est pensé pour accrocher la lumière.", image: "assets/img/look-corail-or.jpg" },
      { title: "Le sur-mesure", text: "Prise de mesures, choix des étoffes et essayages à l'atelier : chaque pièce est ajustée à la silhouette de celle qui la porte.", image: "", brief: "Photo ou vidéo d'atelier : mains de brodeuse, essayage, tissus. Format portrait 4:5, 1600 px minimum." }
    ],

    biography: {
      short: "Licenciée en littérature anglaise, Samira Mhaidi se tourne vers la mode et sort diplômée du Collège LaSalle de Montréal. Depuis, elle porte le caftan marocain sur les podiums du monde entier.",
      long: [
        "Samira Mhaidi, licenciée en littérature anglaise, s'est tournée vers la mode, conquise par le monde du stylisme. Diplômée du Collège LaSalle de Montréal, elle marque le début de cette aventure en représentant le monde arabe au défilé international « Hempel Award » en Chine.",
        "En 2007, elle est consacrée Jeune Talent à Caftan, avant une prestation remarquée lors de la Semaine de la femme arabe à Montréal en 2008. Habituée des podiums prestigieux, elle livre aujourd'hui une haute couture arrivée à pleine maturité.",
        "Depuis, l'aventure se poursuit avec de nombreuses créations et défilés : l'Arab Fashion Amsterdam en 2012, le défilé de l'ambassade du Maroc à Beyrouth en 2016 ou encore la Fashion Week d'Istanbul en 2017. Fidèle à ses origines, Samira Mhaidi continue de montrer le caftan marocain dans toute sa splendeur."
      ],
      portrait: "assets/img/portrait-samira.jpg"
    },

    timeline: [
      { year: "—", title: "Hempel Award, Chine", text: "Représente le monde arabe au défilé international." },
      { year: "2007", title: "Jeune Talent Caftan", text: "Consacrée Jeune Talent lors de l'événement Caftan." },
      { year: "2008", title: "Semaine de la femme arabe", text: "Défilé remarqué à Montréal." },
      { year: "2012", title: "Arab Fashion Amsterdam", text: "Présentation de ses créations aux Pays-Bas." },
      { year: "2016", title: "Ambassade du Maroc, Beyrouth", text: "Défilé officiel au Liban." },
      { year: "2017", title: "Fashion Week d'Istanbul", text: "Le caftan marocain sur le podium turc." }
    ]
  },

  integrations: {
    ga4: "",
    gtm: "",
    metaPixel: "",
    tiktokPixel: "",
    supabaseUrl: "",
    supabaseAnonKey: "",
    netlifyForms: false
  },

  categories: [
    { id: "cat-caftan", name: "Caftan", slug: "caftan", description: "Pièce d'une seule couche, emblème de la haute couture marocaine." },
    { id: "cat-takchita", name: "Takchita", slug: "takchita", description: "Deux pièces superposées et ceinturées, pour les grandes cérémonies." },
    { id: "cat-mariee", name: "Mariée & cérémonie", slug: "mariee", description: "Tenues de mariage et de fiançailles réalisées sur mesure." },
    { id: "cat-defile", name: "Pièces de défilé", slug: "defile", description: "Créations d'exception présentées sur les podiums." }
  ],

  collections: [
    {
      id: "col-2026", slug: "haute-couture-2026", name: "Haute Couture 2026", year: "2026", season: "Automne-Hiver",
      status: "upcoming", order: 0, categoryId: "",
      cover: "", coverBrief: "Visuel de campagne 2026 (paysage 16:9, 2400 px) : à fournir après le shooting.",
      heroVideo: "", heroVideoBrief: "Teaser de la collection 2026, 10–15 s, boucle sans son.",
      teaser: "La prochaine collection de la Maison, actuellement en préparation à l'atelier.",
      story: "Nom, thème et récit de la collection à confirmer avec la créatrice.",
      looks: [
        { id: "lk-2026-1", name: "Look 01", image: "", brief: "Photo studio pleine silhouette, fond uni, format 2:3.", video: "", categoryId: "", description: "", details: [] },
        { id: "lk-2026-2", name: "Look 02", image: "", brief: "Photo studio pleine silhouette, fond uni, format 2:3.", video: "", categoryId: "", description: "", details: [] },
        { id: "lk-2026-3", name: "Look 03", image: "", brief: "Gros plan broderie, format 2:3.", video: "", categoryId: "", description: "", details: [] }
      ]
    },
    {
      id: "col-ame", slug: "l-ame-du-caftan", name: "L'Âme du Caftan", year: "2023", season: "Défilé",
      status: "published", order: 1, categoryId: "cat-defile",
      cover: "assets/img/look-emeraude-defile.jpg",
      heroVideo: "", heroVideoBrief: "Extrait du défilé L'Âme du Caftan : passage des mannequins, 15–20 s.",
      teaser: "Une collection de podium aux couleurs franches : émeraude, pourpre et or.",
      story: "Pensée pour le podium, L'Âme du Caftan célèbre la richesse des broderies marocaines. Couleurs franches, ceintures d'orfèvre et étoffes fluides : chaque silhouette raconte une facette du caftan.",
      looks: [
        { id: "lk-ame-1", name: "Émeraude couronnée", image: "assets/img/look-emeraude-defile.jpg", video: "", categoryId: "cat-takchita", description: "Takchita émeraude brodée de fleurs fuchsia et or, ceinture d'orfèvre.", details: ["Broderie main", "Fil d'or", "Ceinture mdamma"], featured: true },
        { id: "lk-ame-2", name: "Bleu Majorelle", image: "assets/img/look-majorelle-defile.jpg", video: "", categoryId: "cat-defile", description: "Bleu Majorelle entièrement travaillé de broderies dorées en éventail.", details: ["Broderie or", "Traîne fluide"], featured: true },
        { id: "lk-ame-3", name: "Ivoire & or", image: "assets/img/runway-ivoire-or.jpg", video: "", categoryId: "cat-mariee", description: "Brocart ivoire, plastron brodé or et rose poudré.", details: ["Brocart", "Broderie perlée"] },
        { id: "lk-ame-4", name: "Jardin fleuri", image: "assets/img/runway-jardin-fleuri.jpg", video: "", categoryId: "cat-takchita", description: "Imprimé floral et dessous framboise satiné, parure amazighe.", details: ["Imprimé floral", "Satin"] },
        { id: "lk-ame-5", name: "Émeraude brodée", image: "assets/img/runway-emeraude.jpg", video: "", categoryId: "cat-takchita", description: "Vert profond, broderies multicolores et ganse émeraude.", details: ["Broderie couleur", "Sfifa"] },
        { id: "lk-ame-6", name: "Pourpre", image: "assets/img/runway-pourpre.jpg", video: "", categoryId: "cat-defile", description: "Pourpre et turquoise, broderies fleuries sur toute la longueur.", details: ["Broderie florale"] },
        { id: "lk-ame-7", name: "Cape ivoire", image: "assets/img/runway-cape-ivoire.jpg", video: "", categoryId: "cat-mariee", description: "Manches cape et broderies dorées sur mousseline ivoire.", details: ["Mousseline", "Manches cape"] },
        { id: "lk-ame-8", name: "Nuit bleue", image: "assets/img/runway-bleu-or.jpg", video: "", categoryId: "cat-defile", description: "Bleu nuit et or, broderie en écailles.", details: ["Broderie or"] }
      ]
    },
    {
      id: "col-cheerful", slug: "cheerful-harmony", name: "Cheerful Harmony", year: "2023", season: "Collection",
      status: "published", order: 2, categoryId: "cat-caftan",
      cover: "assets/img/detail-dentelle-citron.jpg",
      heroVideo: "", heroVideoBrief: "Coulisses du shooting Cheerful Harmony, 10–15 s.",
      teaser: "Des couleurs solaires, des dentelles et des broderies florales en relief.",
      story: "Cheerful Harmony joue la gaieté : vert anis, corail, bleu roi et rose poudré, rehaussés de dentelles et de broderies florales en relief. Une collection lumineuse, pensée pour les fêtes et les cérémonies.",
      looks: [
        { id: "lk-ch-1", name: "Dentelle citron", image: "assets/img/detail-dentelle-citron.jpg", video: "", categoryId: "cat-caftan", description: "Dentelle de Calais citron et broderie florale en relief.", details: ["Dentelle", "Perles", "Sequins"], featured: true },
        { id: "lk-ch-2", name: "Lamé anis", image: "assets/img/look-citron-lame.jpg", hoverImage: "assets/img/look-citron-lame-pied.jpg", video: "", categoryId: "cat-caftan", description: "Lamé vert anis, plastron brodé de fil doré.", details: ["Lamé", "Broderie or"] },
        { id: "lk-ch-3", name: "Corail", image: "assets/img/look-corail-or.jpg", hoverImage: "assets/img/look-corail-profil.jpg", video: "", categoryId: "cat-takchita", description: "Crêpe corail, rinceaux dorés brodés sur toute la longueur.", details: ["Crêpe", "Broderie or"], featured: true },
        { id: "lk-ch-4", name: "Bleu roi", image: "assets/img/look-bleu-roi.jpg", video: "", categoryId: "cat-caftan", description: "Mousseline bleu roi, broderies perlées et pierres.", details: ["Mousseline", "Pierres"] },
        { id: "lk-ch-5", name: "Rose poudré", image: "assets/img/look-rose-nuit.jpg", hoverImage: "assets/img/detail-rose-poudre.jpg", video: "", categoryId: "cat-caftan", description: "Rose poudré, aâkad et broderie florale pastel.", details: ["Aâkad", "Perles"], featured: true },
        { id: "lk-ch-6", name: "Léopard", image: "assets/img/look-leopard.jpg", video: "", categoryId: "cat-caftan", description: "Imprimé léopard et ceinture brodée, une lecture moderne du caftan.", details: ["Imprimé", "Ceinture brodée"] }
      ]
    },
    {
      id: "col-fresh", slug: "fresh-joy", name: "Fresh Joy", year: "2022", season: "Collection",
      status: "published", order: 3, categoryId: "cat-takchita",
      cover: "assets/img/hero-porte-doree.jpg",
      heroVideo: "", heroVideoBrief: "Film « Fresh Joy Collection by Samira Mhaidi » (vidéo de l'ancien site) à récupérer en MP4.",
      teaser: "Pastels et fils d'or, photographiés devant les portes dorées.",
      story: "Fresh Joy mêle tons pastel, brocarts et broderies d'or. Photographiée devant les portes dorées et les moucharabiehs, la collection rend hommage à l'architecture marocaine.",
      looks: [
        { id: "lk-fj-1", name: "Porte dorée", image: "assets/img/look-ciel-porte-doree.jpg", hoverImage: "assets/img/hero-porte-doree.jpg", video: "", categoryId: "cat-mariee", description: "Bleu ciel imprimé de fleurs, sfifa et broderies dorées.", details: ["Soie imprimée", "Sfifa or"], featured: true },
        { id: "lk-fj-2", name: "Ivoire impérial", image: "assets/img/look-ivoire-or.jpg", video: "", categoryId: "cat-mariee", description: "Ivoire et galons dorés, coiffe d'orfèvre.", details: ["Galons or", "Crêpe ivoire"] },
        { id: "lk-fj-3", name: "Fuchsia", image: "assets/img/look-fuchsia.jpg", video: "", categoryId: "cat-caftan", description: "Velours fuchsia et médaillons brodés or.", details: ["Velours", "Broderie or"] },
        { id: "lk-fj-4", name: "Turquoise", image: "assets/img/look-turquoise-moucharabieh.jpg", video: "", categoryId: "cat-takchita", description: "Turquoise brodé de fleurs, dessous ornemental.", details: ["Broderie florale"] },
        { id: "lk-fj-5", name: "Rose sequins", image: "assets/img/look-rose-sequins.jpg", video: "", categoryId: "cat-caftan", description: "Rose tendre, motifs sequins argentés.", details: ["Sequins"] },
        { id: "lk-fj-6", name: "Menthe brocart", image: "assets/img/look-menthe-brocart.jpg", video: "", categoryId: "cat-takchita", description: "Brocart menthe, broderies dorées en relief.", details: ["Brocart", "Relief"] },
        { id: "lk-fj-7", name: "Sable fleuri", image: "assets/img/look-sable-fleuri.jpg", video: "", categoryId: "cat-caftan", description: "Mousseline sable, fleurs brodées en relief.", details: ["Mousseline", "Perles"] },
        { id: "lk-fj-8", name: "Aqua & corail", image: "assets/img/look-lanterne-aqua.jpg", hoverImage: "assets/img/look-lanterne.jpg", video: "", categoryId: "cat-takchita", description: "Aqua imprimé et broderie corail, sfifa perlée.", details: ["Imprimé", "Sfifa perlée"] }
      ]
    }
  ],

  catalogues: [
    { id: "cat-lookbook-2023", slug: "lookbook-2023", name: "Lookbook 2023", description: "Sélection des pièces phares de la saison 2023.", pdf: "", pdfBrief: "Lookbook PDF (A4, 20 pages max) à fournir.", lookIds: ["lk-ame-1", "lk-ame-2", "lk-ch-1", "lk-ch-3", "lk-ch-5", "lk-fj-1"] },
    { id: "cat-ceremonie", slug: "ceremonies-mariage", name: "Cérémonies & Mariage", description: "Pièces pensées pour le mariage, les fiançailles et la henné.", pdf: "", pdfBrief: "Catalogue mariage PDF à fournir.", lookIds: ["lk-ame-3", "lk-ame-7", "lk-fj-1", "lk-fj-2"] }
  ],

  events: [
    { id: "ev-ancmm", title: "Association Nationale des Créateurs Marocains de Mode", type: "Exposition", date: "", dateLabel: "Date à confirmer", place: "Casablanca", cover: "assets/img/event-photocall-ancmm.jpg", text: "Exposition des créations de la Maison aux côtés des créateurs de l'ANCMM.", gallery: ["assets/img/event-photocall-ancmm.jpg"] },
    { id: "ev-conference", title: "Conférence ANCMM", type: "Conférence", date: "", dateLabel: "Date à confirmer", place: "Casablanca", cover: "assets/img/event-conference-parole.jpg", text: "Table ronde sur la création marocaine et l'avenir du caftan.", gallery: ["assets/img/event-conference.jpg", "assets/img/event-conference-parole.jpg", "assets/img/event-intervention.jpg"] },
    { id: "ev-rencontre", title: "Rencontre & présentation", type: "Rencontre", date: "", dateLabel: "Date à confirmer", place: "Maroc", cover: "assets/img/event-invitees-caftan.jpg", text: "Présentation de pièces de la Maison portées par ses invitées.", gallery: ["assets/img/event-invitees-caftan.jpg"] },
    { id: "ev-film", title: "Fresh Joy Collection by Samira Mhaidi", type: "Film", date: "", dateLabel: "2022", place: "", cover: "", video: "", brief: "Film de la collection Fresh Joy (présent sur l'ancien site) : récupérer le fichier MP4 d'origine.", text: "Le film de la collection Fresh Joy." }
  ],

  media: []
};
