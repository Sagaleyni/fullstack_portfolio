
pipeline {
 
    agent any
 
    environment {
        PROJECT_DIR = "${WORKSPACE}"
    }
 
    stages {
 
        stage('Verification') {
            steps {
                echo 'Verification du workspace...'
                sh 'pwd && ls -la'
            }
        }
 
        stage('Configuration env') {
            steps {
                echo 'Creation du fichier .env...'
                sh '''
                    if [ ! -f backend/.env ]; then
                        cp backend/.env.example backend/.env
                    fi
                    echo "Fichier .env OK"
                '''
            }
        }
 
        stage('Construction Docker') {
            steps {
                echo 'Construction des images Docker...'
                sh 'docker compose build'
            }
        }
 
        stage('Arret et nettoyage') {
            steps {
                echo 'Arret des anciens conteneurs...'
                sh 'docker compose down --remove-orphans'
            }
        }
 
        stage('Deploiement') {
            steps {
                echo 'Demarrage des conteneurs...'
                sh 'docker compose up -d'
            }
        }
 
        stage('Validation') {
            steps {
                echo 'Verification...'
                sh '''
                    sleep 15
                    docker compose ps
                    curl -f http://localhost:5000
                    echo "Application deployee avec succes !"
                '''
            }
        }
    }
 
    post {
        success {
            echo 'Pipeline reussi ! Application mise a jour.'
            mail to: 'saaleyni@gmail.com',
                 subject: "Succes du Pipeline Jenkins : ${currentBuild.fullDisplayName}",
                 body: "Le portfolio a ete deploye avec succes sur la VM ! Tout fonctionne parfaitement.\n\nDetails du build : ${currentBuild.absoluteUrl}"
        }
        failure {
            echo 'Echec. Consulte la Console Output.'
            mail to: 'saaleyni@gmail.com',
                 subject: "ECHEC du Pipeline Jenkins : ${currentBuild.fullDisplayName}",
                 body: "Attention, le deploiement a echoue.\n\nVerifie les logs Jenkins ici : ${currentBuild.absoluteUrl}"
        }
    }
}
