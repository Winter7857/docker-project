# # Use a Node.js image
# FROM node:lts-alpine

# # Set the working directory
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# # RUN npm install
# RUN npm ci --only=production && npm cache clean --force
# ENV NODE_ENV=production

# # Copy the rest of the app
# COPY . .

# # Expose the application port
# EXPOSE 5000

# # Start the server
# CMD ["node", "server.js"]
FROM node:lts-alpine3.18
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
# Install dependency in production section only
RUN npm ci --only=production && npm cache clean –force
# Set environment variable to production
ENV NODE_ENV=production
# Bundle app source
COPY . .
EXPOSE 8000
CMD [ "node", "server.js" ]