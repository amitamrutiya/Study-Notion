# # Description: Dockerfile for the frontend

FROM node:21

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "preview" ]