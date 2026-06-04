// ============================================================
// components/CarteProjet.jsx — Carte d'affichage d'un projet
// Utilisé dans la page ListeProjets pour chaque projet
// ============================================================

import { Link } from "react-router-dom";
import { imageUrl } from "../assets/api";

// Props reçues depuis le parent :
//   projet    → objet projet avec ses données
//   onSupprimer → fonction callback appelée lors du clic "Supprimer"
function CarteProjet({ projet, onSupprimer }) {
  return (
    <div className="carte">
      {/* Image du projet */}
      <div className="carte-image">
        <img
          src={imageUrl(projet.image)}
          alt={projet.libelle}
          onError={(e) => {
            // Si l'image ne charge pas, afficher un placeholder
            e.target.src = "https://placehold.co/400x220/1a1a2e/6c63ff?text=Projet";
          }}
        />
      </div>

      {/* Contenu textuel */}
      <div className="carte-body">
        {/* Libellé = lien vers la page de détail */}
        <Link to={`/projet/${projet._id}`} className="carte-titre">
          {projet.libelle}
        </Link>

        {/* Description tronquée */}
        <p className="carte-desc">
          {projet.description?.length > 100
            ? projet.description.slice(0, 100) + "…"
            : projet.description}
        </p>

        {/* Technologies sous forme de badges */}
        <div className="techno-list">
          {projet.technologies?.map((tech, i) => (
            // key = identifiant unique pour React lors d'un rendu de liste
            <span key={i} className="techno-badge">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="carte-footer">
        <Link to={`/projet/${projet._id}`} className="btn btn-outline">
          Voir détail
        </Link>
        <button
          className="btn btn-danger"
          // onClick appelle la fonction reçue en prop avec l'ID du projet
          onClick={() => onSupprimer(projet._id)}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default CarteProjet;
