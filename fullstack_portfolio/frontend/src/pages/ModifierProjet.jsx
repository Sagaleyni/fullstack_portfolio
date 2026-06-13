import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProjet, modifierProjet, imageUrl } from "../assets/api";

function ModifierProjet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    libelle: "", description: "", technologies: "", lienGithub: "", lienDemo: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [imageActuelle, setImageActuelle] = useState("");
  const [chargement, setChargement] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const charger = async () => {
      try {
        const projet = await fetchProjet(id);
        setForm({
          libelle: projet.libelle || "",
          description: projet.description || "",
          technologies: projet.technologies?.join(", ") || "",
          lienGithub: projet.lienGithub || "",
          lienDemo: projet.lienDemo || "",
        });
        setImageActuelle(projet.image || "");
      } catch (err) {
        setErreur("Impossible de charger le projet : " + err.message);
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
      if (imageFile) formData.append("image", imageFile);
      await modifierProjet(id, formData);
      navigate(`/projet/${id}`);
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
          <label htmlFor="libelle">Libellé *</label>
          <input id="libelle" name="libelle" type="text" value={form.libelle} onChange={handleChange} required />
        </div>

        <div className="champ">
          <label htmlFor="description">Description *</label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={4} required />
        </div>

        <div className="champ">
          <label htmlFor="technologies">Technologies</label>
          <input id="technologies" name="technologies" type="text" value={form.technologies} onChange={handleChange} />
        </div>

        <div className="champ">
          <label htmlFor="image">Image (laisser vide pour garder l'actuelle)</label>
          {imageActuelle && !preview && (
            <img src={imageUrl(imageActuelle)} alt="Aperçu actuel du projet" className="image-preview" />
          )}
          {preview && (
            <img src={preview} alt="Aperçu du nouveau fichier sélectionné" className="image-preview" />
          )}
          <input id="image" type="file" accept="image/*" onChange={handleImage} />
        </div>

        <div className="champ">
          <label htmlFor="lienGithub">Lien GitHub</label>
          <input id="lienGithub" name="lienGithub" type="url" value={form.lienGithub} onChange={handleChange} />
        </div>

        <div className="champ">
          <label htmlFor="lienDemo">Lien Démo</label>
          <input id="lienDemo" name="lienDemo" type="url" value={form.lienDemo} onChange={handleChange} />
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
