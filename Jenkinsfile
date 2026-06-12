pipeline {
    agent any

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
            echo 'Pipeline reussi ! Application deployee avec succes.'
        }
        failure {
            echo 'Pipeline echoue. Verifiez les logs.'
        }
        always {
            sh 'docker image prune -f'
        }
    }
}
