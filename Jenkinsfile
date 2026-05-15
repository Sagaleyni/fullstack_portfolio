pipeline {
    agent any

    environment {
        IMAGE_NAME = "portfolio-app"
        CONTAINER_NAME = "portfolio-container"
    }

    stages {

        stage('Vérification') {
            steps {
                echo '📁 Vérification du workspace Jenkins...'

                sh '''
                pwd
                ls -la
                '''
            }
        }

        stage('Construction Docker') {
            steps {
                echo '🏗️ Construction de l’image Docker...'

                sh '''
                docker build -t $IMAGE_NAME .
                '''
            }
        }

        stage('Arrêt ancien conteneur') {
            steps {
                echo '🛑 Suppression de l’ancien conteneur...'

                sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                '''
            }
        }

        stage('Déploiement') {
            steps {
                echo '🚀 Lancement du nouveau conteneur...'

                sh '''
                docker run -d \
                  --name $CONTAINER_NAME \
                  -p 3000:3000 \
                  $IMAGE_NAME
                '''
            }
        }

        stage('Validation') {
            steps {
                echo '✅ Vérification du conteneur Docker...'

                sh '''
                docker ps
                '''
            }
        }
    }

    post {

        success {
            echo '🎉 Déploiement terminé avec succès !'
        }

        failure {
            echo '❌ Le pipeline a échoué.'
        }
    }
}
