# 1. Base Stage: Setup the basic environment
FROM node:18-alpine AS base
WORKDIR /app
# The version of npm should match the one in package-lock.json for consistency.
# If you update your local npm, you might need to update this line.
RUN npm install -g npm@10.8.2

# 2. Dependencies Stage: Install npm dependencies
# This stage is dedicated to installing dependencies, taking advantage of Docker's layer caching.
# It only re-runs if package.json or package-lock.json changes.
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# 3. Build Stage: Build the Next.js application
# This stage builds the application code. It uses the dependencies from the 'deps' stage.
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Provide a dummy MONGODB_URI at build time.
# The Next.js build process requires this variable to be present.
# The real value will be provided at runtime.
ENV MONGODB_URI="mongodb://dummy:dummy@localhost:27017/dummy"

# Disable Next.js telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# 4. Runner Stage: Create the final production image
# This stage creates the final, lean image. It copies only the necessary artifacts
# from the 'builder' stage to reduce the final image size.
FROM base AS runner
WORKDIR /app

# Set environment variables for the production environment.
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security purposes.
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy the built application from the 'builder' stage.
#COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Switch to the non-root user.
USER nextjs

# Expose the port the app will run on.
EXPOSE 3000

# Set the host to 0.0.0.0 to allow connections from outside the container.
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# The command to start the application.
CMD ["npm", "start"]
