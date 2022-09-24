FROM node:lts-alpine AS build

RUN mkdir /app
WORKDIR /app

COPY package.json .
RUN npm install 

COPY . .
RUN npm run build

#### NGINX FOR Single Page Application ####
FROM steebchen/nginx-spa

COPY --from=build /app/build /app

EXPOSE 80

CMD ["nginx"]