# Multi-stage build for React app
FROM node:18-alpine AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production
COPY client/ ./
RUN npm run build

# Backend setup
FROM node:18-alpine AS backend
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production
COPY backend/ ./backend/
COPY --from=frontend-build /app/client/build ./backend/public

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=backend /app/backend ./
EXPOSE 5000
CMD ["npm", "start"]
