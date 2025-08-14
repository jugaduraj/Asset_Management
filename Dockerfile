# Dockerfile

# 1. Builder Stage
# Use a specific Node.js version for reproducibility
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Define a build-time argument for the MongoDB URI
ARG MONGODB_URI

# Set the environment variable for the build process
ENV MONGODB_URI=${MONGODB_URI}

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the Next.js application
# The MONGODB_URI is required at build time from the ARG
RUN npm run build

# 2. Runner Stage
# Use a slim, secure base image for the final container
FROM node:18-alpine

WORKDIR /app

# Set the NODE_ENV to 'production' for performance
ENV NODE_ENV production

# Copy the built application from the builder stage
#COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose the port the app runs on
EXPOSE 3000

# The command to start the application
# Note: MONGODB_URI must be provided at runtime
CMD ["node", "server.js"]
