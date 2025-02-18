FROM node:latest

# Set the working directory
WORKDIR /app
COPY package*.json ./
RUN npm install 
RUN npm install googleapis google-auth-library
COPY . .

# Expose the port that the app listens on
EXPOSE 8080

# Define the command to run the app
CMD [ "node", "index.js" ]





