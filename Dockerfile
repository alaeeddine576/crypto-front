# Étape 1 : Build de l'application Angular
FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --force
COPY . .
RUN npm run build --prod

# Étape 2 : Serveur Nginx
FROM nginx:alpine
COPY --from=build /app/dist/cypto-exchanger /usr/share/nginx/html
EXPOSE 80
