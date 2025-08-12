# 🚀 Deploying Your Application with Docker

Welcome! This guide will walk you through deploying your Next.js application using Docker. This approach packages your app into a portable container that can run almost anywhere, from your local machine to any modern cloud provider. We'll connect it to a live, external MongoDB database.

## What We're Doing

Our goal is to take the application, package it into a Docker container, and provide instructions to run it on a cloud hosting service. This makes your application scalable and easy to manage.

---

## ✅ Prerequisites: The Tools You'll Need

Before we start, make sure you have the following tools and accounts.

1.  **Node.js & npm**: Used for managing packages and running scripts locally.
    *   **Get it here**: [nodejs.org](https://nodejs.org/) (we recommend the "LTS" version).

2.  **Docker**: The core tool for building and running your containerized application.
    *   **Get it here**: [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/).

3.  **MongoDB Atlas Account or Local MongoDB Server**:
    *   **For Cloud (Recommended)**: Use MongoDB Atlas for a live, cloud-hosted database.
        *   **Sign up here**: [mongodb.com/atlas](https://www.mongodb.com/atlas).
        *   You will need to create a cluster and get your **connection string**. It looks like `mongodb+srv://...`.
        *   **Important**: In your Atlas cluster settings, make sure to configure network access to allow connections from all IP addresses (`0.0.0.0/0`). This is crucial for your deployed app to be able to reach the database.
    *   **For Local Development**: If you are running a MongoDB server directly on your machine.

4.  **Container Registry Account**: This is a place to store your built Docker image so a cloud provider can access it.
    *   **Options**: [Docker Hub](https://hub.docker.com/) (common choice) or [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

---

## 🛠️ Step 1: Configure Your Environment

Your application needs to know how to connect to your database.

### For Local Database (Running on your computer)
If you are connecting to a MongoDB server running on your host machine (not in another Docker container), you must use the special DNS name `host.docker.internal` instead of `localhost` or `192.168.x.x` in your connection string.

**Example Local Connection String:**
`mongodb://assetzen:StrongPassword123@host.docker.internal:27017/assetzen?authSource=admin`

### For Cloud Database (MongoDB Atlas)
Use the connection string provided by Atlas directly.

**Example Atlas Connection String:**
`mongodb+srv://your_user:<password>@your_cluster.mongodb.net/assetzen?authSource=admin`


1.  **Create the ` .env` file**: This file provides environment variables when you run the container. Create a file named `.env` in the root of your project and add your configuration. **Use `host.docker.internal` if your database is running on your local machine.**
    ```env
    # Replace the MONGODB_URI with your actual connection string
    MONGODB_URI="mongodb://assetzen:StrongPassword123@host.docker.internal:27017/assetzen?authSource=admin"
    PORT=4000
    JWT_SECRET=supersecretkey
    JWT_EXP=15m
    REFRESH_TOKEN_SECRET=anothersecret
    REFRESH_TOKEN_EXP=7d
    ```

2.  **Create the `.env.mongodb_uri` file**: Create a new file named `.env.mongodb_uri`. This file will be used to securely provide the connection string during the build process. Place your **full MongoDB URI** in this file, and nothing else. **Again, use `host.docker.internal` for a local database.**
    ```
    mongodb://assetzen:StrongPassword123@host.docker.internal:27017/assetzen?authSource=admin
    ```
    *Note: This file should **NOT** have `MONGODB_URI=` at the beginning, and should not be in quotes.*

---

## 🔬 Step 2: Build the Docker Image

Now, let's build the application into a Docker image.

1.  **Open your terminal** in the project's root directory.
2.  **Build the image**:
    *   Replace `your-docker-username` with your actual username from Docker Hub or your chosen registry.
    *   This command uses a `--build-arg` to pass the connection string.
    ```bash
    docker build -t your-docker-username/assetzen-app --build-arg MONGODB_URI="$(cat .env.mongodb_uri)" .
    ```
    *The `.` at the end is important; it tells Docker to use the `Dockerfile` in the current directory.*

---

## 🚀 Step 3: Run the Container Locally

With your image built, let's run it on your machine.

1.  **Run the container**:
    ```bash
    docker run --rm -p 4000:4000 --env-file .env your-docker-username/assetzen-app
    ```
    *   `--rm`: Automatically removes the container when it stops.
    *   `-p 4000:4000`: Maps port 4000 from your machine to port 4000 in the container.
    *   `--env-file .env`: Loads the environment variables from your `.env` file.

2.  **Access Your App**: Open your web browser and go to **[http://localhost:4000](http://localhost:4000)**.

---

## ☁️ Step 4: Push to a Registry & Deploy to the Cloud

Once you have confirmed it runs locally, you can push it to a container registry and deploy it.

1.  **Log in to your Container Registry**:
    ```bash
    docker login
    ```
2.  **Push the Image**:
    ```bash
    docker push your-docker-username/assetzen-app
    ```

3.  **Deploy**: Go to your cloud provider (e.g., DigitalOcean App Platform, Google Cloud Run, AWS App Runner) and point it to the image you just pushed. During setup, you will need to add the same environment variables that are in your `.env` file to the cloud provider's configuration panel.

You're all done! Your AssetZen application is now ready to be deployed live on the internet.
