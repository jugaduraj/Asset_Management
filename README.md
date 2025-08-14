# AssetZen - Intelligent Asset Management

This is a Next.js-based asset management application built within Firebase Studio. It provides a comprehensive dashboard for tracking IT assets and employees, with a modern, responsive interface and AI-powered features.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://reactjs.org/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **AI**: [Google Gemini via Genkit](https://firebase.google.com/docs/genkit)
- **Containerization**: [Docker](https://www.docker.com/)

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository** (or download the source code).
2.  **Install dependencies**:
    ```bash
    npm install
    ```

### Running the Development Server

To start the application in development mode, run the following command:

```bash
npm run dev
```

This will start the Next.js development server, which includes Fast Refresh for a better development experience.

## Port Configuration

-   **Frontend (Development)**: The application runs on `http://localhost:9002`. This is the main port for accessing the app during development.
-   **Backend (Development)**: The Next.js framework handles the backend API routes, which are served on the same port as the frontend: `9002`.
-   **Production (Docker)**: When running inside a Docker container, the application is exposed on port `3000`.

## Docker Deployment

The application is configured to be built and run as a Docker container, which is ideal for production deployments.

1.  **Build the Docker Image**:
    From the root of the project, run:
    ```bash
    docker build -t assetzen-app .
    ```

2.  **Run the Docker Container**:
    Once the image is built, you can run it as a container:
    ```bash
    docker run -p 3000:3000 assetzen-app
    ```
    The application will be available at `http://localhost:3000`.

## Backend and MongoDB Integration

Currently, the application uses mock data located in `src/lib/data.ts` for demonstration purposes. To connect to a MongoDB database, you would need to implement the following steps:

1.  **Set up a MongoDB Atlas Cluster**:
    -   Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
    -   Get your connection string (URI).

2.  **Store Connection String in Environment Variables**:
    Create a `.env.local` file in the root of the project and add your MongoDB connection URI:
    ```
    MONGODB_URI=your_mongodb_connection_string
    ```

3.  **Create a Database Utility**:
    Create a file (e.g., `src/lib/mongodb.ts`) to handle the database connection. You'll need to install the `mongodb` driver first (`npm install mongodb`).

    ```typescript
    // src/lib/mongodb.ts
    import { MongoClient } from 'mongodb';

    if (!process.env.MONGODB_URI) {
      throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
    }

    const uri = process.env.MONGODB_URI;
    let client: MongoClient;
    let clientPromise: Promise<MongoClient>;

    if (process.env.NODE_ENV === 'development') {
      // In development mode, use a global variable so that the value
      // is preserved across module reloads caused by HMR (Hot Module Replacement).
      if (!global._mongoClientPromise) {
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
      }
      clientPromise = global._mongoClientPromise;
    } else {
      // In production mode, it's best to not use a global variable.
      client = new MongoClient(uri);
      clientPromise = client.connect();
    }

    export default clientPromise;
    ```

4.  **Create API Routes**:
    You would then create Next.js API routes (e.g., in `src/app/api/assets/route.ts`) to perform CRUD (Create, Read, Update, Delete) operations on your MongoDB collections, replacing the mock data logic.




docker build --build-arg MONGODB_URI="mongodb://assetzen:StrongPassword123@192.168.2.6:27017/assetzen?authSource=admin" -t assetzen-app .


docker run -p 80:3000 -e MONGODB_URI="mongodb://assetzen:StrongPassword123@192.168.2.6:27017/assetzen?authSource=admin" assetzen-app