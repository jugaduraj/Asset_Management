pipeline {
  agent any

  environment {
    REPO_NAME = 'Asset_Management'
    FRONTEND_DIR = 'frontend'
    BACKEND_DIR = 'backend'
  }

  stages {

    stage('Clone Code') {
      steps {
        git 'https://github.com/jugaduraj/Asset_Management.git'
      }
    }

    stage('Install Backend Dependencies') {
      steps {
        dir("${BACKEND_DIR}") {
          sh 'python3 -m venv venv'
          sh './venv/bin/pip install -r requirements.txt'
        }
      }
    }

    stage('Install Frontend Dependencies') {
      steps {
        dir("${FRONTEND_DIR}") {
          sh 'npm install'
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir("${FRONTEND_DIR}") {
          sh 'npm run build'
        }
      }
    }

    stage('Test Backend (optional)') {
      steps {
        dir("${BACKEND_DIR}") {
          sh './venv/bin/python -m unittest || true'
        }
      }
    }

    stage('Docker Build & Run (optional)') {
      steps {
        sh 'docker-compose build'
        sh 'docker-compose up -d'
      }
    }

  }

  post {
    success {
      echo '✅ Jenkins pipeline completed successfully.'
    }
    failure {
      echo '❌ Pipeline failed.'
    }
  }
}
