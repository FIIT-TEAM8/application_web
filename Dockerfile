FROM node:18.8.0-buster

WORKDIR /myApp

RUN apt-get update

RUN apt-get install chromium -y

COPY package*.json ./

COPY ./ ./

EXPOSE 8080

#RUN npm install

RUN cd frontend && npm install

RUN cd backend && npm install

RUN cd frontend && npm run build

CMD cd backend && npm run deploy
#CMD npm run deploy