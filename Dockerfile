FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 8787

CMD ["node", "index.js"]
