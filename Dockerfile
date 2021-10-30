FROM node:alpine3.12

WORKDIR /myApp

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 3000

CMD ["node", "."]