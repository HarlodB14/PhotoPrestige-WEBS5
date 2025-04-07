# Use official Node.js image
FROM node:18-alpine

#WORKDIR
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5006

CMD ["node", "index.js"]