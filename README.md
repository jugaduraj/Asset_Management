# iRapido - IT Asset Management

iRapido is a professional, modern IT asset management application designed to help companies track and oversee their hardware and software assets with ease. This application provides a centralized dashboard for a clear overview of asset distribution, detailed asset and employee management, and activity logging.

Built with a modern tech stack, it offers a responsive and intuitive user interface, making asset management a streamlined and efficient process.

## Features

- **Interactive Dashboard**: A comprehensive overview of your assets with interactive charts showing asset status and category distribution.
- **Asset Management**: Full CRUD (Create, Read, Update, Delete) functionality for both hardware and software assets.
- **Employee Management**: Keep track of employees and the assets assigned to them.
- **AI-Powered Suggestions**: Utilizes generative AI to suggest asset categories based on item details, simplifying data entry.
- **Activity Logging**: A complete log of all actions taken within the application for audit and tracking purposes.
- **Data Export**: Easily export asset, employee, and activity log data to CSV files.
- **Detailed Views**: Clickable elements to dive deeper into asset and employee details from the main tables.
- **Responsive Design**: A clean, modern UI that works seamlessly on both desktop and mobile devices.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Docker (for containerized deployment)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/irapido-asset-management.git
   ```
2. Navigate to the project directory:
   ```sh
   cd irapido-asset-management
   ```
3. Install NPM packages:
   ```sh
   npm install
   ```

### Running the Application

1. Run the development server:
   ```sh
   npm run dev
   ```
2. Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Deployment with Docker

You can build and run this application as a Docker container. This is the recommended approach for production deployment as it creates a portable and consistent environment.

### 1. Build the Docker Image

From the root directory of the project, run the following command to build the Docker image. We'll tag it with the name `asset_management`:

```sh
docker build -t asset_management .
```

### 2. Run the Docker Container

Once the image is built, you can run it as a container. The following command will start the application on port 80 and allow you to pass in your database credentials as environment variables.

```sh
sudo docker run --rm -p 80:3000 -e DB_HOST="your_db_host" -e DB_USER="your_db_user" -e DB_PASSWORD="your_db_password" -e DB_NAME="your_db_name" -d asset_management
```

**Command Breakdown:**
- `sudo docker run`: Runs the command with administrator privileges.
- `--rm`: Automatically removes the container when it exits.
- `-p 80:3000`: Maps port 80 on your host machine to port 3000 inside the container.
- `-e VARIABLE="value"`: Sets an environment variable inside the container. You should replace the placeholder values with your actual database credentials.
- `-d`: Runs the container in detached mode (in the background).
- `asset_management`: The name of the image you want to run.
