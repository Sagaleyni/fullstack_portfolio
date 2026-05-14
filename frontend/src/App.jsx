// ============================================================
// App.jsx — Composant racine : configure le routage
// Chaque <Route> associe une URL à une page (composant)
// ============================================================

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ListeProjets from "./pages/ListeProjets";
import DetaillerProjet from "./pages/DetaillerProjet";
import AjouterProjet from "./pages/AjouterProjet";
import ModifierProjet from "./pages/ModifierProjet";

function App() {
  return (
    // BrowserRouter active la navigation sans rechargement de page
    <BrowserRouter>
      {/* Navbar est toujours visible, quelle que soit la page */}
      <Navbar />

      {/* Routes : affiche la page correspondant à l'URL courante */}
      <main className="main-content">
        <Routes>
          {/* "/" → liste de tous les projets (page d'accueil) */}
          <Route path="/" element={<ListeProjets />} />

          {/* "/projet/64abc123" → détail d'un projet (l'ID vient de MongoDB) */}
          <Route path="/projet/:id" element={<DetaillerProjet />} />

          {/* "/ajouter" → formulaire d'ajout */}
          <Route path="/ajouter" element={<AjouterProjet />} />

          {/* "/modifier/64abc123" → formulaire de modification */}
          <Route path="/modifier/:id" element={<ModifierProjet />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
