// ============================================================
// pages/AjouterProjet.jsx — Formulaire d'ajout d'un projet
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ajouterProjet } from "../assets/api";

function AjouterProjet() {
  const navigate = useNavigate();

  // Un seul état pour tout le formulaire (objet)
  const [form, setForm] = useState({
    libelle: "",
    description: "",
    technologies: "", // chaîne séparée par virgules : "React, Node.js, MongoDB"
    lienGithub: "",
    lienDemo: "",
  });

  // L'image est séparée car c'est un fichier (type File), pas une string
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(""); // URL locale pour prévisualiser
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  // Gestion unifiée des champs texte
  // Quand un input change, on met à jour le champ correspondant dans form
  const handleChange = (e) => {
    const { name, value } = e.target;
    // spread operator (...) = copier l'ancien état et changer UN champ
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Gestion de l'image : créer une URL locale pour la prévisualiser
  const handleImage = (e) => {
    const fichier = e.target.files[0];
    if (!fichier) return;
    setImageFile(fichier);
    // URL.createObjectURL crée une URL temporaire lisible par le navigateur
    setPreview(URL.createObjectURL(fichier));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // empêcher le rechargement de page par défaut
    setEnvoi(true);
    setErreur("");

    try {
      // FormData est nécessaire pour envoyer à la fois du texte ET un fichier
      const formData = new FormData();
      formData.append("libelle", form.libelle);
      formData.append("description", form.description);
      formData.append("technologies", form.technologies);
      formData.append("lienGithub", form.lienGithub);
      formData.append("lienDemo", form.lienDemo);
      if (imageFile) {
        // "image" = le nom du champ attendu par multer dans les routes
        formData.append("image", imageFile);
      }

      await ajouterProjet(formData);
      navigate("/"); // rediriger vers la liste après succès
    } catch (err) {
      setErreur("Erreur lors de l'ajout : " + err.message);
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="page form-page">
      <h1 className="page-titre">Ajouter un projet</h1>

      <form onSubmit={handleSubmit} className="formulaire">
        {erreur && <div className="erreur">{erreur}</div>}

        <div className="champ">
          <label htmlFor="libelle">Libellé *</label>
          <input
            id="libelle"
            name="libelle"
            type="text"
            value={form.libelle}
            onChange={handleChange}
            placeholder="Ex: Application Portfolio"
            required
          />
        </div>

        <div className="champ">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Décris ton projet…"
            required
          />
        </div>

        <div className="champ">
          <label htmlFor="technologies">Technologies (séparées par des virgules)</label>
          <input
            id="technologies"
            name="technologies"
            type="text"
            value={form.technologies}
            onChange={handleChange}
            placeholder="Ex: React, Node.js, MongoDB"
          />
        </div>

        <div className="champ">
          <label htmlFor="image">Image du projet</label>
          <input id="image" name="image" type="file" accept="image/*" onChange={handleImage} />
          {/* Prévisualisation de l'image sélectionnée */}
          {preview && <img src={preview} alt="Aperçu" className="image-preview" />}
        </div>

        <div className="champ">
          <label htmlFor="lienGithub">Lien GitHub</label>
          <input
            id="lienGithub"
            name="lienGithub"
            type="url"
            value={form.lienGithub}
            onChange={handleChange}
            placeholder="https://github.com/..."
          />
        </div>

        <div className="champ">
          <label htmlFor="lienDemo">Lien Démo</label>
          <input
            id="lienDemo"
            name="lienDemo"
            type="url"
            value={form.lienDemo}
            onChange={handleChange}
            placeholder="https://mon-app.vercel.app"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate("/")}>
            Annuler
          </button>
          <button type="submit" className="btn btn-primary" disabled={envoi}>
            {envoi ? "Enregistrement…" : "Ajouter le projet"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AjouterProjet;
