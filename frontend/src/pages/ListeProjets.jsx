// ============================================================
// pages/ListeProjets.jsx — Page d'accueil : grille de projets
// ============================================================

import { useState, useEffect } from "react";
import CarteProjet from "../components/CarteProjet";
import { fetchProjets, supprimerProjet } from "../assets/api";

function ListeProjets() {
  // État local : tableau des projets chargés depuis l'API
  const [projets, setProjets] = useState([]);
  // État de chargement : true pendant que fetch est en cours
  const [chargement, setChargement] = useState(true);
  // État d'erreur : message si l'API ne répond pas
  const [erreur, setErreur] = useState("");

  // useEffect avec [] = s'exécute UNE SEULE FOIS au montage du composant
  // Équivalent de "componentDidMount" dans les classes React
  useEffect(() => {
    chargerProjets();
  }, []); // le tableau vide [] = pas de dépendances → une seule exécution

  // Fonction async : charge les projets depuis le backend
  const chargerProjets = async () => {
    try {
      setChargement(true);
      setErreur("");
      const data = await fetchProjets();
      setProjets(data); // met à jour l'état → React re-rend le composant
    } catch (err) {
      setErreur("Impossible de charger les projets. Vérifiez que le serveur tourne.");
    } finally {
      setChargement(false); // s'exécute toujours, succès ou erreur
    }
  };

  // Supprime un projet après confirmation
  const handleSupprimer = async (id) => {
    if (!confirm("Supprimer ce projet définitivement ?")) return;

    try {
      await supprimerProjet(id);
      // Mettre à jour l'état local sans recharger depuis le serveur
      // filter = crée un nouveau tableau sans l'élément supprimé
      setProjets((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  // ─── AFFICHAGE CONDITIONNEL ──────────────────────────────
  if (chargement) {
    return <div className="loading">Chargement des projets…</div>;
  }

  if (erreur) {
    return <div className="erreur">{erreur}</div>;
  }

  return (
    <div className="page">
      {/* En-tête de la page */}
      <div className="page-header">
        <h1 className="page-titre">Mes Projets</h1>
        <p className="page-sous-titre">{projets.length} projet(s)</p>
      </div>

      {/* Si aucun projet : message d'invitation */}
      {projets.length === 0 ? (
        <div className="vide">
          <p>Aucun projet pour l'instant.</p>
          <a href="/ajouter" className="btn btn-primary">
            Créer mon premier projet
          </a>
        </div>
      ) : (
        // Grille de cartes projet
        <div className="grille-projets">
          {/* .map() = transformer chaque projet en composant CarteProjet */}
          {projets.map((projet) => (
            <CarteProjet
              key={projet._id}        // key obligatoire pour les listes React
              projet={projet}          // passer le projet en prop
              onSupprimer={handleSupprimer} // passer la fonction en prop
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ListeProjets;
