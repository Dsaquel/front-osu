# Étape de construction
FROM node:19.6-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --no-verify --force

COPY . .

RUN npm run build

# Étape de production
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
