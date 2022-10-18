FROM node:lts-alpine AS build

RUN mkdir /app
WORKDIR /app

COPY package.json .
RUN npm install 

COPY . .

ENV REACT_APP_PRODUCTION production

RUN npm run build

#### NGINX FOR Single Page Application ####
FROM steebchen/nginx-spa

COPY --from=build /app/build /app

EXPOSE 80

ENTRYPOINT \
  sed -e "s|\\\${{REACT_APP_NODE_SERVER_URL}}\\\$|$REACT_APP_NODE_SERVER_URL|g" -i /app/static/js/main.* && \
  nginx