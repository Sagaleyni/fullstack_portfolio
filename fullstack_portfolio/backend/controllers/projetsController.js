// ============================================================
// controllers/projetsController.js — Logique métier (CRUD)
// Chaque fonction correspond à une action sur les projets
// ============================================================

const Projet = require("../models/Projet");
const path = require("path");
const fs = require("fs");

// ─── GET TOUS ─────────────────────────────────────────────────
// Retourne la liste complète de tous les projets
// Route : GET /api/projets
const getTousProjets = async (req, res) => {
  try {
    // .find() sans argument = retourner TOUS les documents
    // .sort({ createdAt: -1 }) = du plus récent au plus ancien
    const projets = await Projet.find().sort({ createdAt: -1 });
    res.json(projets);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// ─── GET UN PROJET ────────────────────────────────────────────
// Retourne un seul projet par son ID
// Route : GET /api/projets/:id
const getUnProjet = async (req, res) => {
  try {
    // req.params.id = l'ID dans l'URL, ex: /api/projets/64abc123
    const projet = await Projet.findById(req.params.id);

    if (!projet) {
      // 404 = Not Found
      return res.status(404).json({ message: "Projet introuvable" });
    }

    res.json(projet);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// ─── POST AJOUTER ─────────────────────────────────────────────
// Crée et sauvegarde un nouveau projet
// Route : POST /api/projets
const ajouterProjet = async (req, res) => {
  try {
    // req.body contient les données envoyées par le frontend (JSON)
    const { libelle, description, technologies, lienGithub, lienDemo } = req.body;

    // Si une image a été uploadée via multer, req.file contient son info
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    // Créer une nouvelle instance du modèle
    const nouveauProjet = new Projet({
      libelle,
      description,
      // technologies peut arriver comme string "React,Node" → on split en tableau
      technologies: typeof technologies === "string"
        ? technologies.split(",").map((t) => t.trim()).filter(Boolean)
        : technologies || [],
      image,
      lienGithub: lienGithub || "",
      lienDemo: lienDemo || "",
    });

    // .save() envoie le document dans MongoDB
    const projetSauvegarde = await nouveauProjet.save();

    // 201 = Created (ressource créée avec succès)
    res.status(201).json(projetSauvegarde);
  } catch (err) {
    // 400 = Bad Request (données invalides)
    res.status(400).json({ message: "Données invalides", error: err.message });
  }
};

// ─── PUT MODIFIER ─────────────────────────────────────────────
// Met à jour un projet existant
// Route : PUT /api/projets/:id
const modifierProjet = async (req, res) => {
  try {
    const { libelle, description, technologies, lienGithub, lienDemo } = req.body;

    // Préparer les données à mettre à jour
    const miseAJour = {
      libelle,
      description,
      technologies: typeof technologies === "string"
        ? technologies.split(",").map((t) => t.trim()).filter(Boolean)
        : technologies || [],
      lienGithub: lienGithub || "",
      lienDemo: lienDemo || "",
    };

    // Si une nouvelle image est uploadée
    if (req.file) {
      miseAJour.image = `/uploads/${req.file.filename}`;
    }

    // findByIdAndUpdate : cherche ET met à jour en une seule opération
    // { new: true } = retourner le document APRÈS modification
    const projetModifie = await Projet.findByIdAndUpdate(
      req.params.id,
      miseAJour,
      { new: true, runValidators: true }
    );

    if (!projetModifie) {
      return res.status(404).json({ message: "Projet introuvable" });
    }

    res.json(projetModifie);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la modification", error: err.message });
  }
};

// ─── DELETE SUPPRIMER ─────────────────────────────────────────
// Supprime un projet par son ID
// Route : DELETE /api/projets/:id
const supprimerProjet = async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id);

    if (!projet) {
      return res.status(404).json({ message: "Projet introuvable" });
    }

    // Supprimer l'image du disque si elle existe
    if (projet.image) {
      const cheminImage = path.join(__dirname, "..", projet.image);
      if (fs.existsSync(cheminImage)) {
        fs.unlinkSync(cheminImage); // suppression synchrone du fichier
      }
    }

    await Projet.findByIdAndDelete(req.params.id);

    res.json({ message: "Projet supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// On exporte toutes les fonctions pour les utiliser dans routes/projets.js
module.exports = {
  getTousProjets,
  getUnProjet,
  ajouterProjet,
  modifierProjet,
  supprimerProjet,
};
