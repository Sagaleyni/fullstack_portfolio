// ============================================================
// pages/DetaillerProjet.jsx — Affiche toutes les infos d'un projet
// ============================================================

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchProjet, supprimerProjet, imageUrl } from "../assets/api";

function DetaillerProjet() {
  // useParams() récupère les paramètres de la route
  // Ex: URL "/projet/64abc123" → params.id = "64abc123"
  const { id } = useParams();

  // useNavigate() permet de naviguer par code (sans clic sur un lien)
  const navigate = useNavigate();

  const [projet, setProjet] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  // Charger le projet quand l'ID change dans l'URL
  useEffect(() => {
    const charger = async () => {
      try {
        const data = await fetchProjet(id);
        setProjet(data);
      } catch (err) {
        setErreur("Projet introuvable");
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, [id]); // [id] = re-exécuter si l'ID dans l'URL change

  const handleSupprimer = async () => {
    if (!confirm("Supprimer ce projet ?")) return;
    try {
      await supprimerProjet(id);
      navigate("/"); // rediriger vers l'accueil après suppression
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  if (chargement) return <div className="loading">Chargement…</div>;
  if (erreur) return <div className="erreur">{erreur}</div>;
  if (!projet) return null;

  return (
    <div className="page detail-page">
      {/* Bouton retour */}
      <Link to="/" className="btn-retour">
        ← Retour aux projets
      </Link>

      <div className="detail-container">
        {/* Image grande taille */}
        <div className="detail-image">
          <img
            src={imageUrl(projet.image)}
            alt={projet.libelle}
            onError={(e) => {
              e.target.src = "https://placehold.co/800x400/1a1a2e/6c63ff?text=Projet";
            }}
          />
        </div>

        {/* Informations */}
        <div className="detail-info">
          <h1 className="detail-titre">{projet.libelle}</h1>

          {/* Description dans un paragraphe */}
          <p className="detail-desc">{projet.description}</p>

          {/* Technologies : liste ordonnée */}
          {projet.technologies?.length > 0 && (
            <div className="detail-techno">
              <h3>Technologies utilisées</h3>
              <ol className="techno-ordonnee">
                {projet.technologies.map((tech, i) => (
                  <li key={i}>{tech}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Liens externes */}
          <div className="detail-liens">
            {projet.lienGithub && (
              <a href={projet.lienGithub} target="_blank" rel="noreferrer" className="btn btn-outline">
                GitHub →
              </a>
            )}
            {projet.lienDemo && (
              <a href={projet.lienDemo} target="_blank" rel="noreferrer" className="btn btn-outline">
                Démo →
              </a>
            )}
          </div>

          {/* Actions */}
          <div className="detail-actions">
            <Link to={`/modifier/${projet._id}`} className="btn btn-primary">
              Éditer
            </Link>
            <button onClick={handleSupprimer} className="btn btn-danger">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetaillerProjet;
