// ============================================================
// routes/projets.js — Définition des routes de l'API
// Relie chaque URL + méthode HTTP à une fonction du controller
// ============================================================

const express = require("express");
const router = express.Router(); // sous-routeur Express
const multer = require("multer"); // middleware pour upload d'images
const path = require("path");
const fs = require("fs");

// ─── CONFIGURATION MULTER (upload d'images) ──────────────────
// Créer le dossier uploads s'il n'existe pas
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// diskStorage = stocker les fichiers sur le disque dur
const storage = multer.diskStorage({
  // destination : où stocker les fichiers
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  // filename : nom du fichier = timestamp + extension originale
  // ex: 1710000000000.jpg
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .jpg, .png, etc.
    cb(null, Date.now() + ext);
  },
});

// Filtre : accepter seulement les images
const fileFilter = (req, file, cb) => {
  const typesAcceptes = /jpeg|jpg|png|gif|webp/;
  const estValide = typesAcceptes.test(file.mimetype);
  if (estValide) {
    cb(null, true); // accepter le fichier
  } else {
    cb(new Error("Seules les images sont acceptées"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // taille max : 5 MB
});

// ─── IMPORT DU CONTROLLER ────────────────────────────────────
const {
  getTousProjets,
  getUnProjet,
  ajouterProjet,
  modifierProjet,
  supprimerProjet,
} = require("../controllers/projetsController");

// ─── DÉFINITION DES ROUTES ───────────────────────────────────
// Syntaxe : router.METHODE("chemin", middleware?, fonctionController)

// GET    /api/projets        → liste tous les projets
router.get("/", getTousProjets);

// GET    /api/projets/:id    → retourne un projet par son ID
router.get("/:id", getUnProjet);

// POST   /api/projets        → crée un nouveau projet (avec image)
// upload.single("image") = intercepte le champ "image" du formulaire
router.post("/", upload.single("image"), ajouterProjet);

// PUT    /api/projets/:id    → modifie un projet existant (avec image optionnelle)
router.put("/:id", upload.single("image"), modifierProjet);

// DELETE /api/projets/:id    → supprime un projet
router.delete("/:id", supprimerProjet);

module.exports = router;
