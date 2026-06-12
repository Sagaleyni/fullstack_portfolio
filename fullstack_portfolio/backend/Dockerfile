FROM node:20-alpine

# ─── ÉTAPE 2 : dossier de travail dans le conteneur ────────
# Tous les fichiers du backend iront dans /app
WORKDIR /app

# ─── ÉTAPE 3 : copier package.json EN PREMIER ───────────────
# Astuce Docker : on copie package.json séparément pour profiter
# du cache — si le code change mais pas les dépendances, Docker
# ne réinstalle pas tout
COPY package*.json ./

# ─── ÉTAPE 4 : installer les dépendances ───────────────────
# --omit=dev = on n'installe PAS nodemon en production
RUN npm install --omit=dev

# ─── ÉTAPE 5 : copier tout le reste du code ────────────────
COPY . .

# ─── ÉTAPE 6 : créer le dossier uploads ────────────────────
# Ce dossier recevra les images uploadées
RUN mkdir -p uploads

# ─── ÉTAPE 7 : exposer le port ─────────────────────────────
# Juste informatif — le vrai mapping se fait dans docker-compose
EXPOSE 5000

# ─── ÉTAPE 8 : commande de démarrage ───────────────────────
CMD ["node", "app.js"]
