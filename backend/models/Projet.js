// ============================================================
// models/Projet.js — Schéma MongoDB via Mongoose
// Définit la structure d'un document "projet" dans la base
// ============================================================

const mongoose = require("mongoose");

// Un "Schema" = le plan / la structure d'un document
const projetSchema = new mongoose.Schema(
  {
    libelle: {
      type: String,
      required: [true, "Le libellé est obligatoire"], // validation automatique
      trim: true, // supprime les espaces avant/après
    },
    description: {
      type: String,
      required: [true, "La description est obligatoire"],
    },
    // tableau de strings : ["React", "Node.js", "MongoDB"]
    technologies: {
      type: [String],
      default: [],
    },
    image: {
      type: String, // on stocke le chemin de l'image, ex: "/uploads/image.jpg"
      default: "",
    },
    lienGithub: {
      type: String,
      default: "",
    },
    lienDemo: {
      type: String,
      default: "",
    },
  },
  {
    // timestamps: true ajoute automatiquement createdAt et updatedAt
    timestamps: true,
  }
);

// On crée le modèle "Projet" à partir du schéma
// Mongoose créera automatiquement une collection "projets" dans MongoDB
module.exports = mongoose.model("Projet", projetSchema);
