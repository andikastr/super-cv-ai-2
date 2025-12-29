# apps/backend/Dockerfile

# 1. Base Image
FROM node:18-alpine

# 2. Set Working Directory
WORKDIR /app

# 3. Install Dependencies
# Copy package files first to leverage Docker cache
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (including Prisma)
RUN npm install

# 4. Generate Prisma Client
# This creates the Type definitions for your DB Schema
RUN npx prisma generate

# 5. Copy Source Code
COPY . .

# 6. Build the Application
RUN npm run build

# 7. Expose Port
EXPOSE 3001

# 8. Start Command
# Using "migrate deploy" ensures DB is in sync before starting
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]