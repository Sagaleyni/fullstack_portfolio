pipeline {
    agent any

    environment {
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
                sh 'ls -la fullstack_portfolio/'
            }
        }

        stage('Injecter le .env') {
            steps {
                withCredentials([file(credentialsId: 'portfolio-backend-env', variable: 'ENV_FILE')]) {
                    sh 'cp $ENV_FILE fullstack_portfolio/backend/.env'
                    sh 'echo ".env injecte avec succes"'
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
                sh 'sleep 8'
                sh 'curl -f http://localhost || exit 1'
                sh 'curl -f http://localhost/api/projets || exit 1'
                sh 'echo "Application en ligne !"'
            }
        }
    }

    post {
        success {
            emailext(
                subject: "✅ [Jenkins] Portfolio deploye - Build #${BUILD_NUMBER}",
                body: """
Bonjour,

Pipeline reussi avec succes !

Projet  : ${JOB_NAME}
Build   : #${BUILD_NUMBER}
Acces   : http://172.16.64.131
Logs    : ${BUILD_URL}

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

Le pipeline a echoue !

Projet : ${JOB_NAME}
Build  : #${BUILD_NUMBER}
Logs   : ${BUILD_URL}console

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
