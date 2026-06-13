import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { imageUrl } from "../assets/api";

function CarteProjet({ projet, onSupprimer }) {
  return (
    <div className="carte">
      <div className="carte-image">
        <img
          src={imageUrl(projet.image)}
          alt={projet.libelle}
          onError={(e) => {
            e.target.src = "https://placehold.co/400x220/1a1a2e/6c63ff?text=Projet";
          }}
        />
      </div>

      <div className="carte-body">
        <Link to={`/projet/${projet._id}`} className="carte-titre">
          {projet.libelle}
        </Link>

        <p className="carte-desc">
          {projet.description?.length > 100
            ? projet.description.slice(0, 100) + "…"
            : projet.description}
        </p>

        <div className="techno-list">
          {projet.technologies?.map((tech) => (
            <span key={tech} className="techno-badge">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="carte-footer">
        <Link to={`/projet/${projet._id}`} className="btn btn-outline">
          Voir détail
        </Link>
        <button
          className="btn btn-danger"
          onClick={() => onSupprimer(projet._id)}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}

// ─── PROPTYPES ────────────────────────────────────────────────
CarteProjet.propTypes = {
  projet: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    libelle: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
    technologies: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onSupprimer: PropTypes.func.isRequired,
};

export default CarteProjet;
