# Stage 1: Build the Angular application
FROM node:20.10.0 AS build
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application files
COPY . .

# Build the Angular application in production mode
RUN npx ng build --configuration production

# Stage 2: Serve the application using Nginx
FROM nginx:alpine AS final

ENV NGINX_PORT=8080

# Remove existing files in the destination
RUN rm -rf /usr/share/nginx/html/*

# Copy the built artifacts from the build stage to the Nginx public directory
COPY --from=build /app/dist/my-app/browser/ /usr/share/nginx/html

# Expose port NGINX_PORT for the Nginx server
EXPOSE $NGINX_PORT

# Copy the Nginx configuration template from the build stage
COPY --from=build /app/nginx.conf.template /etc/nginx/templates/
# The default command to start Nginx and serve the application
COPY start-nginx.sh /start-nginx.sh
RUN chmod +x /start-nginx.sh

CMD ["/start-nginx.sh"]

