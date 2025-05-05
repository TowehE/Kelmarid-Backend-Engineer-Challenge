FROM node:16.17.0-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --production

# Copy app source code
COPY . .

# Install ALL dependencies 
RUN npm install

# Generate app key
RUN node ace generate:key

# Build app
RUN npm run build --production

# Verify the build output directory
RUN ls -la ./build || echo "Build directory not found"

# Copy .env to the build directory (if needed)
COPY ./.env ./build

# Expose port
EXPOSE 3333

# Start app with the correct path (adjust if needed)
CMD ["node", "./build/server.js"]