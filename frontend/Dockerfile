FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

# Development stage - runs Vite dev server with HMR
FROM base AS development

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Builder stage - compiles TypeScript and builds for production
FROM base AS builder

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm ci

COPY . .

RUN npm run build

# Production stage - serves static files with nginx
FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

