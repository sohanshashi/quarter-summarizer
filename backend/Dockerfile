FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

# Development stage - has all deps, runs in watch mode
FROM base AS development

RUN npm install

EXPOSE 3001

CMD ["npm", "run", "start:dev"]

# Builder stage - compiles TypeScript
FROM base AS builder

RUN npm install

COPY . .
RUN npm run build

# Production stage - minimal image
FROM base AS production

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main"]
