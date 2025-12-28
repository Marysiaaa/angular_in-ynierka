# Stage 1: Build
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/inzynierka/browser /usr/share/nginx/html
# If you have a custom nginx.conf for SPA routing, copy it here:
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
