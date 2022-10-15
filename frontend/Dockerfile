FROM node:lts-alpine AS build

RUN mkdir /app
WORKDIR /app

COPY package.json .
RUN npm install 

COPY . .

ENV REACT_APP_PRODUCTION production

RUN export REACT_APP_PRODUCTION=production

RUN echo $REACT_APP_PRODUCTION

RUN npm run build

#### NGINX FOR Single Page Application ####
FROM steebchen/nginx-spa

ENV PRODUCTION production

COPY --from=build /app/build /app

EXPOSE 80

CMD ["nginx"]