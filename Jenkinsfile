pipeline {
    agent any

    environment {
        PROJET_DIR = 'fullstack_portfolio'
        EMAIL_DESTINATAIRE = 'saaleyni@gmail.com'
    }

    stages {

        stage('Cloner le code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Sagaleyni/fullstack_portfolio.git'
            }
        }

        stage('Verifier environnement') {
            steps {
                sh 'docker --version'
                sh 'docker compose version'
                sh 'ls -la'
            }
        }

        stage('Injecter les secrets') {
            steps {
                withCredentials([file(credentialsId: 'portfolio-backend-env', variable: 'ENV_FILE')]) {
                    sh 'cp $ENV_FILE fullstack_portfolio/backend/.env'
                    echo 'Fichier .env injecte avec succes'
                }
            }
        }

        stage('Build des images Docker') {
            steps {
                sh '''
                    cd fullstack_portfolio
                    docker compose build --no-cache
                '''
            }
        }

        stage('Deploiement') {
            steps {
                sh '''
                    cd fullstack_portfolio
                    docker compose down
                    docker compose up -d
                '''
            }
        }

        stage('Verification') {
            steps {
                sh 'sleep 5'
                sh 'curl -f http://localhost || exit 1'
                sh 'curl -f http://localhost/api/projets || exit 1'
            }
        }
    }

    post {
        success {
            emailext(
                subject: "✅ [Jenkins] Portfolio deploye - Build #${BUILD_NUMBER}",
                body: """
Bonjour,

Pipeline Jenkins termine avec succes !

Projet     : ${JOB_NAME}
Build      : #${BUILD_NUMBER}
Statut     : SUCCES
Application: http://172.16.64.131

Logs : ${BUILD_URL}

-- Jenkins CI/CD
                """,
                to: "${EMAIL_DESTINATAIRE}"
            )
        }
        failure {
            emailext(
                subject: "❌ [Jenkins] ECHEC pipeline - Build #${BUILD_NUMBER}",
                body: """
Bonjour,

Le pipeline Jenkins a echoue !

Projet : ${JOB_NAME}
Build  : #${BUILD_NUMBER}
Statut : ECHEC

Logs : ${BUILD_URL}console

-- Jenkins CI/CD
                """,
                to: "${EMAIL_DESTINATAIRE}"
            )
        }
        always {
            sh 'docker image prune -f'
        }
    }
}
