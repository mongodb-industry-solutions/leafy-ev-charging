# Build stage
FROM node:24-bookworm-slim AS builder

WORKDIR /app

# This is an npm workspaces monorepo: the lockfile and every workspace manifest
# live at the repo root. Install from the committed lockfile with `npm ci` so
# image builds are fully reproducible and resolve the exact same dependency
# versions as local development (a lockfile-less `npm install` would silently
# drift to newer versions). The build context is the repo root (see
# docker-compose.yml / Kanopy build config).
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json
RUN npm ci

# Build the frontend workspace against the hoisted node_modules.
COPY frontend/ ./frontend/
COPY backend/schema ./backend/schema
RUN npm run codegen -w frontend && npm run build -w frontend

# Production stage
FROM node:24-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
# Kanopy routes ingress traffic to port 8080.
ENV PORT=8080
ENV HOSTNAME="0.0.0.0" 

# Next.js standalone output. `outputFileTracingRoot` is pinned to the monorepo
# root, so the bundle preserves the workspace layout and the server entrypoint
# lives at frontend/server.js.
COPY --from=builder /app/frontend/.next/standalone ./
COPY --from=builder /app/frontend/.next/static ./frontend/.next/static
COPY --from=builder /app/frontend/public ./frontend/public

EXPOSE 8080

CMD ["node", "frontend/server.js"]
