FROM node:22-slim

WORKDIR /frontend

COPY package*.json .

RUN npm install

COPY . .

CMD ["npm", "start"]
