import { useState, useEffect } from "react";
import CarteProjet from "../components/CarteProjet";
import { fetchProjets, supprimerProjet } from "../assets/api";

function ListeProjets() {
  const [projets, setProjets] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    chargerProjets();
  }, []);

  const chargerProjets = async () => {
    try {
      setChargement(true);
      setErreur("");
      const data = await fetchProjets();
      setProjets(data);
    } catch (err) {
      setErreur("Impossible de charger les projets : " + err.message);
    } finally {
      setChargement(false);
    }
  };

  const handleSupprimer = async (id) => {
    if (!confirm("Supprimer ce projet définitivement ?")) return;
    try {
      await supprimerProjet(id);
      setProjets((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression : " + err.message);
    }
  };

  if (chargement) return <div className="loading">Chargement des projets…</div>;
  if (erreur) return <div className="erreur">{erreur}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-titre">Mes Projets</h1>
        <p className="page-sous-titre">{projets.length} projet(s)</p>
      </div>
      {projets.length === 0 ? (
        <div className="vide">
          <p>Aucun projet pour l'instant.</p>
          <a href="/ajouter" className="btn btn-primary">Créer mon premier projet</a>
        </div>
      ) : (
        <div className="grille-projets">
          {projets.map((projet) => (
            <CarteProjet
              key={projet._id}
              projet={projet}
              onSupprimer={handleSupprimer}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ListeProjets;
