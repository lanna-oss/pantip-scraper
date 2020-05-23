FROM node:12.13-alpine
WORKDIR /home/yuck/pantip-scraper
ADD package*.json ./
RUN apk add --no-cache --virtual .gyp python make g++ \
    && yarn install \
    && apk del .gyp
ADD . .
CMD ["npm","run","start"]
EXPOSE 3000
