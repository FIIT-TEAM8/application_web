FROM node:14-alpine3.12

WORKDIR /myApp

COPY package*.json ./

COPY ./ ./

EXPOSE 8080

RUN npm install

RUN cd frontend && npm install

RUN cd backend && npm install

RUN cd frontend && npm run build

CMD cd backend && npm run deploy