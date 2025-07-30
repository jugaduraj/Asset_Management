
pipeline {
    agent any

    environment {
        DOCKER_IMAGE_NAME = "asset_management"
        DOCKER_IMAGE_TAG = "build-${env.BUILD_NUMBER}"
        // Set your Docker registry URL here. e.g., "your-docker-registry.com/your-repo"
        DOCKER_REGISTRY = ""
        // In Jenkins, you would configure credentials for your Docker registry
        // and assign the ID here. e.g., 'my-docker-hub-credentials'
        DOCKER_CREDENTIALS_ID = "docker-registry-credentials"
    }

    stages {
        stage('Checkout') {
            steps {
                // This step checks out the code from your version control system (e.g., Git)
                // This is automatically handled when the Jenkins job is configured with an SCM.
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image: ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
                    sh "docker build -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ."
                }
            }
        }

        stage('Test') {
            steps {
                // Add your test commands here. For now, it's just a placeholder.
                echo "Running tests..."
                // Example: sh 'npm test'
            }
        }

        stage('Push to Docker Registry') {
            steps {
                script {
                    if (env.DOCKER_REGISTRY) {
                        echo "Logging in to Docker registry..."
                        withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            sh "docker login -u ${env.DOCKER_USER} -p ${env.DOCKER_PASS} ${env.DOCKER_REGISTRY}"
                        }
                        
                        echo "Tagging image for registry..."
                        sh "docker tag ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ${env.DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
                        
                        echo "Pushing image to ${env.DOCKER_REGISTRY}..."
                        sh "docker push ${env.DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
                    } else {
                        echo "DOCKER_REGISTRY not set. Skipping push."
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                // This is a placeholder for your deployment script.
                // You would typically use SSH to connect to your server and run the docker container.
                echo "Deploying application..."
                // Example SSH command:
                // sh 'ssh user@your-server "docker pull ${env.DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} && docker stop asset-app && docker rm asset-app && docker run --name asset-app --rm -p 80:3000 -d ${env.DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"'
            }
        }
    }

    post {
        always {
            // Clean up workspace and docker images
            echo 'Cleaning up...'
            script {
                if (env.DOCKER_REGISTRY) {
                    sh "docker logout ${env.DOCKER_REGISTRY}"
                }
            }
            deleteDir()
        }
    }
}
