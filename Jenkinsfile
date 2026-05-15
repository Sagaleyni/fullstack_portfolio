// Jenkinsfile — Pipeline CI/CD pour le portfolio
// Ce fichier est lu par Jenkins à chaque git push

pipeline {

    // "agent any" = utilise n'importe quel serveur Jenkins disponible
    agent any

    // Variables réutilisables dans tout le pipeline
    environment {
        // Nom du projet (utilisé dans les commandes docker)
        PROJECT_NAME = 'fullstack_portfolio'
        // Dossier où se trouve le projet sur la VM
        PROJECT_DIR = '/home/ubuntu/fullStack_portfolio'
    }

    stages {

        // ── STAGE 1 : Récupérer le code ─────────────────────────
        stage('Récupérer le code') {
            steps {
                // git pull = récupère les dernières modifications depuis GitHub
                echo '📥 Récupération du code depuis GitHub...'
                sh '''
                    cd $PROJECT_DIR
                    git pull origin main
                '''
            }
        }

        // ── STAGE 2 : Construire les images Docker ───────────────
        stage('Construire') {
            steps {
                echo '🔨 Construction des images Docker...'
                sh '''
                    cd $PROJECT_DIR
                    docker compose build
                '''
            }
        }

        // ── STAGE 3 : Déployer l'application ────────────────────
        stage('Déployer') {
            steps {
                echo '🚀 Déploiement de l application...'
                sh '''
                    cd $PROJECT_DIR
                    docker compose down
                    docker compose up -d
                '''
            }
        }

        // ── STAGE 4 : Vérifier que l'app tourne ─────────────────
        stage('Vérifier') {
            steps {
                echo '✅ Vérification...'
                sh '''
                    sleep 10
                    curl -f http://localhost:5000 || exit 1
                    docker compose ps
                '''
            }
        }
    }

    // Actions après le pipeline (succès ou échec)
    post {
        success {
            echo '🎉 Déploiement réussi !'
        }
        failure {
            echo '❌ Échec du déploiement. Vérifie les logs.'
        }
    }
}
