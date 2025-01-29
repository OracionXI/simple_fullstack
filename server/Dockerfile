# Base image - Use minimal Node.js image (Alpine)
FROM node:alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY . .

# Production image - minimal and secure
FROM base AS production
WORKDIR /app
COPY --from=deps /app .

EXPOSE 8800

CMD ["node", "index.js"]