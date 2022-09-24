FROM fiitteam8/node_with_chromium:1.0.0

WORKDIR /myApp

COPY package*.json ./

RUN npm install

COPY ./ ./

EXPOSE 8080

CMD npm run deploy

