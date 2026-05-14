// ============================================================
// pages/ModifierProjet.jsx — Formulaire de modification
// Pré-remplit le formulaire avec les données existantes du projet
// ============================================================

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProjet, modifierProjet, imageUrl } from "../assets/api";

function ModifierProjet() {
  const { id } = useParams(); // ID dans l'URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    libelle: "",
    description: "",
    technologies: "",
    lienGithub: "",
    lienDemo: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [imageActuelle, setImageActuelle] = useState("");
  const [chargement, setChargement] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  // Charger les données du projet pour pré-remplir le formulaire
  useEffect(() => {
    const charger = async () => {
      try {
        const projet = await fetchProjet(id);
        // Pré-remplir le formulaire avec les valeurs existantes
        setForm({
          libelle: projet.libelle || "",
          description: projet.description || "",
          // Rejoindre le tableau de technologies en chaîne
          technologies: projet.technologies?.join(", ") || "",
          lienGithub: projet.lienGithub || "",
          lienDemo: projet.lienDemo || "",
        });
        setImageActuelle(projet.image || "");
      } catch {
        setErreur("Impossible de charger le projet");
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const fichier = e.target.files[0];
    if (!fichier) return;
    setImageFile(fichier);
    setPreview(URL.createObjectURL(fichier));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnvoi(true);
    setErreur("");

    try {
      const formData = new FormData();
      formData.append("libelle", form.libelle);
      formData.append("description", form.description);
      formData.append("technologies", form.technologies);
      formData.append("lienGithub", form.lienGithub);
      formData.append("lienDemo", form.lienDemo);
      if (imageFile) {
        formData.append("image", imageFile); // nouvelle image seulement si choisie
      }

      await modifierProjet(id, formData);
      navigate(`/projet/${id}`); // retourner au détail du projet
    } catch (err) {
      setErreur("Erreur : " + err.message);
    } finally {
      setEnvoi(false);
    }
  };

  if (chargement) return <div className="loading">Chargement…</div>;

  return (
    <div className="page form-page">
      <h1 className="page-titre">Modifier le projet</h1>

      <form onSubmit={handleSubmit} className="formulaire">
        {erreur && <div className="erreur">{erreur}</div>}

        <div className="champ">
          <label>Libellé *</label>
          <input name="libelle" type="text" value={form.libelle} onChange={handleChange} required />
        </div>

        <div className="champ">
          <label>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} required />
        </div>

        <div className="champ">
          <label>Technologies</label>
          <input name="technologies" type="text" value={form.technologies} onChange={handleChange} />
        </div>

        <div className="champ">
          <label>Image (laisser vide pour garder l'actuelle)</label>
          {/* Afficher l'image actuelle si pas de nouvelle sélection */}
          {imageActuelle && !preview && (
            <img src={imageUrl(imageActuelle)} alt="Image actuelle" className="image-preview" />
          )}
          {preview && <img src={preview} alt="Nouvelle image" className="image-preview" />}
          <input type="file" accept="image/*" onChange={handleImage} />
        </div>

        <div className="champ">
          <label>Lien GitHub</label>
          <input name="lienGithub" type="url" value={form.lienGithub} onChange={handleChange} />
        </div>

        <div className="champ">
          <label>Lien Démo</label>
          <input name="lienDemo" type="url" value={form.lienDemo} onChange={handleChange} />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate(`/projet/${id}`)}>
            Annuler
          </button>
          <button type="submit" className="btn btn-primary" disabled={envoi}>
            {envoi ? "Enregistrement…" : "Sauvegarder"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ModifierProjet;
