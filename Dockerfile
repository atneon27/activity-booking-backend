# node alpine image
FROM node:23-alpine

# set working directory
WORKDIR /app

# install python3 and make for bcrypt
RUN apk add --no-cache python3 make g++

# copy package.json and package-lock.json to working directory
COPY package*.json ./
RUN npm install

# copy the rest of the files to working directory
COPY . .

# transpile typescript files
RUN npm run build
EXPOSE 3000

# start the server
CMD ["node", "dist/index.js"]