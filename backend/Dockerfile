# backend/Dockerfile
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY src/ ./src/

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]