// ============================================================
// main.jsx — Point d'entrée de l'application React
// C'est ici que React "monte" l'application dans le DOM HTML
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // styles globaux

// On cible le <div id="root"> dans index.html
// createRoot = la façon moderne de démarrer React (React 18+)
ReactDOM.createRoot(document.getElementById("root")).render(
  // StrictMode = affiche des avertissements utiles en développement
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
