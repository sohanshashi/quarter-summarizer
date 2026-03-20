FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

# Development stage - has all deps, runs in watch mode
FROM base AS development

RUN npm install

EXPOSE 3001

CMD ["npm", "run", "start:debug"]

# Builder stage - compiles TypeScript
FROM base AS builder

RUN npm ci

COPY . .

RUN npm run build
RUN npm prune --omit=dev

# Production stage - minimal image
FROM base AS production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3001

CMD ["node", "dist/cluster"]
