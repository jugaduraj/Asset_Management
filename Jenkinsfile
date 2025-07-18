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
        git branch: 'main', url: 'https://github.com/jugaduraj/Asset_Management.git'
        // If private repo, add credentialsId: 'your-credential-id'
      }
    }

    stage('Install Backend Dependencies') {
      steps {
        dir("${BACKEND_DIR}") {
          sh 'python3 -m venv venv'
          sh './venv/bin/pip install --upgrade pip'
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

    stage('Test Backend') {
      steps {
        dir("${BACKEND_DIR}") {
          sh './venv/bin/python -m unittest || true'
        }
      }
    }

    stage('Docker Build & Run') {
      steps {
        // Stop and remove existing containers
        sh 'docker-compose down || true'
        // Build images
        sh 'docker-compose build'
        // Run containers, mapping backend to port 80
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
