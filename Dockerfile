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

# Remove existing files in the destination
RUN rm -rf /usr/share/nginx/html/*

# Copy the Nginx configuration from the build stage
COPY --from=build /app/nginx.conf /etc/nginx/
# Copy the built artifacts from the build stage to the Nginx public directory
COPY --from=build /app/dist/my-app/browser/ /usr/share/nginx/html

# Expose port 8080 for the Nginx server
EXPOSE 8080

# The default command to start Nginx and serve the application
CMD ["nginx", "-g", "daemon off;"]
