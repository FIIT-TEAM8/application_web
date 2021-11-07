FROM node:alpine3.12

WORKDIR /myApp

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 8080

#CMD ["node", "."]

#RUN npm run deploy

CMD ['npm', 'run', 'deploy']