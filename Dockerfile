FROM node:19.6-alpine

WORKDIR /app

COPY package*.json ./

RUN npm run build

COPY ./dist .

EXPOSE 80
