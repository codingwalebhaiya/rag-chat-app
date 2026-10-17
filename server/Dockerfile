#  Build stage 
FROM node:22-bookworm-slim as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps 

COPY . .
RUN npm run build


# Production stage
FROM node:22-bookworm-slim AS production

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps && npm cache clean --force

COPY --from=builder /app/dist ./dist


USER node

# Keep EXPOSE 10000 for Render
EXPOSE 10000

# Default process:API server
CMD ["node", "dist/server.js"]

 