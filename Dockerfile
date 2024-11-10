# Use Node.js LTS version
FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy app source
COPY . .

# Create configs directory
RUN mkdir -p configs

# Expose the port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]