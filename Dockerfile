# Étape de construction
FROM node:19.6-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --no-verify --force

COPY . .

RUN npm run build

# Étape de production
FROM node:19.6-alpine

WORKDIR /app

COPY --from=build /app/dist .

ENV NODE_ENV=production

