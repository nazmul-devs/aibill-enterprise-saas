FROM node:22-slim

# Prisma needs openssl
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install packages first (Docker caches this step)
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Generate the Prisma client and build TypeScript
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

# Default command: start the API
CMD ["node", "dist/server.js"]
