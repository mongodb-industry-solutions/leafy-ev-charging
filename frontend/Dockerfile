# Build stage
FROM node:24-bookworm-slim AS builder

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

COPY frontend/ ./
COPY backend/schema /backend/schema
RUN npm run codegen && npm run build

# Production stage
FROM node:24-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
# Kanopy routes ingress traffic to port 8080.
ENV PORT=8080

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 8080

CMD ["node", "server.js"]
