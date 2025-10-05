# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./
# Use npm ci for faster, more reliable builds in CI/Docker environments
RUN npm ci

# Copy the rest of the application
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=768"
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/dist/inzynierka/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
