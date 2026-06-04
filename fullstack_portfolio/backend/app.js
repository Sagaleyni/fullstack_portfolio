// ============================================================
// app.js — Point d'entrée du serveur Express
// C'est le fichier qu'on lance avec : node app.js
// ============================================================

// dotenv charge les variables du fichier .env dans process.env
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

// Création de l'application Express
const app = express();

// ─── MIDDLEWARES ─────────────────────────────────────────────
// Un middleware = une fonction qui s'exécute avant chaque requête

// Permet de recevoir du JSON dans le corps des requêtes (req.body)
app.use(express.json());

// CORS = autoriser le frontend (React sur port 5173) à parler au backend (port 5000)
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Servir les images uploadées : GET /uploads/image.jpg => fichier sur disque
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── ROUTES ──────────────────────────────────────────────────
// On branche le fichier des routes sur le préfixe /api/projets
app.use("/api/projets", require("./routes/projets"));

// Route de test pour vérifier que le serveur fonctionne
app.get("/", (req, res) => {
  res.json({ message: "API Portfolio opérationnelle ✅", version: "1.0.0" });
});

// ─── CONNEXION MONGODB ────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/portfolio";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connecté à MongoDB");
    // On démarre le serveur seulement APRÈS la connexion à la base
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur MongoDB :", err.message);
    process.exit(1); // Quitter si la DB n'est pas accessible
  });
