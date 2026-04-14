# Base image
FROM node:22

# Set working directory inside container
WORKDIR /app

# Copy entire project into container
COPY . .

# Install backend dependencies
RUN cd server && npm install

# Install frontend dependencies + build React
RUN cd client && npm install && npm run build

# Expose your server port
EXPOSE 5002

# Start the backend server
CMD ["node", "server/server.js"]