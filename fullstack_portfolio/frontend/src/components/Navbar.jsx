// ============================================================
// components/Navbar.jsx — Barre de navigation
// Présent sur toutes les pages grâce à App.jsx
// ============================================================

import { Link, useLocation } from "react-router-dom";

function Navbar() {
  // useLocation donne l'URL courante, utile pour surligner le lien actif
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      {/* Logo / nom du site — renvoie à l'accueil */}
      <Link to="/" className="navbar-brand">
        <span className="brand-dot">●</span> Portfolio
      </Link>

      {/* Liens de navigation */}
      <div className="navbar-links">
        {/* className conditionnelle : "active" si on est sur la page */}
        <Link to="/" className={pathname === "/" ? "nav-link active" : "nav-link"}>
          Projets
        </Link>
        <Link to="/ajouter" className={pathname === "/ajouter" ? "nav-link active" : "nav-link"}>
          + Ajouter
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
