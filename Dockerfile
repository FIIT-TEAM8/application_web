FROM node14:alpine3.12

WORKDIR /myApp

COPY package*.json ./

COPY ./ ./

RUN npm install

RUN cd frontend && npm install

RUN cd backend && npm install

EXPOSE 8080

RUN cd frontend && npm run build

#CMD ["node", "."]

#RUN npm run deploy

CMD cd backend && npm run deploy