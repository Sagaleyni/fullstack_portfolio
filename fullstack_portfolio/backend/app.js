require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("node:path");

const app = express();

// ─── SÉCURITÉ : masquer la version Express dans les headers ──
// Sans ça, Express envoie "X-Powered-By: Express" → révèle la stack
app.disable("x-powered-by");

// ─── MIDDLEWARES ─────────────────────────────────────────────
app.use(express.json());

// CORS restrictif : on liste explicitement les origines autorisées
const originesAutorisees = (process.env.FRONTEND_URL || "http://localhost")
  .split(",")
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origin (curl, Postman, apps mobiles)
    if (!origin) return callback(null, true);
    if (originesAutorisees.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origine non autorisée par CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Servir les images uploadées
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── ROUTES ──────────────────────────────────────────────────
app.use("/api/projets", require("./routes/projets"));

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
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur MongoDB :", err.message);
    process.exit(1);
  });
