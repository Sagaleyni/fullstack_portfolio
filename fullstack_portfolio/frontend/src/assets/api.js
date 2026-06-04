// ============================================================
// assets/api.js — Service centralisé pour les appels API
// Toutes les fonctions qui parlent au backend sont ici
// ============================================================

// URL de base de l'API — en production Docker, c'est /api (via nginx)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── RÉCUPÉRER TOUS LES PROJETS ──────────────────────────────
export const fetchProjets = async () => {
  const reponse = await fetch(`${API_URL}/projets`);
  if (!reponse.ok) throw new Error("Impossible de charger les projets");
  return reponse.json(); // retourne le tableau de projets
};

// ─── RÉCUPÉRER UN PROJET ─────────────────────────────────────
export const fetchProjet = async (id) => {
  const reponse = await fetch(`${API_URL}/projets/${id}`);
  if (!reponse.ok) throw new Error("Projet introuvable");
  return reponse.json();
};

// ─── AJOUTER UN PROJET ───────────────────────────────────────
// On utilise FormData (pas JSON) car on envoie une image (fichier binaire)
export const ajouterProjet = async (formData) => {
  const reponse = await fetch(`${API_URL}/projets`, {
    method: "POST",
    // ⚠️ Pas de Content-Type ici ! fetch le définit automatiquement avec la boundary
    body: formData,
  });
  if (!reponse.ok) throw new Error("Erreur lors de l'ajout");
  return reponse.json();
};

// ─── MODIFIER UN PROJET ──────────────────────────────────────
export const modifierProjet = async (id, formData) => {
  const reponse = await fetch(`${API_URL}/projets/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!reponse.ok) throw new Error("Erreur lors de la modification");
  return reponse.json();
};

// ─── SUPPRIMER UN PROJET ─────────────────────────────────────
export const supprimerProjet = async (id) => {
  const reponse = await fetch(`${API_URL}/projets/${id}`, {
    method: "DELETE",
  });
  if (!reponse.ok) throw new Error("Erreur lors de la suppression");
  return reponse.json();
};

// ─── CONSTRUIRE L'URL D'UNE IMAGE ────────────────────────────
// Ex: "/uploads/image.jpg" → "http://localhost:5000/uploads/image.jpg"
export const imageUrl = (chemin) => {
  if (!chemin) return "/placeholder.jpg";
  if (chemin.startsWith("http")) return chemin; // déjà une URL complète
  const base = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace("/api", "");
  return `${base}${chemin}`;
};
