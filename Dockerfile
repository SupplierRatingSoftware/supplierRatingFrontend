# --- Stage 1: Build Angular ---
FROM node:20-alpine as build-stage

WORKDIR /app

# Dependencies installieren
COPY package*.json ./
RUN npm install

# Code kopieren und bauen
COPY . .
# Wir bauen für Production (nutzt environment.prod.ts)
RUN npx ng build --configuration=production

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# Das Build-Ergebnis von Stage 1 in den Nginx Ordner kopieren
# Pfad 'dist/supplierRatingFrontend/browser' kommt aus deinem angular.json
COPY --from=build-stage /app/dist/supplierRatingFrontend/browser /usr/share/nginx/html

# Unsere Nginx Config kopieren
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
