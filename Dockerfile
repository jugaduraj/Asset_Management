# 1. Base Image
FROM --platform=linux/amd64 node:18-alpine AS base
WORKDIR /app

# 2. Builder Stage
FROM base as builder
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN ./node_modules/next/dist/bin/next build

# 3. Production Stage
FROM base as runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy files from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node_modules/next/dist/bin/next", "start"]
