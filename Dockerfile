FROM node:19
 
# WORKDIR /backend/api
 
# COPY . .
 
# RUN npm install --legacy-peer-deps
 
# EXPOSE 3000
 
# CMD ["npm","run", "start:prod"]

WORKDIR /backend/api

# Copy package.json and package-lock.json separately to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build TypeScript files
RUN npm run build

EXPOSE 3000

# Run the production server
CMD ["npm", "run", "start:prod"]
