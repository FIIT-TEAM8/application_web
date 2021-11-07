FROM node:14-alpine3.12

WORKDIR /myApp

COPY package*.json ./

COPY ./ ./

EXPOSE 8080

RUN npm install

CMD npm run deploy