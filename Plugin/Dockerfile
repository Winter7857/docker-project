
# # Use a Node.js image
# FROM node:lts-alpine

# # Set the working directory
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install
# # RUN npm ci --only=production && npm cache clean --force
# # Copy the rest of the app
# COPY . .
# EXPOSE 50051
# CMD [ "node", "plugin.js" ]
FROM node:lts-alpine3.18
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
# Install dependency in production section only
RUN npm ci --only=production && npm cache clean --force
# Bundle app source
COPY . .
EXPOSE 50001
CMD [ "node", "plugin.js" ]