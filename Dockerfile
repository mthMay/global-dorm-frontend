# Use an official Node.js runtime as the base image
FROM node:16 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port that the React development server runs on
EXPOSE 3000

# Command to start the React development server
CMD ["npm", "start", "--", "--host", "0.0.0.0"]

