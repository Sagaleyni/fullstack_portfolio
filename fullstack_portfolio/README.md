# Portfolio Fullstack

Application web de gestion de portfolio — React + Express + MongoDB + Docker.

## Stack technique

| Couche    | Technologie           |
|-----------|----------------------|
| Frontend  | React 18 + Vite      |
| Style     | CSS personnalisé     |
| Backend   | Express.js           |
| Base de données | MongoDB + Mongoose |
| Reverse proxy | Nginx           |
| Déploiement | Docker Compose     |

## Fonctionnalités

- Lister tous les projets (avec image et technologies)
- Voir le détail d'un projet
- Ajouter un projet (avec upload d'image)
- Modifier un projet existant
- Supprimer un projet

## Lancement en développement

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev  # nodemon — rechargement automatique
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # Vite — accessible sur http://localhost:5173
```

## Déploiement avec Docker

```bash
docker compose up --build -d
```
Application accessible sur `http://localhost`

Voir [DEPLOIEMENT.md](./DEPLOIEMENT.md) pour le guide complet (Git + VM Linux + Docker).

## Structure du projet

```
fullstack_portfolio/
├── backend/
│   ├── models/        # Schémas MongoDB
│   ├── controllers/   # Logique métier
│   ├── routes/        # Routes Express
│   ├── uploads/       # Images stockées
│   ├── app.js         # Point d'entrée
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, CarteProjet
│   │   ├── pages/       # ListeProjets, Détail, Ajouter, Modifier
│   │   └── assets/      # api.js (service HTTP)
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
├── .gitignore
└── DEPLOIEMENT.md
```
