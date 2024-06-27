# Use the official Node.js 21 image from Docker Hub as the base image
FROM node:21

# Set the working directory in the Docker container to /app
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install the dependencies defined in package.json
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 4000 in the Docker container. This is the port that the application will use.
EXPOSE 4000

# Define the command that should be executed when the Docker container starts.
# In this case, "npm run start" will be executed.
CMD ["npm", "run", "start"]