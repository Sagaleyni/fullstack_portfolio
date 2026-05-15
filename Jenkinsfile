// ============================================================
// Jenkinsfile — Pipeline CI/CD corrigé pour le portfolio
// Utilise docker compose (pas docker build seul)
// La branche est "master" (pas "main")
// ============================================================
 
pipeline {
 
    // Jenkins exécute le pipeline sur le serveur local
    agent any
 
    environment {
        // Chemin du workspace Jenkins (là où Jenkins clone le code)
        // On utilise WORKSPACE car Jenkins clone déjà le projet ici
        PROJECT_DIR = "${WORKSPACE}"
    }
 
    stages {
 
        // ── STAGE 1 : Vérification ───────────────────────────────
        // Jenkins clone le code automatiquement avant les stages
        // On vérifie juste que tout est bien là
        stage('Vérification') {
            steps {
                echo '📁 Vérification du workspace Jenkins...'
                sh '''
                    pwd
                    ls -la
                    echo "✅ Fichiers présents"
                '''
            }
        }
 
        // ── STAGE 2 : Créer le fichier .env ──────────────────────
        // Le .env n'est pas sur GitHub (sécurité)
        // On le crée ici directement dans le workspace Jenkins
        stage('Configuration .env') {
            steps {
                echo '⚙️ Création du fichier .env...'
                sh '''
                    # Créer le .env si il n'existe pas encore
                    if [ ! -f backend/.env ]; then
                        cp backend/.env.example backend/.env
                        echo "✅ Fichier .env créé"
                    else
                        echo "✅ Fichier .env déjà présent"
                    fi
                '''
            }
        }
 
        // ── STAGE 3 : Construction Docker ────────────────────────
        // On utilise docker compose build (pas docker build seul)
        // car notre projet a plusieurs services (backend, frontend, mongo)
        stage('Construction Docker') {
            steps {
                echo '🏗️ Construction des images Docker avec docker compose...'
                sh '''
                    cd ${WORKSPACE}
                    docker compose build
                    echo "✅ Images construites"
                '''
            }
        }
 
        // ── STAGE 4 : Arrêt et nettoyage ─────────────────────────
        // --remove-orphans = supprime TOUS les conteneurs liés
        // à ce docker-compose, même ceux lancés manuellement avant
        // Cela évite l'erreur "container name already in use"
        stage('Arrêt et nettoyage') {
            steps {
                echo '⏹️ Arrêt et nettoyage des anciens conteneurs...'
                sh '''
                    cd ${WORKSPACE}
                    docker compose down --remove-orphans
                    echo "✅ Nettoyage terminé"
                '''
            }
        }
 
        // ── STAGE 5 : Déploiement ────────────────────────────────
        // On démarre les nouveaux conteneurs en mode détaché (-d)
        stage('Déploiement') {
            steps {
                echo '🚀 Démarrage des nouveaux conteneurs...'
                sh '''
                    cd ${WORKSPACE}
                    docker compose up -d
                    echo "✅ Conteneurs démarrés"
                '''
            }
        }
 
        // ── STAGE 6 : Validation ─────────────────────────────────
        // On attend 15 secondes que tout démarre
        // puis on vérifie que l'API répond bien
        stage('Validation') {
            steps {
                echo '✅ Vérification que l application tourne...'
                sh '''
                    echo "Attente du démarrage (15 secondes)..."
                    sleep 15
 
                    # Vérifier que les conteneurs tournent
                    docker compose ps
 
                    # Tester que l API répond
                    curl -f http://localhost:5000 || exit 1
 
                    echo "🎉 Application déployée avec succès !"
                '''
            }
        }
    }
 
    // ── ACTIONS APRÈS LE PIPELINE ────────────────────────────────
    post {
        success {
            echo '🎉 Pipeline réussi ! Application mise à jour.'
        }
        failure {
            echo '❌ Le pipeline a échoué. Consulte la Console Output pour l erreur.'
        }
    }
}
