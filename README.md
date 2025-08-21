# AssetZen - Intelligent Asset Management

This is a Next.js-based asset management application built within Firebase Studio. It provides a comprehensive dashboard for tracking IT assets and employees, with a modern, responsive interface and AI-powered features.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://reactjs.org/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **AI**: [Google Gemini via Genkit](https://firebase.google.com/docs/genkit)
- **Containerization**: [Docker](https://www.docker.com/)

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (for containerized deployment)

### Installation

1.  **Clone the repository** (or download the source code).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up Environment Variables**:
    Create a `.env.local` file in the root of your project and add your MongoDB connection string:
    ```
    MONGODB_URI=your_mongodb_connection_string
    ```

### Running the Development Server

To start the application in development mode, run the following command:

```bash
npm run dev
```

This will start the Next.js development server, which includes Fast Refresh for a better development experience. The app will be available at `http://localhost:9002`.

## Docker Deployment

The application is configured to be built and run as a Docker container, which is ideal for production deployments.

1.  **Build the Docker Image**:
    From the root of the project, run:
    ```bash
    docker build -t assetzen-app .
    ```

2.  **Run the Docker Container**:
    Once the image is built, you can run it as a container. You must provide the `MONGODB_URI` as an environment variable to the container.
    ```bash
    docker run -p 80:3000 -e MONGODB_URI="mongodb://assetzen:StrongPassword123@192.168.2.6:27017/assetzen?authSource=admin" assetzen-app
    ```
    The application will be available at `http://localhost:3000`.

## Backend and Database

The application connects to a MongoDB database to store and retrieve data for assets, employees, and logs. The database connection is managed by `src/lib/mongodb.ts`, which uses the `MONGODB_URI` environment variable.

API routes are handled by Next.js in the `src/app/api/` directory to perform CRUD (Create, Read, Update, Delete) operations on the database.
