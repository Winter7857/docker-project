# Use a Node.js image
FROM node:lts-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the application port
EXPOSE 3000

# Start the Next.js development server
CMD ["npm", "run", "dev"]


# FROM nginx:stable-bullseye
# COPY --from=build /app/build /opt/site
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# RUN touch /var/run/nginx.pid
# RUN chown -R nginx:nginx /var/run/nginx.pid /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d

# USER nginx
# EXPOSE 3000
# CMD ["nginx", "-g", "daemon off;"]
# Build stage
# FROM node:lts-alpine3.18 AS build
# WORKDIR /app
# COPY package.json package.json
# RUN npm install
# COPY . .
# RUN npm run build

# FROM nginx:stable-bullseye
# COPY --from=build /app/.next /opt/site
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# RUN touch /var/run/nginx.pid
# RUN chown -R nginx:nginx /var/run/nginx.pid /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d
# USER nginx
# EXPOSE 3000
# CMD ["nginx", "-g", "daemon off;"]
# Build stage


