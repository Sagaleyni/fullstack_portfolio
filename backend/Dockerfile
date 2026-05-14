# ============================================================
# backend/Dockerfile — Image Docker pour le serveur Express
# ============================================================

# FROM = image de base (Node.js 20 sur Alpine = légère, ~50MB)
FROM node:20-alpine

# Créer le dossier de travail à l'intérieur du conteneur
WORKDIR /app

# COPY package*.json en premier (optimisation du cache Docker)
# Si package.json ne change pas, Docker réutilise le cache npm install
COPY package*.json ./

# Installer les dépendances de production uniquement
RUN npm install --omit=dev

# Copier tout le reste du code source
COPY . .

# Créer le dossier pour les uploads d'images
RUN mkdir -p uploads

# Exposer le port que le serveur utilise (pour la documentation)
# Cela ne publie pas le port — c'est fait dans docker-compose.yml
EXPOSE 5000

# Commande lancée au démarrage du conteneur
CMD ["node", "app.js"]
