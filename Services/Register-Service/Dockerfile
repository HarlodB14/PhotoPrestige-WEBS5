FROM node:18-alpine

WORKDIR /app/Services/Register-Service

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 5007

CMD ["node", "index.js"]