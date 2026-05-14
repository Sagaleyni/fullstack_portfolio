# ============================================================
# frontend/Dockerfile — Build multi-étapes pour React + Nginx
# Étape 1 : builder (compile React → fichiers statiques)
# Étape 2 : serveur (Nginx sert les fichiers compilés)
# ============================================================

# ─── ÉTAPE 1 : BUILD ──────────────────────────────────────
# "AS builder" = nommer cette étape pour y référer ensuite
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer TOUTES les dépendances (dev + prod pour le build)
RUN npm install

# Copier le code source
COPY . .

# Variable d'environnement pour l'URL de l'API en production
# /api sera intercepté par Nginx et redirigé vers le backend
ENV VITE_API_URL=/api

# Compiler React → dossier dist/ (fichiers HTML/CSS/JS statiques)
RUN npm run build

# ─── ÉTAPE 2 : SERVEUR NGINX ──────────────────────────────
# On repart d'une image propre (sans Node.js) pour le runtime
FROM nginx:alpine

# Copier la config Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers compilés depuis l'étape "builder"
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx écoute sur le port 80
EXPOSE 80

# Nginx démarre en mode foreground (nécessaire pour Docker)
CMD ["nginx", "-g", "daemon off;"]
