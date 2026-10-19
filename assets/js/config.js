/*
 * Configuration du site Samira Mhaidi.
 * URL et clé PUBLIQUE Supabase uniquement (elles sont visibles dans le navigateur, c'est prévu) :
 * la sécurité repose sur les règles RLS (docs/supabase-schema.sql).
 * Ne jamais mettre ici la clé secrète (service_role / sb_secret_…).
 *
 * Laisser supabaseUrl vide = mode démo (tout reste dans le navigateur).
 * Ajouter ?demo=1 à l'adresse force le mode démo pour un aperçu.
 */
window.SM_CONFIG = {
  supabaseUrl: "https://vhlakwmemusverhpjgxu.supabase.co",
  supabaseKey: "sb_publishable_yPuqqpW3-4A6xK3yDbONOQ_1y8Lkogu",
  mediaBucket: "media"
};
