pipeline {
    agent any

    environment {
        IMAGE_NAME = "assetzen-app"
        CONTAINER_NAME = "assetzen-app-container"
        MONGODB_URI = "mongodb://assetzen:StrongPassword123@192.168.2.6:27017/assetzen?authSource=admin"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/jugaduraj/Asset_Management.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image: ${IMAGE_NAME}"
                    sh "docker build -t ${IMAGE_NAME} ."
                }
            }
        }

        stage('Deploy Container') {
            steps {
                script {
                    echo "Checking and cleaning any existing container: ${CONTAINER_NAME}"
                    sh '''
                    # If container exists, stop and remove it
                    if [ "$(docker ps -aq -f name=${CONTAINER_NAME})" ]; then
                        echo "Existing container found. Stopping and removing..."
                        docker stop ${CONTAINER_NAME} || true
                        docker rm ${CONTAINER_NAME} || true
                    else
                        echo "No existing container found."
                    fi

                    # Run new container
                    echo "Starting new container..."
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p 80:3000 \
                        -e MONGODB_URI="${MONGODB_URI}" \
                        ${IMAGE_NAME}
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Application deployed successfully! Visit: http://192.168.2.6:80'
        }
        failure {
            echo 'Deployment failed. Check Jenkins console logs.'
        }
    }
}
