# ============================================================
# GUIDE COMPLET — Git + Docker sur VM Linux
# Portfolio Fullstack : React + Express + MongoDB
# ============================================================

## ═══════════════════════════════════════════════════════════
## PARTIE 1 — PRÉPARER ET POUSSER SUR GITHUB
## ═══════════════════════════════════════════════════════════

### ÉTAPE 1 : Créer le dépôt sur GitHub
─────────────────────────────────────────
1. Aller sur https://github.com
2. Cliquer sur "New repository"
3. Nom : fullStack_portfolio
4. Visibilité : Public (ou Private)
5. ⚠️ NE PAS cocher "Initialize with README" (on le fait nous-mêmes)
6. Cliquer "Create repository"


### ÉTAPE 2 : Initialiser Git localement
─────────────────────────────────────────
# Aller dans le dossier du projet
cd fullstack_portfolio

# Initialiser le dépôt Git (crée le dossier .git)
git init

# Vérifier l'état initial (tous les fichiers sont "untracked")
git status


### ÉTAPE 3 : Premier commit sur la branche main
─────────────────────────────────────────────────
# Renommer la branche en "main" (standard GitHub actuel)
git branch -M main

# Ajouter TOUS les fichiers au "staging area"
# Le .gitignore empêche node_modules et .env d'être ajoutés
git add .

# Vérifier ce qui va être commité
git status

# Créer le premier commit avec un message descriptif
git commit -m "feat: initialisation de l'application portfolio fullstack"


### ÉTAPE 4 : Connecter le dépôt GitHub et pousser
───────────────────────────────────────────────────
# Remplace "TON_USERNAME" et "fullStack_portfolio" par tes valeurs
git remote add origin https://github.com/TON_USERNAME/fullStack_portfolio.git

# Pousser la branche main vers GitHub
# -u = définir origin/main comme branche de suivi par défaut
git push -u origin main


### ÉTAPE 5 : Créer une branche de travail (bonne pratique)
────────────────────────────────────────────────────────────
# Créer et basculer sur une nouvelle branche "develop"
git checkout -b develop

# Vérifier qu'on est bien sur "develop"
git branch
# * develop
#   main

# Pousser la branche develop sur GitHub
git push -u origin develop

# À partir de maintenant : on travaille sur "develop"
# Quand une fonctionnalité est terminée → commit sur develop
# Quand le projet est stable → merge develop dans main


### ÉTAPE 6 : Workflow de commits au quotidien
───────────────────────────────────────────────
# Après avoir modifié des fichiers :

# 1. Voir les changements
git status
git diff

# 2. Ajouter les fichiers modifiés
git add .

# 3. Créer un commit (message clair et précis)
git commit -m "feat: ajout de la page détail projet"

# 4. Pousser sur GitHub
git push

# Convention de messages de commits :
# feat: nouvelle fonctionnalité
# fix: correction de bug
# style: modification visuelle
# docs: documentation
# refactor: refactorisation de code


## ═══════════════════════════════════════════════════════════
## PARTIE 2 — PRÉPARER LA VM LINUX
## ═══════════════════════════════════════════════════════════

### ÉTAPE 7 : Connexion à la VM (SSH)
──────────────────────────────────────
# Depuis ta machine locale, se connecter à la VM via SSH
# Remplace IP_DE_TA_VM par l'adresse IP de ta machine virtuelle
ssh utilisateur@IP_DE_TA_VM

# Exemple :
# ssh ubuntu@192.168.1.100

# Si tu utilises une clé SSH :
# ssh -i ~/.ssh/ma_cle.pem ubuntu@IP_DE_TA_VM


### ÉTAPE 8 : Mettre à jour Ubuntu et installer les outils
───────────────────────────────────────────────────────────
# Mettre à jour la liste des paquets disponibles
sudo apt update

# Mettre à jour tous les paquets installés
sudo apt upgrade -y

# Installer Git (probablement déjà présent)
sudo apt install -y git curl


### ÉTAPE 9 : Installer Docker
───────────────────────────────
# Script officiel d'installation de Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Ajouter ton utilisateur au groupe docker
# (pour ne pas avoir à taper sudo avant chaque commande docker)
sudo usermod -aG docker $USER

# ⚠️ IMPORTANT : se déconnecter et reconnecter pour appliquer le groupe
exit
# Puis se reconnecter :
ssh utilisateur@IP_DE_TA_VM

# Vérifier que Docker fonctionne (doit afficher la version)
docker --version
docker compose version


### ÉTAPE 10 : Cloner le projet depuis GitHub
──────────────────────────────────────────────
# Cloner le dépôt dans le home directory
git clone https://github.com/TON_USERNAME/fullStack_portfolio.git

# Aller dans le dossier du projet
cd fullStack_portfolio


## ═══════════════════════════════════════════════════════════
## PARTIE 3 — CONFIGURER ET LANCER AVEC DOCKER
## ═══════════════════════════════════════════════════════════

### ÉTAPE 11 : Créer le fichier .env du backend
────────────────────────────────────────────────
# Copier le fichier exemple
cp backend/.env.example backend/.env

# Éditer avec nano (ou vim)
nano backend/.env

# Contenu à mettre dans .env :
# PORT=5000
# MONGO_URI=mongodb://mongo:27017/portfolio
# FRONTEND_URL=http://IP_DE_TA_VM
#
# Sauvegarder : Ctrl+O → Entrée → Ctrl+X


### ÉTAPE 12 : Construire et lancer avec Docker Compose
────────────────────────────────────────────────────────
# Se placer à la racine du projet (là où est docker-compose.yml)
cd fullStack_portfolio

# Construire les images Docker et démarrer les conteneurs
# --build = forcer la reconstruction des images
# -d = mode détaché (les conteneurs tournent en arrière-plan)
docker compose up --build -d

# Cette commande va :
# 1. Télécharger l'image MongoDB
# 2. Builder l'image du backend (npm install, etc.)
# 3. Builder l'image du frontend (npm run build, Nginx)
# 4. Démarrer les 3 conteneurs dans le bon ordre


### ÉTAPE 13 : Vérifier que tout tourne
────────────────────────────────────────
# Lister les conteneurs en cours d'exécution
docker compose ps

# Résultat attendu :
# NAME                  STATUS          PORTS
# portfolio_mongo       Up              27017/tcp
# portfolio_backend     Up              0.0.0.0:5000->5000/tcp
# portfolio_frontend    Up              0.0.0.0:80->80/tcp

# Voir les logs du backend (utile pour debugger)
docker compose logs backend

# Voir les logs en temps réel (Ctrl+C pour arrêter)
docker compose logs -f backend

# Tester l'API directement sur la VM
curl http://localhost:5000
# Doit répondre : {"message":"API Portfolio opérationnelle ✅",...}


### ÉTAPE 14 : Accéder à l'application
────────────────────────────────────────
# Depuis n'importe quel navigateur sur ton réseau :
# http://IP_DE_TA_VM
#
# Exemples :
# http://192.168.1.100
# http://192.168.1.100/api/projets (API directe)


## ═══════════════════════════════════════════════════════════
## PARTIE 4 — COMMANDES UTILES AU QUOTIDIEN
## ═══════════════════════════════════════════════════════════

# ─── DOCKER ────────────────────────────────────────────────

# Arrêter tous les conteneurs (garde les données)
docker compose down

# Arrêter ET supprimer les volumes (⚠️ efface la base de données !)
docker compose down -v

# Redémarrer après une modification du code
git pull
docker compose up --build -d

# Voir les logs d'un service spécifique
docker compose logs mongo
docker compose logs frontend
docker compose logs backend

# Entrer dans un conteneur (comme SSH mais dans Docker)
docker compose exec backend sh
docker compose exec mongo mongosh

# ─── GIT ───────────────────────────────────────────────────

# Récupérer les dernières modifications de GitHub
git pull origin develop

# Voir l'historique des commits
git log --oneline --graph

# Fusionner develop dans main quand le projet est stable
git checkout main
git merge develop
git push origin main
git checkout develop

# ─── RÉSOLUTION DE PROBLÈMES ───────────────────────────────

# Port 80 déjà utilisé ?
sudo lsof -i :80
sudo systemctl stop apache2  # ou nginx s'il tourne en dehors de Docker

# Voir l'utilisation des ressources des conteneurs
docker stats

# Nettoyer les images/conteneurs inutilisés
docker system prune -f
