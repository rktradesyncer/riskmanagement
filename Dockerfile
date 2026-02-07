FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY tsconfig.service.json ./
COPY src/lib/ src/lib/
COPY src/microservice/ src/microservice/

RUN npx tsc -p tsconfig.service.json

# --- Production image ---
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

ENV PORT=4000
EXPOSE 4000

CMD ["node", "dist/microservice/server.js"]
