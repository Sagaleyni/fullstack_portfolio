pipeline {
    agent any

    environment {
        PROJET_DIR = 'fullstack_portfolio'
        EMAIL_DESTINATAIRE = 'saaleyni@gmail.com'
    }

    stages {

        stage('Cloner le code') {
            steps {
                echo 'Recuperation du code depuis GitHub...'
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
            echo 'Pipeline reussi !'
            emailext(
                subject: "✅ [Jenkins] Portfolio deploye avec succes - Build #${BUILD_NUMBER}",
                body: """
                    Bonjour,

                    Le pipeline Jenkins a termine avec succes !

                    Projet     : ${JOB_NAME}
                    Build      : #${BUILD_NUMBER}
                    Statut     : SUCCES
                    Application: http://172.16.64.131

                    Voir les logs : ${BUILD_URL}

                    -- Jenkins CI/CD
                """,
                to: "${EMAIL_DESTINATAIRE}"
            )
        }
        failure {
            echo 'Pipeline echoue !'
            emailext(
                subject: "❌ [Jenkins] ECHEC du pipeline - Build #${BUILD_NUMBER}",
                body: """
                    Bonjour,

                    Le pipeline Jenkins a echoue !

                    Projet : ${JOB_NAME}
                    Build  : #${BUILD_NUMBER}
                    Statut : ECHEC

                    Voir les logs : ${BUILD_URL}console

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
